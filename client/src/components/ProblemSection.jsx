import { useRef, useEffect, useState } from "react";

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const PROBLEMS = [
  {
    id: "01",
    keyword: "REAL-TIME",
    title: "Lack of Real-Time Monitoring",
    body: "Cancer progression is not tracked continuously — clinicians rely on intermittent scans taken days or weeks apart. Critical changes in tumour dynamics occur silently in the gaps, leading to delayed insights and missed treatment windows.",
    stat: "7yr",
    statLabel: "avg. delay to diagnosis",
    color: "#1e40af",
    lightColor: "#dbeafe",
  },
  {
    id: "02",
    keyword: "INVASION",
    title: "Dependence on Invasive Methods",
    body: "Repeated biopsies and invasive scans are not suitable for ongoing, continuous monitoring. Each procedure carries surgical risk, patient burden, and recovery time — making frequent tracking practically impossible.",
    stat: "3×",
    statLabel: "more painful than liquid biopsy",
    color: "#1d4ed8",
    lightColor: "#eff6ff",
  },
  {
    id: "03",
    keyword: "INTELLIGENCE",
    title: "Limited Use of Artificial Intelligence",
    body: "Existing monitoring systems fail to fully leverage AI for deep data analysis. Complex biological patterns that machine learning could decode in seconds are routinely discarded — the infrastructure to exploit them simply does not exist.",
    stat: "95%",
    statLabel: "of signal data is lost",
    color: "#2563eb",
    lightColor: "#eff6ff",
  },
  {
    id: "04",
    keyword: "ISOLATION",
    title: "Fragmented and Closed Systems",
    body: "Advanced monitoring technologies are proprietary, expensive, and not openly accessible. The lack of open-source collaboration and interoperability slows innovation across the global oncology community — every institution rebuilds from zero.",
    stat: "60+",
    statLabel: "siloed data systems",
    color: "#1e3a8a",
    lightColor: "#dbeafe",
  },
  {
    id: "05",
    keyword: "DYNAMICS",
    title: "Incomplete Understanding of Cancer Dynamics",
    body: "Without continuous longitudinal data, tracking how disease evolves over time remains a fundamental challenge. Mutations accumulate, resistance builds, and metastasis begins — all invisible between appointments.",
    stat: "80%",
    statLabel: "caught at advanced stage",
    color: "#172554",
    lightColor: "#dbeafe",
  },
];

/* ══════════════════════════════════════
   HOOKS
══════════════════════════════════════ */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function useCountUp(target, active, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick); else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ══════════════════════════════════════
   SVG WAVE ORNAMENT (unique per panel)
══════════════════════════════════════ */
function WaveOrn({ id, color }) {
  const waves = [
    "M0,40 C30,10 70,70 100,40 C130,10 170,70 200,40",
    "M0,50 Q50,10 100,50 Q150,90 200,50",
    "M0,30 C40,60 60,0 100,30 C140,60 160,0 200,30",
    "M0,50 C25,20 75,80 100,50 C125,20 175,80 200,50",
    "M0,40 Q25,70 50,40 Q75,10 100,40 Q125,70 150,40 Q175,10 200,40",
  ];
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "auto", opacity: 0.25 }}>
      <path d={waves[id % waves.length]} stroke={color} strokeWidth="2" fill="none" />
      <path d={waves[(id + 2) % waves.length]} stroke={color} strokeWidth="1"
        fill="none" opacity="0.5" transform="translate(0,20)" />
    </svg>
  );
}

/* ══════════════════════════════════════
   HORIZONTAL ACCORDION PANEL
══════════════════════════════════════ */
function Panel({ p, index, active, onHover, seen }) {
  const isActive = active === index;
  const numericStat = parseInt(p.stat.replace(/[^0-9]/g, ""), 10);
  const prefix = p.stat.match(/^[^\d]*/)[0];
  const suffix = p.stat.replace(/[0-9]/g, "").replace(prefix, "");
  const count = useCountUp(numericStat, isActive, 1200);
  const displayStat = `${prefix}${count}${suffix}`;

  return (
    <div
      className={`pnl ${isActive ? "pnl--open" : "pnl--closed"}`}
      onMouseEnter={() => onHover(index)}
      onFocus={() => onHover(index)}
      style={{
        "--pcolor": p.color,
        "--plcolor": p.lightColor,
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateY(40px)",
        transition: `opacity .7s ease ${index * 80}ms, transform .7s cubic-bezier(.22,1,.36,1) ${index * 80}ms`,
      }}
    >
      {/* ── collapsed label (rotated) ── */}
      <div className="pnl-tab">
        <span className="pnl-tab-num">{p.id}</span>
        <span className="pnl-tab-kw">{p.keyword}</span>
      </div>

      {/* ── expanded content ── */}
      <div className="pnl-body">
        <div className="pnl-body-inner">
          {/* top section */}
          <div className="pnl-top">
            <div className="pnl-index">{p.id}</div>
            <div className="pnl-orn">
              <WaveOrn id={index} color={p.color} />
            </div>
          </div>

          {/* stat */}
          <div className="pnl-stat-block">
            <div className="pnl-stat-num">{displayStat}</div>
            <div className="pnl-stat-lbl">{p.statLabel}</div>
          </div>

          {/* text */}
          <div className="pnl-text-block">
            <h3 className="pnl-title">{p.title}</h3>
            <p className="pnl-desc">{p.body}</p>
          </div>

          {/* keyword watermark */}
          <div className="pnl-watermark">{p.keyword}</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MOBILE ACCORDION ROW
══════════════════════════════════════ */
function MobileRow({ p, index, seen }) {
  const [open, setOpen] = useState(false);
  const numericStat = parseInt(p.stat.replace(/[^0-9]/g, ""), 10);
  const prefix = p.stat.match(/^[^\d]*/)[0];
  const suffix = p.stat.replace(/[0-9]/g, "").replace(prefix, "");
  const count = useCountUp(numericStat, open, 1200);
  const displayStat = `${prefix}${count}${suffix}`;

  return (
    <div
      className={`macc ${open ? "macc--open" : ""}`}
      style={{
        "--pcolor": p.color,
        "--plcolor": p.lightColor,
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : "translateX(-24px)",
        transition: `opacity .65s ease ${index * 90}ms, transform .65s cubic-bezier(.22,1,.36,1) ${index * 90}ms`,
      }}
    >
      <button className="macc-trigger" onClick={() => setOpen(v => !v)}>
        <span className="macc-trigger-left">
          <span className="macc-num">{p.id}</span>
          <span className="macc-kw">{p.keyword}</span>
        </span>
        <span className={`macc-arrow ${open ? "macc-arrow--open" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div className="macc-panel">
        <div className="macc-panel-inner">
          <div className="macc-stat">
            <span className="macc-stat-num">{displayStat}</span>
            <span className="macc-stat-lbl">{p.statLabel}</span>
          </div>
          <h3 className="macc-title">{p.title}</h3>
          <p className="macc-body">{p.body}</p>
          <div className="macc-orn">
            <WaveOrn id={index} color={p.color} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function ProblemSection() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const [sectionRef, seen] = useReveal(0.05);
  const [headRef, headSeen] = useReveal(0.1);
  const [footRef, footSeen] = useReveal(0.2);

  /* auto-cycle on desktop */
  useEffect(() => {
    if (isMobile) return;
    const t = setInterval(() => {
      setActive(v => (v + 1) % PROBLEMS.length);
    }, 3500);
    return () => clearInterval(t);
  }, [isMobile]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Barlow:wght@300;400;500&display=swap');

        .ps3 { --dur: .5s; }
        .ps3 * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── ROOT ── */
        .ps3 {
          font-family: 'Barlow', sans-serif;
          background: #f0f4ff;
          position: relative;
          overflow: hidden;
        }

        /* faint diagonal lines across whole section */
        .ps3::before {
          content: '';
          position: absolute; inset: 0;
          background: repeating-linear-gradient(
            -60deg,
            transparent 0px, transparent 48px,
            rgba(29,78,216,.025) 48px, rgba(29,78,216,.025) 49px
          );
          pointer-events: none;
        }

        /* ── HEADER BLOCK ── */
        .ps3-head {
          padding: clamp(64px,9vw,112px) clamp(24px,6vw,80px) clamp(32px,4vw,48px);
          max-width: 1360px; margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: end;
          gap: clamp(24px, 4vw, 80px);
        }
        @media(max-width:700px){ .ps3-head { grid-template-columns: 1fr; gap: 20px; } }

        .ps3-head-left {}
        .ps3-pretitle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px,1.2vw,13px);
          font-weight: 700;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: #2563eb;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .ps3-pretitle::before {
          content: '';
          display: block; width: 24px; height: 2px;
          background: #2563eb; border-radius: 1px;
        }

        .ps3-h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2.4rem,5.5vw,4.8rem);
          font-weight: 900;
          line-height: .95;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #0c1322;
        }
        .ps3-h1-line2 {
          color: #2563eb;
          display: inline-block;
          position: relative;
          padding-bottom: 10px;
        }
        /* primary animated underline */
        .ps3-h1-line2::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; width: 100%; height: 4px;
          background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
          border-radius: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 1s cubic-bezier(.22,1,.36,1) .6s;
        }
        /* secondary offset underline — "broken" echo */
        .ps3-h1-line2::before {
          content: '';
          position: absolute;
          bottom: -4px; left: 15%; width: 55%; height: 2px;
          background: rgba(239,68,68,.35);
          border-radius: 1px;
          transform: scaleX(0); transform-origin: left;
          transition: transform .9s cubic-bezier(.22,1,.36,1) .95s;
        }
        .ps3-h1-line2.struck::after  { transform: scaleX(1); }
        .ps3-h1-line2.struck::before { transform: scaleX(1); }

        .ps3-head-right {
          padding-bottom: 8px;
        }
        .ps3-lead {
          font-size: clamp(.9375rem,1.5vw,1.125rem);
          font-weight: 300;
          color: #3d4f6e;
          line-height: 1.78;
          margin-bottom: 20px;
        }
        .ps3-caption {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(.8125rem,1.1vw,.9375rem);
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #94a3b8;
        }

        /* ── HORIZONTAL ACCORDION (desktop) ── */
        .ps3-accordion {
          display: flex;
          height: clamp(420px, 55vh, 620px);
          padding: 0 clamp(24px,6vw,80px);
          max-width: 1360px; margin: 0 auto;
          gap: 10px;
        }
        @media(max-width:767px){ .ps3-accordion { display: none; } }

        /* ── PANEL ── */
        .pnl {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: flex var(--dur) cubic-bezier(.77,0,.18,1),
                      box-shadow .3s ease;
          flex-shrink: 0;
        }
        .pnl--closed {
          flex: 0 0 clamp(52px,5vw,72px);
          background: #fff;
          box-shadow: 0 2px 12px rgba(29,78,216,.06);
        }
        .pnl--closed:hover {
          box-shadow: 0 6px 24px rgba(29,78,216,.12);
        }
        .pnl--open {
          flex: 1;
          background: var(--pcolor);
          box-shadow: 0 20px 56px rgba(29,78,216,.2);
        }

        /* ── collapsed tab ── */
        .pnl-tab {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 14px; padding: 16px 0;
          transition: opacity var(--dur) ease;
        }
        .pnl--open .pnl-tab { opacity: 0; pointer-events: none; }

        .pnl-tab-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: .16em;
          color: #94a3b8;
        }
        .pnl-tab-kw {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(12px,1.3vw,15px);
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #1e3a8a;
        }

        /* ── expanded body ── */
        .pnl-body {
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity var(--dur) ease;
          pointer-events: none;
          overflow: hidden;
        }
        .pnl--open .pnl-body {
          opacity: 1; pointer-events: auto;
        }

        .pnl-body-inner {
          position: relative;
          height: 100%;
          padding: clamp(20px,3vw,36px) clamp(20px,2.8vw,32px);
          display: flex; flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        .pnl-top {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .pnl-index {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(48px,6vw,80px);
          font-weight: 900;
          line-height: .9;
          color: rgba(255,255,255,.18);
          letter-spacing: -.03em;
        }
        .pnl-orn { width: clamp(80px,14vw,160px); }

        .pnl-stat-block {
          display: flex; flex-direction: column; gap: 4px;
        }
        .pnl-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem,4vw,3.5rem);
          font-weight: 900;
          color: #fff;
          line-height: 1;
          letter-spacing: -.03em;
          font-variant-numeric: tabular-nums;
        }
        .pnl-stat-lbl {
          font-size: clamp(.7rem,.9vw,.8rem);
          font-weight: 400;
          color: rgba(255,255,255,.6);
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .pnl-text-block { position: relative; z-index: 1; }
        .pnl-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.1rem,1.8vw,1.6rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .01em;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
        }
        .pnl-desc {
          font-size: clamp(.75rem,1vw,.875rem);
          font-weight: 300;
          color: rgba(255,255,255,.8);
          line-height: 1.7;
          max-width: 340px;
        }

        /* large watermark keyword */
        .pnl-watermark {
          position: absolute;
          bottom: -16px; right: -8px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(52px,8vw,110px);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -.03em;
          color: rgba(255,255,255,.06);
          line-height: 1;
          user-select: none; pointer-events: none;
          white-space: nowrap;
        }

        /* ── MOBILE ACCORDION ── */
        .ps3-macc {
          display: none;
          padding: 0 clamp(16px,5vw,40px);
          flex-direction: column;
          gap: 0;
          max-width: 1360px; margin: 0 auto;
        }
        @media(max-width:767px){ .ps3-macc { display: flex; } }

        .macc {
          border-bottom: 1px solid rgba(29,78,216,.12);
          overflow: hidden;
        }
        .macc:first-child { border-top: 1px solid rgba(29,78,216,.12); }

        .macc-trigger {
          width: 100%; background: none; border: none; cursor: pointer;
          display: flex; align-items: center;
          justify-content: space-between;
          padding: 18px 4px;
          gap: 12px;
          text-align: left;
        }
        .macc-trigger-left {
          display: flex; align-items: center; gap: 14px;
        }
        .macc-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: .16em;
          color: #94a3b8; flex-shrink: 0;
        }
        .macc-kw {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1rem,4vw,1.25rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--pcolor);
        }
        .macc-arrow {
          color: #94a3b8; flex-shrink: 0;
          transition: transform .35s cubic-bezier(.22,1,.36,1);
        }
        .macc-arrow--open { transform: rotate(180deg); }

        .macc-panel {
          max-height: 0; overflow: hidden;
          transition: max-height .5s cubic-bezier(.22,1,.36,1);
        }
        .macc--open .macc-panel { max-height: 600px; }

        .macc-panel-inner {
          padding: 4px 4px 24px;
          background: var(--plcolor);
          border-radius: 12px;
          margin-bottom: 12px;
          padding: 20px;
        }

        .macc-stat {
          display: flex; align-items: baseline; gap: 10px;
          margin-bottom: 12px;
        }
        .macc-stat-num {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem,8vw,2.5rem);
          font-weight: 900;
          color: var(--pcolor);
          letter-spacing: -.03em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .macc-stat-lbl {
          font-size: .75rem; font-weight: 500;
          color: #5a6a85; text-transform: uppercase;
          letter-spacing: .07em; line-height: 1.3;
        }

        .macc-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.125rem,4.5vw,1.375rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .02em;
          color: var(--pcolor);
          line-height: 1.15; margin-bottom: 10px;
        }
        .macc-body {
          font-size: .9rem; font-weight: 300;
          color: #3d4f6e; line-height: 1.72;
          margin-bottom: 16px;
        }
        .macc-orn { opacity: .4; }

        /* ── BOTTOM STRIPE ── */
        .ps3-foot {
          margin: clamp(40px,6vw,72px) clamp(24px,6vw,80px) 0;
          padding-bottom: clamp(56px,8vw,96px);
          max-width: 1360px; margin-inline: auto;
          padding-inline: clamp(24px,6vw,80px);
          padding-block: clamp(40px,6vw,72px) clamp(56px,8vw,96px);
        }

        .ps3-foot-inner {
          background: #0c1322;
          border-radius: 20px;
          padding: clamp(28px,4.5vw,52px) clamp(24px,4vw,52px);
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: clamp(20px,4vw,60px);
          position: relative; overflow: hidden;
        }
        @media(max-width:580px){ .ps3-foot-inner { grid-template-columns:1fr; } }

        /* animated scan line */
        .ps3-foot-inner::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 60%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,.6), transparent);
          animation: scanline 4s linear infinite;
        }
        @keyframes scanline {
          to { left: 150%; }
        }

        .ps3-foot-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: .22em; text-transform: uppercase;
          color: #3b82f6; margin-bottom: 12px;
        }
        .ps3-foot-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(1.25rem,2.8vw,2rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -.01em;
          color: #fff;
          line-height: 1.25;
        }
        .ps3-foot-text em { font-style: normal; color: #60a5fa; }

        .ps3-foot-badge {
          width: clamp(80px,12vw,110px);
          height: clamp(80px,12vw,110px);
          border-radius: 50%;
          border: 1.5px solid rgba(59,130,246,.4);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 2px;
          flex-shrink: 0;
          position: relative; z-index: 1;
          animation: badge-pulse 3s ease-in-out infinite;
        }
        @keyframes badge-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,.3); }
          50%      { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
        }
        .ps3-foot-badge-line1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(11px,1.2vw,13px); font-weight: 900;
          letter-spacing: .08em; text-transform: uppercase;
          color: #fff;
        }
        .ps3-foot-badge-line2 {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(8px,.9vw,10px); font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: #60a5fa;
        }

        /* nav dots */
        .ps3-dots {
          display: flex; justify-content: center; gap: 8px;
          padding: clamp(16px,3vw,28px) 0 0;
        }
        @media(max-width:767px){ .ps3-dots { display: none; } }

        .ps3-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #cbd5e1; border: none; cursor: pointer;
          padding: 0; transition: background .3s ease, transform .3s ease;
        }
        .ps3-dot--active {
          background: #2563eb;
          transform: scale(1.5);
        }
      `}</style>

      <section className="ps3">

        {/* ── HEADER ── */}
        <div className="ps3-head" ref={headRef}>
          <div
            className="ps3-head-left"
            style={{
              opacity: headSeen ? 1 : 0,
              transform: headSeen ? "none" : "translateY(32px)",
              transition: "opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div className="ps3-pretitle">The Problem</div>
            <h2 className="ps3-h1">
              The Challenge<br />
              in Modern<br />
              Cancer<br />
              <span className={`ps3-h1-line2 ${headSeen ? "struck" : ""}`}>
                Monitoring
              </span>
            </h2>
          </div>
          <div
            className="ps3-head-right"
            style={{
              opacity: headSeen ? 1 : 0,
              transform: headSeen ? "none" : "translateY(32px)",
              transition: "opacity .9s cubic-bezier(.22,1,.36,1) .2s, transform .9s cubic-bezier(.22,1,.36,1) .2s",
            }}
          >
            <p className="ps3-lead">
              Cancer care lacks continuous, real-time visibility — limiting precision
              and delaying critical insights. Despite major advances in oncology,
              monitoring still relies on intermittent scans, invasive procedures,
              and delayed data, creating significant gaps in understanding how cancer
              evolves over time.
            </p>
            <p className="ps3-caption">Hover each panel to explore · 5 critical gaps</p>
          </div>
        </div>

        {/* ── DESKTOP ACCORDION ── */}
        <div className="ps3-accordion" ref={sectionRef}>
          {PROBLEMS.map((p, i) => (
            <Panel
              key={p.id}
              p={p}
              index={i}
              active={active}
              onHover={setActive}
              seen={seen}
            />
          ))}
        </div>

        {/* nav dots */}
        <div className="ps3-dots">
          {PROBLEMS.map((_, i) => (
            <button
              key={i}
              className={`ps3-dot ${active === i ? "ps3-dot--active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Panel ${i + 1}`}
            />
          ))}
        </div>

        {/* ── MOBILE ACCORDION ── */}
        <div className="ps3-macc">
          {PROBLEMS.map((p, i) => (
            <MobileRow key={p.id} p={p} index={i} seen={seen} />
          ))}
        </div>

        {/* ── FOOTER CTA ── */}
        <div className="ps3-foot" ref={footRef}>
          <div
            className="ps3-foot-inner"
            style={{
              opacity: footSeen ? 1 : 0,
              transform: footSeen ? "none" : "translateY(28px) scale(.98)",
              transition: "opacity .85s cubic-bezier(.22,1,.36,1), transform .85s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div>
              <div className="ps3-foot-label">The Path Forward</div>
              <p className="ps3-foot-text">
                The future of oncology requires a shift to{" "}
                <em>real-time,<br />AI-driven,</em> non-invasive monitoring —<br />
                built on <em>openness, accessibility,</em> and precision.
              </p>
            </div>
            <div className="ps3-foot-badge">
              <span className="ps3-foot-badge-line1">Liquid</span>
              <span className="ps3-foot-badge-line2">Biopsy</span>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}