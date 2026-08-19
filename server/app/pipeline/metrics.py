"""Aggregate metrics computed from the real parsed/annotated variant set.
Every number here derives from the submitted file -- nothing is hardcoded
per-sample. Thresholds come from app/core/constants.py, which documents where
each one originates.
"""

import statistics
from collections import Counter, defaultdict

from ..core import constants as C

_CHROM_ORDER = [str(i) for i in range(1, 23)] + ["X", "Y", "MT", "M"]


def _mean(values):
    return round(statistics.fmean(values), 2) if values else None


def _median(values):
    return round(statistics.median(values), 4) if values else None


def build_qc_summary(variants) -> dict:
    total = len(variants)
    flag_counts = Counter()
    for v in variants:
        flag_counts.update(v.filter)

    pass_count = sum(1 for v in variants if v.filter_pass)
    depths = [v.depth for v in variants if v.depth is not None]
    mqs = [v.mq for v in variants if v.mq is not None]

    return {
        "total_records": total,
        "pass_count": pass_count,
        "non_pass_count": total - pass_count,
        "pass_rate": round(pass_count / total, 4) if total else 0.0,
        "filter_flag_counts": [
            {"flag": flag, "count": count, "description": C.FILTER_DESCRIPTIONS.get(flag, "")}
            for flag, count in flag_counts.most_common()
        ],
        "depth": {
            "mean": _mean(depths),
            "median": _median(depths),
            "min": min(depths) if depths else None,
            "max": max(depths) if depths else None,
        },
        "mapping_quality": {
            "mean": _mean(mqs),
            "median": _median(mqs),
            "min": min(mqs) if mqs else None,
            "max": max(mqs) if mqs else None,
        },
        "strand_bias_flag_count": sum(
            1 for v in variants
            if v.sbf is not None and v.oddratio is not None
            and v.sbf < C.STRAND_BIAS_SBF_MAX and v.oddratio > C.STRAND_BIAS_ODDRATIO_MIN
        ),
        "msi_elevated_count": sum(
            1 for v in variants if v.msi is not None and C.MSI_ELEVATED_MIN <= v.msi < C.MSI_HIGH_MIN
        ),
        "msi_high_count": sum(1 for v in variants if v.msi is not None and v.msi >= C.MSI_HIGH_MIN),
        "high_mismatch_count": sum(1 for v in variants if v.nm is not None and v.nm >= C.NM_FLAG_MIN),
    }


def build_variant_type_distribution(variants) -> list[dict]:
    counts = Counter(v.type for v in variants)
    return [{"type": t, "count": n} for t, n in counts.most_common()]


def build_chromosome_distribution(variants) -> list[dict]:
    counts = Counter(v.chrom.replace("chr", "") for v in variants)
    ordered = [c for c in _CHROM_ORDER if c in counts]
    extras = sorted(c for c in counts if c not in _CHROM_ORDER)
    return [{"chrom": c, "count": counts[c]} for c in ordered + extras]


def build_vaf_profile(variants) -> dict:
    vafs = [v.vaf for v in variants if v.vaf is not None]
    histogram = [
        {"range": label, "count": sum(1 for v in vafs if lo <= v < hi)}
        for label, lo, hi in C.VAF_HISTOGRAM_BUCKETS
    ]
    return {
        "histogram": histogram,
        "mean": round(statistics.fmean(vafs), 4) if vafs else None,
        "median": _median(vafs),
        "min": round(min(vafs), 4) if vafs else None,
        "max": round(max(vafs), 4) if vafs else None,
        "tiers": {
            "clonal_ge_30pct": sum(1 for v in vafs if v >= C.VAF_CLONAL_MIN),
            "subclonal_5_30pct": sum(1 for v in vafs if C.VAF_SUBCLONAL_MIN <= v < C.VAF_CLONAL_MIN),
            "low_fraction_lt_5pct": sum(1 for v in vafs if v < C.VAF_SUBCLONAL_MIN),
        },
        "note": C.VAF_TIER_NOTE,
    }


def build_gene_summary(variants, annotations_by_key: dict) -> list[dict]:
    by_gene = defaultdict(list)
    for v in variants:
        gene = v.gene or (annotations_by_key.get(_variant_key(v)) or {}).get("gene") or "(unannotated)"
        by_gene[gene].append(v)

    rows = []
    for gene, vs in by_gene.items():
        vafs = [v.vaf for v in vs if v.vaf is not None]
        clinvar_sigs = [
            ((annotations_by_key.get(_variant_key(v)) or {}).get("clinvar") or {}).get("clnsig")
            for v in vs
        ]
        clinvar_sigs = [s for s in clinvar_sigs if s]
        civic_levels = [
            ((annotations_by_key.get(_variant_key(v)) or {}).get("civic") or {}).get("match_level", "none")
            for v in vs
        ]
        rows.append({
            "gene": gene,
            "variant_count": len(vs),
            "max_vaf": round(max(vafs), 4) if vafs else None,
            "mean_vaf": round(statistics.fmean(vafs), 4) if vafs else None,
            "clinvar_max_significance": _worst_clinvar(clinvar_sigs),
            "civic_variant_level_actionable": "variant" in civic_levels,
            "civic_gene_level_evidence": "gene" in civic_levels,
        })
    rows.sort(key=lambda r: (r["max_vaf"] is None, -(r["max_vaf"] or 0)))
    return rows


_CLINVAR_SEVERITY = [
    "Pathogenic", "Likely_pathogenic", "Conflicting_interpretations_of_pathogenicity",
    "Uncertain_significance", "Likely_benign", "Benign",
]


def _worst_clinvar(sigs):
    """Returns the most clinically severe ClinVar classification present, using
    ClinVar's own vocabulary verbatim -- never binarized to safe/dangerous."""
    if not sigs:
        return None
    for level in _CLINVAR_SEVERITY:
        for s in sigs:
            if level.lower() in s.lower():
                return s
    return sigs[0]


def _variant_key(v) -> str:
    return f"{v.chrom}:{v.pos}:{v.ref}:{v.alt}"


def build_panel_mutation_density(variants, panel_footprint_mb, footprint_source="unknown",
                                 footprint_caveat=None) -> dict | None:
    """Deliberately NOT called TMB -- true tumor mutational burden requires
    exome-scale panels and standardized filtering, and published cutoffs are
    calibrated against WES. Returns None when the panel footprint is unknown."""
    if not panel_footprint_mb:
        return None
    coding_pass = [v for v in variants if v.filter_pass]
    disclaimer = C.PANEL_DENSITY_DISCLAIMER
    if footprint_caveat:
        disclaimer = f"{disclaimer} {footprint_caveat}"
    return {
        "variants_per_mb": round(len(coding_pass) / panel_footprint_mb, 3),
        "pass_variant_count": len(coding_pass),
        "panel_footprint_mb": panel_footprint_mb,
        "footprint_source": footprint_source,
        "disclaimer": disclaimer,
    }
