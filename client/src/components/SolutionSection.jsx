import { useState, useEffect, useRef } from "react";

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ═══ useInView ═══ */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ═══ useScrollProgress ═══ */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

/* ═══ useParallax ═══ */
function useParallax(speed = 0.06) {
  const [y, setY] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setY(center * speed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return [ref, y];
}

/* ═══ FloatingOrbs ═══ */
function FloatingOrbs({ dark = false }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[
        { w: 180, h: 180, x: "75%", y: "10%", dur: 14, del: 0 },
        { w: 120, h: 120, x: "10%", y: "60%", dur: 18, del: 2 },
        { w: 80,  h: 80,  x: "50%", y: "80%", dur: 11, del: 1 },
      ].map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.w,
            height: o.h,
            left: o.x,
            top: o.y,
            transform: "translate(-50%,-50%)",
            background: dark
              ? `radial-gradient(circle, rgba(59,130,246,${0.07 + i * 0.02}) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(37,99,235,${0.05 + i * 0.02}) 0%, transparent 70%)`,
            animation: `orbFloat${i} ${o.dur}s ease-in-out ${o.del}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══ GlowDot ═══ */
function GlowDot({ color = "#3b82f6", size = 6 }) {
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <span
        className="absolute inline-flex rounded-full opacity-75"
        style={{
          width: size, height: size,
          background: color,
          animation: "pingAnim 2s cubic-bezier(0,0,0.2,1) infinite",
        }}
      />
      <span className="relative inline-flex rounded-full" style={{ width: size, height: size, background: color }} />
    </span>
  );
}

/* ═══ Pill badge ═══ */
function Pill({ children, color = "blue" }) {
  const styles = {
    blue:  "bg-blue-500/10 text-blue-600 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    white: "bg-white/15 text-white border-white/25",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border ${styles[color]}`}>
      {children}
    </span>
  );
}

/* ═══ AnimCard wrapper ═══ */
function AnimCard({ inView, fromX = 0, fromY = 0, delay = 0, duration = 1400, scale = 0.91, className = "", style = {}, children }) {
  return (
    <div
      className={className}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: SPRING,
        transitionDelay: inView ? `${delay}ms` : "0ms",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translate(0,0) scale(1)"
          : `translate(${fromX}px, ${fromY}px) scale(${scale})`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══ WaveBar (replaces numeric charts) ═══ */
function WaveBar({ inView, delay = 0 }) {
  const bars = [40, 65, 50, 80, 60, 90, 70, 85, 55, 75, 88, 95];
  return (
    <div className="flex items-end gap-[3px] h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: inView ? `${h}%` : "4%",
            background: `rgba(59,130,246,${0.3 + (i / bars.length) * 0.55})`,
            transitionProperty: "height",
            transitionDuration: "900ms",
            transitionTimingFunction: SPRING,
            transitionDelay: inView ? `${delay + i * 45}ms` : "0ms",
          }}
        />
      ))}
    </div>
  );
}

/* ═══ PulsingRing ═══ */
function PulsingRing({ inView, delay = 0 }) {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-blue-400/30"
          style={{
            width: 24 + i * 16,
            height: 24 + i * 16,
            opacity: inView ? 1 : 0,
            transitionProperty: "opacity",
            transitionDuration: "600ms",
            transitionDelay: inView ? `${delay + i * 150}ms` : "0ms",
            animation: inView ? `ringPulse 2.5s ease-in-out ${i * 0.5}s infinite` : "none",
          }}
        />
      ))}
      <div className="relative w-4 h-4 rounded-full bg-blue-500"
        style={{ boxShadow: "0 0 12px rgba(59,130,246,0.6)" }} />
    </div>
  );
}

/* ═══ FlowLine ═══ */
function FlowLine({ inView, delay = 0 }) {
  return (
    <div className="relative w-full h-1 rounded-full overflow-hidden bg-white/10 mt-3">
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: inView ? "100%" : "0%",
          background: "linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)",
          transitionProperty: "width",
          transitionDuration: "1200ms",
          transitionTimingFunction: SPRING,
          transitionDelay: inView ? `${delay}ms` : "0ms",
        }}
      />
    </div>
  );
}

/* ═══ ScanLines overlay ═══ */
function ScanLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.05]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute w-full h-px bg-blue-300"
          style={{ top: `${20 + i * 28}%`, animation: `scanLine 4.5s ease-in-out ${i * 1.1}s infinite` }} />
      ))}
    </div>
  );
}

/* ═══ TAG chips ═══ */
function TagChip({ children, dark = false }) {
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold tracking-wide border ${
      dark
        ? "text-blue-300 bg-blue-400/10 border-blue-400/15"
        : "text-blue-700 bg-blue-600/10 border-blue-600/15"
    }`}>
      {children}
    </span>
  );
}

/* ═══ BENTO HERO ═══ */
function BentoHero({ inView }) {
  const dark = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const light = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.9)",
    boxShadow: "0 2px 40px rgba(37,99,235,0.08)",
  };
  const blue = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.14)",
  };

  const fadeIn = (delay = 0, extra = {}) => ({
    style: {
      transitionProperty: "opacity, transform",
      transitionDuration: "900ms",
      transitionTimingFunction: SPRING,
      transitionDelay: inView ? `${delay}ms` : "0ms",
      opacity: inView ? 1 : 0,
      ...extra,
    },
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-2 sm:gap-2.5 lg:gap-3">

        {/* ═══ CARD A · HERO (col 8) ─ slides from LEFT ══ */}
        <AnimCard
          inView={inView} fromX={-160} fromY={20} delay={0} duration={1600} scale={0.92}
          className="col-span-12 lg:col-span-8 relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{
            background: "linear-gradient(150deg,rgba(240,246,255,0.92) 0%,rgba(224,237,255,0.86) 50%,rgba(212,229,255,0.82) 100%)",
            ...light,
          }}
        >
          <FloatingOrbs />
          {/* subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "linear-gradient(rgba(37,99,235,1) 1px,transparent 1px),linear-gradient(90deg,rgba(37,99,235,1) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

          <div className="relative p-5 sm:p-7 lg:p-10 flex flex-col justify-between min-h-[280px] sm:min-h-[320px] lg:min-h-[420px]">
            {/* badge */}
            <div {...fadeIn(200, { transform: inView ? "translateY(0)" : "translateY(-20px)" })}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-[0.14em] uppercase text-blue-700 bg-blue-600/[0.09] border border-blue-600/[0.16]">
                <GlowDot size={5} />
                OncoTrace-AI · Open-Source · Not-for-Profit
              </span>
            </div>

            <div className="mt-auto pt-5">
              <div {...fadeIn(340, { transform: inView ? "translateY(0)" : "translateY(30px)" })}>
                <h1 className="text-[1.72rem] sm:text-[2.5rem] md:text-[2.9rem] lg:text-[3.15rem] font-[800] leading-[1.06] tracking-[-0.035em]">
                  <span className="text-neutral-900">Real-Time Precision</span>
                  <br />
                  <span style={{
                    background: "linear-gradient(135deg,#1d4ed8 0%,#3b82f6 55%,#60a5fa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Monitoring
                  </span>
                  <span className="text-neutral-900"> in Oncology</span>
                </h1>
              </div>

              <div {...fadeIn(480, { transform: inView ? "translateY(0)" : "translateY(20px)" })}>
                <p className="mt-3 text-[13px] sm:text-[14.5px] text-neutral-600 leading-[1.75] max-w-[34rem]">
                  AI-driven cancer intelligence across the entire disease lifecycle —
                  from early risk prediction using imaging data to continuous
                  progression monitoring powered by liquid biopsy.
                </p>
              </div>

              <div {...fadeIn(600, { transform: inView ? "translateY(0)" : "translateY(14px)" })}>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill color="blue">Early Risk Detection</Pill>
                  <Pill color="blue">24 / 7 Monitoring</Pill>
                  <Pill color="green">Open Source</Pill>
                  <Pill color="blue">Non-Invasive</Pill>
                </div>
              </div>
            </div>
          </div>
        </AnimCard>

        {/* ═══ CARD B · AI RISK (col 4) ─ slides from TOP-RIGHT ══ */}
        <AnimCard
          inView={inView} fromX={140} fromY={-80} delay={80} duration={1550} scale={0.88}
          className="col-span-12 lg:col-span-4 relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{
            background: "linear-gradient(145deg,rgba(15,28,65,0.97) 0%,rgba(23,37,84,0.95) 55%,rgba(10,18,45,0.97) 100%)",
            ...dark,
          }}
        >
          <FloatingOrbs dark />
          <ScanLines />

          <div className="relative h-full p-5 sm:p-6 lg:p-7 flex flex-col justify-between min-h-[240px] sm:min-h-[260px] lg:min-h-[420px]">
            <div className="flex items-start justify-between">
              <div {...fadeIn(400)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 border border-blue-400/20">
                  {/* scan icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 12h18M12 3v18" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </div>
              <Pill color="white">LIVE</Pill>
            </div>

            <div className="flex flex-col gap-4">
              <div {...fadeIn(520)}>
                <PulsingRing inView={inView} delay={560} />
              </div>
              <div {...fadeIn(560, { transform: inView ? "translateY(0)" : "translateY(12px)" })}>
                <FlowLine inView={inView} delay={620} />
              </div>
            </div>

            <div {...fadeIn(480, { transform: inView ? "translateY(0)" : "translateY(14px)" })}>
              <h3 className="text-[0.88rem] sm:text-[0.95rem] font-bold text-white mb-1.5">
                AI-Based Risk Prediction
              </h3>
              <p className="text-[11.5px] leading-[1.65] text-blue-200/65">
                Imaging data analysed by AI to surface early cancer risk signals with explainable confidence.
              </p>
            </div>
          </div>
        </AnimCard>

        {/* ═══ CARD C · LIQUID BIOPSY (col 6) ─ slides from BOTTOM-LEFT ══ */}
        <AnimCard
          inView={inView} fromX={-120} fromY={110} delay={160} duration={1450} scale={0.88}
          className="col-span-6 lg:col-span-4 relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{
            background: "linear-gradient(145deg,rgba(10,22,52,0.97) 0%,rgba(25,48,90,0.94) 100%)",
            ...dark,
          }}
        >
          {/* orbital rings deco */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4 opacity-[0.12]">
            <div className="relative w-24 h-24">
              {[0, 1].map((i) => (
                <div key={i}
                  className="absolute rounded-full border border-blue-400/50"
                  style={{
                    inset: i === 0 ? 0 : "24%",
                    animation: `spin ${i === 0 ? 16 : 10}s linear infinite ${i === 1 ? "reverse" : ""}`,
                  }}>
                  <div className={`absolute rounded-full bg-blue-${i === 0 ? "400" : "300"}`}
                    style={{ width: 5, height: 5, top: i === 0 ? -2.5 : "auto", bottom: i === 1 ? -2.5 : "auto", left: "50%", transform: "translateX(-50%)" }} />
                </div>
              ))}
            </div>
          </div>
          <FloatingOrbs dark />

          <div className="relative h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between min-h-[200px] sm:min-h-[220px]">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/15 border border-blue-400/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <Pill color="amber">R &amp; D</Pill>
            </div>

            <div>
              <h3 className="text-[0.83rem] sm:text-[0.9rem] font-bold text-white mb-1.5">Liquid Biopsy</h3>
              <p className="text-[11px] sm:text-[11.5px] leading-[1.65] text-blue-200/65 mb-3">
                Continuous cancer progression tracking through blood-based biomarker analysis.
              </p>
              <div {...fadeIn(700)}>
                <div className="flex flex-wrap gap-1.5">
                  {["ctDNA", "cfRNA", "CTC", "Proteins"].map((t) => (
                    <TagChip key={t} dark>{t}</TagChip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimCard>

        {/* ═══ CARD D · BIOMARKER TREND (col 6/4) ─ slides from BOTTOM ══ */}
        <AnimCard
          inView={inView} fromX={0} fromY={140} delay={240} duration={1400} scale={0.89}
          className="col-span-6 lg:col-span-4 rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{ background: "rgba(248,251,255,0.82)", ...light }}
        >
          <div className="p-4 sm:p-5 lg:p-6 min-h-[200px] sm:min-h-[220px] flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 border border-blue-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div {...fadeIn(580)}>
                <GlowDot color="#10b981" size={7} />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end pt-3">
              <h3 className="text-[0.83rem] sm:text-[0.9rem] font-bold text-neutral-800 mb-1">
                Biomarker Trends
              </h3>
              <p className="text-[11px] sm:text-[11.5px] leading-[1.65] text-neutral-500 mb-3">
                Longitudinal visualisation of biomarker levels across treatment cycles.
              </p>
              <WaveBar inView={inView} delay={480} />
            </div>
          </div>
        </AnimCard>

        {/* ═══ CARD E · REAL-TIME MONITORING (col 12/4) ─ slides from BOTTOM-RIGHT ══ */}
        <AnimCard
          inView={inView} fromX={140} fromY={100} delay={320} duration={1450} scale={0.88}
          className="col-span-12 lg:col-span-4 rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(29,62,175,0.94) 0%,rgba(37,99,235,0.91) 55%,rgba(56,116,239,0.91) 100%)",
            ...blue,
          }}
        >
          <FloatingOrbs dark />
          <div className="pointer-events-none absolute top-0 right-0 w-44 h-44 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle,rgba(147,197,253,0.5) 0%,transparent 70%)" }} />

          <div className="relative p-4 sm:p-5 lg:p-6 min-h-[200px] sm:min-h-[220px] flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 border border-white/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <Pill color="white">ACTIVE</Pill>
            </div>

            <div>
              <h3 className="text-[0.83rem] sm:text-[0.9rem] font-bold text-white mb-1.5">
                Real-Time Monitoring
              </h3>
              <p className="text-[11px] sm:text-[11.5px] leading-[1.65] text-blue-100/75 mb-3">
                Continuous tracking across the entire disease lifecycle with actionable insights as cancer evolves.
              </p>
              <div {...fadeIn(720)}>
                <div className="flex items-center gap-2">
                  <GlowDot color="#34d399" size={6} />
                  <span className="text-[10.5px] text-blue-100/75 font-medium">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </AnimCard>

        {/* ═══ CARD F · PRIVACY (col 6) ─ slides from LEFT ══ */}
        <AnimCard
          inView={inView} fromX={-140} fromY={50} delay={400} duration={1450} scale={0.88}
          className="col-span-6 lg:col-span-6 relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{
            background: "linear-gradient(145deg,rgba(10,22,52,0.97) 0%,rgba(20,35,80,0.95) 100%)",
            ...dark,
          }}
        >
          <div className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle,rgba(52,211,153,0.7) 0%,transparent 70%)" }} />
          <FloatingOrbs dark />

          <div className="relative p-4 sm:p-5 lg:p-6 min-h-[190px] sm:min-h-[210px] flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-400/20">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <Pill color="green">Compliant</Pill>
            </div>

            <div>
              <h3 className="text-[0.83rem] sm:text-[0.9rem] font-bold text-white mb-1.5">Privacy & Compliance</h3>
              <p className="text-[11px] sm:text-[11.5px] leading-[1.65] text-blue-200/65 mb-3">
                End-to-end de-identification, audit trails, and privacy-first data pipelines by design.
              </p>
              <div {...fadeIn(780)}>
                <div className="flex flex-wrap gap-1.5">
                  {["HIPAA", "GDPR", "ISO 27001", "SOC 2"].map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.1em] uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimCard>

        {/* ═══ CARD G · MISSION (col 6) ─ slides from RIGHT ══ */}
        <AnimCard
          inView={inView} fromX={140} fromY={50} delay={480} duration={1450} scale={0.88}
          className="col-span-6 lg:col-span-6 relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(29,62,175,0.96) 0%,rgba(37,99,235,0.93) 55%,rgba(59,130,246,0.91) 100%)",
            ...blue,
          }}
        >
          <FloatingOrbs dark />
          <div className="pointer-events-none absolute top-3 right-6 text-[6rem] leading-none font-black text-white/[0.04] select-none">"</div>

          <div className="relative p-4 sm:p-5 lg:p-6 min-h-[190px] sm:min-h-[210px] flex flex-col justify-between h-full">
            <p className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-blue-200/65">Our Mission</p>

            <div {...fadeIn(760, { transform: inView ? "translateY(0)" : "translateY(16px)" })}>
              <blockquote className="text-[12.5px] sm:text-[14px] font-[640] text-white leading-[1.62] tracking-[-0.01em]">
                Making precision oncology intelligence accessible, transparent,
                and globally collaborative — from first risk signal to real-time
                progression tracking.
              </blockquote>
            </div>

            <div {...fadeIn(860)}>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-[10px] font-bold text-blue-200/55 uppercase tracking-widest">OncoTrace-AI</span>
                <div className="h-px flex-1 bg-white/15" />
              </div>
            </div>
          </div>
        </AnimCard>

      </div>
    </div>
  );
}

/* ═══ ABOUT SECTION ═══ */
function AboutSection() {
  const [ref, inView] = useInView(0.1);
  const [pRef, pY] = useParallax(0.035);

  const slide = (fromX = 0, fromY = 0, delay = 0, dur = 1200) => ({
    style: {
      transitionProperty: "opacity, transform",
      transitionDuration: `${dur}ms`,
      transitionTimingFunction: SPRING,
      transitionDelay: inView ? `${delay}ms` : "0ms",
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0,0) scale(1)" : `translate(${fromX}px,${fromY}px) scale(0.95)`,
    },
  });

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(219,234,254,0.6) 0%, transparent 70%)", transform: "translate(30%,-30%)" }} />

      <div ref={ref} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={pRef} className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          style={{ transform: `translateY(${pY}px)` }}>

          {/* left col */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div {...slide(-70, 0, 0)}>
              <span className="inline-block text-[10px] font-bold tracking-[0.24em] uppercase text-blue-600 mb-3">
                About OncoTrace-AI
              </span>
              <h2 className="text-[1.5rem] sm:text-[1.85rem] lg:text-[2.1rem] font-[780] tracking-[-0.025em] leading-[1.12] text-neutral-900">
                From risk prediction<br className="hidden sm:block" /> to real-time tracking
              </h2>
              <div
                className="mt-5 h-[3px] w-10 rounded-full bg-blue-600 origin-left"
                style={{
                  transitionProperty: "transform",
                  transitionDuration: "1000ms",
                  transitionTimingFunction: SPRING,
                  transitionDelay: inView ? "320ms" : "0ms",
                  transform: inView ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </div>
          </div>

          {/* right col */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div {...slide(70, 0, 100)}>
              <p className="text-[14px] sm:text-[15px] text-neutral-600 leading-[1.78]">
                OncoTrace-AI brings together two complementary approaches — AI-based cancer risk prediction
                using imaging data, and liquid biopsy-powered real-time monitoring — into a unified system
                for continuous, data-driven oncology insights.
              </p>
            </div>

            <div {...slide(70, 0, 200)}>
              <div className="relative py-4 pl-5 rounded-r-2xl border-l-[3px] border-blue-600 bg-gradient-to-r from-blue-50/60 to-transparent">
                <p className="text-[14.5px] sm:text-[15.5px] font-[620] text-neutral-800 leading-[1.56] tracking-[-0.01em]">
                  We focus on data, monitoring, and intelligence — connecting prediction with progression
                  tracking to empower better clinical decision-making.
                </p>
              </div>
            </div>

            <div {...slide(70, 0, 300)}>
              <p className="text-[13.5px] sm:text-[14.5px] text-neutral-500 leading-[1.78]">
                Built as an open-source, not-for-profit initiative, OncoTrace-AI encourages global collaboration
                across research institutions, healthcare providers, and technology communities — ensuring
                oncology innovation remains accessible and transparent.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ═══ AUDIENCE SECTION ═══ */
function AudienceSection() {
  const [ref, inView] = useInView(0.08);

  const audiences = [
    {
      role: "Clinicians",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ),
      desc: "Predictive risk insights and real-time monitoring data for faster, more informed decisions.",
      entrance: { fromX: -80, fromY: 60 },
    },
    {
      role: "Patients",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      desc: "Clarity through early risk signals and transparent, continuous precision monitoring.",
      entrance: { fromX: -20, fromY: 90 },
    },
    {
      role: "Researchers",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      desc: "Open-source oncology tools to build, test, and collaborate across prediction and monitoring.",
      entrance: { fromX: 20, fromY: 90 },
    },
    {
      role: "Pharma",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      ),
      desc: "Longitudinal monitoring and continuous data across the full disease and treatment lifecycle.",
      entrance: { fromX: 80, fromY: 60 },
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-transparent via-blue-50/[0.08] to-transparent overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(219,234,254,0.7) 0%, transparent 70%)", transform: "translate(-50%, 40%)" }} />

      <div ref={ref} className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* heading */}
        <div
          style={{
            transitionProperty: "opacity, transform",
            transitionDuration: "1200ms",
            transitionTimingFunction: SPRING,
            transitionDelay: inView ? "0ms" : "0ms",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
          }}
          className="mb-10 lg:mb-12"
        >
          <span className="inline-block text-[10px] font-bold tracking-[0.24em] uppercase text-blue-600 mb-2">
            Who It's For
          </span>
          <h2 className="text-[1.5rem] sm:text-[1.85rem] lg:text-[2.1rem] font-[780] tracking-[-0.025em] leading-[1.12] max-w-lg text-neutral-900">
            Built for the entire oncology ecosystem
          </h2>
        </div>

        {/* cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {audiences.map((a, i) => (
            <div
              key={a.role}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-5 cursor-default"
              style={{
                transitionProperty: "opacity, transform, box-shadow, border-color",
                transitionDuration: `1300ms, 1300ms, 280ms, 280ms`,
                transitionTimingFunction: `${SPRING}, ${SPRING}, ease, ease`,
                transitionDelay: inView ? `${120 + i * 110}ms, ${120 + i * 110}ms, 0ms, 0ms` : "0ms",
                opacity: inView ? 1 : 0,
                transform: inView
                  ? "translate(0,0) scale(1)"
                  : `translate(${a.entrance.fromX}px,${a.entrance.fromY}px) scale(0.90)`,
                willChange: "opacity, transform",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(37,99,235,0.10)";
                e.currentTarget.style.borderColor = "rgba(147,197,253,0.8)";
                e.currentTarget.style.transform = "translateY(-4px) scale(1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.transform = "translate(0,0) scale(1)";
              }}
            >
              {/* left accent bar */}
              <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-blue-600 origin-top transition-transform duration-[350ms] ease-out scale-y-0 group-hover:scale-y-100" />

              <div className="flex items-start justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {a.icon}
                </div>
                <svg className="w-4 h-4 text-neutral-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300"
                  viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M5 10h10M10 6l4 4-4 4" />
                </svg>
              </div>

              <h3 className="text-[14.5px] sm:text-[15px] font-[720] text-neutral-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                {a.role}
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-neutral-500 leading-[1.65]">
                {a.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ═══ GLOBAL STYLES ═══ */
const globalStyles = `
  @keyframes orbFloat0 {
    0%,100%{ transform:translate(-50%,-50%) scale(1);     opacity:.6; }
    50%    { transform:translate(-50%,-50%) scale(1.18) translate(8px,-12px); opacity:.85; }
  }
  @keyframes orbFloat1 {
    0%,100%{ transform:translate(-50%,-50%) scale(1);     opacity:.5; }
    50%    { transform:translate(-50%,-50%) scale(1.22) translate(-10px,14px); opacity:.75; }
  }
  @keyframes orbFloat2 {
    0%,100%{ transform:translate(-50%,-50%) scale(1);     opacity:.55; }
    50%    { transform:translate(-50%,-50%) scale(1.15) translate(14px,-8px); opacity:.8; }
  }
  @keyframes pingAnim {
    0%,100%{ transform:scale(1);   opacity:.7; }
    60%    { transform:scale(2.4); opacity:0;  }
  }
  @keyframes ringPulse {
    0%,100%{ transform:scale(1);   opacity:.5; }
    50%    { transform:scale(1.12); opacity:.25; }
  }
  @keyframes scanLine {
    0%,100%{ opacity:0; transform:scaleX(.25) translateX(-60%); }
    15%,85%{ opacity:1; }
    50%    { transform:scaleX(1) translateX(0); }
  }
  @keyframes spin {
    from{ transform:rotate(0deg); }
    to  { transform:rotate(360deg); }
  }
  *{ font-optical-sizing:auto; }
`;

/* ═══ HERO SECTION (default export) ═══ */
export default function HeroSection({ onNavigate }) {
  const [heroRef, heroIn] = useInView(0.04);

  return (
    <div
      className="bg-[#fefefe] text-neutral-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}
    >
      <style>{globalStyles}</style>

      {/* ── HERO ── */}
      <section
        className="relative min-h-[100svh] flex items-center py-6 sm:py-8 lg:py-10"
        style={{
          backgroundImage: 'url("/ocean2.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* dark overlay */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(170deg,rgba(6,14,44,0.56) 0%,rgba(10,22,56,0.40) 45%,rgba(5,13,40,0.54) 100%)" }} />
        {/* blue tint */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 78% 56% at 70% 26%,rgba(37,99,235,0.20) 0%,transparent 64%),radial-gradient(ellipse 52% 46% at 16% 74%,rgba(59,130,246,0.13) 0%,transparent 58%)" }} />
        {/* glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 right-[-5%] w-[520px] h-[520px] rounded-full bg-blue-400/10 blur-[140px]" />
          <div className="absolute bottom-[12%] left-[-7%] w-[440px] h-[440px] rounded-full bg-blue-300/[0.07] blur-[120px]" />
        </div>
        {/* bottom dissolve into page bg */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0"
          style={{
            height: "48%",
            background: "linear-gradient(to bottom,transparent 0%,rgba(254,254,254,0.14) 28%,rgba(254,254,254,0.52) 50%,rgba(254,254,254,0.80) 66%,rgba(254,254,254,0.95) 82%,#fefefe 100%)",
          }} />

        <div ref={heroRef} className="relative z-10 w-full max-w-[1280px] mx-auto px-3 sm:px-5 lg:px-8">
          <BentoHero inView={heroIn} />
        </div>
      </section>

      <AboutSection />
      <AudienceSection />
    </div>
  );
}