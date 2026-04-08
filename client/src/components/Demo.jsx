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

// ─── Mock Data ─────────────────────────────────────────────────────
import { patient } from '../data/realVCFData.js';

const patients = [patient,
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
        mutations: [
          { gene: 'PIK3CA', variant: 'H1047R', vaf: 0.04, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
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
        mutations: [
          { gene: 'PIK3CA', variant: 'H1047R', vaf: 0.02, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
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
        mutations: [
          { gene: 'PIK3CA', variant: 'H1047R', vaf: 0.01, type: 'SNV', pathogenicity: 'Pathogenic' },
        ],
        imagingResult: 'Near complete response',
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
      importance: Math.max(...latest.mutations.map((m) => m.af || m.vaf)) * 200,
      importance: Math.max(...latest.mutations.map((m) => m.af || m.vaf)) * 200,
      direction: 'positive',
      value: `${(Math.max(...latest.mutations.map((m) => m.af || m.vaf)) * 100).toFixed(1)}%`,
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

// ─── SVG Icon Component ────────────────────────────────────────────
const Icon = ({ d, className = '' }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

// ─── Icon Paths ────────────────────────────────────────────────────
const icons = {
  dashboard:
    'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  chart:
    'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  brain:
    'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  shield:
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  database:
    'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  arrow: 'M13 7l5 5m0 0l-5 5m5-5H6',
  external:
    'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  architecture:
    'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
};

// ─── Navigation Items ──────────────────────────────────────────────
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
  { id: 'dynamics', label: 'ctDNA Dynamics', icon: icons.chart },
  { id: 'predictions', label: 'AI Predictions', icon: icons.brain },
  { id: 'clinical', label: 'Clinical View', icon: icons.shield },
  { id: 'datasets', label: 'Datasets & Resources', icon: icons.database },
  { id: 'architecture', label: 'How OncoTrace AI works', icon: icons.architecture },
];

// ─── Chart Colors ──────────────────────────────────────────────────
const chartColors = [
  '#3b82f6',
  '#6366f1',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#14b8a6',
];

// ─── Tooltip Styles ────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 12,
  color: '#374151',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

// ─── Main Demo Component ───────────────────────────────────────────
export default function Demo() {
  const [page, setPage] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'high':
        return 'bg-red-50 text-red-600 ring-1 ring-red-200';
      case 'moderate':
        return 'bg-amber-50 text-amber-600 ring-1 ring-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200';
    }
  };

  const getRiskEmoji = (category) => {
    switch (category) {
      case 'high':
        return '🔴';
      case 'moderate':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold tracking-tight text-gray-900">ctDNA Monitor</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 max-w-[140px] sm:max-w-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}: {p.cancerType.split('(')[0].trim()}
                </option>
              ))}
            </select>

            <div
              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getRiskBadgeClass(
                patient.riskCategory
              )}`}
            >
              {getRiskEmoji(patient.timepoints[patient.timepoints.length-1].riskLevel.toLowerCase())}{' '}
              <span className="hidden sm:inline">{patient.timepoints[patient.timepoints.length-1].riskLevel.toUpperCase()} RISK</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <nav className="w-56 shrink-0 border-r border-gray-200 min-h-[calc(100vh-4rem)] bg-white sticky top-16 self-start hidden lg:block">
          <div className="p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  page === item.id
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon d={item.icon} className={page === item.id ? 'text-blue-600' : ''} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 flex overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex-1 min-w-[60px] flex flex-col items-center py-2 text-[10px] ${
                page === item.id ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <Icon d={item.icon} className="w-4 h-4" />
              <span className="mt-0.5 truncate px-1">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 min-w-0">
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
    {
      label: 'Tumor Fraction',
      value: `${(latest.tumorFraction * 100).toFixed(1)}%`,
      change: tfChange,
      icon: '🧬',
    },
    {
      label: 'cfDNA Level',
      value: `${latest.totalCfDNA.toFixed(1)} ng/mL`,
      change: cfDNAChange,
      icon: '🩸',
    },
    {
      label: 'Mutations Tracked',
      value: latest.mutations.length.toString(),
      change: prev ? latest.mutations.length - prev.mutations.length : 0,
      icon: '🔬',
      isCount: true,
    },
    {
      label: 'Risk Score',
    value: `${patient.timepoints[patient.timepoints.length-1].riskScore}/100`,
      change: 0,
      icon: '⚡',
    },
  ];

  const chartData = patient.timepoints.map((tp) => ({
    name: tp.label.length > 12 ? tp.label.substring(0, 12) + '…' : tp.label,
    'Tumor Fraction': +(tp.tumorFraction * 100).toFixed(2),
    'cfDNA (ng/mL)': tp.totalCfDNA,
  }));

  const getRiskColorClass = (category) => {
    switch (category) {
      case 'high':
        return 'text-red-500';
      case 'moderate':
        return 'text-amber-500';
      default:
        return 'text-emerald-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
                <Icon d={icons.user} className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {patient.id} — {patient.name}
                </h2>
                <p className="text-gray-500 text-sm">
                  {patient.cancerType} • {patient.stage}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500">
              <span>
                Age: <span className="text-gray-900 font-medium">{patient.age}</span>
              </span>
              <span>
                Sex: <span className="text-gray-900 font-medium">{patient.sex}</span>
              </span>
              <span>
                Dx: <span className="text-gray-900 font-medium">{patient.diagnosisDate}</span>
              </span>
              <span className="hidden sm:inline">
                Therapy: <span className="text-gray-900 font-medium">{patient.currentTherapy}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2">
            <div className={`text-3xl sm:text-4xl font-black ${getRiskColorClass(patient.riskCategory)}`}>
              {patient.riskScore}
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Risk Score</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl sm:text-2xl">{s.icon}</span>
              {s.change !== 0 && (
                <span
                  className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full ${
                    (s.isCount ? s.change > 0 : s.change > 0)
                      ? 'bg-red-50 text-red-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {s.change > 0 ? '↑' : '↓'}{' '}
                  {s.isCount ? Math.abs(s.change) : `${Math.abs(s.change).toFixed(0)}%`}
                </span>
              )}
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-[10px] sm:text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Tumor Fraction Over Time">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="Tumor Fraction"
                stroke="#3b82f6"
                fill="url(#tfGradient)"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="cfDNA Concentration">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cfGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} unit=" ng" />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="cfDNA (ng/mL)"
                stroke="#6366f1"
                fill="url(#cfGradient)"
                strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Timeline & Mutations */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Collection Timeline</h3>
          <div className="space-y-0">
            {patient.timepoints.map((tp, i) => (
              <div key={tp.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      i === patient.timepoints.length - 1
                        ? 'bg-blue-500 ring-4 ring-blue-500/20'
                        : 'bg-gray-300'
                    }`}
                  />
                  {i < patient.timepoints.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 my-1 min-h-[20px]" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-gray-900">{tp.label}</p>
                  <p className="text-xs text-gray-400">
                    {tp.date} • Day {tp.dayFromBaseline}
                  </p>
                  {tp.imagingResult && (
                    <p className="text-xs text-blue-600 mt-1">📷 {tp.imagingResult}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mutations Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Latest Mutations — {latest.label}
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-200">
                  <th className="pb-2 pr-4 pl-4 sm:pl-0">Gene</th>
                  <th className="pb-2 pr-4">Variant</th>
                  <th className="pb-2 pr-4">VAF</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4 sm:pr-0">Pathogenicity</th>
                </tr>
              </thead>
              <tbody>
                {latest.mutations.map((m, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2.5 pr-4 pl-4 sm:pl-0 font-semibold text-blue-600">
                      {m.gene}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-gray-600">{m.variant}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 sm:w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                            style={{ width: `${Math.min(m.vaf * 500, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{(m.vaf * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-500">{m.type}</td>
                    <td className="py-2.5 pr-4 sm:pr-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          m.pathogenicity === 'Pathogenic'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-amber-50 text-amber-600'
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
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            page: 'dynamics',
            title: 'ctDNA Dynamics',
            desc: 'Track VAF, tumor fraction, and molecular changes',
            color: 'from-blue-50 to-blue-50/50 border-blue-200',
          },
          {
            page: 'predictions',
            title: 'AI Predictions',
            desc: 'View progression risk, RECIST prediction, explainability',
            color: 'from-indigo-50 to-purple-50 border-indigo-200',
          },
          {
            page: 'clinical',
            title: 'Clinical View',
            desc: 'Data visualization and monitoring history',
            color: 'from-amber-50 to-orange-50 border-amber-200',
          },
        ].map((card) => (
          <button
            key={card.page}
            onClick={() => onNavigate(card.page)}
            className={`bg-gradient-to-br ${card.color} border rounded-xl p-4 sm:p-5 text-left hover:scale-[1.02] hover:shadow-md transition-all`}
          >
            <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
            <p className="text-xs text-gray-500">{card.desc}</p>
            <div className="mt-3 text-xs text-blue-600 flex items-center gap-1 font-medium">
              Explore <Icon d={icons.arrow} className="w-3 h-3" />
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
    {
      metric: 'Max VAF',
      value: (Math.max(...latest.mutations.map((m) => m.vaf)) * 100) / 0.2,
      fullMark: 100,
    },
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
      <PageHeader
        title="ctDNA Dynamics"
        subtitle={`Longitudinal tracking of circulating tumor DNA biomarkers for ${patient.id}`}
      />

      {/* VAF Tracking */}
      <ChartCard
        title="Variant Allele Frequency (VAF) Tracking"
        subtitle="Each line tracks a specific mutation across serial blood draws"
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vafData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              unit="%"
              label={{ value: 'VAF (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 11 }}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {allGenes.map((gene, i) => (
              <Line
                key={gene}
                type="monotone"
                dataKey={gene}
                stroke={chartColors[i % chartColors.length]}
                strokeWidth={2}
                dot={{ r: 4, fill: chartColors[i % chartColors.length] }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <ChartCard
          title="Multi-Analyte Profile (Latest)"
          subtitle="Normalized feature values for the most recent timepoint"
        >
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: '#9ca3af' }} domain={[0, 100]} />
              <Radar
                name="Current"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Feature Trends */}
        <ChartCard title="Feature Trends" subtitle="All biomarker channels over time">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="Tumor Fraction (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Methylation Score" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Genome Instability" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Fragment Ratio (×100)" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Mutation Heatmap */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Mutation Heatmap (VAF % across timepoints)
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-200">
                <th className="pb-2 pr-4 pl-4 sm:pl-0 sticky left-0 bg-white">Gene</th>
                <th className="pb-2 pr-4">Variant</th>
                {patient.timepoints.map((tp) => (
                  <th key={tp.id} className="pb-2 px-2 text-center">
                    {tp.id}
                  </th>
                ))}
                <th className="pb-2 px-2 text-center">Trend</th>
              </tr>
            </thead>
            <tbody>
              {allGenes.map((gene) => {
                const variants = [
                  ...new Set(
                    patient.timepoints.flatMap((tp) =>
                      tp.mutations.filter((m) => m.gene === gene).map((m) => m.variant)
                    )
                  ),
                ];
                return variants.map((variant) => {
                  const vafs = patient.timepoints.map((tp) => {
                    const m = tp.mutations.find((mut) => mut.gene === gene && mut.variant === variant);
                    return m ? m.vaf : 0;
                  });
                  const maxVaf = Math.max(...vafs);
                  const lastTwo = vafs.slice(-2);
                  const trend =
                    lastTwo.length === 2
                      ? lastTwo[1] > lastTwo[0]
                        ? '📈'
                        : lastTwo[1] < lastTwo[0]
                        ? '📉'
                        : '➡️'
                      : '—';

                  return (
                    <tr key={`${gene}-${variant}`} className="border-b border-gray-100">
                      <td className="py-2 pr-4 pl-4 sm:pl-0 font-semibold text-blue-600 sticky left-0 bg-white">
                        {gene}
                      </td>
                      <td className="py-2 pr-4 font-mono text-xs text-gray-600">{variant}</td>
                      {vafs.map((vaf, i) => {
                        const intensity = maxVaf > 0 ? vaf / maxVaf : 0;
                        return (
                          <td key={i} className="py-2 px-2 text-center">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-xs font-mono"
                              style={{
                                backgroundColor: vaf > 0 ? `rgba(239, 68, 68, ${intensity * 0.2})` : 'transparent',
                                color: vaf > 0 ? '#dc2626' : '#d1d5db',
                              }}
                            >
                              {vaf > 0 ? (vaf * 100).toFixed(1) : '—'}
                            </span>
                          </td>
                        );
                      })}
                      <td className="py-2 px-2 text-center text-lg">{trend}</td>
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
      color: patient.progressionProbability > 0.5 ? 'text-red-500' : 'text-emerald-500',
      desc: 'Likelihood of disease progression within 3 months',
    },
    {
      title: 'RECIST Prediction',
      value: patient.predictedRECIST,
      probability: null,
      color: patient.predictedRECIST.includes('Progressive')
        ? 'text-red-500'
        : patient.predictedRECIST.includes('Partial')
        ? 'text-emerald-500'
        : 'text-amber-500',
      desc: 'Predicted RECIST 1.1 response category',
    },
    {
      title: 'Time to Progression',
      value: patient.timeToProgression ? `${patient.timeToProgression} months` : 'Not predicted',
      probability: null,
      color:
        patient.timeToProgression && patient.timeToProgression < 6
          ? 'text-red-500'
          : patient.timeToProgression && patient.timeToProgression < 12
          ? 'text-amber-500'
          : 'text-emerald-500',
      desc: 'Estimated time until next progression event',
    },
    {
      title: 'Model Confidence',
      value: `${(patient.confidenceScore * 100).toFixed(0)}%`,
      probability: patient.confidenceScore,
      color:
        patient.confidenceScore > 0.8
          ? 'text-emerald-500'
          : patient.confidenceScore > 0.6
          ? 'text-amber-500'
          : 'text-red-500',
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
      <PageHeader
        title="AI Prediction Engine"
        subtitle={`Multi-head prediction with explainability for ${patient.id}`}
      />

      {/* Prediction Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {predictionHeads.map((head, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
              {head.title}
            </p>
            <p className={`text-lg sm:text-2xl font-bold ${head.color} mb-1`}>{head.value}</p>
            {head.probability !== null && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1">
                  <span>0%</span>
                  <span>{(head.probability * 100).toFixed(0)}%</span>
                  <span>100%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      head.probability > 0.7
                        ? 'bg-gradient-to-r from-amber-400 to-red-500'
                        : head.probability > 0.4
                        ? 'bg-gradient-to-r from-emerald-400 to-amber-400'
                        : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    }`}
                    style={{ width: `${head.probability * 100}%` }}
                  />
                </div>
              </div>
            )}
            <p className="text-[10px] sm:text-xs text-gray-400 mt-2">{head.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* SHAP Feature Importance */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Feature Importance (SHAP-style)</h3>
          <p className="text-xs text-gray-400 mb-4">Which features are driving the prediction</p>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className="w-28 sm:w-44 shrink-0 text-[10px] sm:text-xs text-gray-500 text-right truncate">
                  {f.feature}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-4 sm:h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        f.direction === 'positive'
                          ? 'bg-gradient-to-r from-red-400 to-red-500'
                          : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${(f.importance / maxImportance) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-mono w-14 sm:w-20 shrink-0 ${
                      f.direction === 'positive' ? 'text-red-500' : 'text-blue-500'
                    }`}
                  >
                    {f.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] sm:text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded" /> Increases risk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded" /> Decreases risk
            </span>
          </div>
        </div>

        {/* Model Comparison */}
        <ChartCard
          title="Model Performance Comparison"
          subtitle="Cross-validated metrics across architectures"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={modelComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="model" tick={{ fontSize: 9, fill: '#6b7280' }} width={100} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="AUC" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Sensitivity" fill="#6366f1" radius={[0, 4, 4, 0]} />
              <Bar dataKey="Specificity" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Architecture Notes */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-blue-700 mb-3">🧠 Model Architecture Notes</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <p className="font-semibold text-gray-700 mb-1">Branch A: Snapshot Models</p>
            <p>
              XGBoost and Random Forest trained on single-timepoint feature vectors. Best for patients
              with limited longitudinal data.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1">Branch B: Longitudinal Models</p>
            <p>
              LSTM and Transformer architectures processing full time-series. Captures temporal
              dynamics and trend patterns.
            </p>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">Fusion Layer</p>
          <p>
            Attention-weighted ensemble combining both branches. Weights longitudinal predictions
            higher when ≥3 timepoints available.
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

  // Generate observations
  const observations = [];

  if (prev && latest.tumorFraction > prev.tumorFraction * 1.5) {
    observations.push({
      severity: 'critical',
      message: `Tumor fraction increased ${((latest.tumorFraction / prev.tumorFraction - 1) * 100).toFixed(0)}% from previous draw`,
    });
  }

  const newMuts = latest.mutations.filter(
    (m) => prev && !prev.mutations.some((pm) => pm.gene === m.gene && pm.variant === m.variant)
  );
  if (newMuts.length > 0) {
    observations.push({
      severity: 'critical',
      message: `New mutation(s) detected: ${newMuts.map((m) => `${m.gene} ${m.variant}`).join(', ')}`,
    });
  }

  const resistanceMuts = latest.mutations.filter((m) =>
    ['T790M', 'C797S', 'Loss', 'Amplification'].includes(m.variant)
  );
  if (resistanceMuts.length > 0) {
    observations.push({
      severity: 'warning',
      message: `Resistance mechanism detected: ${resistanceMuts.map((m) => `${m.gene} ${m.variant}`).join(', ')}`,
    });
  }

  if (latest.methylationScore > 0.6) {
    observations.push({
      severity: 'warning',
      message: `Elevated methylation score (${latest.methylationScore.toFixed(2)}) suggests high tumor burden`,
    });
  }

  if (patient.confidenceScore < 0.75) {
    observations.push({
      severity: 'info',
      message: `Model confidence is moderate (${(patient.confidenceScore * 100).toFixed(0)}%)`,
    });
  }

  const getRiskColorClass = (category) => {
    switch (category) {
      case 'high':
        return 'text-red-500';
      case 'moderate':
        return 'text-amber-500';
      default:
        return 'text-emerald-500';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinical View"
        subtitle={`Data visualization and monitoring for ${patient.id} — ${patient.cancerType}`}
      />

      {/* Risk Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Assessment</h3>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <span>
                Risk Score: <span className={`font-bold ${getRiskColorClass(patient.timepoints[patient.timepoints.length-1].riskLevel.toLowerCase())}`}>{patient.timepoints[patient.timepoints.length-1].riskScore}/100</span>
              </span>
              <span>
                Progression Probability:{' '}
                <span className="font-bold text-gray-900">
                  {(patient.progressionProbability * 100).toFixed(0)}%
                </span>
              </span>
              <span>
                Confidence:{' '}
                <span className="font-bold text-gray-900">
                  {(patient.confidenceScore * 100).toFixed(0)}%
                </span>
              </span>
            </div>
          </div>
          <div
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-center ${
              patient.riskCategory === 'high'
                ? 'bg-red-50 border border-red-200'
                : patient.riskCategory === 'moderate'
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-emerald-50 border border-emerald-200'
            }`}
          >
            <div className="text-2xl sm:text-3xl mb-1">
              {patient.riskCategory === 'high' ? '🔴' : patient.riskCategory === 'moderate' ? '🟡' : '🟢'}
            </div>
            <div className={`text-xs sm:text-sm font-bold uppercase ${getRiskColorClass(patient.riskCategory)}`}>
              {patient.riskCategory} Risk
            </div>
          </div>
        </div>
      </div>

      {/* Observations */}
      {observations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Key Observations</h3>
          {observations.map((obs, i) => (
            <div
              key={i}
              className={`rounded-xl p-3 sm:p-4 border flex items-start gap-3 ${
                obs.severity === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : obs.severity === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <span className="text-lg">
                {obs.severity === 'critical' ? '🚨' : obs.severity === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span
                className={`text-sm ${
                  obs.severity === 'critical'
                    ? 'text-red-700'
                    : obs.severity === 'warning'
                    ? 'text-amber-700'
                    : 'text-blue-700'
                }`}
              >
                {obs.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring History */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Monitoring History & Response Correlation
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-200">
                <th className="pb-2 pr-4 pl-4 sm:pl-0">Timepoint</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Phase</th>
                <th className="pb-2 pr-4">TF</th>
                <th className="pb-2 pr-4">cfDNA</th>
                <th className="pb-2 pr-4">Mutations</th>
                <th className="pb-2 pr-4 sm:pr-0">Imaging</th>
              </tr>
            </thead>
            <tbody>
              {patient.timepoints.map((tp, i) => (
                <tr
                  key={tp.id}
                  className={`border-b border-gray-100 ${
                    i === patient.timepoints.length - 1 ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-2.5 pr-4 pl-4 sm:pl-0 font-semibold text-gray-900">{tp.id}</td>
                  <td className="py-2.5 pr-4 text-gray-500">{tp.date}</td>
                  <td className="py-2.5 pr-4">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">{tp.treatmentPhase}</span>
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-gray-700">{(tp.tumorFraction * 100).toFixed(1)}%</td>
                  <td className="py-2.5 pr-4 font-mono text-gray-700">{tp.totalCfDNA.toFixed(1)}</td>
                  <td className="py-2.5 pr-4 text-gray-700">{tp.mutations.length}</td>
                  <td className="py-2.5 pr-4 sm:pr-0 text-xs text-gray-500">
                    {tp.imagingResult || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-600 mb-1">⚕️ Research Prototype</p>
        <p>
          This system is for research and demonstration purposes only. All data shown is simulated.
          This tool is not intended for clinical decision-making.
        </p>
      </div>
    </div>
  );
}

// ─── DATASETS PAGE ─────────────────────────────────────────────────
function DatasetsPage() {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const getAccessBadge = (access) => {
    if (access.startsWith('Open')) return { class: 'bg-emerald-50 text-emerald-600', icon: '🔓 Open' };
    if (access.startsWith('Controlled')) return { class: 'bg-amber-50 text-amber-600', icon: '🔐 Controlled' };
    return { class: 'bg-red-50 text-red-600', icon: '🔒 Restricted' };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Datasets & Resources"
        subtitle="Where to find real liquid biopsy and ctDNA datasets for your project"
      />

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg font-bold text-blue-700 mb-4">🚀 Quick Start: Recommended Data Pipeline</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStartSteps.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-8 h-8 shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                {step.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
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
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-blue-200 hover:shadow-md transition-all"
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{ds.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.class}`}>
                      {badge.icon}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{ds.description}</p>
                </div>
                <span
                  className={`text-gray-400 transition-transform shrink-0 ${
                    expandedIdx === i ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {expandedIdx === i && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-4 border-t border-gray-200 pt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Data Types</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ds.dataTypes.map((dt) => (
                          <span key={dt} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                            {dt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Cancer Types</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ds.cancerTypes.map((ct) => (
                          <span key={ct} className="px-2 py-0.5 bg-purple-50 rounded text-xs text-purple-600">
                            {ct}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Sample Size</p>
                      <p className="text-sm text-gray-700">{ds.sampleSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Access</p>
                      <p className="text-sm text-gray-700">{ds.access}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Why This Dataset</p>
                    <p className="text-sm text-blue-600">{ds.relevance}</p>
                  </div>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Visit Resource <Icon d={icons.external} className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tools Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">📚 Additional Resources & Tools</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
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
      icon: '🧪',
      color: 'from-blue-50 to-blue-50/50 border-blue-200',
      components: [
        { name: 'Targeted Panel Sequencing', desc: 'Track mutations via VAF', input: 'cfDNA', output: 'VAF values' },
        { name: 'Shallow WGS', desc: 'CNA & tumor fraction (ichorCNA)', input: 'cfDNA', output: 'CNA profile' },
        { name: 'cfDNA Methylation', desc: 'Methylation-based detection', input: 'cfDNA', output: 'Meth scores' },
      ],
    },
    {
      id: 2,
      title: 'Feature Engineering',
      icon: '⚙️',
      color: 'from-emerald-50 to-teal-50 border-emerald-200',
      components: [
        { name: 'Per-timepoint Features', desc: 'VAF, TF, methylation, GI score', input: 'Raw data', output: 'Feature vector' },
        { name: 'Longitudinal Dynamics', desc: 'Slopes, deltas, trends', input: 'Multi-timepoint', output: 'Temporal features' },
        { name: 'Clinical Integration', desc: 'Treatment, imaging, demographics', input: 'Clinical data', output: 'Combined matrix' },
      ],
    },
    {
      id: 3,
      title: 'AI Prediction Engine',
      icon: '🧠',
      color: 'from-indigo-50 to-purple-50 border-indigo-200',
      components: [
        { name: 'Branch A: Snapshot', desc: 'XGBoost / Random Forest', input: 'Single vector', output: 'Snapshot pred' },
        { name: 'Branch B: Longitudinal', desc: 'LSTM / Transformer', input: 'Sequence', output: 'Temporal pred' },
        { name: 'Fusion Layer', desc: 'Attention-weighted ensemble', input: 'Both preds', output: 'Final output' },
      ],
    },
    {
      id: 4,
      title: 'Clinical Interface',
      icon: '🏥',
      color: 'from-amber-50 to-orange-50 border-amber-200',
      components: [
        { name: 'Risk Stratification', desc: 'Low/Moderate/High risk levels', input: 'Predictions', output: 'Risk category' },
        { name: 'Explainability (SHAP)', desc: 'Feature-level explanations', input: 'Model internals', output: 'SHAP values' },
        { name: 'Confidence Intervals', desc: 'Uncertainty quantification', input: 'Ensemble variance', output: 'CI bounds' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Architecture"
        subtitle="Complete pipeline from patient blood samples to predictions"
      />

      {/* Flow Diagram */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-4 sm:px-6 py-3">
            <span className="text-xl sm:text-2xl">🩸</span>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Patient Blood Samples</p>
              <p className="text-xs text-gray-500">Serial Liquid Biopsies: T1 → T2 → T3 → T4 → T5</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent" />
        </div>

        <div className="space-y-4">
          {modules.map((mod, i) => (
            <div key={mod.id}>
              <div className={`bg-gradient-to-r ${mod.color} border rounded-xl p-4 sm:p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl sm:text-2xl">{mod.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Module {mod.id}</p>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{mod.title}</h3>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {mod.components.map((comp, j) => (
                    <div key={j} className="bg-white/80 rounded-lg p-3 border border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 mb-1">{comp.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{comp.desc}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">In:</span>
                        <span className="text-blue-600">{comp.input}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400">Out:</span>
                        <span className="text-emerald-600">{comp.output}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {i < modules.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center">
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="text-gray-400">▼</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: 'Data Processing', items: ['pysam', 'cyvcf2', 'pandas', 'pyranges', 'bedtools'] },
          { title: 'Variant Calling', items: ['GATK/MuTect2', 'VarDict', 'ichorCNA', 'methylKit'] },
          { title: 'ML/DL Models', items: ['PyTorch', 'XGBoost', 'scikit-learn', 'tsai', 'lifelines'] },
          { title: 'Explainability', items: ['SHAP', 'LIME', 'captum', 'matplotlib', 'plotly'] },
        ].map((cat) => (
          <div key={cat.title} className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">{cat.title}</p>
            <div className="space-y-1.5">
              {cat.items.map((item) => (
                <div key={item} className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
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
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

function ToolSection({ title, color, tools }) {
  const colorClass =
    color === 'blue'
      ? 'text-blue-600'
      : color === 'indigo'
      ? 'text-indigo-600'
      : 'text-emerald-600';

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800">{title}</h4>
      {tools.map((tool) => (
        <a
          key={tool.name}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-100 hover:border-gray-200 transition-all"
        >
          <p className={`font-semibold ${colorClass}`}>{tool.name}</p>
          <p className="text-xs text-gray-500">{tool.desc}</p>
        </a>
      ))}
    </div>
  );
}