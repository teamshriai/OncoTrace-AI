import textwrap

import pytest
from cyvcf2 import VCF

from app.pipeline.callers.base import UnsupportedCallerError
from app.pipeline.callers.detect import detect_adapter
from app.pipeline.callers.vardict import VarDictAdapter
from app.pipeline.callers.mutect2 import Mutect2Adapter
from app.pipeline.callers.strelka2 import Strelka2Adapter


def _write(tmp_path, name, content):
    path = tmp_path / name
    path.write_text(textwrap.dedent(content).lstrip())
    return str(path)


VARDICT_VCF = """
    ##fileformat=VCFv4.2
    ##source=VarDict_v1.8.2
    ##FILTER=<ID=PASS,Description="All filters passed">
    ##FILTER=<ID=NM5.25,Description="Mean mismatches high">
    ##INFO=<ID=TYPE,Number=1,Type=String,Description="Type">
    ##INFO=<ID=DP,Number=1,Type=Integer,Description="Depth">
    ##INFO=<ID=VD,Number=1,Type=Integer,Description="Var depth">
    ##INFO=<ID=AF,Number=A,Type=Float,Description="AF">
    ##INFO=<ID=MQ,Number=1,Type=Float,Description="MQ">
    ##INFO=<ID=SBF,Number=1,Type=Float,Description="SBF">
    ##INFO=<ID=ODDRATIO,Number=1,Type=Float,Description="OR">
    ##INFO=<ID=HIAF,Number=1,Type=Float,Description="HIAF">
    ##INFO=<ID=GENE,Number=1,Type=String,Description="Gene">
    ##INFO=<ID=SVTYPE,Number=1,Type=String,Description="SV type">
    ##INFO=<ID=SVLEN,Number=1,Type=Integer,Description="SV len">
    ##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">
    ##ALT=<ID=DEL,Description="Deletion">
    ##contig=<ID=7>
    ##contig=<ID=8>
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS5
    7\t55167263\t.\tG\tT\t419\tPASS\tTYPE=SNV;DP=3067;VD=2695;AF=0.8787;MQ=42;SBF=0;ODDRATIO=2.66;HIAF=0.9472;GENE=EGFR\tGT\t1/1
    8\t127739018\t.\tT\t<DEL>\t361\tNM5.25\tTYPE=DEL;DP=831;VD=643;AF=0.7738;MQ=60;SBF=0.00012;ODDRATIO=1.51;HIAF=0.4605;GENE=MYC;SVTYPE=DEL;SVLEN=-1376\tGT\t1/0
"""


def test_vardict_detected_and_parsed(tmp_path):
    path = _write(tmp_path, "vardict.vcf", VARDICT_VCF)
    vcf = VCF(path)
    assert detect_adapter(vcf) is VarDictAdapter

    records = list(VCF(path))
    egfr = VarDictAdapter.to_normalized(records[0], 0)
    assert egfr.gene == "EGFR"
    assert egfr.chrom == "7"
    assert egfr.pos == 55167263
    assert egfr.vaf == pytest.approx(0.8787, abs=1e-4)
    assert egfr.depth == 3067
    assert egfr.alt_reads == 2695
    assert egfr.filter == ["PASS"]
    assert egfr.filter_pass is True
    assert egfr.is_symbolic is False


def test_vardict_symbolic_alt_and_nonpass_filter(tmp_path):
    path = _write(tmp_path, "vardict.vcf", VARDICT_VCF)
    myc = VarDictAdapter.to_normalized(list(VCF(path))[1], 0)
    assert myc.is_symbolic is True
    assert myc.alt == "<DEL>"
    assert myc.svtype == "DEL"
    # SVLEN is negative for deletions in VarDict output; we store magnitude.
    assert myc.svlen == 1376
    assert myc.filter == ["NM5.25"]
    assert myc.filter_pass is False


def test_multiple_filter_flags_are_split(tmp_path):
    """A record carrying several semicolon-joined FILTER flags must yield each
    flag separately, so per-flag QC tallies aren't undercounted."""
    vcf_text = VARDICT_VCF.replace(
        '##FILTER=<ID=NM5.25,Description="Mean mismatches high">',
        '##FILTER=<ID=NM5.25,Description="Mean mismatches high">\n    ##FILTER=<ID=MSI12,Description="MSI region">',
    ).replace("\t361\tNM5.25\t", "\t361\tMSI12;NM5.25\t")
    path = _write(tmp_path, "multi.vcf", vcf_text)
    v = VarDictAdapter.to_normalized(list(VCF(path))[1], 0)
    assert sorted(v.filter) == ["MSI12", "NM5.25"]
    assert v.filter_pass is False


MUTECT2_VCF = """
    ##fileformat=VCFv4.2
    ##source=Mutect2
    ##tumor_sample=TUMOR1
    ##FILTER=<ID=PASS,Description="All filters passed">
    ##INFO=<ID=TLOD,Number=A,Type=Float,Description="Tumor LOD">
    ##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">
    ##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths">
    ##FORMAT=<ID=AF,Number=A,Type=Float,Description="Allele fraction">
    ##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Depth">
    ##contig=<ID=1>
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tNORMAL1\tTUMOR1
    1\t100\t.\tA\tG\t.\tPASS\tTLOD=50.2\tGT:AD:AF:DP\t0/0:80,0:0.00:80\t0/1:60,40:0.4:100
"""


def test_mutect2_reads_tumor_sample_not_normal(tmp_path):
    """Regression guard: picking the wrong sample column would report the
    normal's 0% VAF as the tumor's."""
    path = _write(tmp_path, "mutect2.vcf", MUTECT2_VCF)
    vcf = VCF(path)
    assert detect_adapter(vcf) is Mutect2Adapter
    assert Mutect2Adapter.sample_name(vcf) == "TUMOR1"

    idx = vcf.samples.index("TUMOR1")
    v = Mutect2Adapter.to_normalized(list(VCF(path))[0], idx)
    assert v.vaf == pytest.approx(0.4)
    assert v.depth == 100
    assert v.alt_reads == 40  # AD is [ref, alt]; must not read the ref count
    assert v.type == "SNV"


STRELKA2_VCF = """
    ##fileformat=VCFv4.1
    ##source=strelka
    ##FILTER=<ID=PASS,Description="All filters passed">
    ##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">
    ##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Depth">
    ##FORMAT=<ID=AU,Number=2,Type=Integer,Description="A tier1,tier2">
    ##FORMAT=<ID=CU,Number=2,Type=Integer,Description="C tier1,tier2">
    ##FORMAT=<ID=GU,Number=2,Type=Integer,Description="G tier1,tier2">
    ##FORMAT=<ID=TU,Number=2,Type=Integer,Description="T tier1,tier2">
    ##FORMAT=<ID=TAR,Number=2,Type=Integer,Description="Ref tier1,tier2">
    ##FORMAT=<ID=TIR,Number=2,Type=Integer,Description="Indel tier1,tier2">
    ##contig=<ID=1>
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tTUMOR
    1\t100\t.\tC\tT\t.\tPASS\t.\tGT:DP:AU:CU:GU:TU\t0/1:100:0,0:70,70:0,0:30,30
    1\t200\t.\tA\tATT\t.\tPASS\t.\tGT:DP:TAR:TIR\t0/1:80:60,60:20,20
"""


def test_strelka2_computes_vaf_from_tier1_counts(tmp_path):
    """Strelka2 has no AF field -- VAF must be derived from tier1 read counts."""
    path = _write(tmp_path, "strelka2.vcf", STRELKA2_VCF)
    assert detect_adapter(VCF(path)) is Strelka2Adapter

    records = list(VCF(path))
    snv = Strelka2Adapter.to_normalized(records[0], 0)
    assert snv.vaf == pytest.approx(30 / 100)  # TU tier1 / (CU tier1 + TU tier1)
    assert snv.alt_reads == 30

    indel = Strelka2Adapter.to_normalized(records[1], 0)
    assert indel.vaf == pytest.approx(20 / 80)  # TIR / (TAR + TIR)
    assert indel.type == "Insertion"


UNKNOWN_CALLER_VCF = """
    ##fileformat=VCFv4.2
    ##source=SomeUnknownCaller_v9
    ##FILTER=<ID=PASS,Description="All filters passed">
    ##INFO=<ID=DP,Number=1,Type=Integer,Description="Depth">
    ##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">
    ##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Depth">
    ##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths">
    ##contig=<ID=1>
    #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS1
    1\t100\t.\tA\tG\t.\tPASS\tDP=100\tGT:DP:AD\t0/1:100:60,40
"""


def test_unknown_caller_falls_back_to_generic_spec_standard_reader(tmp_path):
    """An unrecognized caller is read through VCF-spec-standard fields only, and
    flagged as generic + unvalidated -- never presented as a known caller."""
    from app.pipeline.callers.generic import GenericAdapter

    path = _write(tmp_path, "mystery.vcf", UNKNOWN_CALLER_VCF)
    adapter = detect_adapter(VCF(path), allow_generic=True)
    assert adapter is GenericAdapter

    v = adapter.to_normalized(list(VCF(path))[0], 0)
    assert v.vaf == pytest.approx(0.4)  # AD alt / DP, both spec-standard
    assert v.depth == 100
    assert v.alt_reads == 40
    # Provenance of the interpretation is attached for auditing.
    assert any("fields used" in w for w in v.caller_warnings)
    assert any("unvalidated" in w for w in v.caller_warnings)


def test_unknown_caller_is_rejected_when_generic_is_disabled(tmp_path):
    """Operators who would rather reject than accept a generically-read file can
    turn the fallback off."""
    path = _write(tmp_path, "mystery.vcf", UNKNOWN_CALLER_VCF)
    with pytest.raises(UnsupportedCallerError):
        detect_adapter(VCF(path), allow_generic=False)


def test_generic_reader_refuses_a_record_with_no_vaf_or_depth(tmp_path):
    """With no spec-standard field carrying a variant fraction, the correct
    behaviour is refusal, not a fabricated number."""
    from app.pipeline.callers.generic import GenericAdapter

    path = _write(tmp_path, "bare.vcf", """
        ##fileformat=VCFv4.2
        ##source=SomeUnknownCaller_v9
        ##FILTER=<ID=PASS,Description="All filters passed">
        ##FORMAT=<ID=GT,Number=1,Type=String,Description="GT">
        ##contig=<ID=1>
        #CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS1
        1\t100\t.\tA\tG\t.\tPASS\t.\tGT\t0/1
    """)
    with pytest.raises(ValueError, match="Refusing to guess"):
        GenericAdapter.to_normalized(list(VCF(path))[0], 0)
