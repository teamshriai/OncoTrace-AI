import { useEffect, useRef, useState, useCallback, forwardRef } from 'react'

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(node) } },
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
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const h = (e) => setReduced(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return reduced
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE IMAGE
   ═══════════════════════════════════════════════════════ */

const HeroImage = forwardRef(function HeroImage(
  {
    src, alt, priority = false, className = '',
    containerClassName = '', overlays, children,
    style = {}, containerStyle = {},
    objectPosition = 'center center',
    fallbackGradient = 'linear-gradient(135deg, #0a1628 0%, #162033 50%, #0f1d32 100%)',
    fallbackIcon = '🔬', fallbackLabel = 'OncoTrace-AI',
  },
  ref,
) {
  const [status, setStatus] = useState('loading')
  const internalRef = useRef(null)
  const setRefs = useCallback((node) => {
    internalRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])

  return (
    <div
      ref={setRefs}
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ background: fallbackGradient, ...containerStyle }}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0" style={{ background: fallbackGradient }} />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.04) 50%, transparent 75%)',
            backgroundSize: '200% 100%',
            animation: 'heroShimmerBar 1.8s ease-in-out infinite',
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 animate-pulse">
              <span className="text-2xl sm:text-3xl block mb-2 opacity-40">{fallbackIcon}</span>
              <span className="text-white/20 text-[10px] sm:text-xs font-['DM_Sans'] tracking-[0.15em] uppercase">Loading...</span>
            </div>
          </div>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center" style={{ background: fallbackGradient }}>
          <div className="text-center px-4">
            <span className="text-3xl sm:text-4xl md:text-5xl block mb-3">{fallbackIcon}</span>
            <span className="text-white/30 text-xs sm:text-sm font-['DM_Sans'] tracking-[0.12em] uppercase font-semibold block mb-1">{fallbackLabel}</span>
            <span className="text-white/15 text-[10px] sm:text-[11px] font-['Plus_Jakarta_Sans'] font-light">Precision Oncology Platform</span>
          </div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(147,197,253,0.8) 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
        </div>
      )}
      <img
        src={src} alt={alt}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out ${className}`}
        style={{ objectFit: 'cover', objectPosition, opacity: status === 'loaded' ? 1 : 0, ...style }}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? undefined : 'lazy'}
        draggable={false}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      {overlays}{children}
    </div>
  )
})

/* ═══════════════════════════════════════════════════════
   SCOPED CSS
   ═══════════════════════════════════════════════════════ */

const scopedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  .hero-root *, .hero-root *::before, .hero-root *::after { box-sizing: border-box; }
  .hero-root img, .hero-root svg, .hero-root video, .hero-root canvas { display: block; max-width: 100%; }

  @media (prefers-reduced-motion: reduce) {
    .hero-root *, .hero-root *::before, .hero-root *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.15s !important;
    }
  }

  .hero-root button:focus-visible, .hero-root a:focus-visible {
    outline: 2px solid #3b82f6; outline-offset: 2px;
  }

  @keyframes heroTextReveal {
    from { opacity: 0; transform: translateY(60px) rotateX(12deg); }
    to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
  }
  @keyframes heroPulseRing {
    0%   { transform: translate(-50%,-50%) scale(.95); opacity:.5; }
    50%  { transform: translate(-50%,-50%) scale(1.05); opacity:.8; }
    100% { transform: translate(-50%,-50%) scale(.95); opacity:.5; }
  }
  @keyframes heroGradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes heroMarqueeScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes heroFloatUp {
    0%   { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroLineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes heroDotPulse {
    0%,100% { box-shadow: 0 0 6px rgba(255,140,50,.9); }
    50%     { box-shadow: 0 0 18px rgba(255,140,50,1); }
  }
  @keyframes heroNeonFlicker {
    0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:.8; } 94% { opacity:1; }
    96% { opacity:.9; } 97% { opacity:1; }
  }
  @keyframes heroSubtleFloat {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes heroShimmerBar {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

const anim = (name, delay = 0, duration = '0.7s', ease = 'cubic-bezier(0.16,1,0.3,1)') =>
  `${name} ${duration} ${ease} ${delay}s both`

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT

   Props:
     onNavigate(target) — provided by App.jsx / React Router layer
       call onNavigate('lb')    → navigates to /Book-LB
       call onNavigate('mammo') → navigates to /Book-Mammo

   NO imports of LBdemo or Mirai here.
   NO internal view/routing state.
   ═══════════════════════════════════════════════════════ */

export default function HeroSection({ onNavigate }) {
  const styleRef = useRef(null)
  const mainRef  = useRef(null)
  const dCardRef = useRef(null)
  const mCardRef = useRef(null)

  useInView(dCardRef, 0.12)
  useInView(mCardRef, 0.1)
  useReducedMotion()

  useEffect(() => {
    if (!styleRef.current) {
      const tag = document.createElement('style')
      tag.setAttribute('data-hero-section', '')
      tag.textContent = scopedCSS
      document.head.appendChild(tag)
      styleRef.current = tag
    }
    return () => {
      if (styleRef.current) { styleRef.current.remove(); styleRef.current = null }
    }
  }, [])

  const handleLB    = useCallback(() => onNavigate?.('lb'),    [onNavigate])
  const handleMammo = useCallback(() => onNavigate?.('mammo'), [onNavigate])

  return (
    <div className="hero-root" ref={mainRef}>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-white focus:text-blue-600 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* ══════════ SECTION 1 — Dark hero ══════════ */}
      <section
        className="relative w-full overflow-hidden bg-[#001030] min-h-screen"
        aria-label="Hero section"
      >
        {/* ambient orbs */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[min(700px,140vw)] h-[min(700px,140vw)] rounded-full pointer-events-none z-0 opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,rgba(255,140,50,0.4),transparent 65%)', animation: 'heroSubtleFloat 12s ease-in-out infinite', willChange: 'transform' }}
        />
        <div
          className="absolute bottom-[-15%] left-[-8%] w-[min(500px,100vw)] h-[min(500px,100vw)] rounded-full pointer-events-none z-0 opacity-[0.05]"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.5),transparent 65%)', animation: 'heroSubtleFloat 15s ease-in-out 3s infinite', willChange: 'transform' }}
        />

        {/* main grid */}
        <div className="relative w-full min-h-screen grid grid-cols-1 lg:grid-cols-[3fr_2fr] xl:grid-cols-[3.2fr_1.8fr]">

          {/* LEFT — cover image */}
          <HeroImage
            src="/cover-image.png"
            alt="AI-powered precision oncology monitoring — diagnostic imaging analysis"
            priority
            containerClassName="relative w-full min-h-[240px] h-[35vh] sm:h-[40vh] md:h-[45vh] lg:h-auto lg:min-h-screen"
            objectPosition="center 38%"
            fallbackGradient="linear-gradient(135deg, #001030 0%, #0a1e3d 40%, #0d2847 100%)"
            overlays={
              <>
                <div className="absolute inset-0 z-[2]"
                  style={{ background: 'linear-gradient(180deg, rgba(0,16,48,0.45) 0%, rgba(0,16,48,0.05) 18%, transparent 40%, rgba(0,16,48,0.2) 100%)' }} />
                <div className="absolute inset-0 z-[3] hidden lg:block"
                  style={{ background: 'linear-gradient(90deg, transparent 45%, rgba(0,16,48,0.94) 100%)' }} />
                <div className="absolute inset-0 z-[3] block lg:hidden"
                  style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(0,16,48,0.92) 100%)' }} />
                <div className="absolute inset-0 opacity-[0.02] z-[4] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle,rgba(147,197,253,0.8) 0.5px,transparent 0.5px)', backgroundSize: '40px 40px' }} />
                <div className="absolute inset-0 z-[5] pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 100px rgba(0,16,48,0.25)' }} />

                {/* Desktop badge */}
                <div
                  className="absolute inset-x-0 top-0 z-[8] hidden lg:flex flex-col items-center pointer-events-none pt-8 xl:pt-12 2xl:pt-16 gap-2.5 xl:gap-4"
                  style={{ animation: anim('heroFloatUp', 0.1, '1s') }}
                >
                  <div className="pointer-events-auto relative">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
                      style={{ background: 'radial-gradient(circle, rgba(255,140,50,0.6), transparent 70%)' }} />
                    <span
                      className="relative inline-flex items-center gap-3 xl:gap-4 text-[20px] lg:text-[26px] xl:text-[32px] 2xl:text-[38px] font-extrabold tracking-[0.12em] uppercase font-['DM_Sans'] whitespace-nowrap px-2"
                      style={{ color: '#ff8c32', textShadow: '0 0 40px rgba(255,140,50,0.5), 0 0 80px rgba(255,140,50,0.25)', animation: 'heroNeonFlicker 4s ease-in-out infinite' }}
                    >
                      <span className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 rounded-full flex-shrink-0"
                        style={{ background: '#ff8c32', boxShadow: '0 0 12px rgba(255,140,50,0.9), 0 0 30px rgba(255,140,50,0.5)', animation: 'heroDotPulse 2s ease-in-out infinite' }} />
                      Open Source · Not for Profit
                    </span>
                  </div>
                  <span
                    className="pointer-events-auto text-[15px] lg:text-[18px] xl:text-[22px] 2xl:text-[26px] font-semibold tracking-[0.22em] uppercase font-['DM_Sans']"
                    style={{ color: '#ff8c32', opacity: 0.5, textShadow: '0 0 20px rgba(255,140,50,0.25)' }}
                  >
                    AI For Health, Care For All!
                  </span>
                </div>
              </>
            }
          />

          {/* RIGHT — text content */}
          <div className="relative z-[5] flex flex-col items-center lg:items-start justify-center text-center lg:text-left px-5 py-6 sm:px-7 sm:py-8 md:px-10 md:py-10 lg:pl-8 lg:pr-5 lg:py-6 xl:pl-12 xl:pr-8 xl:py-10 2xl:pl-16 2xl:pr-12 2xl:py-14 min-h-[50vh] sm:min-h-[48vh] lg:min-h-0">

            {/* ambient rings */}
            <div className="absolute w-[min(420px,90vw)] h-[min(420px,90vw)] rounded-full top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2 pointer-events-none z-0"
              style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.04) 0%,transparent 70%)' }} />
            <div className="absolute w-72 h-72 rounded-full border border-blue-500/[0.03] top-1/2 left-1/2 pointer-events-none z-0"
              style={{ animation: 'heroPulseRing 7s ease-in-out infinite', willChange: 'transform' }} />

            {/* Mobile badge */}
            <div
              className="flex lg:hidden flex-col items-center gap-2 mb-4 sm:mb-5 relative z-10 w-full"
              style={{ animation: anim('heroFloatUp', 0.1, '1s') }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-xl opacity-20"
                  style={{ background: 'radial-gradient(circle, rgba(255,140,50,0.5), transparent 70%)' }} />
                <span
                  className="relative inline-flex items-center gap-2.5 text-[14px] sm:text-[17px] md:text-[20px] font-extrabold tracking-[0.1em] uppercase font-['DM_Sans']"
                  style={{ color: '#ff8c32', textShadow: '0 0 30px rgba(255,140,50,0.45)' }}
                >
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ background: '#ff8c32', boxShadow: '0 0 10px rgba(255,140,50,0.9)', animation: 'heroDotPulse 2s ease-in-out infinite' }} />
                  Open Source · Not for Profit
                </span>
              </div>
              <span
                className="text-[10px] sm:text-[12px] md:text-[14px] font-semibold tracking-[0.15em] uppercase font-['DM_Sans']"
                style={{ color: '#ff8c32', opacity: 0.45 }}
              >
                AI For Health, Care For All!
              </span>
            </div>

            {/* eyebrow */}
            <span
              className="relative z-10 font-['DM_Sans'] text-[clamp(7px,1.2vw,11px)] text-white/20 tracking-[0.25em] uppercase font-medium mb-2 sm:mb-3 lg:mb-5 xl:mb-6 flex items-center justify-center lg:justify-start w-full"
              style={{ animation: anim('heroFloatUp', 0.2, '1s') }}
            >
              <span className="inline-block w-4 sm:w-5 lg:w-6 h-px mr-2 sm:mr-3 flex-shrink-0"
                style={{ background: 'linear-gradient(90deg,rgba(255,140,50,0.5),rgba(255,140,50,0.05))' }} />
              OncoTrace-AI Platform
            </span>

            {/* headline */}
            <h1 className="relative z-10 m-0 p-0" style={{ perspective: '800px' }}>
              {[
                { text: 'AI-powered',  type: 'light'  },
                { text: 'Real-time',   type: 'bold'   },
                { text: 'Precision',   type: 'bold'   },
                { text: 'Monitoring',  type: 'accent' },
                { text: 'of Oncology', type: 'accent' },
              ].map((line, i) => {
                const base = `block font-['Outfit'] leading-[0.88] tracking-[-0.05em]
                  text-[clamp(1.3rem,6.5vw,1.8rem)]
                  sm:text-[clamp(1.6rem,5.5vw,2.4rem)]
                  md:text-[clamp(1.8rem,4.5vw,2.8rem)]
                  lg:text-[clamp(1.5rem,2.6vw,2.6rem)]
                  xl:text-[clamp(2rem,3.2vw,3.6rem)]
                  2xl:text-[clamp(2.5rem,3.5vw,5rem)]`
                let variant = '', gs = {}
                if (line.type === 'light') {
                  variant = 'font-extralight'
                  gs = { color: 'rgba(148,163,184,0.4)', animation: `heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.18}s both`, willChange: 'transform, opacity' }
                } else if (line.type === 'bold') {
                  variant = 'font-extrabold'
                  gs = {
                    background: 'linear-gradient(135deg,#bfdbfe 0%,#93c5fd 15%,#fff 40%,#e2e8f0 55%,#93c5fd 70%,#60a5fa 100%)',
                    backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    animation: `heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.18}s both, heroGradientShift 8s ease infinite`,
                    willChange: 'transform, opacity',
                  }
                } else {
                  variant = 'font-semibold'
                  gs = {
                    background: 'linear-gradient(90deg,#3b82f6,#60a5fa,#93c5fd,#60a5fa,#3b82f6)',
                    backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    animation: `heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.18}s both, heroGradientShift 6s ease infinite`,
                    willChange: 'transform, opacity',
                  }
                }
                return <span key={i} className={`${base} ${variant}`} style={gs}>{line.text}</span>
              })}
            </h1>

            {/* accent line */}
            <div
              className="relative z-10 w-10 sm:w-14 lg:w-16 xl:w-20 h-px mt-3 sm:mt-4 lg:mt-7 xl:mt-8 mb-2.5 sm:mb-3 lg:mb-5 xl:mb-6 mx-auto lg:mx-0"
              style={{ background: 'linear-gradient(90deg,rgba(255,140,50,0.6),rgba(59,130,246,0.3),rgba(59,130,246,0.02))', transformOrigin: 'left', animation: 'heroLineGrow 1.2s ease-out 0.9s both' }}
            />

            {/* description */}
            <p
              className="relative z-10 font-['Plus_Jakarta_Sans'] text-[clamp(10px,1.4vw,14px)] text-white/90 leading-[1.7] sm:leading-[1.75] max-w-[320px] sm:max-w-[360px] lg:max-w-[340px] xl:max-w-[380px] font-light tracking-[0.015em] mx-auto lg:mx-0"
              style={{ animation: anim('heroFloatUp', 1, '1s') }}
            >
              AI-based risk prediction meets liquid biopsy — from forecasting cancer risk using imaging data to non-invasive, continuous progression tracking. Pure precision intelligence — open source and built for every community.
            </p>

            {/* ═══ DUAL CTA BUTTONS ═══ */}
            <div
              className="relative z-10 flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-5 lg:mt-7 xl:mt-9 justify-center lg:justify-start w-full sm:w-auto"
              style={{ animation: anim('heroFloatUp', 1.1, '1s') }}
            >
              {/* Primary — Liquid Biopsy */}
              <button
                onClick={handleLB}
                type="button"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-3.5 xl:px-9 xl:py-4 rounded-[4px] font-['DM_Sans'] text-[clamp(10px,1.2vw,13px)] font-semibold tracking-[0.05em] uppercase text-white transition-all duration-300 ease-out border-none cursor-pointer w-full sm:w-auto min-h-[48px] bg-gradient-to-br from-blue-600 to-blue-500 shadow-[0_8px_32px_rgba(37,99,235,0.3),0_2px_8px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(37,99,235,0.4)] active:translate-y-0"
                aria-label="Book a demo for the Liquid Biopsy platform"
              >
                <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent group-hover:left-full transition-all duration-500" />
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="relative z-10">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" />
                  <path d="M5 8h6M8 5v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="relative z-10">Book Demo — Liquid Biopsy</span>
              </button>

              {/* Secondary — Mammogram */}
              <button
                onClick={handleMammo}
                type="button"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-3.5 xl:px-9 xl:py-4 rounded-[4px] font-['DM_Sans'] text-[clamp(10px,1.2vw,13px)] font-semibold tracking-[0.05em] uppercase text-white/90 transition-all duration-300 ease-out cursor-pointer w-full sm:w-auto min-h-[48px] bg-white/[0.07] backdrop-blur-sm hover:bg-white/[0.12] hover:-translate-y-0.5 active:translate-y-0"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                aria-label="Book a demo for the Mammogram AI platform"
              >
                <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent group-hover:left-full transition-all duration-500" />
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="relative z-10">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="2.5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="0.8" fill="rgba(255,255,255,0.8)" />
                </svg>
                <span className="relative z-10">Book Demo — Mammogram</span>
              </button>
            </div>

            {/* status indicators */}
            <div
              className="relative z-10 mt-4 sm:mt-6 lg:mt-8 xl:mt-10 flex flex-wrap items-center gap-3 sm:gap-5 justify-center lg:justify-start pb-4 lg:pb-0"
              style={{ animation: anim('heroFloatUp', 1.3, '1s') }}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff8c32', boxShadow: '0 0 6px rgba(255,140,50,0.6)' }} />
                <span className="font-['DM_Sans'] text-[clamp(7px,1vw,9.5px)] text-white/25 tracking-[0.1em] uppercase">AI Prediction Live</span>
              </div>
              <div className="w-px h-2.5 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                <span className="font-['DM_Sans'] text-[clamp(7px,1vw,9.5px)] text-white/25 tracking-[0.1em] uppercase">Liquid Biopsy R&amp;D</span>
              </div>
              <div className="w-px h-2.5 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400/60" />
                <span className="font-['DM_Sans'] text-[clamp(7px,1vw,9.5px)] text-white/25 tracking-[0.1em] uppercase">Mirai Mammogram</span>
              </div>
            </div>
          </div>
        </div>

        {/* corner accents */}
        {[
          'top-5 left-5 xl:top-7 xl:left-7 border-l border-t',
          'top-5 right-5 xl:top-7 xl:right-7 border-r border-t',
          'bottom-5 left-5 xl:bottom-7 xl:left-7 border-l border-b',
          'bottom-5 right-5 xl:bottom-7 xl:right-7 border-r border-b',
        ].map((pos, i) => (
          <div key={i} className={`hidden xl:block absolute ${pos} w-10 h-10 xl:w-12 xl:h-12 z-[4] pointer-events-none`}
            style={{ borderColor: i < 2 ? 'rgba(255,140,50,0.12)' : 'rgba(59,130,246,0.08)' }} />
        ))}

        {/* marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-[5] overflow-hidden pointer-events-none opacity-[0.02] md:opacity-[0.03] py-1 sm:py-2" aria-hidden="true">
          <div className="flex whitespace-nowrap" style={{ animation: 'heroMarqueeScroll 35s linear infinite', willChange: 'transform' }}>
            {Array(4).fill(null).map((_, i) => (
              <span key={i} className="font-['Outfit'] text-[clamp(14px,3vw,3rem)] font-extrabold text-white px-3 sm:px-5 md:px-8 uppercase tracking-[0.05em]">
                AI Prediction — Liquid Biopsy — Real-Time Monitoring — Precision Oncology — Mammogram AI — Mirai —
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SECTION 2 — Platform showcase ══════════ */}
      <section
        id="home"
        className="relative w-full overflow-hidden bg-[#f0f2f5] font-['Source_Sans_3']"
        aria-label="OncoTrace-AI platform showcase"
      >
        {/* DESKTOP */}
        <div className="hidden lg:block relative w-full">
          <HeroImage
            ref={dCardRef}
            src="/model.png"
            alt="OncoTrace-AI precision oncology platform — full dashboard"
            containerClassName="relative w-full h-screen"
            objectPosition="center 58%"
            style={{ transform: 'scale(1.015)' }}
            fallbackGradient="linear-gradient(135deg, #e8ecf1 0%, #f0f2f5 50%, #e2e7ed 100%)"
            fallbackIcon="🧬"
            fallbackLabel="OncoTrace-AI"
          />
        </div>

        {/* MOBILE / TABLET */}
        <div className="block lg:hidden w-full bg-[#f0f2f5]">
          <HeroImage
            ref={mCardRef}
            src="/mobile.png"
            alt="OncoTrace-AI precision oncology platform — mobile view"
            containerClassName="relative w-full h-[60vh] sm:h-[65vh] md:h-[72vh]"
            objectPosition="center center"
            fallbackGradient="linear-gradient(135deg, #e8ecf1 0%, #f0f2f5 50%, #e2e7ed 100%)"
            fallbackIcon="🧬"
            fallbackLabel="OncoTrace-AI"
          />
        </div>
      </section>
    </div>
  )
}