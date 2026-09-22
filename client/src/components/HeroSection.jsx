import { Fragment, useEffect, useRef, useState } from 'react'

// Descriptions kept close in length (roughly 55-70 characters) on purpose:
// each FlowCard reserves a fixed amount of vertical space for this text (see
// the minHeight comment in FlowCard below), and outliers that need an extra
// line broke the "every card the same size" requirement -- keeping the copy
// balanced is what actually keeps the cards balanced.
const WORKFLOW_STEPS = [
  {
    id: 1, label: 'Blood Draw', icon: '/img1.webp', color: '#64748b',
    description: 'A routine blood sample is collected from the patient.',
  },
  {
    id: 2, label: 'Plasma Separation', icon: '/img2.webp', color: '#3b82f6',
    description: 'Plasma is isolated to access circulating tumor DNA.',
  },
  {
    id: 3, label: 'ctDNA + NGS', icon: '/img3.webp', color: '#6366f1',
    description: 'ctDNA is extracted and sequenced for a full genomic profile.',
  },
  {
    id: 4, label: 'AI Analysis', icon: '/img4.webp', color: '#0ea5e9',
    description: 'AI models identify and tier clinically relevant variants.',
  },
  {
    // report-preview.webp is itself a tight crop (the risk-score gauge +
    // "27%" + LOW/HIGH labels + risk-level line only, captured directly from
    // the live report, no surrounding chrome) -- it's already exactly the
    // "focused on the risk score" framing, so no extra CSS zoom is layered
    // on top here; that would just crop into the gauge itself.
    id: 5, label: 'AI Report', icon: '/report-preview.webp', color: '#475569',
    description: 'Findings are compiled into a structured, evidence-linked report.',
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
    /* --flow-img-zoom is an optional per-step base zoom (see step.zoom in
       WORKFLOW_STEPS), set inline per-card; the hover rule below multiplies
       on top of it rather than overriding it, so a zoomed step still gets
       the same hover feedback as the others. transform-origin anchored to
       the top: a centered zoom pushed the AI Report screenshot's own navy
       header bar (its most recognizable "this is the real product" cue) out
       of frame; anchoring top keeps that bar in view while still cropping in. */
    transform: scale(var(--flow-img-zoom, 1));
    transform-origin: 50% 15%;
    transition: transform 0.4s ease;
  }
  .flow-card:hover img {
    transform: scale(calc(var(--flow-img-zoom, 1) * 1.04));
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
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              // Read by the .flow-card img / .flow-card:hover img rules
              // above (see step.zoom in WORKFLOW_STEPS). The image box has
              // overflow-hidden, so the zoom crops cleanly rather than
              // spilling past the card's rounded corners.
              '--flow-img-zoom': step.zoom || 1,
            }}
          />
        </div>

        <div
          className="px-3 py-2.5 sm:px-3.5 sm:py-3"
          style={{ background: `color-mix(in srgb, ${step.color} 8%, transparent)` }}
        >
          <p
            className="text-[9px] font-bold tracking-wider"
            style={{ color: step.color, fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {number}
          </p>
          {/* min-height in `em` (relative to this element's own font-size, which
              is itself responsive) reserves space for 2 lines at any breakpoint,
              so a card whose label wraps ("Plasma Separation") ends up the same
              total height as one that doesn't -- required for every card in the
              workflow to render at an identical size regardless of its content. */}
          <p
            className="mt-1 font-bold text-slate-900"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 'clamp(11.5px, 1vw, 13px)',
              lineHeight: 1.25,
              minHeight: '2.5em',
            }}
          >
            {step.label}
          </p>
          {/* Same technique, sized for 3 lines -- the longest description here
              runs to 3 lines on a narrow card, so this is the shared height
              every card's description area reserves, whether its own text
              takes 1, 2, or 3 lines. */}
          <p
            className="mt-1 text-[9.5px] text-slate-600 sm:text-[11px]"
            style={{ lineHeight: 1.5, minHeight: '4.5em' }}
          >
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

// Shared with the tablet layout's row-2 width formula below, so a card in
// the 2-card row is guaranteed the same pixel width as a card in the 3-card
// row -- not just approximately, algebraically. Keep both in sync if either
// changes; they're deliberately not computed from one another because the
// row-2 formula needs this as a literal string to embed in its own calc().
const CONNECTOR_WIDTH_CSS = 'clamp(22px, 2.4vw, 44px)'
const CARD_GAP_CSS = '0.5rem' // matches the `gap-2` utility used around these cards

function DesktopConnector({ inView, delay, isReduced }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center self-center"
      style={{
        // The parent pair wrapper is `items-center`, so this centers against
        // its own card sibling's actual rendered height automatically.
        width:      CONNECTOR_WIDTH_CSS,
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
      // Matches SampleReportSection's background so the hero and the section
      // right below it read as one continuous surface, not two visibly
      // different shades of white.
      style={{ background: '#f8fafc' }}
    >
      {/* Decorative dotted-grid backdrop, Stroke-AI style */}
      <div className="hero-intro-bg" aria-hidden="true" />
      {/* These two glow blobs previously bled past the section's own edges
          (top:-12%, bottom:-14%) so overflow:hidden hard-clipped each
          radial-gradient before it reached full transparency -- visible as a
          faint horizontal line exactly at the section's bottom boundary,
          compounding with the image glow below into a line that survived
          fixing any single blob alone. Fully contained positioning (no
          negative offsets) plus a fade that reaches transparent at 55% of
          the blob's own radius, well inside its box, guarantees the edge is
          never clipped at any viewport width. */}
      <div
        className="hero-intro-glow"
        aria-hidden="true"
        style={{
          width: 560, height: 560, top: '4%', right: '2%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 55%)',
        }}
      />
      <div
        className="hero-intro-glow"
        aria-hidden="true"
        style={{
          width: 420, height: 420, bottom: '4%', right: '20%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:pl-10 lg:pr-0">
        {/* On desktop the image is pulled out of this container (see below); the copy
            just caps its own width so it never runs under the image.
            Vertical padding trimmed yet again (was py-8/10/16) to lift the
            workflow section further up the page. */}
        <div className="grid grid-cols-1 items-center gap-4 py-6 sm:py-8 lg:block lg:py-12">

          {/* ── Left: copy — sizes reduced one more step across the board ── */}
          <div className="text-center lg:max-w-[45%] lg:min-w-[480px] lg:text-left xl:max-w-[660px]">
            {/* Status pill — live dot + the two positioning statements, one unit */}
            <div
              className="hero-anim-eyebrow inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border px-3.5 py-1.5 shadow-sm backdrop-blur-sm sm:gap-x-2.5"
              style={{
                borderColor: 'rgba(16, 185, 129, 0.28)',
                background: 'linear-gradient(90deg, rgba(236,253,245,0.95) 0%, rgba(239,246,255,0.95) 100%)',
              }}
            >
              <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700 sm:text-[10px]">
                Open Source · Not For Profit
              </span>
              <span className="hidden h-3 w-px bg-emerald-300/60 sm:block" aria-hidden="true" />
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-blue-600 sm:text-[10px]">
                AI For Health · Care For All
              </span>
            </div>

            {/* Headline leads — no competing eyebrow above it */}
            <h1
              className="hero-anim-headline mt-4 font-bold tracking-[-0.03em] text-slate-900 sm:mt-5"
              // Floor kept low: "Monitoring of Oncology" is forced onto one
              // line below (whitespace-nowrap, so it never breaks mid-phrase)
              // and needs enough room on narrow phones (260-360px) to avoid
              // clipping past the column edge -- re-verified against the same
              // 260-2560px sweep after each reduction. Ceiling lowered yet
              // another step (was 3.05rem) per request.
              style={{ fontSize: 'clamp(1.2rem, 7.2vw, 2.75rem)', lineHeight: 1.12, animationDelay: '0.1s' }}
            >
              Real-time Precision
              <br />
              <span className="whitespace-nowrap">
                Monitoring of{' '}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Oncology
                </span>
              </span>
            </h1>

            {/* Supporting line, set off by a rule rather than floating alone */}
            <div
              className="hero-anim-headline mt-4 flex items-center justify-center gap-3 sm:mt-5 lg:justify-start"
              style={{ animationDelay: '0.2s' }}
            >
              <span
                className="hidden h-5 w-[2px] shrink-0 rounded-full lg:block"
                style={{ background: 'linear-gradient(180deg, #2563eb, #06b6d4)' }}
                aria-hidden="true"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-[12px]">
                AI — Powered
              </p>
            </div>

            {/* Attribution demoted to a quiet footer line */}
            <p
              className="hero-anim-eyebrow mt-5 text-xs text-slate-400 sm:mt-6"
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

          {/* ── Mobile / tablet only: image sits below the copy, flush to the right edge.
               Sized down yet another step (was 120/155px tall, 190/220px wide)
               to track the smaller text above. ── */}
          <div className="relative -mr-4 flex h-[100px] items-center justify-end sm:-mr-6 sm:h-[130px] lg:hidden">
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
              className="relative z-10 h-auto w-[42%] max-w-[160px] object-contain sm:max-w-[185px]"
              style={{ filter: 'drop-shadow(0 24px 32px rgba(15, 23, 42, 0.16))' }}
            />
          </div>
        </div>
      </div>

      {/* ── Desktop only: image anchored to the TRUE viewport right edge.
           A direct child of the full-width <section>, so `right-0` is the real
           screen edge rather than the centered max-w-[1400px] container's edge.
           Column shrunk yet another step (was 31vw/460px) to track the smaller
           text beside it. ── */}
      <div className="pointer-events-none absolute right-0 top-[10%] hidden w-[26vw] max-w-[400px] items-start justify-end lg:flex">
        <div
          // Was h-[110%], taller than its own parent -- close enough to the
          // section's bottom edge for the ellipse's fade (previously reaching
          // transparent only at 76% of its radius) to still be faintly
          // visible right where overflow:hidden clipped it, compounding with
          // the two glow blobs above into a visible seam. Shrunk to fit
          // inside the parent and set to reach full transparency at 60%,
          // comfortably inside its own box regardless of viewport width.
          className="absolute right-0 top-1/2 -z-10 h-[95%] w-[90%] -translate-y-1/2"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 70% 50%, rgba(219,234,254,0.9) 0%, rgba(219,234,254,0.3) 40%, transparent 60%)',
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
        // Matches SampleReportSection's background (#f8fafc) so the two
        // sections read as one continuous surface with no visible seam.
        background: '#f8fafc',
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
        // Flat #f8fafc, matching HeroIntro above and SampleReportSection
        // below exactly -- a gradient here previously started at #ffffff
        // while HeroIntro ended at #f8fafc, and that mismatch was visible as
        // a hard line right at the section boundary. Flat + identical colors
        // on both sides is what actually removes the seam, not a gradient
        // (which just relocates the mismatch to wherever it doesn't line up).
        style={{ background: '#f8fafc' }}
      >
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-9 sm:py-11 lg:py-14">

          {/* Section Header — "The Pipeline" eyebrow removed per request; the
              heading alone carries the section label now. */}
          <div
            className="text-center mb-6 sm:mb-7 lg:mb-9"
            style={{
              opacity:   workflowInView ? 1 : 0,
              transform: workflowInView ? 'translateY(0)' : 'translateY(20px)',
              transition: isReduced
                ? 'none'
                : 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <h2
              className="font-bold leading-tight tracking-tight text-slate-900"
              style={{ fontSize: 'clamp(1.7rem, 4vw, 2.7rem)', letterSpacing: '-0.025em' }}
            >
              From Sample to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Clinical Insight
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base">
              Five stages, one continuous liquid biopsy workflow.
            </p>
          </div>

          {/* Desktop Layout (lg+) - equal-width cards in one row */}
          {/* Connectors are siblings of the card wrappers here, not nested
              inside them -- when a connector was nested inside the same
              flex-1 wrapper as its card, that wrapper's flex-basis had to
              fit both, so cards followed by a connector rendered narrower
              than the last card (which has none). That's the one thing that
              broke "every card is the same size": aspect-square makes the
              image height track its own width, so a wider last card was
              also visibly taller. Flattening the connector out to a
              non-growing sibling lets all 5 card wrappers share the row's
              width exactly evenly, independent of connector width. */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:gap-1.5 xl:gap-3">
            {WORKFLOW_STEPS.map((step, index) => (
              <Fragment key={step.id}>
                <div className="flex flex-1 items-center" style={{ minWidth: 0 }}>
                  <FlowCard
                    step={step}
                    index={index}
                    inView={workflowInView}
                    isReduced={isReduced}
                  />
                </div>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <DesktopConnector
                    inView={workflowInView}
                    delay={isReduced ? 0 : 0.08 + index * 0.08 + 0.25}
                    isReduced={isReduced}
                  />
                )}
              </Fragment>
            ))}
          </div>

          {/* Tablet Layout (sm → lg) - 3 top, 2 bottom.
              Row 2's wrapper width is computed algebraically from row 1's own
              math (3 flex-1 cards + 2 connectors + 2 gaps), not approximated
              with a flat `max-w-[66%]`. A flat percentage only happened to be
              exact at one specific container width -- flex's default
              flex-shrink:1 also amplified the mismatch further, since row 1's
              5-item content (3 cards + 2 connectors) can overflow its row
              and shrink while row 2's smaller 3-item content (2 cards + 1
              connector) often doesn't need to, so the two rows' flex-1 cards
              settled at different sizes even given identical container
              width. Solving row 2's width so that its 2 flex-1 cards + 1
              fixed-width connector land on exactly row 1's per-card width
              makes both rows match by construction, at every viewport width. */}
          <div className="hidden md:block lg:hidden">
            {/* First Row – 3 steps */}
            <div className="flex items-center gap-2">
              {WORKFLOW_STEPS.slice(0, 3).map((step, index) => (
                <Fragment key={step.id}>
                  <div className="flex flex-1 items-center" style={{ minWidth: 0 }}>
                    <FlowCard
                      step={step}
                      index={index}
                      inView={workflowInView}
                      isReduced={isReduced}
                    />
                  </div>
                  {index < 2 && (
                    <DesktopConnector
                      inView={workflowInView}
                      delay={isReduced ? 0 : 0.08 + index * 0.08 + 0.25}
                      isReduced={isReduced}
                    />
                  )}
                </Fragment>
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
            <div
              className="mx-auto flex items-center gap-2"
              style={{
                width: `calc(2 * ((100% - 2 * ${CARD_GAP_CSS} - 2 * ${CONNECTOR_WIDTH_CSS}) / 3) + ${CONNECTOR_WIDTH_CSS} + ${CARD_GAP_CSS})`,
              }}
            >
              {WORKFLOW_STEPS.slice(3).map((step, index) => (
                <Fragment key={step.id}>
                  <div className="flex flex-1 items-center" style={{ minWidth: 0 }}>
                    <FlowCard
                      step={step}
                      index={index + 3}
                      inView={workflowInView}
                      isReduced={isReduced}
                    />
                  </div>
                  {index === 0 && (
                    <DesktopConnector
                      inView={workflowInView}
                      delay={isReduced ? 0 : 0.75}
                      isReduced={isReduced}
                    />
                  )}
                </Fragment>
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

          {/* Legend — no border-t here: this section hands off directly into
              SampleReportSection below, and a hard divider line this close to
              that boundary read as a seam between the two "pages" rather than
              a rule within one. Spacing alone still separates it from the
              cards above. */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 lg:mt-10 lg:pt-8"
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