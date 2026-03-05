import { useState } from 'react';

const STEPS = [
  {
    id: '01',
    title: 'Sample Collection',
    desc: 'A simple blood draw — 10ml of peripheral blood. No invasive procedures. Our cfDNA extraction protocol achieves >95% recovery efficiency with minimal degradation.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#00d4c8" strokeWidth="1.5" opacity="0.3" />
        <path d="M20 8v5M20 27v5M8 20h5M27 20h5" stroke="#00d4c8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="5" fill="rgba(0,212,200,0.15)" stroke="#00d4c8" strokeWidth="1.5" />
        <path d="M17 20a3 3 0 016 0" stroke="#00d4c8" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    tags: ['cfDNA', 'cfRNA', 'Exosomes'],
    color: '#00d4c8',
  },
  {
    id: '02',
    title: 'Multi-Omic Sequencing',
    desc: 'Ultra-deep targeted sequencing at 50,000x coverage combined with whole-methylome profiling and RNA-seq. Detecting mutations down to 0.01% variant allele frequency.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="6" y="10" width="28" height="4" rx="2" fill="rgba(58,158,255,0.15)" stroke="#3a9eff" strokeWidth="1.5" />
        <rect x="6" y="18" width="22" height="4" rx="2" fill="rgba(58,158,255,0.1)" stroke="#3a9eff" strokeWidth="1.5" />
        <rect x="6" y="26" width="26" height="4" rx="2" fill="rgba(58,158,255,0.1)" stroke="#3a9eff" strokeWidth="1.5" />
        <circle cx="31" cy="28" r="3" fill="rgba(58,158,255,0.3)" stroke="#3a9eff" strokeWidth="1.5" />
      </svg>
    ),
    tags: ['SNV', 'CNV', 'Methylation', 'Fusion'],
    color: '#3a9eff',
  },
  {
    id: '03',
    title: 'AI Biomarker Analysis',
    desc: 'Our transformer-based model — trained on 2.4M+ clinical samples — integrates multi-modal features to generate a comprehensive tumor signature with tissue-of-origin prediction.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="8" y="8" width="10" height="10" rx="2" fill="rgba(0,229,195,0.15)" stroke="#00e5c3" strokeWidth="1.5" />
        <rect x="22" y="8" width="10" height="10" rx="2" fill="rgba(0,229,195,0.1)" stroke="#00e5c3" strokeWidth="1.5" />
        <rect x="8" y="22" width="10" height="10" rx="2" fill="rgba(0,229,195,0.1)" stroke="#00e5c3" strokeWidth="1.5" />
        <rect x="22" y="22" width="10" height="10" rx="2" fill="rgba(0,229,195,0.15)" stroke="#00e5c3" strokeWidth="1.5" />
        <path d="M18 13h4M13 18v4M27 18v4M18 27h4" stroke="#00e5c3" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    tags: ['Deep Learning', 'Multi-modal', 'Explainable AI'],
    color: '#00e5c3',
  },
  {
    id: '04',
    title: 'Clinical Report',
    desc: 'Actionable, oncologist-ready reports with variant classification, treatment response predictions, resistance mechanisms, and clinical trial matching within 14 hours.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect x="8" y="6" width="24" height="28" rx="3" stroke="#7ec0ff" strokeWidth="1.5" fill="rgba(126,192,255,0.08)" />
        <path d="M14 14h12M14 19h10M14 24h8" stroke="#7ec0ff" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="28" cy="28" r="6" fill="#020d1a" stroke="#00d4c8" strokeWidth="1.5" />
        <path d="M25.5 28l1.5 1.5L30 26" stroke="#00d4c8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tags: ['ACMG', 'Trial Match', 'EHR Ready'],
    color: '#7ec0ff',
  },
];

export default function PlatformSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="science" className="py-24 relative">
      <div className="absolute inset-0 grid-lines opacity-50 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-xs text-[#00d4c8] tracking-widest uppercase">How It Works</span>
          <h2 className="font-display text-4xl font-700 text-white mt-3">
            The BiopsAI <span className="gradient-text">Pipeline</span>
          </h2>
          <p className="font-body text-[#8ab4d4] mt-3 max-w-xl mx-auto">
            From a single blood draw to a comprehensive genomic portrait — powered end-to-end by artificial intelligence.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Steps nav */}
          <div className="lg:col-span-2 space-y-3">
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActive(i)}
                className={`w-full text-left glass rounded-xl p-5 transition-all duration-300 ${
                  active === i
                    ? 'border-l-2 glow-border'
                    : 'border border-transparent hover:border-[rgba(0,212,200,0.1)]'
                }`}
                style={active === i ? { borderLeftColor: step.color } : {}}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-mono text-2xl font-700 opacity-40"
                    style={{ color: active === i ? step.color : '#4a7a9b' }}
                  >
                    {step.id}
                  </span>
                  <div>
                    <div className="font-display text-sm font-600 text-white">{step.title}</div>
                    <div className="font-mono text-xs mt-1 flex flex-wrap gap-1.5">
                      {step.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded text-[10px] border"
                          style={{
                            color: active === i ? step.color : '#4a7a9b',
                            borderColor: active === i ? `${step.color}40` : 'rgba(74,122,155,0.2)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3 glass rounded-2xl p-8 border border-[rgba(0,212,200,0.12)] min-h-[340px] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${STEPS[active].color}15`, border: `1px solid ${STEPS[active].color}30` }}
                >
                  {STEPS[active].icon}
                </div>
                <div>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: STEPS[active].color }}>
                    Step {STEPS[active].id}
                  </span>
                  <h3 className="font-display text-2xl font-700 text-white mt-1">{STEPS[active].title}</h3>
                </div>
              </div>
              <p className="font-body text-[#8ab4d4] leading-relaxed text-base">{STEPS[active].desc}</p>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs text-[#4a7a9b]">Pipeline completion</span>
                <span className="font-mono text-xs" style={{ color: STEPS[active].color }}>
                  {((active + 1) / STEPS.length * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(active + 1) / STEPS.length * 100}%`,
                    background: `linear-gradient(90deg, ${STEPS[active].color}, #3a9eff)`,
                    boxShadow: `0 0 10px ${STEPS[active].color}60`,
                  }}
                />
              </div>
              <div className="flex gap-2 mt-4">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i <= active ? STEPS[active].color : 'rgba(255,255,255,0.05)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}                                                                                                   