import subprocess
import textwrap
from pathlib import Path

import pytest

from app.pipeline import normalize


def write(tmp_path, name, content):
    path = tmp_path / name
    path.write_text(textwrap.dedent(content).lstrip())
    return str(path)


def _build_reference(tmp_path):
    """Tiny synthetic 2-contig reference using the same bare-contig
    convention as this codebase's real GRCh37/GRCh38.fa (Ensembl-style, no
    'chr' prefix) -- reproduces the actual production mismatch, not a
    hypothetical one."""
    fasta_text = ">1\n" + ("ACGT" * 10) + "\n>2\n" + ("TGCA" * 10) + "\n"
    fasta = tmp_path / "ref.fa"
    fasta.write_text(fasta_text)
    # Mirrors scripts/download_references.sh's own provisioning step exactly,
    # rather than hand-computing .fai byte offsets.
    result = subprocess.run(["samtools", "faidx", str(fasta)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    return str(fasta)


def _body_records(vcf_path):
    return [l for l in Path(vcf_path).read_text().splitlines() if l and not l.startswith("#")]


def _header_lines(vcf_path):
    return [l for l in Path(vcf_path).read_text().splitlines() if l.startswith("##contig=<")]


CHR_PREFIXED_VCF = """
    ##fileformat=VCFv4.2
    ##source=test
    ##contig=<ID=chr1,length=40>
    ##contig=<ID=chr2,length=40>
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
    chr1\t5\t.\tA\tG\t.\tPASS\t.
    chr2\t3\t.\tC\tT\t.\tPASS\t.
"""
# pos 5 of "ACGT"*10 -> (5-1)%4=0 -> 'A' (matches REF=A)
# pos 3 of "TGCA"*10 -> (3-1)%4=2 -> 'C' (matches REF=C)

NO_HEADER_DECLARATIONS_VCF = """
    ##fileformat=VCFv4.2
    ##source=test
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
    1\t5\t.\tA\tG\t.\tPASS\t.
    2\t3\t.\tC\tT\t.\tPASS\t.
"""


def test_normalize_renames_chr_prefixed_contigs_and_redeclares_them(tmp_path):
    """Reproduces the actual production bug: a UCSC-style ('chr1') upload
    against this codebase's bare-contig ('1') reference FASTAs must succeed,
    with its records AND header declarations rewritten to the reference's
    spelling -- not just the records, since a header still declaring 'chr1'
    while records say '1' would itself be an inconsistent VCF."""
    reference_fasta = _build_reference(tmp_path)
    input_vcf = write(tmp_path, "input.vcf", CHR_PREFIXED_VCF)
    output_vcf = str(tmp_path / "normalized.vcf")

    normalize.normalize_vcf(input_vcf, output_vcf, reference_fasta)

    assert [l.split("\t")[0] for l in _body_records(output_vcf)] == ["1", "2"]
    declared = _header_lines(output_vcf)
    assert any(l.startswith("##contig=<ID=1,") for l in declared)
    assert any(l.startswith("##contig=<ID=2,") for l in declared)
    assert not any("chr" in l for l in declared)


def test_normalize_adds_missing_contig_header_declarations(tmp_path):
    """A VCF using ALREADY-correct, reference-matching contig names but with
    no ##contig header lines at all (permitted by the VCF spec) must come
    out of normalize_vcf() with those declarations added -- otherwise the
    downstream ClinVar `bcftools annotate` join hits the identical
    'not defined in the header' hard failure this whole module exists to
    prevent, just one pipeline stage later."""
    reference_fasta = _build_reference(tmp_path)
    input_vcf = write(tmp_path, "input.vcf", NO_HEADER_DECLARATIONS_VCF)
    output_vcf = str(tmp_path / "normalized.vcf")

    normalize.normalize_vcf(input_vcf, output_vcf, reference_fasta)

    assert [l.split("\t")[0] for l in _body_records(output_vcf)] == ["1", "2"]
    declared_ids = {l[len("##contig=<ID="):].split(",")[0] for l in _header_lines(output_vcf)}
    assert {"1", "2"} <= declared_ids


def test_normalize_skips_reconciliation_when_already_fully_compliant(tmp_path, monkeypatch):
    """The common/expected case for this codebase's own fixtures: input
    already uses reference-matching contig names AND fully declares them.
    The rewrite pass must not run at all -- bcftools norm's input is the
    original file, unchanged."""
    reference_fasta = _build_reference(tmp_path)
    bare_vcf = write(tmp_path, "input.vcf", CHR_PREFIXED_VCF.replace("chr", ""))
    output_vcf = str(tmp_path / "normalized.vcf")

    calls = []
    real_run = subprocess.run

    def spy(cmd, *a, **kw):
        calls.append(cmd)
        return real_run(cmd, *a, **kw)

    monkeypatch.setattr(normalize.subprocess, "run", spy)

    normalize.normalize_vcf(bare_vcf, output_vcf, reference_fasta)

    norm_calls = [cmd for cmd in calls if cmd[:2] == ["bcftools", "norm"]]
    assert len(norm_calls) == 1
    assert norm_calls[0][-1] == bare_vcf  # ran directly against the original file, no reconciled copy


def test_normalize_still_raises_normalization_error_for_a_truly_unmatched_contig(tmp_path):
    """A contig absent from the reference under any spelling (not just a
    naming/declaration gap) must still surface bcftools' own error -- proves
    the fix doesn't paper over genuine mismatches."""
    reference_fasta = _build_reference(tmp_path)
    bogus_vcf = write(tmp_path, "input.vcf", CHR_PREFIXED_VCF.replace("chr1", "scaffold99"))
    output_vcf = str(tmp_path / "normalized.vcf")

    with pytest.raises(normalize.NormalizationError, match="bcftools norm failed"):
        normalize.normalize_vcf(bogus_vcf, output_vcf, reference_fasta)
