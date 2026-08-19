"""DRAGEN adapter -- built from Illumina DRAGEN's public small-variant VCF
documentation, NOT validated against a real DRAGEN file. Must be checked
against a real sample before being trusted in production.

DRAGEN's somatic/germline small-variant caller follows the same GATK-style
FORMAT/AF, FORMAT/AD, FORMAT/DP convention as Mutect2, so this reuses the same
extraction helper -- the two adapters differ in caller detection and in which
sample column is authoritative (DRAGEN somatic VCFs don't reliably carry a
##tumor_sample header line the way Mutect2 does, so the sample name must be
supplied explicitly rather than inferred).
"""

from .base import CallerAdapter, NormalizedVariant
from ._format_utils import get_format_value, infer_variant_type


class DragenAdapter(CallerAdapter):
    name = "dragen"

    @classmethod
    def matches(cls, vcf) -> bool:
        return "dragen" in vcf.raw_header.lower()

    @classmethod
    def to_normalized(cls, variant, sample_idx: int) -> NormalizedVariant:
        alt = variant.ALT[0] if variant.ALT else "."
        is_symbolic = alt.startswith("<") and alt.endswith(">")

        vaf = get_format_value(variant, "AF", sample_idx, 0)
        depth = get_format_value(variant, "DP", sample_idx, 0)
        alt_reads = get_format_value(variant, "AD", sample_idx, 1)

        if vaf is None or depth is None or alt_reads is None:
            raise ValueError(
                f"DRAGEN record at {variant.CHROM}:{variant.POS} is missing FORMAT/AF, FORMAT/DP, or FORMAT/AD "
                f"at sample index {sample_idx} -- this adapter is unvalidated against real DRAGEN output."
            )

        filters = list(variant.FILTERS) if variant.FILTERS else ["PASS"]

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
            caller_warnings=["DRAGEN adapter is unvalidated against a real DRAGEN file"],
        )
