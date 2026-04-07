import { useState, useCallback } from 'react'
import emailjs from '@emailjs/browser'

// ─── EmailJS Config ───────────────────────────────────────────────────────────
// 1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
// 2. Create a Service (Gmail / SMTP) → copy Service ID
// 3. Create a Template with these variables:
//    {{from_name}}, {{from_email}}, {{phone}}, {{organization}},
//    {{role}}, {{primary_interest}}, {{preferred_date}},
//    {{preferred_time}}, {{time_zone}}, {{team_size}},
//    {{message}}, {{to_email}}
// 4. Copy Template ID and Public Key below
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'   // e.g. 'user_XXXXXXXXXXXXXXX'
// ─────────────────────────────────────────────────────────────────────────────

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

  .lb-root .lb-select {
    width: 100%; padding: 11px 36px 11px 14px;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 12px center;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
    font-weight: 400; color: #1e293b; outline: none;
    transition: all .2s ease; box-sizing: border-box;
    appearance: none; -webkit-appearance: none; cursor: pointer;
  }
  .lb-root .lb-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.08); }
  .lb-root .lb-select:hover:not(:focus) { border-color: #cbd5e1; }
  .lb-root .lb-select option { color: #1e293b; }
  .lb-root .lb-select.lb-placeholder { color: #94a3b8; }

  .lb-root .lb-checkbox-wrap {
    display: flex; align-items: flex-start; gap: 10px; cursor: pointer;
  }
  .lb-root .lb-checkbox {
    width: 18px; height: 18px; min-width: 18px;
    border: 1.5px solid #e2e8f0; border-radius: 5px;
    background: #fff; appearance: none; -webkit-appearance: none;
    cursor: pointer; transition: all .2s ease; margin-top: 1px;
    position: relative;
  }
  .lb-root .lb-checkbox:checked {
    background: #3b82f6; border-color: #3b82f6;
  }
  .lb-root .lb-checkbox:checked::after {
    content: '';
    position: absolute; top: 2px; left: 5px;
    width: 5px; height: 9px;
    border: 2px solid #fff; border-top: none; border-left: none;
    transform: rotate(45deg);
  }
  .lb-root .lb-checkbox:focus { box-shadow: 0 0 0 3px rgba(59,130,246,.08); outline: none; }

  .lb-root .lb-error {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px; color: #ef4444; margin-top: 4px;
    display: flex; align-items: center; gap: 4px;
  }

  .lb-root .lb-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lbSpin .7s linear infinite;
  }
  @keyframes lbSpin { to { transform: rotate(360deg); } }
`

const TIME_ZONES = [
  'Pacific/Honolulu','America/Anchorage','America/Los_Angeles','America/Denver',
  'America/Chicago','America/New_York','America/Sao_Paulo','Europe/London',
  'Europe/Paris','Europe/Berlin','Europe/Moscow','Asia/Dubai','Asia/Kolkata',
  'Asia/Bangkok','Asia/Singapore','Asia/Tokyo','Australia/Sydney','Pacific/Auckland',
]

const PRIMARY_INTERESTS = [
  'Cancer Early Detection',
  'Treatment Response Monitoring',
  'Minimal Residual Disease (MRD)',
  'Tumor Mutational Burden (TMB)',
  'ctDNA / Liquid Biopsy Analytics',
  'CTC Detection & Profiling',
  'AI-Powered Risk Scoring',
  'Multi-Cancer Screening',
  'Research & Clinical Trials',
  'Hospital / Lab Integration',
  'Other',
]

const TEAM_SIZES = ['1–10','11–50','51–200','201–500','500+']

const getInitial = () => ({
  firstName: '', lastName: '', email: '',
  organization: '', role: '', phone: '',
  primaryInterest: '', date: '', time: '',
  timeZone: '', teamSize: '', message: '',
  consent: false,
})

const anim = (delay = 0, dur = '0.6s') =>
  `lbFadeUp ${dur} cubic-bezier(0.16,1,0.3,1) ${delay}s both`

/* ─── Field Error ─── */
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="lb-error">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </p>
  )
}

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
        <div
          className="relative mx-auto mb-8 w-24 h-24"
          style={{ animation: 'lbSoftBounce .7s cubic-bezier(0.34,1.56,0.64,1) .1s both' }}
        >
          <div className="absolute inset-0 rounded-full bg-blue-200/40" style={{ animation: 'lbSuccessRipple 1.6s ease-out .5s forwards' }} />
          <div className="absolute inset-0 rounded-full bg-blue-100/30" style={{ animation: 'lbSuccessRipple 1.6s ease-out .85s forwards' }} />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-[0_10px_40px_rgba(59,130,246,.3)]" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <path
              d="M30 52 L43 65 L70 38"
              stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 65, strokeDashoffset: 65, animation: 'lbCheckStroke .5s ease-out .65s forwards' }}
            />
          </svg>
        </div>

        <h2
          className="font-['Outfit'] text-4xl font-bold text-slate-900 tracking-tight mb-3"
          style={{ animation: anim(.45) }}
        >
          Demo Booked!
        </h2>
        <p
          className="font-['Plus_Jakarta_Sans'] text-slate-400 text-sm leading-relaxed mb-10 font-light"
          style={{ animation: anim(.6) }}
        >
          Your <span className="text-blue-600 font-medium">OncotTrace-AI</span> demo request has been received.
          Our oncology team will reach out within 24 hours.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10" style={{ animation: anim(.75) }}>
          {[
            { icon: '📧', label: 'Confirmation', sub: 'Email sent' },
            { icon: '📅', label: 'Scheduling',   sub: 'Slot confirmed' },
            { icon: '🧬', label: 'Demo',          sub: 'Personalized' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-100 p-4 text-center shadow-sm hover:-translate-y-0.5 transition-transform duration-200"
            >
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
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Home
        </button>
      </div>
    </div>
  )
}

/* ─── Main booking form ─── */
export default function LBdemo({ onBack }) {
  const [formData, setFormData]   = useState(getInitial)
  const [errors,   setErrors]     = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending,   setSending]   = useState(false)
  const [sendError, setSendError] = useState('')

  const handleChange = useCallback(
    (field) => (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setFormData(p => ({ ...p, [field]: value }))
      setErrors(p => ({ ...p, [field]: '' }))
    },
    []
  )

  /* ─── Validation ─── */
  const validate = (data) => {
    const e = {}
    if (!data.firstName.trim())      e.firstName      = 'First name is required.'
    if (!data.lastName.trim())       e.lastName       = 'Last name is required.'
    if (!data.email.trim())          e.email          = 'Work email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                     e.email          = 'Enter a valid email address.'
    if (!data.organization.trim())   e.organization   = 'Organization is required.'
    if (!data.primaryInterest)       e.primaryInterest= 'Please select a primary interest.'
    if (!data.consent)               e.consent        = 'Please agree to be contacted.'
    return e
  }

  /* ─── Submit ─── */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setSendError('')

    const errs = validate(formData)
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Scroll to first error
      const firstKey = Object.keys(errs)[0]
      document.getElementById(`lb-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSending(true)
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email:         'info@oncotraceai.org',
          from_name:        `${formData.firstName} ${formData.lastName}`,
          from_email:       formData.email,
          phone:            formData.phone || 'Not provided',
          organization:     formData.organization,
          role:             formData.role || 'Not specified',
          primary_interest: formData.primaryInterest,
          preferred_date:   formData.date || 'Not specified',
          preferred_time:   formData.time || 'Not specified',
          time_zone:        formData.timeZone || 'Not specified',
          team_size:        formData.teamSize || 'Not specified',
          message:          formData.message || 'No additional notes.',
          consent:          'Yes – agreed to be contacted',
        },
        EMAILJS_PUBLIC_KEY
      )
      setSubmitted(true)
    } catch (err) {
      console.error('EmailJS error:', err)
      setSendError('Something went wrong. Please try again or email us directly at info@oncotraceai.org.')
    } finally {
      setSending(false)
    }
  }, [formData])

  if (submitted) return <SuccessScreen onBack={() => { setSubmitted(false); onBack?.() }} />

  return (
    <>
      <style>{scopedCSS}</style>
      <div className="lb-root relative min-h-screen bg-[#f8fafc]">

        {/* Background texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle,#94a3b8 0.5px,transparent 0.5px)', backgroundSize: '32px 32px' }}
        />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.05),transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.04),transparent 65%)' }}
        />

        <main className="relative z-10 w-full max-w-[640px] mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16">

          {/* ── Top bar ── */}
          <div className="flex items-center justify-between mb-8" style={{ animation: anim(.05) }}>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-white rounded-xl shadow-sm px-5 py-2.5 text-slate-600 hover:text-slate-900 font-['DM_Sans'] text-[13px] font-semibold tracking-wide transition-all duration-200 hover:shadow-md hover:-translate-y-px cursor-pointer"
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

          {/* ── Header ── */}
          <div className="text-center mb-10" style={{ animation: anim(.12) }}>
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

          {/* ── Form card ── */}
          <div
            className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8 md:p-10"
            style={{ animation: anim(.22) }}
          >
            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-slate-100">
              {['ctDNA Analysis','CTC Detection','Real-time Monitoring','AI Risk Scoring'].map((f, i) => (
                <span
                  key={i}
                  className="font-['DM_Sans'] text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-3 py-1 tracking-wide"
                >
                  {f}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* ── Row 1: First + Last name ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="lb-label" htmlFor="lb-firstName">
                    Full Name – First <span className="text-red-400/70">*</span>
                  </label>
                  <input
                    id="lb-firstName" type="text" className="lb-input"
                    placeholder="Shri"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    style={errors.firstName ? { borderColor: '#ef4444' } : {}}
                  />
                  <FieldError msg={errors.firstName} />
                </div>
                <div>
                  <label className="lb-label" htmlFor="lb-lastName">
                    Full Name – Last <span className="text-red-400/70">*</span>
                  </label>
                  <input
                    id="lb-lastName" type="text" className="lb-input"
                    placeholder="Lakshmi"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    style={errors.lastName ? { borderColor: '#ef4444' } : {}}
                  />
                  <FieldError msg={errors.lastName} />
                </div>
              </div>

              {/* ── Work Email ── */}
              <div>
                <label className="lb-label" htmlFor="lb-email">
                  Work Email <span className="text-red-400/70">*</span>
                </label>
                <input
                  id="lb-email" type="email" className="lb-input"
                  placeholder="you@hospital.org"
                  value={formData.email}
                  onChange={handleChange('email')}
                  style={errors.email ? { borderColor: '#ef4444' } : {}}
                />
                <FieldError msg={errors.email} />
              </div>

              {/* ── Organization ── */}
              <div>
                <label className="lb-label" htmlFor="lb-organization">
                  Organization <span className="text-red-400/70">*</span>
                </label>
                <input
                  id="lb-organization" type="text" className="lb-input"
                  placeholder="Acme Health System"
                  value={formData.organization}
                  onChange={handleChange('organization')}
                  style={errors.organization ? { borderColor: '#ef4444' } : {}}
                />
                <FieldError msg={errors.organization} />
              </div>

              {/* ── Role / Title ── */}
              <div>
                <label className="lb-label" htmlFor="lb-role">Role / Title</label>
                <select
                  id="lb-role"
                  className={`lb-select${!formData.role ? ' lb-placeholder' : ''}`}
                  value={formData.role}
                  onChange={handleChange('role')}
                >
                  <option value="">Select your role…</option>
                  <option>Oncologist</option>
                  <option>Pathologist</option>
                  <option>Radiologist</option>
                  <option>Researcher / Scientist</option>
                  <option>Chief of Radiology</option>
                  <option>Hospital Administrator</option>
                  <option>Lab Director</option>
                  <option>Clinical Data Analyst</option>
                  <option>Other</option>
                </select>
              </div>

              {/* ── Phone ── */}
              <div>
                <label className="lb-label" htmlFor="lb-phone">Phone (optional)</label>
                <input
                  id="lb-phone" type="tel" className="lb-input"
                  placeholder="+1 555 000 0000"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                />
              </div>

              {/* ── Primary Interest ── */}
              <div>
                <label className="lb-label" htmlFor="lb-primaryInterest">
                  Primary Interest <span className="text-red-400/70">*</span>
                </label>
                <select
                  id="lb-primaryInterest"
                  className={`lb-select${!formData.primaryInterest ? ' lb-placeholder' : ''}`}
                  value={formData.primaryInterest}
                  onChange={handleChange('primaryInterest')}
                  style={errors.primaryInterest ? { borderColor: '#ef4444' } : {}}
                >
                  <option value="">Select one</option>
                  {PRIMARY_INTERESTS.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <FieldError msg={errors.primaryInterest} />
              </div>

              {/* ── Preferred Date + Time ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="lb-label" htmlFor="lb-date">Preferred Date</label>
                  <input
                    id="lb-date" type="date" className="lb-input"
                    value={formData.date}
                    onChange={handleChange('date')}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                <div>
                  <label className="lb-label" htmlFor="lb-time">Preferred Time</label>
                  <input
                    id="lb-time" type="time" className="lb-input"
                    value={formData.time}
                    onChange={handleChange('time')}
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>

              {/* ── Time Zone ── */}
              <div>
                <label className="lb-label" htmlFor="lb-timeZone">Time Zone</label>
                <select
                  id="lb-timeZone"
                  className={`lb-select${!formData.timeZone ? ' lb-placeholder' : ''}`}
                  value={formData.timeZone}
                  onChange={handleChange('timeZone')}
                >
                  <option value="">Select your time zone</option>
                  {TIME_ZONES.map(tz => (
                    <option key={tz} value={tz}>{tz.replace(/_/g,' ')}</option>
                  ))}
                </select>
              </div>

              {/* ── Team Size ── */}
              <div>
                <label className="lb-label" htmlFor="lb-teamSize">Team Size</label>
                <select
                  id="lb-teamSize"
                  className={`lb-select${!formData.teamSize ? ' lb-placeholder' : ''}`}
                  value={formData.teamSize}
                  onChange={handleChange('teamSize')}
                >
                  <option value="">Select team size</option>
                  {TEAM_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* ── Goals / Notes ── */}
              <div>
                <label className="lb-label" htmlFor="lb-message">Goals / Notes</label>
                <textarea
                  id="lb-message" className="lb-textarea"
                  placeholder="Share your clinical workflows, data sources, success criteria, or any specific questions about liquid biopsy integration…"
                  value={formData.message}
                  onChange={handleChange('message')}
                  rows={4}
                />
              </div>

              {/* ── Consent ── */}
              <div
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60"
                style={errors.consent ? { borderColor: '#fca5a5', background: '#fff5f5' } : {}}
              >
                <label className="lb-checkbox-wrap" htmlFor="lb-consent">
                  <input
                    id="lb-consent" type="checkbox" className="lb-checkbox"
                    checked={formData.consent}
                    onChange={handleChange('consent')}
                  />
                  <span className="font-['Plus_Jakarta_Sans'] text-[12.5px] text-slate-500 leading-snug font-light">
                    I agree to be contacted about{' '}
                    <span className="text-blue-600 font-medium">OncoTrace-AI</span> and consent to the
                    processing of my information for scheduling and follow-up.{' '}
                    <span className="text-slate-400">Your info stays private. We'll never sell your data.</span>
                  </span>
                </label>
                <FieldError msg={errors.consent} />
              </div>

              {/* ── Send Error ── */}
              {sendError && (
                <div className="p-4 rounded-xl border border-red-100 bg-red-50 font-['Plus_Jakarta_Sans'] text-[12.5px] text-red-600 leading-relaxed">
                  {sendError}
                </div>
              )}

              {/* ── Submit row ── */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  type="submit"
                  disabled={sending}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-xl font-['DM_Sans'] text-[13px] font-semibold tracking-wide bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,.25)] hover:shadow-[0_8px_32px_rgba(59,130,246,.35)] hover:-translate-y-0.5 transition-all duration-300 border-none cursor-pointer min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <span className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-500" />
                  {sending ? (
                    <>
                      <span className="lb-spinner" />
                      <span className="relative z-10">Sending…</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="relative z-10"
                      >
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.16 7.84a16 16 0 006 6l1.2-1.2a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                      </svg>
                      <span className="relative z-10">Request Demo</span>
                    </>
                  )}
                </button>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] text-slate-400 text-center sm:text-right font-light leading-snug">
                  HIPAA-aware platform.<br className="hidden sm:block" /> Your data stays private.
                </span>
              </div>

            </form>
          </div>

          {/* ── Trust indicators ── */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3" style={{ animation: anim(.38) }}>
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