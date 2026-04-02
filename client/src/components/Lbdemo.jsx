import { useState, useCallback } from 'react'

const scopedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .lb-root *, .lb-root *::before, .lb-root *::after { box-sizing: border-box; }

  @keyframes lbFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lbSuccessRipple {
    0%   { transform: scale(1); opacity: .3; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  @keyframes lbCheckStroke { to { stroke-dashoffset: 0; } }
  @keyframes lbSoftBounce {
    0%   { transform: scale(.6); opacity: 0; }
    60%  { transform: scale(1.08); }
    80%  { transform: scale(.96); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes lbShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes lbPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .6; }
  }

  .lb-root .lb-input {
    width: 100%; padding: 11px 14px;
    background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    font-weight: 400; color: #1e293b; outline: none;
    transition: all .2s ease; box-sizing: border-box;
  }
  .lb-root .lb-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.08); }
  .lb-root .lb-input::placeholder { color: #94a3b8; font-weight: 300; }
  .lb-root .lb-input:hover:not(:focus) { border-color: #cbd5e1; }

  .lb-root .lb-label {
    display: block; font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 600; color: #64748b;
    text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px;
  }

  .lb-root .lb-textarea {
    width: 100%; padding: 11px 14px; background: #fff;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    font-weight: 400; color: #1e293b; outline: none;
    transition: all .2s ease; resize: vertical; min-height: 96px;
    box-sizing: border-box;
  }
  .lb-root .lb-textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.08); }
  .lb-root .lb-textarea::placeholder { color: #94a3b8; font-weight: 300; }
`

const getInitial = () => ({
  firstName: '', lastName: '', email: '',
  phone: '', date: '', message: '',
})

const anim = (delay = 0, dur = '0.6s') =>
  `lbFadeUp ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s both`

/* ─── Success screen ─── */
function SuccessScreen({ onBack }) {
  return (
    <div className="lb-root relative min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg,#3b82f6,#60a5fa,#3b82f6)', backgroundSize: '200%', animation: 'lbShimmer 3s linear infinite' }}
      />
      <div className="relative z-10 text-center max-w-md w-full py-16">
        {/* Check icon */}
        <div className="relative mx-auto mb-8 w-24 h-24" style={{ animation: 'lbSoftBounce .7s cubic-bezier(0.34,1.56,0.64,1) .1s both' }}>
          <div className="absolute inset-0 rounded-full bg-blue-200/40" style={{ animation: 'lbSuccessRipple 1.6s ease-out .5s forwards' }} />
          <div className="absolute inset-0 rounded-full bg-blue-100/30" style={{ animation: 'lbSuccessRipple 1.6s ease-out .85s forwards' }} />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_10px_40px_rgba(59,130,246,.3)]" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <path d="M30 52 L43 65 L70 38" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 65, strokeDashoffset: 65, animation: 'lbCheckStroke .5s ease-out .65s forwards' }} />
          </svg>
        </div>

        <h2 className="font-['Outfit'] text-4xl font-bold text-slate-900 tracking-tight mb-3" style={{ animation: anim(.45) }}>
          Demo Booked!
        </h2>
        <p className="font-['Plus_Jakarta_Sans'] text-slate-400 text-sm leading-relaxed mb-10 font-light" style={{ animation: anim(.6) }}>
          Your <span className="text-blue-600 font-medium">Liquid Biopsy</span> demo request has been received.
          Our oncology team will reach out within 24 hours.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10" style={{ animation: anim(.75) }}>
          {[
            { icon: '📧', label: 'Confirmation', sub: 'Email sent' },
            { icon: '📅', label: 'Scheduling', sub: 'Slot confirmed' },
            { icon: '🧬', label: 'Demo', sub: 'Personalized' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm hover:-translate-y-0.5 transition-transform duration-200">
              <span className="text-2xl block mb-2">{s.icon}</span>
              <span className="font-['DM_Sans'] text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-0.5">{s.label}</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-400 font-light">{s.sub}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-['DM_Sans'] text-sm font-semibold bg-slate-900 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-none cursor-pointer"
          style={{ animation: anim(.9) }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  )
}

/* ─── Main booking form ─── */
export default function LBdemo({ onBack }) {
  const [formData, setFormData] = useState(getInitial)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = useCallback(
    (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value })),
    []
  )

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setSubmitted(true)
  }, [])

  if (submitted) return <SuccessScreen onBack={() => { setSubmitted(false); onBack?.() }} />

  return (
    <>
      <style>{scopedCSS}</style>
      <div className="lb-root relative min-h-screen bg-[#f8fafc]">
        {/* Background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle,#94a3b8 0.5px,transparent 0.5px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.05),transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.04),transparent 65%)' }} />

        <main className="relative z-10 w-full max-w-[620px] mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8" style={{ animation: anim(.05) }}>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-2.5 text-slate-600 hover:text-slate-900 font-['DM_Sans'] text-[13px] font-semibold tracking-wide transition-all duration-200 hover:shadow-md hover:-translate-y-px cursor-pointer border-none"
              style={{ border: '1.5px solid #e2e8f0' }}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <span className="font-['Outfit'] text-[17px] font-bold tracking-tight text-slate-800">
              Onco<span className="text-blue-600">Trace-AI</span>
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-10" style={{ animation: anim(.12) }}>
            {/* Liquid biopsy badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-full px-4 py-1.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" style={{ animation: 'lbPulse 2s infinite' }} />
              <span className="font-['DM_Sans'] text-[11px] font-semibold tracking-widest uppercase">Liquid Biopsy Platform</span>
            </div>
            <h1 className="font-['Outfit'] text-[clamp(1.6rem,5vw,2.5rem)] font-bold text-slate-900 tracking-tight leading-tight mb-2">
              Book a <span className="text-blue-600">Live Demo</span>
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-slate-400 text-sm leading-relaxed max-w-[380px] mx-auto font-light">
              Experience real-time cancer progression monitoring powered by non-invasive liquid biopsy and AI-driven analytics.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8 md:p-10" style={{ animation: anim(.22) }}>
            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-slate-100">
              {['ctDNA Analysis', 'CTC Detection', 'Real-time Monitoring', 'AI Risk Scoring'].map((f, i) => (
                <span key={i} className="font-['DM_Sans'] text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1 tracking-wide">
                  {f}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="lb-label" htmlFor="lb-fn">First Name <span className="text-red-400/70">*</span></label>
                  <input id="lb-fn" type="text" className="lb-input" placeholder="Shri" value={formData.firstName} onChange={handleChange('firstName')} required />
                </div>
                <div>
                  <label className="lb-label" htmlFor="lb-ln">Last Name <span className="text-red-400/70">*</span></label>
                  <input id="lb-ln" type="text" className="lb-input" placeholder="Lakshmi" value={formData.lastName} onChange={handleChange('lastName')} required />
                </div>
              </div>

              <div>
                <label className="lb-label" htmlFor="lb-em">Work Email <span className="text-red-400/70">*</span></label>
                <input id="lb-em" type="email" className="lb-input" placeholder="you@hospital.org" value={formData.email} onChange={handleChange('email')} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="lb-label" htmlFor="lb-ph">Phone Number</label>
                  <input id="lb-ph" type="tel" className="lb-input" placeholder="+91 0000000000" value={formData.phone} onChange={handleChange('phone')} />
                </div>
                <div>
                  <label className="lb-label" htmlFor="lb-dt">Preferred Date</label>
                  <input id="lb-dt" type="date" className="lb-input" value={formData.date} onChange={handleChange('date')} style={{ colorScheme: 'light' }} />
                </div>
              </div>

              <div>
                <label className="lb-label" htmlFor="lb-role">Clinical Role</label>
                <select id="lb-role" className="lb-input" style={{ appearance: 'auto' }}
                  value={formData.role || ''} onChange={handleChange('role')}>
                  <option value="">Select your role…</option>
                  <option>Oncologist</option>
                  <option>Pathologist</option>
                  <option>Researcher</option>
                  <option>Hospital Administrator</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="lb-label" htmlFor="lb-msg">Research Focus / Notes</label>
                <textarea id="lb-msg" className="lb-textarea" placeholder="Describe your clinical context or specific questions about liquid biopsy integration…"
                  value={formData.message} onChange={handleChange('message')} rows={4} />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="submit"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-xl font-['DM_Sans'] text-[13px] font-semibold tracking-wide bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,.25)] hover:shadow-[0_8px_32px_rgba(59,130,246,.35)] hover:-translate-y-0.5 transition-all duration-300 border-none cursor-pointer min-h-[48px]"
                >
                  <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-500" />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.16 7.84a16 16 0 006 6l1.2-1.2a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                  </svg>
                  <span className="relative z-10">Request Demo</span>
                </button>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-400 text-center sm:text-right font-light leading-snug">
                  HIPAA-aware platform.<br className="hidden sm:block" /> Your data stays private.
                </span>
              </div>
            </form>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5" style={{ animation: anim(.38) }}>
            {[
              { icon: '🔒', text: 'Secure & Private' },
              { icon: '⚡', text: 'Response within 24h' },
              { icon: '🌐', text: 'Open Source' },
              { icon: '🧬', text: 'Clinical Grade' },
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 font-['DM_Sans'] text-[11px] text-slate-400 tracking-wide">
                <span>{item.icon}</span>{item.text}
              </span>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}