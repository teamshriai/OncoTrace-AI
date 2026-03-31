export const datasets = [
  {
    name: 'GRAIL / Galleri (CCGA Study)',
    description:
      'The Circulating Cell-free Genome Atlas (CCGA) is a large-scale prospective study of cfDNA for multi-cancer early detection.',
    url: 'https://grail.com/clinical-studies/ccga-study/',
    dataTypes: ['cfDNA Methylation', 'Whole-Genome Sequencing', 'Targeted Sequencing'],
    cancerTypes: ['Pan-cancer (50+ types)'],
    sampleSize: '15,000+ participants',
    access: 'Restricted — requires data access agreement.',
    relevance: 'Gold standard for methylation-based cancer detection.',
  },
  {
    name: 'TCGA (The Cancer Genome Atlas)',
    description:
      'Comprehensive genomic characterization of 33 cancer types with matched normal samples.',
    url: 'https://portal.gdc.cancer.gov/',
    dataTypes: ['WGS', 'WES', 'RNA-Seq', 'Methylation Arrays', 'Clinical Data'],
    cancerTypes: ['33 cancer types'],
    sampleSize: '11,000+ patients',
    access: 'Open access (Level 2+3 data) via GDC Data Portal.',
    relevance: 'Essential for variant annotation and training tissue-of-origin classifiers.',
  },
  {
    name: 'MRD-EDGE / TRACERx',
    description:
      'Landmark longitudinal lung cancer study tracking tumor evolution through serial sampling.',
    url: 'https://www.tracer-x.com/',
    dataTypes: ['WES', 'Targeted Panel Sequencing', 'ctDNA', 'Clinical Outcomes'],
    cancerTypes: ['Non-Small Cell Lung Cancer (NSCLC)'],
    sampleSize: '800+ patients enrolled',
    access: 'Controlled access via EGA.',
    relevance: 'Best longitudinal ctDNA + outcome data for NSCLC.',
  },
  {
    name: 'INSPIRE / LIBERATE Studies',
    description:
      'Immunotherapy-focused liquid biopsy studies tracking ctDNA dynamics during checkpoint inhibitor therapy.',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8340509/',
    dataTypes: ['Targeted Panel (TSO500)', 'ctDNA Dynamics', 'TMB', 'Clinical Response'],
    cancerTypes: ['Pan-cancer (immunotherapy cohort)'],
    sampleSize: '200-500 patients',
    access: 'Published data available. Raw data via controlled access.',
    relevance: 'Ideal for training models on ctDNA dynamics during immunotherapy.',
  },
  {
    name: 'CPTAC (Clinical Proteomic Tumor Analysis Consortium)',
    description: 'Multi-omic characterization of tumors with proteomics, genomics, and clinical data.',
    url: 'https://proteomics.cancer.gov/programs/cptac',
    dataTypes: ['Proteomics', 'WGS/WES', 'RNA-Seq', 'Clinical'],
    cancerTypes: ['10+ cancer types'],
    sampleSize: '1,000+ tumors',
    access: 'Open access via CPTAC Data Portal and GDC.',
    relevance: 'Multi-omic features can enhance ctDNA-based models.',
  },
  {
    name: 'Foundation Medicine / AACR GENIE',
    description:
      'Commercially available liquid biopsy panel covering 300+ genes. AACR Project GENIE includes Foundation Medicine data.',
    url: 'https://www.aacr.org/professionals/research/aacr-project-genie/',
    dataTypes: ['Targeted Panel (324 genes)', 'MSI', 'TMB', 'Genomic Alterations'],
    cancerTypes: ['Pan-cancer'],
    sampleSize: '200,000+ samples in GENIE',
    access: 'Open access via Synapse.',
    relevance: 'Largest real-world genomic dataset.',
  },
  {
    name: 'Guardant Health LUNAR Studies',
    description:
      'Guardant360 CDx liquid biopsy data. LUNAR-1 (MRD detection) and LUNAR-2 (screening) datasets.',
    url: 'https://guardanthealth.com/clinical-studies/',
    dataTypes: ['ctDNA Panel (73-500 genes)', 'Epigenomics', 'Fragmentomics'],
    cancerTypes: ['Pan-cancer, CRC focus for LUNAR'],
    sampleSize: '1,000-10,000 per study',
    access: 'Published results. Raw data via collaboration.',
    relevance: 'State-of-the-art fragmentomics + ctDNA integration.',
  },
  {
    name: 'European Genome-phenome Archive (EGA)',
    description:
      'Repository of controlled-access genomic datasets. Search for "ctDNA" or "liquid biopsy".',
    url: 'https://ega-archive.org/',
    dataTypes: ['Various — WGS, Targeted, Methylation'],
    cancerTypes: ['Various'],
    sampleSize: 'Varies by study',
    access: 'Controlled access — requires DAC approval.',
    relevance: 'Aggregator of European ctDNA studies.',
  },
  {
    name: 'GEO / SRA — Public cfDNA Datasets',
    description: 'NCBI Gene Expression Omnibus and Sequence Read Archive contain published cfDNA datasets.',
    url: 'https://www.ncbi.nlm.nih.gov/geo/',
    dataTypes: ['Raw FASTQ', 'Methylation Arrays', 'Expression'],
    cancerTypes: ['Various'],
    sampleSize: 'Varies by study',
    access: 'Mostly open access.',
    relevance: 'Best source for raw cfDNA sequencing data.',
  },
  {
    name: 'DELFI (DNA Evaluation of Fragments)',
    description: 'Fragmentomics-based cancer detection with cfDNA fragment size profiles.',
    url: 'https://delfi-diagnostics.com/',
    dataTypes: ['Shallow WGS', 'Fragment Size Profiles', 'Genome-wide Coverage'],
    cancerTypes: ['Lung, Breast, Colorectal, Ovarian'],
    sampleSize: '1,500+ samples',
    access: 'Published data in Nature (2019). Code on GitHub.',
    relevance: 'Pioneer in fragmentomics analysis.',
  },
];

export const quickStartSteps = [
  {
    step: 1,
    title: 'Start with AACR GENIE',
    description: 'Open access, massive dataset. Download via Synapse for mutation landscapes.',
  },
  {
    step: 2,
    title: 'Use GEO/SRA for raw data',
    description: 'Search GSE79277 (fragmentomics) and GSE122126 (methylation).',
  },
  {
    step: 3,
    title: 'Apply for TRACERx via EGA',
    description: 'Best longitudinal ctDNA dataset with outcomes. Takes 2-4 weeks.',
  },
  {
    step: 4,
    title: 'Prototype with simulated data',
    description: "Use this dashboard's data to build your pipeline while waiting for access.",
  },
  {
    step: 5,
    title: 'Validate with published results',
    description: "Compare your model's performance against INSPIRE/LUNAR benchmarks.",
  },
];