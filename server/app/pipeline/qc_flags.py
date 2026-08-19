"""Artifact & QC flagging layer (spec §4).

Runs BEFORE any clinical annotation, and produces its own independent output
block. A variant can be simultaneously "ClinVar: Pathogenic" and
"QC: contamination_candidate" -- both are reported; neither overrides the other.

Every flag records *why* it fired, in terms a reviewer can re-check against the
raw INFO fields, rather than an opaque "suspicious".

Deliberately does not trust the caller's own FILTER: a PASS contaminant was
observed in real data, so cross-locus artifact detection runs on every record
regardless of filter status.
"""

import re
from collections import defaultdict

from ..core import constants as C

# ---------------------------------------------------------------- §4a motifs

# Minimum shared-substring length to call a cross-locus artifact. 12bp is long
# enough that recurrence at unrelated loci is not plausibly biological.
CONTAMINANT_MIN_MOTIF = 12
# Same-chromosome records must be at least this far apart to count as "unrelated"
# -- nearby records can legitimately share sequence (same repeat, same event).
CONTAMINANT_MIN_DISTANCE = 1_000_000


def _novel_sequence(v) -> str:
    """The sequence a record introduces. For an insertion or complex
    substitution that's the ALT; symbolic ALTs carry no sequence at all."""
    if v.is_symbolic:
        return ""
    alt = (v.alt or "").upper()
    return alt if set(alt) <= set("ACGTN") else ""


def _longest_common_substring(a: str, b: str) -> str:
    if not a or not b:
        return ""
    # Standard DP; sequences here are short (tens of bp), so this is cheap.
    best_len, best_end = 0, 0
    prev = [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        cur = [0] * (len(b) + 1)
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                cur[j] = prev[j - 1] + 1
                if cur[j] > best_len:
                    best_len, best_end = cur[j], i
        prev = cur
    return a[best_end - best_len:best_end]


def detect_cross_locus_contaminants(variants) -> dict[int, dict]:
    """Finds records sharing a >=12bp exact substring across unrelated loci.

    Returns {variant_index: {"motif": str, "partners": [locus strings]}}.
    """
    seqs = {i: _novel_sequence(v) for i, v in enumerate(variants)}
    candidates = {i: s for i, s in seqs.items() if len(s) >= CONTAMINANT_MIN_MOTIF}

    # Index k-mers -> record indices, then group records sharing any k-mer.
    kmer_to_idx: dict[str, set[int]] = defaultdict(set)
    for idx, seq in candidates.items():
        for start in range(len(seq) - CONTAMINANT_MIN_MOTIF + 1):
            kmer_to_idx[seq[start:start + CONTAMINANT_MIN_MOTIF]].add(idx)

    def unrelated(i, j) -> bool:
        a, b = variants[i], variants[j]
        if a.chrom.replace("chr", "") != b.chrom.replace("chr", ""):
            return True
        return abs(a.pos - b.pos) > CONTAMINANT_MIN_DISTANCE

    # Union-find over records linked by a shared k-mer at unrelated loci.
    parent = {i: i for i in candidates}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        rx, ry = find(x), find(y)
        if rx != ry:
            parent[ry] = rx

    for indices in kmer_to_idx.values():
        idx_list = sorted(indices)
        for a_i in range(len(idx_list)):
            for b_i in range(a_i + 1, len(idx_list)):
                if unrelated(idx_list[a_i], idx_list[b_i]):
                    union(idx_list[a_i], idx_list[b_i])

    clusters: dict[int, list[int]] = defaultdict(list)
    for idx in candidates:
        clusters[find(idx)].append(idx)

    out: dict[int, dict] = {}
    for members in clusters.values():
        if len(members) < 2:
            continue

        # Cluster membership is established PAIRWISE -- requiring one motif common
        # to every member would discard a real cluster whose members each share
        # >=12bp with some other member but overlap less across the whole group.
        # The reported motif is the longest this record shares with any partner.
        member_kmers = {
            idx: {seqs[idx][s:s + CONTAMINANT_MIN_MOTIF]
                  for s in range(len(seqs[idx]) - CONTAMINANT_MIN_MOTIF + 1)}
            for idx in members
        }
        # A representative motif for the cluster: the LONGEST sequence shared by any
        # two members. Reporting the longest (rather than a minimal 12-mer) gives a
        # reviewer something recognizable to check against adapter/index sequences.
        representative = ""
        for a_i in range(len(members)):
            for b_i in range(a_i + 1, len(members)):
                shared = _longest_common_substring(seqs[members[a_i]], seqs[members[b_i]])
                if len(shared) > len(representative):
                    representative = shared

        for idx in members:
            partners, longest_shared = [], ""
            for other in members:
                if other == idx:
                    continue
                shared = _longest_common_substring(seqs[idx], seqs[other])
                if len(shared) >= CONTAMINANT_MIN_MOTIF or member_kmers[idx] & member_kmers[other]:
                    partners.append(
                        f"{variants[other].chrom}:{variants[other].pos}"
                        + (f" ({variants[other].gene})" if variants[other].gene else "")
                    )
                if len(shared) > len(longest_shared):
                    longest_shared = shared
            out[idx] = {
                "motif": longest_shared,
                "cluster_representative_motif": representative,
                "partners": partners,
                "cluster_size": len(members),
            }
    return out


# ------------------------------------------------- §4b microsatellite context

MSI_FLAG_MIN = 8
HOMOPOLYMER_MIN = 10


def _homopolymer_run_length(seq: str) -> int:
    if not seq:
        return 0
    return max((len(m.group(0)) for m in re.finditer(r"(A+|C+|G+|T+)", seq.upper())), default=0)


def microsatellite_context(v) -> dict | None:
    """Flags records in homopolymer/microsatellite context, where indel calling
    is unreliable. Uses the caller's MSI field when present, otherwise the
    flanking sequence."""
    if v.msi is not None and v.msi >= MSI_FLAG_MIN:
        return {"reason": f"caller MSI field = {v.msi} (>= {MSI_FLAG_MIN})", "basis": "msi_field",
                "msi": v.msi}

    runs = [_homopolymer_run_length(s) for s in (v.lseq, v.rseq, v.ref, v.alt) if s]
    longest = max(runs, default=0)
    if longest >= HOMOPOLYMER_MIN:
        return {"reason": f"homopolymer run of {longest}bp in the variant or its flanking sequence "
                          f"(>= {HOMOPOLYMER_MIN})",
                "basis": "flanking_sequence", "homopolymer_length": longest}
    return None


# ------------------------------------------------- §4c hypervariable regions

# Chronic mismapping / hypervariable loci. Coordinates are GRCh38; GRCh37 spans
# are listed separately because these regions moved between builds.
HYPERVARIABLE_REGIONS = {
    "GRCh38": [
        ("6", 29_600_000, 33_200_000, "HLA / MHC class I & II"),
        ("14", 105_550_000, 106_900_000, "IGH locus (immunoglobulin heavy chain)"),
        ("2", 88_800_000, 90_300_000, "IGK locus (immunoglobulin kappa)"),
        ("22", 22_000_000, 22_950_000, "IGL locus (immunoglobulin lambda)"),
        ("14", 21_600_000, 22_600_000, "TRA/TRD locus (T-cell receptor alpha/delta)"),
        ("7", 142_290_000, 142_820_000, "TRB locus (T-cell receptor beta)"),
        ("19", 54_700_000, 55_200_000, "KIR cluster"),
    ],
    "GRCh37": [
        ("6", 29_600_000, 33_200_000, "HLA / MHC class I & II"),
        ("14", 106_000_000, 107_400_000, "IGH locus (immunoglobulin heavy chain)"),
        ("2", 89_100_000, 90_600_000, "IGK locus (immunoglobulin kappa)"),
        ("22", 22_350_000, 23_300_000, "IGL locus (immunoglobulin lambda)"),
        ("14", 22_050_000, 23_050_000, "TRA/TRD locus (T-cell receptor alpha/delta)"),
        ("7", 141_990_000, 142_520_000, "TRB locus (T-cell receptor beta)"),
        ("19", 55_200_000, 55_700_000, "KIR cluster"),
    ],
}

# Gene-symbol fallback: catches these loci even when coordinates are unavailable
# or the build is unconfirmed.
HYPERVARIABLE_GENE_PREFIXES = ("HLA-", "IGH", "IGK", "IGL", "TRA", "TRB", "TRD", "TRG", "KIR")


def hypervariable_region(v, build: str | None) -> dict | None:
    gene = (v.gene or "").upper()
    if gene.startswith(HYPERVARIABLE_GENE_PREFIXES):
        return {"reason": f"gene {v.gene} is in a hypervariable / rearranging locus",
                "basis": "gene_symbol", "locus": gene}

    if build:
        chrom = v.chrom.replace("chr", "")
        for rchrom, start, end, label in HYPERVARIABLE_REGIONS.get(build, []):
            if chrom == rchrom and start <= v.pos <= end:
                return {"reason": f"position {chrom}:{v.pos} falls in {label} ({build} {start}-{end})",
                        "basis": "coordinate_range", "locus": label}
    return None


# ------------------------------------------ §4d duplicate SV representations

SV_BREAKPOINT_TOLERANCE = 50
SV_LENGTH_TOLERANCE = 0.10


def _sv_support(v) -> int:
    if v.splitread is not None or v.spanpair is not None:
        return (v.splitread or 0) + (v.spanpair or 0)
    return v.alt_reads or 0


def collapse_duplicate_svs(variants) -> tuple[dict[int, dict], dict[int, dict]]:
    """Clusters SV records describing one event.

    Returns (duplicates, retained_extra) where `duplicates` maps the index of
    each superseded record to its reason, and `retained_extra` maps the kept
    record's index to the evidence from the records it absorbed -- so the
    discarded AFs remain visible rather than being silently deleted.
    """
    sv_indices = [i for i, v in enumerate(variants) if v.svtype]
    used: set[int] = set()
    duplicates: dict[int, dict] = {}
    retained_extra: dict[int, dict] = {}

    for a_pos, i in enumerate(sv_indices):
        if i in used:
            continue
        group = [i]
        for j in sv_indices[a_pos + 1:]:
            if j in used:
                continue
            a, b = variants[i], variants[j]
            if a.svtype != b.svtype:
                continue
            if a.chrom.replace("chr", "") != b.chrom.replace("chr", ""):
                continue
            if abs(a.pos - b.pos) > SV_BREAKPOINT_TOLERANCE:
                continue
            if a.svlen and b.svlen:
                longer = max(a.svlen, b.svlen)
                if abs(a.svlen - b.svlen) / longer > SV_LENGTH_TOLERANCE:
                    continue
            group.append(j)

        if len(group) < 2:
            continue

        keeper = max(group, key=lambda idx: _sv_support(variants[idx]))
        absorbed = [idx for idx in group if idx != keeper]
        used.update(group)

        for idx in absorbed:
            v = variants[idx]
            k = variants[keeper]
            duplicates[idx] = {
                "reason": (
                    f"same {v.svtype} event as {k.chrom}:{k.pos} "
                    f"(breakpoints {abs(v.pos - k.pos)}bp apart, SVLEN {v.svlen} vs {k.svlen}); "
                    f"that record has higher support ({_sv_support(k)} vs {_sv_support(v)} reads)"
                ),
                "superseded_by": f"{k.chrom}:{k.pos}",
            }
        retained_extra[keeper] = {
            "collapsed_duplicate_count": len(absorbed),
            "absorbed_records": [
                {
                    "locus": f"{variants[idx].chrom}:{variants[idx].pos}",
                    "vaf": variants[idx].vaf,
                    "svlen": variants[idx].svlen,
                    "support_reads": _sv_support(variants[idx]),
                }
                for idx in absorbed
            ],
        }
    return duplicates, retained_extra


# ------------------------------------------------ §4e composite QC flagging

MQ_MIN = 50
NM_MAX = 4.0
SBF_P_MAX = 0.001
SBF_ODDRATIO_EXTREME = 5.0
PMEAN_MAX = 60.0
PMEAN_MIN = 10.0
COMPLEX_LENGTH_MAX = 10

# Two independent flags are required before a variant's confidence tier is
# downgraded; one flag annotates without downgrading.
DOWNGRADE_FLAG_THRESHOLD = 2


def composite_qc_flags(v) -> list[dict]:
    flags: list[dict] = []

    if v.mq is not None and v.mq < MQ_MIN:
        flags.append({"flag": "low_mapping_quality",
                      "reason": f"MQ {v.mq} < {MQ_MIN}"})

    if v.nm is not None and v.nm >= NM_MAX:
        flags.append({"flag": "high_read_mismatch",
                      "reason": f"mean mismatches NM {v.nm} >= {NM_MAX}"})

    if v.sbf is not None and v.sbf < SBF_P_MAX:
        # An odds ratio of exactly 0 means all support came from one strand.
        if v.oddratio is not None and (v.oddratio >= SBF_ODDRATIO_EXTREME or v.oddratio == 0):
            flags.append({
                "flag": "strand_bias",
                "reason": f"strand-bias Fisher p {v.sbf} < {SBF_P_MAX} with "
                          f"{'odds ratio 0 (all support on one strand)' if v.oddratio == 0 else f'odds ratio {v.oddratio} >= {SBF_ODDRATIO_EXTREME}'}",
            })

    if v.pmean is not None and (v.pmean > PMEAN_MAX or v.pmean < PMEAN_MIN):
        flags.append({
            "flag": "read_position_bias",
            "reason": f"mean distance to read end PMEAN {v.pmean} outside {PMEAN_MIN}-{PMEAN_MAX}",
        })

    if (v.type or "").lower() == "complex" and not v.is_symbolic:
        longest = max(len(v.ref or ""), len(v.alt or ""))
        if longest > COMPLEX_LENGTH_MAX:
            flags.append({
                "flag": "long_complex_allele",
                "reason": f"complex substitution with allele length {longest}bp > {COMPLEX_LENGTH_MAX}",
            })

    return flags


# --------------------------------------------------------------- orchestration

def evaluate(variants, build: str | None) -> dict:
    """Runs every QC/artifact check and returns per-variant flags plus a summary.

    Output is keyed by variant index so it can be attached to the variant records
    without mutating them.
    """
    contaminants = detect_cross_locus_contaminants(variants)
    duplicates, retained_extra = collapse_duplicate_svs(variants)

    per_variant: dict[int, dict] = {}
    for i, v in enumerate(variants):
        flags: list[dict] = []

        if i in contaminants:
            c = contaminants[i]
            flags.append({
                "flag": "artifact_contamination_candidate",
                "reason": (
                    f"shares an exact {len(c['motif'])}bp inserted motif with {c['cluster_size'] - 1} "
                    f"other record(s) at unrelated loci: {', '.join(c['partners'])}"
                ),
                "motif": c["motif"],
                "partner_loci": c["partners"],
            })

        ms = microsatellite_context(v)
        if ms:
            flags.append({"flag": "microsatellite_or_homopolymer_context", **ms})

        hv = hypervariable_region(v, build)
        if hv:
            flags.append({"flag": "hypervariable_region", **hv})

        if i in duplicates:
            flags.append({"flag": "duplicate_representation", **duplicates[i]})

        flags.extend(composite_qc_flags(v))

        # Contamination and duplicate-representation are disqualifying on their
        # own; the composite metrics need corroboration before downgrading.
        composite_count = sum(
            1 for f in flags
            if f["flag"] in {"low_mapping_quality", "high_read_mismatch", "strand_bias",
                             "read_position_bias", "long_complex_allele"}
        )
        disqualifying = any(
            f["flag"] in {"artifact_contamination_candidate", "duplicate_representation"} for f in flags
        )
        downgraded = disqualifying or composite_count >= DOWNGRADE_FLAG_THRESHOLD

        per_variant[i] = {
            "flags": flags,
            "flag_names": [f["flag"] for f in flags],
            "composite_flag_count": composite_count,
            "confidence_downgraded": downgraded,
            "downgrade_reason": (
                "an artifact or duplicate-representation flag fired" if disqualifying else
                f"{composite_count} independent QC flags (>= {DOWNGRADE_FLAG_THRESHOLD})"
                if downgraded else None
            ),
            "collapsed_duplicates": retained_extra.get(i),
        }

    def count(flag_name):
        return sum(1 for r in per_variant.values() if flag_name in r["flag_names"])

    summary = {
        "contamination_candidates": count("artifact_contamination_candidate"),
        "contamination_clusters": len({c["cluster_representative_motif"] for c in contaminants.values()}),
        "contamination_motifs": sorted({c["cluster_representative_motif"] for c in contaminants.values()}),
        "microsatellite_context": count("microsatellite_or_homopolymer_context"),
        # Split by basis so the caller's own MSI field is distinguishable from our
        # flanking-sequence fallback.
        "microsatellite_by_msi_field": sum(
            1 for r in per_variant.values()
            for f in r["flags"]
            if f["flag"] == "microsatellite_or_homopolymer_context" and f.get("basis") == "msi_field"
        ),
        "microsatellite_by_flanking_sequence": sum(
            1 for r in per_variant.values()
            for f in r["flags"]
            if f["flag"] == "microsatellite_or_homopolymer_context" and f.get("basis") == "flanking_sequence"
        ),
        "hypervariable_region": count("hypervariable_region"),
        "duplicate_representation": count("duplicate_representation"),
        "low_mapping_quality": count("low_mapping_quality"),
        "high_read_mismatch": count("high_read_mismatch"),
        "strand_bias": count("strand_bias"),
        "read_position_bias": count("read_position_bias"),
        "long_complex_allele": count("long_complex_allele"),
        "confidence_downgraded": sum(1 for r in per_variant.values() if r["confidence_downgraded"]),
        "thresholds": {
            "contaminant_min_motif_bp": CONTAMINANT_MIN_MOTIF,
            "contaminant_min_locus_distance_bp": CONTAMINANT_MIN_DISTANCE,
            "msi_flag_min": MSI_FLAG_MIN,
            "homopolymer_min_bp": HOMOPOLYMER_MIN,
            "mq_min": MQ_MIN,
            "nm_max": NM_MAX,
            "strand_bias_p_max": SBF_P_MAX,
            "pmean_range": [PMEAN_MIN, PMEAN_MAX],
            "complex_allele_max_bp": COMPLEX_LENGTH_MAX,
            "flags_required_to_downgrade": DOWNGRADE_FLAG_THRESHOLD,
        },
        "note": C.QC_LAYER_NOTE,
    }
    return {"per_variant": per_variant, "summary": summary}
