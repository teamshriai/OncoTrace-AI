export const vcfTimepoints = [
  {
    id: 'T1',
    date: '2024-11-01',
    dayFromBaseline: 0,
    label: 'Baseline (High Burden)',
    tumorFraction: 1.00,
    mutationCount: 16,
    riskScore: 100,
    riskLevel: 'HIGH',
    mutations: [
      {chrom: 'chr3', pos: '178917005', af: 0.52193, dp: 685},
      {chrom: 'chr3', pos: '178952020', af: 0.518, dp: 2143},
      {chrom: 'chr3', pos: '178952152', af: 0.0125376, dp: 4523},
      {chrom: 'chr4', pos: '1808958', af: 0.072, dp: 4083},
      {chrom: 'chr4', pos: '55980239', af: 0.442462, dp: 1117},
      {chrom: 'chr5', pos: '112175930', af: 1.0, dp: 2176},
      {chrom: 'chr5', pos: '149433596', af: 0.38794, dp: 2159},
      {chrom: 'chr7', pos: '55249063', af: 0.48072, dp: 1553},
      {chrom: 'chr10', pos: '43613843', af: 0.473922, dp: 4745},
      {chrom: 'chr11', pos: '534238', af: 0.521586, dp: 3145},
      {chrom: 'chr11', pos: '534242', af: 0.506753, dp: 3144},
      {chrom: 'chr13', pos: '28608230', af: 0.0270728, dp: 1178},
      {chrom: 'chr13', pos: '28610153', af: 0.488, dp: 3867},
      {chrom: 'chr13', pos: '28610183', af: 0.509, dp: 3786},
      {chrom: 'chr17', pos: '7579470', af: 1.0, dp: 4127},
      {chrom: 'chr22', pos: '24176287', af: 1.0, dp: 3979}
    ]
  },
  // Generated additional timepoints for demo
  {
    id: 'T2',
    date: '2024-12-01',
    dayFromBaseline: 30,
    label: 'Post-Treatment 1M',
    tumorFraction: 0.65,
    mutationCount: 14,
    riskScore: 72,
    riskLevel: 'HIGH',
    mutations: [
      {chrom: 'chr3', pos: '178917005', af: 0.45, dp: 720},
      {chrom: 'chr3', pos: '178952020', af: 0.42, dp: 1980},
      {chrom: 'chr4', pos: '1808958', af: 0.055, dp: 3850},
      {chrom: 'chr4', pos: '55980239', af: 0.38, dp: 1050},
      {chrom: 'chr5', pos: '112175930', af: 0.85, dp: 2100},
      {chrom: 'chr5', pos: '149433596', af: 0.32, dp: 1980},
      {chrom: 'chr7', pos: '55249063', af: 0.41, dp: 1420},
      {chrom: 'chr10', pos: '43613843', af: 0.39, dp: 4400},
      {chrom: 'chr11', pos: '534238', af: 0.46, dp: 2900},
      {chrom: 'chr11', pos: '534242', af: 0.43, dp: 2980},
      {chrom: 'chr13', pos: '28610153', af: 0.42, dp: 3600},
      {chrom: 'chr13', pos: '28610183', af: 0.44, dp: 3550},
      {chrom: 'chr17', pos: '7579470', af: 0.92, dp: 3900},
      {chrom: 'chr22', pos: '24176287', af: 0.95, dp: 3750}
    ]
  },
  {
    id: 'T3',
    date: '2025-01-01',
    dayFromBaseline: 60,
    label: 'Post-Treatment 2M',
    tumorFraction: 0.42,
    mutationCount: 12,
    riskScore: 58,
    riskLevel: 'MODERATE',
    mutations: [
      {chrom: 'chr3', pos: '178917005', af: 0.38, dp: 680},
      {chrom: 'chr3', pos: '178952020', af: 0.35, dp: 2050},
      {chrom: 'chr4', pos: '55980239', af: 0.31, dp: 1120},
      {chrom: 'chr5', pos: '112175930', af: 0.72, dp: 2050},
      {chrom: 'chr5', pos: '149433596', af: 0.28, dp: 2100},
      {chrom: 'chr7', pos: '55249063', af: 0.35, dp: 1480},
      {chrom: 'chr10', pos: '43613843', af: 0.34, dp: 4650},
      {chrom: 'chr11', pos: '534238', af: 0.39, dp: 3100},
      {chrom: 'chr11', pos: '534242', af: 0.37, dp: 3050},
      {chrom: 'chr13', pos: '28610153', af: 0.36, dp: 3700},
      {chrom: 'chr13', pos: '28610183', af: 0.38, dp: 3650},
      {chrom: 'chr17', pos: '7579470', af: 0.80, dp: 4050}
    ]
  }
];

export const patient = {
  id: 'PT-REAL-001',
  name: 'Real Patient A',
  age: 58,
  sex: 'Female',
  cancerType: 'Non-Small Cell Lung Cancer (NSCLC)',
  stage: 'Stage IV',
  primaryTreatment: 'Carboplatin + Pemetrexed + Pembrolizumab',
  currentTherapy: 'Pembrolizumab maintenance',
  diagnosisDate: '2024-10-01',
  timepoints: vcfTimepoints,
  progressionProbability: 0.78,
  predictedRECIST: 'Progressive Disease (PD)',
  confidenceScore: 0.92
};
