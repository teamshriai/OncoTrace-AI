import subprocess
import textwrap

import app.pipeline.normalize as normalize_module
from app.pipeline import annotate_clinvar


def write(tmp_path, name, content):
    path = tmp_path / name
    path.write_text(textwrap.dedent(content).lstrip())
    return str(path)


def _build_reference(tmp_path):
    """Tiny synthetic 2-contig reference using the same bare-contig
    convention as this codebase's real GRCh37/GRCh38.fa."""
    fasta_text = ">1\n" + ("ACGT" * 10) + "\n>2\n" + ("TGCA" * 10) + "\n"
    fasta = tmp_path / "ref.fa"
    fasta.write_text(fasta_text)
    result = subprocess.run(["samtools", "faidx", str(fasta)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    return str(fasta)


def _build_clinvar_vcf(tmp_path):
    """A minimal, real bgzip+tabix-indexed ClinVar-shaped VCF -- declares
    every INFO field annotate_with_clinvar's `-c` list requests (bcftools
    annotate requires each to be declared in the -a file's header, even if
    a given record doesn't carry a value for it), with real values only for
    CLNSIG."""
    header_fields = [
        ('CLNSIG', 'String', '.', 'Clinical significance'),
        ('CLNDN', 'String', '.', 'Disease name'),
        ('CLNREVSTAT', 'String', '.', 'Review status'),
        ('CLNSIGCONF', 'String', '.', 'Conflicting classifications'),
        ('ONC', 'String', '.', 'Oncogenicity classification'),
        ('AF_ESP', 'Float', '1', 'GO-ESP allele frequency'),
        ('AF_EXAC', 'Float', '1', 'ExAC allele frequency'),
        ('AF_TGP', 'Float', '1', '1000 Genomes allele frequency'),
    ]
    info_lines = "".join(
        f'##INFO=<ID={fid},Number={num},Type={typ},Description="{desc}">\n'
        for fid, typ, num, desc in header_fields
    )
    body = (
        "##fileformat=VCFv4.2\n"
        + info_lines
        + "##contig=<ID=1,length=40>\n"
        + "#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\n"
        + "1\t5\trs1\tA\tG\t.\t.\tCLNSIG=Pathogenic\n"
    )
    plain = tmp_path / "clinvar.vcf"
    plain.write_text(body)
    gz = tmp_path / "clinvar.vcf.gz"
    with open(gz, "wb") as out:
        result = subprocess.run(["bgzip", "-c", str(plain)], stdout=out, stderr=subprocess.PIPE)
    assert result.returncode == 0, result.stderr
    result = subprocess.run(["tabix", "-p", "vcf", str(gz)], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    return str(gz)


# pos 5 of "ACGT"*10 -> (5-1)%4=0 -> 'A' (matches REF); pos 3 of "TGCA"*10 -> (3-1)%4=2 -> 'C' (matches REF)
NO_HEADER_DECLARATIONS_VCF = """
    ##fileformat=VCFv4.2
    ##source=test
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
    1\t5\t.\tA\tG\t.\tPASS\t.
    2\t3\t.\tC\tT\t.\tPASS\t.
"""


def test_annotate_with_clinvar_reconciles_missing_contig_headers(tmp_path):
    """Reproduces the actual production bug: an input whose CHROM values
    already match the reference ("1", "2") but whose header declares no
    ##contig lines at all -- exactly the shape SnpEff's real output has been
    observed to produce -- must not crash `bcftools sort` inside
    `_bgzip_and_index`. `annotate_with_clinvar` is the only thing standing
    between SnpEff's output and this failure in production."""
    reference_fasta = _build_reference(tmp_path)
    clinvar_vcf = _build_clinvar_vcf(tmp_path)
    input_vcf = write(tmp_path, "snpeff_output.vcf", NO_HEADER_DECLARATIONS_VCF)
    output_vcf = str(tmp_path / "clinvar_annotated.vcf")

    annotate_clinvar.annotate_with_clinvar(input_vcf, output_vcf, clinvar_vcf, reference_fasta)

    result = annotate_clinvar.extract_clinvar(output_vcf)
    assert result["1:5:A:G"]["clnsig"] == "Pathogenic"


def test_annotate_with_clinvar_skips_reconciliation_when_already_compliant(tmp_path, monkeypatch):
    """The common case: input already declares its contigs correctly. The
    reconciliation pass must not run, and bcftools sort must be handed the
    original file directly."""
    reference_fasta = _build_reference(tmp_path)
    clinvar_vcf = _build_clinvar_vcf(tmp_path)
    input_vcf = write(tmp_path, "snpeff_output.vcf", """
        ##fileformat=VCFv4.2
        ##contig=<ID=1,length=40>
        #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO
        1\t5\t.\tA\tG\t.\tPASS\t.
    """)
    output_vcf = str(tmp_path / "clinvar_annotated.vcf")

    calls = []
    real_run = subprocess.run

    def spy(cmd, *a, **kw):
        calls.append(cmd)
        return real_run(cmd, *a, **kw)

    # ensure_contig_headers lives in normalize.py and issues its own
    # subprocess calls -- patch both modules' bound references so the spy
    # sees everything annotate_with_clinvar triggers.
    monkeypatch.setattr(annotate_clinvar.subprocess, "run", spy)
    monkeypatch.setattr(normalize_module.subprocess, "run", spy)

    annotate_clinvar.annotate_with_clinvar(input_vcf, output_vcf, clinvar_vcf, reference_fasta)

    sort_calls = [cmd for cmd in calls if cmd[:2] == ["bcftools", "sort"]]
    assert len(sort_calls) == 1
    assert sort_calls[0][-1] == input_vcf  # sorted directly, no reconciled copy needed
