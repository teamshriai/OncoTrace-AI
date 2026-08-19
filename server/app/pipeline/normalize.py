"""bcftools norm wrapper -- decomposes multiallelic records and left-aligns
indels so coordinates match ClinVar's own normalized representation. This is
required before any ClinVar/CIViC coordinate join; skipping it silently
breaks those joins rather than raising a visible error.

Symbolic ALT (<DEL> etc.) records pass through largely unchanged by
`bcftools norm -m -any` -- they're matched by gene-overlap downstream, not
exact REF/ALT, so that's expected and not a bug in this step.
"""

import subprocess
from pathlib import Path


class NormalizationError(Exception):
    pass


def normalize_vcf(input_path: str, output_path: str, reference_fasta: str) -> None:
    if not Path(reference_fasta).exists():
        raise NormalizationError(
            f"Reference FASTA not found at {reference_fasta}. Run scripts/download_references.sh "
            f"to provision it before analysis can run."
        )
    result = subprocess.run(
        ["bcftools", "norm", "-f", reference_fasta, "-m", "-any", "-O", "v", "-o", output_path, input_path],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise NormalizationError(f"bcftools norm failed: {result.stderr.strip()}")
