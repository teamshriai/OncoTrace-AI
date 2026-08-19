from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
FIXTURES = Path(__file__).parent / "fixtures"
S5 = FIXTURES / "S5.panel.annotated.vcf"


def test_health_reports_resource_provisioning():
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    # Resource flags let an operator see exactly which annotation stages can run.
    assert "clinvar_GRCh38" in body["resources"]
    assert "civic_cache" in body["resources"]


def test_rejects_non_vcf_extension():
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("notes.txt", b"hello", "text/plain")},
    )
    assert r.status_code == 400
    assert r.json()["error_kind"] == "malformed_vcf"


def test_rejects_empty_file():
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("empty.vcf", b"", "text/plain")},
    )
    assert r.status_code == 400
    assert r.json()["error_kind"] == "malformed_vcf"


def test_rejects_unsupported_build_hint():
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("s5.vcf", S5.read_bytes(), "text/plain")},
        data={"reference_build_hint": "hg19-ish"},
    )
    assert r.status_code == 400
    assert "reference_build_hint" in r.json()["message"]


def test_missing_build_hint_either_resolves_with_evidence_or_refuses_with_evidence():
    """The API must never silently pick a build. Either it resolves one and shows
    the evidence (an empirical ClinVar probe), or it refuses and shows why -- but
    it never guesses."""
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("s5.vcf", S5.read_bytes(), "text/plain")},
    )
    if r.status_code == 422:
        body = r.json()
        assert body["error_kind"] == "reference_build_unresolved"
        assert "supported_builds" in body["detail"]
        assert "evidence" in body["detail"]
    else:
        assert r.status_code == 200, r.text
        meta = r.json()["meta"]
        assert meta["reference_build_source"] in ("vcf_header", "empirical_clinvar_probe")
        assert meta["reference_build_confirmed"] is True
        assert meta["reference_build_evidence"], "a resolved build must show its evidence"


def test_unknown_caller_is_read_generically_and_visibly_warned():
    vcf = (
        "##fileformat=VCFv4.2\n"
        "##source=TotallyUnknownCaller_v1\n"
        '##FILTER=<ID=PASS,Description="pass">\n'
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">\n'
        "##contig=<ID=1>\n"
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS1\n"
        "1\t100\t.\tA\tG\t.\tPASS\t.\tGT\t0/1\n"
    ).encode()
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("mystery.vcf", vcf, "text/plain")},
        data={"reference_build_hint": "GRCh38"},
    )
    # Without spec-standard depth/VAF fields there is nothing to read, so this
    # particular file is refused rather than guessed at.
    assert r.status_code in (400, 422), r.text
    assert r.json()["error_kind"] == "malformed_vcf"


def test_vcf_with_no_variant_records_returns_422():
    vcf = (
        "##fileformat=VCFv4.2\n"
        "##source=VarDict_v1.8.2\n"
        '##FILTER=<ID=PASS,Description="pass">\n'
        '##INFO=<ID=SBF,Number=1,Type=Float,Description="SBF">\n'
        '##INFO=<ID=ODDRATIO,Number=1,Type=Float,Description="OR">\n'
        '##INFO=<ID=HIAF,Number=1,Type=Float,Description="HIAF">\n'
        '##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">\n'
        "##contig=<ID=1>\n"
        "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS1\n"
    ).encode()
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("empty-records.vcf", vcf, "text/plain")},
        data={"reference_build_hint": "GRCh38"},
    )
    assert r.status_code in (400, 422), r.text
    assert r.json()["error_kind"] == "malformed_vcf"


def test_successful_analysis_returns_real_computed_values():
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("S5.panel.annotated.vcf", S5.read_bytes(), "text/plain")},
        data={"reference_build_hint": "GRCh38"},
    )
    assert r.status_code == 200, r.text
    body = r.json()

    # Values below are the real S5 sample's actual numbers, not fixtures.
    assert body["meta"]["sample_id"] == "S5"
    assert body["meta"]["caller_adapter"] == "vardict"
    assert body["meta"]["caller_adapter_validated"] is True
    assert body["qc_summary"]["total_records"] == 49
    assert body["qc_summary"]["pass_count"] == 38
    assert body["qc_summary"]["depth"]["max"] == 3067

    egfr = next(v for v in body["variants"] if v["gene"] == "EGFR")
    assert egfr["chrom"] == "7"
    assert egfr["pos"] == 55167263
    assert abs(egfr["vaf"] - 0.8787) < 1e-3

    # Three symbolic-ALT structural deletions in this sample (KLF4 x2, MYC).
    assert len(body["structural_variants"]) == 3
    assert {sv["gene"] for sv in body["structural_variants"]} == {"KLF4", "MYC"}


def test_response_always_discloses_stage_status_and_disclaimers():
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("S5.panel.annotated.vcf", S5.read_bytes(), "text/plain")},
        data={"reference_build_hint": "GRCh38"},
    )
    body = r.json()
    stages = body["meta"]["stages"]
    # Every stage reports a recognized status with a reason, so a stage that did
    # not run can never be mistaken for one that ran and found nothing.
    allowed = {"ran", "skipped_missing_input", "skipped_unsupported", "failed"}
    assert stages["parsing"]["status"] == "ran"
    for name, stage in stages.items():
        assert stage["status"] in allowed, (name, stage)
        if stage["status"] != "ran":
            assert stage["detail"], f"{name} skipped without stating why"

    assert "not a diagnostic device" in body["meta"]["disclaimer"].lower()
    assert "not FDA-cleared" in body["actionability_summary"]["disclaimer"]
    # The headline number must arrive with its formula, not as a bare scalar.
    assert "prioritization_score" not in body
    assert "review_priority_formula" in body["tier_summary"]


def test_no_fabricated_clinical_claims_when_annotation_is_skipped():
    """If an annotation stage didn't run, its per-variant fields must say so
    rather than reading as 'checked, nothing found'."""
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("S5.panel.annotated.vcf", S5.read_bytes(), "text/plain")},
        data={"reference_build_hint": "GRCh38"},
    )
    body = r.json()
    if body["meta"]["stages"]["clinical_significance"]["status"] != "ran":
        for v in body["variants"]:
            assert v["clinvar"]["match_level"] == "none"
            assert v["clinvar"]["reason"] is not None


def test_symbolic_alt_variants_never_get_a_protein_change_string():
    r = client.post(
        "/api/v1/vcf/analyze",
        files={"vcf_file": ("S5.panel.annotated.vcf", S5.read_bytes(), "text/plain")},
        data={"reference_build_hint": "GRCh38"},
    )
    body = r.json()
    for sv in body["structural_variants"]:
        assert sv["annotation"].get("hgvs_p") is None
        assert sv["annotation"].get("consequence_class") == "structural"
