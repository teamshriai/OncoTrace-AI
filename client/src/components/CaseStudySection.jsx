import { useState, useEffect, useRef } from "react";

/* ── useInView ─────────────────────────────────────────────────────────── */
function useInView(opts = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect(); }
    }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/* ── Design Tokens ─────────────────────────────────────────────────────── */
const T = {
  blue:       "#2563eb",
  blueDark:   "#1d4ed8",
  blueDeep:   "#1e3a5f",
  blueLight:  "rgba(37,99,235,0.07)",
  blueMid:    "rgba(37,99,235,0.13)",
  blueBorder: "rgba(37,99,235,0.18)",
  textDark:   "#0f172a",
  textMid:    "#475569",
  textLight:  "#94a3b8",
  border:     "rgba(148,163,184,0.2)",
  glass:      "rgba(255,255,255,0.72)",
  glassDark:  "rgba(255,255,255,0.5)",
  bg:         "linear-gradient(155deg,#f8fafc 0%,#f1f5f9 50%,#eef3fb 100%)",
};

/* ── Icons ─────────────────────────────────────────────────────────────── */
const IconDrop = () => (
  <svg viewBox="0 0 44 44" fill="none" width="24" height="24">
    <circle cx="22" cy="22" r="20" fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.25)" strokeWidth="1.2" />
    <path d="M22 9C22 9 14 18.5 14 25.5A8 8 0 0 0 30 25.5C30 18.5 22 9 22 9Z"
      fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="19.5" cy="25" r="1.8" fill="#2563eb" opacity="0.4" />
    <circle cx="25" cy="27.5" r="1.2" fill="#2563eb" opacity="0.25" />
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 44 44" fill="none" width="24" height="24">
    <circle cx="22" cy="22" r="20" fill="rgba(37,99,235,0.08)" stroke="rgba(37,99,235,0.25)" strokeWidth="1.2" />
    <circle cx="22" cy="22" r="7" fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="1.4" />
    <circle cx="22" cy="22" r="12.5" stroke="#2563eb" strokeWidth="0.7" strokeDasharray="2.5 3.5" opacity="0.35" />
    <circle cx="22" cy="22" r="2.6" fill="#2563eb" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return (
        <circle
          key={i}
          cx={22 + 17 * Math.sin(r)}
          cy={22 - 17 * Math.cos(r)}
          r="1.3"
          fill="#2563eb"
          opacity={0.15 + i * 0.07}
        />
      );
    })}
  </svg>
);

/* ── Data ──────────────────────────────────────────────────────────────── */
const studies = [
  {
    id:       "liquid-biopsy",
    index:    "01",
    tag:      "Liquid Biopsy",
    icon:     <IconDrop />,
    title:    "Early Cancer Detection & Monitoring Using Liquid Biopsy",
    overview: "A non-invasive method that detects cancer signals from a single blood draw — enabling continuous molecular monitoring that replaces painful and infrequent tissue biopsies.",
    metric:   { before: "Late-stage, invasive detection", after: "Real-time blood monitoring" },
    sections: [
      {
        heading: "The Problem",
        body: "Traditional tissue biopsies are invasive, painful, and provide only a momentary snapshot. Delayed detection and the inability to monitor cancer continuously mean treatment decisions often come too late.",
      },
      {
        heading: "Our Solution",
        body: "AI-powered liquid biopsy detects circulating tumour DNA (ctDNA) directly from blood. Our models identify cancer-specific mutation patterns, track tumour evolution, and surface clinical insights far earlier than conventional imaging.",
      },
      {
        heading: "How It Works",
        steps: [
          "Blood sample collected — simple, painless, and repeatable",
          "ctDNA extracted and sequenced with ultra-sensitive assays",
          "AI models detect cancer-specific mutation signatures",
          "Longitudinal tracking identifies disease progression in real time",
        ],
      },
      {
        heading: "Impact",
        pills: [
          "Earlier detection of progression",
          "Fewer invasive procedures",
          "Faster treatment decisions",
          "Real-time cancer monitoring",
          "Personalised therapy",
          "Improved patient comfort",
        ],
      },
    ],
  },
  {
    id:       "mrd",
    index:    "02",
    tag:      "MRD Detection",
    icon:     <IconTarget />,
    title:    "Detecting Hidden Cancer with Minimal Residual Disease (MRD) Monitoring",
    overview: "After treatment ends, microscopic cancer cells can linger undetected for years. MRD monitoring catches what imaging misses — enabling early intervention before recurrence takes hold.",
    metric:   { before: "Relapse at symptom onset", after: "Sub-clinical early warning" },
    sections: [
      {
        heading: "The Problem",
        body: "Patients declared 'cancer-free' by imaging may still harbour residual cancer cells. Without a reliable early warning system, relapse is discovered only once symptoms return — often too late for effective intervention.",
      },
      {
        heading: "Our Solution",
        body: "Ultra-sensitive AI-driven MRD detection identifies microscopic traces of residual tumour DNA post-treatment. Our platform continuously tracks recurrence risk and alerts clinicians before cancer regains a foothold.",
      },
      {
        heading: "How It Works",
        steps: [
          "Post-treatment blood samples collected at scheduled intervals",
          "Ultra-sensitive sequencing detects tumour DNA at parts-per-million",
          "AI models quantify MRD burden from mutation pattern analysis",
          "Continuous risk scoring triggers early clinical intervention",
        ],
      },
      {
        heading: "Impact",
        pills: [
          "Sub-clinical cancer detection",
          "Early relapse identification",
          "Better treatment planning",
          "Prevents late-stage recurrence",
          "Personalised follow-up care",
          "Improved long-term survival",
        ],
      },
    ],
  },
];

/* ── Modal ─────────────────────────────────────────────────────────────── */
function StudyModal({ study, onClose }) {
  const [vis, setVis] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVis(true));
    const fn = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, []);

  function close() { setVis(false); setTimeout(onClose, 280); }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.25rem",
        background: `rgba(8,15,28,${vis ? 0.45 : 0})`,
        backdropFilter: "blur(12px) saturate(1.3)",
        WebkitBackdropFilter: "blur(12px) saturate(1.3)",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(148,163,184,0.25)",
          boxShadow: vis
            ? "0 32px 80px rgba(8,15,28,0.15), 0 4px 20px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,0.95)"
            : "none",
          transform: vis ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          opacity: vis ? 1 : 0,
          transition: "transform 0.38s cubic-bezier(0.34,1.35,0.64,1), opacity 0.28s ease, box-shadow 0.3s ease",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(148,163,184,0.4) transparent",
        }}
      >
        {/* Top accent */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #1d4ed8, #60a5fa)",
          borderRadius: "20px 20px 0 0",
        }} />

        {/* Hero */}
        <div style={{
          padding: "1.75rem 2rem 1.5rem",
          background: "linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(255,255,255,0) 60%)",
          borderBottom: "1px solid rgba(148,163,184,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
              <div style={{
                padding: "0.6rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(148,163,184,0.2)",
                boxShadow: "0 2px 8px rgba(37,99,235,0.07)",
                flexShrink: 0,
              }}>
                {study.icon}
              </div>
              <div>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: T.blue,
                }}>
                  Case Study — {study.tag}
                </span>
                <h3 style={{
                  marginTop: 6, fontSize: "1.1rem", fontWeight: 700,
                  lineHeight: 1.35, color: T.textDark, maxWidth: 400,
                }}>
                  {study.title}
                </h3>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={close}
              style={{
                flexShrink: 0, padding: 7, borderRadius: "50%",
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(255,255,255,0.8)",
                cursor: "pointer", color: T.textLight,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = T.blueLight;
                e.currentTarget.style.color = T.blue;
                e.currentTarget.style.borderColor = T.blueBorder;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                e.currentTarget.style.color = T.textLight;
                e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Before / After */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: 8, marginTop: "1.25rem",
          }}>
            {[
              { label: "Before", value: study.metric.before, isBefore: true },
              { label: "After",  value: study.metric.after,  isBefore: false },
            ].map(({ label, value, isBefore }) => (
              <div
                key={label}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  background: isBefore ? "rgba(248,250,252,0.9)" : "rgba(37,99,235,0.07)",
                  border: isBefore ? "1px solid rgba(148,163,184,0.2)" : "1px solid rgba(37,99,235,0.15)",
                }}
              >
                <p style={{
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.14em", marginBottom: 3,
                  color: isBefore ? T.textLight : "rgba(37,99,235,0.55)",
                }}>
                  {label}
                </p>
                <p style={{
                  fontSize: "0.78rem", fontWeight: 600,
                  color: isBefore ? T.textLight : T.blue,
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", gap: "1.625rem" }}>
          {study.sections.map((s) => (
            <div key={s.heading}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.625rem" }}>
                <div style={{
                  width: 3, height: 13, borderRadius: 2,
                  background: T.blue, opacity: 0.5,
                }} />
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.16em", color: T.textLight,
                }}>
                  {s.heading}
                </p>
              </div>

              {s.body && (
                <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: T.textMid }}>
                  {s.body}
                </p>
              )}

              {s.steps && (
                <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {s.steps.map((step, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "0.7rem",
                        fontSize: "0.875rem", color: T.textMid, lineHeight: 1.65,
                      }}
                    >
                      <span style={{
                        flexShrink: 0, width: 21, height: 21, borderRadius: "50%",
                        background: "rgba(37,99,235,0.07)",
                        border: "1px solid rgba(37,99,235,0.18)",
                        color: T.blue, fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: 1,
                      }}>
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              {s.pills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {s.pills.map((p) => (
                    <span
                      key={p}
                      style={{
                        padding: "4px 12px", borderRadius: 100,
                        fontSize: 11, fontWeight: 600,
                        background: "rgba(37,99,235,0.06)",
                        color: T.blue,
                        border: "1px solid rgba(37,99,235,0.15)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Card ──────────────────────────────────────────────────────────────── */
function StudyCard({ study, index, inView, onOpen }) {
  const [hov, setHov] = useState(false);
  const delay = `${index * 160}ms`;

  return (
    <article
      onClick={() => onOpen(study)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 18,
        overflow: "hidden",
        background: hov
          ? "rgba(255,255,255,0.85)"
          : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: hov
          ? "1px solid rgba(37,99,235,0.22)"
          : "1px solid rgba(148,163,184,0.22)",
        boxShadow: hov
          ? "0 16px 48px rgba(37,99,235,0.09), 0 4px 16px rgba(37,99,235,0.05), inset 0 1px 0 rgba(255,255,255,0.95)"
          : "0 4px 16px rgba(148,163,184,0.1), 0 1px 4px rgba(148,163,184,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
        transform: inView
          ? `translateY(${hov ? -3 : 0}px)`
          : "translateY(24px)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}, opacity 0.65s ease ${delay}, box-shadow 0.28s ease, border-color 0.28s ease, background 0.28s ease`,
      }}
    >
      {/* Left accent */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: "linear-gradient(180deg, #2563eb, #60a5fa)",
        opacity: hov ? 0.9 : 0.35,
        transition: "opacity 0.28s",
      }} />

      <div style={{ padding: "1.75rem 1.75rem 1.75rem 2rem" }}>
        {/* Top row */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginBottom: "1.125rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{
              padding: "0.5rem", borderRadius: 11,
              background: hov ? "rgba(37,99,235,0.08)" : "rgba(248,250,252,0.9)",
              border: "1px solid rgba(148,163,184,0.18)",
              transition: "background 0.28s",
              flexShrink: 0,
            }}>
              {study.icon}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.15em",
              color: T.blue,
            }}>
              {study.tag}
            </span>
          </div>
          <span style={{
            fontSize: 11, fontWeight: 500,
            color: T.textLight, letterSpacing: "0.04em",
          }}>
            {study.index}
          </span>
        </div>

        <h3 style={{
          fontSize: "1.05rem", fontWeight: 700,
          lineHeight: 1.38, color: T.textDark, marginBottom: "0.7rem",
        }}>
          {study.title}
        </h3>

        <p style={{
          fontSize: "0.855rem", lineHeight: 1.75,
          color: T.textMid, marginBottom: "1.375rem",
        }}>
          {study.overview}
        </p>

        {/* Metric strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          borderRadius: 10, overflow: "hidden",
          border: "1px solid rgba(148,163,184,0.18)",
          marginBottom: "1.375rem",
        }}>
          <div style={{
            padding: "0.6rem 0.875rem",
            background: "rgba(248,250,252,0.8)",
            borderRight: "1px solid rgba(148,163,184,0.18)",
          }}>
            <p style={{
              fontSize: 8.5, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.13em", color: T.textLight, marginBottom: 3,
            }}>
              Before
            </p>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: T.textLight }}>
              {study.metric.before}
            </p>
          </div>
          <div style={{
            padding: "0.6rem 0.875rem",
            background: "rgba(37,99,235,0.05)",
          }}>
            <p style={{
              fontSize: 8.5, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.13em", color: "rgba(37,99,235,0.5)", marginBottom: 3,
            }}>
              After
            </p>
            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: T.blue }}>
              {study.metric.after}
            </p>
          </div>
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: "0.78rem", fontWeight: 700, color: T.blue,
          }}>
            View Full Study
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                transform: hov ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.22s ease",
              }}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>

          <div style={{ display: "flex", gap: 4 }}>
            {[0.85, 0.45, 0.2].map((op, i) => (
              <div
                key={i}
                style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: T.blue,
                  opacity: hov ? op : op * 0.4,
                  transition: `opacity 0.28s ease ${i * 50}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */
export default function CaseStudySection() {
  const [ref, inView] = useInView();
  const [active, setActive] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        #cs-wrap, #cs-wrap * {
          font-family: 'Inter', sans-serif;
          box-sizing: border-box; margin: 0; padding: 0;
        }
        #cs-wrap ::-webkit-scrollbar { width: 4px; }
        #cs-wrap ::-webkit-scrollbar-track { background: transparent; }
        #cs-wrap ::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.35);
          border-radius: 10px;
        }
      `}</style>

      <section
        id="cs-wrap"
        style={{
          background: T.bg,
          padding: "7rem 0 8rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Top-right arcs */}
        <svg
          style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none", opacity: 0.15 }}
          width="300" height="300" viewBox="0 0 300 300" fill="none"
        >
          <circle cx="300" cy="0" r="110" stroke="#2563eb" strokeWidth="1" fill="none" />
          <circle cx="300" cy="0" r="170" stroke="#2563eb" strokeWidth="0.6" fill="none" />
          <circle cx="300" cy="0" r="230" stroke="#2563eb" strokeWidth="0.4" fill="none" />
        </svg>

        {/* Bottom-left arcs */}
        <svg
          style={{ position: "absolute", bottom: 0, left: 0, pointerEvents: "none", opacity: 0.1 }}
          width="240" height="240" viewBox="0 0 240 240" fill="none"
        >
          <circle cx="0" cy="240" r="90"  stroke="#2563eb" strokeWidth="1"   fill="none" />
          <circle cx="0" cy="240" r="150" stroke="#2563eb" strokeWidth="0.6" fill="none" />
        </svg>

        <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto", padding: "0 1.5rem" }}>

          {/* ── Header ── */}
          <div style={{ maxWidth: 520, marginBottom: "4rem" }}>

            <h2 style={{
              fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: T.textDark,
              marginBottom: "1.125rem",
            }}>
              Case Studies
              <br />
              <span style={{ color: T.blue, fontWeight: 700 }}>From the Field</span>
            </h2>

            <p style={{
              fontSize: "0.95rem", lineHeight: 1.8,
              color: T.textMid, maxWidth: 400, fontWeight: 400,
            }}>
              Real-world evidence of how AI-powered genomic diagnostics are
              transforming cancer detection and reshaping patient outcomes.
            </p>

            <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                height: 2, width: 32, borderRadius: 2,
                background: T.blue, opacity: 0.35,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: T.textLight, letterSpacing: "0.05em",
              }}>
                {studies.length} active studies
              </span>
            </div>
          </div>

          {/* ── Cards ── */}
          <div
            ref={ref}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.25rem",
              maxWidth: 860,
            }}
          >
            {studies.map((s, i) => (
              <StudyCard
                key={s.id}
                study={s}
                index={i}
                inView={inView}
                onOpen={setActive}
              />
            ))}
          </div>

          <p style={{
            marginTop: "2.5rem",
            fontSize: "0.76rem",
            color: T.textLight,
            lineHeight: 1.6,
          }}>
            Click any card to explore the full methodology, results, and clinical impact.
          </p>
        </div>
      </section>

      {active && <StudyModal study={active} onClose={() => setActive(null)} />}
    </>
  );
}