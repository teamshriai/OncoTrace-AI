#!/usr/bin/env bash
# Provisions the local reference databases the analysis pipeline annotates
# against. Run once per machine (and again when you want to refresh a release).
# Never invoked at request time -- the API only reads what this has written.
#
# Usage:
#   ./scripts/download_references.sh clinvar-grch38
#   ./scripts/download_references.sh civic
#   ./scripts/download_references.sh snpeff-grch38
#   ./scripts/download_references.sh reference-grch38
#   ./scripts/download_references.sh all-grch38
#
# Sizes (approximate, download + unpacked):
#   clinvar     ~100 MB     (NCBI, public domain)
#   civic       ~15 MB      (CIViC, CC0)
#   snpeff db   ~1.5 GB     (SnpEff pre-built genome database)
#   reference   ~1 GB gz / ~3 GB unpacked  (Ensembl primary assembly FASTA)

set -euo pipefail

SERVER_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RES="${ONCOTRACE_RESOURCES:-$SERVER_ROOT/resources}"
SNPEFF_VERSION="5_2"
SNPEFF_DB_GRCH38="GRCh38.105"
SNPEFF_DB_GRCH37="GRCh37.75"

mkdir -p "$RES"/{snpeff,clinvar,civic,reference,panel}

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing required tool: $1" >&2; exit 1; }; }

# Re-downloading multi-GB reference data that's already on disk wastes a lot of
# time, so every step checks first. Set FORCE=1 to re-download anyway.
FORCE="${FORCE:-0}"

already_have() {
  local label="$1"; shift
  if [ "$FORCE" = "1" ]; then
    return 1
  fi
  for f in "$@"; do
    [ -s "$f" ] || return 1
  done
  echo "==> ${label}: already provisioned, skipping. (FORCE=1 to re-download.)"
  for f in "$@"; do
    echo "    $(du -h "$f" | cut -f1)  $f"
  done
  return 0
}

# `-C -` resumes a partial transfer instead of restarting from zero, so an
# interrupted multi-hundred-MB download isn't lost.
fetch() {
  local url="$1" dest="$2"
  curl -fL --retry 3 --retry-delay 2 -C - -o "$dest" "$url"
}

download_clinvar() {
  # Separate statements: `local` expands all its arguments before assigning any,
  # so `local a="$1" b="${a}"` would leave b empty (and trip `set -u`).
  local build="$1"
  local dest="$RES/clinvar/clinvar_${build}.vcf.gz"
  need curl; need tabix
  already_have "ClinVar ${build}" "$dest" "${dest}.tbi" && return 0
  echo "==> ClinVar ${build}"
  # Download to .part and rename only on success -- the API treats the presence
  # of the .tbi index as "provisioned", so a partial download must never leave a
  # usable-looking .vcf.gz behind. An interrupted transfer resumes on re-run.
  fetch "https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_${build}/clinvar.vcf.gz" "${dest}.part"
  mv "${dest}.part" "$dest"
  fetch "https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_${build}/clinvar.vcf.gz.tbi" "${dest}.tbi.part" \
    && mv "${dest}.tbi.part" "${dest}.tbi" \
    || { rm -f "${dest}.tbi.part"; tabix -p vcf "$dest"; }
  # Record the exact release so every API response can cite which snapshot
  # produced a given call.
  local release
  release="$(zcat "$dest" | head -50 | grep -m1 '^##fileDate=' | cut -d= -f2 || true)"
  echo "clinvar ${build} fileDate=${release:-unknown} retrieved=$(date -u +%Y-%m-%d)" \
    > "$RES/clinvar/RELEASE.txt"
  echo "    done: $dest"
}

download_civic() {
  need curl
  already_have "CIViC evidence" "$RES/civic/civic_evidence.tsv" "$RES/civic/RELEASE.txt" && return 0
  echo "==> CIViC evidence + variant coordinate summaries"
  local ev="$RES/civic/_raw_evidence.tsv"
  local vs="$RES/civic/_raw_variants.tsv"
  fetch "https://civicdb.org/downloads/nightly/nightly-ClinicalEvidenceSummaries.tsv" "$ev"
  fetch "https://civicdb.org/downloads/nightly/nightly-VariantSummaries.tsv" "$vs"
  # CIViC splits what we need across two files: evidence rows carry the clinical
  # claim but no gene/coordinates, and variant rows carry gene + coordinates but
  # no evidence. They join on molecular_profile_id.
  python3 - "$ev" "$vs" "$RES/civic/civic_evidence.tsv" <<'PY'
import csv, sys
ev_path, vs_path, dst = sys.argv[1], sys.argv[2], sys.argv[3]

def read(path):
    with open(path, newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh, delimiter="\t"))

variants = read(vs_path)
by_mp = {}
for v in variants:
    mp_id = (v.get("single_variant_molecular_profile_id") or "").strip()
    if mp_id:
        by_mp[mp_id] = v

COLS = ["gene", "variant", "disease", "drugs", "evidence_level", "clinical_significance",
        "evidence_id", "citation_id", "evidence_type", "evidence_direction",
        "chromosome", "start", "reference_bases", "variant_bases", "coordinate_build"]

rows, with_coords = [], 0
for e in read(ev_path):
    if (e.get("evidence_status") or "").strip().lower() not in ("accepted", ""):
        continue  # skip rejected/submitted-but-unreviewed evidence
    mp_id = (e.get("molecular_profile_id") or "").strip()
    v = by_mp.get(mp_id, {})
    chrom = (v.get("chromosome") or "").strip()
    start = (v.get("start") or "").strip()
    ref = (v.get("reference_bases") or "").strip()
    alt = (v.get("variant_bases") or "").strip()
    has_coords = all([chrom, start, ref, alt])
    if has_coords:
        with_coords += 1
    rows.append({
        "gene": (v.get("gene") or "").strip(),
        "variant": (v.get("variant") or e.get("molecular_profile") or "").strip(),
        "disease": (e.get("disease") or "").strip(),
        "drugs": (e.get("therapies") or "").strip(),
        "evidence_level": (e.get("evidence_level") or "").strip(),
        "clinical_significance": (e.get("significance") or "").strip(),
        "evidence_id": (e.get("evidence_id") or "").strip(),
        "citation_id": (e.get("citation_id") or "").strip(),
        "evidence_type": (e.get("evidence_type") or "").strip(),
        "evidence_direction": (e.get("evidence_direction") or "").strip(),
        "chromosome": chrom,
        "start": start,
        "reference_bases": ref,
        "variant_bases": alt,
        # CIViC's coordinates are overwhelmingly GRCh37. Recording the build per
        # row lets the matcher refuse a cross-build coordinate match instead of
        # silently comparing GRCh37 positions against a GRCh38 sample.
        "coordinate_build": (v.get("reference_build") or "").strip(),
    })

with open(dst, "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=COLS, delimiter="\t")
    w.writeheader()
    w.writerows(rows)
genes = len({r["gene"] for r in rows if r["gene"]})
print(f"    {len(rows)} evidence rows ({with_coords} coordinate-resolved), {genes} distinct genes -> {dst}")
PY
  echo "civic nightly retrieved=$(date -u +%Y-%m-%d)" > "$RES/civic/RELEASE.txt"
  rm -f "$ev" "$vs"
}

download_snpeff() {
  local db="$1"
  need curl; need unzip; need java
  already_have "SnpEff ${db}" "$RES/snpeff/snpEff.jar" "$RES/snpeff/data/${db}/snpEffectPredictor.bin" && return 0
  echo "==> SnpEff core + ${db} database"
  if [ ! -f "$RES/snpeff/snpEff.jar" ]; then
    fetch "https://snpeff-public.s3.amazonaws.com/versions/snpEff_v${SNPEFF_VERSION}_core.zip" /tmp/snpEff.zip
    unzip -q -o /tmp/snpEff.zip -d /tmp/snpeff_extract
    cp /tmp/snpeff_extract/snpEff/snpEff.jar "$RES/snpeff/"
    cp /tmp/snpeff_extract/snpEff/snpEff.config "$RES/snpeff/"
    # The shipped config still points database.repository/versions.url at the
    # retired Azure blob host; SnpEff migrated database hosting to S3 without
    # updating snpEff.config, which otherwise makes every `download` 404.
    sed -i 's#https://snpeff\.blob\.core\.windows\.net/databases/#https://snpeff-public.s3.amazonaws.com/databases/#' \
      "$RES/snpeff/snpEff.config"
    rm -rf /tmp/snpEff.zip /tmp/snpeff_extract
  fi
  mkdir -p "$RES/snpeff/data"
  java -jar "$RES/snpeff/snpEff.jar" download -dataDir "$RES/snpeff/data" "$db"
  echo "    done: $RES/snpeff/data/$db"
}

download_reference() {
  local build="$1"
  need curl
  local dest="$RES/reference/${build}.fa"
  already_have "Reference FASTA ${build}" "$dest" "${dest}.fai" && return 0
  echo "==> Reference FASTA ${build} (large: ~1 GB compressed, ~3 GB unpacked)"
  local url
  if [ "$build" = "GRCh38" ]; then
    url="https://ftp.ensembl.org/pub/release-110/fasta/homo_sapiens/dna/Homo_sapiens.GRCh38.dna.primary_assembly.fa.gz"
  else
    url="https://ftp.ensembl.org/pub/grch37/release-110/fasta/homo_sapiens/dna/Homo_sapiens.GRCh37.dna.primary_assembly.fa.gz"
  fi
  fetch "$url" "${dest}.gz"
  need bgzip; need samtools
  # bcftools norm needs a plain or bgzip-compressed FASTA with a .fai index.
  gunzip -f "${dest}.gz"
  samtools faidx "$dest"
  echo "    done: $dest"
}

download_gene_spans() {
  local build="$1"
  need curl
  local dest="$RES/panel/gene_spans_${build}.bed"
  already_have "Gene spans ${build}" "$dest" && return 0
  echo "==> Gene-coordinate BED ${build} (for panel footprint estimation)"
  local url
  # UCSC refGene: gene-level spans. Used only to ESTIMATE a panel footprint when
  # no real capture BED is available -- gene spans include introns, so the
  # estimate is deliberately labelled as such wherever it surfaces.
  if [ "$build" = "GRCh38" ]; then
    url="https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/refGene.txt.gz"
  else
    url="https://hgdownload.soe.ucsc.edu/goldenPath/hg19/database/refGene.txt.gz"
  fi
  fetch "$url" "${dest}.raw.gz"
  # refGene columns: bin(1) name(2) chrom(3) strand(4) txStart(5) txEnd(6) ... name2(13)
  zcat "${dest}.raw.gz" \
    | awk -F'\t' 'BEGIN{OFS="\t"} $3 !~ /_/ {sub(/^chr/,"",$3); print $3, $5, $6, $13}' \
    | sort -k1,1 -k2,2n > "${dest}.part"
  mv "${dest}.part" "$dest"
  rm -f "${dest}.raw.gz"
  echo "    done: $dest ($(wc -l < "$dest") transcript spans)"
}

case "${1:-}" in
  clinvar-grch38)    download_clinvar GRCh38 ;;
  gene-spans-grch38) download_gene_spans GRCh38 ;;
  gene-spans-grch37) download_gene_spans GRCh37 ;;
  clinvar-grch37)    download_clinvar GRCh37 ;;
  civic)             download_civic ;;
  snpeff-grch38)     download_snpeff "$SNPEFF_DB_GRCH38" ;;
  snpeff-grch37)     download_snpeff "$SNPEFF_DB_GRCH37" ;;
  reference-grch38)  download_reference GRCh38 ;;
  reference-grch37)  download_reference GRCh37 ;;
  all-grch38)
    download_civic
    download_clinvar GRCh38
    download_gene_spans GRCh38
    download_snpeff "$SNPEFF_DB_GRCH38"
    download_reference GRCh38
    ;;
  # Both ClinVar builds enable empirical build detection: the pipeline probes a
  # file's coordinates against each and picks whichever actually matches.
  build-detection)
    download_clinvar GRCh38
    download_clinvar GRCh37
    ;;
  *)
    sed -n '2,20p' "${BASH_SOURCE[0]}"
    exit 1
    ;;
esac

echo "All requested resources provisioned under $RES"
