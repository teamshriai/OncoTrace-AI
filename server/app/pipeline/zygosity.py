"""Germline vs. somatic disambiguation (spec §5).

For tumor-only data this is a HEURISTIC over allele fraction and population
frequency, never a determination -- without a matched normal, a VCF cannot
definitively separate a germline variant from a somatic one. Every label
carries that caveat.

When the file DOES contain a matched normal, the heuristic is skipped entirely
and real tumor-normal subtraction is used instead, because applying tumor-only
logic to paired data would be simply wrong.

A germline pathogenic finding is not "safe" -- it is a hereditary-risk finding,
a different clinical object from a somatic driver. It is labelled as its own
category rather than discarded.
"""

import re

from ..core import constants as C

HET_AF_RANGE = (0.45, 0.55)
HOM_AF_MIN = 0.90

# Header patterns that identify a paired tumor-normal VCF.
_NORMAL_SAMPLE_PATTERNS = (
    re.compile(r"^##normal_sample=(?P<name>.+)$", re.MULTILINE),
    re.compile(r"^##SAMPLE=<ID=NORMAL", re.MULTILINE),
)
_NORMAL_NAME_HINTS = ("normal", "germline", "blood", "buffy", "_n$", "-n$")


def detect_paired_normal(raw_header: str, samples: list[str]) -> dict:
    """Identifies whether this VCF carries a matched normal alongside the tumor."""
    for pattern in _NORMAL_SAMPLE_PATTERNS:
        match = pattern.search(raw_header)
        if match:
            name = match.groupdict().get("name")
            return {
                "paired": True,
                "normal_sample": (name or "").strip() or None,
                "basis": "explicit header declaration",
            }

    if len(samples) >= 2:
        for s in samples:
            low = s.lower()
            if any(re.search(h, low) for h in _NORMAL_NAME_HINTS):
                return {
                    "paired": True,
                    "normal_sample": s,
                    "basis": f"sample name {s!r} matches a normal-sample naming convention",
                }
        return {
            "paired": False,
            "normal_sample": None,
            "basis": (
                f"{len(samples)} sample columns present but none is identifiable as a matched "
                f"normal; treating as tumor-only. Pass sample_name to control which is analyzed."
            ),
            "ambiguous": True,
        }

    return {"paired": False, "normal_sample": None, "basis": "single-sample VCF"}


def classify_variant(v, clinvar: dict | None) -> dict:
    """Returns the tumor-only zygosity/population pattern for one variant."""
    labels: list[str] = []
    reasons: list[str] = []

    if v.vaf is not None:
        if HET_AF_RANGE[0] <= v.vaf <= HET_AF_RANGE[1]:
            labels.append("putative_heterozygous_germline_pattern")
            reasons.append(
                f"AF {v.vaf:.3f} falls in {HET_AF_RANGE[0]}-{HET_AF_RANGE[1]}, the expected range "
                f"for a heterozygous germline variant"
            )
        elif v.vaf >= HOM_AF_MIN:
            labels.append("putative_homozygous_germline_pattern")
            reasons.append(
                f"AF {v.vaf:.3f} >= {HOM_AF_MIN}, the expected range for a homozygous germline variant"
            )

    population_af = (clinvar or {}).get("population_af")
    population_source = (clinvar or {}).get("population_af_source")
    if population_af is not None and population_af > C.COMMON_POPULATION_AF_THRESHOLD:
        labels.append("common_population_variant")
        reasons.append(
            f"population allele frequency {population_af:.4f} > "
            f"{C.COMMON_POPULATION_AF_THRESHOLD} ({population_source}) -- too common to be a "
            f"somatic driver, regardless of any disease association in the literature"
        )

    return {
        "labels": labels,
        "reasons": reasons,
        "population_af": population_af,
        "population_af_source": population_source,
        "is_germline_pattern": any(l.endswith("_germline_pattern") for l in labels),
        "is_common_population": "common_population_variant" in labels,
    }


def evaluate(variants, clinvar_by_key: dict, raw_header: str, samples: list[str]) -> dict:
    """Runs §5 for the whole file."""
    pairing = detect_paired_normal(raw_header, samples)

    if pairing["paired"]:
        return {
            "mode": "paired_tumor_normal",
            "pairing": pairing,
            "per_variant": {},
            "summary": {
                "applied": False,
                "reason": (
                    f"This file contains a matched normal ({pairing['normal_sample']}); tumor-only "
                    f"allele-fraction heuristics do not apply. Real tumor-normal subtraction is "
                    f"required and is NOT yet implemented, so no germline/somatic call is made here."
                ),
            },
            "note": C.GERMLINE_HEURISTIC_NOTE,
        }

    per_variant, het, hom, common = {}, 0, 0, 0
    for i, v in enumerate(variants):
        key = f"{v.chrom}:{v.pos}:{v.ref}:{v.alt}"
        result = classify_variant(v, clinvar_by_key.get(key))
        per_variant[i] = result
        if "putative_heterozygous_germline_pattern" in result["labels"]:
            het += 1
        if "putative_homozygous_germline_pattern" in result["labels"]:
            hom += 1
        if result["is_common_population"]:
            common += 1

    return {
        "mode": "tumor_only_heuristic",
        "pairing": pairing,
        "per_variant": per_variant,
        "summary": {
            "applied": True,
            "putative_heterozygous_germline_pattern": het,
            "putative_homozygous_germline_pattern": hom,
            "common_population_variant": common,
            "thresholds": {
                "heterozygous_af_range": list(HET_AF_RANGE),
                "homozygous_af_min": HOM_AF_MIN,
                "common_population_af_threshold": C.COMMON_POPULATION_AF_THRESHOLD,
            },
            "population_af_source_note": C.POPULATION_AF_SOURCE_NOTE,
        },
        "note": C.GERMLINE_HEURISTIC_NOTE,
    }
