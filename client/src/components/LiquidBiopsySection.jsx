import { useEffect, useRef, useState } from "react";

function useOnScreen(threshold = 0.12) {
  const ref = useRef (null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({
  children,
  className = "",
  delay = 0,

}) {
  const [ref, vis] = useOnScreen();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease`,
      }}
    >
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
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scroll = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const AUDIENCE = [
    {
      label: "Clinicians",
      desc: "Predictive insights to guide treatment decisions.",
    },
    {
      label: "Researchers",
      desc: "Open-source oncology tools and shared datasets.",
    },
    {
      label: "Pharma",
      desc: "Continuous, non-invasive monitoring endpoints.",
    },
    {
      label: "Open source contributors",
      desc: "An open, evolving oncology intelligence ecosystem.",
    },
  ];

  return (
    <div
      style={{ fontFamily: "'Inter', sans-serif" }}
      className="bg-white text-gray-900 antialiased overflow-x-hidden"
    >
      <div className="h-[2px] bg-blue-600" />

      {/* NAV */}
      <nav
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <span className="text-[12px] font-semibold tracking-[.08em] uppercase text-gray-800">
            Liquid Biopsy Monitoring
          </span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-[10px] font-semibold tracking-[.12em] uppercase text-blue-600">
              R&amp;D Phase
            </span>
          </div>
        </div>
      </nav>

      {/* HERO — side by side with image */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: text content */}
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">
                Research &amp; Development
              </p>
              <h1 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight text-gray-900 mb-5">
                Liquid Biopsy-Based{" "}
                <span className="text-blue-600">Real-Time</span> Cancer
                Monitoring
              </h1>
              <p className="text-[15px] text-gray-500 leading-[1.8] mb-6">
                A non-invasive approach to continuously monitor cancer
                progression and treatment response using liquid biopsy
                integrated with artificial intelligence — currently in active
                research and development.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => scroll("technology")}
                  className="px-6 py-2.5 bg-blue-600 text-white text-[11px] font-semibold tracking-[.1em] uppercase hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Explore
                </button>
                <button
                  onClick={() => scroll("mission")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-600 text-[11px] font-semibold tracking-[.1em] uppercase hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Mission
                </button>
              </div>
            </div>

            {/* Right: hero image — sharp edges (no rounded corners) */}
            <div className="relative w-full overflow-hidden group">
              {/* Sharp corner accent lines */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-400 z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-400 z-20 pointer-events-none" />
              {/* Blue gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="/liquid-biopsy-hero.png"
                alt="Liquid biopsy test tubes with glowing DNA strands"
                className="w-full object-cover max-h-[420px] md:max-h-[380px] transition-transform duration-700 group-hover:scale-105"
                style={{
                  display: "block",
                  borderRadius: 0,
                }}
              />
              {/* Bottom badge overlay */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-blue-300 opacity-75" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-blue-400" />
                </span>
                <span className="text-[9px] font-semibold tracking-[.15em] uppercase text-white">
                  Active R&amp;D
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="mt-12 h-px bg-gradient-to-r from-blue-600 via-blue-200 to-transparent" />
      </section>

      {/* OVERVIEW — side by side */}
      <section id="overview" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">
                Overview
              </p>
              <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-tight tracking-tight text-gray-900 mb-4">
                Real-Time, Non-Invasive Monitoring
              </h2>
              <div className="w-12 h-[2px] bg-blue-600" />
            </div>
            <div className="text-[14px] text-gray-500 leading-[1.8] space-y-4">
              <p>
                Designed for cancer-positive patients — focusing on monitoring
                treatment response and tracking disease progression using
                non-invasive biological signals captured through liquid biopsy.
              </p>
              <p className="text-gray-400 text-[12px] border-l-2 border-blue-200 pl-4">
                Currently in R&amp;D, with ongoing work to refine accuracy,
                scalability, and clinical integration.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* NGS MACHINE SECTION */}
      <section id="technology" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: NGS machine image — sharp edges */}
            <div className="relative w-full overflow-hidden group order-2 md:order-1">
              {/* Sharp corner accent lines */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-400 z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-400 z-20 pointer-events-none" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/25 via-transparent to-transparent z-10 pointer-events-none" />
              <img
                src="/ngs-machine.png"
                alt="Next Generation Sequencing NGS machine"
                className="w-full object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105"
                style={{
                  display: "block",
                  borderRadius: 0,
                }}
              />
              {/* Badge */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-blue-300 opacity-75" />
                  <span className="relative rounded-full h-1.5 w-1.5 bg-blue-400" />
                </span>
                <span className="text-[9px] font-semibold tracking-[.15em] uppercase text-white">
                  NGS Platform
                </span>
              </div>
            </div>

            {/* Right: text content */}
            <div className="order-1 md:order-2">
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">
                Technology
              </p>
              <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold leading-tight tracking-tight text-gray-900 mb-5">
                Next Generation{" "}
                <span className="text-blue-600">Sequencing</span> at the Core
              </h2>
              <p className="text-[14px] text-gray-500 leading-[1.8] mb-4">
                Our platform leverages state-of-the-art Next Generation
                Sequencing (NGS) instruments to decode circulating tumor DNA
                (ctDNA) from a simple blood draw — enabling ultra-sensitive
                genomic profiling without invasive tissue sampling.
              </p>
              <p className="text-gray-400 text-[12px] border-l-2 border-blue-200 pl-4 mb-6">
                Sequencing data is processed through our AI pipeline to
                identify mutations, copy number alterations, and epigenetic
                signatures in real time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { stat: "ctDNA", label: "Primary Biomarker" },
                  { stat: "AI-driven", label: "Analysis Pipeline" },
                  { stat: "Non-invasive", label: "Blood Draw Only" },
                  { stat: "Real-time", label: "Continuous Monitoring" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 p-4 hover:border-blue-300 transition-colors"
                  >
                    <p className="text-[13px] font-bold text-blue-600 mb-1">
                      {item.stat}
                    </p>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* AUDIENCE */}
      <section id="audience" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-10 items-end mb-10">
            <div>
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">
                Audience
              </p>
              <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold tracking-tight text-gray-900">
                Built for the Oncology Ecosystem
              </h2>
            </div>
            <p className="text-[14px] text-gray-500 leading-[1.8]">
              Serving every stakeholder in the cancer care continuum — from
              bedside to bench.
            </p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
          {AUDIENCE.map((a, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="bg-white p-6 h-full hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-[2px] bg-blue-500 group-hover:w-10 transition-all" />
                  <span className="text-[10px] font-semibold tracking-[.18em] uppercase text-blue-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-2">
                  {a.label}
                </h3>
                <p className="text-[12px] text-gray-400 leading-[1.75]">
                  {a.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-14 h-px bg-gray-200" />
      </section>

      {/* MISSION & VISION */}
      <section id="mission" className="max-w-6xl mx-auto px-6 py-14">
        <Reveal>
          <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-600 mb-3">
            Mission &amp; Vision
          </p>
          <h2 className="text-[clamp(1.4rem,3vw,2.2rem)] font-bold tracking-tight text-gray-900 mb-10">
            Toward Continuous Cancer Understanding
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
          <Reveal>
            <div className="bg-blue-600 p-8 h-full">
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-blue-200 mb-3">
                Mission
              </p>
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight">
                Democratize Precision Monitoring
              </h3>
              <p className="text-[13px] text-blue-100 leading-[1.8]">
                Combine AI, liquid biopsy, and predictive modeling within an
                open framework — making advanced cancer monitoring accessible to
                all.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="bg-gray-900 p-8 h-full">
              <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-gray-500 mb-3">
                Vision
              </p>
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight">
                Cancer Continuously Understood
              </h3>
              <p className="text-[13px] text-gray-400 leading-[1.8]">
                A future where cancer is continuously understood through
                AI-driven prediction, supported by a global open-source
                ecosystem.
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
                  Cancer monitoring should be accessible, transparent, and
                  collaborative. We welcome contributions worldwide.
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
            <span className="text-[11px] font-semibold tracking-[.08em] uppercase text-gray-800">
              Liquid Biopsy Monitoring
            </span>
            <span className="text-[9px] font-medium tracking-[.12em] uppercase text-gray-400 border border-gray-200 px-2 py-0.5">
              R&amp;D
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Open-source · Not-for-profit · Precision oncology
          </p>
        </div>
        <div className="h-[2px] bg-blue-600" />
      </footer>
    </div>
  );
}
