import { useState, useEffect, useRef } from "react";

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";

/* ═══ useInView hook ═══ */
function useInView(threshold = 0.15) {
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
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ═══ Parallax Hook ═══ */
function useParallax(speed = 0.1) {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        setOffset(center * speed);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);
  return [ref, offset] ;
}

/* ═══ Data ═══ */
const audiences = [
  { role: "Clinicians", desc: "Access predictive risk insights and real-time monitoring data for faster, more informed clinical decisions." },
  { role: "Patients", desc: "Gain clarity from early risk prediction through continuous, transparent precision monitoring of cancer progression." },
  { role: "Researchers", desc: "Build, test, and collaborate using open-source oncology tools spanning prediction and real-time monitoring." },
  { role: "Pharma Companies", desc: "Track treatment effectiveness through continuous monitoring and longitudinal data across the disease lifecycle." },
];

/* ═══ Icons ═══ */
function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18M12 3v18" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function DropletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

/* ═══ Floating Particle Component ═══ */
function FloatingParticles({ count = 6, color = "blue" }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 12,
    delay: Math.random() * 5,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background:
              color === "blue"
                ? `rgba(59, 130, 246, ${0.08 + Math.random() * 0.12})`
                : `rgba(255,255,255,${0.04 + Math.random() * 0.08})`,
            animation: `floatParticle${p.id % 3} ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══ Bento Hero Section ═══ */
function BentoHero({ inView }) {
  const t = (delay = 0) => ({
    transitionTimingFunction: SPRING,
    transitionDelay: inView ? `${delay}ms` : "0ms",
  });

  return (
    <div className="grid grid-cols-12 gap-2.5 sm:gap-3 lg:gap-3.5 auto-rows-min">
      {/* Cell 1: Main Headline */}
      <div
        className={`col-span-12 lg:col-span-8 row-span-2 relative rounded-[1.75rem] overflow-hidden transition-all duration-[1600ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 -translate-x-[100px] translate-y-6 scale-[0.94]"
        }`}
        style={{
          ...t(0),
          background: "linear-gradient(155deg, #f2f7ff 0%, #e4efff 40%, #d8e6ff 100%)",
        }}
      >
        <FloatingParticles count={6} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[340px] lg:min-h-[380px]">
          <div
            className={`transition-all duration-[1100ms] ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
            }`}
            style={t(200)}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase text-blue-700 bg-blue-600/[0.07] border border-blue-600/[0.14]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              OncoTrace-AI · Open-Source · Not-for-Profit
            </span>
          </div>
          <div className="mt-auto">
            <h1
              className={`text-[1.95rem] sm:text-[2.6rem] md:text-[2.9rem] lg:text-[3.1rem] font-[800] leading-[1.06] tracking-[-0.035em] transition-all duration-[1600ms] ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={t(300)}
            >
              <span className="text-neutral-900">Real-Time Precision</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Monitoring
              </span>
              <span className="text-neutral-900"> in Oncology</span>
            </h1>
            <p
              className={`mt-3.5 text-[14px] sm:text-[15px] text-neutral-600 leading-[1.7] max-w-[32rem] transition-all duration-[1400ms] ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={t(450)}
            >
              AI-driven cancer intelligence across the entire disease lifecycle — from
              predicting breast cancer risk using imaging data to real-time progression
              monitoring powered by Liquid Biopsy.
            </p>
          </div>
        </div>
      </div>

      {/* Cell 2: AI Risk Prediction */}
      <div
        className={`col-span-6 lg:col-span-4 relative rounded-[1.75rem] overflow-hidden transition-all duration-[1400ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 translate-x-[80px] -translate-y-[60px] scale-[0.9]"
        }`}
        style={{
          ...t(150),
          background: "linear-gradient(145deg, #1e3a5f 0%, #172554 50%, #0f172a 100%)",
        }}
      >
        <FloatingParticles count={4} color="white" />
        <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between min-h-[175px] sm:min-h-[185px]">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-300 transition-all duration-[1000ms] ${
                inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
              style={t(400)}
            >
              <ScanIcon />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em] uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 transition-all duration-[900ms] ${
                  inView ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
                style={t(500)}
              >
                LIVE
              </span>
              <span className="text-[1.75rem] font-bold text-white/10 leading-none font-mono select-none">01</span>
            </div>
          </div>
          <div>
            <h3 className="text-[0.9rem] font-bold text-white mb-1.5">AI-Based Risk Prediction</h3>
            <p className="text-[11.5px] leading-[1.65] text-blue-200/65">
              X-ray imaging + AI to predict breast cancer risk over 5 years — live.
            </p>
          </div>
        </div>
      </div>

      {/* Cell 3: Liquid Biopsy */}
      <div
        className={`col-span-6 lg:col-span-4 relative rounded-[1.75rem] overflow-hidden transition-all duration-[1400ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 translate-x-[70px] translate-y-[70px] scale-[0.88]"
        }`}
        style={{
          ...t(250),
          background: "linear-gradient(145deg, #0c1a3a 0%, #1e3a5f 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.18]">
          <div className="relative w-[100px] h-[100px]">
            <div className="absolute inset-0 rounded-full border border-blue-400/30">
              <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: "18s" }}>
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-blue-400" />
              </div>
            </div>
            <div className="absolute inset-[22%] rounded-full border border-blue-300/25">
              <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: "12s", animationDirection: "reverse" }}>
                <div className="absolute -bottom-[2.5px] left-1/2 -translate-x-1/2 h-1.25 w-1.25 rounded-full bg-sky-300" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-full p-5 sm:p-6 flex flex-col justify-between min-h-[175px] sm:min-h-[185px]">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-300 transition-all duration-[1000ms] ${
                inView ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
              style={t(450)}
            >
              <DropletIcon />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em] uppercase bg-amber-500/15 text-amber-300 border border-amber-500/22 transition-all duration-[900ms] ${
                  inView ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
                style={t(550)}
              >
                R&D
              </span>
              <span className="text-[1.75rem] font-bold text-white/10 leading-none font-mono select-none">02</span>
            </div>
          </div>
          <div>
            <h3 className="text-[0.9rem] font-bold text-white mb-1.5">Liquid Biopsy Monitoring</h3>
            <p className="text-[11.5px] leading-[1.65] text-blue-200/65">
              ctDNA, proteins & biomarkers for continuous cancer progression tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Cell 4: Real-Time Monitoring */}
      <div
        className={`col-span-12 sm:col-span-6 lg:col-span-4 rounded-[1.75rem] overflow-hidden transition-all duration-[1300ms] ${
          inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[50px] scale-[0.92]"
        }`}
        style={{
          ...t(320),
          background: "linear-gradient(145deg, #ffffff 0%, #f3f8ff 100%)",
          border: "1px solid rgba(37,99,235,0.09)",
        }}
      >
        <div className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-[175px]">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <PulseIcon />
            </div>
            <span className="text-[1.75rem] font-bold text-blue-100 leading-none font-mono select-none">03</span>
          </div>
          <div className="pt-3">
            <h3 className="text-[0.9rem] font-bold text-neutral-800 mb-1.5">Real-Time Precision Monitoring</h3>
            <p className="text-[11.5px] leading-[1.65] text-neutral-500">
              Continuous tracking across the entire disease lifecycle — actionable insights as cancer evolves.
            </p>
          </div>
        </div>
      </div>

      {/* Cell 5: Stats */}
      <div
        className={`col-span-12 sm:col-span-6 lg:col-span-5 rounded-[1.75rem] overflow-hidden transition-all duration-[1300ms] ${
          inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[70px] scale-[0.9]"
        }`}
        style={{
          ...t(280),
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
        }}
      >
        <FloatingParticles count={3} color="white" />
        <div className="relative p-5 sm:p-6 min-h-[175px] flex flex-col justify-between">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200/75 mb-3">
            Platform at a Glance
          </p>
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { value: "5yr", label: "Risk Window" },
              { value: "24/7", label: "Monitoring" },
              { value: "100%", label: "Open Source" },
              { value: "Zero", label: "Invasive" },
            ].map((m, i) => (
              <div
                key={m.label}
                className={`transition-all duration-[900ms] ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={t(420 + i * 90)}
              >
                <div className="text-[1.35rem] font-black text-white leading-none tracking-tight">{m.value}</div>
                <div className="text-[10px] text-blue-200/65 mt-0.5 font-medium">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cell 6: Open Source */}
      <div
        className={`col-span-12 lg:col-span-3 rounded-[1.75rem] overflow-hidden transition-all duration-[1300ms] ${
          inView ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-[90px] scale-[0.88]"
        }`}
        style={{
          ...t(380),
          background: "linear-gradient(160deg, #f9fbff 0%, #e8f0ff 100%)",
          border: "1px solid rgba(37,99,235,0.07)",
        }}
      >
        <div className="p-5 sm:p-6 min-h-[175px] flex flex-col justify-between">
          <div className="flex items-start justify-between mb-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <GlobeIcon />
            </div>
            <span className="text-[1.75rem] font-bold text-blue-100 leading-none font-mono select-none">04</span>
          </div>
          <div>
            <h3 className="text-[0.875rem] font-bold text-neutral-800 mb-1">Open Source Platform</h3>
            <p className="text-[11px] leading-[1.6] text-neutral-500 mb-3">
              Not-for-profit, open & globally collaborative.
            </p>
            <div className="flex flex-wrap gap-1.25">
              {["X-ray AI", "ctDNA", "Proteins", "cfRNA", "CTC"].map((tag, i) => (
                <span
                  key={tag}
                  className={`px-2 py-0.75 rounded-lg text-[9.5px] font-bold tracking-wide transition-all duration-[800ms] ${
                    inView ? "opacity-100 scale-100" : "opacity-0 scale-80"
                  }`}
                  style={{
                    ...t(600 + i * 50),
                    background: i === 0 ? "rgba(37,99,235,0.11)" : "rgba(255,255,255,0.85)",
                    color: i === 0 ? "#1d4ed8" : "#64748b",
                    border: `1px solid ${i === 0 ? "rgba(37,99,235,0.18)" : "rgba(0,0,0,0.045)"}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tagline - compact */}
      <div
        className={`col-span-12 rounded-2xl overflow-hidden transition-all duration-[1200ms] ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[40px]"
        }`}
        style={{
          ...t(520),
          background: "rgba(248,250,252,0.9)",
          border: "1px solid rgba(37,99,235,0.055)",
        }}
      >
        <div className="px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-neutral-500 leading-[1.65] max-w-[38rem]">
            An open-source platform connecting AI-based risk prediction with liquid biopsy-powered monitoring — making precision oncology accessible, transparent, and collaborative worldwide.
          </p>
          <div className="hidden md:flex items-center gap-4 text-[9.5px] tracking-[0.11em] uppercase text-neutral-400 font-semibold">
            <span>AI Prediction</span>
            <span>•</span>
            <span>Liquid Biopsy</span>
            <span>•</span>
            <span>Precision Oncology</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [heroRef, heroIn] = useInView(0.08);
  const [aboutRef, aboutIn] = useInView(0.12);
  const [audRef, audIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  const [parallaxAbout, aboutOffset] = useParallax(0.04);

  const t = (inView, delay = 0) => ({
    transitionTimingFunction: SPRING,
    transitionDelay: inView ? `${delay}ms` : "0ms",
  });

  return (
    <div
      className="bg-[#fefefe] text-neutral-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Global styles */}
      <style>{`
        @keyframes floatParticle0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.28; }
          25% { transform: translate(12px, -16px) scale(1.25); opacity: 0.5; }
          50% { transform: translate(-8px, -28px) scale(0.85); opacity: 0.35; }
          75% { transform: translate(16px, -12px) scale(1.1); opacity: 0.42; }
        }
        @keyframes floatParticle1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.22; }
          33% { transform: translate(-16px, -20px) scale(1.18); opacity: 0.44; }
          66% { transform: translate(12px, -32px) scale(0.92); opacity: 0.28; }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.32; }
          50% { transform: translate(20px, -24px) scale(1.32); opacity: 0.52; }
        }
        * { font-optical-sizing: auto; }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center py-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 75% 55% at 72% 28%, rgba(219,234,254,0.45) 0%, transparent 62%), radial-gradient(ellipse 50% 45% at 18% 72%, rgba(191,219,254,0.28) 0%, transparent 58%)",
            }}
          />
          <div className="absolute -top-24 right-[-4%] w-[520px] h-[520px] rounded-full bg-blue-200/18 blur-[120px]" />
          <div className="absolute bottom-[-12%] left-[-6%] w-[440px] h-[440px] rounded-full bg-blue-100/22 blur-[105px]" />
        </div>
        <div ref={heroRef} className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <BentoHero inView={heroIn} />
        </div>
      </section>

      {/* ABOUT - Compact */}
      <section className="relative py-14 sm:py-16 lg:py-20">
        <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-blue-50/25 blur-[90px] rounded-full pointer-events-none" />
        <div ref={aboutRef} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={parallaxAbout} className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            <div
              className={`lg:col-span-4 transition-all duration-[1400ms] ${
                aboutIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
              }`}
              style={{ ...t(aboutIn), transform: aboutIn ? `translateY(${aboutOffset * 0.6}px)` : undefined }}
            >
              <p className={`text-[10.5px] font-bold tracking-[0.22em] uppercase text-blue-600 mb-2.5 transition-all duration-900 ${aboutIn ? "opacity-100" : "opacity-0"}`} style={t(aboutIn, 80)}>
                About OncoTrace-AI
              </p>
              <h2 className={`text-[1.55rem] sm:text-[1.85rem] lg:text-[2rem] font-[750] tracking-[-0.022em] leading-[1.14] transition-all duration-[1200ms] ${aboutIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={t(aboutIn, 150)}>
                From risk prediction
                <br className="hidden lg:block" /> to real-time tracking
              </h2>
              <div className={`mt-4 h-[2.5px] w-9 rounded-full bg-blue-600 origin-left transition-transform duration-[1000ms] ${aboutIn ? "scale-x-100" : "scale-x-0"}`} style={t(aboutIn, 300)} />
            </div>
            
            <div className={`lg:col-span-8 transition-all duration-[1400ms] ${aboutIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`} style={t(aboutIn, 120)}>
              <div className="space-y-4">
                <p className={`text-neutral-600 text-[14.5px] leading-[1.75] transition-all duration-[1200ms] ${aboutIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={t(aboutIn, 200)}>
                  OncoTrace-AI is a platform designed to enable AI-driven cancer intelligence across the entire disease lifecycle. It brings together two complementary approaches — AI-based cancer risk prediction using imaging data, and liquid biopsy-powered real-time monitoring — into a unified system for continuous, data-driven insights in oncology.
                </p>
                
                <div className={`relative py-3 pl-5 rounded-r-xl border-l-[2.5px] border-blue-600 bg-blue-50/40 transition-all duration-[1300ms] ${aboutIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={t(aboutIn, 280)}>
                  <p className="text-[15px] font-[600] text-neutral-800 leading-[1.5] tracking-[-0.008em]">
                    We focus on data, monitoring, and intelligence — connecting prediction with progression tracking to empower better decision-making through accurate, real-time insights.
                  </p>
                </div>
                
                <p className={`text-neutral-500 text-[14.5px] leading-[1.75] transition-all duration-[1200ms] ${aboutIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={t(aboutIn, 360)}>
                  We do not provide treatments or prescribe medications. Built as an open-source, not-for-profit initiative, OncoTrace-AI encourages global collaboration across research institutions, healthcare providers, and technology communities — ensuring innovation in oncology is accessible, transparent, and collaborative.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR - Compact Grid */}
      <section className="relative py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-transparent via-blue-[2]/10 to-transparent">
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[340px] bg-blue-50/18 blur-[100px] rounded-full pointer-events-none" />
        <div ref={audRef} className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`mb-8 lg:mb-10 transition-all duration-[1300ms] ${audIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={t(audIn)}>
            <p className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-blue-600 mb-2">Who It&apos;s For</p>
            <h2 className="text-[1.55rem] sm:text-[1.85rem] lg:text-[2rem] font-[750] tracking-[-0.022em] leading-[1.14] max-w-lg">
              Built for the entire oncology ecosystem
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {audiences.map((a, i) => (
              <div
                key={a.role}
                className={`group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-5 transition-all duration-[1200ms] hover:shadow-lg hover:shadow-blue-600/[0.06] hover:border-blue-200/80 hover:-translate-y-1 ${
                  audIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.94]"
                }`}
                style={t(audIn, 120 + i * 90)}
              >
                <div className="absolute left-0 top-6 bottom-6 w-[2.5px] rounded-full bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-400 origin-top" />
                <div className="flex items-start justify-between mb-2.5">
                  <h3 className="text-[15.5px] font-[700] tracking-[-0.01em] group-hover:text-blue-600 transition-colors">
                    {a.role}
                  </h3>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 group-hover:bg-blue-50 transition-colors">
                    <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M5 10h10M10 6l4 4-4 4" />
                    </svg>
                  </div>
                </div>
                <p className="text-[13px] text-neutral-600 leading-[1.65] font-[450]">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Compact */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[42%] h-[55%] bg-gradient-to-tr from-blue-50/40 to-transparent" />
          <div className="absolute -bottom-20 -left-16 w-[420px] h-[420px] rounded-full bg-blue-100/20 blur-[90px]" />
        </div>
        
        <div ref={ctaRef} className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
              <div className={`transition-all duration-[1500ms] ${ctaIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={t(ctaIn)}>
                <h2 className="text-[1.75rem] sm:text-[2.15rem] lg:text-[2.5rem] font-[800] tracking-[-0.028em] leading-[1.08] mb-4">
                  Ready to explore{" "}
                  <span className="text-blue-600">precision</span>
                  <br className="hidden sm:block" />
                  cancer intelligence?
                </h2>
                <p className="text-neutral-600 text-[15px] leading-[1.68] max-w-[28rem]">
                  Join the open oncology ecosystem. From AI-based risk prediction to real-time monitoring — collaborate with researchers, clinicians, and institutions shaping precision oncology.
                </p>
              </div>
              
              <div className={`flex flex-col sm:flex-row lg:flex-col gap-3 transition-all duration-[1400ms] ${ctaIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={t(ctaIn, 200)}>
                <a
                  href="#explore"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 text-white text-[13.5px] font-[600] shadow-lg shadow-blue-600/18 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-700/22 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  Explore OncoTrace-AI
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <path d="M4 8h8M9 4l4 4-4 4" />
                  </svg>
                </a>
                <a
                  href="#collaborate"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-full border-[1.5px] border-neutral-200 text-[13.5px] font-[600] text-neutral-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                >
                  Collaborate with Us
                </a>
              </div>
            </div>
            
            {/* Mini footer bar */}
            <div className="mt-12 pt-6 border-t border-neutral-200/60 flex flex-wrap items-center justify-between gap-4 text-[11.5px] text-neutral-500">
              <p>© 2025 OncoTrace-AI • Open-source • Not-for-profit</p>
              <div className="flex items-center gap-5 font-medium">
                <span className="opacity-60">Prediction</span>
                <span className="opacity-30">•</span>
                <span className="opacity-60">Monitoring</span>
                <span className="opacity-30">•</span>
                <span className="opacity-60">Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}