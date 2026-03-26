import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  :root {
    --navy: #060e24;
    --navy-mid: #0c1a40;
    --blue: #2563eb;
    --blue-bright: #3b82f6;
    --blue-pale: #eff6ff;
    --blue-light: #dbeafe;
    --ink: #0f172a;
    --muted: #64748b;
    --border: #e2e8f0;
    --white: #ffffff;
    --green: #16a34a;
    --amber: #d97706;
    --red: #dc2626;
    --radius: 16px;
  }

  .lb3-root, .lb3-root *, .lb3-root *::before, .lb3-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }
  .lb3-root { font-family: 'DM Sans', sans-serif; background: #fff; color: var(--ink); }

  @keyframes lb3-up   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lb3-in   { from{opacity:0} to{opacity:1} }
  @keyframes lb3-scale{ from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  @keyframes lb3-spin { to{transform:rotate(360deg)} }
  @keyframes lb3-dot  { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
  @keyframes lb3-pulse{ 0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.35)} 50%{box-shadow:0 0 0 9px rgba(37,99,235,0)} }
  @keyframes lb3-float{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes lb3-tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  .lb3-btn {
    display:inline-flex; align-items:center; gap:9px;
    padding:13px 28px; border-radius:10px; border:none; cursor:pointer;
    background:var(--navy);
    color:#fff; font-family:'Sora',sans-serif; font-weight:600; font-size:14px;
    letter-spacing:-0.01em; transition:all .22s ease;
    box-shadow:0 2px 14px rgba(6,14,36,.22);
    position:relative; overflow:hidden;
  }
  .lb3-btn::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(255,255,255,.09) 0%,transparent 60%);
    opacity:0; transition:opacity .2s;
  }
  .lb3-btn:hover:not(:disabled)::after { opacity:1; }
  .lb3-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 7px 26px rgba(6,14,36,.32); }
  .lb3-btn:active:not(:disabled) { transform:translateY(0); }
  .lb3-btn:disabled { opacity:.55; cursor:not-allowed; }

  .lb3-btn-outline {
    display:inline-flex; align-items:center; gap:9px;
    padding:13px 28px; border-radius:10px; cursor:pointer;
    border:1.5px solid var(--border); background:transparent;
    color:var(--ink); font-family:'DM Sans',sans-serif;
    font-weight:600; font-size:14px; transition:all .2s ease;
  }
  .lb3-btn-outline:hover { border-color:var(--blue); color:var(--blue); background:var(--blue-pale); }

  .lb3-stat {
    display:flex; align-items:center; gap:16px;
    padding:20px 22px; background:#fff;
    border:1px solid var(--border); border-radius:var(--radius);
    transition:all .2s ease;
  }
  .lb3-stat:hover { border-color:var(--blue-bright); box-shadow:0 6px 28px rgba(37,99,235,.08); transform:translateY(-2px); }

  .lb3-step {
    background:#fff; border:1px solid var(--border); border-radius:var(--radius);
    padding:26px 22px; position:relative; overflow:hidden;
    transition:all .3s ease;
  }
  .lb3-step.active {
    border-color:var(--blue); background:#fafcff;
    box-shadow:0 0 0 3px rgba(37,99,235,.08), 0 8px 28px rgba(37,99,235,.12);
  }

  .lb3-feat {
    padding:28px 24px; background:#fff;
    border:1px solid var(--border); border-radius:var(--radius);
    position:relative; overflow:hidden; transition:all .3s ease;
  }
  .lb3-feat:hover { border-color:transparent; box-shadow:0 14px 44px rgba(37,99,235,.11); transform:translateY(-4px); }
  .lb3-feat-stripe {
    position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,var(--navy),var(--blue-bright));
    transform:scaleX(0); transform-origin:left; transition:transform .35s ease;
  }
  .lb3-feat:hover .lb3-feat-stripe { transform:scaleX(1); }

  .lb3-pill {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 20px; border-radius:100px;
    border:1px solid var(--border); background:#fff;
    font-size:13px; font-weight:600; color:var(--ink);
    transition:all .2s ease; cursor:default;
  }
  .lb3-pill:hover { border-color:var(--blue); background:var(--blue-pale); color:var(--blue); }

  .lb3-tag {
    display:inline-flex; align-items:center; gap:7px;
    padding:5px 13px; border-radius:100px;
    background:var(--navy); color:rgba(255,255,255,.8);
    font-family:'Sora',sans-serif; font-size:10px; font-weight:600;
    letter-spacing:.09em; text-transform:uppercase; margin-bottom:18px;
  }
  .lb3-tag-dot {
    width:5px; height:5px; border-radius:50%; background:var(--blue-bright);
    animation:lb3-pulse 2s ease-in-out infinite;
  }

  .lb3-section-label {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Sora',sans-serif; font-size:10px; font-weight:700;
    letter-spacing:.13em; text-transform:uppercase; color:var(--blue);
    margin-bottom:12px;
  }
  .lb3-section-label::before {
    content:''; display:block; width:18px; height:2px;
    background:var(--blue); border-radius:1px;
  }

  .lb3-metric {
    padding:14px 12px; border-radius:12px;
    border:1px solid; transition:all .25s ease;
  }
  .lb3-metric:hover { transform:translateY(-2px); box-shadow:0 6px 22px rgba(0,0,0,.07); }

  .lb3-progress-track { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
  .lb3-progress-fill {
    height:100%; border-radius:2px;
    background:linear-gradient(90deg,var(--navy),var(--blue-bright));
    transition:width .75s ease;
  }

  .lb3-ticker-inner {
    display:flex; gap:52px; width:max-content;
    animation:lb3-tick 32s linear infinite;
  }
  .lb3-ticker-inner:hover { animation-play-state:paused; }

  @media (max-width:960px) {
    .lb3-hero       { flex-direction:column !important; }
    .lb3-steps-grid { grid-template-columns:repeat(2,1fr) !important; }
    .lb3-feats-grid { grid-template-columns:repeat(2,1fr) !important; }
    .lb3-demo       { flex-direction:column !important; }
    .lb3-ucwrap     { flex-direction:column !important; }
  }
  @media (max-width:600px) {
    .lb3-steps-grid { grid-template-columns:1fr !important; }
    .lb3-feats-grid { grid-template-columns:1fr !important; }
    .lb3-metrics    { grid-template-columns:1fr !important; }
    .lb3-gauges     { flex-direction:column !important; align-items:center !important; }
    .lb3-htitle     { font-size:38px !important; }
    .lb3-hero-btns  { flex-direction:column !important; }
  }
`;

function InjectCSS() {
  useEffect(() => {
    const id = "lb3-css";
    const ex = document.getElementById(id);
    if (ex) ex.remove();
    const s = document.createElement("style");
    s.id = id; s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
  }, []);
  return null;
}

function DotsLoader({ color = "#fff" }) {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: color,
          display: "inline-block",
          animation: `lb3-dot 1.3s ${i * 0.18}s ease-in-out infinite`,
        }} />
      ))}
    </span>
  );
}

function Gauge({ pct, color, label, sub }) {
  const r = 34, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 44 44)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)" }} />
        <text x="44" y="40" textAnchor="middle" fill={color}
          style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700 }}>{pct}%</text>
        <text x="44" y="53" textAnchor="middle" fill="#94a3b8"
          style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 7 }}>{label}</text>
      </svg>
      <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ── DATA (unchanged) ── */
const STATS = [
  { val: "48h",  label: "Avg. report turnaround time", icon: "⚡", bg: "#fefce8" },
  { val: "97%",  label: "ctDNA detection sensitivity",  icon: "🎯", bg: "#f0fdf4" },
  { val: "5 ml", label: "Single blood draw required",   icon: "💉", bg: "#eff6ff" },
];
const STEPS = [
  { icon: "🧪", title: "Sample Collection",  desc: "5 ml venous blood draw — no anaesthesia, no tissue biopsy, minimal discomfort." },
  { icon: "🧬", title: "Biomarker Analysis", desc: "ctDNA, CEA & circulating protein markers isolated with precision sequencing." },
  { icon: "🤖", title: "AI Processing",      desc: "Multi-layer deep learning engine cross-references thousands of genetic patterns." },
  { icon: "📊", title: "Result Generation",  desc: "A clinical-grade report delivered in under 48 hours to your care team." },
];
const RESULTS = [
  { risk:"Low",    riskColor:"#16a34a", riskBg:"#f0fdf4", activity:"Stable",     actColor:"#16a34a", actBg:"#f0fdf4", rec:"Continue routine monitoring every 90 days",         recIcon:"🟢", ctDNA:"0.03%", conf:96 },
  { risk:"Medium", riskColor:"#d97706", riskBg:"#fffbeb", activity:"Increasing",  actColor:"#dc2626", actBg:"#fef2f2", rec:"Consult your oncologist within 2 weeks",             recIcon:"🟡", ctDNA:"0.09%", conf:91 },
  { risk:"High",   riskColor:"#dc2626", riskBg:"#fef2f2", activity:"Increasing",  actColor:"#dc2626", actBg:"#fef2f2", rec:"Immediate specialist consultation required",         recIcon:"🔴", ctDNA:"0.21%", conf:98 },
];
const FEATURES = [
  { icon:"💉", title:"Non-Invasive",        body:"Just a blood draw — no surgery, no biopsy needle, no recovery time.",   bg:"#eff6ff" },
  { icon:"🔍", title:"Early Detection",      body:"Detects tumour signals weeks before conventional imaging shows changes.", bg:"#f0fdf4" },
  { icon:"📡", title:"Real-Time Monitoring", body:"Continuously tracks tumour evolution with every successive blood draw.",  bg:"#fff7ed" },
  { icon:"⚡", title:"Faster Results",       body:"48-hour reports vs. 2–3 weeks waiting time with traditional biopsy.",    bg:"#fdf4ff" },
];
const USE_CASES = [
  { icon:"💊", label:"Treatment monitoring" },
  { icon:"🔄", label:"Detect recurrence" },
  { icon:"📈", label:"Track therapy effectiveness" },
];
const TICKER_ITEMS = ["ctDNA Analysis","97% Sensitivity","48h Reports","Clinical-Grade AI","Non-Invasive","Early Detection","Treatment Tracking","Real-Time Insights","Precision Medicine","AI Inference"];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function LiquidBiopsySection() {
  const [activeStep, setActiveStep] = useState(null);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [visibleStats, setVisibleStats] = useState(false);
  const sectionRef = useRef(null);
  const statsRef   = useRef(null);

  useEffect(() => {
    const o1 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        FEATURES.forEach((_, i) => setTimeout(() => setVisibleFeatures(p => [...p, i]), i * 110));
        o1.disconnect();
      }
    }, { threshold: 0.1 });
    if (sectionRef.current) o1.observe(sectionRef.current);

    const o2 = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisibleStats(true); o2.disconnect(); }
    }, { threshold: 0.2 });
    if (statsRef.current) o2.observe(statsRef.current);

    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  function runDemo() {
    if (running) return;
    setRunning(true); setStage(1); setResult(null); setActiveStep(0);
    [0, 950, 1900, 2850].forEach((t, i) => setTimeout(() => setActiveStep(i), t));
    setTimeout(() => {
      setResult(RESULTS[Math.floor(Math.random() * RESULTS.length)]);
      setStage(2); setRunning(false); setActiveStep(null);
    }, 3900);
  }

  return (
    <div className="lb3-root">
      <InjectCSS />

      {/* ── Top rule ── */}
      <div style={{ height: 3, background: "linear-gradient(90deg, var(--navy) 0%, var(--blue-bright) 55%, #0ea5e9 100%)" }} />

      <section style={{ background: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 96px" }}>

          {/* ═══════════════════ HERO ═══════════════════ */}
          <div className="lb3-hero" style={{ display: "flex", gap: 72, alignItems: "flex-start", marginBottom: 72 }}>

            {/* Left copy */}
            <div style={{ flex: "1 1 440px", animation: "lb3-up .7s ease both" }}>
              <div className="lb3-tag">
                <span className="lb3-tag-dot" />
                OncoTrace AI · Liquid Biopsy
              </div>

              <h1 className="lb3-htitle" style={{
                fontFamily: "'Sora',sans-serif", fontWeight: 800,
                fontSize: 56, lineHeight: 1.04, letterSpacing: "-0.04em",
                color: "var(--ink)", marginBottom: 22,
              }}>
                Liquid{" "}
                <span style={{
                  background: "linear-gradient(120deg,var(--navy) 0%,var(--blue) 55%,#0ea5e9 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>Biopsy</span>
                <br />Monitoring
              </h1>

              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--blue)", marginBottom: 12, letterSpacing: "-.01em" }}>
                Detect cancer changes early through a simple blood test
              </p>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.85, maxWidth: 480 }}>
                A non-invasive method to track cancer progression in real-time using
                blood samples — powered by clinical-grade AI inference.
              </p>

              <div className="lb3-hero-btns" style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
                <button className="lb3-btn" onClick={runDemo} disabled={running}>
                  {running ? <><DotsLoader />&nbsp;Processing…</> : "▶  Run Demo Analysis"}
                </button>
                <button className="lb3-btn-outline">Learn More →</button>
              </div>
            </div>

            {/* Right stats */}
            <div ref={statsRef} style={{ flex: "0 1 340px", display: "flex", flexDirection: "column", gap: 10 }}>
              {STATS.map((s, i) => (
                <div key={i} className="lb3-stat" style={{
                  opacity:   visibleStats ? 1 : 0,
                  transform: visibleStats ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity .5s ${i * .13}s ease, transform .5s ${i * .13}s ease`,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: s.bg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 22,
                  }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 27, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.04em", lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.label}</div>
                  </div>
                  <div style={{ width: 3, height: 30, borderRadius: 2, background: "var(--blue-light)", flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════ TICKER ═══════════════════ */}
          <div style={{
            overflow: "hidden", background: "#f8faff",
            borderRadius: 12, border: "1px solid var(--border)",
            padding: "11px 0", marginBottom: 72,
          }}>
            <div className="lb3-ticker-inner">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
                <span key={i} style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 10,
                  color: i % 3 === 0 ? "var(--navy)" : i % 3 === 1 ? "var(--blue)" : "var(--muted)",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "currentColor", opacity: .5 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ═══════════════════ WORKFLOW ═══════════════════ */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 36 }}>
              <div className="lb3-section-label">How It Works</div>
              <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 27, color: "var(--ink)", letterSpacing: "-0.03em", marginBottom: 8 }}>
                4-Step Analysis Workflow
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 400 }}>
                From sample to clinical insight — fast, accurate, and non-invasive.
              </p>
            </div>

            <div className="lb3-steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, position: "relative" }}>
              {/* Connector line */}
              <div style={{
                position: "absolute", top: 44, left: "13%", right: "13%", height: 1,
                background: "linear-gradient(90deg, var(--border), var(--blue), var(--border))",
                zIndex: 0, pointerEvents: "none",
              }} />

              {STEPS.map((s, i) => (
                <div key={i} className={`lb3-step${activeStep === i ? " active" : ""}`} style={{ zIndex: 1 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: activeStep === i ? "var(--navy)" : "#fff",
                    border: `2px solid ${activeStep === i ? "var(--navy)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 18, fontSize: 18, position: "relative",
                    transition: "all .35s ease",
                    animation: activeStep === i ? "lb3-pulse 1.5s ease-in-out infinite" : "none",
                  }}>
                    {s.icon}
                  </div>

                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", color: "var(--blue)", textTransform: "uppercase", marginBottom: 6 }}>
                    Step {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 700, color: activeStep === i ? "var(--blue)" : "var(--ink)", marginBottom: 7, letterSpacing: "-0.02em", transition: "color .3s" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>{s.desc}</div>

                  {/* Progress bar bottom */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "var(--border)", borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: "0 0 16px 16px",
                      background: "linear-gradient(90deg,var(--navy),var(--blue-bright))",
                      width: activeStep === i || (activeStep !== null && activeStep > i) ? "100%" : "0%",
                      transition: "width .8s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════ DEMO ═══════════════════ */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 40px rgba(6,14,36,.07)",
            marginBottom: 72,
          }}>
            {/* Chrome header */}
            <div style={{
              background: "var(--navy)", padding: "22px 32px",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 5 }}>
                  Interactive Demo
                </div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                  Run Demo Analysis
                </div>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                {["#ef4444","#f59e0b","#22c55e"].map((c, i) => (
                  <div key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: .7 }} />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="lb3-demo" style={{ display: "flex", background: "#fff" }}>

              {/* Controls */}
              <div style={{
                flex: "0 0 290px", padding: "30px 26px",
                borderRight: "1px solid var(--border)",
                display: "flex", flexDirection: "column", gap: 22,
              }}>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.75 }}>
                  Simulate a real liquid biopsy pipeline with live step-by-step progress.
                </p>
                <button className="lb3-btn" onClick={runDemo} disabled={running} style={{ alignSelf: "flex-start" }}>
                  {running ? <><DotsLoader />&nbsp;Processing…</> : "▶  Run Demo Analysis"}
                </button>

                {(running || stage === 2) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                    {STEPS.map((s, i) => {
                      const done    = stage === 2 || (activeStep !== null && i < activeStep);
                      const current = activeStep === i && running;
                      return (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: done ? "var(--navy)" : current ? "var(--blue)" : "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 13 }}>{s.icon}</span>{s.title}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: done ? "var(--green)" : current ? "var(--blue)" : "transparent" }}>
                              {done ? "✓" : "…"}
                            </span>
                          </div>
                          <div className="lb3-progress-track">
                            <div className="lb3-progress-fill" style={{ width: done ? "100%" : current ? "55%" : "0%" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Result */}
              <div style={{
                flex: 1, padding: "30px 32px",
                display: "flex", flexDirection: "column",
                justifyContent: stage !== 2 ? "center" : "flex-start",
                alignItems: stage !== 2 ? "center" : "stretch",
                minHeight: 300,
              }}>
                {stage === 0 && (
                  <div style={{ textAlign: "center", animation: "lb3-in .4s ease" }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: 20,
                      background: "#f8faff", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 32, margin: "0 auto 16px",
                      animation: "lb3-float 3.5s ease-in-out infinite",
                    }}>🔬</div>
                    <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Result will appear here after analysis</p>
                  </div>
                )}
                {stage === 1 && (
                  <div style={{ textAlign: "center", animation: "lb3-in .3s ease" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      border: "3px solid var(--blue-light)", borderTopColor: "var(--navy)",
                      animation: "lb3-spin .85s linear infinite", margin: "0 auto 16px",
                    }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)" }}>Analysing biomarkers…</p>
                  </div>
                )}
                {stage === 2 && result && (
                  <div style={{ width: "100%", animation: "lb3-scale .45s ease both" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Analysis Complete</div>
                      <div style={{
                        padding: "4px 14px", borderRadius: 100,
                        background: "#f0fdf4", border: "1px solid #bbf7d0",
                        fontSize: 11, fontWeight: 700, color: "var(--green)",
                        fontFamily: "'Sora',sans-serif",
                      }}>✓ Verified</div>
                    </div>

                    <div className="lb3-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
                      {[
                        { label:"Risk Level",    value:result.risk,       color:result.riskColor, bg:result.riskBg, sub:`ctDNA ${result.ctDNA}` },
                        { label:"Tumor Activity",value:result.activity,   color:result.actColor,  bg:result.actBg,  sub:"vs prev draw" },
                        { label:"AI Confidence", value:`${result.conf}%`, color:"var(--navy)",    bg:"#f0f4ff",     sub:"Model v3.1" },
                      ].map((m, i) => (
                        <div key={i} className="lb3-metric" style={{
                          background: m.bg, borderColor: `${m.color}20`,
                          animation: `lb3-up .4s ${i * .08}s ease both`,
                        }}>
                          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
                          <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: "-0.03em" }}>{m.value}</div>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{m.sub}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      padding: "13px 17px", borderRadius: 12, marginBottom: 18,
                      background: "#f8faff", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", gap: 13,
                      animation: "lb3-up .4s .2s ease both",
                    }}>
                      <span style={{ fontSize: 20 }}>{result.recIcon}</span>
                      <div>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 9, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 3 }}>Recommendation</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{result.rec}</div>
                      </div>
                    </div>

                    <div className="lb3-gauges" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
                      <Gauge pct={result.conf} color="var(--navy)" label="confidence" sub="AI Score" />
                      <Gauge pct={Math.min(99, Math.round(parseFloat(result.ctDNA) * 390))} color={result.riskColor} label="ctDNA%" sub="Marker Load" />
                      <Gauge pct={result.risk === "High" ? 76 : result.risk === "Medium" ? 44 : 16} color={result.actColor} label="activity" sub="Tumour Index" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════ FEATURES ═══════════════════ */}
          <div ref={sectionRef} style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="lb3-section-label">Why Liquid Biopsy</div>
                <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 27, color: "var(--ink)", letterSpacing: "-0.03em" }}>
                  Key Capabilities
                </h2>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 270, textAlign: "right", lineHeight: 1.75 }}>
                Everything you need to track treatment, detect changes, and act faster.
              </p>
            </div>

            <div className="lb3-feats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="lb3-feat" style={{
                  opacity:   visibleFeatures.includes(i) ? 1 : 0,
                  transform: visibleFeatures.includes(i) ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity .45s ${i * .1}s ease, transform .45s ${i * .1}s ease`,
                }}>
                  <div className="lb3-feat-stripe" />
                  <div style={{
                    width: 50, height: 50, borderRadius: 14, marginBottom: 18,
                    background: f.bg, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 22, border: "1px solid rgba(0,0,0,.04)",
                  }}>{f.icon}</div>
                  <div style={{
                    position: "absolute", top: 18, right: 18,
                    fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 46,
                    color: "rgba(6,14,36,.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none",
                  }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 8, letterSpacing: "-0.02em" }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.72 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════ USE CASES ═══════════════════ */}
          <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 2px 24px rgba(6,14,36,.05)" }}>
            <div className="lb3-ucwrap" style={{ display: "flex" }}>
              {/* Dark label side */}
              <div style={{
                background: "var(--navy)", padding: "36px 40px",
                flex: "0 0 auto", display: "flex", flexDirection: "column", justifyContent: "center",
                minWidth: 240,
              }}>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,.38)", letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 9 }}>
                  Clinical Use Cases
                </div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.3 }}>
                  Where liquid biopsy makes an impact
                </div>
              </div>
              {/* Pills side */}
              <div style={{ flex: 1, padding: "36px 40px", background: "#fff", display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {USE_CASES.map((u, i) => (
                    <div key={i} className="lb3-pill">{u.icon} {u.label}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
