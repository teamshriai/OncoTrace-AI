const TESTIMONIALS = [
  {
    text: 'BiopsAI detected a recurrence six months before our imaging did. The sensitivity at low ctDNA fractions is something we have not seen in any other platform.',
    name: 'Dr. Sarah Chen',
    role: 'Director of Oncology · UCSF Medical Center',
    initials: 'SC', color: '#2563eb',
    stars: 5,
  },
  {
    text: 'The multi-omic integration is genuinely next-level. Tissue-of-origin predictions changed how we triage unknown primary cases. Accuracy is remarkable.',
    name: 'Prof. James Okafor',
    role: 'Head of Molecular Pathology · Oxford University Hospitals',
    initials: 'JO', color: '#0891b2',
    stars: 5,
  },
  {
    text: 'From sample receipt to actionable report in under 14 hours. Our clinical workflow has been transformed. Patient outcomes are measurably improving.',
    name: 'Dr. Mei-Lin Zhao',
    role: 'Chief Medical Officer · GenomicCare Asia',
    initials: 'MZ', color: '#4f46e5',
    stars: 5,
  },
]

const PARTNERS = ['Mayo Clinic','Johns Hopkins','MSKCC','Broad Institute','Dana-Farber','NCI','Karolinska','MD Anderson']

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Partners strip */}
        <div className="text-center mb-16">
          <div className="font-sans text-xs text-slate-400 tracking-widest uppercase mb-5">Trusted by world-leading institutions</div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
            {PARTNERS.map(p => (
              <span key={p} className="font-display font-600 text-slate-300 hover:text-slate-400 transition-colors cursor-default text-sm">{p}</span>
            ))}
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="pill mb-4 block w-fit mx-auto">Testimonials</span>
          <h2 className="font-display font-800 text-4xl text-slate-900">
            What clinicians say about{' '}
            <span className="text-gradient">BiopsAI</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="card-elevated p-7 hover-lift flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" viewBox="0 0 16 16" fill="#fbbf24">
                    <path d="M8 1l1.76 3.56 3.94.57-2.85 2.78.67 3.92L8 9.99l-3.52 1.84.67-3.92L2.3 5.13l3.94-.57z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="font-sans text-slate-600 text-sm leading-relaxed font-light flex-1 mb-6">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-blue-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-display font-700 text-white flex-shrink-0"
                     style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-display font-700 text-sm text-slate-800">{t.name}</div>
                  <div className="font-sans text-[11px] text-slate-400 leading-tight">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}