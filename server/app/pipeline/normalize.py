"""bcftools norm wrapper -- decomposes multiallelic records and left-aligns
indels so coordinates match ClinVar's own normalized representation. This is
required before any ClinVar/CIViC coordinate join; skipping it silently
breaks those joins rather than raising a visible error.

Symbolic ALT (<DEL> etc.) records pass through largely unchanged by
`bcftools norm -m -any` -- they're matched by gene-overlap downstream, not
exact REF/ALT, so that's expected and not a bug in this step.

This module is also the single place that reconciles two classes of VCF
contig-naming problems against the reference FASTA, before they can surface
as confusing failures several pipeline stages later:

  1. A "chr1"-style upload against this codebase's bare-contig ("1")
     reference FASTAs (or vice versa) -- `bcftools norm` itself only warns
     about this, but fails fatally further downstream trying to fetch the
     sequence from the reference by its unreconciled name.
  2. A VCF whose header omits (or incompletely declares) ##contig lines --
     permitted by the VCF spec, and tolerated elsewhere in this pipeline
     (validate.py warns rather than fails on it), but `bcftools annotate`
     -- used downstream for the ClinVar/CIViC join, on this module's output
     -- refuses to run at all against a record whose CHROM isn't declared
     in its own header.

Both are reconciled here, once, so every downstream bcftools consumer of
this module's output sees a well-formed header regardless of what the
original upload declared.
"""

import subprocess
from pathlib import Path


class NormalizationError(Exception):
    pass


def _read_fai(reference_fasta: str) -> dict[str, int] | None:
    """Contig name -> length, from <reference_fasta>.fai. Returns None if the
    .fai is missing, so the caller can fall back to today's un-reconciled
    behavior rather than fail here."""
    fai_path = Path(f"{reference_fasta}.fai")
    if not fai_path.exists():
        return None
    lengths: dict[str, int] = {}
    with fai_path.open() as fh:
        for line in fh:
            fields = line.split("\t")
            if len(fields) >= 2:
                lengths[fields[0]] = int(fields[1])
    return lengths


def _declared_contigs(vcf_path: str) -> set[str]:
    """Contig names already declared via ##contig=<ID=...> header lines in
    vcf_path -- a header-only read, cheap even for a large file."""
    header = subprocess.run(["bcftools", "view", "-h", vcf_path], capture_output=True, text=True)
    if header.returncode != 0:
        raise NormalizationError(f"bcftools view -h failed: {header.stderr.strip()}")
    declared = set()
    for line in header.stdout.splitlines():
        if line.startswith("##contig=<"):
            for field in line[len("##contig=<"):-1].split(","):
                if field.startswith("ID="):
                    declared.add(field[3:])
                    break
    return declared


def _used_contigs(vcf_path: str) -> list[str]:
    """Contig names actually used by vcf_path's records, in order of first
    appearance -- the authoritative source of truth regardless of whether
    the header declares them (a VCF may validly omit ##contig lines, or
    declare them incompletely)."""
    query = subprocess.run(["bcftools", "query", "-f", "%CHROM\n", vcf_path], capture_output=True, text=True)
    if query.returncode != 0:
        raise NormalizationError(f"bcftools query failed: {query.stderr.strip()}")
    return list(dict.fromkeys(c for c in query.stdout.splitlines() if c))


def _chr_prefix_rename_map(used_contigs: list[str], reference_contigs: set[str]) -> dict[str, str]:
    """Maps each used contig name not already present in reference_contigs to
    the reference's own spelling, but only when the two names differ purely
    by a "chr" prefix, in either direction. A contig that doesn't resolve
    either way is left out of the mapping -- bcftools norm will still raise
    its own specific error for a genuinely absent contig rather than this
    function guessing (and silently mis-renaming)."""
    mapping: dict[str, str] = {}
    for contig in used_contigs:
        if contig in reference_contigs:
            continue
        if contig.startswith("chr") and contig[3:] in reference_contigs:
            mapping[contig] = contig[3:]
        elif not contig.startswith("chr") and f"chr{contig}" in reference_contigs:
            mapping[contig] = f"chr{contig}"
    return mapping


def _reconcile_contigs(
    input_path: str, output_path: str, mapping: dict[str, str], missing: list[str], fai_lengths: dict[str, int]
) -> str:
    """Single streaming pass over input_path that (a) renames CHROM values
    and any matching ##contig declaration per `mapping`, and (b) injects a
    ##contig=<ID=...,length=...> declaration -- sourced from the reference's
    own .fai -- for every contig in `missing` (already the post-rename
    spelling) that the header doesn't declare. Both problems produce the
    same downstream failure, so both are fixed in the same pass rather than
    as separate bcftools calls -- this is deliberately plain text, not
    `bcftools annotate --rename-chrs` or `bcftools reheader`: both parse the
    full VCF body and refuse to run at all against a record whose CHROM
    isn't declared in the header, which is exactly the condition this
    function exists to fix, making bcftools's own validation circular here.

    Missing declarations are inserted immediately before the #CHROM
    column-header line, the required position for VCF meta-information.
    Output path is derived from `output_path` so it lands in the same
    per-request workdir the caller already cleans up."""
    reconciled_path = f"{output_path}.reconciled-contigs.vcf"
    pending = list(missing)
    with open(input_path) as src, open(reconciled_path, "w") as dst:
        for line in src:
            newline = "\n" if line.endswith("\n") else ""
            body = line[:-1] if newline else line

            if body.startswith("##contig=<") and body.endswith(">"):
                fields = body[len("##contig=<"):-1].split(",")
                for idx, field in enumerate(fields):
                    if field.startswith("ID=") and field[3:] in mapping:
                        fields[idx] = "ID=" + mapping[field[3:]]
                        break
                dst.write("##contig=<" + ",".join(fields) + ">" + newline)
            elif body.startswith("#CHROM"):
                for contig in pending:
                    length = fai_lengths.get(contig)
                    dst.write(f"##contig=<ID={contig},length={length}>\n" if length else f"##contig=<ID={contig}>\n")
                pending = []
                dst.write(line)
            elif body.startswith("#"):
                dst.write(line)
            elif "\t" in body:
                chrom, rest = body.split("\t", 1)
                dst.write(mapping.get(chrom, chrom) + "\t" + rest + newline)
            else:
                dst.write(line)
    return reconciled_path


def normalize_vcf(input_path: str, output_path: str, reference_fasta: str) -> None:
    if not Path(reference_fasta).exists():
        raise NormalizationError(
            f"Reference FASTA not found at {reference_fasta}. Run scripts/download_references.sh "
            f"to provision it before analysis can run."
        )

    # Reconcile contig naming/header-declaration gaps before `norm` (and
    # every downstream bcftools step) ever runs. Already-compliant files
    # (correctly-named, fully-declared -- the common case) pay only for the
    # two cheap scans below; the actual rewrite pass only runs when a real
    # gap is found.
    norm_input = input_path
    fai_lengths = _read_fai(reference_fasta)
    if fai_lengths is not None:
        reference_contigs = set(fai_lengths)
        used = _used_contigs(input_path)
        rename_map = _chr_prefix_rename_map(used, reference_contigs)

        declared_after_rename = {rename_map.get(c, c) for c in _declared_contigs(input_path)}
        final_contigs = (rename_map.get(c, c) for c in used)
        missing = [c for c in dict.fromkeys(final_contigs) if c not in declared_after_rename]

        if rename_map or missing:
            norm_input = _reconcile_contigs(input_path, output_path, rename_map, missing, fai_lengths)

    result = subprocess.run(
        ["bcftools", "norm", "-f", reference_fasta, "-m", "-any", "-O", "v", "-o", output_path, norm_input],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise NormalizationError(f"bcftools norm failed: {result.stderr.strip()}")
