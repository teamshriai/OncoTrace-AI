const APPLICATIONS = [
  {
    title: 'Early Detection',
    icon: '◎',
    desc: 'Multi-cancer early detection from a single blood draw — identifying stage I-II cancers when treatment is most effective.',
    features: ['MRD detection', 'Stage I sensitivity >80%', 'Annual screening protocol'],
    color: '#00d4c8',
    badge: 'Screening',
  },
  {
    title: 'Treatment Monitoring',
    icon: '⊕',
    desc: 'Real-time tracking of tumor dynamics, emerging resistance mutations, and treatment response during therapy.',
    features: ['Bi-weekly monitoring', 'Resistance variant alerts', 'ctDNA kinetics'],
    color: '#3a9eff',
    badge: 'Monitoring',
  },
  {
    title: 'Minimal Residual Disease',
    icon: '◈',
    desc: 'Ultrasensitive detection of residual disease post-surgery or post-treatment — months before imaging.',
    features: ['0.001% VAF detection', 'Relapse prediction', 'Personalized panel'],
    color: '#00e5c3',
    badge: 'Post-treatment',
  },
  {
    title: 'Therapy Selection',
    icon: '⊞',
    desc: 'Comprehensive genomic profiling to match patients with targeted therapies, immunotherapies, and clinical trials.',
    features: ['TMB & MSI scoring', 'Biomarker stratification', '800+ trial matching'],
    color: '#7ec0ff',
    badge: 'Precision Oncology',
  },
];

export default function CancerTypesSection() {
  return (
    <section id="clinical" className="py-24 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-[#00d4c8]/30 to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="font-mono text-xs text-[#00d4c8] tracking-widest uppercase">Clinical Applications</span>
          <h2 className="font-display text-4xl font-700 text-white mt-3">
            Precision medicine at<br />
            <span className="gradient-text">every stage of care</span>
          </h2>
          <p className="font-body text-[#8ab4d4] mt-3 max-w-xl mx-auto">
            BiopsAI supports the full continuum of oncology care — from population screening to personalized treatment decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {APPLICATIONS.map((app, i) => (
            <div
              key={app.title}
              className="glass hover-lift rounded-2xl p-6 border border-transparent hover:border-[rgba(0,212,200,0.12)] transition-all duration-300 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-5">
                <span
                  className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full border"
                  style={{ color: app.color, borderColor: `${app.color}30`, background: `${app.color}10` }}
                >
                  {app.badge}
                </span>
                <span
                  className="text-2xl group-hover:scale-110 transition-transform duration-300"
                  style={{ color: app.color }}
                >
                  {app.icon}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-600 text-white mb-2">{app.title}</h3>
              <p className="font-body text-sm text-[#8ab4d4] leading-relaxed mb-5">{app.desc}</p>

              {/* Features */}
              <ul className="space-y-2">
                {app.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: app.color }} />
                    <span className="font-mono text-xs text-[#8ab4d4]">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom gradient line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${app.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}