export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#f0f7ff] to-white">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <div className="card-elevated p-12 relative overflow-hidden">
          {/* Corner dots */}
          <div className="absolute top-4 left-4 w-16 h-16 dot-grid opacity-40 rounded-xl" />
          <div className="absolute bottom-4 right-4 w-16 h-16 dot-grid opacity-40 rounded-xl" />

          <span className="pill mb-5 block w-fit mx-auto">Get Started</span>
          <h2 className="font-display font-800 text-4xl lg:text-5xl text-slate-900 mb-4 tracking-tight">
            Ready to detect cancer
            <br />
            <span className="text-gradient">earlier than ever?</span>
          </h2>
          <p className="font-sans text-slate-500 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Join 312+ clinical partners using BiopsAI to transform liquid biopsy into actionable intelligence. Start with a pilot study — no commitment required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              Schedule a Demo
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-outline text-base px-8 py-4 w-full sm:w-auto">
              Contact Scientific Team
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap justify-center gap-4">
            {['No setup fees','CLIA compliant','HIPAA secure','14hr turnaround','Dedicated support'].map(f => (
              <div key={f} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
                  <path d="M4.5 7l1.8 1.8L9.5 5" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-sans text-xs text-slate-500">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}