"""Shared helpers for callers that expose FORMAT/AF, FORMAT/AD, FORMAT/DP
directly per-sample (Mutect2, DRAGEN) -- the modern GATK-style convention,
as opposed to VarDict's INFO-level AF/DP/VD or Strelka2's tiered read counts.
"""


def sample_index(vcf, sample_name: str) -> int:
    try:
        return vcf.samples.index(sample_name)
    except ValueError:
        raise ValueError(f"Sample {sample_name!r} not found in VCF samples {vcf.samples!r}")


def get_format_value(variant, field: str, sample_idx: int, value_idx: int = 0):
    """Returns one scalar from FORMAT `field` at `sample_idx`, or None if the
    field isn't present on this record. `value_idx` picks which element of a
    multi-value field to use -- e.g. AD's shape is [ref_depth, alt_depth], so
    the alt read count is value_idx=1."""
    try:
        arr = variant.format(field)
    except Exception:
        return None
    if arr is None or len(arr) <= sample_idx:
        return None
    row = arr[sample_idx]
    if not hasattr(row, "__len__"):
        return row
    return row[value_idx] if len(row) > value_idx else None


def infer_variant_type(ref: str, alt: str, is_symbolic: bool) -> str:
    if is_symbolic:
        return "DEL" if alt.strip("<>").startswith("DEL") else alt.strip("<>")
    if len(ref) == 1 and len(alt) == 1:
        return "SNV"
    if len(alt) > len(ref):
        return "Insertion"
    if len(alt) < len(ref):
        return "Deletion"
    return "Complex"
