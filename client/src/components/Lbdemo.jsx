// LBdemo.jsx (React + Vite + Tailwind)
import { useState, useCallback } from 'react'
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID_LB
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_LB
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const TODAY_LOCAL = (() => {
  const d = new Date()
  const tzOffsetMs = d.getTimezoneOffset() * 60 * 1000
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 10)
})()

const scopedCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  .lb-root *, .lb-root *::before, .lb-root *::after { box-sizing: border-box; }

  .lb-root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @keyframes lb-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lb-check-stroke {
    to { stroke-dashoffset: 0; }
  }
  @keyframes lb-scale-in {
    0%   { transform: scale(0.65); opacity: 0; }
    65%  { transform: scale(1.06); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes lb-shimmer {
    0%   { background-position: -400% 0; }
    100% { background-position: 400% 0; }
  }
  @keyframes lb-pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.45; transform: scale(0.8); }
  }
  @keyframes lb-ripple {
    0%   { transform: scale(1); opacity: 0.2; }
    100% { transform: scale(3); opacity: 0; }
  }
  @keyframes lb-spin {
    to { transform: rotate(360deg); }
  }

  .lb-label {
    display: block;
    font-size: 11.5px;
    font-weight: 500;
    color: #6b7280;
    letter-spacing: 0.015em;
    margin-bottom: 5px;
  }

  .lb-input,
  .lb-select,
  .lb-textarea {
    width: 100%;
    padding: 10px 13px;
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(209,213,219,0.8);
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    font-weight: 400;
    color: #111827;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
  }

  .lb-input::placeholder,
  .lb-textarea::placeholder { color: #9ca3af; }

  .lb-input:hover:not(:focus),
  .lb-select:hover:not(:focus),
  .lb-textarea:hover:not(:focus) {
    border-color: rgba(156,163,175,0.9);
    background: rgba(255,255,255,0.88);
  }

  .lb-input:focus,
  .lb-select:focus,
  .lb-textarea:focus {
    border-color: rgba(37,99,235,0.7);
    box-shadow: 0 0 0 3.5px rgba(37,99,235,0.09);
    background: rgba(255,255,255,0.95);
  }

  .lb-input.lb-err,
  .lb-select.lb-err,
  .lb-textarea.lb-err {
    border-color: rgba(239,68,68,0.7);
    box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
  }

  .lb-select {
    padding-right: 36px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 11px center;
    cursor: pointer;
  }
  .lb-select.lb-ph { color: #9ca3af; }

  .lb-textarea {
    resize: vertical;
    min-height: 86px;
    line-height: 1.6;
  }

  .lb-error-msg {
    font-size: 11px;
    color: #ef4444;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
  }

  .lb-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: lb-spin 0.65s linear infinite;
    flex-shrink: 0;
  }

  .lb-checkbox {
    width: 16px; height: 16px; min-width: 16px;
    border: 1.5px solid rgba(209,213,219,0.9);
    border-radius: 4px;
    background: rgba(255,255,255,0.8);
    appearance: none; -webkit-appearance: none;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
    margin-top: 1px;
    flex-shrink: 0;
  }
  .lb-checkbox:checked { background: #2563eb; border-color: #2563eb; }
  .lb-checkbox:checked::after {
    content: '';
    position: absolute;
    top: 1px; left: 4px;
    width: 5px; height: 9px;
    border: 1.5px solid #fff;
    border-top: none; border-left: none;
    transform: rotate(45deg);
  }
  .lb-checkbox:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.1); outline: none; }

  .lb-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0 18px;
  }
  .lb-divider span {
    font-size: 10.5px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    white-space: nowrap;
  }
  .lb-divider::before,
  .lb-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(209,213,219,0.5), transparent);
  }

  .lb-btn {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 26px;
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    border: none;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    min-height: 43px;
    white-space: nowrap;
    box-shadow: 0 3px 14px rgba(37,99,235,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
    letter-spacing: 0.005em;
  }
  .lb-btn:not(:disabled):hover {
    transform: translateY(-1.5px);
    box-shadow: 0 7px 22px rgba(37,99,235,0.32), inset 0 1px 0 rgba(255,255,255,0.12);
    background: linear-gradient(135deg, #2d6bef 0%, #2057d4 100%);
  }
  .lb-btn:not(:disabled):active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(37,99,235,0.2);
  }
  .lb-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lb-btn .lb-shine {
    position: absolute; top: 0; left: -120%;
    width: 55%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent);
    transition: left 0.55s ease;
  }
  .lb-btn:not(:disabled):hover .lb-shine { left: 160%; }

  .lb-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 13px;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(209,213,219,0.7);
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
  .lb-back-btn:hover {
    background: rgba(255,255,255,0.85);
    border-color: rgba(156,163,175,0.8);
    transform: translateX(-1px);
  }

  @media (max-width: 900px) {
    .lb-layout { grid-template-columns: 1fr !important; }
    .lb-sidebar-wrap { display: grid !important; grid-template-columns: 1fr 1fr; gap: 12px; }
    .lb-sidebar-bottom { display: none !important; }
  }
  @media (max-width: 580px) {
    .lb-sidebar-wrap { grid-template-columns: 1fr !important; }
    .lb-grid-2 { grid-template-columns: 1fr !important; }
    .lb-grid-3 { grid-template-columns: 1fr !important; }
    .lb-submit-row { flex-direction: column !important; align-items: stretch !important; }
    .lb-btn { width: 100%; }
  }
  @media (min-width: 581px) {
    .lb-grid-2 { grid-template-columns: 1fr 1fr; }
    .lb-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
  }
`

const TIME_ZONES = [
  'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 'America/Denver',
  'America/Chicago', 'America/New_York', 'America/Sao_Paulo', 'Europe/London',
  'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow', 'Asia/Dubai', 'Asia/Kolkata',
  'Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland',
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

const ROLES = [
  'Oncologist', 'Pathologist', 'Radiologist', 'Researcher / Scientist',
  'Chief of Radiology', 'Hospital Administrator', 'Lab Director',
  'Clinical Data Analyst', 'Other',
]

const TEAM_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']

const getInitial = () => ({
  firstName: '', lastName: '', email: '', organization: '',
  role: '', phone: '', primaryInterest: '',
  date: '', time: '', timeZone: '', teamSize: '', message: '', consent: false,
})

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const Ic = {
  ArrowLeft: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
    </svg>
  ),
  Phone: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.16 7.84a16 16 0 006 6l1.2-1.2a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  ),
  Mail: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
    </svg>
  ),
  Calendar: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Shield: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Globe: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  Dna: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /><path d="M2 9c6.667 6 13.333 0 20 6" />
      <path d="M5 4.1a35.3 35.3 0 0114.5 15.8" /><path d="M4.5 19.9A35.3 35.3 0 0119 4.1" />
    </svg>
  ),
  Check: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: ({ size = 11 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Lock: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  Zap: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Code: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Users: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Activity: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Home: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
}

// ── Reusable helpers ───────────────────────────────────────────────────────────
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="lb-error-msg">
      <Ic.AlertCircle size={11} />
      {msg}
    </p>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="lb-label">
        {label}
        {required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      <FieldError msg={error} />
    </div>
  )
}

const glassCard = {
  background: 'rgba(255,255,255,0.62)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.60)',
  boxShadow: '0 4px 32px rgba(0,0,0,0.055), 0 1px 4px rgba(0,0,0,0.025), inset 0 1px 0 rgba(255,255,255,0.75)',
}

const glassCardSubtle = {
  background: 'rgba(255,255,255,0.50)',
  backdropFilter: 'blur(16px) saturate(145%)',
  WebkitBackdropFilter: 'blur(16px) saturate(145%)',
  border: '1px solid rgba(255,255,255,0.55)',
  boxShadow: '0 2px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.68)',
}

const iconBox = {
  width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0,
  background: 'rgba(239,246,255,0.85)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  border: '1px solid rgba(191,219,254,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#2563eb',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
}

// ── Success Screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ onBack }) {
  return (
    <div
      className="lb-root"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f0f7ff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <style>{scopedCSS}</style>

      <div style={{ position: 'fixed', top: '-120px', right: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-100px', left: '-60px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 50,
        background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #818cf8, #3b82f6, #1d4ed8)',
        backgroundSize: '400% 100%', animation: 'lb-shimmer 3.5s linear infinite',
      }} />

      <div
        style={{
          ...glassCard,
          borderRadius: '20px',
          textAlign: 'center',
          maxWidth: '460px',
          width: '100%',
          padding: '56px 36px',
          animation: 'lb-fade-up 0.5s ease both',
        }}
      >
        <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 28px', animation: 'lb-scale-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(37,99,235,0.1)', animation: 'lb-ripple 1.6s ease-out 0.5s forwards' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(37,99,235,0.06)', animation: 'lb-ripple 1.6s ease-out 0.85s forwards' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 10px 36px rgba(37,99,235,0.32)' }} />
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 80 80" fill="none">
            <path
              d="M23 41L34 52L57 29"
              stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ strokeDasharray: 65, strokeDashoffset: 65, animation: 'lb-check-stroke 0.45s ease-out 0.65s forwards' }}
            />
          </svg>
        </div>

        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '27px', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em', margin: '0 0 10px' }}>
          Request Received
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14.5px', color: '#6b7280', fontWeight: 400, lineHeight: 1.65, margin: '0 0 6px' }}>
          Our <span style={{ color: '#2563eb', fontWeight: 500 }}>OncoTrace‑AI</span> team has received your demo request and will be in touch shortly to explore how we can best serve your needs.
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#9ca3af', fontWeight: 400, margin: '0 0 36px' }}>
          Keep an eye on your inbox — we'll coordinate from there.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '32px', animation: 'lb-fade-up 0.5s ease 0.35s both' }}>
          {[
            { icon: <Ic.Mail size={15} />, label: 'Confirmation', sub: 'Sent to your inbox' },
            { icon: <Ic.Users size={15} />, label: 'Team Review', sub: "We'll reach out soon" },
            { icon: <Ic.Dna size={15} />, label: 'Demo', sub: 'Tailored for you' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.65)',
                borderRadius: '11px', padding: '14px 10px', textAlign: 'center',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '7px', color: '#2563eb' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px' }}>{s.label}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10.5px', color: '#9ca3af', fontWeight: 400 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '10px 22px', borderRadius: '9px',
            fontFamily: 'Inter, sans-serif', fontSize: '13.5px', fontWeight: 600,
            background: '#111827', color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1f2937'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#111827'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.18)'
          }}
        >
          <Ic.Home size={14} />
          Back to Home
        </button>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function LBdemo({ onBack }) {
  const [formData, setFormData] = useState(getInitial)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(p => ({ ...p, [field]: value }))
    setErrors(p => ({ ...p, [field]: '' }))
  }, [])

  const validate = (data) => {
    const e = {}
    if (!data.firstName.trim()) e.firstName = 'First name is required.'
    if (!data.lastName.trim()) e.lastName = 'Last name is required.'
    if (!data.email.trim()) e.email = 'Work email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email address.'
    if (!data.organization.trim()) e.organization = 'Organization is required.'
    if (!data.role) e.role = 'Please select a role.'
    if (!data.phone.trim()) e.phone = 'Phone is required.'
    if (!data.primaryInterest) e.primaryInterest = 'Please select a primary interest.'
    if (!data.date) e.date = 'Preferred date is required.'
    if (!data.time) e.time = 'Preferred time is required.'
    if (!data.timeZone) e.timeZone = 'Time zone is required.'
    if (!data.teamSize) e.teamSize = 'Team size is required.'
    if (!data.consent) e.consent = 'Please agree to be contacted.'
    return e
  }

  const canSubmit =
    formData.firstName.trim() && formData.lastName.trim() &&
    formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.organization.trim() && formData.role && formData.phone.trim() &&
    formData.primaryInterest && formData.date && formData.time &&
    formData.timeZone && formData.teamSize && formData.consent

  // ✅ Fixed: using SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY (not EMAILJS_* variants)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (sending) return
    setSendError('')
    const errs = validate(formData)
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.getElementById(`lb-${Object.keys(errs)[0]}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setSendError('Email service is not configured properly.')
      return
    }
    setSending(true)
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          phone: formData.phone || 'Not provided',
          organization: formData.organization,
          role: formData.role || 'Not specified',
          primary_interest: formData.primaryInterest || 'Not specified',
          preferred_date: formData.date || 'Not specified',
          preferred_time: formData.time || 'Not specified',
          time_zone: formData.timeZone || 'Not specified',
          team_size: formData.teamSize || 'Not specified',
          message: formData.message || 'No additional notes.',
          consent: formData.consent ? 'Yes – agreed to be contacted' : 'No',
          product: 'Liquid Biopsy – Real-time Monitoring',
        },
        PUBLIC_KEY
      )
      setSubmitted(true)
    } catch (err) {
      console.error('EmailJS error:', err)
      setSendError('Something went wrong. Please try again or email us at info@oncotraceai.org.')
    } finally {
      setSending(false)
    }
  }, [formData, sending])

  if (submitted) {
    return <SuccessScreen onBack={() => { setSubmitted(false); onBack?.() }} />
  }

  const ic = (field) => `lb-input${errors[field] ? ' lb-err' : ''}`
  const sc = (field, val) => `lb-select${!val ? ' lb-ph' : ''}${errors[field] ? ' lb-err' : ''}`

  return (
    <>
      <style>{scopedCSS}</style>
      <div
        className="lb-root"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #eef3ff 0%, #f8fafc 40%, #f0f6ff 80%, #fafafa 100%)',
          position: 'relative',
          overflowX: 'hidden',
        }}
      >
        <div style={{ position: 'fixed', top: '-140px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.065) 0%, transparent 68%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-120px', left: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 68%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(147,197,253,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 100,
          background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #818cf8, #3b82f6, #1d4ed8)',
          backgroundSize: '400% 100%', animation: 'lb-shimmer 4s linear infinite',
        }} />

        {/* ── Navbar ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(248,250,252,0.72)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: '1px solid rgba(226,232,240,0.6)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={onBack} type="button" className="lb-back-btn">
              <Ic.ArrowLeft />
              Back
            </button>

            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '15.5px', fontWeight: 700, color: '#111827', letterSpacing: '-0.015em', userSelect: 'none' }}>
              Onco<span style={{ color: '#2563eb' }}>Trace</span><span style={{ fontWeight: 300, color: '#94a3b8' }}>‑AI</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', animation: 'lb-pulse-dot 2.2s infinite' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>Live Platform</span>
            </div>
          </div>
        </nav>

        {/* ── Page ── */}
        <main style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '52px 32px 80px' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: '40px', animation: 'lb-fade-up 0.55s ease both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '5px 13px', borderRadius: '20px', marginBottom: '18px',
              background: 'rgba(239,246,255,0.8)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(191,219,254,0.7)',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', animation: 'lb-pulse-dot 2s infinite' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#1d4ed8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Liquid Biopsy Platform
              </span>
            </div>

            <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.12, margin: '0 0 14px', maxWidth: '600px' }}>
              Book a Live Demo
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#64748b', fontWeight: 400, lineHeight: 1.68, margin: 0, maxWidth: '520px' }}>
              Explore how OncoTrace‑AI transforms cancer care with real-time liquid biopsy analytics and AI-driven insights — tailored to your clinical environment.
            </p>
          </div>

          {/* ── Two-column layout ── */}
          <div
            className="lb-layout"
            style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}
          >
            {/* ── Form Card ── */}
            <div
              style={{
                ...glassCard,
                borderRadius: '18px',
                padding: '36px 40px',
                animation: 'lb-fade-up 0.55s ease 0.07s both',
              }}
            >
              {/* Feature chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '30px', paddingBottom: '24px', borderBottom: '1px solid rgba(226,232,240,0.5)' }}>
                {[
                  { label: 'ctDNA Analysis', icon: <Ic.Activity size={11} /> },
                  { label: 'CTC Detection', icon: <Ic.Dna size={11} /> },
                  { label: 'Real-time Monitoring', icon: <Ic.Activity size={11} /> },
                  { label: 'AI Risk Scoring', icon: <Ic.Zap size={11} /> },
                  { label: 'Multi-Cancer Screening', icon: <Ic.Shield size={11} /> },
                ].map((f, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontFamily: 'Inter, sans-serif', fontSize: '11.5px', fontWeight: 500,
                      color: '#475569',
                      background: 'rgba(248,250,252,0.75)',
                      backdropFilter: 'blur(6px)',
                      WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid rgba(226,232,240,0.7)',
                      borderRadius: '7px', padding: '4px 10px',
                    }}
                  >
                    <span style={{ color: '#2563eb', opacity: 0.8 }}>{f.icon}</span>
                    {f.label}
                  </span>
                ))}
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* ── Contact Info ── */}
                <div className="lb-divider"><span>Contact Information</span></div>

                <div className="lb-grid-2" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
                  <Field label="First Name" required error={errors.firstName}>
                    <input id="lb-firstName" type="text" className={ic('firstName')} placeholder="Sarah" value={formData.firstName} onChange={handleChange('firstName')} />
                  </Field>
                  <Field label="Last Name" required error={errors.lastName}>
                    <input id="lb-lastName" type="text" className={ic('lastName')} placeholder="Chen" value={formData.lastName} onChange={handleChange('lastName')} />
                  </Field>
                </div>

                <div className="lb-grid-2" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
                  <Field label="Work Email" required error={errors.email}>
                    <input id="lb-email" type="email" className={ic('email')} placeholder="you@hospital.org" value={formData.email} onChange={handleChange('email')} />
                  </Field>
                  <Field label="Phone" required error={errors.phone}>
                    <input id="lb-phone" type="tel" className={ic('phone')} placeholder="+1 555 000 0000" value={formData.phone} onChange={handleChange('phone')} />
                  </Field>
                </div>

                <div className="lb-grid-2" style={{ display: 'grid', gap: '16px', marginBottom: '28px' }}>
                  <Field label="Organization" required error={errors.organization}>
                    <input id="lb-organization" type="text" className={ic('organization')} placeholder="Mayo Clinic" value={formData.organization} onChange={handleChange('organization')} />
                  </Field>
                  <Field label="Role / Title" required error={errors.role}>
                    <select id="lb-role" className={sc('role', formData.role)} value={formData.role} onChange={handleChange('role')}>
                      <option value="">Select role…</option>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </Field>
                </div>

                {/* ── Demo Preferences ── */}
                <div className="lb-divider"><span>Demo Preferences</span></div>

                <div style={{ marginBottom: '16px' }}>
                  <Field label="Primary Interest" required error={errors.primaryInterest}>
                    <select id="lb-primaryInterest" className={sc('primaryInterest', formData.primaryInterest)} value={formData.primaryInterest} onChange={handleChange('primaryInterest')}>
                      <option value="">Select area of interest…</option>
                      {PRIMARY_INTERESTS.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="lb-grid-3" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
                  <Field label="Preferred Date" required error={errors.date}>
                    <input id="lb-date" type="date" className={ic('date')} value={formData.date} onChange={handleChange('date')} min={TODAY_LOCAL} style={{ colorScheme: 'light' }} />
                  </Field>
                  <Field label="Preferred Time" required error={errors.time}>
                    <input id="lb-time" type="time" className={ic('time')} value={formData.time} onChange={handleChange('time')} style={{ colorScheme: 'light' }} />
                  </Field>
                  <Field label="Team Size" required error={errors.teamSize}>
                    <select id="lb-teamSize" className={sc('teamSize', formData.teamSize)} value={formData.teamSize} onChange={handleChange('teamSize')}>
                      <option value="">Select…</option>
                      {TEAM_SIZES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <Field label="Time Zone" required error={errors.timeZone}>
                    <select id="lb-timeZone" className={sc('timeZone', formData.timeZone)} value={formData.timeZone} onChange={handleChange('timeZone')}>
                      <option value="">Select your time zone…</option>
                      {TIME_ZONES.map(tz => (
                        <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* ── Notes ── */}
                <div className="lb-divider"><span>Additional Notes</span></div>

                <div style={{ marginBottom: '22px' }}>
                  <Field label="Goals / Notes">
                    <textarea
                      id="lb-message"
                      className="lb-textarea"
                      placeholder="Tell us about your clinical workflows, data needs, or any specific questions — we'll tailor the demo accordingly."
                      value={formData.message}
                      onChange={handleChange('message')}
                      rows={3}
                    />
                  </Field>
                </div>

                {/* Consent */}
                <div
                  style={{
                    padding: '14px 16px', borderRadius: '11px', marginBottom: '20px',
                    background: errors.consent ? 'rgba(254,242,242,0.8)' : 'rgba(249,250,251,0.7)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: `1px solid ${errors.consent ? 'rgba(252,165,165,0.7)' : 'rgba(229,231,235,0.6)'}`,
                    transition: 'all 0.18s ease',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }} htmlFor="lb-consent">
                    <input id="lb-consent" type="checkbox" className="lb-checkbox" checked={formData.consent} onChange={handleChange('consent')} />
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', color: '#4b5563', lineHeight: 1.6, fontWeight: 400 }}>
                      I agree to be contacted by the{' '}
                      <span style={{ color: '#2563eb', fontWeight: 500 }}>OncoTrace‑AI</span>{' '}
                      team regarding this demo request and consent to my information being used for follow-up purposes.{' '}
                      <span style={{ color: '#9ca3af' }}>Your data remains private and is never sold.</span>
                    </span>
                  </label>
                  <FieldError msg={errors.consent} />
                </div>

                {/* Send error */}
                {sendError && (
                  <div style={{
                    padding: '13px 16px', borderRadius: '10px', marginBottom: '18px',
                    background: 'rgba(254,242,242,0.85)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(252,165,165,0.6)',
                    fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#dc2626', lineHeight: 1.55,
                  }}>
                    {sendError}
                  </div>
                )}

                {/* Submit row */}
                <div
                  className="lb-submit-row"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}
                >
                  <button type="submit" className="lb-btn" disabled={sending || !canSubmit}>
                    <span className="lb-shine" />
                    {sending ? (
                      <>
                        <span className="lb-spinner" />
                        <span style={{ position: 'relative', zIndex: 1 }}>Sending…</span>
                      </>
                    ) : (
                      <>
                        <span style={{ position: 'relative', zIndex: 1, display: 'flex' }}><Ic.Dna size={14} /></span>
                        <span style={{ position: 'relative', zIndex: 1 }}>Request Demo</span>
                      </>
                    )}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#94a3b8', display: 'flex' }}><Ic.Lock size={12} /></span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: '#94a3b8', fontWeight: 400 }}>
                      HIPAA-aware · End-to-end encrypted
                    </span>
                  </div>
                </div>

              </form>
            </div>

            {/* ── Sidebar ── */}
            <div
              className="lb-sidebar-wrap"
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'lb-fade-up 0.55s ease 0.14s both' }}
            >
              {/* What to expect */}
              <div style={{ ...glassCardSubtle, borderRadius: '15px', padding: '22px' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', fontWeight: 600, color: '#111827', margin: '0 0 16px', letterSpacing: '-0.005em' }}>
                  What to Expect
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  {[
                    { icon: <Ic.Calendar size={14} />, title: 'Guided walkthrough', sub: 'A focused session with our team' },
                    { icon: <Ic.Dna size={14} />, title: 'Personalized demo', sub: 'Tailored to your use case' },
                    { icon: <Ic.Users size={14} />, title: 'Expert Q&A', sub: 'Direct access to specialists' },
                    { icon: <Ic.Check size={14} />, title: 'No commitment', sub: 'Explore freely, decide later' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '11px' }}>
                      <div style={iconBox}>{item.icon}</div>
                      <div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{item.title}</div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', color: '#64748b', fontWeight: 400, marginTop: '1px' }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform capabilities */}
              <div style={{ ...glassCardSubtle, borderRadius: '15px', padding: '22px' }}>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', fontWeight: 600, color: '#111827', margin: '0 0 14px', letterSpacing: '-0.005em' }}>
                  Platform Capabilities
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {[
                    'ctDNA & CTC detection',
                    'Real-time progression monitoring',
                    'AI-powered risk scoring',
                    'Multi-cancer panel screening',
                    'EHR / LIS integration ready',
                    'HIPAA-aware infrastructure',
                    'Clinical trial support',
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                        background: 'rgba(239,246,255,0.9)',
                        border: '1px solid rgba(191,219,254,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2563eb',
                      }}>
                        <Ic.Check size={10} />
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12.5px', color: '#374151', fontWeight: 400 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust + contact */}
              <div className="lb-sidebar-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  background: 'rgba(248,250,252,0.6)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(226,232,240,0.55)',
                  borderRadius: '13px', padding: '16px 18px',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)',
                }}>
                  {[
                    { icon: <Ic.Lock size={12} />, text: 'End-to-end encrypted' },
                    { icon: <Ic.Zap size={12} />, text: 'Response within 24h' },
                    { icon: <Ic.Code size={12} />, text: 'Open source core' },
                    { icon: <Ic.Globe size={12} />, text: 'Global clinical teams' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#6b7280', display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#6b7280', fontWeight: 400 }}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  background: 'rgba(239,246,255,0.65)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(191,219,254,0.5)',
                  borderRadius: '13px', padding: '14px 18px',
                  textAlign: 'center',
                  boxShadow: '0 1px 6px rgba(37,99,235,0.05), inset 0 1px 0 rgba(255,255,255,0.65)',
                }}>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11.5px', fontWeight: 600, color: '#1d4ed8', marginBottom: '3px' }}>
                    Prefer to reach out directly?
                  </div>
                  <a
                    href="mailto:info@oncotraceai.org"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#2563eb', fontWeight: 500, textDecoration: 'none', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    info@oncotraceai.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}