"""Mutect2 adapter -- built from GATK's public Mutect2 VCF documentation, NOT
validated against a real Mutect2 file. Must be checked against a real sample
before being trusted in production.

Mutect2 VCFs carry per-sample FORMAT/AF, FORMAT/AD ([ref, alt]), FORMAT/DP
directly (unlike VarDict's INFO-level fields), and are usually tumor-only or
tumor-normal paired -- the tumor sample is named in the ##tumor_sample header
line when present. No gene annotation or VarDict-style QC metrics (SN, HIAF,
MSI, SBF, ODDRATIO) exist in raw Mutect2 output; those are left None here and
the record relies on downstream SnpEff annotation for gene/consequence.
"""

from .base import CallerAdapter, NormalizedVariant
from ._format_utils import get_format_value, infer_variant_type


def _find_tumor_sample(vcf) -> str:
    for line in vcf.raw_header.splitlines():
        if line.startswith("##tumor_sample="):
            return line.split("=", 1)[1].strip()
    return vcf.samples[0]


class Mutect2Adapter(CallerAdapter):
    name = "mutect2"

    @classmethod
    def matches(cls, vcf) -> bool:
        header = vcf.raw_header
        if "Mutect2" in header:
            return True
        info_ids = {rec["ID"] for rec in vcf.header_iter() if rec.type == "INFO" and "ID" in rec.info()}
        return "TLOD" in info_ids

    @classmethod
    def sample_name(cls, vcf) -> str:
        return _find_tumor_sample(vcf)

    @classmethod
    def to_normalized(cls, variant, sample_idx: int) -> NormalizedVariant:
        warnings = []
        idx = sample_idx

        alt = variant.ALT[0] if variant.ALT else "."
        is_symbolic = alt.startswith("<") and alt.endswith(">")

        vaf = get_format_value(variant, "AF", idx, 0)
        depth = get_format_value(variant, "DP", idx, 0)
        alt_reads = get_format_value(variant, "AD", idx, 1)

        if vaf is None or depth is None or alt_reads is None:
            raise ValueError(
                f"Mutect2 record at {variant.CHROM}:{variant.POS} is missing FORMAT/AF, FORMAT/DP, or FORMAT/AD "
                f"at sample index {idx} -- this adapter is unvalidated against real Mutect2 output and may "
                f"not match this file's actual layout."
            )

        filters = list(variant.FILTERS) if variant.FILTERS else ["PASS"]
        mq = variant.INFO.get("MMQ")
        if isinstance(mq, tuple) and len(mq) > 1:
            mq = mq[1]  # [normal, tumor]

        return NormalizedVariant(
            gene=None,
            chrom=str(variant.CHROM),
            pos=int(variant.POS),
            ref=variant.REF,
            alt=alt,
            type=infer_variant_type(variant.REF, alt, is_symbolic),
            filter=filters,
            vaf=round(float(vaf), 6),
            depth=int(depth),
            alt_reads=int(alt_reads),
            is_symbolic=is_symbolic,
            mq=float(mq) if mq is not None else None,
            caller_warnings=warnings,
        )
