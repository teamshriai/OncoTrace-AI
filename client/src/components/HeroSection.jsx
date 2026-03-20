import { useState, useEffect, useRef } from 'react'

const TYPING = [
  'Monitoring the treatment',
  'Analyzing AI-powered progress',
  'Delivering personalized insights',
  'Bringing care to your community',
]

function TypeWriter() {
  const [idx, setIdx] = useState(0)
  const [char, setChar] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const cur = TYPING[idx]
    const t = setTimeout(() => {
      if (!del) {
        setChar(c => c + 1)
        if (char + 1 === cur.length) setTimeout(() => setDel(true), 1800)
      } else {
        setChar(c => c - 1)
        if (char - 1 === 0) { setDel(false); setIdx(i => (i + 1) % TYPING.length) }
      }
    }, del ? 35 : 65)
    return () => clearTimeout(t)
  }, [char, del, idx])

  return (
    <span className="text-blue-500 font-['DM_Sans'] text-sm font-medium">
      {TYPING[idx].slice(0, char)}
      <span className="animate-blink text-blue-500">|</span>
    </span>
  )
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, 0.3)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true
    const numTarget = parseFloat(target)
    const isDecimal = target.includes('.')
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * numTarget
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, target, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const minimalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@400;700;900&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes slowZoom{0%{transform:scale(1)}100%{transform:scale(1.08)}}
  @keyframes textReveal{from{opacity:0;transform:translateY(60px) rotateX(12deg)}to{opacity:1;transform:translateY(0) rotateX(0deg)}}
  @keyframes pulseRing{0%{transform:translate(-50%,-50%) scale(.95);opacity:.5}50%{transform:translate(-50%,-50%) scale(1.05);opacity:.8}100%{transform:translate(-50%,-50%) scale(.95);opacity:.5}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes floatUp{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes dotPulse{0%,100%{box-shadow:0 0 6px rgba(59,130,246,.9)}50%{box-shadow:0 0 16px rgba(59,130,246,1)}}
  @keyframes grainShift{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(3%,5%)}50%{transform:translate(-8%,2%)}70%{transform:translate(6%,-6%)}90%{transform:translate(-3%,8%)}}

  @keyframes checkStroke{to{stroke-dashoffset:0}}
  @keyframes circleGrow{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes pageExit{to{opacity:0;transform:translateY(-18px) scale(0.99)}}
  @keyframes pageEnter{from{opacity:0;transform:translateY(22px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes successRipple{0%{transform:scale(1);opacity:0.35}100%{transform:scale(2.8);opacity:0}}
  @keyframes staggerIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes badgePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes softBounce{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08)}80%{transform:scale(0.96)}100%{transform:scale(1);opacity:1}}
  @keyframes shimmerBar{0%{background-position:-200% 0}100%{background-position:200% 0}}

  .bi{width:100%;padding:13px 16px;background:#fff;border:1.5px solid #e2e8f0;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:400;color:#1e293b;outline:none;transition:all .25s ease;box-sizing:border-box}
  .bi:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.08)}
  .bi::placeholder{color:#94a3b8;font-weight:300}
  .bi:hover:not(:focus){border-color:#cbd5e1}
  .bi[type="date"]{color-scheme:light}
  .bl{display:block;font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:600;color:#475569;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
  .bt{width:100%;padding:13px 16px;background:#fff;border:1.5px solid #e2e8f0;border-radius:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:400;color:#1e293b;outline:none;transition:all .25s ease;resize:vertical;min-height:100px;box-sizing:border-box}
  .bt:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.08)}
  .bt::placeholder{color:#94a3b8;font-weight:300}
`

export default function HeroSection() {
  const [view, setView] = useState('hero')
  const [transition, setTransition] = useState('')
  const mouse = useMousePosition()
  const secondRef = useRef(null)
  const secondVisible = useInView(secondRef, 0.1)

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', organization: '',
    role: '', phone: '', date: '', message: ''
  })

  const navigateTo = (target) => {
    setTransition('exit')
    setTimeout(() => {
      setView(target)
      if (target === 'hero') {
        setFormData({ firstName: '', lastName: '', email: '', organization: '', role: '', phone: '', date: '', message: '' })
      }
      window.scrollTo(0, 0)
      setTransition('enter')
      setTimeout(() => setTransition(''), 700)
    }, 480)
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigateTo('success')
  }

  const wrapStyle = transition === 'exit'
    ? { animation: 'pageExit 0.48s ease-in forwards' }
    : transition === 'enter'
    ? { animation: 'pageEnter 0.65s cubic-bezier(0.16,1,0.3,1) forwards' }
    : {}

  const filmGrain = (
    <div
      className="fixed -inset-1/2 w-[200%] h-[200%] pointer-events-none z-[9999] opacity-[0.022]"
      style={{
        animation: 'grainShift .5s steps(1) infinite',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  )

  /* ═══════════════════════════════════════════
     BOOKING VIEW
     ═══════════════════════════════════════════ */
  if (view === 'booking') {
    return (
      <>
        <style>{minimalCSS}</style>
        {filmGrain}

        <div style={wrapStyle} className="min-h-screen bg-[#f8fafc]">
          {/* Top accent bar */}
          <div className="h-[3px]" style={{
            background: 'linear-gradient(90deg, #2563eb, #60a5fa, #3b82f6, #2563eb)',
            backgroundSize: '300% 100%',
            animation: 'shimmerBar 3s linear infinite'
          }} />

          {/* Background dot pattern */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* Decorative blurs */}
          <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04), transparent 65%)' }} />
          <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.03), transparent 65%)' }} />

          {/* Navigation */}
          <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
              <button
                onClick={() => navigateTo('hero')}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700
                           font-['DM_Sans'] text-[13px] font-medium tracking-wide
                           transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>

              <span className="font-['Outfit'] text-[17px] font-bold tracking-[-0.01em] text-slate-800">
                Shri<span className="text-blue-600">-AI</span>
              </span>

              <div className="w-14" />
            </div>
          </nav>

          {/* Content */}
          <main className="relative z-10 max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">

            {/* Header */}
            <div className="text-center mb-10 sm:mb-12"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.08s both' }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50/80 text-blue-600
                              font-['DM_Sans'] text-[11px] font-semibold tracking-[0.1em] uppercase
                              px-4 py-1.5 rounded-full mb-5 border border-blue-100/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Demo Request
              </div>

              <h1 className="font-['Outfit'] text-[1.85rem] sm:text-[2.2rem] md:text-[2.6rem]
                             font-bold text-slate-900 leading-[1.12] tracking-[-0.035em] mb-3">
                Schedule Your{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6, #60a5fa)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Demo
                </span>
              </h1>

              <p className="font-['Plus_Jakarta_Sans'] text-[13.5px] sm:text-[14.5px]
                            text-slate-400 leading-[1.7] max-w-[420px] mx-auto font-light">
                Experience next-generation AI-powered precision oncology monitoring.
                Fill in your details and we'll arrange a personalized walkthrough.
              </p>
            </div>

            {/* Form Card */}
            <div
              className="bg-white rounded-2xl
                         shadow-[0_4px_40px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.03)]
                         border border-slate-100/80
                         p-6 sm:p-8 md:p-10"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both' }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="bl">First Name <span className="text-red-400/70">*</span></label>
                    <input type="text" className="bi" placeholder="John"
                      value={formData.firstName} onChange={handleChange('firstName')} required />
                  </div>
                  <div>
                    <label className="bl">Last Name <span className="text-red-400/70">*</span></label>
                    <input type="text" className="bi" placeholder="Doe"
                      value={formData.lastName} onChange={handleChange('lastName')} required />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="bl">Email Address <span className="text-red-400/70">*</span></label>
                  <input type="email" className="bi" placeholder="john@example.com"
                    value={formData.email} onChange={handleChange('email')} required />
                </div>

                {/* Organization + Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="bl">Organization</label>
                    <input type="text" className="bi" placeholder="Company name"
                      value={formData.organization} onChange={handleChange('organization')} />
                  </div>
                  <div>
                    <label className="bl">Role / Title</label>
                    <input type="text" className="bi" placeholder="e.g. Oncologist"
                      value={formData.role} onChange={handleChange('role')} />
                  </div>
                </div>

                {/* Phone + Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="bl">Phone Number</label>
                    <input type="tel" className="bi" placeholder="+1 (555) 000-0000"
                      value={formData.phone} onChange={handleChange('phone')} />
                  </div>
                  <div>
                    <label className="bl">Preferred Date</label>
                    <input type="date" className="bi"
                      value={formData.date} onChange={handleChange('date')} />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="bl">Additional Notes</label>
                  <textarea className="bt" placeholder="Tell us about your use case or any questions..."
                    value={formData.message} onChange={handleChange('message')} rows={4} />
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 my-2" />

                {/* Submit */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button
                    type="submit"
                    className="group relative w-full sm:w-auto overflow-hidden
                               inline-flex items-center justify-center gap-2.5
                               px-9 py-[14px]
                               rounded-xl
                               font-['DM_Sans'] text-[13px] font-semibold tracking-[0.03em]
                               bg-gradient-to-br from-blue-600 to-blue-500 text-white
                               shadow-[0_4px_20px_rgba(59,130,246,0.25)]
                               hover:shadow-[0_8px_36px_rgba(59,130,246,0.35)]
                               hover:-translate-y-0.5 active:translate-y-0
                               transition-all duration-300 ease-out
                               border-none cursor-pointer"
                  >
                    <span className="absolute top-0 -left-full w-full h-full
                                     bg-gradient-to-r from-transparent via-white/[0.1] to-transparent
                                     group-hover:left-full transition-all duration-500" />
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="relative z-10">Schedule Demo</span>
                  </button>

                  <span className="font-['Plus_Jakarta_Sans'] text-[11.5px] text-slate-350 text-slate-400 text-center sm:text-right font-light leading-snug">
                    We'll never share your data.<br className="hidden sm:block" /> Privacy is our priority.
                  </span>
                </div>
              </form>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-7"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.38s both' }}
            >
              {[
                { icon: '🔒', text: 'Secure & Private' },
                { icon: '⚡', text: 'Response within 24h' },
                { icon: '🌐', text: 'Open Source' },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 font-['DM_Sans'] text-[11px] text-slate-400 tracking-[0.03em]">
                  <span className="text-sm">{item.icon}</span>
                  {item.text}
                </span>
              ))}
            </div>
          </main>
        </div>
      </>
    )
  }

  /* ═══════════════════════════════════════════
     SUCCESS VIEW
     ═══════════════════════════════════════════ */
  if (view === 'success') {
    return (
      <>
        <style>{minimalCSS}</style>
        {filmGrain}

        <div style={wrapStyle} className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
          {/* Top accent bar */}
          <div className="fixed top-0 left-0 right-0 h-[3px] z-50" style={{
            background: 'linear-gradient(90deg, #10b981, #34d399, #10b981)',
            backgroundSize: '300% 100%',
            animation: 'shimmerBar 3s linear infinite'
          }} />

          {/* Background */}
          <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* Decorative blurs */}
          <div className="fixed top-1/3 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05), transparent 65%)' }} />
          <div className="fixed bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04), transparent 65%)' }} />

          <div className="relative z-10 text-center px-6 py-16 max-w-lg mx-auto">
            {/* Animated checkmark */}
            <div className="relative mx-auto mb-9 w-[100px] h-[100px]"
              style={{ animation: 'softBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}
            >
              {/* Ripples */}
              <div className="absolute inset-0 rounded-full bg-emerald-200/50"
                style={{ animation: 'successRipple 1.6s ease-out 0.5s forwards' }} />
              <div className="absolute inset-0 rounded-full bg-emerald-100/40"
                style={{ animation: 'successRipple 1.6s ease-out 0.85s forwards' }} />

              {/* Circle background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500
                              shadow-[0_10px_40px_rgba(16,185,129,0.3)]" />

              {/* Checkmark */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
                <path d="M30 52 L43 65 L70 38" stroke="white" strokeWidth="5.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{
                    strokeDasharray: 65, strokeDashoffset: 65,
                    animation: 'checkStroke 0.5s ease-out 0.65s forwards'
                  }} />
              </svg>
            </div>

            {/* Thank You */}
            <h1 className="font-['Outfit'] text-[2rem] sm:text-[2.5rem] md:text-[3rem]
                           font-bold text-slate-900 tracking-[-0.04em] leading-none mb-4"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both' }}
            >
              Thank You!
            </h1>

            {/* Launching Soon badge */}
            <div style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both' }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5
                               bg-gradient-to-r from-blue-50 to-indigo-50
                               border border-blue-100/70
                               text-blue-700 font-['DM_Sans'] text-[12px] sm:text-[13px]
                               font-semibold tracking-[0.06em] uppercase
                               px-5 sm:px-6 py-2 sm:py-2.5 rounded-full"
                style={{ animation: 'badgePulse 3s ease-in-out 1.5s infinite' }}
              >
                <span className="text-[15px]">🚀</span>
                Launching Soon
              </span>
            </div>

            {/* Description */}
            <p className="font-['Plus_Jakarta_Sans'] text-[13.5px] sm:text-[15px]
                          text-slate-400 leading-[1.8] max-w-[400px] mx-auto mb-10 font-light"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s both' }}
            >
              Your demo has been booked successfully. We're currently in pre-launch
              and will reach out shortly with all the details. Thank you for your
              interest in <span className="text-slate-600 font-medium">Shri-AI</span>'s
              precision oncology platform.
            </p>

            {/* What's next cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-11"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both' }}
            >
              {[
                { icon: '📧', title: 'Confirmation', desc: 'Email sent to your inbox' },
                { icon: '📅', title: 'Scheduling', desc: "We'll confirm your slot" },
                { icon: '🤝', title: 'Demo Day', desc: 'Personalized walkthrough' },
              ].map((step, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100
                                        shadow-[0_2px_16px_rgba(0,0,0,0.04)]
                                        p-5 text-center
                                        hover:shadow-[0_4px_24px_rgba(0,0,0,0.07)]
                                        hover:-translate-y-0.5
                                        transition-all duration-300">
                  <span className="text-[1.6rem] mb-2.5 block">{step.icon}</span>
                  <span className="font-['DM_Sans'] text-[10.5px] font-bold text-slate-700
                                   uppercase tracking-[0.07em] block mb-1">
                    {step.title}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11.5px] text-slate-400 font-light">
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-slate-200 mx-auto mb-8"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 1s both' }} />

            {/* Back button */}
            <button
              onClick={() => navigateTo('hero')}
              className="group inline-flex items-center gap-2.5
                         px-8 py-[14px] rounded-xl
                         font-['DM_Sans'] text-[13px] font-semibold tracking-[0.02em]
                         bg-slate-900 text-white
                         shadow-[0_4px_20px_rgba(15,23,42,0.18)]
                         hover:shadow-[0_8px_36px_rgba(15,23,42,0.28)]
                         hover:-translate-y-0.5
                         transition-all duration-300 ease-out
                         border-none cursor-pointer"
              style={{ animation: 'staggerIn 0.7s cubic-bezier(0.16,1,0.3,1) 1.1s both' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Return to Home
            </button>
          </div>
        </div>
      </>
    )
  }

  /* ═══════════════════════════════════════════
     HERO VIEW (original)
     ═══════════════════════════════════════════ */
  return (
    <>
      <style>{minimalCSS}</style>

      <div style={wrapStyle}>
        {filmGrain}

        {/* SECTION 1 — PRECISION HERO */}
        <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#001953]">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-[3fr_2fr] relative">

            {/* LEFT — image + tags */}
            <div className="relative overflow-hidden min-h-[36vh] sm:min-h-[40vh] md:min-h-0">
              <div className="absolute inset-0 z-[1]">
                <img src="/cover-image.png" alt="Medical facility"
                  className="w-full h-full object-cover object-center"
                  style={{ animation: 'slowZoom 25s ease-in-out infinite alternate' }} />
                <div className="absolute inset-0 z-[2]"
                  style={{ background: 'linear-gradient(180deg, rgba(7,12,24,0.4) 0%, rgba(7,12,24,0.05) 25%, transparent 50%, transparent 100%)' }}>
                  <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at 50% 80%, rgba(29,78,216,0.06) 0%, transparent 60%), linear-gradient(90deg, transparent 55%, rgba(7,12,24,0.8) 100%)'
                  }} />
                </div>
              </div>

              <div className="absolute inset-0 opacity-[0.03] z-[3] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(147,197,253,0.8) 0.5px, transparent 0.5px)',
                  backgroundSize: '40px 40px'
                }} />

              <div className="absolute inset-0 z-[8] flex flex-col items-center pointer-events-none
                              pt-24 sm:pt-28 md:pt-32 lg:pt-36 gap-3 sm:gap-3.5 md:gap-4"
                style={{ animation: 'floatUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}>
                <span className="pointer-events-auto inline-flex items-center gap-2 sm:gap-2.5 md:gap-3
                                 bg-white/[0.05] backdrop-blur-xl rounded-full
                                 px-5 py-2 sm:px-7 sm:py-2.5 md:px-8 md:py-3 lg:px-9 lg:py-3
                                 text-[14px] sm:text-[16px] md:text-[17px] lg:text-[19px]
                                 text-white/55 font-medium tracking-[0.08em] uppercase
                                 border border-white/[0.07] font-['DM_Sans'] whitespace-nowrap
                                 shadow-[0_2px_24px_rgba(59,130,246,0.06)]">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 flex-shrink-0"
                    style={{ boxShadow: '0 0 10px rgba(59,130,246,0.8)', animation: 'dotPulse 2s ease-in-out infinite' }} />
                  Launching Soon — Open Source · Not for Profit
                </span>
                <span className="pointer-events-auto text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px]
                                 text-white/30 font-normal tracking-[0.18em] uppercase font-['DM_Sans'] whitespace-nowrap">
                  Next-Generation Healthcare Intelligence
                </span>
              </div>
            </div>

            {/* RIGHT — text content */}
            <div className="relative z-[5] flex flex-col items-center md:items-start justify-center
                            text-center md:text-left px-5 py-10 sm:px-8 sm:py-12
                            md:pl-12 md:pr-8 md:py-14 lg:pl-[72px] lg:pr-14 lg:py-20 xl:pl-20 xl:pr-16">

              <div className="absolute w-[420px] h-[420px] rounded-full top-1/2 left-1/2 -translate-x-[30%] -translate-y-1/2 pointer-events-none z-0"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
              <div className="absolute w-72 h-72 rounded-full border border-blue-500/[0.04] top-1/2 left-1/2 pointer-events-none z-0"
                style={{ animation: 'pulseRing 7s ease-in-out infinite' }} />
              <div className="absolute w-[460px] h-[460px] rounded-full border border-blue-500/[0.025] top-1/2 left-1/2 pointer-events-none z-0"
                style={{ animation: 'pulseRing 9s ease-in-out 2s infinite' }} />

              <div className="absolute inset-0 opacity-[0.015] z-0 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(147,197,253,0.5) 0.5px, transparent 0.5px)',
                  backgroundSize: '48px 48px'
                }} />

              <span className="relative z-10 font-['DM_Sans'] text-[9px] sm:text-[10px] md:text-[11px]
                               text-white/25 tracking-[0.22em] uppercase font-medium
                               mb-5 sm:mb-6 md:mb-8 flex items-center justify-center md:justify-start w-full"
                style={{ animation: 'floatUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}>
                <span className="inline-block w-5 h-px bg-blue-500/35 mr-3 flex-shrink-0" />
                Healthcare AI Platform
              </span>

              <h1 className="relative z-10 m-0 p-0" style={{ perspective: '800px' }}>
                {[
                  { text: 'Realtime', type: 'light' },
                  { text: 'Precision', type: 'bold' },
                  { text: 'Monitoring', type: 'bold' },
                  { text: 'In Oncology', type: 'accent' },
                ].map((line, i) => {
                  const baseClasses = "block font-['Outfit'] leading-[0.92] tracking-[-0.05em] text-[clamp(2rem,6.5vw,7.5rem)]"
                  let variant = ''
                  let gradientStyle = {}

                  if (line.type === 'light') {
                    variant = 'font-light text-slate-400/50'
                    gradientStyle = { animation: `textReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.2}s both` }
                  } else if (line.type === 'bold') {
                    variant = 'font-extrabold'
                    gradientStyle = {
                      background: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 20%, #fff 45%, #e2e8f0 55%, #60a5fa 75%, #3b82f6 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      animation: `textReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.2}s both, gradientShift 6s ease infinite`,
                    }
                  } else {
                    variant = 'font-semibold'
                    gradientStyle = {
                      background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 30%, #93c5fd 50%, #60a5fa 70%, #3b82f6 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      animation: `textReveal 1.2s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.2}s both, gradientShift 5s ease infinite`,
                    }
                  }
                  return <span key={i} className={`${baseClasses} ${variant}`} style={gradientStyle}>{line.text}</span>
                })}
              </h1>

              <div className="relative z-10 w-12 sm:w-16 md:w-[72px] h-px mt-6 sm:mt-8 md:mt-10 mb-4 sm:mb-5 md:mb-6 mx-auto md:mx-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(59,130,246,0.5), rgba(59,130,246,0.02))',
                  transformOrigin: 'left', animation: 'lineGrow 1.2s ease-out 0.9s both'
                }} />

              <p className="relative z-10 font-['Plus_Jakarta_Sans'] text-xs sm:text-[13px] md:text-[14.5px]
                            text-white/30 leading-[1.7] sm:leading-[1.8] max-w-[380px] font-light tracking-[0.01em]
                            mx-auto md:mx-0"
                style={{ animation: 'floatUp 1s cubic-bezier(0.16,1,0.3,1) 1s both' }}>
                AI-powered diagnostics delivering real-time precision insights
                for next-generation healthcare monitoring — accessible, private,
                and built for every community.
              </p>

              {/* CTA row */}
              <div className="relative z-10 flex items-center gap-3 sm:gap-4 md:gap-5
                              mt-7 sm:mt-8 md:mt-9 justify-center md:justify-start
                              flex-col sm:flex-row w-full sm:w-auto"
                style={{ animation: 'floatUp 1s cubic-bezier(0.16,1,0.3,1) 1.1s both' }}>

                {/* ★ BOOK A DEMO — now wired up */}
                <button
                  onClick={() => navigateTo('booking')}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5
                             px-7 py-3.5 sm:px-9 sm:py-4 rounded-[3px]
                             font-['DM_Sans'] text-[12px] sm:text-[13px] font-medium tracking-[0.04em]
                             bg-gradient-to-br from-blue-700 to-blue-500 text-white
                             shadow-[0_8px_32px_rgba(59,130,246,0.3),0_2px_8px_rgba(59,130,246,0.15)]
                             hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(59,130,246,0.4)]
                             transition-all duration-300 ease-out border-none cursor-pointer
                             w-full sm:w-auto"
                >
                  <span className="absolute top-0 -left-full w-full h-full
                                   bg-gradient-to-r from-transparent via-white/[0.12] to-transparent
                                   group-hover:left-full transition-all duration-500" />
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="relative z-10">
                    <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" />
                    <path d="M5 8h6M8 5v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="relative z-10">Book a Demo</span>
                </button>

                <button className="inline-flex items-center justify-center gap-2.5
                                   px-7 py-3.5 sm:px-9 sm:py-4 rounded-[3px]
                                   font-['DM_Sans'] text-[12px] sm:text-[13px] font-medium tracking-[0.04em]
                                   bg-white/[0.04] text-white/50 border border-white/[0.08] backdrop-blur-lg
                                   hover:bg-blue-500/[0.08] hover:text-white/70 hover:border-blue-500/30
                                   hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer
                                   w-full sm:w-auto">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
                    <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" className="opacity-60" />
                  </svg>
                  Learn More
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block absolute top-[8%] bottom-[8%] left-[60%] w-px z-[6] pointer-events-none"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.1) 20%, rgba(59,130,246,0.18) 50%, rgba(59,130,246,0.1) 80%, transparent)' }} />
          </div>

          {/* Corner accents */}
          <div className="hidden md:block absolute top-8 left-8 w-12 h-12 border-l border-t border-blue-500/[0.15] z-[4] pointer-events-none" />
          <div className="hidden md:block absolute top-8 right-8 w-12 h-12 border-r border-t border-blue-500/[0.15] z-[4] pointer-events-none" />
          <div className="hidden md:block absolute bottom-8 left-8 w-12 h-12 border-l border-b border-blue-500/10 z-[4] pointer-events-none" />
          <div className="hidden md:block absolute bottom-8 right-8 w-12 h-12 border-r border-b border-blue-500/10 z-[4] pointer-events-none" />

          {/* Marquee */}
          <div className="absolute bottom-8 sm:bottom-10 md:bottom-[70px] left-0 right-0 z-[5] overflow-hidden pointer-events-none opacity-[0.03] md:opacity-[0.04]">
            <div className="flex whitespace-nowrap" style={{ animation: 'marqueeScroll 30s linear infinite' }}>
              {Array(4).fill(null).map((_, i) => (
                <span key={i} className="font-['Outfit'] text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white px-6 sm:px-8 md:px-14 uppercase tracking-[0.05em]">
                  AI Precision Monitoring — Diagnostics — Healthcare —
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2 — GUARDANT STYLE */}
        <section ref={secondRef} id="home"
          className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#f0f2f5] font-['Source_Sans_3']">
          <div className="absolute inset-0 z-[1]">
            <img src="/doctor.png" alt="AI-powered breast cancer screening"
              className="w-full h-full object-cover block"
              style={{ objectPosition: '70% center' }} />
            <div className="absolute inset-0 z-[2]" style={{
              background: 'linear-gradient(to right, rgba(240,242,245,0.92) 0%, rgba(240,242,245,0.55) 38%, rgba(240,242,245,0.05) 65%, transparent 100%)'
            }} />
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 sm:left-6 sm:right-6
                          md:left-8 md:right-auto lg:left-12 z-10 bg-white
                          w-auto md:w-full md:max-w-[460px] lg:max-w-[500px]
                          p-6 sm:p-8 md:px-12 md:py-10 lg:px-12 lg:pt-10 lg:pb-12
                          shadow-[0_8px_48px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.04)]
                          transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: secondVisible ? 1 : 0, marginTop: secondVisible ? '0px' : '32px' }}>
            <div className="w-16 h-[5px] bg-[#c0392b] mb-6 rounded-[1px]" />
            <h2 className="font-['Merriweather'] text-[1.35rem] sm:text-2xl md:text-[clamp(1.55rem,2.8vw,2.2rem)]
                           font-bold text-[#1565c0] leading-[1.22] tracking-[-0.01em] m-0 mb-5">
              Together We Can Help<br />Conquer Cancer
            </h2>
            <p className="font-['Source_Sans_3'] text-sm sm:text-[14.5px] md:text-[15.5px]
                          text-[#4a4a4a] leading-[1.75] font-normal m-0 mb-6 sm:mb-8">
              At Shri-AI, every team member plays a vital role in a mission that
              impacts countless lives: conquering cancer through intelligent data.
              We are driven by a commitment to patients through the power of AI
              and the life-changing information it provides. We're looking for
              curious, talented minds across diverse fields to take on some of
              the greatest challenges in human health.
            </p>
            <button className="inline-flex items-center gap-2 bg-[#c0392b] text-white
                               font-['Source_Sans_3'] text-[13px] sm:text-sm font-semibold tracking-[0.04em]
                               px-5 sm:px-7 py-3 sm:py-3.5 border-none rounded-[2px] cursor-pointer
                               hover:bg-[#a93226] hover:-translate-y-px
                               hover:shadow-[0_6px_20px_rgba(192,57,43,0.3)]
                               transition-all duration-200 ease-in-out w-full sm:w-auto
                               justify-center sm:justify-start">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M8 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Explore Opportunities
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#d0d4da] z-20" />
        </section>
      </div>
    </>
  )
}