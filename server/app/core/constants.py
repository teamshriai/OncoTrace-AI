"""QC thresholds and reference text. Thresholds here come from the variant
callers' own published conventions -- they are not invented for this project.
Sources are noted inline so a reviewing bioinformatician can verify them.
"""

# VarDict's own documented filter-trigger conventions (see VarDict README and
# the ##FILTER header lines it emits).
STRAND_BIAS_SBF_MAX = 0.05      # SBF < 0.05 AND ...
STRAND_BIAS_ODDRATIO_MIN = 5.0  # ... OddRatio > 5 => strand-bias risk
MSI_HIGH_MIN = 12               # matches VarDict's MSI12 filter trigger
MSI_ELEVATED_MIN = 6
NM_FLAG_MIN = 5.25              # matches VarDict's NM5.25 filter trigger

# Depth/MQ interpretation bands, standard somatic-panel practice.
DEPTH_EXCELLENT = 500
DEPTH_ADEQUATE = 100
MQ_GOOD = 50
MQ_ACCEPTABLE = 30
SN_GOOD = 10
SN_ACCEPTABLE = 1.5

# VAF tiers. Deliberately neutral naming: VAF alone cannot distinguish a
# tissue sample from plasma-derived ctDNA without paired sample-type metadata,
# which a VCF does not carry.
VAF_CLONAL_MIN = 0.30
VAF_SUBCLONAL_MIN = 0.05

VAF_TIER_NOTE = (
    "VAF tier alone cannot distinguish tissue from plasma-derived (ctDNA) samples without "
    "paired sample-type metadata, which this file does not carry."
)

VAF_HISTOGRAM_BUCKETS = [
    ("0-10%", 0.0, 0.10),
    ("10-20%", 0.10, 0.20),
    ("20-30%", 0.20, 0.30),
    ("30-50%", 0.30, 0.50),
    ("50-70%", 0.50, 0.70),
    ("70-90%", 0.70, 0.90),
    ("90-100%", 0.90, 1.0001),
]

FILTER_DESCRIPTIONS = {
    "PASS": "All filters passed",
    "q22.5": "Mean Base Quality Below 22.5",
    "Q10": "Mean Mapping Quality Below 10",
    "p8": "Mean Position in Reads < 8",
    "SN1.5": "Signal to Noise < 1.5",
    "Bias": "Strand bias detected",
    "pSTD": "Position in Reads has STD of 0",
    "d3": "Total Depth < 3",
    "v2": "Variant Depth < 2",
    "f0.01": "Allele Frequency < 1%",
    "MSI12": "Variant in MSI region >=12 non-monomer or >=13 monomer",
    "NM5.25": "Mean mismatches >=5.25 (likely false positive)",
    "InGap": "Variant in deletion gap",
    "InIns": "Variant adjacent to insertion",
    "Cluster0bp": "Two variants within 0 bp",
    "LongMSI": "Somatic variant flanked by long A/T (>=14 bp)",
    "AMPBIAS": "Variant has amplicon bias",
}

FIELD_GLOSSARY = [
    {"field": "VAF", "full_name": "Variant Allele Frequency",
     "definition": "Fraction of reads supporting the alt allele. Typical somatic heterozygous: ~50%."},
    {"field": "DP (Depth)", "full_name": "Total Read Depth",
     "definition": "Total reads at the variant position. Adequate >=100x, good >=500x, excellent >=1000x."},
    {"field": "MQ", "full_name": "Mean Mapping Quality",
     "definition": "Average mapping quality of supporting reads. MQ=60 is perfectly unique; >=30 is acceptable."},
    {"field": "SN", "full_name": "Signal-to-Noise Ratio",
     "definition": "Ratio of variant-supporting reads to background. Good: >=10, acceptable: >=1.5."},
    {"field": "HIAF", "full_name": "High-Quality Allele Frequency",
     "definition": "VAF computed using only high-quality bases; large divergence from VAF suggests a base-quality issue."},
    {"field": "MSI", "full_name": "Microsatellite Instability Score",
     "definition": "Score >1 indicates the variant sits in a microsatellite region. >=12 triggers the MSI12 filter."},
    {"field": "NM", "full_name": "Mean Mismatches per Read",
     "definition": "Average mismatches in supporting reads. >=5.25 triggers the NM5.25 filter."},
    {"field": "SBF", "full_name": "Strand Bias Fisher p-value",
     "definition": "Low p-value indicates potential strand-specific bias; interpreted together with Odds Ratio."},
    {"field": "ODDRATIO", "full_name": "Strand Bias Odds Ratio",
     "definition": "Odds ratio of forward vs. reverse strand support. >5 with SBF<0.05 suggests artefact risk."},
    {"field": "HICNT / HICOV", "full_name": "High-Quality Reads / Coverage",
     "definition": "High-quality variant-supporting reads and total high-quality coverage at the position."},
]

GLOBAL_DISCLAIMER = (
    "Early-stage research pipeline. Variant calls are parsed from the submitted file and annotated "
    "against locally-hosted open-source databases; no trained or clinically validated predictive model "
    "is involved. Not a diagnostic device and not a substitute for review by a qualified molecular "
    "pathologist or tumor board."
)

ACTIONABILITY_DISCLAIMER_TEMPLATE = (
    "Actionability annotations are derived from a cached CIViC snapshot ({civic_release}) -- a "
    "community-curated research database -- and are not FDA-cleared companion diagnostic calls or a "
    "substitute for molecular tumor board review. Gene-level matches indicate published relevance for "
    "the gene, NOT confirmation that this specific variant carries that evidence."
)

PRIORITIZATION_DISCLAIMER = (
    "This is a disclosed, auditable heuristic computed from real values in the submitted file -- not a "
    "trained or validated predictive model. See the component breakdown for exactly how it was produced."
)

PANEL_DENSITY_DISCLAIMER = (
    "Not validated tumor mutational burden. Small-panel mutation density is not comparable to "
    "whole-exome-based TMB and must not be used for immunotherapy-eligibility decisions."
)

QC_LAYER_NOTE = (
    "QC/artifact flags are computed independently of clinical significance and run before "
    "annotation. A variant can carry both a pathogenic classification and an artifact flag; "
    "both are reported. Flags are derived from the caller's own reported INFO fields, so each "
    "can be re-checked against the raw VCF."
)

GERMLINE_HEURISTIC_NOTE = (
    "Germline-vs-somatic labels below are a HEURISTIC based on allele fraction and population "
    "frequency, not a determination. Without a matched normal sample, tumor-only data cannot "
    "definitively distinguish a germline variant from a somatic one."
)

# Population allele frequency source. Full gnomAD is not provisioned; ClinVar's
# VCF carries AF_ESP/AF_EXAC/AF_TGP, which covers ClinVar-listed variants only.
POPULATION_AF_SOURCE_NOTE = (
    "Population allele frequencies come from the ClinVar VCF's AF_ESP / AF_EXAC / AF_TGP fields "
    "(GO-ESP, ExAC, 1000 Genomes). This covers only variants present in ClinVar -- it is not a "
    "full gnomAD lookup, so absence of a frequency here does not mean a variant is rare."
)

COMMON_POPULATION_AF_THRESHOLD = 0.01

TIER_DEFINITIONS = {
    "tier_1_actionable_somatic": (
        "ClinVar Pathogenic/Likely-pathogenic or CIViC-supported at or above the evidence floor, "
        "on a confirmed reference build, without a germline allele-fraction pattern, and QC-clean."
    ),
    "tier_2_uncertain_needs_review": (
        "Uncertain significance, or QC-flagged, or in microsatellite/homopolymer context, or "
        "called by a single unvalidated caller."
    ),
    "tier_3_germline_pattern_clinically_relevant": (
        "Pathogenic or likely-pathogenic but with an allele fraction/zygosity pattern consistent "
        "with a germline variant -- a hereditary-risk finding, which is a different clinical "
        "pathway from a somatic driver, not a lesser one."
    ),
    "tier_4_benign_or_artifact": (
        "Benign, likely benign, common population variant, or flagged as a technical artifact."
    ),
    "not_evaluated": (
        "The annotation stages needed to tier these variants did not run."
    ),
}

HEADLINE_METRIC_FORMULA = (
    "review_priority_count = (2 x Tier 1 count) + (1 x Tier 2 count). "
    "A weighted count of variants needing review -- NOT a percentage, NOT a severity score, "
    "and not comparable across samples of different panel sizes."
)
