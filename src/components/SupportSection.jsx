const SPECIALISTS = [
  { title: 'Molecular Oncologist', desc: 'Expert in liquid biopsy interpretation and ctDNA dynamics', color: '#2563eb', icon: '🧬' },
  { title: 'Bioinformatician',     desc: 'Multi-omic data integration and variant annotation',        color: '#0891b2', icon: '💻' },
  { title: 'Clinical Geneticist',  desc: 'Germline variant classification and counseling support',    color: '#4f46e5', icon: '🔬' },
]

export default function SupportSection() {
  return (
    <section id="data" className="py-24 bg-gradient-to-br from-white to-[#f0f7ff]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-600 px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" />
            NEW
            <span className="font-sans font-400 opacity-80">Reach out for any questions or to schedule a visit</span>
          </div>

          <h2 className="font-display font-800 text-4xl lg:text-5xl text-slate-900 leading-[1.1] mb-5">
            We are here to support your health at{' '}
            <span className="text-gradient">every stage</span>{' '}
            and look forward
          </h2>

          <p className="font-sans text-slate-500 leading-relaxed font-light mb-8 max-w-md">
            Our multidisciplinary team of oncologists, molecular biologists, and AI scientists are dedicated to delivering timely, accurate, and actionable liquid biopsy results.
          </p>

          {/* Specialist cards — like Medify specialist list */}
          <div className="space-y-4 mb-8">
            {SPECIALISTS.map((sp, i) => (
              <div key={sp.title}
                   className="card p-4 flex items-start gap-4 hover-lift cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                     style={{ background: `${sp.color}12`, border: `1px solid ${sp.color}25` }}>
                  {sp.icon}
                </div>
                <div className="flex-1">
                  <div className="font-display font-700 text-sm text-slate-800">{sp.title}</div>
                  <div className="font-sans text-xs text-slate-400 mt-0.5 font-light">{sp.desc}</div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
                        style={{ background: sp.color }}>
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 11.5l9-9M11.5 2.5H5m6.5 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-primary">Book Consultation</button>
            <button className="btn-outline">Meet Our Team</button>
          </div>
        </div>

        {/* Right — data visualization */}
        <div className="space-y-5">

          {/* Performance card */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-700 text-base text-slate-900">Clinical Validation</h3>
                <div className="font-sans text-xs text-slate-400">Across 12 multi-site studies</div>
              </div>
              <span className="chip chip-blue">Published</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Analytical Sensitivity',  pct: 99.2, color: '#2563eb' },
                { label: 'Clinical Specificity',    pct: 98.7, color: '#0891b2' },
                { label: 'Tissue Concordance',      pct: 96.4, color: '#4f46e5' },
                { label: 'Positive Pred. Value',    pct: 97.1, color: '#0284c7' },
              ].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-sans text-xs text-slate-600">{r.label}</span>
                    <span className="font-display text-xs font-700" style={{ color: r.color }}>{r.pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog / article cards like Medify */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { tag: 'BLOG/ARTICLE', title: 'ctDNA in Early-Stage NSCLC', date: 'Jan 2025', icon: '🧬', color: '#2563eb', bg: '#eff6ff' },
              { tag: 'BLOG/ARTICLE', title: 'AI in Oncology Diagnostics', date: 'Feb 2025', icon: '🤖', color: '#0891b2', bg: '#f0fdfa' },
            ].map(a => (
              <div key={a.title} className="card-elevated p-4 hover-lift cursor-pointer">
                <div className="h-24 rounded-xl mb-3 flex items-center justify-center text-4xl"
                     style={{ background: a.bg }}>
                  {a.icon}
                </div>
                <div className="font-sans text-[10px] text-slate-400 mb-1">{a.tag}</div>
                <div className="font-display font-700 text-sm text-slate-800 leading-tight">{a.title}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-sans text-[10px] text-slate-400">{a.date}</span>
                  <button className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: a.color }}>
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}