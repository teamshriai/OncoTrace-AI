"""Regenerates the S5 test fixture VCF from a JSON dump of its variant records.

The fixture is a faithful reconstruction of a real GeneMind SURFSeq5000
targeted-panel VCF (VarDict v1.8.2) used to validate the VarDict adapter. Run
this only when the fixture needs rebuilding; the generated .vcf is committed so
tests don't depend on this script or on any real patient file.

Usage: python build_s5_fixture.py <variants.json> <output.vcf>
"""

import json
import sys

HEADER = """##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
##source=VarDict_v1.8.2
##INFO=<ID=SAMPLE,Number=1,Type=String,Description="Sample name">
##INFO=<ID=TYPE,Number=1,Type=String,Description="Variant Type: SNV Insertion Deletion Complex">
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=VD,Number=1,Type=Integer,Description="Variant Depth">
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##INFO=<ID=SBF,Number=1,Type=Float,Description="Strand Bias Fisher p-value">
##INFO=<ID=ODDRATIO,Number=1,Type=Float,Description="Strand Bias Odds ratio">
##INFO=<ID=MQ,Number=1,Type=Float,Description="Mean Mapping Quality">
##INFO=<ID=SN,Number=1,Type=Float,Description="Signal to noise">
##INFO=<ID=HIAF,Number=1,Type=Float,Description="Allele frequency using only high quality bases">
##INFO=<ID=MSI,Number=1,Type=Float,Description="MicroSatellite. > 1 indicates MSI">
##INFO=<ID=NM,Number=1,Type=Float,Description="Mean mismatches in reads">
##INFO=<ID=HICNT,Number=1,Type=Integer,Description="High quality variant reads">
##INFO=<ID=HICOV,Number=1,Type=Integer,Description="High quality total reads">
##INFO=<ID=SPLITREAD,Number=1,Type=Integer,Description="No. of split reads supporting SV">
##INFO=<ID=SPANPAIR,Number=1,Type=Integer,Description="No. of pairs supporting SV">
##INFO=<ID=SVTYPE,Number=1,Type=String,Description="SV type: INV DUP DEL INS FUS">
##INFO=<ID=SVLEN,Number=1,Type=Integer,Description="The length of SV in bp">
##INFO=<ID=GENE,Number=1,Type=String,Description="Gene name">
##FILTER=<ID=q22.5,Description="Mean Base Quality Below 22.5">
##FILTER=<ID=Q10,Description="Mean Mapping Quality Below 10">
##FILTER=<ID=p8,Description="Mean Position in Reads Less than 8">
##FILTER=<ID=SN1.5,Description="Signal to Noise Less than 1.5">
##FILTER=<ID=Bias,Description="Strand Bias">
##FILTER=<ID=pSTD,Description="Position in Reads has STD of 0">
##FILTER=<ID=d3,Description="Total Depth < 3">
##FILTER=<ID=v2,Description="Var Depth < 2">
##FILTER=<ID=f0.01,Description="Allele frequency < 0.01">
##FILTER=<ID=MSI12,Description="Variant in MSI region with 12 non-monomer MSI or 13 monomer MSI">
##FILTER=<ID=NM5.25,Description="Mean mismatches in reads >= 5.25, thus likely false positive">
##FILTER=<ID=InGap,Description="The variant is in the deletion gap, thus likely false positive">
##FILTER=<ID=InIns,Description="The variant is adjacent to an insertion variant">
##FILTER=<ID=Cluster0bp,Description="Two variants are within 0 bp">
##FILTER=<ID=LongMSI,Description="The somatic variant is flanked by long A/T (>=14)">
##FILTER=<ID=AMPBIAS,Description="Indicate the variant has amplicon bias.">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##FORMAT=<ID=VD,Number=1,Type=Integer,Description="Variant Depth">
##FORMAT=<ID=AD,Number=R,Type=Integer,Description="Allelic depths for the ref and alt alleles">
##FORMAT=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##ALT=<ID=DEL,Description="Deletion">
##bcftools_viewVersion=1.19+htslib-1.19
##bcftools_viewCommand=view -R bed/panel_fixed.bed -O v -o S5.panel.vcf S5.final.vcf.gz; Date=Tue Jun 16 18:54:40 2026
##bcftools_annotateVersion=1.19+htslib-1.19
##bcftools_annotateCommand=annotate -a bed/panel_fixed.bed -c CHROM,FROM,TO,INFO/GENE -h gene_header.txt --threads 2 -O v -o S5.panel.annotated.vcf S5.panel.vcf; Date=Tue Jun 16 18:55:41 2026
"""

CONTIGS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14",
           "15", "16", "17", "18", "19", "21", "22", "X"]


def build(variants, out_path):
    lines = [HEADER.rstrip("\n")]
    lines += [f"##contig=<ID={c}>" for c in CONTIGS]
    lines.append("#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS5")

    for v in sorted(variants, key=lambda x: (CONTIGS.index(str(x["chrom"])) if str(x["chrom"]) in CONTIGS else 99, x["pos"])):
        info = [
            "SAMPLE=S5",
            f"TYPE={v['type']}",
            f"DP={v['depth']}",
            f"VD={v['alt_reads']}",
            f"AF={v['vaf']}",
            f"SBF={v['sbf']}",
            f"ODDRATIO={v['oddratio']}",
            f"MQ={v['mq']}",
            f"SN={v['sn']}",
            f"HIAF={v['hiaf']}",
            f"MSI={v['msi']}",
            f"NM={v['nm']}",
            f"HICNT={v['hicnt']}",
            f"HICOV={v['hicov']}",
        ]
        if v.get("svtype"):
            info += [f"SVTYPE={v['svtype']}", f"SVLEN={v['svlen']}",
                     f"SPLITREAD={v['splitread']}", f"SPANPAIR={v['spanpair']}"]
        info.append(f"GENE={v['gene']}")

        ref_reads = max(v["depth"] - v["alt_reads"], 0)
        fmt = f"0/1:{v['depth']}:{v['alt_reads']}:{ref_reads},{v['alt_reads']}:{v['vaf']}"
        lines.append("\t".join([
            str(v["chrom"]), str(v["pos"]), ".", v["ref"], v["alt"], "200",
            ";".join(v["filter"]), ";".join(info), "GT:DP:VD:AD:AF", fmt,
        ]))

    with open(out_path, "w") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"wrote {len(variants)} records to {out_path}")


if __name__ == "__main__":
    with open(sys.argv[1]) as fh:
        build(json.load(fh), sys.argv[2])
