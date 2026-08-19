"""Strelka2 adapter -- built from Illumina's public Strelka2 output
documentation, NOT validated against a real Strelka2 file. Must be checked
against a real sample before being trusted in production.

Strelka2 has no single AF field. SNVs report per-base tier1/tier2 read counts
via FORMAT/{A,C,G,T}U (each a 2-tuple: tier1, tier2); indels report FORMAT/TAR
(ref, tier1/tier2) and FORMAT/TIR (indel, tier1/tier2). VAF is computed from
tier1 counts as alt / (ref + alt), the standard Strelka2 convention. A single
merged VCF can contain both SNV- and indel-style records, so the FORMAT keys
present on each individual record -- not a file-level assumption -- decide
which path applies.
"""

from .base import CallerAdapter, NormalizedVariant
from ._format_utils import get_format_value, infer_variant_type

_BASE_FIELDS = {"A": "AU", "C": "CU", "G": "GU", "T": "TU"}


class Strelka2Adapter(CallerAdapter):
    name = "strelka2"

    @classmethod
    def matches(cls, vcf) -> bool:
        header = vcf.raw_header.lower()
        return "strelka" in header

    @classmethod
    def to_normalized(cls, variant, sample_idx: int) -> NormalizedVariant:
        alt = variant.ALT[0] if variant.ALT else "."
        is_symbolic = alt.startswith("<") and alt.endswith(">")
        ref = variant.REF

        depth = get_format_value(variant, "DP", sample_idx, 0)

        if not is_symbolic and len(ref) == 1 and len(alt) == 1 and alt.upper() in _BASE_FIELDS:
            # SNV path: tier1 counts from the ref/alt base-specific *U fields.
            ref_field = _BASE_FIELDS.get(ref.upper())
            alt_field = _BASE_FIELDS[alt.upper()]
            ref_tier1 = get_format_value(variant, ref_field, sample_idx, 0) if ref_field else None
            alt_tier1 = get_format_value(variant, alt_field, sample_idx, 0)
            if ref_tier1 is None or alt_tier1 is None:
                raise ValueError(
                    f"Strelka2 SNV record at {variant.CHROM}:{variant.POS} is missing the base-tier FORMAT "
                    f"fields ({ref_field}/{alt_field}) this adapter expects -- unvalidated against real output."
                )
            total = ref_tier1 + alt_tier1
            vaf = (alt_tier1 / total) if total else 0.0
            alt_reads = alt_tier1
        else:
            # Indel path: FORMAT/TAR (ref tier1,2), FORMAT/TIR (indel tier1,2).
            ref_tier1 = get_format_value(variant, "TAR", sample_idx, 0)
            alt_tier1 = get_format_value(variant, "TIR", sample_idx, 0)
            if ref_tier1 is None or alt_tier1 is None:
                raise ValueError(
                    f"Strelka2 indel record at {variant.CHROM}:{variant.POS} is missing FORMAT/TAR or FORMAT/TIR "
                    f"-- unvalidated against real output."
                )
            total = ref_tier1 + alt_tier1
            vaf = (alt_tier1 / total) if total else 0.0
            alt_reads = alt_tier1

        if depth is None:
            depth = int(ref_tier1 + alt_tier1)

        filters = list(variant.FILTERS) if variant.FILTERS else ["PASS"]

        return NormalizedVariant(
            gene=None,
            chrom=str(variant.CHROM),
            pos=int(variant.POS),
            ref=ref,
            alt=alt,
            type=infer_variant_type(ref, alt, is_symbolic),
            filter=filters,
            vaf=round(float(vaf), 6),
            depth=int(depth),
            alt_reads=int(alt_reads),
            is_symbolic=is_symbolic,
            caller_warnings=["Strelka2 adapter is unvalidated against a real Strelka2 file"],
        )
