export default function AboutSection() {
  const tags = ['ctDNA Detection','cfRNA Profiling','AI Diagnostics','Methylation Analysis','Pan-cancer']

  return (
    <section id="about" className="py-24 bg-gradient-to-br from-[#f8faff] to-white relative overflow-hidden">
      <div className="bg-blob w-96 h-96 bg-blue-50 opacity-60 top-0 right-0" />
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Left — image mosaic */}
        <div className="relative">
          {/* Main image placeholder */}
          <div className="relative rounded-3xl overflow-hidden shadow-float bg-gradient-to-br from-blue-100 to-sky-50 h-80 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-48 h-48" fill="none">
              <defs>
                <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"  stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05"/>
                </radialGradient>
              </defs>
              {/* Cell cluster */}
              <circle cx="100" cy="100" r="50" fill="url(#cellGrad)" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5"/>
              <circle cx="80" cy="85" r="22" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.2"/>
              <circle cx="120" cy="90" r="18" fill="rgba(14,165,233,0.15)" stroke="#0ea5e9" strokeWidth="1.2"/>
              <circle cx="100" cy="118" r="16" fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth="1.2"/>
              {/* Nucleus */}
              <circle cx="80" cy="85" r="8" fill="rgba(37,99,235,0.3)" stroke="#2563eb" strokeWidth="1"/>
              <circle cx="120" cy="90" r="7" fill="rgba(14,165,233,0.25)" stroke="#0ea5e9" strokeWidth="1"/>
              {/* Sparkles */}
              {[[40,40],[160,50],[155,155],[45,155],[100,20]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill="#3b82f6" opacity="0.35"/>
              ))}
            </svg>
            <div className="absolute bottom-4 left-4 right-4 card px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 3v4l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="font-display text-sm font-700 text-slate-800">30/11/2024</div>
                <div className="text-xs text-slate-400">We are here to support your health</div>
              </div>
              <button className="ml-auto w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 9.5l7-7M9.5 2.5H4m5.5 0V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Floating side card */}
          <div className="absolute -right-4 top-8 badge-float px-4 py-3 animate-float-slow">
            <div className="text-xs text-slate-400 mb-1">Insight</div>
            <div className="font-display font-700 text-slate-800 text-sm">AI Accuracy</div>
            <div className="mt-2 flex items-end gap-1">
              {[60,80,55,90,75,95,85].map((h,i) => (
                <div key={i} className="w-2 rounded-t-sm bg-gradient-to-t from-blue-400 to-blue-200"
                     style={{ height: `${h * 0.35}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — text */}
        <div>
          <span className="pill mb-5 block w-fit">About Us</span>
          <h2 className="font-display font-800 text-4xl lg:text-5xl leading-[1.1] tracking-tight text-slate-900 mb-5">
            Our team of highly trained{' '}
            <span className="text-gradient">medical</span>{' '}
            professionals is here to provide the best possible care.
          </h2>
          <p className="font-sans text-slate-500 leading-relaxed mb-6 font-light">
            BiopsAI combines cutting-edge AI with world-class molecular biology to deliver liquid biopsy solutions that are redefining early cancer detection, treatment monitoring, and precision oncology globally.
          </p>

          {/* Tag chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map(t => (
              <span key={t} className="chip chip-blue">{t}</span>
            ))}
          </div>

          {/* Two mini features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon:'🧬', title:'Multi-Omic', desc:'cfDNA · cfRNA · Methylation' },
              { icon:'⚡', title:'14hr Results', desc:'From sample to report' },
              { icon:'🌍', title:'312+ Partners', desc:'Global clinical network' },
              { icon:'🛡️', title:'HIPAA Secure', desc:'CAP & CLIA compliant' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-3 card p-4">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <div className="font-display font-700 text-sm text-slate-800">{f.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-primary">Learn More</button>
            <button className="btn-outline">Our Research</button>
          </div>
        </div>
      </div>
    </section>
  )
}