import { useEffect, useRef } from "react";

const Mammogram = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.08 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal");
    elements?.forEach((el) => observer.observe(el));

    return () => elements?.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden bg-white"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-transparent to-slate-50/80 pointer-events-none" />

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

        {/* ── Row 1 — Image left, Text right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-16 sm:mb-20 lg:mb-32">

          {/* Image — larger, sharp corners */}
          <div className="reveal opacity-0 transition-all duration-700 ease-out delay-100 lg:-translate-x-12">
            <div className="w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-gray-100 shadow-lg">
              <img
                src="/mammogram_1.png"
                alt="AI mammogram risk analysis process"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="reveal opacity-0 transition-all duration-700 ease-out delay-200 lg:translate-x-12">
            <div className="space-y-4 sm:space-y-5">
              <p className="font-semibold tracking-widest uppercase text-xs text-blue-600">
                Predictive Intelligence
              </p>

              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
                Predicting Risk Before{" "}
                <span className="text-blue-600">Cancer Develops</span>
              </h3>

              <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                Our AI models are trained on clinically curated mammogram
                datasets with radiologist-in-the-loop evaluation. Given a
                mammogram image as input, the system analyzes tissue patterns,
                density markers, and subtle morphological features to generate a
                personalized 5-year breast cancer risk prediction — empowering
                clinicians with actionable foresight.
              </p>

              <ul className="space-y-4 sm:space-y-5 pt-2 sm:pt-3">
                {[
                  {
                    title: "Image Analysis",
                    desc: "Extracts deep tissue features, density patterns, and micro-calcification signatures from input mammograms.",
                  },
                  {
                    title: "Risk Stratification",
                    desc: "Generates a personalized 5-year risk score with explainable confidence intervals.",
                  },
                  {
                    title: "Clinical Integration",
                    desc: "Delivers structured risk reports that integrate seamlessly into radiologist workflows.",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 sm:gap-4">
                    <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 mt-0.5 bg-blue-600 text-white text-xs font-bold flex items-center justify-center rounded-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {item.title}
                      </h4>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Row 2 — Text left, Image right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Text — always on top on mobile, left on desktop */}
          <div className="order-1 lg:order-1 reveal opacity-0 transition-all duration-700 ease-out delay-100 lg:-translate-x-12">
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

              {/* Steps */}
              <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4">
                {[
                  {
                    step: "01",
                    label: "Upload",
                    desc: "Submit a standard mammogram image for AI analysis.",
                    color: "bg-blue-600",
                  },
                  {
                    step: "02",
                    label: "Analyze",
                    desc: "AI extracts tissue features and evaluates risk biomarkers.",
                    color: "bg-indigo-600",
                  },
                  {
                    step: "03",
                    label: "Predict",
                    desc: "Receive a detailed 5-year risk prediction with actionable insights.",
                    color: "bg-purple-600",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="relative bg-slate-50 p-4 sm:p-5 border border-gray-200 hover:border-gray-300 transition-colors duration-300"
                  >
                    <span
                      className={`inline-block text-xs font-bold text-white px-2 py-0.5 sm:px-2.5 sm:py-1 ${s.color} mb-2 sm:mb-3 rounded-sm`}
                    >
                      {s.step}
                    </span>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                      {s.label}
                    </h4>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image — larger, sharp corners, below text on mobile, right on desktop */}
          <div className="order-2 lg:order-2 reveal opacity-0 transition-all duration-700 ease-out delay-200 lg:translate-x-12">
            <div className="w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-gray-100 shadow-lg">
              <img
                src="/mammogram_3.png"
                alt="AI mammogram 5-year risk prediction output"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ── Bottom CTA Banner ── */}
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300 mt-16 sm:mt-20 lg:mt-28">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-10 md:p-12 text-center overflow-hidden shadow-2xl shadow-indigo-500/20">
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>
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

      {/* Reveal animation — only translate on lg+ to avoid horizontal overflow on mobile */}
      <style>{`
        .animate-in {
          opacity: 1 !important;
          transform: translate(0, 0) !important;
        }

        @media (max-width: 1023px) {
          .reveal {
            transform: translateY(16px) !important;
          }
          .animate-in {
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Mammogram;