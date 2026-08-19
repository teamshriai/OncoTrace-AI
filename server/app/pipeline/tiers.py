"""Tiered variant classification (spec §7).

Replaces the single 0-100 scalar. Each variant lands in exactly one tier, with
the specific reasons recorded, and variants the annotation stages couldn't
evaluate go to `not_evaluated` rather than defaulting into a "nothing found"
bucket.

Tier 3 exists because a germline pathogenic finding is a *different clinical
object* from a somatic driver -- hereditary risk, a different care pathway --
not a lesser one. Collapsing it into "benign" or into the somatic tier would
both be wrong.

If a dashboard needs one number, `review_priority_count` is a documented
weighted count over Tier 1 and Tier 2 only, published alongside its formula.
It is deliberately not a percentage or a severity score.
"""

from ..core import constants as C

TIER_1 = "tier_1_actionable_somatic"
TIER_2 = "tier_2_uncertain_needs_review"
TIER_3 = "tier_3_germline_pattern_clinically_relevant"
TIER_4 = "tier_4_benign_or_artifact"
NOT_EVALUATED = "not_evaluated"

_PATHOGENIC_TOKENS = ("pathogenic",)
_BENIGN_TOKENS = ("benign",)
_VUS_TOKENS = ("uncertain", "conflicting")


def _clinvar_class(clinvar: dict | None) -> str | None:
    """Buckets ClinVar's verbatim GERMLINE vocabulary (CLNSIG). 'Conflicting' is
    treated as uncertain, not pathogenic, even though the string contains
    'pathogenic'."""
    if not clinvar or clinvar.get("match_level") != "exact":
        return None
    sig = (clinvar.get("clnsig") or "").lower()
    if not sig:
        return None
    if any(t in sig for t in _VUS_TOKENS):
        return "uncertain"
    if any(t in sig for t in _PATHOGENIC_TOKENS):
        return "pathogenic"
    if any(t in sig for t in _BENIGN_TOKENS):
        return "benign"
    return "other"


def _oncogenicity_class(clinvar: dict | None) -> str | None:
    """ClinVar's SOMATIC oncogenicity classification (ONC), which is a separate
    assertion from the germline CLNSIG and the more appropriate signal for a
    somatic pipeline. Coverage is sparse, so absence means 'not asserted'."""
    if not clinvar or clinvar.get("match_level") != "exact":
        return None
    onc = (clinvar.get("oncogenicity") or "").lower()
    if not onc:
        return None
    if "uncertain" in onc:
        return "uncertain"
    if "benign" in onc:
        return "benign"
    if "oncogenic" in onc:  # covers "Oncogenic" and "Likely oncogenic"
        return "oncogenic"
    return "other"


def classify(variant, clinvar: dict | None, civic: dict | None, qc: dict | None,
             zygo: dict | None, build_confirmed: bool, annotation_ran: bool,
             adapter_validated: bool) -> dict:
    reasons: list[str] = []

    # Coordinate-based claims are meaningless without a confirmed build, and
    # nothing can be tiered if the annotation stages never ran.
    if not annotation_ran:
        return {"tier": NOT_EVALUATED,
                "reasons": ["the annotation stages needed to classify this variant did not run"]}
    if not build_confirmed:
        return {"tier": NOT_EVALUATED,
                "reasons": ["reference build is unconfirmed, so no coordinate-based classification "
                            "is attempted"]}

    cv_class = _clinvar_class(clinvar)
    onc_class = _oncogenicity_class(clinvar)
    qc_flag_names = set((qc or {}).get("flag_names") or [])
    downgraded = bool((qc or {}).get("confidence_downgraded"))
    is_germline_pattern = bool((zygo or {}).get("is_germline_pattern"))
    is_common = bool((zygo or {}).get("is_common_population"))
    civic_qualifies = bool((civic or {}).get("meets_evidence_floor"))
    civic_variant_level = (civic or {}).get("match_level") == "variant"

    artifact_flags = qc_flag_names & {"artifact_contamination_candidate", "duplicate_representation"}

    # --- Tier 4: benign, common, or technical artifact ---
    if artifact_flags:
        reasons.append(f"flagged as a technical artifact ({', '.join(sorted(artifact_flags))})")
        return {"tier": TIER_4, "reasons": reasons}
    if is_common:
        reasons.extend((zygo or {}).get("reasons") or ["population allele frequency above the common threshold"])
        return {"tier": TIER_4, "reasons": reasons}
    if cv_class == "benign" and onc_class != "oncogenic":
        reasons.append(f"ClinVar germline classification: {clinvar.get('clnsig')}")
        if clinvar.get("review_stars") is not None:
            reasons.append(f"ClinVar review confidence: {clinvar['review_stars']} gold star(s)")
        return {"tier": TIER_4, "reasons": reasons}

    # --- Tier 3: pathogenic, but with a germline allele-fraction pattern ---
    if (cv_class == "pathogenic" or onc_class == "oncogenic") and is_germline_pattern:
        reasons.append(f"ClinVar classification: {clinvar.get('clnsig')}")
        reasons.extend((zygo or {}).get("reasons") or [])
        reasons.append("hereditary-risk finding: a different clinical pathway from a somatic driver, "
                       "not a lesser finding")
        return {"tier": TIER_3, "reasons": reasons}

    # --- Tier 1: actionable somatic ---
    # Gene-level CIViC evidence is NOT sufficient: it means the gene has published
    # evidence, not that this variant carries it. Promoting on gene-level alone is
    # exactly the overclaim this pipeline exists to prevent, so Tier 1 requires
    # either a ClinVar pathogenic call or a variant-level CIViC match.
    civic_variant_qualifies = civic_qualifies and civic_variant_level
    supports_somatic = (
        cv_class == "pathogenic" or onc_class == "oncogenic" or civic_variant_qualifies
    )
    if supports_somatic and not is_germline_pattern and not downgraded and adapter_validated:
        if onc_class == "oncogenic":
            reasons.append(
                f"ClinVar somatic oncogenicity assertion: {clinvar.get('oncogenicity')}"
            )
        if cv_class == "pathogenic":
            reasons.append(f"ClinVar germline classification: {clinvar.get('clnsig')}"
                           + (f" ({clinvar['review_stars']} gold star(s))"
                              if clinvar.get("review_stars") is not None else ""))
        if civic_variant_qualifies:
            reasons.append(
                f"CIViC variant-level evidence at or above the {civic.get('evidence_floor')} floor "
                f"({civic.get('qualifying_evidence_count')} item(s))"
            )
        reasons.append("no germline allele-fraction pattern and no QC downgrade")
        return {"tier": TIER_1, "reasons": reasons}

    # --- Tier 2: everything that needs human review ---
    if onc_class == "uncertain":
        reasons.append(f"ClinVar somatic oncogenicity: {clinvar.get('oncogenicity')}")
    if cv_class == "uncertain":
        reasons.append(f"ClinVar germline classification: {clinvar.get('clnsig')}")
        if clinvar.get("is_conflicting"):
            reasons.append("ClinVar submissions conflict"
                           + (f": {clinvar['conflicting_breakdown']}"
                              if clinvar.get("conflicting_breakdown") else ""))
    if downgraded:
        reasons.append(f"QC confidence downgraded: {(qc or {}).get('downgrade_reason')}")
    if "microsatellite_or_homopolymer_context" in qc_flag_names:
        reasons.append("in microsatellite/homopolymer context, where indel calling is unreliable")
    if "hypervariable_region" in qc_flag_names:
        reasons.append("in a hypervariable / chronically mismapping locus")
    if is_germline_pattern and cv_class != "pathogenic":
        reasons.extend((zygo or {}).get("reasons") or [])
    if not adapter_validated:
        reasons.append("called by a caller whose adapter is not yet validated against a known file")
    if supports_somatic and downgraded:
        reasons.append("has supporting evidence but is QC-downgraded, so it needs review rather than "
                       "automatic promotion")
    if civic_qualifies and not civic_variant_level:
        reasons.append(
            f"CIViC has gene-level evidence for this gene ({civic.get('qualifying_evidence_count')} "
            f"item(s) at or above the {civic.get('evidence_floor')} floor) but NOT confirmed for this "
            f"specific variant, which is not sufficient for actionable-somatic classification"
        )
    if not reasons:
        reasons.append("no pathogenic, benign, or qualifying actionable evidence found -- unclassified")

    return {"tier": TIER_2, "reasons": reasons}


def evaluate(variants, clinvar_by_key: dict, civic_by_key: dict, qc_per_variant: dict,
             zygo_per_variant: dict, build_confirmed: bool, annotation_ran: bool,
             adapter_validated: bool) -> dict:
    per_variant: dict[int, dict] = {}
    counts = {TIER_1: 0, TIER_2: 0, TIER_3: 0, TIER_4: 0, NOT_EVALUATED: 0}

    for i, v in enumerate(variants):
        key = f"{v.chrom}:{v.pos}:{v.ref}:{v.alt}"
        result = classify(
            v,
            clinvar_by_key.get(key),
            civic_by_key.get(key),
            qc_per_variant.get(i),
            zygo_per_variant.get(i),
            build_confirmed,
            annotation_ran,
            adapter_validated,
        )
        per_variant[i] = result
        counts[result["tier"]] += 1

    # Documented, reproducible, and published with its formula -- not a severity score.
    review_priority_count = 2 * counts[TIER_1] + counts[TIER_2]

    return {
        "per_variant": per_variant,
        "summary": {
            "counts": counts,
            "definitions": C.TIER_DEFINITIONS,
            "review_priority_count": review_priority_count,
            "review_priority_formula": C.HEADLINE_METRIC_FORMULA,
        },
    }
