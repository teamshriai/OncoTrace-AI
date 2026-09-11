import { useEffect, useRef, useState } from 'react'

const WORKFLOW_STEPS = [
  {
    id: 1, label: 'Blood Draw', icon: '/img1.webp', color: '#64748b',
    description: 'A routine blood sample is collected from the patient — the starting point of the pipeline.',
  },
  {
    id: 2, label: 'Plasma Separation', icon: '/img2.webp', color: '#3b82f6',
    description: 'Plasma is isolated from the sample to access circulating tumor DNA (ctDNA).',
  },
  {
    id: 3, label: 'ctDNA + NGS', icon: '/img3.webp', color: '#6366f1',
    description: 'ctDNA is extracted and sequenced with Next-Generation Sequencing for a full genomic profile.',
  },
  {
    id: 4, label: 'AI Analysis', icon: '/img4.webp', color: '#0ea5e9',
    description: 'AI models process the sequencing data to identify and tier clinically relevant variants.',
  },
  {
    id: 5, label: 'Clinician Decision', icon: '/img5.webp', color: '#475569',
    description: 'Structured, evidence-linked results reach the treating physician to inform next steps.',
  },
]

/* ═══════════════════════════════════════════════════════
   STYLE INJECTION
   ═══════════════════════════════════════════════════════ */

const scopedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .hero-root *, .hero-root *::before, .hero-root *::after {
    box-sizing: border-box;
  }

  .hero-root img, .hero-root svg, .hero-root video, .hero-root canvas {
    display: block;
    max-width: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-root *, .hero-root *::before, .hero-root *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.15s !important;
    }
  }

  .hero-root button:focus-visible,
  .hero-root a:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  @keyframes heroSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .hero-powered-by-link {
    transition: color 0.2s ease, text-decoration-color 0.2s ease;
  }

  /* ─── Hero intro backdrop (dotted grid + soft glow, Stroke-AI style) ─── */
  .hero-intro-bg {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(37, 99, 235, 0.16) 1.4px, transparent 1.4px);
    background-size: 26px 26px;
    -webkit-mask-image: radial-gradient(ellipse 85% 75% at 68% 40%, #000 0%, transparent 78%);
            mask-image: radial-gradient(ellipse 85% 75% at 68% 40%, #000 0%, transparent 78%);
  }

  .hero-intro-glow {
    position: absolute;
    border-radius: 9999px;
    filter: blur(70px);
    pointer-events: none;
  }

  @keyframes heroEyebrowIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes heroHeadlineIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes heroBarGrow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }

  .hero-anim-eyebrow {
    animation: heroEyebrowIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .hero-anim-headline {
    animation: heroHeadlineIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .hero-anim-bar {
    transform-origin: top;
    animation: heroBarGrow 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ─── Flow cards (architecture-diagram style workflow) ─── */
  .flow-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .flow-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
  }
  .flow-card img {
    transition: transform 0.4s ease;
  }
  .flow-card:hover img {
    transform: scale(1.04);
  }
`

let _styleInjected = false
function injectHeroStyles() {
  if (_styleInjected || typeof document === 'undefined') return
  const tag = document.createElement('style')
  tag.setAttribute('data-hero-section', '')
  tag.textContent = scopedCSS
  document.head.appendChild(tag)
  _styleInjected = true
}

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

function useInView(ref, threshold = 0.1) {
  // Environments without IntersectionObserver (old browsers, SSR) have no way
  // to observe visibility, so they start "in view" already -- computed as the
  // initial state itself rather than set from inside the effect below.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.unobserve(node)
        }
      },
      { threshold }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [ref, threshold])

  return inView
}

function useReducedMotion() {
  // Read the current match synchronously as the initial state, so the first
  // render already reflects it instead of being corrected a tick later.
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

/* ═══════════════════════════════════════════════════════
   FLOW CARD — architecture-diagram style workflow step:
   large photo on top, tinted info panel below.
   ═══════════════════════════════════════════════════════ */

function FlowCard({ step, index, inView, isReduced }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const entryDelay = isReduced ? 0 : index * 0.08
  const number = String(step.id).padStart(2, '0')

  return (
    <div
      className="flex w-full min-w-0 flex-1 flex-col items-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: isReduced ? 'none' : `opacity 0.5s ease ${entryDelay}s, transform 0.5s ease ${entryDelay}s`,
      }}
    >
      <div
        className="flow-card w-full overflow-hidden rounded-lg border"
        style={{
          borderColor: `color-mix(in srgb, ${step.color} 28%, transparent)`,
          background: '#ffffff',
        }}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-slate-400"
                style={{ animation: 'heroSpin 0.8s linear infinite' }}
              />
            </div>
          )}
          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="30%" height="30%" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke={step.color} strokeWidth="2" opacity="0.3" />
                <path d="M16 24h16M24 16v16" stroke={step.color} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <img
            src={step.icon}
            alt={step.label}
            loading="lazy"
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />
        </div>

        <div
          className="px-3.5 py-3 sm:px-4 sm:py-3.5"
          style={{ background: `color-mix(in srgb, ${step.color} 8%, transparent)` }}
        >
          <p
            className="text-[10px] font-bold tracking-wider"
            style={{ color: step.color, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {number}
          </p>
          <p
            className="mt-1 font-bold leading-snug text-slate-900"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(12.5px, 1.1vw, 14px)' }}
          >
            {step.label}
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-slate-600 sm:text-xs">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CONNECTORS - Perfectly centered arrows
   ═══════════════════════════════════════════════════════ */

const ARROW_FILL = '#d97706'

function DesktopConnector({ inView, delay, isReduced }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center self-center"
      style={{
        // The parent pair wrapper is `items-center`, so this centers against
        // its own card sibling's actual rendered height automatically.
        width:      'clamp(28px, 3vw, 56px)',
        opacity:    inView ? 1 : 0,
        transition: isReduced ? 'none' : `opacity 0.5s ease ${delay}s`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 40"
        fill="none"
        className="w-full h-auto"
        style={{ display: 'block' }}
      >
        <path
          d="M 0 15 L 72 15 L 72 6 L 98 20 L 72 34 L 72 25 L 0 25 Z"
          fill={ARROW_FILL}
        />
      </svg>
    </div>
  )
}

function MobileConnector({ inView, delay, isReduced }) {
  return (
    <div
      className="flex items-center justify-center my-2 flex-shrink-0"
      style={{
        width:      40,
        height:     60,
        opacity:    inView ? 1 : 0,
        transition: isReduced ? 'none' : `opacity 0.5s ease ${delay}s`,
      }}
      aria-hidden="true"
    >
      <svg 
        viewBox="0 0 40 60" 
        fill="none" 
        width="40" 
        height="60"
        style={{ display: 'block' }}
      >
        <path
          d="M 15 0 L 25 0 L 25 38 L 34 38 L 20 58 L 6 38 L 15 38 Z"
          fill={ARROW_FILL}
        />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   HERO INTRO — plain, typographic, no photo
   ═══════════════════════════════════════════════════════ */

function HeroIntro() {
  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Hero - AI-powered precision oncology platform"
      style={{ background: '#ffffff' }}
    >
      {/* Decorative dotted-grid backdrop, Stroke-AI style */}
      <div className="hero-intro-bg" aria-hidden="true" />
      <div
        className="hero-intro-glow"
        aria-hidden="true"
        style={{
          width: 560, height: 560, top: '-12%', right: '-8%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)',
        }}
      />
      <div
        className="hero-intro-glow"
        aria-hidden="true"
        style={{
          width: 420, height: 420, bottom: '-14%', right: '18%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:pl-10 lg:pr-0">
        {/* On desktop the image is pulled out of this container (see below); the copy
            just caps its own width so it never runs under the image. */}
        <div className="grid grid-cols-1 items-center gap-10 py-16 sm:py-20 lg:block lg:py-32">

          {/* ── Left: copy ── */}
          <div className="text-center lg:max-w-[48%] lg:min-w-[520px] lg:text-left xl:max-w-[720px]">
            {/* Status pill — live dot + the two positioning statements, one unit */}
            <div
              className="hero-anim-eyebrow inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-full border px-4 py-2 shadow-sm backdrop-blur-sm sm:gap-x-3"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.28)',
                background: 'linear-gradient(90deg, rgba(236,253,245,0.95) 0%, rgba(239,246,255,0.95) 100%)',
              }}
            >
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 sm:text-xs">
                Open Source · Not For Profit
              </span>
              <span className="hidden h-3 w-px bg-emerald-300/60 sm:block" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600 sm:text-xs">
                AI For Health · Care For All
              </span>
            </div>

            {/* Headline leads — no competing eyebrow above it */}
            <h1
              className="hero-anim-headline mt-7 font-bold tracking-[-0.03em] text-slate-900 sm:mt-8"
              style={{ fontSize: 'clamp(2.3rem, 5.2vw, 4.15rem)', lineHeight: 1.02, animationDelay: '0.1s' }}
            >
              Real-time Precision Monitoring of{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Oncology
              </span>
            </h1>

            {/* Supporting line, set off by a rule rather than floating alone */}
            <div
              className="hero-anim-headline mt-8 flex items-center justify-center gap-4 sm:mt-9 lg:justify-start"
              style={{ animationDelay: '0.2s' }}
            >
              <span
                className="hidden h-8 w-[2px] shrink-0 rounded-full lg:block"
                style={{ background: 'linear-gradient(180deg, #2563eb, #06b6d4)' }}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600 sm:text-[15px]">
                AI — Powered
              </p>
            </div>

            {/* Attribution demoted to a quiet footer line */}
            <p
              className="hero-anim-eyebrow mt-10 text-[13px] text-slate-400 sm:mt-12"
              style={{ animationDelay: '0.3s' }}
            >
              Powered by{' '}
              <a
                href="https://shri-ai.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-powered-by-link font-medium text-slate-600 underline decoration-slate-300 hover:text-blue-600 hover:decoration-blue-400"
                style={{ textUnderlineOffset: '3px' }}
              >
                Senus Healthcare Research Institute
              </a>
              , USA
            </p>
          </div>

          {/* ── Mobile / tablet only: image sits below the copy, flush to the right edge ── */}
          <div className="relative -mr-4 flex h-[190px] items-center justify-end sm:-mr-6 sm:h-[240px] lg:hidden">
            <div
              className="absolute inset-y-0 right-0 -z-10 w-[85%] rounded-l-[2.5rem]"
              aria-hidden="true"
              style={{
                background: 'radial-gradient(ellipse 78% 82% at 65% 50%, rgba(219,234,254,0.85) 0%, rgba(219,234,254,0.25) 55%, transparent 78%)',
              }}
            />
            <img
              src="/hero-vial-hand.webp"
              alt="A gloved hand holding a blood sample tube, representing the starting point of the OncoTrace-AI liquid biopsy pipeline"
              draggable={false}
              loading="eager"
              className="relative z-10 h-auto w-[68%] max-w-[280px] object-contain sm:max-w-[320px]"
              style={{ filter: 'drop-shadow(0 24px 32px rgba(15, 23, 42, 0.16))' }}
            />
          </div>
        </div>
      </div>

      {/* ── Desktop only: image anchored to the TRUE viewport right edge.
           A direct child of the full-width <section>, so `right-0` is the real
           screen edge rather than the centered max-w-[1400px] container's edge. ── */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46vw] max-w-[680px] items-center justify-end lg:flex">
        <div
          className="absolute right-0 top-1/2 -z-10 h-[110%] w-[90%] -translate-y-1/2"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 70% 50%, rgba(219,234,254,0.9) 0%, rgba(219,234,254,0.3) 50%, transparent 76%)',
          }}
        />
        <img
          src="/hero-vial-hand.webp"
          alt="A gloved hand holding a blood sample tube, representing the starting point of the OncoTrace-AI liquid biopsy pipeline"
          draggable={false}
          loading="eager"
          className="relative z-10 h-auto w-full object-contain"
          style={{ filter: 'drop-shadow(0 24px 32px rgba(15, 23, 42, 0.16))' }}
        />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */

export default function HeroSection() {
  const workflowRef    = useRef(null)
  const workflowInView = useInView(workflowRef, 0.05)
  const isReduced      = useReducedMotion()

  useEffect(() => { 
    injectHeroStyles() 
  }, [])

  return (
    <div
      className="hero-root"
      style={{ 
        background: '#ffffff', 
        fontFamily: 'Inter, system-ui, sans-serif',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* Skip link */}
      <a
        href="#workflow-section"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-white focus:text-blue-600 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-semibold"
      >
        Skip to workflow
      </a>

      {/* Hero intro — plain typographic hero, no photo */}
      <HeroIntro />

      {/* ── Workflow Section ── */}
      <section
        id="workflow-section"
        ref={workflowRef}
        className="relative w-full overflow-hidden"
        aria-label="From Sample to Clinical Insight"
        style={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}
      >
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 lg:px-6 py-14 sm:py-18 lg:py-24">

          {/* Section Header */}
          <div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            style={{
              opacity:   workflowInView ? 1 : 0,
              transform: workflowInView ? 'translateY(0)' : 'translateY(20px)',
              transition: isReduced
                ? 'none'
                : 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 sm:text-sm">
              The Pipeline
            </p>
            <h2
              className="font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', letterSpacing: '-0.025em' }}
            >
              From Sample to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Clinical Insight
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-500 sm:text-base">
              Five stages, one continuous liquid biopsy workflow.
            </p>
          </div>

          {/* Desktop Layout (lg+) - equal-width cards in one row */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-1.5 xl:gap-3">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center" style={{ minWidth: 0 }}>
                <FlowCard
                  step={step}
                  index={index}
                  inView={workflowInView}
                  isReduced={isReduced}
                />
                {index < WORKFLOW_STEPS.length - 1 && (
                  <DesktopConnector
                    inView={workflowInView}
                    delay={isReduced ? 0 : 0.08 + index * 0.08 + 0.25}
                    isReduced={isReduced}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Tablet Layout (sm → lg) - 3 top, 2 bottom */}
          <div className="hidden md:block lg:hidden">
            {/* First Row – 3 steps */}
            <div className="flex items-center gap-2">
              {WORKFLOW_STEPS.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center" style={{ minWidth: 0 }}>
                  <FlowCard
                    step={step}
                    index={index}
                    inView={workflowInView}
                    isReduced={isReduced}
                  />
                  {index < 2 && (
                    <DesktopConnector
                      inView={workflowInView}
                      delay={isReduced ? 0 : 0.08 + index * 0.08 + 0.25}
                      isReduced={isReduced}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Vertical Connector */}
            <div className="flex justify-center">
              <MobileConnector
                inView={workflowInView}
                delay={isReduced ? 0 : 0.5}
                isReduced={isReduced}
              />
            </div>

            {/* Second Row – 2 steps */}
            <div className="mx-auto flex max-w-[66%] items-center gap-2">
              {WORKFLOW_STEPS.slice(3).map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center" style={{ minWidth: 0 }}>
                  <FlowCard
                    step={step}
                    index={index + 3}
                    inView={workflowInView}
                    isReduced={isReduced}
                  />
                  {index === 0 && (
                    <DesktopConnector
                      inView={workflowInView}
                      delay={isReduced ? 0 : 0.75}
                      isReduced={isReduced}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout (< sm) - Vertical stack */}
          <div className="flex md:hidden flex-col items-center">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center w-full max-w-sm">
                <FlowCard
                  step={step}
                  index={index}
                  inView={workflowInView}
                  isReduced={isReduced}
                />
                {index < WORKFLOW_STEPS.length - 1 && (
                  <MobileConnector
                    inView={workflowInView}
                    delay={isReduced ? 0 : 0.08 + index * 0.08 + 0.25}
                    isReduced={isReduced}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-200 pt-6 lg:mt-10 lg:pt-8"
            style={{
              opacity: workflowInView ? 1 : 0,
              transition: isReduced ? 'none' : 'opacity 0.6s ease 0.9s',
            }}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden="true">
                <path d="M0 5h13M10 1l4 4-4 4" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-medium text-slate-500">Process flow, left to right</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}