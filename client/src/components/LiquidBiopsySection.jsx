import { useEffect, useRef, useState } from "react";

function useOnScreen(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, isVisible] = useOnScreen();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function LiquidBiopsyMonitoring({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleWorkTogether = () => {
    if (onNavigate) {
      onNavigate("cta");
    } else {
      scrollToSection("cta");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <style>{`
        .lb-section * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .lb-section {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
      `}</style>

      <div className="lb-section">
        {/* Navigation - Internal only, shown when standalone */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none ${
            scrolled
              ? "bg-white/80 backdrop-blur-xl border-b border-gray-200"
              : "bg-transparent"
          }`}
          aria-hidden="true"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm font-semibold text-gray-900">
                  Liquid Biopsy
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-medium text-blue-600">R&D Phase</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-8 sm:pt-12 pb-8 sm:pb-12 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              {/* Left: Content */}
              <Reveal>
                <div className="order-2 lg:order-1">
                  {/* R&D Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-4 sm:mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></span>
                    <span className="text-xs font-medium text-blue-600 whitespace-nowrap">
                      R&D Phase — In Development
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-gray-900 mb-3 sm:mb-4 leading-[1.05]">
                    Real-time cancer
                    <br />
                    <span className="text-blue-600">monitoring.</span>
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-5 sm:mb-6 leading-relaxed max-w-lg">
                    Non-invasive liquid biopsy combined with AI for continuous
                    cancer progression tracking and treatment response monitoring.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => scrollToSection("lb-technology")}
                      className="px-5 sm:px-6 py-2.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:bg-blue-800 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Explore technology
                    </button>
                    <button
                      onClick={() => scrollToSection("lb-mission")}
                      className="px-5 sm:px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 hover:text-gray-900 active:bg-gray-50 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Right: Hero Image */}
              <Reveal delay={0.1}>
                <div className="order-1 lg:order-2 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent z-10 pointer-events-none"></div>
                  <img
                    src="/liquid-biopsy-hero.png"
                    alt="Liquid biopsy visualization"
                    loading="eager"
                    className="w-full h-auto object-cover block"
                    style={{ aspectRatio: "16/10" }}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-6 bg-white border-y border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                { value: "ctDNA", label: "Biomarker source" },
                { value: "NGS", label: "Sequencing method" },
                { value: "AI", label: "Analysis engine" },
                { value: "R&D", label: "Current phase" },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="text-center py-2">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-0.5">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section id="lb-technology" className="py-10 sm:py-14 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-8 sm:mb-12">
              {/* Left: NGS Image */}
              <Reveal>
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                  <img
                    src="/ngs-machine.png"
                    alt="Next Generation Sequencing machine"
                    loading="lazy"
                    className="w-full h-auto object-cover block"
                    style={{ aspectRatio: "16/11" }}
                  />
                </div>
              </Reveal>

              {/* Right: Content */}
              <Reveal delay={0.1}>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Technology
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 mb-3 sm:mb-4 leading-tight">
                    Next-generation sequencing at the core.
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    Ultra-sensitive genomic profiling from circulating tumor DNA
                    (ctDNA) without invasive tissue sampling. AI-driven analysis
                    delivers real-time insights.
                  </p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
                    {[
                      "Non-invasive",
                      "Real-time insights",
                      "AI-powered",
                      "ctDNA analysis",
                    ].map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5"></div>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Currently in R&D, refining accuracy, scalability, and
                        clinical integration for cancer-positive patients.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* How It Works */}
            <Reveal>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
                  How it works
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    {
                      step: "01",
                      title: "Blood Draw",
                      desc: "Simple venous blood collection — no tissue biopsy required.",
                      color: "blue",
                    },
                    {
                      step: "02",
                      title: "ctDNA Isolation",
                      desc: "Circulating tumor DNA extracted and purified from plasma.",
                      color: "indigo",
                    },
                    {
                      step: "03",
                      title: "NGS Sequencing",
                      desc: "Ultra-sensitive next-generation sequencing of ctDNA fragments.",
                      color: "violet",
                    },
                    {
                      step: "04",
                      title: "AI Analysis",
                      desc: "Machine learning models interpret variants and track progression.",
                      color: "purple",
                    },
                  ].map((item, i) => (
                    <Reveal key={i} delay={i * 0.08}>
                      <div className="p-4 sm:p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow h-full">
                        <div
                          className={`text-xs font-bold text-${item.color}-500 mb-2 font-mono`}
                        >
                          {item.step}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Mission, Vision, CTA */}
        <section id="lb-mission" className="py-10 sm:py-14 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
            <Reveal>
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
                  Built for impact.
                </h2>
                <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                  Our work is guided by a clear mission and a vision for a more
                  equitable future in cancer care.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Mission Card */}
              <Reveal>
                <div className="p-6 sm:p-8 bg-blue-600 text-white h-full flex flex-col justify-between rounded-xl sm:rounded-2xl">
                  <div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      Mission
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Democratize precision monitoring by combining AI, liquid
                      biopsy, and predictive modeling within an open framework.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Vision Card */}
              <Reveal delay={0.1}>
                <div className="p-6 sm:p-8 bg-gray-900 text-white h-full flex flex-col justify-between rounded-xl sm:rounded-2xl">
                  <div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      Vision
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      A future where cancer is continuously understood through
                      AI-driven prediction, supported by a global open-source
                      ecosystem.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* CTA Card */}
              <Reveal delay={0.2}>
                <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-700 to-blue-900 text-white h-full flex flex-col justify-between rounded-xl sm:rounded-2xl sm:col-span-2 lg:col-span-1">
                  <div className="mb-5 sm:mb-6">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                      Join the precision oncology revolution.
                    </h3>
                    <p className="text-sm text-blue-100 leading-relaxed">
                      Cancer monitoring should be accessible, transparent, and
                      collaborative. Let's build this together.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleWorkTogether}
                      className="w-full px-5 py-2.5 bg-white text-blue-700 text-sm font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                    >
                      Let's work together
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}