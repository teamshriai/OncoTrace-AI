import { useEffect, useRef, useState, useCallback } from 'react'

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(node)
        }
      },
      { threshold }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold])

  return inView
}

const scopedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700;900&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  .hero-root *, .hero-root *::before, .hero-root *::after {
    box-sizing: border-box;
  }
  .hero-root img, .hero-root svg, .hero-root video, .hero-root canvas {
    display: block;
    max-width: 100%;
  }

  @keyframes heroTextReveal {
    from { opacity: 0; transform: translateY(60px) rotateX(12deg); }
    to { opacity: 1; transform: translateY(0) rotateX(0deg); }
  }
  @keyframes heroPulseRing {
    0% { transform: translate(-50%, -50%) scale(.95); opacity: .5; }
    50% { transform: translate(-50%, -50%) scale(1.05); opacity: .8; }
    100% { transform: translate(-50%, -50%) scale(.95); opacity: .5; }
  }
  @keyframes heroGradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes heroMarqueeScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes heroFloatUp {
    0% { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroLineGrow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  @keyframes heroDotPulse {
    0%, 100% { box-shadow: 0 0 6px rgba(255,140,50,.9); }
    50% { box-shadow: 0 0 18px rgba(255,140,50,1); }
  }
  @keyframes heroNeonFlicker {
    0%,100% { opacity:1; }
    92% { opacity:1; }
    93% { opacity:.8; }
    94% { opacity:1; }
    96% { opacity:.9; }
    97% { opacity:1; }
  }
  @keyframes heroSubtleFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes heroCheckStroke {
    to { stroke-dashoffset: 0; }
  }
  @keyframes heroPageExit {
    to { opacity: 0; transform: translateY(-18px) scale(0.99); }
  }
  @keyframes heroPageEnter {
    from { opacity: 0; transform: translateY(22px) scale(0.99); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes heroSuccessRipple {
    0% { transform: scale(1); opacity: 0.35; }
    100% { transform: scale(2.8); opacity: 0; }
  }
  @keyframes heroStaggerIn {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes heroBadgePulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  @keyframes heroSoftBounce {
    0% { transform: scale(0.6); opacity: 0; }
    60% { transform: scale(1.08); }
    80% { transform: scale(0.96); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes heroShimmerBar {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes heroBorderGlow {
    0%,100% { border-color: rgba(255,140,50,0.15); }
    50% { border-color: rgba(255,140,50,0.35); }
  }

  .hero-root .h-bi {
    width: 100%;
    padding: 13px 16px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #1e293b;
    outline: none;
    transition: all .25s ease;
    box-sizing: border-box;
  }
  .hero-root .h-bi:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.08);
  }
  .hero-root .h-bi::placeholder {
    color: #94a3b8;
    font-weight: 300;
  }
  .hero-root .h-bi:hover:not(:focus) {
    border-color: #cbd5e1;
  }
  .hero-root .h-bi[type="date"] {
    color-scheme: light;
  }

  .hero-root .h-bl {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 11.5px;
    font-weight: 600;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: .07em;
    margin-bottom: 6px;
  }

  .hero-root .h-bt {
    width: 100%;
    padding: 13px 16px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #1e293b;
    outline: none;
    transition: all .25s ease;
    resize: vertical;
    min-height: 100px;
    box-sizing: border-box;
  }
  .hero-root .h-bt:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.08);
  }
  .hero-root .h-bt::placeholder {
    color: #94a3b8;
    font-weight: 300;
  }
`

const getInitialFormData = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  date: '',
  message: '',
})

export default function HeroSection() {
  const [view, setView] = useState('hero')
  const [transition, setTransition] = useState('')
  const [formData, setFormData] = useState(getInitialFormData())
  const styleRef = useRef(null)

  const dCardRef = useRef(null)
  const mCardRef = useRef(null)
  const dCardVis = useInView(dCardRef, 0.12)
  const mCardVis = useInView(mCardRef, 0.1)

  useEffect(() => {
    if (!styleRef.current) {
      const tag = document.createElement('style')
      tag.setAttribute('data-hero-section', '')
      tag.textContent = scopedCSS
      document.head.appendChild(tag)
      styleRef.current = tag
    }
    return () => {
      if (styleRef.current) {
        styleRef.current.remove()
        styleRef.current = null
      }
    }
  }, [])

  const navigateTo = useCallback((target) => {
    setTransition('exit')
    setTimeout(() => {
      setView(target)
      if (target === 'hero') setFormData(getInitialFormData())
      window.scrollTo(0, 0)
      setTransition('enter')
      setTimeout(() => setTransition(''), 650)
    }, 420)
  }, [])

  const handleChange = useCallback(
    (field) => (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    },
    []
  )

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      navigateTo('success')
    },
    [navigateTo]
  )

  const wrapStyle =
    transition === 'exit'
      ? { animation: 'heroPageExit 0.42s ease-in forwards' }
      : transition === 'enter'
      ? {
          animation:
            'heroPageEnter 0.58s cubic-bezier(0.16,1,0.3,1) forwards',
        }
      : {}

  /* ═══════════════ BOOKING VIEW ═══════════════ */
  if (view === 'booking') {
    return (
      <div className="hero-root" style={wrapStyle}>
        <div className="relative min-h-screen bg-[#f8fafc]">
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(59,130,246,0.04), transparent 65%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(99,102,241,0.03), transparent 65%)',
            }}
          />

          <main className="relative z-10 max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 md:pb-16">
            <div
              className="flex items-center justify-between mb-8 sm:mb-10"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s both',
              }}
            >
              <button
                onClick={() => navigateTo('hero')}
                className="inline-flex items-center gap-2.5 bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-5 py-2.5 sm:px-6 sm:py-3 text-slate-600 hover:text-slate-900 font-['DM_Sans'] text-[13px] sm:text-[14px] font-semibold tracking-wide transition-all duration-200 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:border-slate-300"
                type="button"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>

              <span className="font-['Outfit'] text-[17px] sm:text-[19px] font-bold tracking-[-0.01em] text-slate-800">
                Shri<span className="text-blue-600">-AI</span>
              </span>
            </div>

            <div
              className="text-center mb-10 sm:mb-12"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both',
              }}
            >
              <h1 className="font-['Outfit'] text-[1.85rem] sm:text-[2.2rem] md:text-[2.6rem] font-bold text-slate-900 leading-[1.12] tracking-[-0.035em] mb-3">
                Explore OncoTrace
                <span
                  style={{
                    background:
                      'linear-gradient(135deg, #1d4ed8, #3b82f6, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  -AI
                </span>
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[13.5px] sm:text-[14.5px] text-slate-400 leading-[1.7] max-w-[420px] mx-auto font-light">
                Discover how AI-based cancer risk prediction and liquid
                biopsy-powered real-time monitoring come together for precision
                oncology.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)] border border-slate-100/80 p-6 sm:p-8 md:p-10"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both',
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="h-bl">
                      First Name <span className="text-red-400/70">*</span>
                    </label>
                    <input
                      type="text"
                      className="h-bi"
                      placeholder="Shri"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      required
                    />
                  </div>
                  <div>
                    <label className="h-bl">
                      Last Name <span className="text-red-400/70">*</span>
                    </label>
                    <input
                      type="text"
                      className="h-bi"
                      placeholder="Lakshmi"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="h-bl">
                    Email Address <span className="text-red-400/70">*</span>
                  </label>
                  <input
                    type="email"
                    className="h-bi"
                    placeholder="lakshmi@gmail.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="h-bl">Phone Number</label>
                    <input
                      type="tel"
                      className="h-bi"
                      placeholder="+91 0000000000"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                    />
                  </div>
                  <div>
                    <label className="h-bl">Preferred Date</label>
                    <input
                      type="date"
                      className="h-bi"
                      value={formData.date}
                      onChange={handleChange('date')}
                    />
                  </div>
                </div>

                <div>
                  <label className="h-bl">Additional Notes</label>
                  <textarea
                    className="h-bt"
                    placeholder="Tell us about your use case, research focus, or questions..."
                    value={formData.message}
                    onChange={handleChange('message')}
                    rows={4}
                  />
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button
                    type="submit"
                    className="group relative w-full sm:w-auto overflow-hidden inline-flex items-center justify-center gap-2.5 px-9 py-[14px] rounded-xl font-['DM_Sans'] text-[13px] font-semibold tracking-[0.03em] bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.25)] hover:shadow-[0_8px_36px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out border-none cursor-pointer"
                  >
                    <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent group-hover:left-full transition-all duration-500" />
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="relative z-10"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="relative z-10">Request Demo</span>
                  </button>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11.5px] text-slate-400 text-center sm:text-right font-light leading-snug">
                    We'll never share your data.
                    <br className="hidden sm:block" />
                    Privacy is our priority.
                  </span>
                </div>
              </form>
            </div>

            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-7"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.38s both',
              }}
            >
              {[
                { icon: '🔒', text: 'Secure & Private' },
                { icon: '⚡', text: 'Response within 24h' },
                { icon: '🌐', text: 'Open Source' },
              ].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 font-['DM_Sans'] text-[11px] text-slate-400 tracking-[0.03em]"
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </main>
        </div>
      </div>
    )
  }

  /* ═══════════════ SUCCESS VIEW ═══════════════ */
  if (view === 'success') {
    return (
      <div className="hero-root" style={wrapStyle}>
        <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center">
          <div
            className="absolute top-0 left-0 right-0 h-[3px] z-50"
            style={{
              background:
                'linear-gradient(90deg, #10b981, #34d399, #10b981)',
              backgroundSize: '300% 100%',
              animation: 'heroShimmerBar 3s linear infinite',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 text-center px-6 py-16 max-w-lg mx-auto">
            <div
              className="relative mx-auto mb-9 w-[100px] h-[100px]"
              style={{
                animation:
                  'heroSoftBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
              }}
            >
              <div
                className="absolute inset-0 rounded-full bg-emerald-200/50"
                style={{
                  animation:
                    'heroSuccessRipple 1.6s ease-out 0.5s forwards',
                }}
              />
              <div
                className="absolute inset-0 rounded-full bg-emerald-100/40"
                style={{
                  animation:
                    'heroSuccessRipple 1.6s ease-out 0.85s forwards',
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-[0_10px_40px_rgba(16,185,129,0.3)]" />
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
              >
                <path
                  d="M30 52 L43 65 L70 38"
                  stroke="white"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 65,
                    strokeDashoffset: 65,
                    animation:
                      'heroCheckStroke 0.5s ease-out 0.65s forwards',
                  }}
                />
              </svg>
            </div>

            <h1
              className="font-['Outfit'] text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-bold text-slate-900 tracking-[-0.04em] leading-none mb-4"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both',
              }}
            >
              Thank You!
            </h1>

            <div
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both',
              }}
              className="mb-6"
            >
              <span
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/70 text-blue-700 font-['DM_Sans'] text-[12px] sm:text-[13px] font-semibold tracking-[0.06em] uppercase px-5 sm:px-6 py-2 sm:py-2.5 rounded-full"
                style={{
                  animation:
                    'heroBadgePulse 3s ease-in-out 1.5s infinite',
                }}
              >
                <span className="text-[15px]">🚀</span>
                AI Prediction Live · Liquid Biopsy in R&D
              </span>
            </div>

            <p
              className="font-['Plus_Jakarta_Sans'] text-[13.5px] sm:text-[15px] text-slate-400 leading-[1.8] max-w-[400px] mx-auto mb-10 font-light"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s both',
              }}
            >
              Your demo has been booked successfully. We'll reach out shortly.
              Thank you for your interest in{' '}
              <span className="text-slate-600 font-medium">
                OncoTrace-AI
              </span>
              .
            </p>

            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-11"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both',
              }}
            >
              {[
                {
                  icon: '📧',
                  title: 'Confirmation',
                  desc: 'Email sent to your inbox',
                },
                {
                  icon: '📅',
                  title: 'Scheduling',
                  desc: "We'll confirm your slot",
                },
                {
                  icon: '🤝',
                  title: 'Demo Day',
                  desc: 'Personalized walkthrough',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-5 text-center hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-[1.6rem] mb-2.5 block">
                    {s.icon}
                  </span>
                  <span className="font-['DM_Sans'] text-[10.5px] font-bold text-slate-700 uppercase tracking-[0.07em] block mb-1">
                    {s.title}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11.5px] text-slate-400 font-light">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigateTo('hero')}
              className="group inline-flex items-center gap-2.5 px-8 py-[14px] rounded-xl font-['DM_Sans'] text-[13px] font-semibold tracking-[0.02em] bg-slate-900 text-white shadow-[0_4px_20px_rgba(15,23,42,0.18)] hover:shadow-[0_8px_36px_rgba(15,23,42,0.28)] hover:-translate-y-0.5 transition-all duration-300 ease-out border-none cursor-pointer"
              style={{
                animation:
                  'heroStaggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 1.1s both',
              }}
              type="button"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ═══════════════ HERO VIEW ═══════════════ */
  return (
    <div className="hero-root" style={wrapStyle}>
      {/* SECTION 1 — Dark hero */}
      <section className="relative w-full overflow-hidden bg-[#001030] min-h-screen">
        <div
          className="absolute top-[-20%] right-[-10%] w-[min(700px,140vw)] h-[min(700px,140vw)] rounded-full pointer-events-none z-0 opacity-[0.07]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,140,50,0.4), transparent 65%)',
            animation: 'heroSubtleFloat 12s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[-8%] w-[min(500px,100vw)] h-[min(500px,100vw)] rounded-full pointer-events-none z-0 opacity-[0.05]"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.5), transparent 65%)',
            animation: 'heroSubtleFloat 15s ease-in-out 3s infinite',
          }}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-[3.2fr_1.8fr] w-full min-h-screen">
          {/* Left — cover image */}
          <div className="relative overflow-hidden w-full min-h-[44vh] sm:min-h-[48vh] md:min-h-0">
            <img
              src="/cover-image.png"
              alt="AI-powered precision oncology monitoring"
              className="absolute inset-0 w-full h-full object-cover"
              fetchPriority="high"
              draggable={false}
            />

            <div
              className="absolute inset-0 z-[2]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,16,48,0.45) 0%, rgba(0,16,48,0.05) 20%, transparent 45%, rgba(0,16,48,0.15) 100%)',
              }}
            />
            <div
              className="absolute inset-0 z-[3] hidden md:block"
              style={{
                background:
                  'linear-gradient(90deg, transparent 50%, rgba(0,16,48,0.92) 100%)',
              }}
            />
            <div
              className="absolute inset-0 z-[3] block md:hidden"
              style={{
                background:
                  'linear-gradient(180deg, transparent 45%, rgba(0,16,48,0.88) 100%)',
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.02] z-[4] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(147,197,253,0.8) 0.5px, transparent 0.5px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* ── Desktop badge — no container, raw text ── */}
            <div
              className="absolute inset-0 z-[8] hidden md:flex flex-col items-center pointer-events-none pt-14 lg:pt-18 xl:pt-22 gap-3"
              style={{
                animation:
                  'heroFloatUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both',
              }}
            >
              <span
                className="pointer-events-auto inline-flex items-center gap-3 text-[16px] lg:text-[20px] xl:text-[24px] font-bold tracking-[0.12em] uppercase font-['DM_Sans'] whitespace-nowrap"
                style={{
                  color: '#ff8c32',
                  textShadow:
                    '0 0 30px rgba(255,140,50,0.5), 0 0 60px rgba(255,140,50,0.2)',
                  animation: 'heroNeonFlicker 4s ease-in-out infinite',
                }}
              >
                <span
                  className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0"
                  style={{
                    background: '#ff8c32',
                    boxShadow:
                      '0 0 10px rgba(255,140,50,0.9), 0 0 25px rgba(255,140,50,0.5)',
                    animation: 'heroDotPulse 2s ease-in-out infinite',
                  }}
                />
                Open Source · Not for Profit
              </span>

              <span
                className="pointer-events-auto text-[13px] lg:text-[16px] xl:text-[18px] font-medium tracking-[0.22em] uppercase font-['DM_Sans']"
                style={{
                  color: '#ff8c32',
                  opacity: 0.55,
                  textShadow: '0 0 15px rgba(255,140,50,0.25)',
                }}
              >
                AI For Health, Care For All!
              </span>
            </div>

            <div
              className="absolute inset-0 z-[5] pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 100px rgba(0,16,48,0.25)',
              }}
            />
          </div>

          {/* Right — text content */}
          <div className="relative z-[5] flex min-h-[56vh] md:min-h-0 flex-col items-center md:items-start justify-center text-center md:text-left px-5 py-8 sm:px-7 sm:py-10 md:pl-8 md:pr-5 md:py-6 lg:pl-12 lg:pr-8 lg:py-10 xl:pl-14 xl:pr-12 xl:py-12">
            <div
              className="absolute w-[420px] h-[420px] rounded-full top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2 pointer-events-none z-0"
              style={{
                background:
                  'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute w-72 h-72 rounded-full border border-blue-500/[0.03] top-1/2 left-1/2 pointer-events-none z-0"
              style={{
                animation: 'heroPulseRing 7s ease-in-out infinite',
              }}
            />

            {/* ── Mobile badge — no container, raw text ── */}
            <div
              className="flex md:hidden flex-col items-center gap-1.5 mb-4 relative z-10 w-full"
              style={{
                animation:
                  'heroFloatUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both',
              }}
            >
              <span
                className="inline-flex items-center gap-2 text-[12px] sm:text-[14px] font-bold tracking-[0.1em] uppercase font-['DM_Sans']"
                style={{
                  color: '#ff8c32',
                  textShadow:
                    '0 0 24px rgba(255,140,50,0.45), 0 0 50px rgba(255,140,50,0.15)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: '#ff8c32',
                    boxShadow:
                      '0 0 8px rgba(255,140,50,0.9), 0 0 20px rgba(255,140,50,0.4)',
                    animation: 'heroDotPulse 2s ease-in-out infinite',
                  }}
                />
                Open Source · Not for Profit
              </span>

              <span
                className="text-[8.5px] sm:text-[10px] font-medium tracking-[0.15em] uppercase font-['DM_Sans']"
                style={{ color: '#ff8c32', opacity: 0.5 }}
              >
                AI Prediction × Liquid Biopsy × Monitoring
              </span>
            </div>

            <span
              className="relative z-10 font-['DM_Sans'] text-[7.5px] sm:text-[8.5px] md:text-[10px] lg:text-[11px] text-white/20 tracking-[0.25em] uppercase font-medium mb-2.5 sm:mb-3 md:mb-5 lg:mb-6 flex items-center justify-center md:justify-start w-full"
              style={{
                animation:
                  'heroFloatUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both',
              }}
            >
              <span
                className="inline-block w-4 sm:w-5 md:w-6 h-px mr-2 sm:mr-3 flex-shrink-0"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(255,140,50,0.5), rgba(255,140,50,0.05))',
                }}
              />
              OncoTrace-AI Platform
            </span>

            <h1
              className="relative z-10 m-0 p-0"
              style={{ perspective: '800px' }}
            >
              {[
                { text: 'AI-powered', type: 'light' },
                { text: 'Real-time', type: 'bold' },
                { text: 'Precision', type: 'bold' },
                { text: 'Monitoring', type: 'accent' },
                { text: 'of Oncology', type: 'accent' },
              ].map((line, i) => {
                const base = `block font-['Outfit'] leading-[0.88] tracking-[-0.05em]
                  text-[clamp(1.35rem,7.5vw,2rem)]
                  sm:text-[clamp(1.6rem,6vw,2.5rem)]
                  md:text-[clamp(1.5rem,3vw,2.8rem)]
                  lg:text-[clamp(1.8rem,3.5vw,3.8rem)]
                  xl:text-[clamp(2.2rem,4vw,5rem)]
                  2xl:text-[clamp(2.6rem,4.2vw,5.8rem)]`

                let variant = ''
                let gs = {}

                if (line.type === 'light') {
                  variant = 'font-extralight'
                  gs = {
                    color: 'rgba(148,163,184,0.4)',
                    animation: `heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${
                      0.3 + i * 0.18
                    }s both`,
                  }
                } else if (line.type === 'bold') {
                  variant = 'font-extrabold'
                  gs = {
                    background:
                      'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 15%, #fff 40%, #e2e8f0 55%, #93c5fd 70%, #60a5fa 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${
                      0.3 + i * 0.18
                    }s both, heroGradientShift 8s ease infinite`,
                  }
                } else {
                  variant = 'font-semibold'
                  gs = {
                    background:
                      'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #60a5fa, #3b82f6)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `heroTextReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${
                      0.3 + i * 0.18
                    }s both, heroGradientShift 6s ease infinite`,
                  }
                }

                return (
                  <span
                    key={i}
                    className={`${base} ${variant}`}
                    style={gs}
                  >
                    {line.text}
                  </span>
                )
              })}
            </h1>

            <div
              className="relative z-10 w-10 sm:w-14 md:w-16 lg:w-20 h-px mt-3 sm:mt-5 md:mt-7 lg:mt-8 mb-2.5 sm:mb-3 md:mb-5 lg:mb-6 mx-auto md:mx-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,140,50,0.6), rgba(59,130,246,0.3), rgba(59,130,246,0.02))',
                transformOrigin: 'left',
                animation: 'heroLineGrow 1.2s ease-out 0.9s both',
              }}
            />

            <p
              className="relative z-10 font-['Plus_Jakarta_Sans'] text-[10.5px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13.5px] xl:text-[14px] text-white/90 leading-[1.65] sm:leading-[1.75] max-w-[300px] sm:max-w-[340px] md:max-w-[340px] lg:max-w-[370px] font-light tracking-[0.015em] mx-auto md:mx-0"
              style={{
                animation:
                  'heroFloatUp 1s cubic-bezier(0.16,1,0.3,1) 1s both',
              }}
            >
              AI-based risk prediction meets liquid biopsy — from forecasting
              cancer risk using imaging data to non-invasive, continuous
              progression tracking. Pure precision intelligence — open source
              and built for every community.
            </p>

            <div
              className="relative z-10 flex items-center gap-3 mt-4 sm:mt-6 md:mt-7 lg:mt-9 justify-center md:justify-start flex-col sm:flex-row w-full sm:w-auto"
              style={{
                animation:
                  'heroFloatUp 1s cubic-bezier(0.16,1,0.3,1) 1.1s both',
              }}
            >
              <button
                onClick={() => navigateTo('booking')}
                type="button"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3.5 lg:px-9 lg:py-4 rounded-[4px] font-['DM_Sans'] text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-semibold tracking-[0.05em] uppercase text-white transition-all duration-300 ease-out border-none cursor-pointer w-full sm:w-auto bg-gradient-to-br from-blue-600 to-blue-500 shadow-[0_8px_32px_rgba(37,99,235,0.3),0_2px_8px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(37,99,235,0.4),0_4px_12px_rgba(37,99,235,0.2)]"
              >
                <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent group-hover:left-full transition-all duration-500" />
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="relative z-10"
                >
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 8h6M8 5v6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="relative z-10">
                  Book a Demo for Liquid Biopsy
                </span>
              </button>
            </div>

            <div
              className="relative z-10 mt-5 sm:mt-7 md:mt-8 lg:mt-10 flex items-center gap-3 sm:gap-5 justify-center md:justify-start pb-4 md:pb-0"
              style={{
                animation:
                  'heroFloatUp 1s cubic-bezier(0.16,1,0.3,1) 1.3s both',
              }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: '#ff8c32',
                    boxShadow: '0 0 6px rgba(255,140,50,0.6)',
                  }}
                />
                <span className="font-['DM_Sans'] text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-white/25 tracking-[0.1em] uppercase">
                  AI Prediction Live
                </span>
              </div>
              <div className="w-px h-2.5 bg-white/10" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                <span className="font-['DM_Sans'] text-[7.5px] sm:text-[8.5px] md:text-[9.5px] text-white/25 tracking-[0.1em] uppercase">
                  Liquid Biopsy R&amp;D
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div
          className="hidden lg:block absolute top-5 left-5 xl:top-7 xl:left-7 w-10 h-10 xl:w-12 xl:h-12 z-[4] pointer-events-none"
          style={{
            borderLeft: '1px solid rgba(255,140,50,0.12)',
            borderTop: '1px solid rgba(255,140,50,0.12)',
          }}
        />
        <div
          className="hidden lg:block absolute top-5 right-5 xl:top-7 xl:right-7 w-10 h-10 xl:w-12 xl:h-12 z-[4] pointer-events-none"
          style={{
            borderRight: '1px solid rgba(255,140,50,0.12)',
            borderTop: '1px solid rgba(255,140,50,0.12)',
          }}
        />
        <div className="hidden lg:block absolute bottom-5 left-5 xl:bottom-7 xl:left-7 w-10 h-10 xl:w-12 xl:h-12 border-l border-b border-blue-500/[0.08] z-[4] pointer-events-none" />
        <div className="hidden lg:block absolute bottom-5 right-5 xl:bottom-7 xl:right-7 w-10 h-10 xl:w-12 xl:h-12 border-r border-b border-blue-500/[0.08] z-[4] pointer-events-none" />

        {/* Marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-[5] overflow-hidden pointer-events-none opacity-[0.02] md:opacity-[0.03] py-1 sm:py-2">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: 'heroMarqueeScroll 35s linear infinite',
            }}
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  className="font-['Outfit'] text-sm sm:text-lg md:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-white px-3 sm:px-5 md:px-8 uppercase tracking-[0.05em]"
                >
                  AI Prediction — Liquid Biopsy — Real-Time Monitoring —
                  Precision Oncology — Breast Cancer —
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Info section */}
      <section
        id="home"
        className="relative w-full overflow-hidden bg-[#f0f2f5] font-['Source_Sans_3']"
      >
        {/* DESKTOP */}
        <div className="hidden lg:block relative w-full min-h-screen">
          <img
            src="/desktop.png"
            alt="OncoTrace-AI precision oncology platform — desktop"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: 'center 58%',
              transform: 'scale(1.015)',
            }}
            loading="lazy"
            draggable={false}
          />

          <div className="absolute inset-0 z-10 flex items-center">
            <div
              ref={dCardRef}
              className="pointer-events-auto ml-6 lg:ml-10 xl:ml-14 2xl:ml-20 w-full max-w-[400px] lg:max-w-[440px] xl:max-w-[480px] 2xl:max-w-[520px] bg-white/[0.97] backdrop-blur-sm p-7 lg:p-9 xl:p-11 2xl:p-12 shadow-[0_16px_64px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.04)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: dCardVis ? 1 : 0,
                transform: dCardVis
                  ? 'translateY(0) scale(1)'
                  : 'translateY(36px) scale(0.985)',
                willChange: 'opacity, transform',
              }}
            >
              <div className="w-14 lg:w-16 h-[5px] bg-[#c0392b] mb-5 lg:mb-6 rounded-[1px]" />

              <h2 className="font-['Merriweather'] text-[clamp(1.3rem,2.2vw,2rem)] font-bold text-[#1565c0] leading-[1.2] tracking-[-0.01em] m-0 mb-4 lg:mb-5">
                From Risk Prediction to
                <br />
                Real-Time Cancer Tracking
              </h2>

              <p className="font-['Source_Sans_3'] text-[13.5px] lg:text-[14.5px] xl:text-[15px] text-[#4a4a4a] leading-[1.72] font-normal m-0 mb-6 lg:mb-7">
                OncoTrace-AI, built under Shri-AI, brings together two
                complementary approaches into a unified precision oncology
                platform. Our AI-based cancer risk prediction uses X-ray
                imaging data to forecast breast cancer risk over the next
                5&nbsp;years — and is currently live. Our liquid
                biopsy-powered real-time monitoring, now in R&amp;D, tracks
                cancer progression non-invasively and continuously for
                diagnosed patients. We don't prescribe treatments. We deliver
                precision intelligence — open source and built by a
                multidisciplinary team of engineers, clinicians, and
                oncologists.
              </p>

              <button
                type="button"
                onClick={() => navigateTo('booking')}
                className="inline-flex items-center gap-2 bg-[#c0392b] text-white font-['Source_Sans_3'] text-[13px] lg:text-sm font-semibold tracking-[0.04em] px-6 lg:px-7 py-3 lg:py-3.5 border-none rounded-[2px] cursor-pointer hover:bg-[#a93226] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(192,57,43,0.3)] transition-all duration-200 ease-in-out active:translate-y-0"
                aria-label="Collaborate with us"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8h8M8 4l4 4-4 4"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Collaborate With Us
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET */}
        <div className="block lg:hidden w-full bg-[#f0f2f5]">
          <div className="relative w-full overflow-hidden h-[58dvh] sm:h-[66dvh] md:h-[72dvh]">
            <img
              src="/mobile.png"
              alt="OncoTrace-AI precision oncology platform — mobile"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: 'center top',
                transform: 'scale(1.015)',
              }}
              loading="lazy"
              draggable={false}
            />

            <div
              className="absolute bottom-0 left-0 right-0 h-[24%] z-[2] pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, #f0f2f5 6%, rgba(240,242,245,0.78) 40%, rgba(240,242,245,0.18) 72%, transparent 100%)',
              }}
            />
          </div>

          <div
            ref={mCardRef}
            className="relative z-10 -mt-6 sm:-mt-8 md:-mt-10 px-3 sm:px-5 md:px-8 pb-6 sm:pb-8 md:pb-10"
          >
            <div
              className="max-w-3xl mx-auto bg-white rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03)] p-5 sm:p-7 md:p-9 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: mCardVis ? 1 : 0,
                transform: mCardVis
                  ? 'translateY(0)'
                  : 'translateY(30px)',
                willChange: 'opacity, transform',
              }}
            >
              <div className="w-12 sm:w-14 h-[4px] sm:h-[5px] bg-[#c0392b] mb-4 sm:mb-5 rounded-[1px]" />

              <h2 className="font-['Merriweather'] text-[1.15rem] sm:text-[1.35rem] md:text-[1.55rem] font-bold text-[#1565c0] leading-[1.2] tracking-[-0.01em] m-0 mb-3 sm:mb-4">
                From Risk Prediction to
                <br />
                Real-Time Cancer Tracking
              </h2>

              <p className="font-['Source_Sans_3'] text-[12.5px] sm:text-[13.5px] md:text-[14.5px] text-[#4a4a4a] leading-[1.68] sm:leading-[1.75] font-normal m-0 mb-5 sm:mb-6">
                OncoTrace-AI, built under Shri-AI, brings together two
                complementary approaches into a unified precision oncology
                platform. Our AI-based cancer risk prediction uses X-ray
                imaging data to forecast breast cancer risk over the next
                5&nbsp;years — and is currently live. Our liquid
                biopsy-powered real-time monitoring, now in R&amp;D, tracks
                cancer progression non-invasively and continuously for
                diagnosed patients. We don't prescribe treatments. We deliver
                precision intelligence — open source and built by a
                multidisciplinary team of engineers, clinicians, and
                oncologists.
              </p>

              <button
                type="button"
                onClick={() => navigateTo('booking')}
                className="inline-flex items-center justify-center gap-2 bg-[#c0392b] text-white font-['Source_Sans_3'] text-[12.5px] sm:text-[13px] md:text-sm font-semibold tracking-[0.04em] px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 md:py-3.5 border-none rounded-[2px] cursor-pointer hover:bg-[#a93226] active:translate-y-0 transition-all duration-200 ease-in-out w-full sm:w-auto"
                aria-label="Collaborate with us"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8h8M8 4l4 4-4 4"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Collaborate With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}