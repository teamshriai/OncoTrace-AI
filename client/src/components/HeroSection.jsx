import { useEffect, useRef, useState } from 'react'

const CORNER_ACCENTS = [
  { pos: 'top-5 left-5 xl:top-7 xl:left-7 border-l border-t', warm: true },
  { pos: 'bottom-5 left-5 xl:bottom-7 xl:left-7 border-l border-b', warm: false },
  { pos: 'bottom-5 right-5 xl:bottom-7 xl:right-7 border-r border-b', warm: false },
]

const WORKFLOW_STEPS = [
  { id: 1, label: 'Blood Draw',         icon: '/img1.png', color: '#64748b' },
  { id: 2, label: 'Plasma Separation',  icon: '/img2.png', color: '#3b82f6' },
  { id: 3, label: 'ctDNA + NGS',        icon: '/img3.png', color: '#6366f1' },
  { id: 4, label: 'AI Analysis',        icon: '/img4.png', color: '#0ea5e9' },
  { id: 5, label: 'Clinician Decision', icon: '/img5.png', color: '#475569' },
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

  @keyframes heroGradientShift {
    0%, 100% { background-position: 0% 50%; }
    50%       { background-position: 100% 50%; }
  }

  @keyframes heroGoldenGlow {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.7; }
  }

  @keyframes heroBadgePulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.82; }
  }

  /* ─── Workflow circles ─── */
  .wf-circle {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s ease;
  }
  .wf-circle:hover { 
    transform: translateY(-8px) scale(1.03); 
  }

  .wf-label { 
    transition: color 0.2s ease, transform 0.2s ease; 
  }
  
  .wf-wrapper:hover .wf-label { 
    color: #1e40af; 
    transform: scale(1.02); 
  }

  .golden-glow { 
    animation: heroGoldenGlow 3s ease-in-out infinite; 
  }

  /* ═══════════════════════════════════════════════
     LEFT OVERLAY BLOCK — desktop
     ═══════════════════════════════════════════════ */
  .hero-overlay-left {
    position: absolute;
    left:     7%;
    top:      10%;
    z-index:  10;
    pointer-events: none;
    user-select: none;
    max-width: 38%;
  }

  .hero-badge-open-source {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 800;
    letter-spacing: 0.055em;
    text-transform: uppercase;
    color: #b45309;
    line-height: 1.15;
    white-space: nowrap;
    font-size: clamp(8px, 1.55vw, 22px);
    animation: heroBadgePulse 4s ease-in-out infinite;
    display: block;
  }

  .hero-badge-tagline {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b7280;
    margin-top: 0.35em;
    white-space: nowrap;
    font-size: clamp(6px, 0.9vw, 13px);
    display: block;
  }

  /* ═══════════════════════════════════════════════
     RIGHT OVERLAY BLOCK — desktop
     ═══════════════════════════════════════════════ */
  .hero-overlay-right {
    position:   absolute;
    left:       63%;
    top:        7%;
    right:      2%;
    z-index:    10;
    max-width:  34%;
    user-select: none;
    pointer-events: none;
  }

  .hero-ai-powered-label {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #dc2626;
    white-space: nowrap;
    font-size: clamp(6px, 0.82vw, 13px);
    margin-bottom: 0.25em;
    display: block;
    pointer-events: none;
  }

  .hero-main-headline {
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 700;
    color: #1e3a8a;
    font-size: clamp(12px, 3.2vw, 48px);
    line-height: 1.12;
    letter-spacing: -0.01em;
    margin: 0;
    display: block;
    overflow-wrap: break-word;
    word-break: break-word;
    pointer-events: none;
    cursor: default;
  }

  .hero-powered-by-link {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 400;
    color: #dc2626;
    margin-top: 0.5em;
    white-space: nowrap;
    font-size: clamp(5px, 0.82vw, 12px);
    letter-spacing: 0.01em;
    display: inline-block;
    pointer-events: auto;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s ease, text-decoration-color 0.2s ease;
  }

  .hero-powered-by-link:hover {
    color: #991b1b;
    text-decoration: underline;
    text-decoration-color: #991b1b60;
    text-underline-offset: 2px;
  }

  /* ═══════════════════════════════════════════════
     MOBILE OVERRIDES  (< 480px)
     ═══════════════════════════════════════════════ */
  @media (max-width: 479px) {

    .hero-overlay-left {
      left:      4%;
      top:       6%;
      max-width: 44%;
    }

    .hero-overlay-right {
      left:      52%;
      top:       5%;
      right:     2%;
      max-width: 46%;
    }

    .hero-badge-open-source {
      font-size:   clamp(5px, 2.4vw, 11px);
      white-space: normal;
    }

    .hero-badge-tagline {
      font-size:   clamp(4px, 1.7vw, 8px);
      margin-top:  0.2em;
      white-space: normal;
    }

    .hero-ai-powered-label {
      font-size:   clamp(4px, 1.6vw, 7px);
      white-space: normal;
      margin-bottom: 0.1em;
    }

    .hero-main-headline {
      font-size:   clamp(7px, 2.9vw, 13px);
      line-height: 1.15;
    }

    .hero-powered-by-link {
      font-size:  clamp(3px, 1.6vw, 7px);
      margin-top: 0.1em;
      white-space: normal;
    }
  }

  /* Tablet specific adjustments */
  @media (min-width: 768px) and (max-width: 1023px) {
    .hero-overlay-left {
      left:      5%;
      top:       8%;
      max-width: 40%;
    }

    .hero-overlay-right {
      left:      58%;
      top:       6%;
      max-width: 38%;
    }
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
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') { 
      setInView(true)
      return 
    }

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
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

/* ═══════════════════════════════════════════════════════
   WORKFLOW STEP CIRCLE
   ═══════════════════════════════════════════════════════ */

function WorkflowStepCircle({ step, index, inView, isReduced }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError,  setImgError]  = useState(false)

  const entryDelay = isReduced ? 0 : index * 0.08
  const circleSize = 'clamp(140px, 18vw, 260px)'

  return (
    <div
      className="wf-wrapper flex flex-col items-center"
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: isReduced
          ? 'none'
          : `opacity 0.5s ease ${entryDelay}s, transform 0.5s ease ${entryDelay}s`,
      }}
    >
      {/* Step Number Badge */}
      <div
        className="relative z-10 mb-3 flex items-center justify-center rounded-full font-bold text-white shadow-lg flex-shrink-0"
        style={{
          width:      36,
          height:     36,
          fontSize:   14,
          background: `linear-gradient(135deg, ${step.color}ee, ${step.color})`,
          boxShadow:  `0 3px 10px ${step.color}60`,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {step.id}
      </div>

      {/* Container for glow + circle - helps with alignment */}
      <div className="relative flex items-center justify-center">
        {/* Golden Glow */}
        <div
          className="absolute golden-glow rounded-full pointer-events-none"
          style={{
            width:      `calc(${circleSize} + 24px)`,
            height:     `calc(${circleSize} + 24px)`,
            background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.08) 50%, transparent 70%)',
            filter:     'blur(8px)',
            zIndex:     0,
          }}
          aria-hidden="true"
        />

        {/* Circle */}
        <div
          className="wf-circle relative rounded-full overflow-hidden bg-white flex-shrink-0"
          style={{
            width:     circleSize,
            height:    circleSize,
            border:    `3px solid ${step.color}50`,
            boxShadow: `0 6px 20px rgba(0,0,0,0.1),
                        0 2px 6px rgba(0,0,0,0.06),
                        0 0 0 6px rgba(251,191,36,0.08),
                        inset 0 0 0 2px ${step.color}20`,
            zIndex: 1,
          }}
        >
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <div
                className="w-10 h-10 border-4 border-slate-200 border-t-slate-400 rounded-full"
                style={{ animation: 'heroSpin 0.8s linear infinite' }}
              />
            </div>
          )}

          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <svg width="40%" height="40%" viewBox="0 0 48 48" fill="none">
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
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.25) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>

      {/* Label */}
      <div className="mt-4 px-3" style={{ maxWidth: circleSize }}>
        <p
          className="wf-label text-center font-bold text-slate-800 select-none leading-tight"
          style={{
            fontFamily:    'Inter, system-ui, sans-serif',
            fontSize:      'clamp(13px, 1.35vw, 17px)',
            letterSpacing: '-0.02em',
            lineHeight:    1.25,
            wordBreak:     'break-word',
            hyphens:       'auto',
          }}
        >
          {step.label}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CONNECTORS - Perfectly centered arrows
   ═══════════════════════════════════════════════════════ */

const ARROW_FILL = 'rgba(147, 197, 253, 0.55)'

function DesktopConnector({ inView, delay, isReduced }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center self-start"
      style={{
        // Align arrow to center of circle:
        // Badge height (36px) + badge margin-bottom (12px) + half of circle
        marginTop: 'calc(36px + 12px + clamp(70px, 9vw, 130px))',
        width:      'clamp(35px, 4vw, 70px)',
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
   HERO IMAGE SECTION
   ═══════════════════════════════════════════════════════ */

function HeroImageSection() {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-label="Hero - AI-powered precision oncology platform"
      style={{ background: '#ffffff' }}
    >
      <div className="relative w-full">

        {/* Loading state */}
        {!imageLoaded && (
          <div 
            className="absolute inset-0 bg-slate-100 flex items-center justify-center"
            style={{ minHeight: '400px' }}
          >
            <div
              className="w-16 h-16 border-4 border-slate-300 border-t-slate-600 rounded-full"
              style={{ animation: 'heroSpin 1s linear infinite' }}
            />
          </div>
        )}

        {/* Cover image */}
        <img
          src="/trial.png"
          alt="AI Precision Diagnostics & Monitoring Centre"
          loading="eager"
          fetchPriority="high"
          draggable={false}
          onLoad={() => setImageLoaded(true)}
          className="w-full h-auto block"
          style={{
            minHeight:      'clamp(200px, 43vw, 780px)',
            maxHeight:      '90vh',
            objectFit:      'cover',
            objectPosition: 'center',
            opacity:        imageLoaded ? 1 : 0,
            transition:     'opacity 0.5s ease',
          }}
        />

        {/* LEFT OVERLAY */}
        <div
          className="hero-overlay-left"
          aria-label="Open source not for profit – AI for health, care for all"
        >
          <span className="hero-badge-open-source">
            Open Source Not For Profit
          </span>
          <span className="hero-badge-tagline">
            AI For Health&nbsp;|&nbsp;Care For All
          </span>
        </div>

        {/* RIGHT OVERLAY */}
        <div
          className="hero-overlay-right"
          aria-label="AI-Powered Real-time Precision Monitoring of Oncology"
        >
          <span className="hero-ai-powered-label">
            AI&nbsp;–&nbsp;Powered
          </span>

          <span className="hero-main-headline">
            Real-time Precision<br />
            Monitoring of Oncology
          </span>

          <a
            href="https://shri-ai.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-powered-by-link"
            aria-label="Visit Senus Healthcare and Research Institute"
          >
            Powered by  : Senus Healthcare and Research Institute (USA)
          </a>
        </div>

        {/* Corner Accents */}
        {CORNER_ACCENTS.map(({ pos, warm }) => (
          <div
            key={pos}
            aria-hidden="true"
            className={`hidden xl:block absolute ${pos} w-10 h-10 xl:w-12 xl:h-12 z-10 pointer-events-none`}
            style={{
              borderColor: warm
                ? 'rgba(251,191,36,0.35)'
                : 'rgba(59,130,246,0.25)',
            }}
          />
        ))}
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

      {/* Hero Image + Overlaid Text */}
      <HeroImageSection />

      {/* ── Workflow Section ── */}
      <section
        id="workflow-section"
        ref={workflowRef}
        className="relative w-full overflow-hidden"
        aria-label="Liquid Biopsy Deployment Model"
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
            <h2
              className="font-bold text-slate-900 leading-tight mb-4"
              style={{
                fontSize:      'clamp(1.8rem, 4.5vw, 3rem)',
                letterSpacing: '-0.025em',
              }}
            >
              <span
                style={{
                  background:           'linear-gradient(135deg, #784000d2 0%, #c57d00e2 35%, #fbbf24 65%, #d2a100de 100%)',
                  backgroundSize:       '200% 200%',
                  WebkitBackgroundClip: 'text',
                  backgroundClip:       'text',
                  WebkitTextFillColor:  'transparent',
                  animation:            isReduced ? 'none' : 'heroGradientShift 6s ease infinite',
                }}
              >
                Liquid Biopsy Deployment Model
              </span>
            </h2>
          </div>

          {/* Desktop Layout (lg+) - Horizontal row */}
          <div
            className="hidden lg:flex items-start justify-center flex-wrap"
            style={{ gap: 'clamp(4px, 0.5vw, 12px)' }}
          >
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-start">
                <WorkflowStepCircle
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

          {/* Tablet Layout (md → lg) - 3 top, 2 bottom */}
          <div className="hidden md:block lg:hidden">
            {/* First Row – 3 steps */}
            <div
              className="flex items-start justify-center flex-wrap"
              style={{ gap: 'clamp(6px, 1vw, 16px)' }}
            >
              {WORKFLOW_STEPS.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <WorkflowStepCircle
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
            <div
              className="flex items-start justify-center flex-wrap"
              style={{ gap: 'clamp(6px, 1vw, 16px)' }}
            >
              {WORKFLOW_STEPS.slice(3).map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <WorkflowStepCircle
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

          {/* Mobile Layout (< md) - Vertical stack */}
          <div className="flex md:hidden flex-col items-center">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center w-full max-w-md">
                <WorkflowStepCircle
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

        </div>
      </section>
    </div>
  )
}