import { useEffect, useRef, useState } from "react";

function useOnScreen(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, vis] = useOnScreen();
  return (
    <div ref={ref} className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease`,
      }}>
      {children}
    </div>
  );
}

export default function LiquidBiopsyMonitoring() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = "lb-inter-font";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const TECH = [
    { title: "Liquid Biopsy", body: "Non-invasive real-time biological signals from a simple blood draw, enabling continuous cancer monitoring." },
    { title: "Artificial Intelligence", body: "Analyzes complex datasets, identifies subtle patterns, and generates actionable clinical insights at scale." },
    { title: "Real-Time Monitoring", body: "Continuous longitudinal tracking of cancer progression and treatment response over time." },
  ];

  const AUDIENCE = [
    { label: "Clinicians", desc: "Predictive insights to guide treatment decisions." },
    { label: "Researchers", desc: "Open-source oncology tools and shared datasets." },
    { label: "Pharma", desc: "Continuous, non-invasive monitoring endpoints." },
    { label: "Innovators", desc: "An open, evolving oncology intelligence ecosystem." },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-white text-gray-900 antialiased overflow-x-hidden">
      <div className="h-[2px] bg-blue-600" />

      {/* NAV */}
      <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? "shadow-sm" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <span className="text-[12px] font-semibold tracking-[.08em] uppercase text-gray-800">Liquid Biopsy Monitoring</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-[10px] font-semibold tracking-[.12em] uppercase text-blue-600">R&D Phase</span>
          </div>
        </div>
      </nav>

      {/* HERO — side by side */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Research & Development</p>
              <h1 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-5">
                Liquid Biopsy-Based <span className="text-blue-600">Real-Time</span> Cancer Monitoring
              </h1>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => scroll("technology")}
                  className="px-6 py-2.5 bg-blue-600 text-white text-[11px] font-semibold tracking-[.1em] uppercase hover:bg-blue-700 transition-colors cursor-pointer">
                  Explore
                </button>
                <button onClick={() => scroll("mission")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-600 text-[11px] font-semibold tracking-[.1em] uppercase hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer">
                  Mission
                </button>
              </div>
            </div>
            <p className="text-[15px] text-gray-500 leading-[1.8]">
              A non-invasive approach to continuously monitor cancer progression and treatment response using liquid biopsy integrated with artificial intelligence — currently in active research and development.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 h-px bg-gradient-to-r from-blue-600 via-blue-200 to-transparent" />
      </section>

      {/* OVERVIEW — side by side */}
      <section id="overview" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Overview</p>
              <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-tight tracking-tight text-gray-900 mb-4">
                Continuous, Non-Invasive Monitoring
              </h2>
              <div className="w-12 h-[2px] bg-blue-600" />
            </div>
            <div className="text-[14px] text-gray-500 leading-[1.8] space-y-4">
              <p>Designed for cancer-positive patients — focusing on monitoring treatment response and tracking disease progression using non-invasive biological signals captured through liquid biopsy.</p>
              <p className="text-gray-400 text-[12px] border-l-2 border-blue-200 pl-4">Currently in R&D, with ongoing work to refine accuracy, scalability, and clinical integration.</p>
            </div>
          </div>
        </Reveal>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Key Technologies</p>
          <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold tracking-tight text-gray-900 mb-10">Three Pillars of Precision Monitoring</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 border-t-2 border-blue-600 border-l border-gray-200">
          {TECH.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border-r border-b border-gray-200 p-7 h-full hover:bg-blue-50/40 transition-colors group relative">
                <span className="absolute top-4 right-4 text-[48px] font-extrabold text-gray-100 group-hover:text-blue-100 transition-colors select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-blue-200 flex items-center justify-center mb-5 group-hover:border-blue-400 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2 tracking-tight">{t.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-[1.75]">{t.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* AUDIENCE */}
      <section id="audience" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 items-end mb-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Audience</p>
              <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold tracking-tight text-gray-900">Built for the Oncology Ecosystem</h2>
            </div>
            <p className="text-[14px] text-gray-500 leading-[1.8]">Serving every stakeholder in the cancer care continuum — from bedside to bench.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
          {AUDIENCE.map((a, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="bg-white p-6 h-full hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-[2px] bg-blue-500 group-hover:w-10 transition-all" />
                  <span className="text-[10px] font-semibold tracking-[.18em] uppercase text-blue-600">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">{a.label}</h3>
                <p className="text-[12px] text-gray-400 leading-[1.75]">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* PHILOSOPHY + OPEN SOURCE — side by side */}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-px bg-gray-200">
            <Reveal>
              <div className="bg-white p-8 h-full">
                <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Philosophy</p>
                <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-4">Data. Monitoring. Intelligence.</h3>
                <p className="text-[13px] text-gray-500 leading-[1.8]">
                  No treatments or prescriptions — purely data, monitoring, and intelligence. Combining AI with liquid biopsy to complement clinical expertise with continuous actionable insights.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="bg-white p-8 h-full">
                <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Open Source & Not-for-Profit</p>
                <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-4">Accessible. Transparent. Collaborative.</h3>
                <p className="text-[13px] text-gray-500 leading-[1.8]">
                  An open-source, not-for-profit initiative welcoming partnerships with research institutions, healthcare organizations, and technology developers worldwide.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section id="mission" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">Mission & Vision</p>
          <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold tracking-tight text-gray-900 mb-10">Toward Continuous Cancer Understanding</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
          <Reveal>
            <div className="bg-blue-600 p-8 h-full">
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-200 mb-3">Mission</p>
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Democratize Precision Monitoring</h3>
              <p className="text-[13px] text-blue-100 leading-[1.8]">
                Combine AI, liquid biopsy, and predictive modeling within an open framework — making advanced cancer monitoring accessible to all.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="bg-gray-900 p-8 h-full">
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-gray-500 mb-3">Vision</p>
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight">Cancer Continuously Understood</h3>
              <p className="text-[13px] text-gray-400 leading-[1.8]">
                A future where cancer is continuously understood through AI-driven prediction, supported by a global open-source ecosystem.
              </p>
            </div>
          </Reveal>
        </div>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <Reveal>
          <div className="bg-gray-900 p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold text-white leading-tight tracking-tight mb-3">
                  Join the effort to advance precision oncology
                </h2>
                <p className="text-[13px] text-gray-400 leading-[1.8]">
                  Cancer monitoring should be accessible, transparent, and collaborative. We welcome contributions worldwide.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <button className="px-6 py-2.5 bg-blue-600 text-white text-[11px] font-semibold tracking-[.1em] uppercase hover:bg-blue-500 transition-colors cursor-pointer">
                  Get Involved
                </button>
                <button className="px-6 py-2.5 border border-gray-700 text-gray-400 text-[11px] font-semibold tracking-[.1em] uppercase hover:border-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold tracking-[.08em] uppercase text-gray-800">Liquid Biopsy Monitoring</span>
            <span className="text-[9px] font-medium tracking-[.12em] uppercase text-gray-400 border border-gray-200 px-2 py-0.5">R&D</span>
          </div>
          <p className="text-[11px] text-gray-400">Open-source · Not-for-profit · Precision oncology</p>
        </div>
        <div className="h-[2px] bg-blue-600" />
      </footer>
    </div>
  );
}