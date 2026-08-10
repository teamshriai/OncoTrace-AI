import { useEffect, useRef, useState, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";

// ─── Icons ────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, style = {}, strokeWidth = 1.5 }) => (
  <svg style={{ width: size, height: size, flexShrink: 0, ...style }} fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ICONS = {
  logo: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  back: "M11 17l-5-5m0 0l5-5m-5 5h12",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  alert: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  dna: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  target: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 18L18 6M6 6l12 12",
  chevron: "M19 9l-7 7-7-7",
  pill: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  flask: "M9 3v10l-3 6h12l-3-6V3M9 3h6",
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  trend: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  filter: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z",
  sort: "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9S17.52 3 12 3z",
  copy: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  stethoscope: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
};

// ─── S5 Clinical Data ─────────────────────────────────────────────
const S5_DATA = {
  sample_id: "S5",
  panel: "Targeted Somatic Panel (Hematology/Oncology)",
  pipeline: "VarDict v1.8.2",
  risk_score: 74,
  risk_level: "High Risk",
  kpis: {
    total_variants: 49,
    high_confidence: 30,
    ctdna_candidates: 19,
    actionable_genes: 6,
    resistance_genes: 4,
    mean_depth: 648,
    max_depth: 3067,
    min_depth: 109,
    mean_mq: 57.8,
    pass_filter: 37,
    filtered: 12,
  },
  actionable_gene_list: ["EGFR", "BRAF", "FGFR1", "FGFR4", "MYC", "SMAD4"],
  resistance_gene_list: ["EGFR", "BRAF", "FGFR1", "NF1"],
  tumour_fraction: { median_vaf: 0.44, estimated: "40–50%", ctdna_signal: "Detectable" },
  variant_type_dist: [
    { label: "SNV", value: 24, color: "#3b82f6" },
    { label: "Deletion", value: 9, color: "#ef4444" },
    { label: "Complex", value: 7, color: "#f59e0b" },
    { label: "Insertion", value: 6, color: "#10b981" },
    { label: "DEL (SV)", value: 3, color: "#8b5cf6" },
  ],
  confidence_dist: [
    { label: "High Confidence", value: 30, color: "#10b981" },
    { label: "ctDNA Candidate", value: 19, color: "#8b5cf6" },
  ],
  chr_dist: [
    { chr: "2", count: 2 }, { chr: "4", count: 2 }, { chr: "5", count: 1 },
    { chr: "6", count: 9 }, { chr: "7", count: 4 }, { chr: "8", count: 5 },
    { chr: "9", count: 5 }, { chr: "11", count: 1 }, { chr: "12", count: 5 },
    { chr: "14", count: 2 }, { chr: "16", count: 2 }, { chr: "17", count: 5 },
    { chr: "18", count: 1 }, { chr: "19", count: 2 }, { chr: "21", count: 1 },
    { chr: "22", count: 1 }, { chr: "X", count: 1 },
  ],
  vaf_histogram: [
    { range: "0–10%", count: 9, color: "#8b5cf6" },
    { range: "10–20%", count: 4, color: "#3b82f6" },
    { range: "20–30%", count: 6, color: "#10b981" },
    { range: "30–50%", count: 10, color: "#f59e0b" },
    { range: "50–70%", count: 7, color: "#f97316" },
    { range: "70–90%", count: 8, color: "#ef4444" },
    { range: "90–100%", count: 5, color: "#991b1b" },
  ],
  filter_flags: [
    { flag: "PASS", desc: "All filters passed", count: 37, color: "#10b981" },
    { flag: "NM5.25", desc: "Mean mismatches ≥5.25 (false positive risk)", count: 5, color: "#f59e0b" },
    { flag: "Bias", desc: "Strand bias detected", count: 3, color: "#f59e0b" },
    { flag: "MSI12", desc: "Variant in microsatellite region", count: 1, color: "#f59e0b" },
    { flag: "LongMSI", desc: "Flanked by long A/T repeat (≥14 bp)", count: 1, color: "#f59e0b" },
    { flag: "p8", desc: "Mean position in reads < 8 (edge effect)", count: 1, color: "#f59e0b" },
  ],
  key_genes: [
    {
      gene: "EGFR", chr: "7", pos: "55,167,263", type: "SNV (G→T)",
      vaf: 0.8787, confidence: "ctdna_candidate", role: "Oncogene",
      pathway: "EGFR / RAS / MAPK", risk: "HIGH", color: "#ef4444",
      significance: "EGFR activating mutation; major lung/solid tumour driver. High VAF (87.9%) suggests clonal dominance.",
      therapies: ["Erlotinib", "Gefitinib", "Afatinib", "Osimertinib"],
      resistance: "T790M = resistance to 1st gen TKI. C797S = resistance to Osimertinib.",
    },
    {
      gene: "FGFR4", chr: "5", pos: "177,090,796", type: "SNV (C→T)",
      vaf: 0.9758, confidence: "high", role: "Oncogene",
      pathway: "FGFR4 / FGF19 / PI3K", risk: "HIGH", color: "#ef4444",
      significance: "Near-homozygous FGFR4 mutation (VAF ~98%). Associated with rhabdomyosarcoma and HCC.",
      therapies: ["Fisogatinib", "Futibatinib", "H3B-6527"],
      resistance: "Secondary FGFR4 kinase domain mutations possible.",
    },
    {
      gene: "ETV6", chr: "12", pos: "11,877,372", type: "SNV (A→G)",
      vaf: 0.9913, confidence: "high", role: "TSG",
      pathway: "ETS transcription / haematopoiesis", risk: "MODERATE", color: "#f59e0b",
      significance: "Near-complete ETV6 loss (VAF 99.1%) suggests homozygous loss or LOH. Haematological malignancy marker.",
      therapies: ["Imatinib (if fusion+)", "Ruxolitinib (MPN)"],
      resistance: "Tyrosine kinase inhibitor resistance if fusion absent.",
    },
    {
      gene: "MYC", chr: "8", pos: "127,739,018", type: "DEL (SV, 1,376 bp)",
      vaf: 0.7738, confidence: "high", role: "Oncogene",
      pathway: "MYC / cell cycle / transcription", risk: "HIGH", color: "#ef4444",
      significance: "Large MYC structural deletion at high VAF. Associated with aggressive tumour behaviour.",
      therapies: ["OTX015 (investigational)", "BI 894999 (investigational)"],
      resistance: "CDK inhibitor combinations under investigation.",
    },
    {
      gene: "NF1", chr: "17", pos: "31,236,055", type: "Insertion + SNV",
      vaf: 0.7421, confidence: "high", role: "TSG",
      pathway: "RAS / MAPK", risk: "HIGH", color: "#ef4444",
      significance: "NF1 loss-of-function → RAS pathway hyperactivation. High VAF suggests LOH or clonal dominance.",
      therapies: ["Trametinib", "Cobimetinib", "Binimetinib"],
      resistance: "Co-mutations in PI3K may reduce MEK inhibitor efficacy.",
    },
    {
      gene: "FGFR1", chr: "8", pos: "38,414,583–38,466,895", type: "Complex + Deletion (3 variants)",
      vaf: 0.7608, confidence: "high", role: "Oncogene",
      pathway: "FGFR / PI3K / MAPK", risk: "HIGH", color: "#ef4444",
      significance: "Multiple FGFR1 variants including high-VAF deletion. Associated with lung squamous, bladder, breast cancers.",
      therapies: ["Erdafitinib", "Pemigatinib", "Futibatinib", "Infigratinib"],
      resistance: "V561M gatekeeper mutations confer resistance.",
    },
    {
      gene: "BRAF", chr: "7", pos: "140,798,272", type: "SNV (C→T)",
      vaf: 0.2218, confidence: "high", role: "Oncogene",
      pathway: "MAPK / MEK / ERK", risk: "MODERATE", color: "#f59e0b",
      significance: "BRAF mutation drives MAPK pathway hyperactivation. Moderate VAF suggests sub-clonal presence.",
      therapies: ["Vemurafenib", "Dabrafenib", "Trametinib", "Encorafenib"],
      resistance: "Non-V600E mutations may show intrinsic resistance.",
    },
    {
      gene: "SMAD4", chr: "18", pos: "51,058,485", type: "Insertion",
      vaf: 0.4293, confidence: "high", role: "TSG",
      pathway: "TGF-β / BMP signalling", risk: "MODERATE", color: "#f59e0b",
      significance: "SMAD4 loss disrupts TGF-β tumour-suppressive signalling. Pancreatic/colorectal cancer association.",
      therapies: ["No direct target", "IO combinations (investigational)"],
      resistance: "Associated with anti-EGFR resistance (cetuximab) in CRC.",
    },
  ],
  all_variants: [
    { gene: "PTCH1", chr: "9", pos: 95447312, ref: "G", alt: "A", type: "SNV", vaf: 0.5547, depth: 274, alt_reads: 152, mq: 60, sn: 18, hiaf: 0.5455, msi: 6, nm: 1.9, sbf: 0, oddratio: 4.32183, hicnt: 144, hicov: 264, confidence: "ctdna_candidate" },
    { gene: "KLF4", chr: "9", pos: 107485924, ref: "C", alt: "<DEL>", type: "DEL", vaf: 0.6471, depth: 476, alt_reads: 308, mq: 60, sn: 307, hiaf: 0.4835, msi: 0, nm: 0.2, sbf: 0, oddratio: 2.11265, hicnt: 307, hicov: 635, confidence: "high" },
    { gene: "KLF4", chr: "9", pos: 107485927, ref: "C", alt: "<DEL>", type: "DEL", vaf: 0.121, depth: 463, alt_reads: 56, mq: 60, sn: 112, hiaf: 0.1141, msi: 0, nm: 1.5, sbf: 0, oddratio: 0, hicnt: 56, hicov: 491, confidence: "high" },
    { gene: "EGFL7", chr: "9", pos: 136670986, ref: "TGCAGT...", alt: "T", type: "Deletion", vaf: 0.0546, depth: 293, alt_reads: 16, mq: 45.2, sn: 32, hiaf: 0.0526, msi: 2, nm: 1, sbf: 0.00032, oddratio: 10.1951, hicnt: 16, hicov: 304, confidence: "high" },
    { gene: "EGFL7", chr: "9", pos: 136671027, ref: "TG", alt: "T", type: "Deletion", vaf: 0.3853, depth: 109, alt_reads: 42, mq: 60, sn: 84, hiaf: 0.4078, msi: 15, nm: 1.3, sbf: 0.00003, oddratio: 0, hicnt: 42, hicov: 103, confidence: "high" },
    { gene: "PAX8", chr: "2", pos: 113235223, ref: "TCC", alt: "T", type: "Deletion", vaf: 0.36, depth: 850, alt_reads: 306, mq: 60, sn: 612, hiaf: 0.3669, msi: 4, nm: 0.4, sbf: 0.00545, oddratio: 1.53915, hicnt: 306, hicov: 834, confidence: "high" },
    { gene: "PAX3", chr: "2", pos: 222201298, ref: "AC", alt: "A", type: "Deletion", vaf: 0.042, depth: 714, alt_reads: 30, mq: 60, sn: 5, hiaf: 0.0388, msi: 8, nm: 1.2, sbf: 0.00146, oddratio: 4.00818, hicnt: 25, hicov: 644, confidence: "ctdna_candidate" },
    { gene: "KLRC2", chr: "12", pos: 10435931, ref: "C", alt: "G", type: "SNV", vaf: 0.3901, depth: 1610, alt_reads: 628, mq: 51.6, sn: 124.6, hiaf: 0.3918, msi: 1, nm: 1.7, sbf: 0.00218, oddratio: 1.37003, hicnt: 623, hicov: 1590, confidence: "high" },
    { gene: "ETV6", chr: "12", pos: 11877372, ref: "A", alt: "G", type: "SNV", vaf: 0.9913, depth: 688, alt_reads: 682, mq: 60, sn: 26.28, hiaf: 1, msi: 2, nm: 1.6, sbf: 0.00783, oddratio: 0, hicnt: 657, hicov: 657, confidence: "high" },
    { gene: "SH2B3", chr: "12", pos: 111447547, ref: "ATGGGG", alt: "A", type: "Deletion", vaf: 0.2627, depth: 118, alt_reads: 31, mq: 60, sn: 62, hiaf: 0.2743, msi: 5, nm: 0.1, sbf: 0, oddratio: 0, hicnt: 31, hicov: 113, confidence: "high" },
    { gene: "HNF1A", chr: "12", pos: 120994314, ref: "G", alt: "C", type: "SNV", vaf: 0.3064, depth: 1028, alt_reads: 315, mq: 60, sn: 13.318, hiaf: 0.3071, msi: 8, nm: 1.5, sbf: 0.00003, oddratio: 1.80672, hicnt: 293, hicov: 954, confidence: "ctdna_candidate" },
    { gene: "HLA-A", chr: "6", pos: 29943228, ref: "G", alt: "A", type: "SNV", vaf: 0.7296, depth: 233, alt_reads: 170, mq: 59.9, sn: 16, hiaf: 0.7477, msi: 4, nm: 4, sbf: 0.00161, oddratio: 2.72212, hicnt: 160, hicov: 214, confidence: "ctdna_candidate" },
    { gene: "HLA-A", chr: "6", pos: 29943234, ref: "C", alt: "T", type: "SNV", vaf: 0.747, depth: 249, alt_reads: 186, mq: 60, sn: 6.44, hiaf: 0.7352, msi: 5, nm: 3.9, sbf: 0, oddratio: 6.16075, hicnt: 161, hicov: 219, confidence: "ctdna_candidate" },
    { gene: "HLA-A", chr: "6", pos: 29943413, ref: "G", alt: "A", type: "SNV", vaf: 0.7844, depth: 756, alt_reads: 593, mq: 52.5, sn: 73.125, hiaf: 0.7852, msi: 2, nm: 4.3, sbf: 0.0042, oddratio: 1.70415, hicnt: 585, hicov: 745, confidence: "high" },
    { gene: "HLA-A", chr: "6", pos: 29943422, ref: "C", alt: "T", type: "SNV", vaf: 0.0823, depth: 741, alt_reads: 61, mq: 42.6, sn: 60, hiaf: 0.0814, msi: 1, nm: 6.7, sbf: 0, oddratio: 7.89453, hicnt: 60, hicov: 737, confidence: "high" },
    { gene: "HLA-A", chr: "6", pos: 29943426, ref: "A", alt: "C", type: "SNV", vaf: 0.0943, depth: 721, alt_reads: 68, mq: 43.6, sn: 67, hiaf: 0.0932, msi: 2, nm: 6.5, sbf: 0, oddratio: 6.32191, hicnt: 67, hicov: 719, confidence: "high" },
    { gene: "HLA-A", chr: "6", pos: 29943667, ref: "G", alt: "A", type: "SNV", vaf: 0.143, depth: 888, alt_reads: 127, mq: 45.1, sn: 254, hiaf: 0.1435, msi: 2, nm: 4.7, sbf: 0, oddratio: 2.7211, hicnt: 127, hicov: 885, confidence: "high" },
    { gene: "HLA-A", chr: "6", pos: 29944038, ref: "C", alt: "A", type: "SNV", vaf: 0.0286, depth: 1085, alt_reads: 31, mq: 45.1, sn: 62, hiaf: 0.0287, msi: 1, nm: 2, sbf: 0.00325, oddratio: 3.49406, hicnt: 31, hicov: 1079, confidence: "ctdna_candidate" },
    { gene: "HLA-C", chr: "6", pos: 31354625, ref: "C", alt: "T", type: "SNV", vaf: 0.5673, depth: 550, alt_reads: 312, mq: 59.9, sn: 33.667, hiaf: 0.593, msi: 2, nm: 2.7, sbf: 0, oddratio: 2.36233, hicnt: 303, hicov: 511, confidence: "high" },
    { gene: "HLA-C", chr: "6", pos: 31354682, ref: "T", alt: "C", type: "SNV", vaf: 0.5199, depth: 604, alt_reads: 314, mq: 59.8, sn: 51.333, hiaf: 0.5176, msi: 2, nm: 3.7, sbf: 0.00695, oddratio: 1.57719, hicnt: 308, hicov: 595, confidence: "high" },
    { gene: "HLA-C", chr: "6", pos: 31357074, ref: "A", alt: "AC", type: "Insertion", vaf: 0.0409, depth: 464, alt_reads: 19, mq: 60, sn: 38, hiaf: 0.05, msi: 4, nm: 5.5, sbf: 0.00446, oddratio: 5.0985, hicnt: 19, hicov: 380, confidence: "ctdna_candidate" },
    { gene: "QKI", chr: "6", pos: 163570444, ref: "GT", alt: "G", type: "Deletion", vaf: 0.2645, depth: 431, alt_reads: 114, mq: 60, sn: 56, hiaf: 0.2738, msi: 16, nm: 1.6, sbf: 0, oddratio: 3.0201, hicnt: 112, hicov: 409, confidence: "high" },
    { gene: "IGHJ", chr: "14", pos: 105863732, ref: "A", alt: "G", type: "SNV", vaf: 0.0895, depth: 749, alt_reads: 67, mq: 60, sn: 134, hiaf: 0.0897, msi: 1, nm: 7, sbf: 0.00677, oddratio: 2.10579, hicnt: 67, hicov: 747, confidence: "high" },
    { gene: "IGHJ", chr: "14", pos: 105863740, ref: "A", alt: "G", type: "SNV", vaf: 0.0839, depth: 715, alt_reads: 60, mq: 60, sn: 29, hiaf: 0.082, msi: 2, nm: 7.2, sbf: 0.00273, oddratio: 2.41548, hicnt: 58, hicov: 707, confidence: "high" },
    { gene: "PTPRS", chr: "19", pos: 5260867, ref: "TGT", alt: "CG", type: "Complex", vaf: 0.3297, depth: 273, alt_reads: 90, mq: 60, sn: 89, hiaf: 0.4384, msi: 2, nm: 1.7, sbf: 0.00001, oddratio: 4.22583, hicnt: 89, hicov: 203, confidence: "high" },
    { gene: "DNM2", chr: "19", pos: 10797475, ref: "TGGTC...", alt: "GTGGT...", type: "Complex", vaf: 0.0144, depth: 904, alt_reads: 13, mq: 60, sn: 26, hiaf: 0.015, msi: 3, nm: 1.5, sbf: 0.00002, oddratio: 0, hicnt: 13, hicov: 866, confidence: "ctdna_candidate" },
    { gene: "NF1", chr: "17", pos: 31236055, ref: "T", alt: "TTG", type: "Insertion", vaf: 0.7197, depth: 603, alt_reads: 434, mq: 60, sn: 216, hiaf: 1, msi: 6, nm: 1.3, sbf: 0.0063, oddratio: 1.6529, hicnt: 432, hicov: 432, confidence: "high" },
    { gene: "NF1", chr: "17", pos: 31236067, ref: "T", alt: "G", type: "SNV", vaf: 0.7421, depth: 535, alt_reads: 397, mq: 60, sn: 27.357, hiaf: 0.7599, msi: 13, nm: 1.3, sbf: 0.00406, oddratio: 1.80467, hicnt: 383, hicov: 504, confidence: "high" },
    { gene: "SUZ12", chr: "17", pos: 31966130, ref: "C", alt: "CT", type: "Insertion", vaf: 0.2918, depth: 586, alt_reads: 171, mq: 59.9, sn: 41.75, hiaf: 0.5719, msi: 15, nm: 1.5, sbf: 0.0003, oddratio: 2.01384, hicnt: 167, hicov: 292, confidence: "high" },
    { gene: "ETV4", chr: "17", pos: 43543276, ref: "A", alt: "ACTCT", type: "Insertion", vaf: 0.6105, depth: 285, alt_reads: 174, mq: 60, sn: 173, hiaf: 1, msi: 12, nm: 0.2, sbf: 0.00098, oddratio: 2.95832, hicnt: 173, hicov: 173, confidence: "high" },
    { gene: "AXIN2", chr: "17", pos: 65536436, ref: "ACGGG...", alt: "A", type: "Deletion", vaf: 0.0298, depth: 571, alt_reads: 17, mq: 60, sn: 34, hiaf: 0.0367, msi: 2, nm: 0, sbf: 0.00167, oddratio: 5.02899, hicnt: 17, hicov: 463, confidence: "ctdna_candidate" },
    { gene: "GRIN2A", chr: "16", pos: 9764198, ref: "TGTCT...", alt: "CGGTG...", type: "Complex", vaf: 0.0324, depth: 709, alt_reads: 23, mq: 60, sn: 10.5, hiaf: 0.032, msi: 2, nm: 0.1, sbf: 0, oddratio: 0, hicnt: 21, hicov: 657, confidence: "ctdna_candidate" },
    { gene: "GRIN2A", chr: "16", pos: 9840834, ref: "G", alt: "A", type: "SNV", vaf: 0.4977, depth: 221, alt_reads: 110, mq: 58.1, sn: 14.714, hiaf: 0.7464, msi: 6, nm: 1.4, sbf: 0, oddratio: 18.3188, hicnt: 103, hicov: 138, confidence: "ctdna_candidate" },
    { gene: "FGFR4", chr: "5", pos: 177090796, ref: "C", alt: "T", type: "SNV", vaf: 0.9758, depth: 579, alt_reads: 565, mq: 60, sn: 23.565, hiaf: 0.9927, msi: 4, nm: 1.2, sbf: 0.00507, oddratio: 10.74, hicnt: 542, hicov: 546, confidence: "high" },
    { gene: "ATRX", chr: "X", pos: 77682285, ref: "C", alt: "T", type: "SNV", vaf: 0.0193, depth: 519, alt_reads: 10, mq: 48.6, sn: 9, hiaf: 0.018, msi: 2, nm: 1.9, sbf: 0.0004, oddratio: 0, hicnt: 9, hicov: 500, confidence: "ctdna_candidate" },
    { gene: "SMAD4", chr: "18", pos: 51058485, ref: "A", alt: "ATT", type: "Insertion", vaf: 0.4293, depth: 1258, alt_reads: 540, mq: 60, sn: 178.667, hiaf: 1, msi: 18, nm: 1.6, sbf: 0, oddratio: 2.29704, hicnt: 536, hicov: 536, confidence: "high" },
    { gene: "C11ORF95", chr: "11", pos: 63764229, ref: "GAGCC...", alt: "TAGAT...", type: "Complex", vaf: 0.0148, depth: 742, alt_reads: 11, mq: 60, sn: 22, hiaf: 0.0151, msi: 0, nm: 0.5, sbf: 0.00145, oddratio: 0, hicnt: 11, hicov: 730, confidence: "ctdna_candidate" },
    { gene: "CYP2D6", chr: "22", pos: 42129819, ref: "G", alt: "T", type: "SNV", vaf: 0.2843, depth: 1175, alt_reads: 334, mq: 55.1, sn: 14.182, hiaf: 0.2734, msi: 2, nm: 3.5, sbf: 0.00436, oddratio: 1.4554, hicnt: 312, hicov: 1141, confidence: "ctdna_candidate" },
    { gene: "EGFR", chr: "7", pos: 55167263, ref: "G", alt: "T", type: "SNV", vaf: 0.8787, depth: 3067, alt_reads: 2695, mq: 42, sn: 13.647, hiaf: 0.9472, msi: 4, nm: 2.2, sbf: 0, oddratio: 2.6617, hicnt: 2511, hicov: 2651, confidence: "ctdna_candidate" },
    { gene: "CUX1", chr: "7", pos: 102257306, ref: "C", alt: "CTT", type: "Insertion", vaf: 0.2077, depth: 886, alt_reads: 184, mq: 60, sn: 183, hiaf: 0.3704, msi: 13, nm: 1.4, sbf: 0, oddratio: 3.77581, hicnt: 183, hicov: 494, confidence: "high" },
    { gene: "CUX1", chr: "7", pos: 102282795, ref: "G", alt: "T", type: "SNV", vaf: 0.3527, depth: 258, alt_reads: 91, mq: 60, sn: 17.2, hiaf: 0.3644, msi: 7, nm: 1.4, sbf: 0.00002, oddratio: 6.16802, hicnt: 86, hicov: 236, confidence: "ctdna_candidate" },
    { gene: "BRAF", chr: "7", pos: 140798272, ref: "C", alt: "T", type: "SNV", vaf: 0.2218, depth: 239, alt_reads: 53, mq: 45.7, sn: 52, hiaf: 0.437, msi: 8, nm: 1.3, sbf: 0, oddratio: 91.5227, hicnt: 52, hicov: 119, confidence: "high" },
    { gene: "FGFR1", chr: "8", pos: 38414583, ref: "CGGTC...", alt: "TCGGT...", type: "Complex", vaf: 0.0319, depth: 595, alt_reads: 19, mq: 60, sn: 38, hiaf: 0.0363, msi: 2, nm: 0.2, sbf: 0, oddratio: 0, hicnt: 19, hicov: 523, confidence: "ctdna_candidate" },
    { gene: "FGFR1", chr: "8", pos: 38427091, ref: "AGTGA...", alt: "TGAGA...", type: "Complex", vaf: 0.227, depth: 163, alt_reads: 37, mq: 58.9, sn: 74, hiaf: 0.2313, msi: 1, nm: 2.3, sbf: 0.00047, oddratio: 9.46522, hicnt: 37, hicov: 160, confidence: "high" },
    { gene: "FGFR1", chr: "8", pos: 38466895, ref: "AC", alt: "A", type: "Deletion", vaf: 0.7608, depth: 439, alt_reads: 334, mq: 60, sn: 333, hiaf: 0.8043, msi: 10, nm: 0.6, sbf: 0, oddratio: 111.022, hicnt: 333, hicov: 414, confidence: "high" },
    { gene: "MYC", chr: "8", pos: 127739018, ref: "T", alt: "<DEL>", type: "DEL", vaf: 0.7738, depth: 831, alt_reads: 643, mq: 60, sn: 642, hiaf: 0.4605, msi: 0, nm: 0.1, sbf: 0.00012, oddratio: 1.50978, hicnt: 642, hicov: 1394, confidence: "high" },
    { gene: "PHOX2B", chr: "4", pos: 41747411, ref: "GGTAG...", alt: "TGGTC...", type: "Complex", vaf: 0.0374, depth: 589, alt_reads: 22, mq: 60, sn: 10, hiaf: 0.0366, msi: 3, nm: 2, sbf: 0, oddratio: 0, hicnt: 20, hicov: 547, confidence: "ctdna_candidate" },
    { gene: "FAT1", chr: "4", pos: 186596604, ref: "G", alt: "A", type: "SNV", vaf: 0.0641, depth: 577, alt_reads: 37, mq: 60, sn: 36, hiaf: 0.0667, msi: 5, nm: 1.3, sbf: 0, oddratio: 6.49054, hicnt: 36, hicov: 540, confidence: "high" },
    { gene: "TMPRSS2", chr: "21", pos: 41495067, ref: "CAA", alt: "C", type: "Deletion", vaf: 0.2758, depth: 330, alt_reads: 91, mq: 59.7, sn: 17.2, hiaf: 0.3127, msi: 16, nm: 0.8, sbf: 0, oddratio: 5.49964, hicnt: 86, hicov: 275, confidence: "ctdna_candidate" },
  ],
  sv_table: [
    { gene: "KLF4", chr: "9", pos: 107485924, sv_type: "DEL", sv_len: 1101, vaf: 0.6471, splitread: 173, spanpair: 69, confidence: "high" },
    { gene: "KLF4", chr: "9", pos: 107485927, sv_type: "DEL", sv_len: 1101, vaf: 0.121, splitread: 2, spanpair: 67, confidence: "high" },
    { gene: "MYC", chr: "8", pos: 127739018, sv_type: "DEL", sv_len: 1376, vaf: 0.7738, splitread: 486, spanpair: 157, confidence: "high" },
  ],
  vaf_per_gene: [
    { gene: "ETV6", max_vaf: 0.9913 }, { gene: "FGFR4", max_vaf: 0.9758 }, { gene: "EGFR", max_vaf: 0.8787 },
    { gene: "HLA-A", max_vaf: 0.7844 }, { gene: "MYC", max_vaf: 0.7738 }, { gene: "FGFR1", max_vaf: 0.7608 },
    { gene: "NF1", max_vaf: 0.7421 }, { gene: "KLF4", max_vaf: 0.6471 }, { gene: "ETV4", max_vaf: 0.6105 },
    { gene: "HLA-C", max_vaf: 0.5673 }, { gene: "PTCH1", max_vaf: 0.5547 }, { gene: "GRIN2A", max_vaf: 0.4977 },
    { gene: "SMAD4", max_vaf: 0.4293 }, { gene: "KLRC2", max_vaf: 0.3901 }, { gene: "EGFL7", max_vaf: 0.3853 },
    { gene: "PAX8", max_vaf: 0.36 }, { gene: "CUX1", max_vaf: 0.3527 }, { gene: "PTPRS", max_vaf: 0.3297 },
    { gene: "HNF1A", max_vaf: 0.3064 }, { gene: "SUZ12", max_vaf: 0.2918 }, { gene: "CYP2D6", max_vaf: 0.2843 },
    { gene: "QKI", max_vaf: 0.2645 }, { gene: "SH2B3", max_vaf: 0.2627 }, { gene: "TMPRSS2", max_vaf: 0.2758 },
    { gene: "BRAF", max_vaf: 0.2218 }, { gene: "IGHJ", max_vaf: 0.0895 }, { gene: "FAT1", max_vaf: 0.0641 },
    { gene: "PAX3", max_vaf: 0.042 }, { gene: "PHOX2B", max_vaf: 0.0374 }, { gene: "AXIN2", max_vaf: 0.0298 },
    { gene: "ATRX", max_vaf: 0.0193 }, { gene: "DNM2", max_vaf: 0.0144 }, { gene: "C11ORF95", max_vaf: 0.0148 },
  ],
  clinical_summary: [
    { gene: "EGFR", type: "SNV", vaf: 87.87, confidence: "ctdna_candidate", significance: "Oncogene — EGFR activating; major lung/solid tumour driver", actionability: "Targeted therapy (TKI inhibitors)", risk: "HIGH" },
    { gene: "FGFR4", type: "SNV", vaf: 97.58, confidence: "high", significance: "Oncogene — FGFR4 driver; rhabdomyosarcoma, HCC", actionability: "FGFR inhibitors (fisogatinib)", risk: "HIGH" },
    { gene: "ETV6", type: "SNV", vaf: 99.13, confidence: "high", significance: "TSG — ETV6 loss; haematological malignancy marker", actionability: "Diagnostic / prognostic marker", risk: "MODERATE" },
    { gene: "MYC", type: "DEL (SV)", vaf: 77.38, confidence: "high", significance: "Oncogene — MYC deletion; aggressive tumour behaviour", actionability: "BET bromodomain inhibitors (investigational)", risk: "HIGH" },
    { gene: "NF1", type: "Insertion + SNV", vaf: 74.21, confidence: "high", significance: "TSG — NF1 loss; RAS pathway activation", actionability: "MEK inhibitors (trametinib)", risk: "HIGH" },
    { gene: "FGFR1", type: "Complex + Deletion", vaf: 76.08, confidence: "high", significance: "Oncogene — FGFR1 amplification; multiple solid tumours", actionability: "FGFR inhibitors applicable", risk: "HIGH" },
    { gene: "BRAF", type: "SNV", vaf: 22.18, confidence: "high", significance: "Oncogene — BRAF mutation; MAP kinase driver", actionability: "BRAF/MEK inhibitors", risk: "MODERATE" },
    { gene: "SMAD4", type: "Insertion", vaf: 42.93, confidence: "high", significance: "TSG — SMAD4 loss; TGF-β disruption", actionability: "Prognostic; clinical trial eligibility", risk: "MODERATE" },
  ],
  score_components: [
    { label: "High-VAF Actionable Variants", weight: 35, color: "#ef4444", desc: "EGFR(0.88), FGFR4(0.98), ETV6(0.99), NF1(0.74), MYC(0.77), FGFR1(0.76)" },
    { label: "ctDNA Candidate Burden", weight: 25, color: "#8b5cf6", desc: "19 variants with circulating tumour DNA characteristics" },
    { label: "Resistance Gene Burden", weight: 25, color: "#f59e0b", desc: "EGFR, BRAF, FGFR1, NF1 — therapy resistance associated" },
    { label: "Structural Variant Load", weight: 15, color: "#3b82f6", desc: "3 large deletions including MYC and KLF4" },
  ],
  reference_ranges: {
    vaf: { low: "<20%", moderate: "20–50%", high: ">50%", note: "Heterozygous germline ~50%, homozygous ~100%" },
    depth: { min_adequate: 100, good: 500, excellent: 1000, note: "Ideal: ≥500× for somatic calling" },
    mq: { poor: "<30", acceptable: "30–59", ideal: "60", note: "MQ=60: perfectly unique mapping" },
    sn: { low: "<1.5", acceptable: "≥1.5", good: "≥10", note: "Higher = cleaner variant call" },
    msi: { normal: "0–5", elevated: "6–11", high: "≥12", note: "High MSI = microsatellite region, higher FP risk" },
    nm: { good: "<2", caution: "2–5", flag: "≥5.25", note: "NM≥5.25 triggers NM5.25 filter" },
  },
  patient_info: {
    genes_tested: 33,
    important_findings: 8,
    targetable: 6,
    steps: [
      "Your doctor will review all findings with you in detail at your next appointment.",
      "A multidisciplinary tumour board may discuss your case to recommend the best treatment approach.",
      "Additional tests may be recommended to confirm findings or assess other biomarkers.",
      "Based on these results, your doctor may suggest targeted therapy, chemotherapy, immunotherapy, or clinical trial options.",
      "Follow-up testing (such as liquid biopsy) may be used to monitor treatment response over time.",
    ],
    gene_cards: [
      { gene: "EGFR", plain: "Epidermal Growth Factor Receptor", finding: "A change found in a large proportion of cells tested (88%).", why: "There are approved medicines targeting this change.", action: "EGFR-targeted medicine may be considered.", color: "#ef4444" },
      { gene: "BRAF", plain: "B-Raf Proto-Oncogene", finding: "A change found in about 22% of cells tested.", why: "BRAF mutations can be targeted by specific medicines.", action: "BRAF-targeted therapy evaluation.", color: "#f59e0b" },
      { gene: "FGFR1/FGFR4", plain: "Fibroblast Growth Factor Receptors", finding: "Changes found in both FGFR1 and FGFR4 at very high proportions.", why: "FGFR inhibitor drugs exist and are being studied.", action: "Discuss FGFR inhibitor eligibility with your oncologist.", color: "#f59e0b" },
      { gene: "MYC", plain: "MYC Proto-Oncogene", finding: "A large piece of this gene is deleted in approximately 77% of cells.", why: "MYC changes are linked to aggressive cancer behaviour.", action: "Discuss clinical trial options with your doctor.", color: "#8b5cf6" },
      { gene: "NF1", plain: "Neurofibromatosis Type 1 Gene", finding: "Changes found in ~72–74% of cells.", why: "Loss of NF1 can make some MEK inhibitor drugs effective.", action: "MEK inhibitor therapy may be considered.", color: "#f59e0b" },
      { gene: "SMAD4", plain: "SMAD Family Member 4", finding: "A change found in approximately 43% of cells.", why: "Important in pancreatic/colorectal cancers; affects treatment response.", action: "Your doctor will use this to refine treatment plan.", color: "#f59e0b" },
    ],
  },
};

// ─── Navigation pages ─────────────────────────────────────────────
const NAV_PAGES = [
  { id: "overview", label: "Executive Summary", icon: "clipboard-pulse" },
  { id: "variants", label: "Variant Analysis", icon: "table" },
  { id: "vaf", label: "VAF & Risk", icon: "chart-bar" },
  { id: "resistance", label: "Drug Resistance", icon: "shield" },
  { id: "quality", label: "QC Metrics", icon: "layers" },
  { id: "patient", label: "Patient Summary", icon: "user" },
  { id: "technical", label: "Technical Report", icon: "flask" },
];

// ─── Colour helpers ───────────────────────────────────────────────
function vafColor(v) {
  if (v >= 0.7) return "#ef4444";
  if (v >= 0.5) return "#f97316";
  if (v >= 0.2) return "#f59e0b";
  return "#10b981";
}
function riskColor(r) {
  if (r === "HIGH") return "#ef4444";
  if (r === "MODERATE") return "#f59e0b";
  return "#10b981";
}
function confidenceColor(c) {
  return c === "high" ? "#10b981" : "#8b5cf6";
}

// ─── SVG Donut ────────────────────────────────────────────────────
function DonutChart({ data, size = 130, thickness = 14, label, sublabel, isDark }) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const slices = data.map(d => {
    const pct = d.value / total;
    const dash = pct * circ - 1.5;
    const sl = { ...d, dash, gap: circ - dash, offset };
    offset += pct * circ;
    return sl;
  });
  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
        strokeWidth={thickness} />
      {slices.map((s, i) => (
        <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={s.color} strokeWidth={thickness} strokeLinecap="butt"
          strokeDasharray={`${s.dash} ${circ - s.dash}`}
          strokeDashoffset={-s.offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      ))}
      {label && (
        <text x={size / 2} y={size / 2 - 5} textAnchor="middle"
          style={{ fontSize: "15px", fontWeight: 900, fill: isDark ? "#f1f5f9" : "#1d1d1f" }}>
          {label}
        </text>
      )}
      {sublabel && (
        <text x={size / 2} y={size / 2 + 13} textAnchor="middle"
          style={{ fontSize: "9px", fontWeight: 600, fill: isDark ? "#64748b" : "#8e8e93" }}>
          {sublabel}
        </text>
      )}
    </svg>
  );
}

// ─── Canvas Bar Chart ─────────────────────────────────────────────
function CanvasBarChart({ data, isDark, height = 180, xKey = "chr", yKey = "count", colorKey }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    const pad = { top: 16, right: 16, bottom: 36, left: 36 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;
    const maxV = Math.max(...data.map(d => d[yKey]));
    const barW = Math.max(4, (cW / data.length) - 4);
    const tc = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)";
    const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * cH;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y);
      ctx.strokeStyle = gc; ctx.lineWidth = 1; ctx.stroke();
      const val = Math.round(maxV - (i / 4) * maxV);
      ctx.fillStyle = tc; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "right";
      ctx.fillText(val, pad.left - 4, y + 3);
    }
    data.forEach((d, i) => {
      const bH = (d[yKey] / maxV) * cH;
      const x = pad.left + (i / data.length) * cW + (cW / data.length - barW) / 2;
      const y = pad.top + cH - bH;
      const color = colorKey ? d[colorKey] : "#3b82f6";
      const grad = ctx.createLinearGradient(0, y, 0, y + bH);
      grad.addColorStop(0, color + "cc"); grad.addColorStop(1, color + "66");
      ctx.beginPath(); ctx.roundRect(x, y, barW, bH, 3);
      ctx.fillStyle = grad; ctx.fill();
      ctx.fillStyle = tc; ctx.font = "9px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(d[xKey], x + barW / 2, H - 6);
    });
  }, [data, isDark]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: `${height}px`, display: "block" }} />;
}

// ─── Canvas Histogram ─────────────────────────────────────────────
function VAFHistogram({ data, isDark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    const pad = { top: 16, right: 16, bottom: 48, left: 36 };
    const cW = W - pad.left - pad.right;
    const cH = H - pad.top - pad.bottom;
    const maxV = Math.max(...data.map(d => d.count));
    const barW = cW / data.length - 4;
    const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)";
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * cH;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
      ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = tc; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "right";
      ctx.fillText(Math.round(maxV - (i / 4) * maxV), pad.left - 4, y + 3);
    }
    data.forEach((d, i) => {
      const bH = (d.count / maxV) * cH;
      const x = pad.left + i * (barW + 4);
      const y = pad.top + cH - bH;
      const grad = ctx.createLinearGradient(0, y, 0, y + bH);
      grad.addColorStop(0, d.color + "dd"); grad.addColorStop(1, d.color + "55");
      ctx.beginPath(); ctx.roundRect(x, y, barW, bH, 4);
      ctx.fillStyle = grad; ctx.fill();
      ctx.fillStyle = d.color; ctx.font = "bold 11px Inter,sans-serif"; ctx.textAlign = "center";
      ctx.fillText(d.count, x + barW / 2, y - 4);
      ctx.fillStyle = tc; ctx.font = "9px Inter,sans-serif";
      ctx.fillText(d.range, x + barW / 2, H - pad.bottom + 14);
      ctx.save(); ctx.translate(x + barW / 2, H - 8); ctx.rotate(-0.5);
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
      ctx.font = "8px Inter,sans-serif"; ctx.textAlign = "center"; ctx.fillText("VAF", 0, 0);
      ctx.restore();
    });
    // Annotations
    const hetX = pad.left + (4.5 / data.length) * cW;
    ctx.beginPath(); ctx.setLineDash([4, 4]);
    ctx.moveTo(hetX, pad.top); ctx.lineTo(hetX, pad.top + cH);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"; ctx.lineWidth = 1; ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
    ctx.font = "9px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillText("Het germline ~50%", hetX, pad.top + 10);
  }, [data, isDark]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "180px", display: "block" }} />;
}

// ─── VAF per Gene Horizontal Bar ─────────────────────────────────
function VAFGeneChart({ data, isDark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    const pad = { top: 8, right: 60, bottom: 8, left: 80 };
    const cW = W - pad.left - pad.right;
    const rowH = Math.max(14, (H - pad.top - pad.bottom) / data.length);
    ctx.clearRect(0, 0, W, H);
    // 50% threshold line
    const thX = pad.left + 0.5 * cW;
    ctx.beginPath(); ctx.setLineDash([3, 3]);
    ctx.moveTo(thX, pad.top); ctx.lineTo(thX, H - pad.bottom);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
    ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
    ctx.font = "8px Inter,sans-serif"; ctx.textAlign = "center";
    ctx.fillText("50%", thX, pad.top + 8);
    data.forEach((d, i) => {
      const y = pad.top + i * rowH + rowH / 4;
      const bH = rowH * 0.5;
      const bW = d.max_vaf * cW;
      const color = d.max_vaf >= 0.5 ? "#ef4444" : d.max_vaf >= 0.2 ? "#f59e0b" : "#10b981";
      const grad = ctx.createLinearGradient(pad.left, 0, pad.left + bW, 0);
      grad.addColorStop(0, color + "aa"); grad.addColorStop(1, color + "ff");
      ctx.beginPath(); ctx.roundRect(pad.left, y, bW, bH, 2);
      ctx.fillStyle = grad; ctx.fill();
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)";
      ctx.font = "9px Inter,sans-serif"; ctx.textAlign = "right";
      ctx.fillText(d.gene, pad.left - 4, y + bH / 2 + 3);
      ctx.fillStyle = color; ctx.font = "bold 9px Inter,sans-serif"; ctx.textAlign = "left";
      ctx.fillText((d.max_vaf * 100).toFixed(1) + "%", pad.left + bW + 4, y + bH / 2 + 3);
    });
  }, [data, isDark]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: `${Math.max(300, data.length * 18)}px`, display: "block" }} />;
}

// ─── Semi-circle Gauge ────────────────────────────────────────────
function SemiGauge({ score, isDark }) {
  const size = 200;
  const cx = size / 2, cy = size * 0.65;
  const r = 78;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const totalArc = Math.PI;
  const pct = score / 100;
  const needleAngle = startAngle + pct * totalArc;
  const nx = cx + r * Math.cos(needleAngle);
  const ny = cy + r * Math.sin(needleAngle);
  const zones = [
    { pct: 0.33, color: "#10b981", label: "Low" },
    { pct: 0.33, color: "#f59e0b", label: "Moderate" },
    { pct: 0.34, color: "#ef4444", label: "High" },
  ];
  let zoneOffset = 0;
  const zoneArcs = zones.map(z => {
    const a1 = startAngle + zoneOffset * totalArc;
    const a2 = startAngle + (zoneOffset + z.pct) * totalArc;
    const lx1 = cx + r * Math.cos(a1), ly1 = cy + r * Math.sin(a1);
    const lx2 = cx + r * Math.cos(a2), ly2 = cy + r * Math.sin(a2);
    const ri = r - 16;
    const ix1 = cx + ri * Math.cos(a1), iy1 = cy + ri * Math.sin(a1);
    const ix2 = cx + ri * Math.cos(a2), iy2 = cy + ri * Math.sin(a2);
    const d = `M${lx1},${ly1} A${r},${r} 0 0,1 ${lx2},${ly2} L${ix2},${iy2} A${ri},${ri} 0 0,0 ${ix1},${iy1} Z`;
    const arc = { ...z, d, midAngle: (a1 + a2) / 2 };
    zoneOffset += z.pct;
    return arc;
  });
  const tc = isDark ? "#f1f5f9" : "#1d1d1f";
  const sc = isDark ? "#8b949e" : "#6e6e73";
  return (
    <svg viewBox={`0 0 ${size} ${size * 0.7}`} style={{ width: "100%", maxWidth: "260px" }}>
      <defs>
        <filter id="needle-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      {zoneArcs.map((z, i) => (
        <g key={i}>
          <path d={z.d} fill={z.color} opacity="0.85" />
          <text
            x={cx + (r - 8) * Math.cos(z.midAngle)}
            y={cy + (r - 8) * Math.sin(z.midAngle)}
            textAnchor="middle" style={{ fontSize: "7px", fill: "#fff", fontWeight: 700 }}>
            {z.label}
          </text>
        </g>
      ))}
      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny}
        stroke={isDark ? "#f1f5f9" : "#1d1d1f"} strokeWidth="2.5"
        strokeLinecap="round" filter="url(#needle-shadow)" />
      <circle cx={cx} cy={cy} r="6" fill={isDark ? "#f1f5f9" : "#1d1d1f"} />
      <circle cx={cx} cy={cy} r="3" fill={isDark ? "#161b22" : "#fff"} />
      <text x={cx} y={cy - 22} textAnchor="middle"
        style={{ fontSize: "26px", fontWeight: 900, fill: score >= 67 ? "#ef4444" : score >= 34 ? "#f59e0b" : "#10b981" }}>
        {score}
      </text>
      <text x={cx} y={cy - 8} textAnchor="middle"
        style={{ fontSize: "9px", fontWeight: 700, fill: sc }}>/ 100</text>
      <text x={cx} y={cy + 14} textAnchor="middle"
        style={{ fontSize: "10px", fontWeight: 700, fill: score >= 67 ? "#ef4444" : "#f59e0b" }}>
        {score >= 67 ? "HIGH RISK" : score >= 34 ? "MODERATE" : "LOW RISK"}
      </text>
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function Dashboard({ onReset, fileName, theme, toggleTheme }) {
  const isDark = theme === "dark";
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const [sortField, setSortField] = useState("vaf");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedGene, setExpandedGene] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  // ── Colours ──────────────────────────────────────────────────
  const pageBg = isDark ? "#0d1117" : "#f0f2f5";
  const navBg = isDark ? "rgba(13,17,23,0.95)" : "rgba(255,255,255,0.95)";
  const navBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const sidebarBg = isDark ? "#0d1117" : "#ffffff";
  const sidebarBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const cardBg = isDark ? "#161b22" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardShadow = isDark ? "none" : "0 1px 4px rgba(0,0,0,0.06)";
  const tp = isDark ? "#f0f6fc" : "#1d1d1f";
  const ts = isDark ? "#8b949e" : "#6e6e73";
  const tm = isDark ? "#484f58" : "#aeaeb2";
  const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const trackBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const chipBg = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const chipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const rowHover = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const inputBg = isDark ? "rgba(255,255,255,0.05)" : "#f8fafc";

  const lbl = {
    fontSize: "10px", fontWeight: 900, textTransform: "uppercase",
    letterSpacing: "0.12em", color: tm,
  };

  // ── Card wrapper ─────────────────────────────────────────────
  const Card = ({ children, style: s = {}, onClick }) => (
    <div onClick={onClick} style={{
      background: cardBg, border: `1px solid ${cardBorder}`,
      borderRadius: "16px", boxShadow: cardShadow,
      overflow: "hidden", transition: "all 0.3s",
      cursor: onClick ? "pointer" : "default", ...s,
    }}>
      {children}
    </div>
  );

  // ── Section header ────────────────────────────────────────────
  const SH = ({ title, accent = "#3b82f6", right }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          display: "inline-block", width: "3px", height: "14px", borderRadius: "2px",
          background: accent, flexShrink: 0
        }} />
        <span style={{ ...lbl, color: tm }}>{title}</span>
      </div>
      {right}
    </div>
  );

  // ── Stat Row ─────────────────────────────────────────────────
  const StatRow = ({ label: l, value, highlight, ideal, color }) => (
    <div style={{
      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      padding: "9px 10px", borderRadius: "10px", marginBottom: "3px",
      background: highlight
        ? isDark ? "rgba(59,130,246,0.08)" : "rgba(239,246,255,1)"
        : "transparent",
      border: highlight
        ? `1px solid ${isDark ? "rgba(59,130,246,0.15)" : "rgba(191,219,254,0.6)"}`
        : "1px solid transparent",
    }}>
      <div>
        <span style={{ fontSize: "12px", color: ts }}>{l}</span>
        {ideal && <div style={{ fontSize: "10px", color: tm, marginTop: "2px" }}>Ideal: {ideal}</div>}
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color: color || (highlight ? (isDark ? "#93c5fd" : "#2563eb") : tp), flexShrink: 0, marginLeft: "8px" }}>
        {value ?? "—"}
      </span>
    </div>
  );

  // ── Badge ────────────────────────────────────────────────────
  const Badge = ({ label: l, color, small }) => (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: small ? "2px 7px" : "3px 9px",
      borderRadius: "6px", fontSize: small ? "10px" : "11px", fontWeight: 700,
      background: color + "18", border: `1px solid ${color}40`, color,
    }}>
      {l}
    </span>
  );

  // ── Pulse dot ────────────────────────────────────────────────
  const PulseDot = ({ color }) => (
    <span style={{
      display: "inline-block", width: "6px", height: "6px", borderRadius: "50%",
      background: color, boxShadow: `0 0 6px ${color}`, animation: "pulse 2s infinite",
    }} />
  );

  // ── Progress bar ─────────────────────────────────────────────
  const ProgressBar = ({ value, max = 100, color, height = 5, showIdeal, idealRange }) => (
    <div>
      <div style={{ width: "100%", height: `${height}px`, background: trackBg, borderRadius: "99px", overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", width: `${Math.min((value / max) * 100, 100)}%`,
          background: color, borderRadius: "99px", transition: "width 0.8s ease"
        }} />
        {showIdeal && idealRange && (
          <>
            <div style={{ position: "absolute", top: 0, left: `${idealRange[0]}%`, width: "1px", height: "100%", background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", top: 0, left: `${idealRange[1]}%`, width: "1px", height: "100%", background: "rgba(255,255,255,0.5)" }} />
          </>
        )}
      </div>
      {showIdeal && idealRange && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
          <span style={{ fontSize: "9px", color: tm }}>0</span>
          <span style={{ fontSize: "9px", color: "#10b981" }}>Ideal range</span>
          <span style={{ fontSize: "9px", color: tm }}>100</span>
        </div>
      )}
    </div>
  );

  // ── KPI Card ─────────────────────────────────────────────────
  const KPICard = ({ label: l, value, unit, color, sub, icon, ideal }) => (
    <Card style={{ padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
          background: color + "18", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon d={ICONS[icon] || ICONS.dna} size={16} style={{ color }} />
        </div>
        <PulseDot color={color} />
      </div>
      <p style={{ fontSize: "26px", fontWeight: 900, color: tp, lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}<span style={{ fontSize: "13px", fontWeight: 600, color: ts, marginLeft: "3px" }}>{unit}</span>
      </p>
      <p style={{ fontSize: "11px", color: ts, marginTop: "6px", fontWeight: 600 }}>{l}</p>
      {ideal && <p style={{ fontSize: "10px", color: tm, marginTop: "3px" }}>Ideal: {ideal}</p>}
      {sub && <p style={{ fontSize: "10px", color: tm, marginTop: "3px" }}>{sub}</p>}
    </Card>
  );

  // ── Table filter/sort helpers ─────────────────────────────────
  const filteredVariants = S5_DATA.all_variants
    .filter(v => {
      const matchSearch = !tableSearch || v.gene.toLowerCase().includes(tableSearch.toLowerCase()) || v.type.toLowerCase().includes(tableSearch.toLowerCase());
      const matchConf = tableFilter === "all" || v.confidence === tableFilter;
      return matchSearch && matchConf;
    })
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      return sortDir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  // ─────────────────────────────────────────────────────────────
  // PAGE: OVERVIEW
  // ─────────────────────────────────────────────────────────────
  const PageOverview = () => (
    <div>
      {/* Report Header Banner */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ fontSize: "20px", fontWeight: 900, color: tp }}>Sample S5</span>
              <Badge label="HIGH RISK" color="#ef4444" />
              <Badge label="ctDNA Detected" color="#8b5cf6" />
            </div>
            <p style={{ fontSize: "12px", color: ts }}>Targeted Somatic Panel (Hematology/Oncology) — VarDict v1.8.2 — hg38/GRCh38</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {[
              { l: "Pipeline", v: "VarDict v1.8.2" },
              { l: "Reference", v: "hg38 / GRCh38" },
              { l: "Panel", v: "Hematology / Oncology" },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ ...lbl, marginBottom: "2px" }}>{item.l}</p>
                <p style={{ fontSize: "12px", fontWeight: 700, color: tp }}>{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", marginBottom: "16px" }}>
        <KPICard label="Total Variants" value={49} unit="variants" color="#3b82f6" icon="dna" ideal="—" />
        <KPICard label="High Confidence" value={30} unit="variants" color="#10b981" icon="shield" sub="Passes all QC filters" />
        <KPICard label="ctDNA Candidates" value={19} unit="variants" color="#8b5cf6" icon="flask" sub="ctDNA-consistent signatures" />
        <KPICard label="Actionable Genes" value={6} unit="genes" color="#ef4444" icon="target" sub="EGFR, BRAF, FGFR1, FGFR4, MYC, SMAD4" />
        <KPICard label="Resistance Genes" value={4} unit="genes" color="#f59e0b" icon="shield" sub="EGFR, BRAF, FGFR1, NF1" />
        <KPICard label="Mean Depth" value={648} unit="×" color="#3b82f6" icon="layers" ideal="≥500×" sub="Range: 109× – 3,067×" />
      </div>

      {/* Risk Score + Composition */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "16px" }} className="ov-row2">
        {/* Risk Score Panel */}
        <Card style={{ padding: "24px" }}>
          <SH title="Overall Genomic Risk Score" accent="#ef4444" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <SemiGauge score={74} isDark={isDark} />
              <p style={{ fontSize: "11px", color: ts, textAlign: "center", maxWidth: "220px", marginTop: "8px", lineHeight: 1.5 }}>
                Composite score from VAF, oncogenicity, variant type, confidence & resistance gene presence
              </p>
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: tp, marginBottom: "12px" }}>Score Components</p>
              {S5_DATA.score_components.map((c, i) => (
                <div key={i} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: tp }}>{c.label}</span>
                      <span style={{ fontSize: "10px", color: tm, marginLeft: "6px" }}>Weight: {c.weight}%</span>
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: 900, color: c.color }}>{c.weight}%</span>
                  </div>
                  <ProgressBar value={c.weight} max={35} color={c.color} height={6} />
                  <p style={{ fontSize: "10px", color: tm, marginTop: "3px" }}>{c.desc}</p>
                </div>
              ))}
              <div style={{
                padding: "12px", borderRadius: "12px", marginTop: "8px",
                background: isDark ? "rgba(239,68,68,0.06)" : "rgba(254,242,242,1)",
                border: `1px solid ${isDark ? "rgba(239,68,68,0.15)" : "rgba(252,165,165,0.5)"}`
              }}>
                <p style={{ fontSize: "11px", color: isDark ? "#fca5a5" : "#dc2626", fontWeight: 600, lineHeight: 1.6 }}>
                  ⚠ Score of 74/100 places this sample in the HIGH RISK zone. Immediate oncology consultation recommended.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tumour Fraction */}
        <Card style={{ padding: "24px" }}>
          <SH title="Estimated Tumour Fraction (ctDNA)" accent="#8b5cf6" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px", marginBottom: "16px" }}>
            {[
              { label: "Median VAF (High Conf.)", value: "0.44 (44%)", ideal: "Somatic het ~0.5", color: "#3b82f6" },
              { label: "Estimated Tumour Fraction", value: "~40–50%", ideal: "Diploid, no CNA assumed", color: "#8b5cf6" },
              { label: "ctDNA Signal", value: "Detectable", ideal: "19 variants consistent", color: "#10b981" },
            ].map((m, i) => (
              <div key={i} style={{
                padding: "14px", borderRadius: "12px",
                background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                border: `1px solid ${cardBorder}`
              }}>
                <p style={{ ...lbl, marginBottom: "6px" }}>{m.label}</p>
                <p style={{ fontSize: "18px", fontWeight: 900, color: m.color }}>{m.value}</p>
                <p style={{ fontSize: "10px", color: tm, marginTop: "4px" }}>{m.ideal}</p>
              </div>
            ))}
          </div>
          <div style={{
            padding: "12px", borderRadius: "10px",
            background: isDark ? "rgba(139,92,246,0.06)" : "rgba(245,243,255,1)",
            border: `1px solid ${isDark ? "rgba(139,92,246,0.2)" : "rgba(196,181,253,0.5)"}`
          }}>
            <p style={{ fontSize: "11px", color: isDark ? "#c4b5fd" : "#7c3aed", lineHeight: 1.6, fontWeight: 600 }}>
              Approximately 44% of reads carry the variant allele on average, suggesting substantial tumour/ctDNA contribution.
              Assumes diploid tumour with no copy number alterations at these loci.
            </p>
          </div>
        </Card>
      </div>

      {/* Clinical Summary Table */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="Top Clinical Findings" accent="#3b82f6" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "640px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${divider}` }}>
                {["Gene", "Type", "VAF (%)", "Confidence", "Significance", "Actionability", "Risk"].map(h => (
                  <th key={h} style={{ paddingBottom: "10px", paddingRight: "12px", textAlign: "left", ...lbl }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {S5_DATA.clinical_summary.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${divider}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 12px 10px 0", fontWeight: 900, color: isDark ? "#60a5fa" : "#2563eb" }}>{row.gene}</td>
                  <td style={{ padding: "10px 12px 10px 0" }}>
                    <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "5px", background: chipBg, border: `1px solid ${chipBorder}`, color: ts, whiteSpace: "nowrap" }}>{row.type}</span>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "40px", height: "4px", background: trackBg, borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${row.vaf}%`, background: vafColor(row.vaf / 100), borderRadius: "99px" }} />
                      </div>
                      <span style={{ fontWeight: 700, color: vafColor(row.vaf / 100) }}>{row.vaf}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }}>
                    <Badge label={row.confidence === "high" ? "High" : "ctDNA"} color={confidenceColor(row.confidence)} small />
                  </td>
                  <td style={{ padding: "10px 12px 10px 0", color: ts, maxWidth: "200px", fontSize: "11px" }}>{row.significance}</td>
                  <td style={{ padding: "10px 12px 10px 0", color: ts, maxWidth: "160px", fontSize: "11px" }}>{row.actionability}</td>
                  <td style={{ padding: "10px 0" }}>
                    <Badge label={row.risk} color={riskColor(row.risk)} small />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Disclaimer */}
      <div style={{
        padding: "16px", borderRadius: "14px",
        background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
        border: `1px solid ${cardBorder}`,
        display: "flex", alignItems: "flex-start", gap: "10px"
      }}>
        <Icon d={ICONS.info} size={14} style={{ color: tm, flexShrink: 0, marginTop: "1px" }} />
        <p style={{ fontSize: "11px", lineHeight: 1.7, color: ts }}>
          <span style={{ fontWeight: 700, color: tp }}>Research / Clinical Use — </span>
          This analysis must be interpreted in clinical context by a licensed physician or molecular pathologist.
          The risk score is algorithmically derived. All findings should be confirmed with orthogonal methods.
        </p>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // PAGE: VARIANTS
  // ─────────────────────────────────────────────────────────────
  const PageVariants = () => (
    <div>
      {/* Distribution charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px", marginBottom: "16px" }}>
        {/* Variant Type Donut */}
        <Card style={{ padding: "20px" }}>
          <SH title="By Variant Type" accent="#3b82f6" />
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <DonutChart data={S5_DATA.variant_type_dist} label="49" sublabel="Total" isDark={isDark} />
            <div style={{ flex: 1, minWidth: "120px" }}>
              {S5_DATA.variant_type_dist.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: ts, flex: 1 }}>{d.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: tp }}>{d.value}</span>
                  <span style={{ fontSize: "10px", color: tm }}>({((d.value / 49) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Confidence Donut */}
        <Card style={{ padding: "20px" }}>
          <SH title="By Confidence Level" accent="#10b981" />
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <DonutChart data={S5_DATA.confidence_dist} label="49" sublabel="Variants" isDark={isDark} />
            <div style={{ flex: 1, minWidth: "120px" }}>
              {S5_DATA.confidence_dist.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "7px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: ts, flex: 1 }}>{d.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: tp }}>{d.value}</span>
                </div>
              ))}
              <div style={{
                marginTop: "12px", padding: "10px", borderRadius: "8px",
                background: isDark ? "rgba(139,92,246,0.06)" : "rgba(245,243,255,1)",
                border: `1px solid ${isDark ? "rgba(139,92,246,0.15)" : "rgba(196,181,253,0.5)"}`
              }}>
                <p style={{ fontSize: "10px", color: isDark ? "#c4b5fd" : "#7c3aed", lineHeight: 1.5 }}>
                  ctDNA candidates have characteristics consistent with circulating tumour DNA at low-to-moderate VAF (0.014–0.55)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Chr Distribution */}
        <Card style={{ padding: "20px" }}>
          <SH title="Variants per Chromosome" accent="#f59e0b" />
          <CanvasBarChart data={S5_DATA.chr_dist} isDark={isDark} height={160} xKey="chr" yKey="count" />
          <p style={{ fontSize: "10px", color: tm, marginTop: "8px" }}>Chr 6 has highest burden (9 variants — HLA locus)</p>
        </Card>
      </div>

      {/* VAF Histogram */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="VAF Distribution Across All 49 Variants" accent="#8b5cf6"
          right={
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {[{ l: "Low VAF (<20%)", c: "#10b981" }, { l: "Moderate (20–50%)", c: "#f59e0b" }, { l: "High VAF (>50%)", c: "#ef4444" }].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: r.c }} />
                  <span style={{ fontSize: "10px", color: ts }}>{r.l}</span>
                </div>
              ))}
            </div>
          }
        />
        <VAFHistogram data={S5_DATA.vaf_histogram} isDark={isDark} />
        <div style={{
          marginTop: "12px", padding: "12px", borderRadius: "10px",
          background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", border: `1px solid ${divider}`
        }}>
          <p style={{ ...lbl, marginBottom: "6px" }}>Reference Ranges</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[
              { l: "Heterozygous germline", v: "~50% VAF", c: "#f59e0b" },
              { l: "Homozygous / LOH", v: "~100% VAF", c: "#ef4444" },
              { l: "Low-level somatic / ctDNA", v: "<20% VAF", c: "#8b5cf6" },
              { l: "Sub-clonal", v: "10–40% VAF", c: "#3b82f6" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: r.c, flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: ts }}>{r.l}: <strong style={{ color: tp }}>{r.v}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Variant Table */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ display: "inline-block", width: "3px", height: "14px", borderRadius: "2px", background: "#818cf8" }} />
            <span style={{ ...lbl }}>COMPLETE VARIANT TABLE ({filteredVariants.length}/{S5_DATA.all_variants.length})</span>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Icon d={ICONS.search} size={12} style={{ color: tm, position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)" }} />
              <input value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                placeholder="Search gene or type..."
                style={{
                  paddingLeft: "28px", paddingRight: "10px", paddingTop: "7px", paddingBottom: "7px",
                  borderRadius: "10px", border: `1px solid ${cardBorder}`, background: inputBg,
                  color: tp, fontSize: "12px", outline: "none", width: "160px"
                }} />
            </div>
            <select value={tableFilter} onChange={e => setTableFilter(e.target.value)}
              style={{
                padding: "7px 12px", borderRadius: "10px", border: `1px solid ${cardBorder}`,
                background: inputBg, color: tp, fontSize: "12px", outline: "none"
              }}>
              <option value="all">All Confidence</option>
              <option value="high">High Only</option>
              <option value="ctdna_candidate">ctDNA Only</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${divider}` }}>
                {[
                  { f: "gene", l: "Gene" }, { f: "chr", l: "Chr" }, { f: "pos", l: "Position" },
                  { f: "type", l: "Type" }, { f: "vaf", l: "VAF" }, { f: "depth", l: "Depth" },
                  { f: "mq", l: "MQ" }, { f: "sn", l: "S/N" }, { f: "msi", l: "MSI" },
                  { f: "nm", l: "NM" }, { f: "confidence", l: "Confidence" },
                ].map(h => (
                  <th key={h.f} onClick={() => handleSort(h.f)} style={{
                    paddingBottom: "10px", paddingRight: "10px", textAlign: "left", ...lbl,
                    cursor: "pointer", userSelect: "none",
                    color: sortField === h.f ? (isDark ? "#60a5fa" : "#2563eb") : tm,
                  }}>
                    {h.l} {sortField === h.f ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredVariants.map((v, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${divider}`, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "9px 10px 9px 0", fontWeight: 900, color: isDark ? "#60a5fa" : "#2563eb", whiteSpace: "nowrap" }}>{v.gene}</td>
                  <td style={{ padding: "9px 10px 9px 0", fontFamily: "monospace", color: ts }}>{v.chr}</td>
                  <td style={{ padding: "9px 10px 9px 0", fontFamily: "monospace", color: ts, whiteSpace: "nowrap" }}>{v.pos.toLocaleString()}</td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <span style={{ padding: "2px 6px", borderRadius: "5px", background: chipBg, border: `1px solid ${chipBorder}`, color: ts, fontSize: "10px", whiteSpace: "nowrap" }}>{v.type}</span>
                  </td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "36px", height: "4px", background: trackBg, borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.min(v.vaf * 100, 100)}%`, background: vafColor(v.vaf), borderRadius: "99px" }} />
                      </div>
                      <span style={{ fontWeight: 700, color: vafColor(v.vaf), fontVariantNumeric: "tabular-nums" }}>{(v.vaf * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <span style={{ color: v.depth >= 500 ? "#10b981" : v.depth >= 100 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{v.depth}×</span>
                  </td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <span style={{ color: v.mq >= 50 ? "#10b981" : v.mq >= 30 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{v.mq}</span>
                  </td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <span style={{ color: v.sn >= 10 ? "#10b981" : v.sn >= 1.5 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{v.sn}</span>
                  </td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <span style={{ color: v.msi >= 12 ? "#ef4444" : v.msi >= 6 ? "#f59e0b" : "#10b981", fontWeight: 700 }}>{v.msi}</span>
                  </td>
                  <td style={{ padding: "9px 10px 9px 0" }}>
                    <span style={{ color: v.nm >= 5.25 ? "#ef4444" : v.nm >= 2 ? "#f59e0b" : "#10b981", fontWeight: 700 }}>{v.nm}</span>
                  </td>
                  <td style={{ padding: "9px 0" }}>
                    <Badge label={v.confidence === "high" ? "High" : "ctDNA"} color={confidenceColor(v.confidence)} small />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend for colour coding */}
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${divider}` }}>
          <p style={{ ...lbl, marginBottom: "8px" }}>Colour-coded thresholds (Depth / MQ / S/N / MSI / NM)</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[
              { l: "Good", c: "#10b981" }, { l: "Caution", c: "#f59e0b" }, { l: "Flag", c: "#ef4444" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: r.c }} />
                <span style={{ fontSize: "11px", color: ts }}>{r.l}</span>
              </div>
            ))}
            <span style={{ fontSize: "11px", color: tm }}>· Depth: ≥500=Good, ≥100=Caution · MQ: ≥50=Good, ≥30=Caution · S/N: ≥10=Good · MSI: ≥12=Flag · NM: ≥5.25=Flag</span>
          </div>
        </div>
      </Card>

      {/* SV Table */}
      <Card style={{ padding: "20px" }}>
        <SH title="Structural Variants (Large Deletions)" accent="#8b5cf6" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "600px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${divider}` }}>
                {["Gene", "Chr", "Position", "SV Type", "SV Length", "VAF", "Split Reads", "Span Pairs", "Confidence"].map(h => (
                  <th key={h} style={{ paddingBottom: "10px", paddingRight: "12px", textAlign: "left", ...lbl }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {S5_DATA.sv_table.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${divider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 12px 10px 0", fontWeight: 900, color: isDark ? "#60a5fa" : "#2563eb" }}>{r.gene}</td>
                  <td style={{ padding: "10px 12px 10px 0", fontFamily: "monospace", color: ts }}>{r.chr}</td>
                  <td style={{ padding: "10px 12px 10px 0", fontFamily: "monospace", color: ts }}>{r.pos.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px 10px 0" }}><Badge label={r.sv_type} color="#8b5cf6" small /></td>
                  <td style={{ padding: "10px 12px 10px 0", fontWeight: 700, color: tp }}>{r.sv_len.toLocaleString()} bp</td>
                  <td style={{ padding: "10px 12px 10px 0", fontWeight: 700, color: vafColor(r.vaf) }}>{(r.vaf * 100).toFixed(1)}%</td>
                  <td style={{ padding: "10px 12px 10px 0", color: tp }}>{r.splitread}</td>
                  <td style={{ padding: "10px 12px 10px 0", color: tp }}>{r.spanpair}</td>
                  <td style={{ padding: "10px 0" }}><Badge label="High" color="#10b981" small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // PAGE: VAF & RISK
  // ─────────────────────────────────────────────────────────────
  const PageVAF = () => (
    <div>
      {/* VAF per Gene */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="Variant Allele Frequency per Gene (Max VAF, sorted High → Low)" accent="#ef4444"
          right={
            <div style={{ display: "flex", gap: "10px" }}>
              {[{ l: "Low (<20%)", c: "#10b981" }, { l: "Moderate (20–50%)", c: "#f59e0b" }, { l: "High (>50%)", c: "#ef4444" }].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: r.c }} />
                  <span style={{ fontSize: "10px", color: ts }}>{r.l}</span>
                </div>
              ))}
            </div>
          }
        />
        <VAFGeneChart data={S5_DATA.vaf_per_gene} isDark={isDark} />
        <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <div style={{
            padding: "10px 14px", borderRadius: "10px",
            background: isDark ? "rgba(239,68,68,0.06)" : "rgba(254,242,242,1)",
            border: `1px solid ${isDark ? "rgba(239,68,68,0.15)" : "rgba(252,165,165,0.4)"}`
          }}>
            <p style={{ fontSize: "10px", color: isDark ? "#fca5a5" : "#dc2626", fontWeight: 600 }}>
              VAF &gt;70% (ETV6 99.1%, FGFR4 97.6%, EGFR 87.9%): Suggests clonal dominance or LOH
            </p>
          </div>
          <div style={{
            padding: "10px 14px", borderRadius: "10px",
            background: isDark ? "rgba(16,185,129,0.06)" : "rgba(240,253,244,1)",
            border: `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(167,243,208,0.4)"}`
          }}>
            <p style={{ fontSize: "10px", color: isDark ? "#6ee7b7" : "#059669", fontWeight: 600 }}>
              VAF &lt;20% (ATRX, DNM2, C11ORF95): Low-level ctDNA or sub-clonal variants
            </p>
          </div>
        </div>
      </Card>

      {/* VAF Reference Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SH title="VAF Interpretation Guide" accent="#3b82f6" />
          {[
            { range: "0–10%", interp: "Low-level ctDNA or sequencing noise", color: "#8b5cf6", ideal: false },
            { range: "10–20%", interp: "Sub-clonal somatic or ctDNA", color: "#3b82f6", ideal: false },
            { range: "20–50%", interp: "Heterozygous somatic (typical range)", color: "#f59e0b", ideal: true },
            { range: "50–70%", interp: "High tumour burden / some LOH", color: "#f97316", ideal: false },
            { range: "70–90%", interp: "Near-homozygous; clonal dominance", color: "#ef4444", ideal: false },
            { range: "90–100%", interp: "Homozygous / complete LOH", color: "#991b1b", ideal: false },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px",
              padding: "8px 10px", borderRadius: "8px",
              background: r.ideal ? (isDark ? "rgba(16,185,129,0.06)" : "rgba(240,253,244,1)") : "transparent",
              border: r.ideal ? `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(167,243,208,0.5)"}` : "1px solid transparent"
            }}>
              <span style={{ width: "44px", fontSize: "10px", fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.range}</span>
              <span style={{ fontSize: "11px", color: ts }}>{r.interp}</span>
              {r.ideal && <span style={{ fontSize: "9px", color: "#10b981", fontWeight: 700, marginLeft: "auto" }}>Normal Somatic</span>}
            </div>
          ))}
        </Card>

        <Card style={{ padding: "20px" }}>
          <SH title="High-VAF Actionable Variants" accent="#ef4444" />
          <p style={{ fontSize: "11px", color: ts, marginBottom: "12px" }}>Variants with VAF ≥ 70% — highest clinical priority</p>
          {S5_DATA.all_variants
            .filter(v => v.vaf >= 0.7)
            .sort((a, b) => b.vaf - a.vaf)
            .map((v, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px",
                padding: "10px", borderRadius: "10px",
                background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                border: `1px solid ${cardBorder}`
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 900, color: isDark ? "#60a5fa" : "#2563eb" }}>{v.gene}</span>
                    <Badge label={v.type} color="#8b5cf6" small />
                    <Badge label={v.confidence === "high" ? "High" : "ctDNA"} color={confidenceColor(v.confidence)} small />
                  </div>
                  <p style={{ fontSize: "10px", color: tm }}>chr{v.chr}:{v.pos.toLocaleString()} · Depth: {v.depth}×</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "18px", fontWeight: 900, color: vafColor(v.vaf), lineHeight: 1 }}>{(v.vaf * 100).toFixed(1)}%</p>
                  <p style={{ fontSize: "9px", color: tm }}>VAF</p>
                </div>
              </div>
            ))}
        </Card>

        <Card style={{ padding: "20px" }}>
          <SH title="VAF Scatter Summary (Depth vs VAF)" accent="#818cf8" />
          <p style={{ fontSize: "11px", color: ts, marginBottom: "12px" }}>Ideal: High depth + moderate VAF (20–50%) = most reliable somatic calls</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {S5_DATA.all_variants.map((v, i) => {
              const x = Math.min((v.depth / 3067) * 100, 100);
              const y = v.vaf * 100;
              return (
                <div key={i} title={`${v.gene}: VAF=${(v.vaf * 100).toFixed(1)}%, Depth=${v.depth}×`}
                  style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: `${Math.max(8, (v.depth / 3067) * 24)}px`,
                    height: `${Math.max(8, (v.depth / 3067) * 24)}px`,
                    borderRadius: "50%",
                    background: confidenceColor(v.confidence),
                    opacity: 0.7, border: `2px solid ${confidenceColor(v.confidence)}40`,
                    cursor: "pointer",
                  }} />
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: "10px", color: tm, marginTop: "10px" }}>Bubble size = read depth · Purple = ctDNA candidate · Green = High confidence</p>
          <div style={{ marginTop: "12px", display: "flex", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: "10px", color: ts }}>High confidence</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#8b5cf6" }} />
              <span style={{ fontSize: "10px", color: ts }}>ctDNA candidate</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // PAGE: RESISTANCE / DRUG
  // ─────────────────────────────────────────────────────────────
  const PageResistance = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "16px", marginBottom: "16px" }}>
        {S5_DATA.key_genes.map((g, i) => (
          <Card key={i} style={{ padding: "0", overflow: "hidden" }} onClick={() => setExpandedGene(expandedGene === i ? null : i)}>
            <div style={{
              padding: "16px 20px",
              borderLeft: `4px solid ${g.color}`,
              background: isDark ? `${g.color}08` : `${g.color}06`
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "16px", fontWeight: 900, color: tp }}>{g.gene}</span>
                    <Badge label={g.risk} color={g.color} small />
                    <Badge label={g.role} color={g.role === "Oncogene" ? "#ef4444" : "#3b82f6"} small />
                    <Badge label={g.confidence === "high" ? "High Conf." : "ctDNA"} color={confidenceColor(g.confidence)} small />
                  </div>
                  <p style={{ fontSize: "11px", color: ts, marginBottom: "4px" }}>{g.pathway}</p>
                  <p style={{ fontSize: "11px", fontFamily: "monospace", color: tm }}>chr{g.chr}:{g.pos} · {g.type}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "22px", fontWeight: 900, color: vafColor(g.vaf), lineHeight: 1 }}>{(g.vaf * 100).toFixed(1)}%</p>
                  <p style={{ fontSize: "9px", color: tm }}>VAF</p>
                </div>
              </div>
              <div style={{ marginTop: "10px" }}>
                <ProgressBar value={g.vaf * 100} max={100} color={vafColor(g.vaf)} height={5} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3px" }}>
                  <span style={{ fontSize: "9px", color: tm }}>0%</span>
                  <span style={{ fontSize: "9px", color: "#f59e0b" }}>50% (het germline)</span>
                  <span style={{ fontSize: "9px", color: tm }}>100%</span>
                </div>
              </div>
            </div>
            {expandedGene === i && (
              <div style={{ padding: "16px 20px", borderTop: `1px solid ${divider}` }}>
                <p style={{ fontSize: "12px", color: ts, lineHeight: 1.6, marginBottom: "12px" }}>{g.significance}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <p style={{ ...lbl, marginBottom: "6px", color: "#10b981" }}>Targeted Therapies</p>
                    {g.therapies.map((t, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                        <span style={{ fontSize: "11px", color: ts }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p style={{ ...lbl, marginBottom: "6px", color: "#f59e0b" }}>Resistance Notes</p>
                    <p style={{ fontSize: "11px", color: ts, lineHeight: 1.5 }}>{g.resistance}</p>
                  </div>
                </div>
              </div>
            )}
            <div style={{
              padding: "6px 20px 8px", background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              borderTop: `1px solid ${divider}`, display: "flex", alignItems: "center", gap: "4px"
            }}>
              <Icon d={ICONS.chevron} size={12} style={{ color: tm, transform: expandedGene === i ? "rotate(180deg)" : "none", transition: "0.2s" }} />
              <span style={{ fontSize: "10px", color: tm }}>{expandedGene === i ? "Collapse" : "Expand for therapy details"}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Drug-Gene Resistance Matrix */}
      <Card style={{ padding: "20px" }}>
        <SH title="Drug Resistance Overview Matrix" accent="#f59e0b" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", minWidth: "700px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${divider}` }}>
                <th style={{ paddingBottom: "10px", paddingRight: "12px", textAlign: "left", ...lbl, width: "80px" }}>Gene</th>
                {["TKI (EGFR)", "BRAF inhib.", "MEK inhib.", "FGFR inhib.", "CDK inhib.", "Anti-EGFR mAb", "Immunotherapy"].map(d => (
                  <th key={d} style={{ paddingBottom: "10px", paddingRight: "12px", textAlign: "center", ...lbl }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { gene: "EGFR", vals: ["sensitive", "—", "—", "—", "—", "sensitive", "invest."] },
                { gene: "BRAF", vals: ["—", "sensitive", "sensitive", "—", "—", "—", "invest."] },
                { gene: "FGFR1", vals: ["—", "—", "sensitive", "sensitive", "—", "—", "invest."] },
                { gene: "FGFR4", vals: ["—", "—", "—", "sensitive", "—", "—", "invest."] },
                { gene: "NF1", vals: ["—", "—", "sensitive", "—", "—", "—", "invest."] },
                { gene: "MYC", vals: ["—", "—", "—", "—", "invest.", "—", "invest."] },
                { gene: "SMAD4", vals: ["—", "—", "—", "—", "—", "resistant", "invest."] },
                { gene: "ETV6", vals: ["—", "—", "—", "—", "—", "—", "—"] },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${divider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 12px 10px 0", fontWeight: 900, color: isDark ? "#60a5fa" : "#2563eb" }}>{row.gene}</td>
                  {row.vals.map((v, j) => {
                    const color = v === "sensitive" ? "#10b981" : v === "resistant" ? "#ef4444" : v === "invest." ? "#f59e0b" : tm;
                    const bg = v === "sensitive" ? (isDark ? "rgba(16,185,129,0.1)" : "rgba(240,253,244,1)")
                      : v === "resistant" ? (isDark ? "rgba(239,68,68,0.1)" : "rgba(254,242,242,1)")
                        : v === "invest." ? (isDark ? "rgba(245,158,11,0.1)" : "rgba(255,251,235,1)")
                          : "transparent";
                    return (
                      <td key={j} style={{ padding: "8px 12px 8px 0", textAlign: "center" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "6px", background: bg, color, fontSize: "10px", fontWeight: 700 }}>{v}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[{ l: "Sensitive", c: "#10b981" }, { l: "Resistant", c: "#ef4444" }, { l: "Investigational", c: "#f59e0b" }, { l: "Not Applicable (—)", c: tm }].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: r.c }} />
              <span style={{ fontSize: "10px", color: ts }}>{r.l}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // PAGE: QUALITY METRICS
  // ─────────────────────────────────────────────────────────────
  const PageQuality = () => (
    <div>
      {/* QC KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px", marginBottom: "16px" }}>
        {[
          { label: "Mean Depth", value: "648×", color: "#3b82f6", ideal: "≥500×", sub: "Good" },
          { label: "Max Depth", value: "3,067×", color: "#10b981", sub: "EGFR locus" },
          { label: "Min Depth", value: "109×", color: "#f59e0b", ideal: "≥100×", sub: "EGFL7 locus" },
          { label: "Mean Map Quality", value: "57.8", color: "#3b82f6", ideal: "≥30 (ideal 60)" },
          { label: "PASS Filter", value: "37/49", color: "#10b981", sub: "75.5% variants" },
          { label: "Filtered Out", value: "12/49", color: "#f59e0b", sub: "NM5.25, Bias, MSI12" },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "16px" }}>
            <p style={{ fontSize: "22px", fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: "11px", fontWeight: 600, color: ts, marginTop: "6px" }}>{k.label}</p>
            {k.ideal && <p style={{ fontSize: "10px", color: tm, marginTop: "3px" }}>Ideal: {k.ideal}</p>}
            {k.sub && <p style={{ fontSize: "10px", color: tm, marginTop: "3px" }}>{k.sub}</p>}
          </Card>
        ))}
      </div>

      {/* Reference Ranges */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SH title="Sequencing Depth per Variant" accent="#3b82f6" />
          <CanvasBarChart
            data={S5_DATA.all_variants.slice(0, 20).map(v => ({ label: v.gene, count: v.depth, color: v.depth >= 500 ? "#10b981" : v.depth >= 100 ? "#f59e0b" : "#ef4444" }))}
            isDark={isDark} height={160} xKey="label" yKey="count" colorKey="color"
          />
          <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[{ l: "≥500× (Excellent)", c: "#10b981" }, { l: "100–500× (Adequate)", c: "#f59e0b" }, { l: "<100× (Low)", c: "#ef4444" }].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: r.c }} />
                <span style={{ fontSize: "10px", color: ts }}>{r.l}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: "20px" }}>
          <SH title="Mapping Quality (MQ) per Variant" accent="#10b981" />
          <CanvasBarChart
            data={S5_DATA.all_variants.slice(0, 20).map(v => ({ label: v.gene, count: v.mq, color: v.mq >= 50 ? "#10b981" : v.mq >= 30 ? "#f59e0b" : "#ef4444" }))}
            isDark={isDark} height={160} xKey="label" yKey="count" colorKey="color"
          />
          <div style={{
            marginTop: "8px", padding: "10px", borderRadius: "10px",
            background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", border: `1px solid ${divider}`
          }}>
            <p style={{ ...lbl, marginBottom: "6px" }}>MQ Reference Ranges</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
              {[{ l: "MQ = 60", d: "Perfectly unique mapping", c: "#10b981" }, { l: "MQ ≥ 30", d: "Acceptable", c: "#f59e0b" }, { l: "MQ < 30", d: "Poor; artefact risk", c: "#ef4444" }].map((r, i) => (
                <div key={i}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: r.c }}>{r.l}</p>
                  <p style={{ fontSize: "10px", color: tm }}>{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Flags */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="VCF Filter Flags Summary" accent="#f59e0b" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "12px", marginBottom: "16px" }}>
          {S5_DATA.filter_flags.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px", padding: "12px",
              borderRadius: "12px", background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              border: `1px solid ${f.color + "30"}`
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0,
                background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ fontSize: "18px", fontWeight: 900, color: f.color }}>{f.count}</span>
              </div>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 900, color: tp }}>{f.flag}</p>
                <p style={{ fontSize: "11px", color: ts, lineHeight: 1.4 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strand Bias + MSI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "16px" }}>
        <Card style={{ padding: "20px" }}>
          <SH title="Strand Bias (SBF) Analysis" accent="#f97316" />
          <p style={{ fontSize: "11px", color: ts, marginBottom: "12px", lineHeight: 1.5 }}>
            SBF (Strand Bias Fisher p-value): Low p-value = potential strand bias artefact.
            Variants with SBF &lt;0.05 AND Odds Ratio &gt;5 are at risk.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {S5_DATA.all_variants
              .filter(v => v.sbf > 0)
              .sort((a, b) => b.oddratio - a.oddratio)
              .slice(0, 8)
              .map((v, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "8px 10px", borderRadius: "8px",
                  background: (v.sbf < 0.05 && v.oddratio > 5) ? (isDark ? "rgba(239,68,68,0.07)" : "rgba(254,242,242,1)") : (isDark ? "rgba(255,255,255,0.02)" : "#f8fafc"),
                  border: `1px solid ${(v.sbf < 0.05 && v.oddratio > 5) ? "rgba(239,68,68,0.2)" : divider}`
                }}>
                  <span style={{ fontWeight: 900, color: isDark ? "#60a5fa" : "#2563eb", fontSize: "12px", width: "60px", flexShrink: 0 }}>{v.gene}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <span style={{ fontSize: "10px", color: tm }}>SBF: {v.sbf}</span>
                      <span style={{ fontSize: "10px", color: tm }}>OR: {v.oddratio.toFixed(2)}</span>
                    </div>
                    <ProgressBar value={Math.min(v.oddratio, 20)} max={20} color={v.oddratio > 5 ? "#ef4444" : "#10b981"} height={4} />
                  </div>
                  {v.sbf < 0.05 && v.oddratio > 5 && <span style={{ fontSize: "9px", color: "#ef4444", fontWeight: 700, flexShrink: 0 }}>⚠ BIAS</span>}
                </div>
              ))}
          </div>
        </Card>

        <Card style={{ padding: "20px" }}>
          <SH title="MSI Score per Variant" accent="#8b5cf6" />
          <p style={{ fontSize: "11px", color: ts, marginBottom: "12px", lineHeight: 1.5 }}>
            MSI &gt;1 = variant in microsatellite region (higher FP risk). MSI &gt;12 triggers MSI12 filter.
          </p>
          {S5_DATA.all_variants
            .filter(v => v.msi > 0)
            .sort((a, b) => b.msi - a.msi)
            .slice(0, 10)
            .map((v, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "11px", color: ts, fontWeight: 700 }}>{v.gene} <span style={{ color: tm, fontWeight: 400, fontSize: "10px" }}>chr{v.chr}:{v.pos.toLocaleString()}</span></span>
                  <span style={{ fontSize: "11px", fontWeight: 900, color: v.msi >= 12 ? "#ef4444" : v.msi >= 6 ? "#f59e0b" : "#10b981" }}>{v.msi}</span>
                </div>
                <ProgressBar value={v.msi} max={20} color={v.msi >= 12 ? "#ef4444" : v.msi >= 6 ? "#f59e0b" : "#10b981"} height={5} />
              </div>
            ))}
          <div style={{
            marginTop: "12px", padding: "10px", borderRadius: "8px",
            background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc", border: `1px solid ${divider}`
          }}>
            {[{ l: "MSI 0–5", d: "Normal", c: "#10b981" }, { l: "MSI 6–11", d: "Elevated — interpret with caution", c: "#f59e0b" }, { l: "MSI ≥12", d: "High — MSI12 filter applied", c: "#ef4444" }].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: r.c, width: "55px", flexShrink: 0 }}>{r.l}</span>
                <span style={{ fontSize: "10px", color: ts }}>{r.d}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* NM + S/N reference */}
      <Card style={{ padding: "20px" }}>
        <SH title="Signal-to-Noise & Mismatch Reference Ranges" accent="#3b82f6" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "16px" }}>
          <div>
            <p style={{ ...lbl, marginBottom: "10px", color: "#3b82f6" }}>Signal-to-Noise (SN)</p>
            {[{ l: "SN < 1.5", d: "Below threshold — SN1.5 filter", c: "#ef4444" }, { l: "SN 1.5–10", d: "Acceptable", c: "#f59e0b" }, { l: "SN ≥ 10", d: "Good signal quality", c: "#10b981" }].map((r, i) => (
              <StatRow key={i} label={r.l} value={r.d} color={r.c} />
            ))}
            <p style={{ fontSize: "10px", color: tm, marginTop: "8px" }}>S5 range: 5 – 642 (excellent overall)</p>
          </div>
          <div>
            <p style={{ ...lbl, marginBottom: "10px", color: "#f59e0b" }}>Mean Mismatches (NM)</p>
            {[{ l: "NM < 2", d: "Good — low mismatch rate", c: "#10b981" }, { l: "NM 2–5", d: "Caution — review carefully", c: "#f59e0b" }, { l: "NM ≥ 5.25", d: "NM5.25 filter triggered", c: "#ef4444" }].map((r, i) => (
              <StatRow key={i} label={r.l} value={r.d} color={r.c} />
            ))}
            <p style={{ fontSize: "10px", color: tm, marginTop: "8px" }}>5 variants flagged with NM5.25 in S5</p>
          </div>
          <div>
            <p style={{ ...lbl, marginBottom: "10px", color: "#10b981" }}>HiQ Allele Frequency (HIAF)</p>
            <p style={{ fontSize: "11px", color: ts, lineHeight: 1.6 }}>
              HIAF = VAF computed using only high-quality bases.
              If HIAF differs significantly from VAF, it may indicate base quality issues.
              <br /><br />
              S5 notable: ETV6 HIAF=1.00 (all reads are high-quality); NF1 insertion HIAF=1.00.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // PAGE: PATIENT SUMMARY
  // ─────────────────────────────────────────────────────────────
  const PagePatient = () => (
    <div>
      {/* Intro Card */}
      <div style={{
        padding: "24px", borderRadius: "16px", marginBottom: "16px",
        background: isDark ? "rgba(59,130,246,0.06)" : "rgba(239,246,255,1)",
        border: `1px solid ${isDark ? "rgba(59,130,246,0.15)" : "rgba(191,219,254,0.5)"}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Icon d={ICONS.user} size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 900, color: tp }}>What This Report Means for You</p>
            <p style={{ fontSize: "11px", color: ts }}>Plain-language summary for patients and families</p>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: ts, lineHeight: 1.7 }}>
          This report is from a test called <strong style={{ color: tp }}>targeted panel sequencing</strong>, which reads specific sections of your DNA to look for changes (called variants or mutations) that might be related to your condition.
          Your doctor will review these results with you and explain how they affect your care.
        </p>
      </div>

      {/* Patient KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "16px" }}>
        {[
          { icon: "dna", label: "Genes Tested", value: "33", desc: "Different gene regions analysed", color: "#3b82f6" },
          { icon: "alert", label: "Important Findings", value: "8", desc: "Genes with changes relevant to treatment", color: "#f59e0b" },
          { icon: "pill", label: "Potentially Targetable", value: "6", desc: "Gene changes with associated medicines or trials", color: "#10b981" },
        ].map((k, i) => (
          <Card key={i} style={{ padding: "20px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", marginBottom: "12px",
              background: k.color + "18", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon d={ICONS[k.icon] || ICONS.dna} size={18} style={{ color: k.color }} />
            </div>
            <p style={{ fontSize: "28px", fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: "12px", fontWeight: 700, color: tp, marginTop: "8px" }}>{k.label}</p>
            <p style={{ fontSize: "11px", color: ts, marginTop: "4px", lineHeight: 1.4 }}>{k.desc}</p>
          </Card>
        ))}
      </div>

      {/* Patient Gene Cards */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="Key Gene Findings Explained" accent="#3b82f6" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
          {S5_DATA.patient_info.gene_cards.map((g, i) => (
            <div key={i} style={{
              padding: "16px", borderRadius: "14px",
              background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              border: `1px solid ${g.color + "30"}`, borderLeft: `4px solid ${g.color}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 900, color: tp }}>{g.gene}</span>
                <span style={{ fontSize: "10px", color: ts }}>— {g.plain}</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <p style={{ ...lbl, color: g.color, marginBottom: "3px" }}>What We Found</p>
                <p style={{ fontSize: "12px", color: tp, lineHeight: 1.5 }}>{g.finding}</p>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <p style={{ ...lbl, color: "#10b981", marginBottom: "3px" }}>Why It Matters</p>
                <p style={{ fontSize: "12px", color: ts, lineHeight: 1.5 }}>{g.why}</p>
              </div>
              <div style={{
                padding: "8px 10px", borderRadius: "8px",
                background: isDark ? "rgba(59,130,246,0.08)" : "rgba(239,246,255,1)",
                border: `1px solid ${isDark ? "rgba(59,130,246,0.15)" : "rgba(191,219,254,0.5)"}`
              }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: isDark ? "#93c5fd" : "#2563eb" }}>
                  → {g.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="What Happens Next" accent="#10b981" />
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {S5_DATA.patient_info.steps.map((step, i) => (
            <div key={i} style={{
              display: "flex", gap: "16px", position: "relative",
              paddingBottom: i < S5_DATA.patient_info.steps.length - 1 ? "20px" : "0"
            }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <span style={{ fontSize: "12px", fontWeight: 900, color: "#fff" }}>{i + 1}</span>
                </div>
                {i < S5_DATA.patient_info.steps.length - 1 && (
                  <div style={{ width: "2px", flex: 1, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", marginTop: "4px" }} />
                )}
              </div>
              <div style={{ paddingTop: "6px" }}>
                <p style={{ fontSize: "13px", color: tp, lineHeight: 1.6, fontWeight: 500 }}>{step}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <div style={{
        padding: "20px", borderRadius: "16px",
        background: isDark ? "rgba(245,158,11,0.05)" : "rgba(255,251,235,1)",
        border: `1px solid ${isDark ? "rgba(245,158,11,0.15)" : "rgba(253,230,138,0.7)"}`,
        display: "flex", alignItems: "flex-start", gap: "14px"
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
          background: isDark ? "rgba(245,158,11,0.1)" : "rgba(254,243,199,1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isDark ? "#fbbf24" : "#d97706"
        }}>
          <Icon d={ICONS.alert} size={16} />
        </div>
        <div>
          <p style={{ ...lbl, color: isDark ? "#f59e0b" : "#b45309", marginBottom: "6px" }}>Important Notice</p>
          <p style={{ fontSize: "12px", fontWeight: 600, lineHeight: 1.7, color: isDark ? "#fde68a" : "#78350f" }}>
            This report is intended to be discussed with your treating physician or genetic counsellor.
            Genetic findings require interpretation in the context of your personal and family medical history,
            clinical presentation, and other diagnostic results. Do not make treatment decisions based on this report alone.
          </p>
        </div>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // PAGE: TECHNICAL REPORT
  // ─────────────────────────────────────────────────────────────
  const PageTechnical = () => (
    <div>


      {/* Filter Definitions */}
      <Card style={{ padding: "20px", marginBottom: "16px" }}>
        <SH title="VCF Filter Flag Definitions" accent="#f59e0b" />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "400px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${divider}` }}>
                <th style={{ paddingBottom: "10px", paddingRight: "16px", textAlign: "left", ...lbl, width: "100px" }}>Filter</th>
                <th style={{ paddingBottom: "10px", textAlign: "left", ...lbl }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { f: "PASS", d: "All filters passed", c: "#10b981" },
                { f: "q22.5", d: "Mean Base Quality Below 22.5", c: "#f59e0b" },
                { f: "Q10", d: "Mean Mapping Quality Below 10", c: "#f59e0b" },
                { f: "p8", d: "Mean Position in Reads < 8", c: "#f59e0b" },
                { f: "SN1.5", d: "Signal to Noise < 1.5", c: "#f59e0b" },
                { f: "Bias", d: "Strand Bias detected", c: "#f59e0b" },
                { f: "pSTD", d: "Position in Reads has STD of 0", c: "#f59e0b" },
                { f: "d3", d: "Total Depth < 3", c: "#ef4444" },
                { f: "v2", d: "Variant Depth < 2", c: "#ef4444" },
                { f: "f0.01", d: "Allele Frequency < 1%", c: "#ef4444" },
                { f: "MSI12", d: "Variant in MSI region ≥12 non-monomer or ≥13 monomer", c: "#f59e0b" },
                { f: "NM5.25", d: "Mean mismatches ≥5.25 (likely false positive)", c: "#ef4444" },
                { f: "InGap", d: "Variant in deletion gap", c: "#f59e0b" },
                { f: "InIns", d: "Variant adjacent to insertion", c: "#f59e0b" },
                { f: "Cluster0bp", d: "Two variants within 0 bp", c: "#f59e0b" },
                { f: "LongMSI", d: "Somatic variant flanked by long A/T (≥14 bp)", c: "#f59e0b" },
                { f: "AMPBIAS", d: "Variant has amplicon bias", c: "#f59e0b" },
              ].map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${divider}` }}
                  onMouseEnter={e => e.currentTarget.style.background = rowHover}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "9px 16px 9px 0" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: "6px", background: r.c + "18",
                      border: `1px solid ${r.c + "40"}`, color: r.c, fontSize: "11px", fontWeight: 700
                    }}>{r.f}</span>
                  </td>
                  <td style={{ padding: "9px 0", fontSize: "12px", color: ts }}>{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Field Glossary */}
      <Card style={{ padding: "20px" }}>
        <SH title="Key Field Glossary" accent="#818cf8" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "12px" }}>
          {[
            { f: "VAF", fn: "Variant Allele Frequency", def: "Fraction of reads supporting the alt allele. VD/DP. Ideal somatic het: ~50%." },
            { f: "DP (Depth)", fn: "Total Read Depth", def: "Total reads at variant position. Adequate ≥100×, Good ≥500×, Excellent ≥1000×." },
            { f: "MQ", fn: "Mean Mapping Quality", def: "Average MQ of supporting reads. MQ=60: perfectly unique. Acceptable: ≥30." },
            { f: "SN", fn: "Signal-to-Noise Ratio", def: "Ratio of variant-supporting reads to background. Good: ≥10, Acceptable: ≥1.5." },
            { f: "HIAF", fn: "High-Quality Allele Frequency", def: "VAF using only high-quality bases. Should be close to VAF; divergence = quality issue." },
            { f: "MSI", fn: "Microsatellite Instability Score", def: "Score >1: variant in microsatellite region. ≥12: MSI12 filter. Higher = more FP risk." },
            { f: "NM", fn: "Mean Mismatches per Read", def: "Average mismatches in supporting reads. ≥5.25 triggers NM5.25 filter." },
            { f: "SBF", fn: "Strand Bias Fisher p-value", def: "Low p-value = potential strand-specific bias artefact. Combined with Odds Ratio." },
            { f: "ODDRATIO", fn: "Strand Bias Odds Ratio", def: "Odds ratio of forward vs reverse strand bias. >5 with SBF<0.05 = artefact risk." },
            { f: "HICNT", fn: "High-Quality Variant Reads", def: "Number of high-quality reads supporting the variant." },
            { f: "HICOV", fn: "High-Quality Coverage", def: "Total high-quality reads at the variant position." },
            { f: "confidence", fn: "Confidence Classification", def: "'high' = passes all QC; 'ctdna_candidate' = ctDNA-consistent characteristics." },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "12px", borderRadius: "10px",
              background: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
              border: `1px solid ${divider}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{
                  padding: "2px 7px", borderRadius: "5px", background: isDark ? "rgba(129,140,248,0.15)" : "rgba(238,242,255,1)",
                  border: `1px solid ${isDark ? "rgba(129,140,248,0.3)" : "rgba(165,180,252,0.5)"}`,
                  color: isDark ? "#a5b4fc" : "#4f46e5", fontSize: "11px", fontWeight: 700
                }}>{item.f}</span>
                <span style={{ fontSize: "11px", color: ts }}>{item.fn}</span>
              </div>
              <p style={{ fontSize: "11px", color: ts, lineHeight: 1.5 }}>{item.def}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ─── Page renderer ────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "overview": return <PageOverview />;
      case "variants": return <PageVariants />;
      case "vaf": return <PageVAF />;
      case "resistance": return <PageResistance />;
      case "quality": return <PageQuality />;
      case "patient": return <PagePatient />;
      case "technical": return <PageTechnical />;
      default: return <PageOverview />;
    }
  };

  const PAGE_TITLE = NAV_PAGES.find(p => p.id === activePage)?.label || "Dashboard";

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: pageBg,
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif",
      transition: "background 0.5s", display: "flex",
    }}>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }} />
      )}

      {/* Sidebar */}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        width: "220px", background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        display: "flex", flexDirection: "column",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.15)" : "none",
      }} className="sidebar">
        {/* Sidebar header */}
        <div style={{ padding: "16px", borderBottom: `1px solid ${sidebarBorder}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
              background: "linear-gradient(135deg,#3b82f6,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon d={ICONS.logo} size={16} style={{ color: "#fff" }} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: tp, lineHeight: 1 }}>OncoTrace</p>
              <p style={{ fontSize: "10px", color: tm, marginTop: "2px" }}>Sample S5</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV_PAGES.map(page => {
            const active = activePage === page.id;
            return (
              <button key={page.id}
                onClick={() => { setActivePage(page.id); setSidebarOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "10px",
                  padding: "9px 12px", borderRadius: "10px", marginBottom: "2px",
                  border: "none", cursor: "pointer", textAlign: "left",
                  background: active
                    ? (isDark ? "rgba(59,130,246,0.15)" : "rgba(239,246,255,1)")
                    : "transparent",
                  color: active ? (isDark ? "#93c5fd" : "#2563eb") : ts,
                  transition: "all 0.2s",
                }}>
                <Icon d={ICONS[page.icon] || ICONS.dna} size={14} style={{ color: active ? (isDark ? "#93c5fd" : "#2563eb") : ts, flexShrink: 0 }} />
                <span style={{ fontSize: "12px", fontWeight: active ? 700 : 500 }}>{page.label}</span>
                {active && <div style={{ marginLeft: "auto", width: "4px", height: "4px", borderRadius: "50%", background: isDark ? "#93c5fd" : "#2563eb" }} />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div style={{ padding: "12px", borderTop: `1px solid ${sidebarBorder}`, flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", borderRadius: "8px",
            background: isDark ? "rgba(16,185,129,0.08)" : "rgba(240,253,244,1)",
            border: `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(167,243,208,0.5)"}`
          }}>
            <PulseDot color="#10b981" />
            <span style={{ fontSize: "10px", fontWeight: 600, color: isDark ? "#34d399" : "#059669" }}>Analysis Complete</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }} className="main-area">
        {/* Top Nav */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          background: navBg, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${navBorder}`, flexShrink: 0,
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 16px" }}>
            <div style={{ height: "56px", display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Menu toggle */}
              <button onClick={() => setSidebarOpen(o => !o)}
                style={{
                  width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                  border: `1px solid ${cardBorder}`, background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  color: ts
                }}>
                <Icon d={sidebarOpen ? ICONS.close : ICONS.menu} size={16} style={{ color: ts }} />
              </button>

              {/* Breadcrumb */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: tp, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {PAGE_TITLE}
                </p>
                <p style={{ fontSize: "10px", color: tm, marginTop: "1px" }}>
                  S5 · Targeted Panel · VarDict v1.8.2
                </p>
              </div>

              {/* Right actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "5px 10px", borderRadius: "10px",
                  background: isDark ? "rgba(239,68,68,0.1)" : "rgba(254,242,242,1)",
                  border: `1px solid ${isDark ? "rgba(239,68,68,0.2)" : "rgba(252,165,165,0.5)"}`
                }}>
                  <PulseDot color="#ef4444" />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: isDark ? "#f87171" : "#dc2626" }} className="hide-xs">HIGH RISK · 74/100</span>
                </div>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <button onClick={onReset}
                  style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    padding: "7px 12px", borderRadius: "10px", border: `1px solid ${cardBorder}`,
                    background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                    color: ts, fontSize: "12px", fontWeight: 600, cursor: "pointer"
                  }}>
                  <Icon d={ICONS.back} size={13} style={{ color: ts }} />
                  <span className="hide-xs">New</span>
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "7px 12px", borderRadius: "10px",
                  background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                  border: "none", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
                }}>
                  <Icon d={ICONS.download} size={13} style={{ color: "#fff" }} />
                  <span className="hide-xs">Export</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 16px 80px" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            {renderPage()}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        @media (min-width: 900px) {
          .sidebar { transform: translateX(0) !important; box-shadow: none !important; }
          .main-area { margin-left: 220px; }
        }
        @media (min-width: 1024px) {
          .ov-row2 { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .hide-xs { display: none !important; }
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.4); }
        input::placeholder { color: rgba(128,128,128,0.5); }
        select option { background: ${isDark ? "#161b22" : "#ffffff"}; color: ${isDark ? "#f0f6fc" : "#1d1d1f"}; }
        button:hover { opacity: 0.85; }
        table { table-layout: auto; }
      `}</style>
    </div>
  );
}