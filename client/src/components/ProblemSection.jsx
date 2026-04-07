import { useState } from "react";

const PROBLEMS = [
  {
    id: "01",
    keyword: "DETECTION",
    title: "Cancer Is Still Found Too Late",
    body: "Many cancers are detected only after symptoms appear, when treatment is harder and survival is lower.",
    stat: "99%→32%",
    statLabel: "breast cancer 5-year survival, localized vs distant",
  },
  {
    id: "02",
    keyword: "SNAPSHOTS",
    title: "Monitoring Is Not Real-Time",
    body: "Cancer is usually checked through scans every few weeks, not continuously. Important changes can happen in between.",
    stat: "6–12wk",
    statLabel: "common interval between imaging assessments",
  },
  {
    id: "03",
    keyword: "INVASIVE",
    title: "Biopsy Is Hard to Repeat Often",
    body: "Tissue biopsy is invasive, burdensome, and not practical for frequent tracking over time.",
    stat: "15–25%",
    statLabel: "pneumothorax risk in some lung biopsies",
  },
  {
    id: "04",
    keyword: "RECURRENCE",
    title: "Hidden Disease Can Be Missed",
    body: "After treatment, tiny amounts of cancer can remain unseen. Relapse is often found only later on imaging.",
    stat: "Months",
    statLabel: "earlier relapse signals seen with ctDNA in some studies",
  },
  {
    id: "05",
    keyword: "FRAGMENTED",
    title: "Cancer Data Lives in Silos",
    body: "Imaging, pathology, genomics, and follow-up data often sit in separate systems, limiting a full patient view.",
    stat: "10M",
    statLabel: "global cancer deaths in 2020",
  },
];

function MobileRow({ p, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(203,213,225,0.5)",
        boxShadow: "0 4px 24px rgba(148,163,184,0.1)",
      }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-bold tracking-widest"
            style={{ color: "rgba(148,163,184,0.8)" }}
          >
            {p.id}
          </span>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#3b82f6" }}
          >
            {p.keyword}
          </span>
        </div>
        <svg
          className="flex-shrink-0 transition-transform duration-300"
          style={{
            width: 18,
            height: 18,
            color: "#94a3b8",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? 400 : 0 }}
      >
        <div
          className="px-5 pt-3 pb-6"
          style={{ borderTop: "1px solid rgba(203,213,225,0.4)" }}
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="text-3xl font-extrabold tracking-tight leading-none"
              style={{ color: "#1e40af" }}
            >
              {p.stat}
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-wider leading-tight"
              style={{ color: "#94a3b8" }}
            >
              {p.statLabel}
            </span>
          </div>
          <h3
            className="text-sm font-bold leading-snug mb-2"
            style={{ color: "#1e293b" }}
          >
            {p.title}
          </h3>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "#64748b" }}
          >
            {p.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .ps-root {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 50%, #e8f0fe 100%);
          min-height: 100vh;
          width: 100%;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(203, 213, 225, 0.5);
          box-shadow:
            0 4px 6px rgba(148, 163, 184, 0.06),
            0 12px 40px rgba(148, 163, 184, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .glass-card:hover {
          box-shadow:
            0 8px 16px rgba(59, 130, 246, 0.08),
            0 24px 64px rgba(148, 163, 184, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        .glass-cta {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow:
            0 24px 64px rgba(15, 23, 42, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .accent-bar {
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(59,130,246,0.5), rgba(147,197,253,0.2));
          border-radius: 2px;
        }

        @keyframes scan {
          0% { left: -60%; }
          100% { left: 150%; }
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: -60%;
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(147,197,253,0.4), transparent);
          animation: scan 5s linear infinite;
          pointer-events: none;
        }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.15); }
          50% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
        }

        .badge-ring {
          animation: pulse-ring 3.5s ease-in-out infinite;
        }

        .stat-num {
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 768px) {
          .desktop-grid { display: none; }
        }
        @media (min-width: 769px) {
          .mobile-list { display: none; }
        }
      `}</style>

      <section className="ps-root">
        {/* ── Header ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 pt-16 sm:pt-20 lg:pt-28 pb-10 sm:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-end">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    height: 2,
                    borderRadius: 2,
                    background: "#3b82f6",
                  }}
                />
                <span
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: "#3b82f6" }}
                >
                  The Problem
                </span>
              </div>

              <h2
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.06] tracking-tight"
                style={{ color: "#0f172a" }}
              >
                The Challenge
                <br />
                in Modern
                <br />
                Cancer{" "}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ color: "#2563eb" }}>Monitoring</span>
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: -2,
                      width: "100%",
                      height: 2,
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg,#3b82f6,rgba(59,130,246,0.2))",
                    }}
                  />
                </span>
              </h2>
            </div>

            {/* Right */}
            <div className="pb-2">
              <p
                className="text-sm sm:text-[0.9375rem] leading-[1.85] mb-5"
                style={{ color: "#64748b", fontWeight: 400 }}
              >
                Cancer care is still reactive, fragmented, and delayed. Risk
                prediction, diagnosis, and monitoring often work in separate
                systems, leaving critical gaps across the patient journey.
              </p>
              <div className="flex items-center gap-2.5">
                <span
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    opacity: 0.6,
                  }}
                />
                <span
                  className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                  style={{ color: "#94a3b8" }}
                >
                  5 critical gaps identified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop Grid ── */}
        <div className="desktop-grid max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 pb-6">
          <div className="grid grid-cols-5 gap-3 xl:gap-4">
            {PROBLEMS.map((p) => (
              <div
                key={p.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Top badge */}
                <div className="px-4 pt-4 pb-0 flex items-center gap-2">
                  <span
                    className="text-[9px] font-bold tracking-widest"
                    style={{ color: "rgba(148,163,184,0.7)" }}
                  >
                    {p.id}
                  </span>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{ color: "#3b82f6" }}
                  >
                    {p.keyword}
                  </span>
                </div>

                {/* Body */}
                <div className="px-4 pt-3 pb-5 flex flex-col flex-1">
                  {/* Stat */}
                  <div className="mb-3">
                    <div
                      className="stat-num text-2xl xl:text-3xl font-extrabold tracking-tight leading-none tabular-nums mb-1"
                    >
                      {p.stat}
                    </div>
                    <div
                      className="text-[9px] xl:text-[10px] font-medium uppercase tracking-wider leading-tight"
                      style={{ color: "#94a3b8" }}
                    >
                      {p.statLabel}
                    </div>
                  </div>

                  <div
                    style={{
                      width: 28,
                      height: 1,
                      borderRadius: 1,
                      background: "rgba(59,130,246,0.25)",
                      marginBottom: 12,
                    }}
                  />

                  <h3
                    className="text-[12px] xl:text-[13px] font-bold leading-snug mb-2"
                    style={{ color: "#1e293b" }}
                  >
                    {p.title}
                  </h3>

                  <p
                    className="text-[10px] xl:text-[11px] leading-relaxed flex-1"
                    style={{ color: "#64748b", fontWeight: 400 }}
                  >
                    {p.body}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="accent-bar" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile List ── */}
        <div className="mobile-list max-w-6xl mx-auto px-4 sm:px-6 pb-6">
          {PROBLEMS.map((p) => (
            <MobileRow key={p.id} p={p} />
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-28">
          <div
            className="glass-cta rounded-2xl px-7 sm:px-12 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-6 sm:gap-12 relative overflow-hidden"
          >
            <div className="scan-line" />

            {/* Text */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <p
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: "#93c5fd" }}
              >
                The Path Forward
              </p>
              <p
                className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug tracking-tight"
                style={{ color: "#f8fafc" }}
              >
                The future of oncology needs{" "}
                <span style={{ color: "#93c5fd" }}>
                  early AI risk prediction
                </span>{" "}
                and{" "}
                <span style={{ color: "#93c5fd" }}>
                  real-time, non-invasive monitoring
                </span>{" "}
                in one open, connected system.
              </p>
            </div>

            {/* Badge */}
            <div
              className="badge-ring"
              style={{
                position: "relative",
                zIndex: 1,
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "1px solid rgba(59,130,246,0.3)",
                background: "rgba(59,130,246,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                flexShrink: 0,
                margin: "0 auto",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#f8fafc",
                  textTransform: "uppercase",
                }}
              >
                OncoTrace
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#93c5fd",
                  textTransform: "uppercase",
                }}
              >
                AI
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}