import { useState, useCallback } from 'react'

const scopedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .mirai-root *, .mirai-root *::before, .mirai-root *::after { box-sizing: border-box; }

  @keyframes miraiFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes miraiRipple {
    0%   { transform: scale(1); opacity: .3; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  @keyframes miraiCheck { to { stroke-dashoffset: 0; } }
  @keyframes miraiBounce {
    0%   { transform: scale(.6); opacity: 0; }
    60%  { transform: scale(1.08); }
    80%  { transform: scale(.96); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes miraiShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  @keyframes miraiPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .55; }
  }
  @keyframes miraiScanLine {
    0%   { top: 0%; opacity: 0.7; }
    50%  { top: 100%; opacity: 0.4; }
    100% { top: 0%; opacity: 0.7; }
  }

  .mirai-root .m-input {
    width: 100%; padding: 11px 14px;
    background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    font-weight: 400; color: #1e293b; outline: none;
    transition: all .2s ease; box-sizing: border-box;
  }
  .mirai-root .m-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.08); }
  .mirai-root .m-input::placeholder { color: #94a3b8; font-weight: 300; }
  .mirai-root .m-input:hover:not(:focus) { border-color: #cbd5e1; }

  .mirai-root .m-label {
    display: block; font-family: 'DM Sans', sans-serif;
    font-size: 11px; font-weight: 600; color: #64748b;
    text-transform: uppercase; letter-spacing: .07em; margin-bottom: 5px;
  }
  .mirai-root .m-textarea {
    width: 100%; padding: 11px 14px; background: #fff;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    font-weight: 400; color: #1e293b; outline: none;
    transition: all .2s ease; resize: vertical; min-height: 96px;
    box-sizing: border-box;
  }
  .mirai-root .m-textarea:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,.08); }
  .mirai-root .m-textarea::placeholder { color: #94a3b8; font-weight: 300; }
`

const getInitial = () => ({
  firstName: '', lastName: '', email: '',
  phone: '', date: '', patientType: '', notes: '',
})

const anim = (delay = 0, dur = '0.6s') =>
  `miraiFadeUp ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s both`

/* ─── Scan animation illustration ─── */
function MammogramIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Scan lines */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent"
        style={{ animation: 'miraiScanLine 4s ease-in-out infinite' }} />

      {/* Central icon */}
      <div className="relative z-10 text-center">
        <div className="relative mx-auto w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-2xl bg-sky-50 border border-sky-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              {/* Simplified mammography / breast icon */}
              <ellipse cx="20" cy="22" rx="12" ry="10" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
              <circle cx="20" cy="16" r="5" stroke="#0ea5e9" strokeWidth="1.5" fill="none" />
              <path d="M14 22 Q20 28 26 22" stroke="#0ea5e9" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              {/* AI signal dots */}
              <circle cx="20" cy="22" r="1.5" fill="#0ea5e9" style={{ animation: 'miraiPulse 2s infinite' }} />
              <circle cx="15" cy="19" r="1" fill="#38bdf8" opacity=".6" style={{ animation: 'miraiPulse 2s .3s infinite' }} />
              <circle cx="25" cy="19" r="1" fill="#38bdf8" opacity=".6" style={{ animation: 'miraiPulse 2s .6s infinite' }} />
            </svg>
          </div>
        </div>
        <p className="font-['DM_Sans'] text-[11px] text-slate-400 tracking-widest uppercase font-medium">AI Mammogram Analysis</p>
      </div>

      {/* Corner markers */}
      {['top-4 left-4 border-l border-t', 'top-4 right-4 border-r border-t',
        'bottom-4 left-4 border-l border-b', 'bottom-4 right-4 border-r border-b'].map((p, i) => (
        <div key={i} className={`absolute ${p} w-5 h-5 border-sky-200/60`} />
      ))}
    </div>
  )
}

/* ─── Success screen ─── */
function SuccessScreen({ onBack }) {
  return (
    <div className="mirai-root relative min-h-screen bg-white flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg,#0ea5e9,#38bdf8,#0ea5e9)', backgroundSize: '200%', animation: 'miraiShimmer 3s linear infinite' }} />
      <div className="relative z-10 text-center max-w-md w-full py-16">
        <div className="relative mx-auto mb-8 w-24 h-24" style={{ animation: 'miraiBounce .7s cubic-bezier(0.34,1.56,0.64,1) .1s both' }}>
          <div className="absolute inset-0 rounded-full bg-sky-200/40" style={{ animation: 'miraiRipple 1.6s ease-out .5s forwards' }} />
          <div className="absolute inset-0 rounded-full bg-sky-100/30" style={{ animation: 'miraiRipple 1.6s ease-out .85s forwards' }} />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 shadow-[0_10px_40px_rgba(14,165,233,.3)]" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <path d="M30 52 L43 65 L70 38" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 65, strokeDashoffset: 65, animation: 'miraiCheck .5s ease-out .65s forwards' }} />
          </svg>
        </div>
        <h2 className="font-['Outfit'] text-4xl font-bold text-slate-900 tracking-tight mb-3" style={{ animation: anim(.45) }}>
          All Set!
        </h2>
        <p className="font-['Plus_Jakarta_Sans'] text-slate-400 text-sm leading-relaxed mb-10 font-light px-2" style={{ animation: anim(.6) }}>
          Your <span className="text-sky-500 font-medium">Mirai Mammogram</span> demo is booked. Our clinical AI team will follow up within 24 hours.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-10" style={{ animation: anim(.75) }}>
          {[
            { icon: '📧', label: 'Confirmation', sub: 'Email sent' },
            { icon: '📅', label: 'Scheduling', sub: 'Slot confirmed' },
            { icon: '🩻', label: 'Demo', sub: 'Clinical walkthrough' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-100 p-4 text-center hover:-translate-y-0.5 transition-transform duration-200">
              <span className="text-2xl block mb-2">{s.icon}</span>
              <span className="font-['DM_Sans'] text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-0.5">{s.label}</span>
              <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-400 font-light">{s.sub}</span>
            </div>
          ))}
        </div>
        <button onClick={onBack}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-['DM_Sans'] text-sm font-semibold bg-slate-900 text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-none cursor-pointer"
          style={{ animation: anim(.9) }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  )
}

/* ─── Main Component ─── */
export default function Mirai({ onBack }) {
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
      <div className="mirai-root relative min-h-screen bg-white">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400/0 via-sky-400/40 to-sky-400/0" />

        {/* Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{ backgroundImage: 'radial-gradient(circle,#94a3b8 0.5px,transparent 0.5px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(14,165,233,0.05),transparent 65%)' }} />

        {/* Two-panel layout on large screens */}
        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

          {/* Left panel — illustration (desktop only) */}
          <aside className="hidden lg:flex lg:w-[42%] xl:w-[38%] bg-gradient-to-br from-slate-50 to-sky-50/30 border-r border-slate-100 relative">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-10 xl:p-14">
              {/* Logo */}
              <div>
                <span className="font-['Outfit'] text-[19px] font-bold tracking-tight text-slate-800">
                  Onco<span className="text-sky-500">Trace-AI</span>
                </span>
              </div>

              {/* Illustration */}
              <div className="flex-1 flex items-center justify-center py-8">
                <div className="w-full max-w-[260px] aspect-square rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                  <MammogramIllustration />
                </div>
              </div>

              {/* Feature list */}
              <div className="space-y-3">
                <p className="font-['DM_Sans'] text-[11px] text-slate-400 tracking-widest uppercase font-semibold mb-4">Powered by Mirai</p>
                {[
                  { icon: '🩻', label: 'AI Mammogram Interpretation', desc: 'Sub-radiologist-level detection' },
                  { icon: '📊', label: '5-Year Risk Stratification', desc: 'Evidence-based longitudinal scoring' },
                  { icon: '🔁', label: 'Longitudinal Tracking', desc: 'Continuous imaging workflow' },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{f.icon}</span>
                    <div>
                      <p className="font-['DM_Sans'] text-[12px] font-semibold text-slate-700">{f.label}</p>
                      <p className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-400 font-light">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Right panel — form */}
          <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-14 xl:px-16 pt-16 sm:pt-20 pb-14">
            {/* Top bar (mobile logo + back) */}
            <div className="flex items-center justify-between mb-8 lg:mb-10" style={{ animation: anim(.05) }}>
              <button onClick={onBack}
                className="inline-flex items-center gap-2 bg-white rounded-xl px-5 py-2.5 text-slate-600 hover:text-slate-900 font-['DM_Sans'] text-[13px] font-semibold tracking-wide transition-all duration-200 hover:-translate-y-px cursor-pointer"
                style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              {/* Mobile logo */}
              <span className="lg:hidden font-['Outfit'] text-[17px] font-bold tracking-tight text-slate-800">
                Onco<span className="text-sky-500">Trace-AI</span>
              </span>
            </div>

            {/* Header */}
            <div className="mb-8" style={{ animation: anim(.12) }}>
              <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-600 rounded-full px-4 py-1.5 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" style={{ animation: 'miraiPulse 2s infinite' }} />
                <span className="font-['DM_Sans'] text-[11px] font-semibold tracking-widest uppercase">Mirai · Mammogram AI</span>
              </div>
              <h1 className="font-['Outfit'] text-[clamp(1.6rem,4vw,2.6rem)] font-bold text-slate-900 tracking-tight leading-tight mb-2">
                Book a Mammogram<br />
                <span className="text-sky-500">Demo</span>
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-slate-400 text-sm leading-relaxed max-w-[400px] font-light">
                See how Mirai's AI predicts 5-year breast cancer risk from standard mammography — no extra imaging required.
              </p>
            </div>

            {/* Form */}
            <div className="max-w-[520px]" style={{ animation: anim(.22) }}>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="m-label" htmlFor="mi-fn">First Name <span className="text-red-400/70">*</span></label>
                    <input id="mi-fn" type="text" className="m-input" placeholder="Shri" value={formData.firstName} onChange={handleChange('firstName')} required />
                  </div>
                  <div>
                    <label className="m-label" htmlFor="mi-ln">Last Name <span className="text-red-400/70">*</span></label>
                    <input id="mi-ln" type="text" className="m-input" placeholder="Lakshmi" value={formData.lastName} onChange={handleChange('lastName')} required />
                  </div>
                </div>

                <div>
                  <label className="m-label" htmlFor="mi-em">Work Email <span className="text-red-400/70">*</span></label>
                  <input id="mi-em" type="email" className="m-input" placeholder="you@clinic.org" value={formData.email} onChange={handleChange('email')} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="m-label" htmlFor="mi-ph">Phone Number</label>
                    <input id="mi-ph" type="tel" className="m-input" placeholder="+91 0000000000" value={formData.phone} onChange={handleChange('phone')} />
                  </div>
                  <div>
                    <label className="m-label" htmlFor="mi-dt">Preferred Date</label>
                    <input id="mi-dt" type="date" className="m-input" value={formData.date} onChange={handleChange('date')} style={{ colorScheme: 'light' }} />
                  </div>
                </div>

                <div>
                  <label className="m-label" htmlFor="mi-pt">Your Role</label>
                  <select id="mi-pt" className="m-input" style={{ appearance: 'auto' }}
                    value={formData.patientType} onChange={handleChange('patientType')}>
                    <option value="">Select your role…</option>
                    <option>Radiologist</option>
                    <option>Oncologist</option>
                    <option>Breast Imaging Specialist</option>
                    <option>Researcher</option>
                    <option>Hospital Administrator</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="m-label" htmlFor="mi-notes">Clinical Context / Questions</label>
                  <textarea id="mi-notes" className="m-textarea"
                    placeholder="Tell us about your mammography workflow, patient volume, or specific questions about Mirai integration…"
                    value={formData.notes} onChange={handleChange('notes')} rows={4} />
                </div>

                {/* Consent note */}
                <div className="flex items-start gap-2.5 bg-sky-50/60 rounded-xl border border-sky-100/80 p-3.5">
                  <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-500 font-light leading-relaxed">
                    This demo uses <span className="font-medium text-slate-700">de-identified imaging data</span>. No patient information is shared. All sessions are HIPAA-aware.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <button type="submit"
                    className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-xl font-['DM_Sans'] text-[13px] font-semibold tracking-wide bg-gradient-to-br from-sky-500 to-sky-400 text-white shadow-[0_4px_20px_rgba(14,165,233,.25)] hover:shadow-[0_8px_32px_rgba(14,165,233,.35)] hover:-translate-y-0.5 transition-all duration-300 border-none cursor-pointer min-h-[48px]">
                    <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-500" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="relative z-10">Book Mammogram Demo</span>
                  </button>
                  <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-400 text-center sm:text-right font-light leading-snug">
                    Secure & confidential.<br className="hidden sm:block" /> Response within 24h.
                  </span>
                </div>
              </form>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap gap-4" style={{ animation: anim(.38) }}>
              {[
                { icon: '🔒', text: 'HIPAA-Aware' },
                { icon: '🩻', text: 'FDA-Referenced Model' },
                { icon: '🌐', text: 'Open Source' },
                { icon: '⚡', text: '24h Response' },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 font-['DM_Sans'] text-[11px] text-slate-400 tracking-wide">
                  <span>{item.icon}</span>{item.text}
                </span>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

