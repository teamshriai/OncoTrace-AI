"""Env-driven paths to locally-provisioned reference resources. Nothing here
reaches the network; scripts/download_references.sh populates these paths once,
out of band.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

SERVER_ROOT = Path(__file__).resolve().parents[2]

# Loaded before any os.environ read below. override=False so a real environment
# variable (systemd Environment=, CI, a shell export) always beats the file --
# server/.env is a local-development convenience, not the production source of
# truth, and it is untracked precisely because it holds the demo credential.
load_dotenv(SERVER_ROOT / ".env", override=False)

RESOURCES = Path(os.environ.get("ONCOTRACE_RESOURCES", SERVER_ROOT / "resources"))


def _p(env_key: str, default: Path) -> Path:
    return Path(os.environ.get(env_key, default))


SNPEFF_JAR = _p("ONCOTRACE_SNPEFF_JAR", RESOURCES / "snpeff" / "snpEff.jar")
SNPEFF_DATA_DIR = _p("ONCOTRACE_SNPEFF_DATA", RESOURCES / "snpeff" / "data")

SNPEFF_DB_BY_BUILD = {
    "GRCh37": os.environ.get("ONCOTRACE_SNPEFF_DB_GRCH37", "GRCh37.75"),
    "GRCh38": os.environ.get("ONCOTRACE_SNPEFF_DB_GRCH38", "GRCh38.105"),
}

CLINVAR_VCF_BY_BUILD = {
    "GRCh37": _p("ONCOTRACE_CLINVAR_GRCH37", RESOURCES / "clinvar" / "clinvar_GRCh37.vcf.gz"),
    "GRCh38": _p("ONCOTRACE_CLINVAR_GRCH38", RESOURCES / "clinvar" / "clinvar_GRCh38.vcf.gz"),
}

REFERENCE_FASTA_BY_BUILD = {
    "GRCh37": _p("ONCOTRACE_REF_GRCH37", RESOURCES / "reference" / "GRCh37.fa"),
    "GRCh38": _p("ONCOTRACE_REF_GRCH38", RESOURCES / "reference" / "GRCh38.fa"),
}

CIVIC_CACHE = _p("ONCOTRACE_CIVIC_CACHE", RESOURCES / "civic" / "civic_evidence.tsv")
CIVIC_RELEASE_FILE = _p("ONCOTRACE_CIVIC_RELEASE", RESOURCES / "civic" / "RELEASE.txt")
CLINVAR_RELEASE_FILE = _p("ONCOTRACE_CLINVAR_RELEASE", RESOURCES / "clinvar" / "RELEASE.txt")

PANEL_BED = _p("ONCOTRACE_PANEL_BED", RESOURCES / "panel" / "panel.bed")
PANEL_NAME = os.environ.get("ONCOTRACE_PANEL_NAME") or None

GENE_SPANS_BY_BUILD = {
    "GRCh37": _p("ONCOTRACE_GENE_SPANS_GRCH37", RESOURCES / "panel" / "gene_spans_GRCh37.bed"),
    "GRCh38": _p("ONCOTRACE_GENE_SPANS_GRCH38", RESOURCES / "panel" / "gene_spans_GRCh38.bed"),
}

# Set false to reject VCFs from unrecognized callers instead of falling back to
# the spec-standard generic reader.
ALLOW_GENERIC_CALLER = os.environ.get("ONCOTRACE_ALLOW_GENERIC_CALLER", "true").lower() == "true"

MAX_UPLOAD_BYTES = int(os.environ.get("ONCOTRACE_MAX_UPLOAD_BYTES", 500 * 1024 * 1024))

# Concurrent analyses allowed per worker process. Each analysis runs SnpEff as
# `java -Xmx4g`, so the real constraint is memory: keep
# (uvicorn --workers) x (this value) x 4GB comfortably under host RAM.
# Requests beyond the limit are shed with a 503 rather than queued, because a
# queued genomics job is usually abandoned by the caller long before it runs.
MAX_CONCURRENT_ANALYSES = int(os.environ.get("ONCOTRACE_MAX_CONCURRENT_ANALYSES", 2))

# Vite takes the next free port when 5173 is already in use (a second dev
# server, or one left running from an earlier session), so the 5174/5175
# fallbacks are listed too. Without them the browser blocks the login request
# at CORS preflight and the demo looks like it is rejecting valid credentials.
_DEV_ORIGINS = ",".join(
    f"http://{host}:{port}"
    for port in (5173, 5174, 5175)
    for host in ("localhost", "127.0.0.1")
)

CORS_ORIGINS = [
    o.strip() for o in os.environ.get(
        "ONCOTRACE_CORS_ORIGINS",
        _DEV_ORIGINS,
    ).split(",") if o.strip()
]

# When false, requests fail with a clear 503 if reference data is missing rather
# than returning partial results that could be mistaken for a full analysis.
ALLOW_PARTIAL_ANNOTATION = os.environ.get("ONCOTRACE_ALLOW_PARTIAL", "true").lower() == "true"

# Single shared credential gating the analysis endpoint while the demo is
# invite-only. Deliberately fail-closed: when these are unset the protected
# routes return 503 rather than serving unauthenticated, so a misconfigured
# deploy is loudly broken instead of silently public.
DEMO_AUTH_USERNAME = os.environ.get("ONCOTRACE_DEMO_USERNAME") or None
DEMO_AUTH_PASSWORD = os.environ.get("ONCOTRACE_DEMO_PASSWORD") or None


def demo_auth_configured() -> bool:
    return bool(DEMO_AUTH_USERNAME and DEMO_AUTH_PASSWORD)


def read_release(path: Path, label: str) -> str:
    try:
        return path.read_text(encoding="utf-8").strip() or f"{label}: unknown"
    except OSError:
        return f"{label}: not provisioned"


def clinvar_ready(build: str) -> bool:
    """A ClinVar VCF counts as provisioned only once its tabix index exists --
    the index is written last, so this also rules out a partial download."""
    vcf = CLINVAR_VCF_BY_BUILD.get(build)
    return bool(vcf and vcf.exists() and Path(f"{vcf}.tbi").exists())


def reference_ready(build: str) -> bool:
    """Likewise, bcftools norm needs the .fai index alongside the FASTA."""
    fasta = REFERENCE_FASTA_BY_BUILD.get(build)
    return bool(fasta and fasta.exists() and Path(f"{fasta}.fai").exists())


def snpeff_ready(build: str) -> bool:
    """Only counts as provisioned once this build's genome database has actually
    finished downloading. The jar plus an empty data/ dir -- present from the
    moment a download starts, via `mkdir -p` -- is not enough: treating that as
    "ready" mid-download makes a request launch SnpEff against a database that
    isn't there yet, which blocks the whole (single-worker, synchronous-call)
    event loop for as long as the real download takes."""
    db = SNPEFF_DB_BY_BUILD.get(build)
    return bool(
        db and SNPEFF_JAR.exists()
        and (SNPEFF_DATA_DIR / db / "snpEffectPredictor.bin").exists()
    )


def resource_status() -> dict:
    """Reports which reference resources are actually present, so the API can
    disclose exactly what did and did not run for a given request."""
    return {
        "snpeff_GRCh37": snpeff_ready("GRCh37"),
        "snpeff_GRCh38": snpeff_ready("GRCh38"),
        "clinvar_GRCh37": clinvar_ready("GRCh37"),
        "clinvar_GRCh38": clinvar_ready("GRCh38"),
        "reference_GRCh37": reference_ready("GRCh37"),
        "reference_GRCh38": reference_ready("GRCh38"),
        "civic_cache": CIVIC_CACHE.exists(),
        "panel_bed": PANEL_BED.exists(),
        "gene_spans_GRCh37": GENE_SPANS_BY_BUILD["GRCh37"].exists(),
        "gene_spans_GRCh38": GENE_SPANS_BY_BUILD["GRCh38"].exists(),
        # Empirical build detection needs BOTH ClinVar builds to compare against.
        "empirical_build_detection": clinvar_ready("GRCh37") and clinvar_ready("GRCh38"),
    }
