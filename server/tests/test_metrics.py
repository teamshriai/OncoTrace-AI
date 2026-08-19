import pytest

from app.pipeline import metrics, tiers
from app.pipeline.callers.base import NormalizedVariant


def v(**kw):
    defaults = dict(
        gene="GENE1", chrom="1", pos=100, ref="A", alt="G", type="SNV",
        filter=["PASS"], vaf=0.5, depth=500, alt_reads=250,
    )
    defaults.update(kw)
    return NormalizedVariant(**defaults)


def test_qc_summary_counts_each_flag_of_a_multi_flag_record():
    variants = [
        v(filter=["PASS"]),
        v(filter=["MSI12", "LongMSI"]),
        v(filter=["NM5.25"]),
    ]
    qc = metrics.build_qc_summary(variants)
    assert qc["total_records"] == 3
    assert qc["pass_count"] == 1
    assert qc["non_pass_count"] == 2
    assert qc["pass_rate"] == pytest.approx(1 / 3, abs=1e-4)
    flags = {f["flag"]: f["count"] for f in qc["filter_flag_counts"]}
    assert flags == {"PASS": 1, "MSI12": 1, "LongMSI": 1, "NM5.25": 1}


def test_qc_summary_threshold_counts_match_documented_conventions():
    variants = [
        v(msi=3, nm=1.0, sbf=0.5, oddratio=1.0),      # normal
        v(msi=7, nm=2.0, sbf=0.5, oddratio=1.0),      # MSI elevated
        v(msi=15, nm=6.0, sbf=0.01, oddratio=9.0),    # MSI high + NM flag + strand bias
    ]
    qc = metrics.build_qc_summary(variants)
    assert qc["msi_elevated_count"] == 1   # 6 <= msi < 12
    assert qc["msi_high_count"] == 1       # msi >= 12
    assert qc["high_mismatch_count"] == 1  # nm >= 5.25
    assert qc["strand_bias_flag_count"] == 1  # sbf < 0.05 AND oddratio > 5


def test_depth_and_mq_stats_ignore_missing_values():
    variants = [v(depth=100, mq=60.0), v(depth=300, mq=None), v(depth=500, mq=40.0)]
    qc = metrics.build_qc_summary(variants)
    assert qc["depth"]["mean"] == pytest.approx(300.0)
    assert qc["depth"]["min"] == 100
    assert qc["depth"]["max"] == 500
    assert qc["mapping_quality"]["mean"] == pytest.approx(50.0)  # only the two present


def test_vaf_profile_buckets_are_exclusive_and_total_correctly():
    vafs = [0.02, 0.15, 0.25, 0.4, 0.6, 0.8, 0.95]
    profile = metrics.build_vaf_profile([v(vaf=x) for x in vafs])
    assert [b["count"] for b in profile["histogram"]] == [1, 1, 1, 1, 1, 1, 1]
    assert sum(b["count"] for b in profile["histogram"]) == len(vafs)
    assert profile["median"] == pytest.approx(0.4)
    assert profile["tiers"]["clonal_ge_30pct"] == 4     # 0.4, 0.6, 0.8, 0.95
    assert profile["tiers"]["subclonal_5_30pct"] == 2   # 0.15, 0.25
    assert profile["tiers"]["low_fraction_lt_5pct"] == 1  # 0.02


def test_vaf_profile_note_disclaims_sample_type_inference():
    profile = metrics.build_vaf_profile([v(vaf=0.5)])
    assert "cannot distinguish tissue from plasma" in profile["note"]


def test_chromosome_distribution_is_karyotype_ordered():
    variants = [v(chrom="X"), v(chrom="2"), v(chrom="10"), v(chrom="1")]
    dist = metrics.build_chromosome_distribution(variants)
    assert [d["chrom"] for d in dist] == ["1", "2", "10", "X"]


def test_gene_summary_aggregates_per_gene():
    variants = [
        v(gene="EGFR", vaf=0.9), v(gene="EGFR", vaf=0.5), v(gene="BRAF", vaf=0.2),
    ]
    rows = metrics.build_gene_summary(variants, {})
    by_gene = {r["gene"]: r for r in rows}
    assert by_gene["EGFR"]["variant_count"] == 2
    assert by_gene["EGFR"]["max_vaf"] == pytest.approx(0.9)
    assert by_gene["EGFR"]["mean_vaf"] == pytest.approx(0.7)
    # sorted by max_vaf descending
    assert [r["gene"] for r in rows] == ["EGFR", "BRAF"]


def test_gene_summary_survives_missing_annotations():
    """Annotation stages may be skipped entirely; gene summary must not crash
    on None entries."""
    variants = [v(gene="EGFR")]
    rows = metrics.build_gene_summary(variants, {"1:100:A:G": None})
    assert rows[0]["gene"] == "EGFR"
    assert rows[0]["clinvar_max_significance"] is None


def test_panel_density_is_none_without_a_panel_footprint():
    assert metrics.build_panel_mutation_density([v()], None) is None


def test_panel_density_carries_its_not_tmb_disclaimer():
    result = metrics.build_panel_mutation_density([v(), v(filter=["NM5.25"])], 1.5)
    assert result["pass_variant_count"] == 1  # non-PASS excluded
    assert result["variants_per_mb"] == pytest.approx(1 / 1.5, abs=1e-3)
    assert "not comparable to whole-exome-based TMB" in result["disclaimer"]


def _tier(clinvar=None, civic=None, qc=None, zygo=None, **kw):
    opts = dict(build_confirmed=True, annotation_ran=True, adapter_validated=True)
    opts.update(kw)
    return tiers.classify(v(), clinvar, civic, qc, zygo, **opts)


def test_tier_1_requires_variant_level_civic_not_gene_level():
    """Gene-level evidence means the GENE has published support, not this variant.
    Promoting on it would be exactly the overclaim this pipeline prevents."""
    gene_only = _tier(civic={"match_level": "gene", "meets_evidence_floor": True,
                             "qualifying_evidence_count": 9, "evidence_floor": "C"})
    assert gene_only["tier"] == tiers.TIER_2
    assert any("not confirmed for this specific variant" in r.lower() for r in gene_only["reasons"])

    variant_level = _tier(civic={"match_level": "variant", "meets_evidence_floor": True,
                                 "qualifying_evidence_count": 3, "evidence_floor": "C"})
    assert variant_level["tier"] == tiers.TIER_1


def test_pathogenic_with_germline_allele_fraction_goes_to_tier_3_not_tier_1():
    """A germline pathogenic finding is a different clinical object -- hereditary
    risk -- not a somatic driver and not a lesser finding."""
    result = _tier(
        clinvar={"match_level": "exact", "clnsig": "Pathogenic", "review_stars": 3},
        zygo={"is_germline_pattern": True, "reasons": ["AF 0.50 in the heterozygous germline range"]},
    )
    assert result["tier"] == tiers.TIER_3
    assert any("hereditary-risk" in r for r in result["reasons"])


def test_somatic_oncogenicity_promotes_despite_conflicting_germline_call():
    """Real case: BRAF V600E's germline classification is 'Conflicting' because
    germline V600E causes a developmental syndrome. The somatic assertion is the
    correct signal for a somatic pipeline."""
    result = _tier(clinvar={
        "match_level": "exact",
        "clnsig": "Conflicting classifications of pathogenicity",
        "oncogenicity": "Oncogenic",
        "review_stars": 1,
    })
    assert result["tier"] == tiers.TIER_1
    assert any("oncogenicity" in r.lower() for r in result["reasons"])


def test_artifact_flag_sends_a_variant_to_tier_4_regardless_of_evidence():
    result = _tier(
        clinvar={"match_level": "exact", "clnsig": "Pathogenic", "review_stars": 3},
        qc={"flag_names": ["artifact_contamination_candidate"], "confidence_downgraded": True},
    )
    assert result["tier"] == tiers.TIER_4
    assert any("artifact" in r for r in result["reasons"])


def test_common_population_variant_overrides_urgent_framing():
    result = _tier(zygo={"is_common_population": True,
                         "reasons": ["population allele frequency 0.40 > 0.01"]})
    assert result["tier"] == tiers.TIER_4


def test_qc_downgrade_blocks_tier_1_but_keeps_the_finding_visible():
    result = _tier(
        clinvar={"match_level": "exact", "clnsig": "Pathogenic", "review_stars": 3},
        qc={"flag_names": ["low_mapping_quality", "strand_bias"], "confidence_downgraded": True,
            "downgrade_reason": "2 independent QC flags"},
    )
    assert result["tier"] == tiers.TIER_2
    assert any("QC confidence downgraded" in r for r in result["reasons"])


def test_unconfirmed_build_yields_not_evaluated_not_a_negative_result():
    result = _tier(clinvar={"match_level": "exact", "clnsig": "Pathogenic"}, build_confirmed=False)
    assert result["tier"] == tiers.NOT_EVALUATED
    assert any("build is unconfirmed" in r for r in result["reasons"])


def test_skipped_annotation_yields_not_evaluated():
    result = _tier(annotation_ran=False)
    assert result["tier"] == tiers.NOT_EVALUATED


def test_unvalidated_adapter_blocks_tier_1():
    result = _tier(clinvar={"match_level": "exact", "clnsig": "Pathogenic", "review_stars": 3},
                   adapter_validated=False)
    assert result["tier"] == tiers.TIER_2
    assert any("not yet validated" in r for r in result["reasons"])


def test_review_priority_count_matches_its_published_formula():
    variants = [v(), v(), v()]
    result = tiers.evaluate(
        variants,
        clinvar_by_key={"1:100:A:G": {"match_level": "exact", "clnsig": "Pathogenic"}},
        civic_by_key={}, qc_per_variant={}, zygo_per_variant={},
        build_confirmed=True, annotation_ran=True, adapter_validated=True,
    )
    counts = result["summary"]["counts"]
    assert result["summary"]["review_priority_count"] == 2 * counts[tiers.TIER_1] + counts[tiers.TIER_2]
    assert "NOT a percentage" in result["summary"]["review_priority_formula"]
