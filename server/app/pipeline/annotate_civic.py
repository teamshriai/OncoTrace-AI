"""CIViC actionability annotation from a locally cached bulk export. Loaded
once at process start; refreshed only by scripts/download_references.sh, never
at request time.

Two-tier match, and the tier is always surfaced:
  - "variant": exact coordinate match to a curated CIViC variant
  - "gene":    the gene has curated evidence, but NOT confirmed for this exact
               variant (CIViC curates named variants like "BRAF V600E", not
               every coordinate in a gene)
  - "none":    no evidence found -- the common, correct outcome for most genes
               on a broad panel, and displayed as such rather than hidden.
"""

import csv
import sqlite3
from collections import defaultdict
from pathlib import Path


# CIViC evidence levels, strongest first. A therapy is only surfaced as a
# recommendation at or above the floor -- preclinical (D) and inferential (E)
# evidence must not be presented as if it were a treatment recommendation.
EVIDENCE_LEVEL_RANK = {"A": 5, "B": 4, "C": 3, "D": 2, "E": 1}
EVIDENCE_LEVEL_LABELS = {
    "A": "A - validated association",
    "B": "B - clinical evidence",
    "C": "C - case study",
    "D": "D - preclinical evidence",
    "E": "E - inferential association",
}
DEFAULT_EVIDENCE_FLOOR = "C"


def evidence_rank(level: str | None) -> int:
    return EVIDENCE_LEVEL_RANK.get((level or "").strip().upper(), 0)


def meets_evidence_floor(level: str | None, floor: str = DEFAULT_EVIDENCE_FLOOR) -> bool:
    return evidence_rank(level) >= evidence_rank(floor)


class CivicCache:
    def __init__(self, db_path: str | None, release: str = "not loaded"):
        self.release = release
        self._by_coord: dict[str, list[dict]] = defaultdict(list)
        self._by_gene: dict[str, list[dict]] = defaultdict(list)
        self.coordinate_builds: set[str] = set()
        self.loaded = False
        if db_path and Path(db_path).exists():
            self._load(db_path)

    def _load(self, db_path: str) -> None:
        path = Path(db_path)
        if path.suffix == ".sqlite":
            self._load_sqlite(path)
        else:
            self._load_tsv(path)
        self.loaded = True

    def _load_sqlite(self, path: Path) -> None:
        conn = sqlite3.connect(str(path))
        conn.row_factory = sqlite3.Row
        try:
            rows = conn.execute("SELECT * FROM civic_evidence").fetchall()
        finally:
            conn.close()
        for row in rows:
            self._index(dict(row))

    def _load_tsv(self, path: Path) -> None:
        with path.open(newline="", encoding="utf-8") as fh:
            for row in csv.DictReader(fh, delimiter="\t"):
                self._index(row)

    def _index(self, row: dict) -> None:
        entry = {
            "gene": (row.get("gene") or "").strip(),
            "variant": (row.get("variant") or "").strip(),
            "disease": (row.get("disease") or "").strip() or None,
            "drugs": [d.strip() for d in (row.get("drugs") or "").split(",") if d.strip()],
            "evidence_level": (row.get("evidence_level") or "").strip() or None,
            "clinical_significance": (row.get("clinical_significance") or "").strip() or None,
            "evidence_id": (row.get("evidence_id") or "").strip() or None,
            "citation": (row.get("citation_id") or row.get("citation") or "").strip() or None,
        }
        if entry["gene"]:
            self._by_gene[entry["gene"].upper()].append(entry)
        chrom = (row.get("chromosome") or "").strip().replace("chr", "")
        start = (row.get("start") or "").strip()
        ref = (row.get("reference_bases") or "").strip()
        alt = (row.get("variant_bases") or "").strip()
        build = (row.get("coordinate_build") or "").strip()
        if chrom and start and ref and alt and build:
            self._by_coord[f"{build}:{chrom}:{start}:{ref}:{alt}"].append(entry)
            self.coordinate_builds.add(build)

    def lookup(self, chrom: str, pos: int, ref: str, alt: str, gene: str | None,
               sample_build: str | None = None) -> dict:
        if not self.loaded:
            return {"match_level": "none", "evidence": [], "reason": "civic_cache_not_provisioned"}

        # Only attempt a coordinate match when the sample's build matches the
        # build CIViC curated that coordinate against. CIViC's coordinates are
        # overwhelmingly GRCh37; comparing them against GRCh38 positions would
        # produce silently wrong matches, so a build mismatch falls through to
        # gene-level with an explicit reason rather than pretending to check.
        coord_checked = False
        if sample_build and sample_build in self.coordinate_builds:
            coord_checked = True
            coord_key = f"{sample_build}:{chrom.replace('chr', '')}:{pos}:{ref}:{alt}"
            coord_hits = self._by_coord.get(coord_key)
            if coord_hits:
                return {"match_level": "variant", "evidence": coord_hits, "reason": None}

        if gene:
            gene_hits = self._by_gene.get(gene.upper())
            if gene_hits:
                reason = "gene_has_curated_evidence_but_not_confirmed_for_this_variant"
                if not coord_checked:
                    reason += (
                        f"; variant-level match not attempted because CIViC coordinates are curated "
                        f"against {sorted(self.coordinate_builds) or ['no build']} and this sample is "
                        f"{sample_build or 'an unknown build'} (no liftover is performed)"
                    )
                return {"match_level": "gene", "evidence": gene_hits, "reason": reason}

        return {"match_level": "none", "evidence": [], "reason": "no_civic_evidence_found"}


def annotate_variants(variants, snpeff_annotations: dict, cache: CivicCache,
                      sample_build: str | None = None,
                      evidence_floor: str = DEFAULT_EVIDENCE_FLOOR) -> dict:
    """Returns {variant_key: civic_dict}, splitting evidence into what does and
    does not meet the evidence floor so a therapy is never surfaced as a
    recommendation on preclinical/inferential support alone."""
    out = {}
    for v in variants:
        key = f"{v.chrom}:{v.pos}:{v.ref}:{v.alt}"
        gene = v.gene or (snpeff_annotations.get(key) or {}).get("gene")
        result = cache.lookup(v.chrom, v.pos, v.ref, v.alt, gene, sample_build)

        evidence = result.get("evidence") or []
        qualifying = [e for e in evidence if meets_evidence_floor(e.get("evidence_level"), evidence_floor)]
        below = [e for e in evidence if not meets_evidence_floor(e.get("evidence_level"), evidence_floor)]

        result["evidence_floor"] = evidence_floor
        result["evidence_floor_label"] = EVIDENCE_LEVEL_LABELS.get(evidence_floor, evidence_floor)
        result["qualifying_evidence_count"] = len(qualifying)
        result["below_floor_evidence_count"] = len(below)
        result["therapies_at_or_above_floor"] = sorted({
            d for e in qualifying for d in (e.get("drugs") or [])
        })
        result["meets_evidence_floor"] = bool(qualifying)
        if below and not qualifying:
            result["evidence_floor_note"] = (
                f"{len(below)} CIViC evidence item(s) exist for this gene but all fall below the "
                f"{evidence_floor} floor (preclinical/inferential only), so no therapy is surfaced "
                f"as a recommendation."
            )
        out[key] = result
    return out
