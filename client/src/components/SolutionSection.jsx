import useInView from "../hooks/useInView";

/* ── Icons ── */
function DropletIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <path d="M8 14a4 4 0 0 0 4 4" opacity="0.5" />
    </svg>
  );
}

function NeuralIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a4 4 0 0 1 4 4v1a3 3 0 0 1 2.5 5.1A3.5 3.5 0 0 1 17 19H7a3.5 3.5 0 0 1-1.5-6.9A3 3 0 0 1 8 7V6a4 4 0 0 1 4-4z" />
      <path d="M12 2v20" />
      <path d="M8 10h2" />
      <path d="M14 14h2" />
      <path d="M8 14h1" />
      <path d="M15 10h1" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

/* ── Step data ── */
const steps = [
  {
    Icon: DropletIcon,
    num: "01",
    title: "Capture",
    subtitle: "Liquid Biopsy",
    body: "Non-invasive blood-based collection captures real-time biological signals — circulating tumor DNA, proteins, and critical biomarkers — eliminating the need for repeated invasive procedures.",
  },
  {
    Icon: NeuralIcon,
    num: "02",
    title: "Analyze",
    subtitle: "AI Engine",
    body: "Our artificial intelligence processes complex biological data simultaneously, surfacing patterns and anomalies across hundreds of biomarkers invisible to traditional analysis methods.",
  },
  {
    Icon: PulseIcon,
    num: "03",
    title: "Monitor",
    subtitle: "Real-Time Insights",
    body: "Continuous precision monitoring delivers actionable insights to clinicians, tracking how cancer evolves and responds — enabling faster, data-driven decisions.",
  },
];

/* ── Stagger delay map ── */
const delayClass = [
  "delay-[0ms]",
  "delay-[180ms]",
  "delay-[360ms]",
];

/* ═════════════════════════════════════════════
   MAIN EXPORT
   ═════════════════════════════════════════════ */
export default function SolutionSection() {
  const [ref, inView] = useInView();

  return (
    <section
      id="solution"
      className="relative scroll-mt-20 overflow-hidden bg-white py-28 lg:py-36"
    >
      {/* ── Subtle background glow ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[800px]
                     -translate-x-1/2 rounded-full bg-blue-50/60
                     blur-[100px]"
        />
        <div
          className="absolute -bottom-32 right-0 h-[300px] w-[400px]
                     rounded-full bg-blue-50/30 blur-[80px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* ══════════════════════════════════════
            HEADER
            ══════════════════════════════════════ */}
        <div className="mx-auto max-w-2xl text-center">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 rounded-full
                       border border-blue-100 bg-blue-50/70 px-4 py-1.5
                       text-[11px] font-semibold uppercase
                       tracking-[0.15em] text-blue-600"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            How It Works
          </span>

          {/* Heading */}
          <h2
            className="mt-7 font-sans text-4xl font-bold leading-tight
                       tracking-tight text-slate-900 sm:text-5xl"
          >
            From liquid biopsy to{" "}
            <span
              className="bg-gradient-to-r from-blue-600 to-cyan-500
                         bg-clip-text text-transparent"
            >
              real-time insights
            </span>
          </h2>

          {/* Subheading */}
          <p
            className="mx-auto mt-5 max-w-lg font-sans text-base
                       leading-relaxed text-slate-500 sm:text-lg"
          >
            A streamlined pipeline that transforms non-invasive blood samples
            into continuous precision cancer monitoring.
          </p>
        </div>

        {/* ══════════════════════════════════════
            STEPS GRID
            ══════════════════════════════════════ */}
        <div ref={ref} className="relative mx-auto mt-20 max-w-6xl lg:mt-24">
          {/* ── Desktop connector line ── */}
          <div className="absolute inset-x-0 top-[68px] z-0 hidden lg:block">
            <div className="mx-auto max-w-4xl px-28">
              <div
                className={`h-px w-full origin-left bg-gradient-to-r
                            from-blue-200/0 via-blue-200 to-blue-200/0
                            transition-all duration-1000
                            ${inView
                              ? "scale-x-100 opacity-100"
                              : "scale-x-0 opacity-0"
                            }`}
              />
            </div>
          </div>

          {/* ── Cards ── */}
          <div className="relative z-10 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => {
              const { Icon } = step;
              return (
                <div
                  key={step.num}
                  className={`group relative overflow-hidden rounded-2xl
                             border border-slate-100 bg-white p-8
                             shadow-sm transition-all duration-700
                             hover:border-blue-100 hover:shadow-xl
                             hover:shadow-blue-500/[0.06]
                             lg:p-10
                             ${delayClass[i]}
                             ${inView
                               ? "translate-y-0 opacity-100"
                               : "translate-y-12 opacity-0"
                             }`}
                >
                  {/* Top accent bar — visible on hover */}
                  <div
                    className="absolute inset-x-0 top-0 h-[2px]
                               bg-gradient-to-r from-transparent
                               via-blue-400 to-transparent
                               opacity-0 transition-opacity duration-500
                               group-hover:opacity-100"
                  />

                  {/* Icon + meta row */}
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center
                                 rounded-2xl bg-blue-50 text-blue-600
                                 shadow-sm transition-all duration-300
                                 group-hover:bg-blue-600
                                 group-hover:text-white
                                 group-hover:shadow-lg
                                 group-hover:shadow-blue-600/25"
                    >
                      <Icon />
                    </div>
                    <div>
                      <p
                        className="font-sans text-[10px] font-bold
                                   uppercase tracking-[0.2em] text-slate-300"
                      >
                        Step {step.num}
                      </p>
                      <p className="font-sans text-xs font-medium text-blue-500/80">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-sans text-xl font-bold tracking-tight
                               text-slate-900 lg:text-[1.35rem]"
                  >
                    {step.title}
                  </h3>

                  {/* Divider — grows on hover */}
                  <div
                    className="mt-3 h-px w-8 bg-gradient-to-r
                               from-blue-400/40 to-transparent
                               transition-all duration-300
                               group-hover:w-12 group-hover:from-blue-500/60"
                  />

                  {/* Body */}
                  <p
                    className="mt-4 font-sans text-sm leading-relaxed
                               text-slate-500 lg:text-[0.9rem] lg:leading-[1.7]"
                  >
                    {step.body}
                  </p>

                  {/* Connector arrow — desktop only */}
                  {i < steps.length - 1 && (
                    <div
                      className="absolute -right-[18px] top-[68px] z-20
                                 hidden h-7 w-7 items-center justify-center
                                 rounded-full border border-slate-100
                                 bg-white text-blue-400 shadow-sm lg:flex"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M1 7h12m0 0L8 2m5 5L8 12"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}