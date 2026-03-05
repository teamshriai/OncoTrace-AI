const SERVICES = [
  {
    title: 'Early Detection',
    icon: '🔍',
    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
    desc: 'Multi-cancer early detection from a single blood draw — identifying stage I-II cancers when treatment is most effective.',
    badge: 'Screening',
    stat: '80%', statLabel: 'Stage I Sensitivity',
    tags: ['MRD', 'Annual Screening', 'Stage I-II'],
  },
  {
    title: 'Treatment Monitoring',
    icon: '📡',
    color: '#0891b2', bg: '#f0fdfa', border: '#99f6e4',
    desc: 'Real-time tracking of tumor dynamics, emerging resistance mutations, and treatment response during therapy cycles.',
    badge: 'Monitoring',
    stat: '2wk', statLabel: 'Monitoring Cadence',
    tags: ['ctDNA Kinetics', 'Resistance', 'Response'],
  },
  {
    title: 'Minimal Residual Disease',
    icon: '🎯',
    color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe',
    desc: 'Ultrasensitive detection of residual disease post-surgery — months before conventional imaging can detect relapse.',
    badge: 'Post-treatment',
    stat: '0.001%', statLabel: 'Detection VAF',
    tags: ['MRD', 'Relapse Prediction', 'Personalized'],
  },
  {
    title: 'Therapy Selection',
    icon: '💊',
    color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd',
    desc: 'Comprehensive genomic profiling to match patients with targeted therapies, immunotherapies, and open clinical trials.',
    badge: 'Precision Oncology',
    stat: '800+', statLabel: 'Trial Matches',
    tags: ['TMB & MSI', 'Biomarker', 'Immunotherapy'],
  },
]

export default function ServicesSection() {
  return (
    <section id="clinical" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="pill mb-4 block w-fit mx-auto">Clinical Services</span>
          <h2 className="font-display font-800 text-4xl text-slate-900">
            Precision medicine at{' '}
            <span className="text-gradient">every stage of care</span>
          </h2>
          <p className="font-sans text-slate-500 mt-3 max-w-lg mx-auto font-light">
            BiopsAI supports the full continuum of oncology — from population screening to personalized treatment decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div key={s.title}
                 className="card-elevated p-6 hover-lift group cursor-pointer transition-all duration-300"
                 style={{ animationDelay: `${i * 80}ms` }}>

              {/* Icon + badge row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                     style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                  {s.icon}
                </div>
                <span className="chip text-[10px]" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                  {s.badge}
                </span>
              </div>

              <h3 className="font-display font-700 text-base text-slate-900 mb-2">{s.title}</h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed font-light mb-4">{s.desc}</p>

              {/* Key stat */}
              <div className="rounded-xl py-3 px-4 text-center mb-4"
                   style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <div className="font-display font-800 text-xl" style={{ color: s.color }}>{s.stat}</div>
                <div className="font-sans text-[10px] text-slate-400">{s.statLabel}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="chip text-[10px] py-0.5"
                        style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Learn more arrow */}
              <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-sans text-xs font-600" style={{ color: s.color }}>Learn More</span>
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" style={{ color: s.color }}>
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}