import { useState } from 'react'

const STEPS = [
  {
    id: '01', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
    title: 'Blood Sample',
    sub: 'Collection',
    desc: 'A simple 10ml peripheral blood draw. Our cfDNA extraction achieves >95% recovery with minimal degradation — no invasive tissue biopsy needed.',
    tags: ['cfDNA','cfRNA','Exosomes'],
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
        <circle cx="20" cy="20" r="16" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5"/>
        <path d="M20 12v4M20 24v4M12 20h4M24 20h4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: '02', color: '#0891b2', bg: '#f0fdfa', border: '#99f6e4',
    title: 'Sequencing',
    sub: 'Multi-Omic',
    desc: 'Ultra-deep targeted sequencing at 50,000× coverage with whole-methylome profiling and RNA-seq — detecting mutations down to 0.01% VAF.',
    tags: ['SNV','CNV','Methylation','Fusion'],
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
        <circle cx="20" cy="20" r="16" fill="#f0fdfa" stroke="#99f6e4" strokeWidth="1.5"/>
        <rect x="12" y="14" width="16" height="3" rx="1.5" fill="#0891b2" opacity="0.3"/>
        <rect x="12" y="20" width="12" height="3" rx="1.5" fill="#0891b2" opacity="0.3"/>
        <rect x="12" y="26" width="14" height="3" rx="1.5" fill="#0891b2" opacity="0.3"/>
        <circle cx="27" cy="28.5" r="3" fill="#0891b2" opacity="0.5" stroke="#0891b2" strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: '03', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe',
    title: 'AI Analysis',
    sub: 'Deep Learning',
    desc: 'Our 1.2B-parameter transformer model — trained on 2.4M+ clinical samples — integrates multi-modal features to generate comprehensive tumor signatures.',
    tags: ['Transformer','Multi-modal','Explainable AI'],
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
        <circle cx="20" cy="20" r="16" fill="#eef2ff" stroke="#c7d2fe" strokeWidth="1.5"/>
        <rect x="13" y="13" width="6" height="6" rx="1.5" fill="#4f46e5" opacity="0.25" stroke="#4f46e5" strokeWidth="1"/>
        <rect x="21" y="13" width="6" height="6" rx="1.5" fill="#4f46e5" opacity="0.15" stroke="#4f46e5" strokeWidth="1"/>
        <rect x="13" y="21" width="6" height="6" rx="1.5" fill="#4f46e5" opacity="0.15" stroke="#4f46e5" strokeWidth="1"/>
        <rect x="21" y="21" width="6" height="6" rx="1.5" fill="#4f46e5" opacity="0.25" stroke="#4f46e5" strokeWidth="1"/>
        <path d="M19 16h2M16 19v2M24 19v2M19 24h2" stroke="#4f46e5" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: '04', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd',
    title: 'Clinical Report',
    sub: 'Actionable',
    desc: 'Oncologist-ready reports with variant classification, treatment response predictions, resistance mechanisms, and clinical trial matching — in under 14 hours.',
    tags: ['ACMG','Trial Match','EHR Ready'],
    icon: (
      <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none">
        <circle cx="20" cy="20" r="16" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1.5"/>
        <rect x="13" y="10" width="14" height="18" rx="2" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1"/>
        <path d="M16 15h8M16 18h6M16 21h4" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="26" cy="27" r="4" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5"/>
        <path d="M24.2 27l1.2 1.2L27.8 25.5" stroke="#0284c7" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
]

export default function PipelineSection() {
  const [active, setActive] = useState(0)
  const s = STEPS[active]

  return (
    <section id="pipeline" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="pill mb-4 block w-fit mx-auto">How It Works</span>
          <h2 className="font-display font-800 text-4xl text-slate-900">
            The BiopsAI <span className="text-gradient">Pipeline</span>
          </h2>
          <p className="font-sans text-slate-500 mt-3 max-w-lg mx-auto font-light">
            From a single blood draw to a comprehensive genomic portrait — powered end-to-end by artificial intelligence.
          </p>
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STEPS.map((st, i) => (
            <button
              key={st.id}
              onClick={() => setActive(i)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 hover-lift ${
                active === i
                  ? 'shadow-card-md'
                  : 'bg-white border-slate-100 hover:border-blue-100'
              }`}
              style={active === i ? { background: st.bg, borderColor: st.border } : {}}
            >
              <div className="mb-3">{st.icon}</div>
              <div className="font-mono text-xs font-600 mb-1" style={{ color: active === i ? st.color : '#94a3b8' }}>
                Step {st.id}
              </div>
              <div className="font-display font-700 text-sm text-slate-800">{st.title}</div>
              <div className="font-sans text-xs text-slate-400 mt-0.5">{st.sub}</div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="card-elevated p-8 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {s.icon}
              <div>
                <div className="font-mono text-xs font-600" style={{ color: s.color }}>Step {s.id} — {s.sub}</div>
                <div className="font-display font-700 text-xl text-slate-900">{s.title}</div>
              </div>
            </div>
            <p className="font-sans text-slate-500 leading-relaxed font-light mb-5">{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.tags.map(t => (
                <span key={t} className="chip" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="font-sans text-xs text-slate-400 font-medium mb-4">Pipeline Progress</div>
            {STEPS.map((st, i) => (
              <div key={st.id} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{ background: i <= active ? st.color : '#f1f5f9', color: i <= active ? 'white' : '#94a3b8' }}
                >
                  {i < active ? '✓' : st.id.replace('0','')}
                </div>
                <div className="flex-1 progress-track">
                  <div className="progress-fill" style={{ width: i < active ? '100%' : i === active ? '60%' : '0%', background: `linear-gradient(90deg, ${st.color}, ${st.color}80)` }} />
                </div>
                <span className="font-sans text-xs text-slate-400 w-16 text-right">{st.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}