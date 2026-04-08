import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from 'recharts';

// ─── Mock Data (unchanged) ─────────────────────────────────────────
const patients = [
  {
    id: 'PT-001',
    name: 'Lakshmi Devi',
    age: 58,
    sex: 'Female',
    cancerType: 'Non-Small Cell Lung Cancer (NSCLC)',
    stage: 'Stage IV',
    diagnosisDate: '2023-01-15',
    currentTherapy: 'Osimertinib',
    riskScore: 78,
    riskCategory: 'high',
    progressionProbability: 0.82,
    predictedRECIST: 'Progressive Disease',
    timeToProgression: 4.2,
    confidenceScore: 0.88,
    timepoints: [
      {
        id: 'T1',
        label: 'Baseline',
        date: '2023-01-20',
        dayFromBaseline: 0,
        treatmentPhase: 'Pre-treatment',
        tumorFraction: 0.08,
        totalCfDNA: 22.5,
        shortFragmentRatio: 0.42,
        methylationScore: 0.45,
        genomeInstabilityScore: 52,
        mutations: [
          { gene: 'EGFR', variant: 'L858R', vaf: 0.12, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R273H', vaf: 0.08, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: 'Multiple pulmonary nodules',
      },
      {
        id: 'T2',
        label: '6 Weeks',
        date: '2023-03-03',
        dayFromBaseline: 42,
        treatmentPhase: 'On TKI',
        tumorFraction: 0.04,
        totalCfDNA: 15.2,
        shortFragmentRatio: 0.38,
        methylationScore: 0.32,
        genomeInstabilityScore: 38,
        mutations: [
          { gene: 'EGFR', variant: 'L858R', vaf: 0.05, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R273H', vaf: 0.04, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: 'Partial response',
      },
      {
        id: 'T3',
        label: '12 Weeks',
        date: '2023-04-14',
        dayFromBaseline: 84,
        treatmentPhase: 'On TKI',
        tumorFraction: 0.06,
        totalCfDNA: 18.8,
        shortFragmentRatio: 0.41,
        methylationScore: 0.38,
        genomeInstabilityScore: 45,
        mutations: [
          { gene: 'EGFR', variant: 'L858R', vaf: 0.07, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R273H', vaf: 0.05, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'EGFR', variant: 'T790M', vaf: 0.03, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: null,
      },
      {
        id: 'T4',
        label: '18 Weeks',
        date: '2023-05-26',
        dayFromBaseline: 126,
        treatmentPhase: 'On TKI',
        tumorFraction: 0.11,
        totalCfDNA: 28.4,
        shortFragmentRatio: 0.44,
        methylationScore: 0.52,
        genomeInstabilityScore: 61,
        mutations: [
          { gene: 'EGFR', variant: 'L858R', vaf: 0.13, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R273H', vaf: 0.09, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'EGFR', variant: 'T790M', vaf: 0.08, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'MET', variant: 'Amplification', vaf: 0.06, type: 'CNV', pathogenicity: 'Likely Pathogenic' },
        ],
        imagingResult: 'Disease progression',
      },
    ],
  },
  {
    id: 'PT-002',
    name: 'Priya Ramesh',
    age: 45,
    sex: 'Female',
    cancerType: 'Colorectal Cancer (CRC)',
    stage: 'Stage III',
    diagnosisDate: '2023-02-10',
    currentTherapy: 'FOLFOX',
    riskScore: 42,
    riskCategory: 'moderate',
    progressionProbability: 0.48,
    predictedRECIST: 'Stable Disease',
    timeToProgression: 9.5,
    confidenceScore: 0.76,
    timepoints: [
      {
        id: 'T1',
        label: 'Baseline',
        date: '2023-02-15',
        dayFromBaseline: 0,
        treatmentPhase: 'Pre-treatment',
        tumorFraction: 0.05,
        totalCfDNA: 18.2,
        shortFragmentRatio: 0.39,
        methylationScore: 0.35,
        genomeInstabilityScore: 41,
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.09, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'APC', variant: 'R1450*', vaf: 0.07, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: null,
      },
      {
        id: 'T2',
        label: '8 Weeks',
        date: '2023-04-12',
        dayFromBaseline: 56,
        treatmentPhase: 'On Chemo',
        tumorFraction: 0.03,
        totalCfDNA: 12.5,
        shortFragmentRatio: 0.36,
        methylationScore: 0.28,
        genomeInstabilityScore: 32,
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.04, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'APC', variant: 'R1450*', vaf: 0.03, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: 'Stable disease',
      },
      {
        id: 'T3',
        label: '16 Weeks',
        date: '2023-06-07',
        dayFromBaseline: 112,
        treatmentPhase: 'On Chemo',
        tumorFraction: 0.04,
        totalCfDNA: 14.8,
        shortFragmentRatio: 0.37,
        methylationScore: 0.31,
        genomeInstabilityScore: 36,
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.05, type: 'SNV', pathogenicity: 'Pathogenic' },
          { gene: 'APC', variant: 'R1450*', vaf: 0.04, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: 'Stable disease',
      },
    ],
  },
  {
    id: 'PT-003',
    name: 'Meera Krishnan',
    age: 52,
    sex: 'Female',
    cancerType: 'Breast Cancer (ER+/HER2-)',
    stage: 'Stage II',
    diagnosisDate: '2023-03-05',
    currentTherapy: 'Letrozole + Palbociclib',
    riskScore: 28,
    riskCategory: 'low',
    progressionProbability: 0.22,
    predictedRECIST: 'Partial Response',
    timeToProgression: 18.2,
    confidenceScore: 0.82,
    timepoints: [
      {
        id: 'T1',
        label: 'Baseline',
        date: '2023-03-10',
        dayFromBaseline: 0,
        treatmentPhase: 'Pre-treatment',
        tumorFraction: 0.02,
        totalCfDNA: 8.5,
        shortFragmentRatio: 0.34,
        methylationScore: 0.22,
        genomeInstabilityScore: 25,
        mutations: [{ gene: 'PIK3CA', variant: 'H1047R', vaf: 0.04, type: 'SNV', pathogenicity: 'Pathogenic' }],
        imagingResult: null,
      },
      {
        id: 'T2',
        label: '12 Weeks',
        date: '2023-06-02',
        dayFromBaseline: 84,
        treatmentPhase: 'On Treatment',
        tumorFraction: 0.01,
        totalCfDNA: 5.2,
        shortFragmentRatio: 0.31,
        methylationScore: 0.15,
        genomeInstabilityScore: 18,
        mutations: [{ gene: 'PIK3CA', variant: 'H1047R', vaf: 0.02, type: 'SNV', pathogenicity: 'Pathogenic' }],
        imagingResult: 'Partial response',
      },
      {
        id: 'T3',
        label: '24 Weeks',
        date: '2023-08-25',
        dayFromBaseline: 168,
        treatmentPhase: 'On Treatment',
        tumorFraction: 0.008,
        totalCfDNA: 4.1,
        shortFragmentRatio: 0.29,
        methylationScore: 0.12,
        genomeInstabilityScore: 15,
        mutations: [{ gene: 'PIK3CA', variant: 'H1047R', vaf: 0.01, type: 'SNV', pathogenicity: 'Pathogenic' }],
        imagingResult: 'Near complete response',
      },
    ],
  },
  {
    id: 'PT-004',
    name: 'Shiv Ram',
    age: 59,
    sex: 'Male',
    cancerType: 'Micro lab data - Colorectal Adenocarcinoma',
    stage: 'Stage IV (Metastatic)',
    primaryTreatment: 'FOLFOX + Bevacizumab',
    currentTherapy: 'Second-line FOLFIRI',
    diagnosisDate: '2023-12-10',
    riskScore: 76,
    riskCategory: 'high',
    progressionProbability: 0.81,
    predictedRECIST: 'Progressive Disease (PD)',
    timeToProgression: 2.0,
    confidenceScore: 0.89,
    timepoints: [
      {
        id: 'T1',
        date: '2024-01-05',
        dayFromBaseline: 0,
        label: 'Baseline (Pre-treatment)',
        tumorFraction: 0.14,
        totalCfDNA: 48.6,
        shortFragmentRatio: 0.38,
        methylationScore: 0.69,
        genomeInstabilityScore: 66,
        treatmentPhase: 'Pre-treatment',
        imagingResult: 'Multiple liver metastases (largest 3.8cm)',
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.052, type: 'Missense', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R175H', vaf: 0.089, type: 'Missense', pathogenicity: 'Pathogenic' },
        ],
      },
      {
        id: 'T2',
        date: '2024-02-05',
        dayFromBaseline: 30,
        label: 'Cycle 1',
        tumorFraction: 0.16,
        totalCfDNA: 52.4,
        shortFragmentRatio: 0.4,
        methylationScore: 0.72,
        genomeInstabilityScore: 70,
        treatmentPhase: 'On-treatment',
        imagingResult: null,
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.061, type: 'Missense', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R175H', vaf: 0.102, type: 'Missense', pathogenicity: 'Pathogenic' },
        ],
      },
      {
        id: 'T3',
        date: '2024-03-05',
        dayFromBaseline: 60,
        label: 'Cycle 2',
        tumorFraction: 0.2,
        totalCfDNA: 59.8,
        shortFragmentRatio: 0.44,
        methylationScore: 0.75,
        genomeInstabilityScore: 78,
        treatmentPhase: 'On-treatment',
        imagingResult: 'Mild increase in lesion size',
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.078, type: 'Missense', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R175H', vaf: 0.134, type: 'Missense', pathogenicity: 'Pathogenic' },
        ],
      },
      {
        id: 'T4',
        date: '2024-04-05',
        dayFromBaseline: 90,
        label: 'Progression',
        tumorFraction: 0.27,
        totalCfDNA: 68.1,
        shortFragmentRatio: 0.47,
        methylationScore: 0.79,
        genomeInstabilityScore: 84,
        treatmentPhase: 'Progression',
        imagingResult: 'New hepatic lesions detected',
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.112, type: 'Missense', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R175H', vaf: 0.182, type: 'Missense', pathogenicity: 'Pathogenic' },
        ],
      },
      {
        id: 'T5',
        date: '2024-05-05',
        dayFromBaseline: 120,
        label: 'Post Therapy Switch (Projected)',
        tumorFraction: 0.21,
        totalCfDNA: 55.3,
        shortFragmentRatio: 0.42,
        methylationScore: 0.73,
        genomeInstabilityScore: 72,
        treatmentPhase: 'Second-line therapy',
        imagingResult: 'Partial stabilization',
        mutations: [
          { gene: 'KRAS', variant: 'G12D', vaf: 0.085, type: 'Missense', pathogenicity: 'Pathogenic' },
          { gene: 'TP53', variant: 'R175H', vaf: 0.141, type: 'Missense', pathogenicity: 'Pathogenic' },
        ],
      },
    ],
  },
];

const getFeatureImportance = (patient) => {
  const latest = patient.timepoints[patient.timepoints.length - 1];
  return [
    {
      feature: 'Tumor Fraction',
      importance: latest.tumorFraction * 500,
      direction: 'positive',
      value: `${(latest.tumorFraction * 100).toFixed(2)}%`,
    },
    {
      feature: 'Methylation Score',
      importance: latest.methylationScore * 100,
      direction: 'positive',
      value: latest.methylationScore.toFixed(2),
    },
    {
      feature: 'Total cfDNA',
      importance: latest.totalCfDNA * 2,
      direction: 'positive',
      value: `${latest.totalCfDNA.toFixed(1)} ng/mL`,
    },
    {
      feature: 'Max VAF',
      importance: Math.max(...latest.mutations.map((m) => m.vaf)) * 200,
      direction: 'positive',
      value: `${(Math.max(...latest.mutations.map((m) => m.vaf)) * 100).toFixed(1)}%`,
    },
    {
      feature: 'Genome Instability',
      importance: latest.genomeInstabilityScore * 0.8,
      direction: 'positive',
      value: latest.genomeInstabilityScore.toString(),
    },
    {
      feature: 'Fragment Ratio',
      importance: latest.shortFragmentRatio * 80,
      direction: 'positive',
      value: latest.shortFragmentRatio.toFixed(2),
    },
    {
      feature: 'Mutation Count',
      importance: latest.mutations.length * 8,
      direction: 'positive',
      value: latest.mutations.length.toString(),
    },
  ].sort((a, b) => b.importance - a.importance);
};

const datasets = [
  {
    name: 'AACR Project GENIE',
    description:
      'Large-scale cancer genomic database with >100,000 samples. Includes clinical and genomic data from real-world cancer patients across multiple institutions.',
    dataTypes: ['Targeted sequencing', 'Clinical outcomes', 'Treatment data'],
    cancerTypes: ['Pan-cancer', 'NSCLC', 'Breast', 'Colorectal', 'Melanoma'],
    sampleSize: '~140,000 samples',
    access: 'Open access after registration',
    relevance:
      'Gold standard for training models on real genomic-clinical associations. Includes mutation data similar to ctDNA panels.',
    url: 'https://www.aacr.org/professionals/research/aacr-project-genie/',
  },
  {
    name: 'TCGA (The Cancer Genome Atlas)',
    description:
      'Comprehensive genomic characterization of 33 cancer types. Includes WGS, RNA-seq, methylation, and clinical data.',
    dataTypes: ['WGS', 'RNA-seq', 'Methylation', 'CNV', 'Clinical'],
    cancerTypes: ['33 cancer types', 'LUAD', 'BRCA', 'COAD', 'many more'],
    sampleSize: '~11,000 patients',
    access: 'Open via GDC Data Portal',
    relevance:
      'Rich multi-omics data for feature engineering. Methylation and CNV profiles mimic ctDNA signals.',
    url: 'https://portal.gdc.cancer.gov/',
  },
  {
    name: 'PCAWG (Pan-Cancer Analysis of Whole Genomes)',
    description:
      'Whole genome sequencing of 2,658 cancers across 38 tumor types. Deep genomic characterization including structural variants.',
    dataTypes: ['WGS', 'Structural variants', 'Driver mutations'],
    cancerTypes: ['38 tumor types'],
    sampleSize: '2,658 samples',
    access: 'Open via ICGC Data Portal',
    relevance: 'Comprehensive mutation landscapes. Useful for variant annotation and pathogenicity training.',
    url: 'https://dcc.icgc.org/pcawg',
  },
  {
    name: 'MSK-IMPACT Clinical Sequencing',
    description:
      'Memorial Sloan Kettering targeted sequencing cohort with longitudinal data and treatment outcomes.',
    dataTypes: ['Targeted panel (468 genes)', 'Longitudinal', 'Treatment response'],
    cancerTypes: ['Pan-cancer', 'focus on solid tumors'],
    sampleSize: '~50,000 patients',
    access: 'Controlled access via cBioPortal',
    relevance:
      'Best publicly available longitudinal sequencing data. Directly models ctDNA monitoring scenarios.',
    url: 'https://www.cbioportal.org/study/summary?id=msk_impact_2017',
  },
  {
    name: 'CPTAC (Clinical Proteomic Tumor Analysis)',
    description:
      'Multi-omics cancer datasets including genomics, proteomics, and imaging. High-quality clinical annotations.',
    dataTypes: ['Genomics', 'Proteomics', 'Imaging', 'Clinical'],
    cancerTypes: ['LUAD', 'BRCA', 'COAD', 'HNSCC', 'others'],
    sampleSize: '~1,000 tumors',
    access: 'Open via PDC',
    relevance: 'Multi-modal data fusion practice. Imaging correlation with molecular features.',
    url: 'https://proteomics.cancer.gov/programs/cptac',
  },
];

const quickStartSteps = [
  { step: 1, title: 'Get TCGA Data', description: 'Download mutation + methylation data for your cancer type' },
  { step: 2, title: 'Simulate ctDNA', description: 'Downsample VAFs to mimic low tumor fractions' },
  { step: 3, title: 'Extract Features', description: 'VAF, TF, methylation, fragment size proxies' },
  { step: 4, title: 'Add Clinical Data', description: 'Treatment, stage, imaging from GENIE/MSK' },
  { step: 5, title: 'Train Models', description: 'XGBoost for snapshot, LSTM for temporal' },
  { step: 6, title: 'Evaluate', description: 'AUC, sensitivity, time-dependent ROC' },
];

// ─── SVG Icon Components ───────────────────────────────────────────
const DashboardIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChartIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BrainIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ShieldIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DatabaseIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const ArchitectureIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const UserIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ArrowIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const ExternalIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const DNAIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const BloodIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const MicroscopeIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const BoltIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CameraIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AlertIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const BeakerIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const CogIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HospitalIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

// ─── Navigation Items ──────────────────────────────────────────────
const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'dynamics', label: 'ctDNA Dynamics', Icon: ChartIcon },
  { id: 'predictions', label: 'AI Predictions', Icon: BrainIcon },
  { id: 'clinical', label: 'Clinical View', Icon: ShieldIcon },
  { id: 'datasets', label: 'Datasets & Resources', Icon: DatabaseIcon },
  { id: 'architecture', label: 'System Architecture', Icon: ArchitectureIcon },
];

// ─── Chart Colors ──────────────────────────────────────────────────
const chartColors = ['#3b82f6', '#6366f1', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6'];

// ─── Tooltip Styles ────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 12,
  color: '#374151',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '8px 12px',
};

// ─── Main Demo Component ───────────────────────────────────────────
export default function Demo() {
  const [page, setPage] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'high':
        return 'bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 border border-red-200/50';
      case 'moderate':
        return 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 text-amber-700 border border-amber-200/50';
      default:
        return 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 border border-emerald-200/50';
    }
  };

  const getRiskDot = (category) => {
    switch (category) {
      case 'high':
        return 'bg-red-500';
      case 'moderate':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <DNAIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              OncoTrace AI
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer hover:bg-slate-100/50"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}: {p.cancerType.split('(')[0].trim()}
                </option>
              ))}
            </select>

            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm flex items-center gap-2 ${getRiskBadgeClass(patient.riskCategory)}`}>
              <span className={`w-2 h-2 rounded-full ${getRiskDot(patient.riskCategory)} animate-pulse`} />
              <span className="hidden sm:inline uppercase tracking-wide">{patient.riskCategory} Risk</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1920px] mx-auto flex">
        {/* Desktop Sidebar */}
        <nav className="w-64 shrink-0 min-h-[calc(100vh-4rem)] bg-white/60 backdrop-blur-xl border-r border-slate-200/60 sticky top-16 self-start hidden lg:block">
          <div className="p-4 space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  page === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <item.Icon className={`w-5 h-5 ${page === item.id ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex-1 min-w-0 flex flex-col items-center py-2.5 text-[10px] transition-all ${
                page === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <item.Icon className="w-5 h-5 mb-1" />
              <span className="truncate px-1 font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0">
          {page === 'dashboard' && <DashboardPage patient={patient} onNavigate={setPage} />}
          {page === 'dynamics' && <DynamicsPage patient={patient} />}
          {page === 'predictions' && <PredictionsPage patient={patient} />}
          {page === 'clinical' && <ClinicalPage patient={patient} />}
          {page === 'datasets' && <DatasetsPage />}
          {page === 'architecture' && <ArchitecturePage />}
        </main>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ────────────────────────────────────────────────
function DashboardPage({ patient, onNavigate }) {
  const latest = patient.timepoints[patient.timepoints.length - 1];
  const prev = patient.timepoints.length > 1 ? patient.timepoints[patient.timepoints.length - 2] : null;

  const tfChange = prev ? ((latest.tumorFraction - prev.tumorFraction) / prev.tumorFraction) * 100 : 0;
  const cfDNAChange = prev ? ((latest.totalCfDNA - prev.totalCfDNA) / prev.totalCfDNA) * 100 : 0;

  const stats = [
    { label: 'Tumor Fraction', value: `${(latest.tumorFraction * 100).toFixed(1)}%`, change: tfChange, Icon: DNAIcon },
    { label: 'cfDNA Level', value: `${latest.totalCfDNA.toFixed(1)} ng/mL`, change: cfDNAChange, Icon: BloodIcon },
    { label: 'Mutations Tracked', value: latest.mutations.length.toString(), change: prev ? latest.mutations.length - prev.mutations.length : 0, Icon: MicroscopeIcon, isCount: true },
    { label: 'Risk Score', value: `${patient.riskScore}/100`, change: 0, Icon: BoltIcon },
  ];

  const chartData = patient.timepoints.map((tp) => ({
    name: tp.label.length > 12 ? tp.label.substring(0, 12) + '…' : tp.label,
    'Tumor Fraction': +(tp.tumorFraction * 100).toFixed(2),
    'cfDNA (ng/mL)': tp.totalCfDNA,
  }));

  const getRiskColorClass = (category) => {
    switch (category) {
      case 'high':
        return 'text-red-600';
      case 'moderate':
        return 'text-amber-600';
      default:
        return 'text-emerald-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <UserIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {patient.id} — {patient.name}
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  {patient.cancerType} • {patient.stage}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Age:</span>
                <span className="text-slate-900 font-semibold">{patient.age}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Sex:</span>
                <span className="text-slate-900 font-semibold">{patient.sex}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Diagnosis:</span>
                <span className="text-slate-900 font-semibold">{patient.diagnosisDate}</span>
              </span>
              <span className="hidden xl:flex items-center gap-2">
                <span className="text-slate-400">Therapy:</span>
                <span className="text-slate-900 font-semibold">{patient.currentTherapy}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 lg:min-w-[120px]">
            <div className={`text-5xl font-black ${getRiskColorClass(patient.riskCategory)}`}>{patient.riskScore}</div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200/50 rounded-xl flex items-center justify-center">
                <s.Icon className="w-5 h-5 text-slate-600" />
              </div>
              {s.change !== 0 && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    (s.isCount ? s.change > 0 : s.change > 0) ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {s.change > 0 ? '↑' : '↓'} {s.isCount ? Math.abs(s.change) : `${Math.abs(s.change).toFixed(0)}%`}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{s.value}</div>
            <div className="text-xs text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Tumor Fraction Over Time" subtitle="Serial monitoring of circulating tumor DNA">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="%" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="Tumor Fraction" stroke="#3b82f6" fill="url(#tfGradient)" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="cfDNA Concentration" subtitle="Total cell-free DNA quantification">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit=" ng" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="cfDNA (ng/mL)" stroke="#6366f1" fill="url(#cfGradient)" strokeWidth={3} dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Timeline & Mutations */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
            Collection Timeline
          </h3>
          <div className="space-y-0">
            {patient.timepoints.map((tp, i) => (
              <div key={tp.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 transition-all ${
                      i === patient.timepoints.length - 1
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/50'
                        : 'bg-slate-300'
                    }`}
                  />
                  {i < patient.timepoints.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1.5 min-h-[24px]" />}
                </div>
                <div className="pb-5 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{tp.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tp.date} • Day {tp.dayFromBaseline}
                  </p>
                  {tp.imagingResult && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-blue-600">
                      <CameraIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{tp.imagingResult}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mutations Table */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Latest Mutations — {latest.label}
          </h3>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                  <th className="pb-3 pr-4 pl-6 sm:pl-0">Gene</th>
                  <th className="pb-3 pr-4">Variant</th>
                  <th className="pb-3 pr-4">VAF</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4 sm:pr-0">Pathogenicity</th>
                </tr>
              </thead>
              <tbody>
                {latest.mutations.map((m, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 pr-4 pl-6 sm:pl-0 font-bold text-blue-600">{m.gene}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-slate-600 bg-slate-50/50 rounded px-2">{m.variant}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                            style={{ width: `${Math.min(m.vaf * 500, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 font-semibold">{(m.vaf * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500 font-medium">{m.type}</td>
                    <td className="py-3 pr-4 sm:pr-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                          m.pathogenicity === 'Pathogenic' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {m.pathogenicity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { page: 'dynamics', title: 'ctDNA Dynamics', desc: 'Track VAF, tumor fraction, and molecular changes', gradient: 'from-blue-500 to-cyan-500', Icon: ChartIcon },
          { page: 'predictions', title: 'AI Predictions', desc: 'View progression risk, RECIST prediction, explainability', gradient: 'from-indigo-500 to-purple-500', Icon: BrainIcon },
          { page: 'clinical', title: 'Clinical View', desc: 'Data visualization and monitoring history', gradient: 'from-amber-500 to-orange-500', Icon: ShieldIcon },
        ].map((card) => (
          <button
            key={card.page}
            onClick={() => onNavigate(card.page)}
            className="group bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 text-left hover:shadow-xl hover:shadow-slate-300/50 hover:-translate-y-1 transition-all duration-200"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
              <card.Icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-slate-900 mb-1.5">{card.title}</h4>
            <p className="text-xs text-slate-500 mb-4">{card.desc}</p>
            <div className="text-xs text-blue-600 flex items-center gap-1.5 font-semibold group-hover:gap-2.5 transition-all">
              Explore <ArrowIcon className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ctDNA DYNAMICS PAGE ───────────────────────────────────────────
function DynamicsPage({ patient }) {
  const allGenes = [...new Set(patient.timepoints.flatMap((tp) => tp.mutations.map((m) => m.gene)))];

  const vafData = patient.timepoints.map((tp) => {
    const row = { name: tp.id, day: tp.dayFromBaseline };
    allGenes.forEach((gene) => {
      const mut = tp.mutations.find((m) => m.gene === gene);
      row[gene] = mut ? +(mut.vaf * 100).toFixed(2) : 0;
    });
    return row;
  });

  const latest = patient.timepoints[patient.timepoints.length - 1];

  const radarData = [
    { metric: 'Tumor Fraction', value: (latest.tumorFraction * 100) / 0.2, fullMark: 100 },
    { metric: 'cfDNA Level', value: Math.min((latest.totalCfDNA / 60) * 100, 100), fullMark: 100 },
    { metric: 'Fragment Ratio', value: (latest.shortFragmentRatio * 100) / 0.5, fullMark: 100 },
    { metric: 'Methylation', value: latest.methylationScore * 100, fullMark: 100 },
    { metric: 'Genome Instability', value: latest.genomeInstabilityScore, fullMark: 100 },
    { metric: 'Max VAF', value: (Math.max(...latest.mutations.map((m) => m.vaf)) * 100) / 0.2, fullMark: 100 },
  ];

  const trendData = patient.timepoints.map((tp) => ({
    name: tp.id,
    'Tumor Fraction (%)': +(tp.tumorFraction * 100).toFixed(2),
    'Methylation Score': +(tp.methylationScore * 100).toFixed(1),
    'Genome Instability': tp.genomeInstabilityScore,
    'Fragment Ratio (×100)': +(tp.shortFragmentRatio * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="ctDNA Dynamics" subtitle={`Longitudinal tracking of circulating tumor DNA biomarkers for ${patient.id}`} />

      {/* VAF Tracking */}
      <ChartCard title="Variant Allele Frequency (VAF) Tracking" subtitle="Each line tracks a specific mutation across serial blood draws">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={vafData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              unit="%"
              label={{ value: 'VAF (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 20 }} />
            {allGenes.map((gene, i) => (
              <Line
                key={gene}
                type="monotone"
                dataKey={gene}
                stroke={chartColors[i % chartColors.length]}
                strokeWidth={3}
                dot={{ r: 5, fill: chartColors[i % chartColors.length], strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <ChartCard title="Multi-Analyte Profile (Latest)" subtitle="Normalized feature values for the most recent timepoint">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#475569' }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 100]} />
              <Radar name="Current" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Feature Trends */}
        <ChartCard title="Feature Trends" subtitle="All biomarker channels over time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 20 }} />
              <Line type="monotone" dataKey="Tumor Fraction (%)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
              <Line type="monotone" dataKey="Methylation Score" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
              <Line type="monotone" dataKey="Genome Instability" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
              <Line type="monotone" dataKey="Fragment Ratio (×100)" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Mutation Heatmap */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Mutation Heatmap (VAF % across timepoints)
        </h3>
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <th className="pb-3 pr-4 pl-6 sm:pl-0 sticky left-0 bg-white/80 backdrop-blur-sm">Gene</th>
                <th className="pb-3 pr-4">Variant</th>
                {patient.timepoints.map((tp) => (
                  <th key={tp.id} className="pb-3 px-2 text-center">
                    {tp.id}
                  </th>
                ))}
                <th className="pb-3 px-2 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {allGenes.map((gene) => {
                const variants = [
                  ...new Set(
                    patient.timepoints.flatMap((tp) => tp.mutations.filter((m) => m.gene === gene).map((m) => m.variant))
                  ),
                ];
                return variants.map((variant) => {
                  const vafs = patient.timepoints.map((tp) => {
                    const m = tp.mutations.find((mut) => mut.gene === gene && mut.variant === variant);
                    return m ? m.vaf : 0;
                  });
                  const maxVaf = Math.max(...vafs);
                  const lastTwo = vafs.slice(-2);
                  const trend = lastTwo.length === 2 ? (lastTwo[1] > lastTwo[0] ? '↗' : lastTwo[1] < lastTwo[0] ? '↘' : '→') : '—';
                  const trendColor = lastTwo.length === 2 ? (lastTwo[1] > lastTwo[0] ? 'text-red-500' : lastTwo[1] < lastTwo[0] ? 'text-emerald-500' : 'text-slate-400') : 'text-slate-400';

                  return (
                    <tr key={`${gene}-${variant}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 pr-4 pl-6 sm:pl-0 font-bold text-blue-600 sticky left-0 bg-white/80 backdrop-blur-sm">{gene}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-600 bg-slate-50/50 rounded px-2">{variant}</td>
                      {vafs.map((vaf, i) => {
                        const intensity = maxVaf > 0 ? vaf / maxVaf : 0;
                        return (
                          <td key={i} className="py-3 px-2 text-center">
                            <span
                              className="inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all"
                              style={{
                                backgroundColor: vaf > 0 ? `rgba(239, 68, 68, ${0.1 + intensity * 0.3})` : 'transparent',
                                color: vaf > 0 ? '#dc2626' : '#cbd5e1',
                              }}
                            >
                              {vaf > 0 ? (vaf * 100).toFixed(1) : '—'}
                            </span>
                          </td>
                        );
                      })}
                      <td className={`py-3 px-2 text-center text-lg font-bold ${trendColor}`}>{trend}</td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AI PREDICTIONS PAGE ───────────────────────────────────────────
function PredictionsPage({ patient }) {
  const features = getFeatureImportance(patient);
  const maxImportance = Math.max(...features.map((f) => f.importance));

  const predictionHeads = [
    {
      title: 'Progression (Binary)',
      value: patient.progressionProbability > 0.5 ? 'YES' : 'NO',
      probability: patient.progressionProbability,
      color: patient.progressionProbability > 0.5 ? 'text-red-600' : 'text-emerald-600',
      gradient: patient.progressionProbability > 0.5 ? 'from-red-500 to-rose-600' : 'from-emerald-500 to-teal-600',
      desc: 'Likelihood of disease progression within 3 months',
    },
    {
      title: 'RECIST Prediction',
      value: patient.predictedRECIST,
      probability: null,
      color: patient.predictedRECIST.includes('Progressive')
        ? 'text-red-600'
        : patient.predictedRECIST.includes('Partial')
        ? 'text-emerald-600'
        : 'text-amber-600',
      gradient: patient.predictedRECIST.includes('Progressive')
        ? 'from-red-500 to-rose-600'
        : patient.predictedRECIST.includes('Partial')
        ? 'from-emerald-500 to-teal-600'
        : 'from-amber-500 to-orange-600',
      desc: 'Predicted RECIST 1.1 response category',
    },
    {
      title: 'Time to Progression',
      value: patient.timeToProgression ? `${patient.timeToProgression} mo` : 'N/A',
      probability: null,
      color:
        patient.timeToProgression && patient.timeToProgression < 6
          ? 'text-red-600'
          : patient.timeToProgression && patient.timeToProgression < 12
          ? 'text-amber-600'
          : 'text-emerald-600',
      gradient:
        patient.timeToProgression && patient.timeToProgression < 6
          ? 'from-red-500 to-rose-600'
          : patient.timeToProgression && patient.timeToProgression < 12
          ? 'from-amber-500 to-orange-600'
          : 'from-emerald-500 to-teal-600',
      desc: 'Estimated time until next progression event',
    },
    {
      title: 'Model Confidence',
      value: `${(patient.confidenceScore * 100).toFixed(0)}%`,
      probability: patient.confidenceScore,
      color:
        patient.confidenceScore > 0.8 ? 'text-emerald-600' : patient.confidenceScore > 0.6 ? 'text-amber-600' : 'text-red-600',
      gradient:
        patient.confidenceScore > 0.8 ? 'from-emerald-500 to-teal-600' : patient.confidenceScore > 0.6 ? 'from-amber-500 to-orange-600' : 'from-red-500 to-rose-600',
      desc: 'Overall prediction confidence interval',
    },
  ];

  const modelComparison = [
    { model: 'XGBoost (Snapshot)', AUC: 0.82, Sensitivity: 0.78, Specificity: 0.85 },
    { model: 'Random Forest', AUC: 0.79, Sensitivity: 0.75, Specificity: 0.83 },
    { model: 'LSTM (Longitudinal)', AUC: 0.88, Sensitivity: 0.85, Specificity: 0.89 },
    { model: 'Transformer', AUC: 0.91, Sensitivity: 0.88, Specificity: 0.92 },
    { model: 'Fusion (Ensemble)', AUC: 0.93, Sensitivity: 0.9, Specificity: 0.94 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="AI Prediction Engine" subtitle={`Multi-head prediction with explainability for ${patient.id}`} />

      {/* Prediction Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {predictionHeads.map((head, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5 hover:shadow-xl hover:shadow-slate-300/50 transition-all">
            <div className={`w-10 h-10 bg-gradient-to-br ${head.gradient} rounded-xl flex items-center justify-center shadow-lg mb-3`}>
              <BrainIcon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">{head.title}</p>
            <p className={`text-2xl font-black ${head.color} mb-2`}>{head.value}</p>
            {head.probability !== null && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>0%</span>
                  <span className="text-slate-600 font-bold">{(head.probability * 100).toFixed(0)}%</span>
                  <span>100%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all bg-gradient-to-r ${head.gradient}`}
                    style={{ width: `${head.probability * 100}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-3">{head.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SHAP Feature Importance */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
            Feature Importance (SHAP-style)
          </h3>
          <p className="text-xs text-slate-500 mb-5">Which features are driving the prediction</p>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-xs text-slate-600 text-right font-medium truncate">{f.feature}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        f.direction === 'positive' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      style={{ width: `${(f.importance / maxImportance) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono font-bold w-20 shrink-0 ${f.direction === 'positive' ? 'text-red-600' : 'text-blue-600'}`}>
                    {f.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-5 pt-5 border-t border-slate-200 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 bg-gradient-to-br from-red-500 to-rose-600 rounded" /> Increases risk
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded" /> Decreases risk
            </span>
          </div>
        </div>

        {/* Model Comparison */}
        <ChartCard title="Model Performance Comparison" subtitle="Cross-validated metrics across architectures">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="model" tick={{ fontSize: 9, fill: '#475569' }} width={140} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 20 }} />
              <Bar dataKey="AUC" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              <Bar dataKey="Sensitivity" fill="#6366f1" radius={[0, 6, 6, 0]} />
              <Bar dataKey="Specificity" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Architecture Notes */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 border border-blue-200/60 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2">
          <BrainIcon className="w-5 h-5" />
          Model Architecture Notes
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 text-xs text-slate-600">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <p className="font-bold text-slate-800 mb-2">Branch A: Snapshot Models</p>
            <p>
              XGBoost and Random Forest trained on single-timepoint feature vectors. Best for patients with limited longitudinal data.
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <p className="font-bold text-slate-800 mb-2">Branch B: Longitudinal Models</p>
            <p>
              LSTM and Transformer architectures processing full time-series. Captures temporal dynamics and trend patterns.
            </p>
          </div>
        </div>
        <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60 text-xs text-slate-600">
          <p className="font-bold text-slate-800 mb-2">Fusion Layer</p>
          <p>
            Attention-weighted ensemble combining both branches. Weights longitudinal predictions higher when ≥3 timepoints available.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── CLINICAL VIEW PAGE ────────────────────────────────────────────
function ClinicalPage({ patient }) {
  const latest = patient.timepoints[patient.timepoints.length - 1];
  const prev = patient.timepoints.length > 1 ? patient.timepoints[patient.timepoints.length - 2] : null;

  const observations = [];

  if (prev && latest.tumorFraction > prev.tumorFraction * 1.5) {
    observations.push({
      severity: 'critical',
      message: `Tumor fraction increased ${((latest.tumorFraction / prev.tumorFraction - 1) * 100).toFixed(0)}% from previous draw`,
      Icon: AlertIcon,
    });
  }

  const newMuts = latest.mutations.filter((m) => prev && !prev.mutations.some((pm) => pm.gene === m.gene && pm.variant === m.variant));
  if (newMuts.length > 0) {
    observations.push({
      severity: 'critical',
      message: `New mutation(s) detected: ${newMuts.map((m) => `${m.gene} ${m.variant}`).join(', ')}`,
      Icon: AlertIcon,
    });
  }

  const resistanceMuts = latest.mutations.filter((m) => ['T790M', 'C797S', 'Loss', 'Amplification'].includes(m.variant));
  if (resistanceMuts.length > 0) {
    observations.push({
      severity: 'warning',
      message: `Resistance mechanism detected: ${resistanceMuts.map((m) => `${m.gene} ${m.variant}`).join(', ')}`,
      Icon: AlertIcon,
    });
  }

  if (latest.methylationScore > 0.6) {
    observations.push({
      severity: 'warning',
      message: `Elevated methylation score (${latest.methylationScore.toFixed(2)}) suggests high tumor burden`,
      Icon: InfoIcon,
    });
  }

  if (patient.confidenceScore < 0.75) {
    observations.push({
      severity: 'info',
      message: `Model confidence is moderate (${(patient.confidenceScore * 100).toFixed(0)}%)`,
      Icon: InfoIcon,
    });
  }

  const getRiskColorClass = (category) => {
    switch (category) {
      case 'high':
        return 'text-red-600';
      case 'moderate':
        return 'text-amber-600';
      default:
        return 'text-emerald-600';
    }
  };

  const getRiskGradient = (category) => {
    switch (category) {
      case 'high':
        return 'from-red-500 to-rose-600';
      case 'moderate':
        return 'from-amber-500 to-orange-600';
      default:
        return 'from-emerald-500 to-teal-600';
    }
  };

  const getRiskDot = (category) => {
    switch (category) {
      case 'high':
        return 'bg-red-500';
      case 'moderate':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Clinical View" subtitle={`Data visualization and monitoring for ${patient.id} — ${patient.cancerType}`} />

      {/* Risk Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-slate-600" />
              Risk Assessment
            </h3>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-black ${getRiskColorClass(patient.riskCategory)}`}>{patient.riskScore}/100</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Progression Probability:</span>
                <span className="font-bold text-slate-900">{(patient.progressionProbability * 100).toFixed(0)}%</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-slate-900">{(patient.confidenceScore * 100).toFixed(0)}%</span>
              </span>
            </div>
          </div>
          <div className={`px-6 py-4 rounded-2xl text-center bg-gradient-to-br ${getRiskGradient(patient.riskCategory)}/10 border border-${patient.riskCategory === 'high' ? 'red' : patient.riskCategory === 'moderate' ? 'amber' : 'emerald'}-200/60`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`w-3 h-3 rounded-full ${getRiskDot(patient.riskCategory)} animate-pulse`} />
              <div className={`text-sm font-bold uppercase ${getRiskColorClass(patient.riskCategory)} tracking-wide`}>{patient.riskCategory} Risk</div>
            </div>
            <div className={`text-3xl font-black ${getRiskColorClass(patient.riskCategory)}`}>{patient.riskScore}</div>
          </div>
        </div>
      </div>

      {/* Observations */}
      {observations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
            Key Observations
          </h3>
          {observations.map((obs, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 border flex items-start gap-3 backdrop-blur-sm ${
                obs.severity === 'critical'
                  ? 'bg-red-50/80 border-red-200/60'
                  : obs.severity === 'warning'
                  ? 'bg-amber-50/80 border-amber-200/60'
                  : 'bg-blue-50/80 border-blue-200/60'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                obs.severity === 'critical'
                  ? 'bg-red-100'
                  : obs.severity === 'warning'
                  ? 'bg-amber-100'
                  : 'bg-blue-100'
              }`}>
                <obs.Icon className={`w-4 h-4 ${
                  obs.severity === 'critical' ? 'text-red-600' : obs.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                }`} />
              </div>
              <span
                className={`text-sm font-medium ${
                  obs.severity === 'critical' ? 'text-red-800' : obs.severity === 'warning' ? 'text-amber-800' : 'text-blue-800'
                }`}
              >
                {obs.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring History */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
          Monitoring History & Response Correlation
        </h3>
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
                <th className="pb-3 pr-4 pl-6 sm:pl-0">Timepoint</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Phase</th>
                <th className="pb-3 pr-4">TF</th>
                <th className="pb-3 pr-4">cfDNA</th>
                <th className="pb-3 pr-4">Mutations</th>
                <th className="pb-3 pr-4 sm:pr-0">Imaging</th>
              </tr>
            </thead>
            <tbody>
              {patient.timepoints.map((tp, i) => (
                <tr key={tp.id} className={`border-b border-slate-100 transition-colors ${i === patient.timepoints.length - 1 ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}>
                  <td className="py-3 pr-4 pl-6 sm:pl-0 font-bold text-slate-900">{tp.id}</td>
                  <td className="py-3 pr-4 text-slate-600 font-medium">{tp.date}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 font-semibold">{tp.treatmentPhase}</span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-slate-700 font-semibold">{(tp.tumorFraction * 100).toFixed(1)}%</td>
                  <td className="py-3 pr-4 font-mono text-slate-700 font-semibold">{tp.totalCfDNA.toFixed(1)}</td>
                  <td className="py-3 pr-4 text-slate-700 font-semibold">{tp.mutations.length}</td>
                  <td className="py-3 pr-4 sm:pr-0 text-xs text-slate-500">{tp.imagingResult || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/60 rounded-2xl p-5 text-xs text-slate-600">
        <p className="font-bold text-slate-700 mb-1.5 flex items-center gap-2">
          <HospitalIcon className="w-4 h-4" />
          Research Prototype
        </p>
        <p>
          This system is for research and demonstration purposes only. All data shown is simulated. This tool is not intended for clinical decision-making.
        </p>
      </div>
    </div>
  );
}

// ─── DATASETS PAGE ─────────────────────────────────────────────────
function DatasetsPage() {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const getAccessBadge = (access) => {
    if (access.startsWith('Open')) return { class: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60', icon: 'Open Access', IconComponent: CheckCircleIcon };
    if (access.startsWith('Controlled')) return { class: 'bg-amber-50 text-amber-700 border border-amber-200/60', icon: 'Controlled', IconComponent: ShieldIcon };
    return { class: 'bg-red-50 text-red-700 border border-red-200/60', icon: 'Restricted', IconComponent: AlertIcon };
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Datasets & Resources" subtitle="Where to find real liquid biopsy and ctDNA datasets for your project" />

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200/60 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-700 mb-5 flex items-center gap-2">
          <BoltIcon className="w-5 h-5" />
          Quick Start: Recommended Data Pipeline
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStartSteps.map((step) => (
            <div key={step.step} className="flex gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/60">
              <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                {step.step}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{step.title}</p>
                <p className="text-xs text-slate-600 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Cards */}
      <div className="space-y-4">
        {datasets.map((ds, i) => {
          const badge = getAccessBadge(ds.access);
          return (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl hover:shadow-slate-300/50 transition-all"
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h4 className="text-base font-bold text-slate-900">{ds.name}</h4>
                    <span className={`text-xs px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 ${badge.class}`}>
                      <badge.IconComponent className="w-3.5 h-3.5" />
                      {badge.icon}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{ds.description}</p>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${expandedIdx === i ? 'rotate-180' : ''}`} />
              </button>

              {expandedIdx === i && (
                <div className="px-6 pb-6 space-y-5 border-t border-slate-200 pt-5 bg-slate-50/30">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Data Types</p>
                      <div className="flex flex-wrap gap-2">
                        {ds.dataTypes.map((dt) => (
                          <span key={dt} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-700 font-medium">
                            {dt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Cancer Types</p>
                      <div className="flex flex-wrap gap-2">
                        {ds.cancerTypes.map((ct) => (
                          <span key={ct} className="px-2.5 py-1 bg-purple-50 rounded-lg text-xs text-purple-700 font-medium">
                            {ct}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Sample Size</p>
                      <p className="text-sm text-slate-700 font-semibold">{ds.sampleSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Access</p>
                      <p className="text-sm text-slate-700 font-semibold">{ds.access}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Why This Dataset</p>
                    <p className="text-sm text-blue-600 font-medium">{ds.relevance}</p>
                  </div>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                  >
                    Visit Resource <ExternalIcon className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tools Section */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
          Additional Resources & Tools
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 text-sm">
          <ToolSection
            title="Bioinformatics Tools"
            color="blue"
            tools={[
              { name: 'ichorCNA', desc: 'Tumor fraction estimation from shallow WGS', url: 'https://github.com/broadinstitute/ichorCNA' },
              { name: 'VarDict', desc: 'Variant calling for low-frequency mutations', url: 'https://github.com/AstraZeneca-NGS/VarDict' },
              { name: 'GATK/Mutect2', desc: 'Somatic variant calling gold standard', url: 'https://gatk.broadinstitute.org' },
              { name: 'cfDNAPro', desc: 'cfDNA fragment size analysis', url: 'https://bioconductor.org/packages/cfDNAPro' },
            ]}
          />
          <ToolSection
            title="ML Frameworks"
            color="indigo"
            tools={[
              { name: 'PyTorch + TSAI', desc: 'Time-series AI for longitudinal ctDNA', url: 'https://github.com/timeseriesAI/tsai' },
              { name: 'XGBoost', desc: 'Gradient boosting for snapshot predictions', url: 'https://xgboost.readthedocs.io' },
              { name: 'SHAP', desc: 'Model explainability for clinical trust', url: 'https://shap.readthedocs.io' },
              { name: 'Lifelines', desc: 'Survival analysis for time-to-progression', url: 'https://lifelines.readthedocs.io' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ─── ARCHITECTURE PAGE ─────────────────────────────────────────────
function ArchitecturePage() {
  const modules = [
    {
      id: 1,
      title: 'Data Extraction',
      Icon: BeakerIcon,
      gradient: 'from-blue-500 to-cyan-500',
      components: [
        { name: 'Targeted Panel Sequencing', desc: 'Track mutations via VAF', input: 'cfDNA', output: 'VAF values' },
        { name: 'Shallow WGS', desc: 'CNA & tumor fraction (ichorCNA)', input: 'cfDNA', output: 'CNA profile' },
        { name: 'cfDNA Methylation', desc: 'Methylation-based detection', input: 'cfDNA', output: 'Meth scores' },
      ],
    },
    {
      id: 2,
      title: 'Feature Engineering',
      Icon: CogIcon,
      gradient: 'from-emerald-500 to-teal-500',
      components: [
        { name: 'Per-timepoint Features', desc: 'VAF, TF, methylation, GI score', input: 'Raw data', output: 'Feature vector' },
        { name: 'Longitudinal Dynamics', desc: 'Slopes, deltas, trends', input: 'Multi-timepoint', output: 'Temporal features' },
        { name: 'Clinical Integration', desc: 'Treatment, imaging, demographics', input: 'Clinical data', output: 'Combined matrix' },
      ],
    },
    {
      id: 3,
      title: 'AI Prediction Engine',
      Icon: BrainIcon,
      gradient: 'from-indigo-500 to-purple-500',
      components: [
        { name: 'Branch A: Snapshot', desc: 'XGBoost / Random Forest', input: 'Single vector', output: 'Snapshot pred' },
        { name: 'Branch B: Longitudinal', desc: 'LSTM / Transformer', input: 'Sequence', output: 'Temporal pred' },
        { name: 'Fusion Layer', desc: 'Attention-weighted ensemble', input: 'Both preds', output: 'Final output' },
      ],
    },
    {
      id: 4,
      title: 'Clinical Interface',
      Icon: HospitalIcon,
      gradient: 'from-amber-500 to-orange-500',
      components: [
        { name: 'Risk Stratification', desc: 'Low/Moderate/High risk levels', input: 'Predictions', output: 'Risk category' },
        { name: 'Explainability (SHAP)', desc: 'Feature-level explanations', input: 'Model internals', output: 'SHAP values' },
        { name: 'Confidence Intervals', desc: 'Uncertainty quantification', input: 'Ensemble variance', output: 'CI bounds' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="System Architecture" subtitle="Complete pipeline from patient blood samples to predictions" />

      {/* Flow Diagram */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200/60 rounded-2xl px-6 py-4 shadow-md">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <BloodIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">Patient Blood Samples</p>
              <p className="text-xs text-slate-500 mt-0.5">Serial Liquid Biopsies: T1 → T2 → T3 → T4 → T5</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-px h-10 bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />
        </div>

        <div className="space-y-5">
          {modules.map((mod, i) => (
            <div key={mod.id}>
              <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${mod.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <mod.Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Module {mod.id}</p>
                    <h3 className="text-lg font-bold text-slate-900">{mod.title}</h3>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {mod.components.map((comp, j) => (
                    <div key={j} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/40 hover:border-slate-300 hover:shadow-md transition-all">
                      <p className="text-sm font-bold text-slate-800 mb-2">{comp.name}</p>
                      <p className="text-xs text-slate-600 mb-3">{comp.desc}</p>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="text-slate-400 font-medium">Input:</span>
                        <span className="text-blue-600 font-semibold">{comp.input}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-medium">Output:</span>
                        <span className="text-emerald-600 font-semibold">{comp.output}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {i < modules.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-slate-200" />
                    <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Data Processing', items: ['pysam', 'cyvcf2', 'pandas', 'pyranges', 'bedtools'] },
          { title: 'Variant Calling', items: ['GATK/MuTect2', 'VarDict', 'ichorCNA', 'methylKit'] },
          { title: 'ML/DL Models', items: ['PyTorch', 'XGBoost', 'scikit-learn', 'tsai', 'lifelines'] },
          { title: 'Explainability', items: ['SHAP', 'LIME', 'captum', 'matplotlib', 'plotly'] },
        ].map((cat) => (
          <div key={cat.title} className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-5">
            <p className="text-sm font-bold text-slate-700 mb-4">{cat.title}</p>
            <div className="space-y-2">
              {cat.items.map((item) => (
                <div key={item} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                  <div className="w-1.5 h-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reusable Components ───────────────────────────────────────────
function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-2">
      <h2 className="text-2xl font-black text-slate-900 mb-1.5">{title}</h2>
      <p className="text-slate-600 text-sm">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg shadow-slate-200/50 p-6">
      <h3 className="text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
        <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
        {title}
      </h3>
      {subtitle && <p className="text-xs text-slate-500 mb-5">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </div>
  );
}

function ToolSection({ title, color, tools }) {
  const colorClass = color === 'blue' ? 'from-blue-500 to-cyan-500' : color === 'indigo' ? 'from-indigo-500 to-purple-500' : 'from-emerald-500 to-teal-500';

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-slate-800 flex items-center gap-2">
        <div className={`w-1 h-4 bg-gradient-to-b ${colorClass} rounded-full`} />
        {title}
      </h4>
      {tools.map((tool) => (
        <a
          key={tool.name}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 border border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all"
        >
          <p className={`font-bold text-slate-800 mb-1`}>{tool.name}</p>
          <p className="text-xs text-slate-600">{tool.desc}</p>
        </a>
      ))}
    </div>
  );
}