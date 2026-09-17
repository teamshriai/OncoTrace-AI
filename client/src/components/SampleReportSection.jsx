import { useMemo } from "react";
import DoctorSummaryPage from "./liquidbiopsy/pages/DoctorSummaryPage";
import { buildMockAnalysis } from "./liquidbiopsy/mockData";
import "./liquidbiopsy/tokens.css";

// A static, always-light-theme rendering of the Doctor Summary report --
// the same page shown inside the full dashboard after a real VCF is
// analyzed (Dashboard.jsx -> DoctorSummaryPage), but embedded directly into
// the marketing home page as a single continuous scroll, with no sidebar or
// tab navigation, so a visitor can see exactly what a report looks like
// without uploading a file.
export default function SampleReportSection() {
  const data = useMemo(() => buildMockAnalysis(), []);

  return (
    <section
      id="sample-report"
      className="relative w-full"
      aria-label="Sample Report"
      style={{ background: "#f8fafc" }}
    >
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-14 sm:py-18 lg:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 sm:text-sm">
            See It In Action
          </p>
          <h2
            className="font-bold leading-tight tracking-tight text-slate-900"
            style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            A Sample{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Variant Report
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
            This is the exact structured report our pipeline generates once a VCF finishes processing.
          </p>
        </div>

        <div data-lb-theme="light">
          <DoctorSummaryPage data={data} theme="light" />
        </div>
      </div>
    </section>
  );
}
