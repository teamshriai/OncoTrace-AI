import { buildMockAnalysis } from "./mockData";

// Defaults to the REAL backend. Mock mode must be opted into explicitly with
// VITE_LB_USE_MOCK_API=true, because the mock ignores the uploaded file's
// contents entirely and returns one fixed sample -- if that were the default,
// every upload would silently render identical results.
const USE_MOCK = String(import.meta.env.VITE_LB_USE_MOCK_API ?? "false") === "true";
const API_BASE = import.meta.env.VITE_LB_API_BASE_URL || "";

if (USE_MOCK && typeof console !== "undefined") {
  console.warn(
    "[liquidbiopsy] DEMO MODE: the uploaded file is NOT analyzed. Every upload returns the same "
    + "fixed sample dataset. Set VITE_LB_USE_MOCK_API=false to use the real analysis backend."
  );
}

export class AnalysisError extends Error {
  constructor(kind, message, detail) {
    super(message);
    this.name = "AnalysisError";
    this.kind = kind; // "malformed_vcf" | "network" | "annotation_failure" | "timeout"
    this.detail = detail;
  }
}

const MOCK_ERROR_MESSAGES = {
  malformed_vcf: "This file couldn't be parsed as a VCF — check that it includes a valid ##fileformat header line.",
  network: "Can't reach the analysis service — it may be temporarily unavailable. Please try again in a moment.",
  annotation_failure: "The file parsed correctly, but the annotation step failed on our side. This isn't something wrong with your file.",
  timeout: "The analysis took too long and timed out. Try again, or try a smaller file.",
};

function validateVcfFile(file) {
  const name = file.name.toLowerCase();
  if (!name.endsWith(".vcf") && !name.endsWith(".vcf.gz")) {
    throw new AnalysisError("malformed_vcf", "This doesn't look like a .vcf or .vcf.gz file.");
  }
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

// `forceErrorKind` is a dev-only escape hatch (not exposed in the UI) for
// exercising the four error states without a real backend to trigger them.
async function mockAnalyze(file, { signal, forceErrorKind } = {}) {
  validateVcfFile(file);
  await delay(1400 + Math.random() * 900, signal);
  if (forceErrorKind) {
    throw new AnalysisError(forceErrorKind, MOCK_ERROR_MESSAGES[forceErrorKind] || "Something went wrong.");
  }
  return buildMockAnalysis();
}

async function realAnalyze(file, { signal, referenceBuildHint } = {}) {
  const formData = new FormData();
  formData.append("vcf_file", file);
  if (referenceBuildHint) formData.append("reference_build_hint", referenceBuildHint);

  let response;
  try {
    response = await fetch(`${API_BASE}/api/v1/vcf/analyze`, { method: "POST", body: formData, signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new AnalysisError("network", MOCK_ERROR_MESSAGES.network);
  }

  if (!response.ok) {
    let body = null;
    try { body = await response.json(); } catch { /* non-JSON error body */ }
    const kind = body?.error_kind
      || (response.status === 413 ? "malformed_vcf" : response.status >= 500 ? "annotation_failure" : "malformed_vcf");
    throw new AnalysisError(kind, body?.message || `Analysis failed (HTTP ${response.status}).`, body?.detail);
  }

  return response.json();
}

export function analyzeVcf(file, options = {}) {
  return USE_MOCK ? mockAnalyze(file, options) : realAnalyze(file, options);
}

export const isMockMode = USE_MOCK;
