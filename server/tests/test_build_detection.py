import pytest

from app.pipeline import build_detection as bd
from app.pipeline.callers.base import NormalizedVariant


def v(chrom="1", pos=100, ref="A", alt="G"):
    return NormalizedVariant(
        gene=None, chrom=chrom, pos=pos, ref=ref, alt=alt, type="SNV",
        filter=["PASS"], vaf=0.5, depth=100, alt_reads=50,
    )


def test_explicit_hint_wins_and_is_labelled_as_such():
    build, source, _ = bd.resolve_build([v()], "GRCh38")
    assert build == "GRCh38"
    assert source == "user_supplied"


def test_invalid_hint_is_rejected():
    with pytest.raises(ValueError):
        bd.resolve_build([v()], "hg99")


@pytest.mark.parametrize("header,expected", [
    ("##reference=file:///data/GRCh38.fa", "GRCh38"),
    ("##assembly=GRCh37", "GRCh37"),
    ("##contig=<ID=1,length=249250621,assembly=hg19>", "GRCh37"),
    ("##reference=/refs/hg38.fa", "GRCh38"),
])
def test_build_read_from_header_variants(header, expected):
    assert bd.build_from_header(header) == expected


def test_header_without_build_info_returns_none():
    assert bd.build_from_header("##fileformat=VCFv4.2\n##source=VarDict\n") is None


def test_header_build_used_when_no_hint_given():
    build, source, _ = bd.resolve_build([v()], None, "##reference=/refs/GRCh38.fa")
    assert build == "GRCh38"
    assert source == "vcf_header"


def test_chromosome_bounds_rule_out_an_impossible_build():
    """A position beyond GRCh38's chr1 length but within GRCh37's rules GRCh38 out."""
    result = bd._plausible_builds([v(chrom="1", pos=248956500)])
    assert "GRCh38" not in result["plausible_builds"]
    assert "GRCh37" in result["plausible_builds"]


def test_unresolvable_build_raises_with_evidence_rather_than_guessing():
    """Bounds alone must never select a build -- even when only one is plausible,
    plausibility is not confirmation."""
    with pytest.raises(bd.BuildUnresolvedError) as exc:
        bd.resolve_build([v(chrom="1", pos=248956500)], None, "", {})
    evidence = exc.value.heuristic_result
    assert "chromosome_bounds" in evidence
    assert evidence["chromosome_bounds"]["plausible_builds"] == ["GRCh37"]


def test_probe_reports_unavailable_databases_rather_than_zero(monkeypatch):
    """A missing database must read as 'unavailable', not as 'zero matches' --
    otherwise an unprovisioned build looks like a mismatched one."""
    result = bd.probe_builds([v()], {"GRCh37": "/nonexistent/a.vcf.gz", "GRCh38": "/nonexistent/b.vcf.gz"})
    assert result["clinvar_exact_match_counts"] == {}
    assert set(result["databases_unavailable_for"]) == {"GRCh37", "GRCh38"}


def test_empirical_probe_selects_the_clearly_better_build(monkeypatch):
    monkeypatch.setattr(bd, "probe_builds", lambda variants, paths: {
        "clinvar_exact_match_counts": {"GRCh38": 20, "GRCh37": 1},
        "databases_unavailable_for": [],
    })
    build, source, evidence = bd.resolve_build([v()], None, "", {"GRCh38": "x", "GRCh37": "y"})
    assert build == "GRCh38"
    assert source == "empirical_clinvar_probe"
    assert "20" in evidence["decision"]


def test_empirical_probe_refuses_on_a_narrow_margin(monkeypatch):
    """Genes whose coordinates barely moved between builds can match both. A
    close call must stay unresolved rather than picking a near-tie."""
    monkeypatch.setattr(bd, "probe_builds", lambda variants, paths: {
        "clinvar_exact_match_counts": {"GRCh38": 6, "GRCh37": 5},
        "databases_unavailable_for": [],
    })
    with pytest.raises(bd.BuildUnresolvedError) as exc:
        bd.resolve_build([v()], None, "", {"GRCh38": "x", "GRCh37": "y"})
    assert "inconclusive" in exc.value.heuristic_result["decision"]


def test_empirical_probe_refuses_on_too_few_absolute_hits(monkeypatch):
    """Two matches out of a whole panel is noise, not evidence."""
    monkeypatch.setattr(bd, "probe_builds", lambda variants, paths: {
        "clinvar_exact_match_counts": {"GRCh38": 2, "GRCh37": 0},
        "databases_unavailable_for": [],
    })
    with pytest.raises(bd.BuildUnresolvedError):
        bd.resolve_build([v()], None, "", {"GRCh38": "x", "GRCh37": "y"})
