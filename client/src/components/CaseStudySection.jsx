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

/* ── Palette — both studies share the same brand blue ──────────────────── */
const BLUE = {
  base:  "#2F5C8A",
  dark:  "#1e3f63",
  light: "#eef3f9",
  mid:   "#b0c8e2",
  text:  "#1e3f63",
  pill:  "#dce8f4",
};

/* ── Data ──────────────────────────────────────────────────────────────── */
const studies = [
  {
    id:    "liquid-biopsy",
    index: "01",
    tag:   "Liquid Biopsy",
    th:    BLUE,
    icon: (
      <svg viewBox="0 0 44 44" fill="none" width="26" height="26">
        <circle cx="22" cy="22" r="20" stroke="#2F5C8A" strokeWidth="1.3" fill="#dce8f4" />
        <path d="M22 8C22 8 14 17 14 24.5A8 8 0 0 0 30 24.5C30 17 22 8 22 8Z"
          fill="#b0c8e2" stroke="#2F5C8A" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="19" cy="24" r="2" fill="#2F5C8A" opacity="0.5" />
        <circle cx="25" cy="27" r="1.3" fill="#2F5C8A" opacity="0.35" />
      </svg>
    ),
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
    id:    "mrd",
    index: "02",
    tag:   "MRD Detection",
    th:    BLUE,
    icon: (
      <svg viewBox="0 0 44 44" fill="none" width="26" height="26">
        <circle cx="22" cy="22" r="20" stroke="#2F5C8A" strokeWidth="1.3" fill="#dce8f4" />
        <circle cx="22" cy="22" r="7" fill="#b0c8e2" stroke="#2F5C8A" strokeWidth="1.5" />
        <circle cx="22" cy="22" r="13" stroke="#2F5C8A" strokeWidth="0.8" strokeDasharray="2.5 3.5" opacity="0.45" />
        <circle cx="22" cy="22" r="2.8" fill="#2F5C8A" />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          return <circle key={i} cx={22 + 17 * Math.sin(r)} cy={22 - 17 * Math.cos(r)} r="1.4" fill="#2F5C8A" opacity={0.2 + i * 0.08} />;
        })}
      </svg>
    ),
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
  const { th } = study;

  useEffect(() => {
    requestAnimationFrame(() => setVis(true));
    const fn = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, []);

  function close() { setVis(false); setTimeout(onClose, 270); }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.25rem",
        background: `rgba(10,20,35,${vis ? 0.48 : 0})`,
        backdropFilter: "blur(10px) saturate(1.4)",
        transition: "background 0.28s ease",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%", maxWidth: "660px",
        maxHeight: "92vh", overflowY: "auto",
        borderRadius: "24px",
        background: "#ffffff",
        border: "1px solid #d4e0ed",
        boxShadow: vis
          ? "0 24px 80px rgba(10,20,35,0.18), 0 4px 20px rgba(47,92,138,0.1), 0 0 0 1px rgba(255,255,255,0.9) inset"
          : "none",
        transform: vis ? "translateY(0) scale(1)" : "translateY(22px) scale(0.97)",
        opacity: vis ? 1 : 0,
        transition: "transform 0.36s cubic-bezier(0.34,1.4,0.64,1), opacity 0.26s ease, box-shadow 0.3s ease",
        scrollbarWidth: "thin",
        scrollbarColor: "#b0c8e2 #eef3f9",
      }}>
        {/* Top accent bar */}
        <div style={{ height: "4px", background: `linear-gradient(90deg, ${th.base} 0%, ${th.mid} 100%)`, borderRadius: "24px 24px 0 0" }} />

        {/* Hero */}
        <div style={{ padding: "2rem 2.25rem 1.75rem", background: th.light, borderBottom: `1px solid ${th.mid}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{
                padding: "0.65rem", borderRadius: "14px",
                background: "white", border: `1px solid ${th.mid}`,
                boxShadow: `0 2px 10px rgba(47,92,138,0.1)`, flexShrink: 0,
              }}>
                {study.icon}
              </div>
              <div>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: th.text }}>
                  Case Study — {study.tag}
                </span>
                <h3 style={{ marginTop: "6px", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.32, color: "#0d1f35", maxWidth: "420px" }}>
                  {study.title}
                </h3>
              </div>
            </div>
            <button
              onClick={close}
              style={{
                flexShrink: 0, padding: "7px", borderRadius: "50%",
                border: "1px solid #d4e0ed", background: "white",
                cursor: "pointer", color: "#8ba8c4",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = th.light; e.currentTarget.style.color = th.base; }}
              onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#8ba8c4"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Before / After */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "1.5rem" }}>
            {[
              { label: "Before", value: study.metric.before, before: true },
              { label: "After",  value: study.metric.after,  before: false },
            ].map(({ label, value, before }) => (
              <div key={label} style={{
                padding: "0.9rem 1.1rem", borderRadius: "12px",
                background: before ? "white" : th.base,
                border: before ? "1px solid #d4e0ed" : "none",
                boxShadow: before ? "0 1px 4px rgba(0,0,0,0.04)" : `0 4px 16px rgba(47,92,138,0.28)`,
              }}>
                <p style={{ fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: before ? "#8ba8c4" : "rgba(255,255,255,0.6)", marginBottom: "4px" }}>{label}</p>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: before ? "#5a7a9a" : "white" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem 2.25rem", display: "flex", flexDirection: "column", gap: "1.875rem" }}>
          {study.sections.map((s) => (
            <div key={s.heading}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                <div style={{ width: "3px", height: "14px", borderRadius: "2px", background: th.base, opacity: 0.65 }} />
                <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#8ba8c4" }}>{s.heading}</p>
              </div>
              {s.body && <p style={{ fontSize: "0.925rem", lineHeight: 1.8, color: "#3d5a74" }}>{s.body}</p>}
              {s.steps && (
                <ol style={{ display: "flex", flexDirection: "column", gap: "0.625rem", margin: 0, padding: 0, listStyle: "none" }}>
                  {s.steps.map((step, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9rem", color: "#3d5a74", lineHeight: 1.65 }}>
                      <span style={{
                        flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%",
                        background: th.pill, border: `1.5px solid ${th.mid}`,
                        color: th.text, fontSize: "10px", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px",
                      }}>{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
              {s.pills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {s.pills.map((p) => (
                    <span key={p} style={{
                      padding: "5px 13px", borderRadius: "100px",
                      fontSize: "11.5px", fontWeight: 600,
                      background: th.pill, color: th.text,
                      border: `1px solid ${th.mid}`,
                    }}>{p}</span>
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
  const { th } = study;
  const delay = `${index * 190}ms`;

  return (
    <article
      onClick={() => onOpen(study)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "20px",
        overflow: "hidden",
        background: "white",
        border: `1px solid ${hov ? th.mid : "#e2ecf5"}`,
        boxShadow: hov
          ? `0 16px 48px rgba(47,92,138,0.13), 0 4px 14px rgba(47,92,138,0.07)`
          : "0 2px 10px rgba(47,92,138,0.06), 0 1px 3px rgba(47,92,138,0.04)",
        transform: inView ? `translateY(${hov ? -4 : 0}px)` : "translateY(28px)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}, opacity 0.7s ease ${delay}, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* Left accent strip */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "4px",
        background: `linear-gradient(180deg, ${th.base} 0%, ${th.mid} 100%)`,
        opacity: hov ? 1 : 0.45, transition: "opacity 0.3s",
      }} />

      {/* Hover wash */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(140deg, ${th.light} 0%, white 55%)`,
        opacity: hov ? 1 : 0, transition: "opacity 0.4s ease",
      }} />

      <div style={{ padding: "1.875rem 1.875rem 1.875rem 2.125rem", position: "relative" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.375rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ padding: "0.55rem", borderRadius: "12px", background: th.light, border: `1px solid ${th.mid}`, flexShrink: 0 }}>
              {study.icon}
            </div>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: th.text }}>
              {study.tag}
            </span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 500, color: th.mid, letterSpacing: "0.04em" }}>
            {study.index}
          </span>
        </div>

        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.38, color: "#0d1f35", marginBottom: "0.8rem" }}>
          {study.title}
        </h3>

        <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: "#5a7a9a", marginBottom: "1.625rem" }}>
          {study.overview}
        </p>

        {/* Metric strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          borderRadius: "12px", overflow: "hidden",
          border: "1px solid #e2ecf5", marginBottom: "1.625rem",
        }}>
          <div style={{ padding: "0.7rem 1rem", background: "#f5f8fb", borderRight: "1px solid #e2ecf5" }}>
            <p style={{ fontSize: "8.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#8ba8c4", marginBottom: "3px" }}>Before</p>
            <p style={{ fontSize: "0.74rem", fontWeight: 600, color: "#8ba8c4" }}>{study.metric.before}</p>
          </div>
          <div style={{ padding: "0.7rem 1rem", background: th.light }}>
            <p style={{ fontSize: "8.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: th.text, opacity: 0.65, marginBottom: "3px" }}>After</p>
            <p style={{ fontSize: "0.74rem", fontWeight: 600, color: th.text }}>{study.metric.after}</p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", fontWeight: 700, color: th.base }}>
            View Full Study
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: hov ? "translateX(3px)" : "translateX(0)", transition: "transform 0.22s ease" }}>
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[0.9, 0.5, 0.25].map((op, i) => (
              <div key={i} style={{
                width: "5px", height: "5px", borderRadius: "50%", background: th.mid,
                opacity: hov ? op : op * 0.45,
                transition: `opacity 0.3s ease ${i * 55}ms`,
              }} />
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
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700;900&display=swap');
        #cases-wrap, #cases-wrap * {
          font-family: 'Source Sans 3', sans-serif;
          box-sizing: border-box; margin: 0; padding: 0;
        }
        #cases-wrap ::-webkit-scrollbar { width: 5px; }
        #cases-wrap ::-webkit-scrollbar-track { background: #eef3f9; border-radius: 10px; }
        #cases-wrap ::-webkit-scrollbar-thumb { background: #b0c8e2; border-radius: 10px; }
      `}</style>

      <section
        id="cases-wrap"
        className="scroll-mt-20"
        style={{
          background: "linear-gradient(160deg, #f5f8fb 0%, #eef3f9 50%, #f5f8fb 100%)",
          padding: "6.5rem 0 8rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #b0c8e2 1px, transparent 1px)",
          backgroundSize: "32px 32px", opacity: 0.35,
        }} />

        {/* Top-right arcs */}
        <svg style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none", opacity: 0.25 }}
          width="320" height="320" viewBox="0 0 320 320" fill="none">
          <circle cx="320" cy="0" r="120" stroke="#2F5C8A" strokeWidth="1" fill="none" />
          <circle cx="320" cy="0" r="180" stroke="#2F5C8A" strokeWidth="0.6" fill="none" />
          <circle cx="320" cy="0" r="240" stroke="#2F5C8A" strokeWidth="0.4" fill="none" />
        </svg>

        {/* Bottom-left arcs */}
        <svg style={{ position: "absolute", bottom: 0, left: 0, pointerEvents: "none", opacity: 0.18 }}
          width="260" height="260" viewBox="0 0 260 260" fill="none">
          <circle cx="0" cy="260" r="100" stroke="#2F5C8A" strokeWidth="1" fill="none" />
          <circle cx="0" cy="260" r="160" stroke="#2F5C8A" strokeWidth="0.6" fill="none" />
        </svg>

        <div style={{ position: "relative", maxWidth: "1080px", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* ── Header ── */}
          <div style={{ maxWidth: "540px", marginBottom: "4.5rem" }}>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "5px 14px 5px 10px", borderRadius: "100px",
              background: "white", border: "1px solid #d4e0ed",
              boxShadow: "0 1px 6px rgba(47,92,138,0.08)", marginBottom: "1.5rem",
            }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2F5C8A" }} />
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2F5C8A" }}>
                Clinical Evidence
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "#0d1f35",
              marginBottom: "1.25rem",
            }}>
              Case Studies<br />
              <span style={{ color: "#2F5C8A", fontWeight: 700 }}>From the Field</span>
            </h2>

            <p style={{ fontSize: "1rem", lineHeight: 1.78, color: "#5a7a9a", maxWidth: "400px", fontWeight: 400 }}>
              Real-world evidence of how AI-powered genomic diagnostics are transforming cancer detection and reshaping patient outcomes.
            </p>

            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ height: "2px", width: "36px", background: "#2F5C8A", borderRadius: "2px", opacity: 0.45 }} />
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#8ba8c4", letterSpacing: "0.06em" }}>
                {studies.length} active studies
              </span>
            </div>
          </div>

          {/* ── Cards ── */}
          <div
            ref={ref}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1.375rem",
              maxWidth: "860px",
            }}
          >
            {studies.map((s, i) => (
              <StudyCard key={s.id} study={s} index={i} inView={inView} onOpen={setActive} />
            ))}
          </div>

          <p style={{ marginTop: "2.75rem", fontSize: "0.78rem", color: "#8ba8c4", lineHeight: 1.6, fontWeight: 400 }}>
            Click any card to explore the full methodology, results, and clinical impact.
          </p>
        </div>
      </section>

      {active && <StudyModal study={active} onClose={() => setActive(null)} />}
    </>
  );
}
