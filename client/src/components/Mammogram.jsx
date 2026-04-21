// Mammogram.jsx
import { useEffect, useRef, useCallback } from "react";

const steps = [
  {
    step: "1",
    label: "Submit Mammogram",
    desc: "Extracts deep tissue features, density patterns, and micro-calcification signatures from input mammograms.",
    color: "bg-blue-600",
  },
  {
    step: "2",
    label: "AI Risk Analysis",
    desc: "Generates a personalized 5-year risk score with explainable confidence intervals.",
    color: "bg-indigo-600",
  },
  {
    step: "3",
    label: "Clinical Interpretation",
    desc: "Delivers structured risk reports that integrate seamlessly into radiologist workflows.",
    color: "bg-purple-600",
  },
];

const Mammogram = () => {
  const sectionRef = useRef(null);
  const observerRef = useRef(null);
  const animatedElements = useRef(new Set());

  const handleIntersection = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animatedElements.current.has(entry.target)) {
        animatedElements.current.add(entry.target);
        entry.target.classList.add("animate-in");
        observerRef.current?.unobserve(entry.target);
      }
    });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    });

    const elements = section.querySelectorAll(".reveal");
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [handleIntersection]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden bg-white"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight px-2">
            AI-Powered{" "}
            <span className="text-blue-600">Mammogram</span>{" "}
            Risk Analysis
          </h2>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
            We combine clinical radiology expertise with advanced deep learning
            to analyze mammogram images and predict individualized breast cancer
            risk over the next 5 years — enabling earlier intervention and
            better patient outcomes.
          </p>
        </div>

        {/* ── Row 1 : Image left / Steps right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-16 sm:mb-20 lg:mb-32">

          {/* Image */}
          <div className="reveal opacity-0 transition-all duration-700 ease-out delay-100 lg:-translate-x-12 will-change-transform">
            <div className="w-full overflow-hidden bg-gray-100 shadow-lg"
                 style={{ aspectRatio: "4/3" }}>
              <img
                src="/mammogram_1.webp"
                alt="AI mammogram risk analysis process"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Content */}
          <div className="reveal opacity-0 transition-all duration-700 ease-out delay-200 lg:translate-x-12 will-change-transform">
            <div className="space-y-4 sm:space-y-5">
              <p className="font-semibold tracking-widest uppercase text-xs text-blue-600">
                Predictive Intelligence
              </p>

              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
                Predicting Cancer{" "}
                <span className="text-blue-600">Before It Occurs</span>
              </h3>

              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                Our AI models are trained on clinically curated mammogram
                datasets with radiologist-in-the-loop evaluation. Given a
                mammogram image as input, the system analyzes tissue patterns,
                density markers, and subtle morphological features to generate a
                personalized 5-year breast cancer risk prediction — empowering
                clinicians with actionable foresight.
              </p>

              {/* Steps — vertical on mobile, horizontal on sm+ */}
              <div className="pt-2 sm:pt-4">
                {/* Mobile: vertical stack */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {steps.map((s, i) => (
                    <div key={s.step}>
                      <StepCard s={s} />
                      {i < steps.length - 1 && (
                        <div className="flex justify-center py-1" aria-hidden="true">
                          <ChevronDown />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* sm+: horizontal row */}
                <div className="hidden sm:flex items-stretch gap-3 md:gap-4">
                  {steps.map((s, i) => (
                    <div key={s.step} className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0 h-full">
                        <StepCard s={s} />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="flex-shrink-0" aria-hidden="true">
                          <ChevronRight />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2 : Text left / Image right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Content */}
          <div className="order-1 reveal opacity-0 transition-all duration-700 ease-out delay-100 lg:-translate-x-12 will-change-transform">
            <div className="space-y-4 sm:space-y-5">
              <p className="font-semibold tracking-widest uppercase text-xs text-indigo-600">
                Risk Prediction Pipeline
              </p>

              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
                From a Mammogram report to{" "}
                <span className="text-indigo-600">5-Year Prediction</span>
              </h3>

              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                Simply upload a mammogram image and our AI engine processes it
                through a multi-stage analysis pipeline. Within moments, receive
                a comprehensive 5-year risk prediction report — complete with
                region-level heatmaps, risk percentiles, and recommended
                follow-up timelines tailored to each patient.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="order-2 reveal opacity-0 transition-all duration-700 ease-out delay-200 lg:translate-x-12 will-change-transform">
            <div className="w-full overflow-hidden bg-gray-100 shadow-lg"
                 style={{ aspectRatio: "4/3" }}>
              <img
                src="/mammogram_3.webp"
                alt="AI mammogram 5-year risk prediction output"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* ── CTA Banner ── */}
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 mt-16 sm:mt-20 lg:mt-28">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-10 md:p-12 text-center overflow-hidden shadow-2xl shadow-indigo-500/20">

            {/* Dot-grid overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10 px-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">
                Predictive AI. Proactive Care.
              </h3>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mx-auto mb-5 sm:mb-6 leading-relaxed">
                Shri-AI transforms every mammogram into a personalized 5-year
                risk forecast — amplifying clinician expertise with deep
                learning, not replacing it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Reveal animation ── */
        .reveal {
          will-change: opacity, transform;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }

        /* On small screens force only Y-axis shift so horizontal
           translate classes don't create unwanted side-scroll */
        @media (max-width: 1023px) {
          .reveal[class*="lg:-translate-x"],
          .reveal[class*="lg:translate-x"] {
            transform: translateY(16px) !important;
          }
          .reveal.animate-in {
            transform: translateY(0) !important;
          }
        }

        /* Respect user preference for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

/* ── Small reusable sub-components ─────────────────────────────── */

const StepCard = ({ s }) => (
  <div className="relative bg-slate-50 p-4 sm:p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-300 h-full">
    <span
      className={`inline-block text-xs font-bold text-white px-2 py-0.5 sm:px-2.5 sm:py-1 ${s.color} mb-2 sm:mb-3 rounded-sm`}
    >
      {s.step}
    </span>
    <h4 className="font-bold text-gray-900 text-base sm:text-lg">{s.label}</h4>
    <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">
      {s.desc}
    </p>
  </div>
);

const ChevronDown = () => (
  <svg
    className="h-5 w-5 text-indigo-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="h-5 w-5 text-indigo-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default Mammogram;