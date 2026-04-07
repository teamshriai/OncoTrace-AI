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

export default function LiquidBiopsyMonitoring() {
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

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <style jsx global>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-200"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
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

      {/* Hero Section - Compact */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <Reveal>
              <div>
                <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-4 leading-[1.05]">
                  Real-time cancer
                  <br />
                  <span className="text-blue-600">monitoring.</span>
                </h1>
                <p className="text-base lg:text-lg text-gray-600 mb-6 leading-relaxed">
                  Non-invasive liquid biopsy combined with AI for continuous cancer progression tracking and treatment response monitoring.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => scrollToSection("technology")}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all rounded-lg"
                  >
                    Explore technology
                  </button>
                  <button
                    onClick={() => scrollToSection("mission")}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-900 transition-all rounded-lg"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Right: Hero Image - Sharp Corners */}
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent z-10"></div>
                <img
                  src="/liquid-biopsy-hero.png"
                  alt="Liquid biopsy visualization"
                  loading="eager"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: "16/10" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Technology Section - Compact with NGS Image */}
      <section id="technology" className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
            {/* Left: NGS Image - Sharp Corners */}
            <Reveal>
              <div className="relative overflow-hidden">
                <img
                  src="/ngs-machine.png"
                  alt="Next Generation Sequencing machine"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: "16/11" }}
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gray-900 rounded-md">
                  NGS Platform
                </div>
              </div>
            </Reveal>

            {/* Right: Content */}
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 mb-3 leading-tight">
                  Next-generation sequencing at the core.
                </h2>
                <p className="text-base text-gray-600 mb-4 leading-relaxed">
                  Ultra-sensitive genomic profiling from circulating tumor DNA (ctDNA) without invasive tissue sampling. AI-driven analysis delivers real-time insights.
                </p>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Currently in R&D, refining accuracy, scalability, and clinical integration for cancer-positive patients.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission, Vision, CTA - 3 Cards in a Row */}
      <section id="mission" className="py-12 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-4">
            {/* Mission Card */}
            <Reveal>
              <div className="p-8 bg-blue-600 text-white h-full flex flex-col justify-between rounded-xl">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Mission</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Democratize precision monitoring by combining AI, liquid biopsy, and predictive modeling within an open framework.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Vision Card */}
            <Reveal delay={0.1}>
              <div className="p-8 bg-gray-900 text-white h-full flex flex-col justify-between rounded-xl">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Vision</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    A future where cancer is continuously understood through AI-driven prediction, supported by a global open-source ecosystem.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* CTA Card */}
            <Reveal delay={0.2}>
              <div className="p-8 bg-gradient-to-br from-blue-700 to-blue-800 text-white h-full flex flex-col justify-between rounded-xl">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Join the precision oncology revolution.
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Cancer monitoring should be accessible, transparent, and collaborative.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="w-full px-5 py-2.5 bg-white text-blue-700 text-sm font-medium hover:bg-blue-50 transition-colors rounded-lg">
                    Get involved
                  </button>
                  <button className="w-full px-5 py-2.5 border border-white/40 text-white text-sm font-medium hover:border-white/80 transition-colors rounded-lg">
                    Contact us
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
