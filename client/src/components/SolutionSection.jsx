// components/SolutionSection.tsx
import { useState, useEffect, useRef } from "react";

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";
const SMOOTH = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

/* ═══ useInView hook (self-contained) ═══ */
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

/* ═══ Data ═══ */
const capabilities = [
  {
    num: "01",
    title: "Liquid Biopsy Driven",
    desc: "Non-invasive capture of real-time biological signals — circulating tumor DNA, proteins, and critical biomarkers — enabling continuous cancer tracking.",
  },
  {
    num: "02",
    title: "AI-Powered Analysis",
    desc: "Artificial Intelligence processes complex biological data simultaneously, surfacing patterns invisible to traditional analysis methods.",
  },
  {
    num: "03",
    title: "Real-Time Monitoring",
    desc: "Continuous precision monitoring delivers actionable insights, tracking how cancer evolves and responds in real time.",
  },
  {
    num: "04",
    title: "Open Source Platform",
    desc: "Built as an open-source, not-for-profit platform ensuring accessibility, transparency, and global collaborative innovation.",
  },
];

const audiences = [
  { role: "Clinicians", desc: "Monitor cancer progression with real-time, AI-driven insights for faster clinical decisions." },
  { role: "Patients", desc: "Gain clarity and confidence through continuous, transparent precision monitoring." },
  { role: "Researchers", desc: "Access open-source tools and datasets for advancing oncology research globally." },
  { role: "Pharma Companies", desc: "Track treatment impact through precision monitoring and longitudinal data." },
];

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

  return [ref, offset];
}

/* ═══ Mouse Glow Hook ═══ */
function useMouseGlow() {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    const enter = () => setActive(true);
    const leave = () => setActive(false);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return [ref, pos, active];
}

/* ═══ Icons ═══ */
function DropletIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 014 4v1a3 3 0 012.5 5.1A3.5 3.5 0 0117 19H7a3.5 3.5 0 01-1.5-6.9A3 3 0 018 7V6a4 4 0 014-4z" />
      <path d="M12 2v20" /><path d="M8 10h2M14 14h2M8 14h1M15 10h1" />
    </svg>
  );
}
function PulseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
const capIcons = [DropletIcon, BrainIcon, PulseIcon, GlobeIcon];

/* ═══ Floating Particle Component ═══ */
function FloatingParticles({ count = 6, color = "blue" }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
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
          className="absolute rounded-full animate-pulse"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background:
              color === "blue"
                ? `rgba(59, 130, 246, ${0.1 + Math.random() * 0.15})`
                : `rgba(255,255,255,${0.05 + Math.random() * 0.1})`,
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
    <div className="grid grid-cols-12 grid-rows-[auto] gap-3 sm:gap-4 lg:gap-5 auto-rows-min">

      {/* Cell 1: Main Headline */}
      <div
        className={`col-span-12 lg:col-span-8 row-span-2 relative rounded-3xl overflow-hidden transition-all duration-[1800ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 -translate-x-[120px] translate-y-8 scale-[0.92]"
        }`}
        style={{
          ...t(0),
          background: "linear-gradient(155deg, #eff6ff 0%, #dbeafe 40%, #bfdbfe 100%)",
        }}
      >
        <FloatingParticles count={8} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(37,99,235,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 10% 90%, rgba(147,197,253,0.15) 0%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative p-8 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between min-h-[380px] lg:min-h-[440px]">
          <div
            className={`transition-all duration-[1200ms] ${
              inView ? "opacity-100 translate-y-0 blur-0" : "opacity-0 -translate-y-8 blur-sm"
            }`}
            style={t(300)}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10.5px] font-bold tracking-[0.14em] uppercase text-blue-700"
              style={{
                background: "rgba(37,99,235,0.08)",
                border: "1px solid rgba(37,99,235,0.18)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Open-Source &middot; Not-for-Profit
            </span>
          </div>

          <div className="mt-auto">
            <h2
              className={`text-[2.2rem] sm:text-5xl md:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem] font-extrabold leading-[1.05] tracking-[-0.04em] transition-all duration-[1800ms] ${
                inView
                  ? "opacity-100 translate-y-0 blur-0"
                  : "opacity-0 translate-y-16 blur-[3px]"
              }`}
              style={t(400)}
            >
              <span className="text-neutral-900 inline-block">Real-Time Precision</span>
              <br />
              <span
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Monitoring
              </span>
              <span className="text-neutral-900 inline-block"> in Oncology</span>
            </h2>

            <p
              className={`mt-4 text-[15px] sm:text-base text-neutral-500 leading-[1.75] max-w-[32rem] transition-all duration-[1600ms] ${
                inView ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-10 blur-[2px]"
              }`}
              style={t(600)}
            >
              Transforming cancer care through Liquid Biopsy and Artificial Intelligence —
              enabling continuous, real-time precision monitoring of cancer progression.
            </p>
          </div>
        </div>
      </div>

      {/* Cell 2: Image card */}
      <div
        className={`col-span-6 lg:col-span-4 relative rounded-3xl overflow-hidden transition-all duration-[1600ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 translate-x-[100px] -translate-y-[80px] scale-[0.88]"
        }`}
        style={{ ...t(200), minHeight: "200px" }}
      >
        <img
          src="/solution-bg.png"
          alt="Precision monitoring visualization"
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] ${
            inView ? "scale-100" : "scale-110"
          }`}
          style={{ transitionTimingFunction: SMOOTH }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.style.background =
              "linear-gradient(135deg, #1e3a5f 0%, #172554 100%)";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-900/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-[1200ms] ${
              inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-90"
            }`}
            style={{
              ...t(900),
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-white/90 tracking-wide">
              Live Monitoring Active
            </span>
          </div>
        </div>
      </div>

      {/* Cell 3: Orbital animation */}
      <div
        className={`col-span-6 lg:col-span-4 relative rounded-3xl overflow-hidden transition-all duration-[1600ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 translate-x-[80px] translate-y-[80px] scale-[0.85]"
        }`}
        style={{
          ...t(350),
          background: "linear-gradient(145deg, #1e3a5f 0%, #172554 50%, #0f172a 100%)",
          minHeight: "200px",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] transition-all duration-[2000ms] ${
              inView ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            style={t(600)}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: "1px solid rgba(96,165,250,0.2)" }}
            >
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{ animationDuration: "18s" }}
              >
                <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_14px_3px_rgba(96,165,250,0.5)]" />
              </div>
            </div>
            <div
              className="absolute inset-[18%] rounded-full"
              style={{ border: "1px solid rgba(96,165,250,0.15)" }}
            >
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{ animationDuration: "12s", animationDirection: "reverse" }}
              >
                <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-sky-300 shadow-md shadow-sky-400/30" />
              </div>
            </div>
            <div
              className="absolute inset-[38%] rounded-full"
              style={{ border: "1px solid rgba(96,165,250,0.25)" }}
            >
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{ animationDuration: "7s" }}
              >
                <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-blue-300/80" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className="absolute -inset-5 rounded-full bg-blue-500/15 blur-xl animate-pulse"
                  style={{ animationDuration: "3s" }}
                />
                <div className="h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_24px_6px_rgba(59,130,246,0.4)]" />
                <div
                  className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-blue-400/20"
                  style={{ animationDuration: "2.5s" }}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute bottom-4 left-4 transition-all duration-[1200ms] ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          }`}
          style={t(800)}
        >
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-300/70">
            AI Engine
          </span>
        </div>
        <div
          className={`absolute top-4 right-4 transition-all duration-[1200ms] ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
          style={t(850)}
        >
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400/50">
            Neural
          </span>
        </div>
      </div>

      {/* Cell 4: CTA buttons */}
      <div
        className={`col-span-12 sm:col-span-6 lg:col-span-4 rounded-3xl overflow-hidden transition-all duration-[1500ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 -translate-x-[100px] translate-y-[60px] scale-[0.9]"
        }`}
        style={{
          ...t(450),
          background: "linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)",
          border: "1px solid rgba(37,99,235,0.1)",
        }}
      >
        <div className="p-7 sm:p-8 flex flex-col justify-center h-full min-h-[180px]">
          <p
            className={`text-[13px] text-neutral-500 leading-[1.7] mb-5 transition-all duration-[1200ms] ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={t(650)}
          >
            Join the open oncology ecosystem shaping the future of precision monitoring.
          </p>
          <div
            className={`flex flex-wrap gap-2.5 transition-all duration-[1200ms] ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={t(750)}
          >
            <a
              href="#cta"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-[12.5px] font-bold overflow-hidden shadow-lg active:scale-[0.97] transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                boxShadow: "0 6px 20px rgba(37,99,235,0.28)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <span className="relative z-10">Book a Demo</span>
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 relative z-10"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" />
              </svg>
            </a>
            <a
              href="#solution-platform"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[12.5px] font-bold text-neutral-600 hover:text-blue-600 active:scale-[0.97] transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              Explore Platform
              <svg
                className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 11 11 5M11 11V5H5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Cell 5: Stats strip */}
      <div
        className={`col-span-12 sm:col-span-6 lg:col-span-5 rounded-3xl overflow-hidden transition-all duration-[1500ms] ${
          inView
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-[100px] scale-[0.88]"
        }`}
        style={{
          ...t(400),
          background: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
        }}
      >
        <FloatingParticles count={4} color="white" />
        <div className="relative p-7 sm:p-8 min-h-[180px] flex flex-col justify-between">
          <p
            className={`text-[10.5px] font-bold tracking-[0.2em] uppercase text-blue-200/70 mb-4 transition-all duration-1000 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            style={t(600)}
          >
            Key Metrics
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "200+", label: "Biomarkers Tracked" },
              { value: "24/7", label: "Continuous Monitoring" },
              { value: "100%", label: "Open Source" },
              { value: "Zero", label: "Invasive Procedures" },
            ].map((m, i) => (
              <div
                key={m.label}
                className={`transition-all duration-[1000ms] ${
                  inView
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-90"
                }`}
                style={t(700 + i * 120)}
              >
                <div className="text-xl sm:text-2xl font-black text-white leading-none tracking-tight">
                  {m.value}
                </div>
                <div className="text-[10.5px] text-blue-200/60 mt-1 font-medium tracking-wide">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cell 6: Biomarker tags */}
      <div
        className={`col-span-12 lg:col-span-3 rounded-3xl overflow-hidden transition-all duration-[1500ms] ${
          inView
            ? "opacity-100 translate-x-0 translate-y-0 scale-100"
            : "opacity-0 translate-x-[120px] translate-y-[40px] scale-[0.85]"
        }`}
        style={{
          ...t(500),
          background: "linear-gradient(160deg, #f8fafc 0%, #e0ecff 100%)",
          border: "1px solid rgba(37,99,235,0.08)",
        }}
      >
        <div className="p-6 sm:p-7 min-h-[180px] flex flex-col justify-between">
          <p
            className={`text-[10.5px] font-bold tracking-[0.2em] uppercase text-blue-600/60 mb-4 transition-all duration-1000 ${
              inView ? "opacity-100" : "opacity-0"
            }`}
            style={t(700)}
          >
            Tracking
          </p>
          <div className="flex flex-wrap gap-2">
            {["ctDNA", "Proteins", "Exosomes", "cfRNA", "Methylation", "CTC", "Metabolites"].map(
              (tag, i) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold tracking-wider transition-all duration-[900ms] hover:scale-105 hover:-translate-y-0.5 cursor-default ${
                    inView
                      ? "opacity-100 scale-100 translate-y-0 blur-0"
                      : "opacity-0 scale-75 translate-y-4 blur-[2px]"
                  }`}
                  style={{
                    ...t(800 + i * 80),
                    background: i === 0 ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.8)",
                    color: i === 0 ? "#1d4ed8" : "#64748b",
                    border: `1px solid ${i === 0 ? "rgba(37,99,235,0.2)" : "rgba(0,0,0,0.05)"}`,
                  }}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Cell 7: Bottom tagline */}
      <div
        className={`col-span-12 rounded-2xl overflow-hidden transition-all duration-[1400ms] ${
          inView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[60px] scale-[0.95]"
        }`}
        style={{
          ...t(650),
          background: "rgba(248,250,252,0.7)",
          border: "1px solid rgba(37,99,235,0.06)",
        }}
      >
        <div className="px-7 py-5 flex flex-wrap items-center justify-between gap-4">
          <p
            className={`text-[11.5px] text-neutral-400 leading-[1.7] max-w-[34rem] transition-all duration-[1200ms] ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
            style={t(800)}
          >
            An open-source platform built to make advanced oncology monitoring accessible,
            transparent, and collaborative for clinicians and researchers worldwide.
          </p>
          <div className="flex items-center gap-5">
            {["Liquid Biopsy", "AI Engine", "Precision Oncology"].map((tag, i) => (
              <span
                key={tag}
                className={`hidden sm:inline text-[10px] tracking-[0.12em] uppercase text-neutral-300 font-semibold transition-all duration-[1000ms] ${
                  inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                }`}
                style={t(900 + i * 120)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function SolutionSection() {
  const [heroRef, heroIn] = useInView(0.08);
  const [aboutRef, aboutIn] = useInView(0.12);
  const [capRef, capIn] = useInView(0.1);
  const [audRef, audIn] = useInView(0.1);
  const [mvRef, mvIn] = useInView(0.1);
  const [ctaRef, ctaIn] = useInView(0.1);

  const [parallaxAbout, aboutOffset] = useParallax(0.04);
  const [parallaxCap, capOffset] = useParallax(0.03);
  const [parallaxMv, mvOffset] = useParallax(0.035);

  const [glowRef, glowPos, glowActive] = useMouseGlow();

  const t = (inView, delay = 0) => ({
    transitionTimingFunction: SPRING,
    transitionDelay: inView ? `${delay}ms` : "0ms",
  });

  return (
    <div
      className="bg-white text-neutral-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Global keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes floatParticle0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(15px, -20px) scale(1.3); opacity: 0.6; }
          50% { transform: translate(-10px, -35px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(20px, -15px) scale(1.1); opacity: 0.5; }
        }
        @keyframes floatParticle1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          33% { transform: translate(-20px, -25px) scale(1.2); opacity: 0.5; }
          66% { transform: translate(15px, -40px) scale(0.9); opacity: 0.3; }
        }
        @keyframes floatParticle2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(25px, -30px) scale(1.4); opacity: 0.6; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.15); }
          50% { box-shadow: 0 0 40px rgba(59,130,246,0.3); }
        }
      `}</style>

      {/* ════════════════════════════════════════
          HERO — Bento Grid
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden min-h-[100dvh] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(219,234,254,0.50) 0%, transparent 65%), radial-gradient(ellipse 55% 50% at 20% 70%, rgba(191,219,254,0.30) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute -top-32 right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-200/20 blur-[140px] animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-blue-100/25 blur-[120px] animate-pulse"
            style={{ animationDuration: "10s" }}
          />
          <div
            className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full bg-sky-200/15 blur-[100px] animate-pulse"
            style={{ animationDuration: "6s" }}
          />
        </div>

        <div
          ref={heroRef}
          className="relative w-full max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-24 py-20 lg:py-24"
        >
          <BentoHero inView={heroIn} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          ABOUT
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/30 blur-[100px] rounded-full" />
        </div>

        <div
          ref={aboutRef}
          className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28 py-20 lg:py-28"
        >
          <div ref={parallaxAbout} className="grid lg:grid-cols-12 gap-8 lg:gap-14">
            {/* Left label */}
            <div
              className={`lg:col-span-4 transition-all duration-[1600ms] ${
                aboutIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-[100px]"
              }`}
              style={{
                ...t(aboutIn),
                transform: aboutIn ? `translateY(${aboutOffset}px)` : undefined,
              }}
            >
              <p
                className={`text-[11px] font-bold tracking-[0.25em] uppercase text-blue-600 mb-3 transition-all duration-[1000ms] ${
                  aboutIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
                }`}
                style={t(aboutIn, 100)}
              >
                About Shri-AI
              </p>
              <h2
                className={`text-[1.7rem] sm:text-3xl lg:text-[2.1rem] font-bold tracking-[-0.025em] leading-[1.15] transition-all duration-[1400ms] ${
                  aboutIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={t(aboutIn, 200)}
              >
                Redefining how cancer
                <br className="hidden lg:block" /> is monitored
              </h2>
              <div
                className={`mt-5 h-[3px] w-10 rounded-full bg-blue-600 origin-left transition-transform duration-[1200ms] ${
                  aboutIn ? "scale-x-100" : "scale-x-0"
                }`}
                style={t(aboutIn, 400)}
              />
            </div>

            {/* Right content */}
            <div
              className={`lg:col-span-7 lg:col-start-6 transition-all duration-[1600ms] ${
                aboutIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-[100px]"
              }`}
              style={t(aboutIn, 150)}
            >
              <p
                className={`text-neutral-600 text-[15px] sm:text-base leading-[1.9] transition-all duration-[1400ms] ${
                  aboutIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={t(aboutIn, 250)}
              >
                Shri-AI combines Liquid Biopsy with advanced Artificial Intelligence to deliver
                real-time precision monitoring in oncology. Our platform continuously tracks cancer
                progression through non-invasive data, allowing clinicians, researchers, and patients
                to understand the disease with greater clarity and accuracy.
              </p>

              {/* Pull quote */}
              <div
                className={`relative my-7 pl-6 py-3 rounded-r-lg transition-all duration-[1600ms] ${
                  aboutIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[60px]"
                }`}
                style={t(aboutIn, 350)}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 origin-top transition-transform duration-[1200ms] ${
                    aboutIn ? "scale-y-100" : "scale-y-0"
                  }`}
                  style={t(aboutIn, 500)}
                />
                <div
                  className={`absolute inset-0 rounded-r-lg transition-opacity duration-[1000ms] ${
                    aboutIn ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    ...t(aboutIn, 450),
                    background: "rgba(239,246,255,0.4)",
                  }}
                />
                <p className="relative text-[1.05rem] sm:text-lg font-semibold text-neutral-800 leading-[1.55] tracking-[-0.01em]">
                  We specialize in monitoring and analyzing cancer dynamics in real time —
                  empowering better decision-making through reliable, data-driven insights.
                </p>
              </div>

              <p
                className={`text-neutral-500 text-[15px] sm:text-base leading-[1.9] transition-all duration-[1400ms] ${
                  aboutIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={t(aboutIn, 450)}
              >
                Unlike traditional systems, we do not focus on treatment or medication. Built as an
                open-source, not-for-profit initiative, Shri-AI encourages global collaboration across
                research institutions, healthcare providers, and technology communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CAPABILITIES
          ════════════════════════════════════════ */}
      <section
        className="bg-neutral-950 text-white relative overflow-hidden"
        ref={glowRef}
      >
        {glowActive && (
          <div
            className="pointer-events-none absolute w-[500px] h-[500px] rounded-full transition-opacity duration-500"
            style={{
              left: glowPos.x - 250,
              top: glowPos.y - 250,
              background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
              opacity: glowActive ? 1 : 0,
            }}
          />
        )}

        <div className="pointer-events-none absolute top-0 left-1/3 w-[700px] h-[500px] bg-blue-600/[0.04] blur-[120px] rounded-full" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-600/[0.03] blur-[100px] rounded-full" />

        <div
          ref={capRef}
          className="relative max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28 py-20 lg:py-28"
        >
          <div ref={parallaxCap}>
            <div
              className={`mb-12 lg:mb-16 transition-all duration-[1500ms] ${
                capIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[40px]"
              }`}
              style={t(capIn)}
            >
              <p
                className={`text-[11px] font-bold tracking-[0.25em] uppercase text-blue-400 mb-3 transition-all duration-[1200ms] ${
                  capIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
                style={t(capIn, 100)}
              >
                Core Capabilities
              </p>
              <h2
                className={`text-[1.7rem] sm:text-3xl lg:text-[2.1rem] font-bold tracking-[-0.025em] leading-[1.15] max-w-md transition-all duration-[1400ms] ${
                  capIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={t(capIn, 200)}
              >
                Four foundational pillars
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
              {capabilities.map((item, i) => {
                const Icon = capIcons[i];
                const directions = [
                  { x: -120, y: -60, rot: -3 },
                  { x: 120, y: -60, rot: 3 },
                  { x: -120, y: 60, rot: 2 },
                  { x: 120, y: 60, rot: -2 },
                ];
                const dir = directions[i];

                return (
                  <div
                    key={item.num}
                    className={`group relative rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm p-7 lg:p-9 transition-all duration-[1600ms] hover:bg-neutral-800/60 hover:border-neutral-700 hover:shadow-2xl hover:shadow-blue-500/[0.08] hover:-translate-y-1.5 ${
                      capIn ? "opacity-100 blur-0" : "opacity-0 blur-[3px]"
                    }`}
                    style={{
                      ...t(capIn, 200 + i * 150),
                      transform: capIn
                        ? `translateX(0) translateY(${capOffset}px) rotate(0deg) scale(1)`
                        : `translateX(${dir.x}px) translateY(${dir.y}px) rotate(${dir.rot}deg) scale(0.85)`,
                    }}
                  >
                    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/[0.03] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex items-start justify-between mb-7">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 text-blue-400 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/25 group-hover:scale-110 ${
                          capIn ? "scale-100 rotate-0" : "scale-0 -rotate-45"
                        }`}
                        style={t(capIn, 400 + i * 150)}
                      >
                        <Icon />
                      </div>
                      <span
                        className={`text-[2.5rem] font-bold text-neutral-800/60 group-hover:text-neutral-700/40 transition-all duration-[1200ms] leading-none tracking-tighter font-mono select-none ${
                          capIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
                        }`}
                        style={t(capIn, 500 + i * 150)}
                      >
                        {item.num}
                      </span>
                    </div>

                    <h3
                      className={`text-[1.05rem] font-bold tracking-[-0.01em] mb-2.5 group-hover:text-blue-400 transition-all duration-[1200ms] ${
                        capIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={t(capIn, 500 + i * 150)}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-[13.5px] leading-[1.8] text-neutral-400 font-light transition-all duration-[1200ms] ${
                        capIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={t(capIn, 600 + i * 150)}
                    >
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHO IT'S FOR
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-blue-50/20 blur-[120px] rounded-full" />
        </div>

        <div
          ref={audRef}
          className="relative max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28 py-20 lg:py-28"
        >
          <div
            className={`mb-12 lg:mb-14 transition-all duration-[1500ms] ${
              audIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[50px]"
            }`}
            style={t(audIn)}
          >
            <p
              className={`text-[11px] font-bold tracking-[0.25em] uppercase text-blue-600 mb-3 transition-all duration-[1200ms] ${
                audIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`}
              style={t(audIn, 100)}
            >
              Who It&apos;s For
            </p>
            <h2
              className={`text-[1.7rem] sm:text-3xl lg:text-[2.1rem] font-bold tracking-[-0.025em] leading-[1.15] max-w-lg transition-all duration-[1400ms] ${
                audIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={t(audIn, 200)}
            >
              Built for the entire oncology ecosystem
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {audiences.map((a, i) => {
              const directions = [
                { x: -140, y: -80, rot: -4 },
                { x: 140, y: -80, rot: 4 },
                { x: -140, y: 80, rot: 3 },
                { x: 140, y: 80, rot: -3 },
              ];
              const dir = directions[i];

              return (
                <div
                  key={a.role}
                  className={`group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-7 lg:p-9 transition-all duration-[1600ms] hover:shadow-xl hover:shadow-blue-600/[0.07] hover:border-blue-100 hover:-translate-y-1.5 ${
                    audIn ? "opacity-100 blur-0" : "opacity-0 blur-[3px]"
                  }`}
                  style={{
                    ...t(audIn, 150 + i * 130),
                    transform: audIn
                      ? "translateX(0) translateY(0) rotate(0deg) scale(1)"
                      : `translateX(${dir.x}px) translateY(${dir.y}px) rotate(${dir.rot}deg) scale(0.82)`,
                  }}
                >
                  <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-transparent transition-all duration-700 rounded-2xl" />

                  <div className="relative flex items-start justify-between mb-3">
                    <h3
                      className={`text-lg font-bold tracking-[-0.01em] group-hover:text-blue-600 transition-all duration-[1200ms] ${
                        audIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                      }`}
                      style={t(audIn, 350 + i * 130)}
                    >
                      {a.role}
                    </h3>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 group-hover:bg-blue-50 transition-all duration-300 group-hover:scale-110">
                      <svg
                        className="w-4 h-4 text-neutral-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-300"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5" />
                      </svg>
                    </div>
                  </div>
                  <p
                    className={`relative text-[14px] text-neutral-500 leading-[1.75] font-light pr-4 transition-all duration-[1400ms] ${
                      audIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={t(audIn, 450 + i * 130)}
                  >
                    {a.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MISSION & VISION
          ════════════════════════════════════════ */}
      <section className="bg-neutral-50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-100/20 blur-[100px] rounded-full" />
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-50/30 blur-[80px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-indigo-50/20 blur-[90px] rounded-full" />
        </div>

        <div
          ref={mvRef}
          className="relative max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28 py-20 lg:py-28"
        >
          <div ref={parallaxMv} className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <div
              className={`transition-all duration-[1700ms] ${
                mvIn
                  ? "opacity-100 translate-x-0 blur-0"
                  : "opacity-0 -translate-x-[120px] blur-[3px]"
              }`}
              style={{
                ...t(mvIn, 0),
                transform: mvIn ? `translateX(0) translateY(${mvOffset}px)` : undefined,
              }}
            >
              <div
                className={`flex items-center gap-3 mb-5 transition-all duration-[1200ms] ${
                  mvIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
                style={t(mvIn, 100)}
              >
                <div
                  className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20"
                  style={{
                    animation: mvIn ? "pulseGlow 3s ease-in-out infinite" : "none",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-blue-600">
                  Mission
                </p>
              </div>
              <p
                className={`text-xl sm:text-2xl lg:text-[1.55rem] leading-[1.55] tracking-[-0.01em] text-neutral-700 transition-all duration-[1500ms] ${
                  mvIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={t(mvIn, 200)}
              >
                To democratize real-time precision monitoring in oncology by combining Liquid Biopsy
                and Artificial Intelligence into an{" "}
                <span className="text-blue-600 font-semibold">
                  open, accessible, and collaborative platform
                </span>
                .
              </p>
            </div>

            {/* Vision */}
            <div
              className={`transition-all duration-[1700ms] ${
                mvIn
                  ? "opacity-100 translate-x-0 blur-0"
                  : "opacity-0 translate-x-[120px] blur-[3px]"
              }`}
              style={{
                ...t(mvIn, 200),
                transform: mvIn
                  ? `translateX(0) translateY(${mvOffset * 0.7}px)`
                  : undefined,
              }}
            >
              <div
                className={`flex items-center gap-3 mb-5 transition-all duration-[1200ms] ${
                  mvIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
                style={t(mvIn, 300)}
              >
                <div
                  className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20"
                  style={{
                    animation: mvIn ? "pulseGlow 3s ease-in-out 1.5s infinite" : "none",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-blue-600">
                  Vision
                </p>
              </div>
              <p
                className={`text-xl sm:text-2xl lg:text-[1.55rem] leading-[1.55] tracking-[-0.01em] text-neutral-700 transition-all duration-[1500ms] ${
                  mvIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={t(mvIn, 400)}
              >
                To build a future where every cancer patient can be monitored continuously through{" "}
                <span className="text-blue-600 font-semibold">real-time precision systems</span> —
                powered by AI, driven by Liquid Biopsy, and supported by a global open-source
                ecosystem.
              </p>
            </div>
          </div>

          {/* Tagline strip */}
          <div
            className={`mt-14 pt-7 border-t transition-all duration-[1400ms] ${
              mvIn ? "opacity-100 border-neutral-200" : "opacity-0 border-transparent"
            }`}
            style={t(mvIn, 500)}
          >
            <div
              className={`absolute left-8 right-8 lg:left-20 lg:right-20 xl:left-28 xl:right-28 h-px origin-left transition-transform duration-[1800ms] ${
                mvIn ? "scale-x-100" : "scale-x-0"
              }`}
              style={{
                ...t(mvIn, 500),
                background:
                  "linear-gradient(90deg, transparent, rgba(37,99,235,0.15), transparent)",
              }}
            />

            <div className="flex flex-wrap gap-x-8 gap-y-2.5">
              {[
                "Liquid Biopsy meets AI",
                "Track Cancer. Don't Guess.",
                "Precision Oncology, In Real Time",
                "Open Source Intelligence",
              ].map((tag, i) => (
                <span
                  key={tag}
                  className={`text-[11px] tracking-[0.1em] uppercase text-neutral-400 font-semibold transition-all duration-[1000ms] ${
                    mvIn
                      ? "opacity-100 translate-y-0 blur-0"
                      : "opacity-0 translate-y-6 blur-[2px]"
                  }`}
                  style={t(mvIn, 600 + i * 120)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SOLUTION CTA
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-0 w-[50%] h-[60%] bg-gradient-to-tr from-blue-50/50 to-transparent" />
          <div
            className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full bg-blue-100/25 blur-[100px] animate-pulse"
            style={{ animationDuration: "7s" }}
          />
          <div className="absolute top-20 right-10 w-[300px] h-[300px] rounded-full bg-blue-50/20 blur-[80px]" />
        </div>

        <div
          ref={ctaRef}
          className="relative max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28 py-24 lg:py-32"
        >
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            {/* Text */}
            <div
              className={`lg:col-span-7 transition-all duration-[1800ms] ${
                ctaIn
                  ? "opacity-100 translate-x-0 translate-y-0 blur-0"
                  : "opacity-0 -translate-x-[100px] translate-y-[40px] blur-[3px]"
              }`}
              style={t(ctaIn)}
            >
              <h2 className="text-[1.8rem] sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
                <span
                  className={`inline-block transition-all duration-[1400ms] ${
                    ctaIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={t(ctaIn, 100)}
                >
                  Ready to explore
                </span>
                <br className="hidden sm:block" />{" "}
                <span
                  className={`inline-block transition-all duration-[1400ms] ${
                    ctaIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={t(ctaIn, 250)}
                >
                  <span className="text-blue-600">real-time</span> cancer monitoring?
                </span>
              </h2>
              <p
                className={`mt-5 text-neutral-500 text-base sm:text-lg leading-[1.65] max-w-lg transition-all duration-[1500ms] ${
                  ctaIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={t(ctaIn, 350)}
              >
                Join the open oncology ecosystem. Collaborate with researchers, clinicians, and
                institutions shaping the future of precision monitoring.
              </p>
            </div>

            {/* Buttons */}
            <div
              className={`lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start gap-3.5 transition-all duration-[1600ms] ${
                ctaIn
                  ? "opacity-100 translate-x-0 translate-y-0"
                  : "opacity-0 translate-x-[100px] translate-y-[30px]"
              }`}
              style={t(ctaIn, 300)}
            >
              <a
                href="#cta"
                className={`group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-blue-600 text-white text-[13px] font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-700/25 active:scale-[0.97] transition-all duration-300 whitespace-nowrap hover:-translate-y-1 ${
                  ctaIn
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-6 scale-90"
                }`}
                style={t(ctaIn, 450)}
              >
                Experience Real-Time Monitoring
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8h9M8.5 3.5 13 8l-4.5 4.5" />
                </svg>
              </a>
              <a
                href="#team"
                className={`inline-flex items-center px-7 py-4 rounded-full border border-neutral-200 text-[13px] font-semibold text-neutral-600 hover:border-blue-200 hover:text-blue-600 active:scale-[0.97] transition-all duration-300 whitespace-nowrap hover:-translate-y-1 ${
                  ctaIn
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-6 scale-90"
                }`}
                style={t(ctaIn, 550)}
              >
                Collaborate with Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}