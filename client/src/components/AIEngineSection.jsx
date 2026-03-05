import { useState, useEffect } from 'react'

const VARIANTS = [
  { name: 'EGFR L858R',         conf: 0.982, vaf: '0.038%', type: 'Driver',           cancer: 'NSCLC'          },
  { name: 'KRAS G12C',          conf: 0.967, vaf: '0.021%', type: 'Driver',           cancer: 'CRC / Lung'     },
  { name: 'TP53 R175H',         conf: 0.944, vaf: '0.014%', type: 'Tumor Suppressor', cancer: 'Pan-cancer'     },
  { name: 'BRCA1 c.5266dupC',   conf: 0.991, vaf: '49.8%',  type: 'Germline',         cancer: 'Breast / Ovar.' },
  { name: 'MET amplification',  conf: 0.876, vaf: 'CN=8',   type: 'Copy Number',      cancer: 'NSCLC / GC'     },
]

const TISSUE = [
  { name: 'Lung (NSCLC)',  pct: 71, color: '#2563eb' },
  { name: 'Colorectal',   pct: 12, color: '#0891b2' },
  { name: 'Breast',       pct: 8,  color: '#6366f1' },
  { name: 'Pancreatic',   pct: 5,  color: '#0284c7' },
  { name: 'Other',        pct: 4,  color: '#94a3b8' },
]

function Bar({ value, color, delay }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 200 + delay); return () => clearTimeout(t) }, [value, delay])
  return (
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000"
           style={{ width: `${w}%`, background: color || 'linear-gradient(90deg,#2563eb,#60a5fa)' }} />
    </div>
  )
}

export default function AIEngineSection() {
  const [running, setRunning]   = useState(false)
  const [complete, setComplete] = useState(false)

  const run = () => {
    setRunning(true); setComplete(false)
    setTimeout(() => { setRunning(false); setComplete(true) }, 2600)
  }

  return (
    <section id="platform" className="py-24 bg-gradient-to-br from-[#f8faff] to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <span className="pill mb-4 block w-fit mx-auto">AI Engine</span>
          <h2 className="font-display font-800 text-4xl text-slate-900">
            Transformer architecture <span className="text-gradient">built for genomics</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Variant panel */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-700 text-lg text-slate-900">Variant Detection</h3>
                <div className="font-sans text-xs text-slate-400 mt-0.5">Sample: LB-2024-00847</div>
              </div>
              <button onClick={run}
                className={`font-sans text-xs font-600 px-4 py-2 rounded-full transition-all duration-300 ${
                  running
                    ? 'bg-blue-50 text-blue-500 border border-blue-200 cursor-wait'
                    : complete
                      ? 'btn-outline text-sm'
                      : 'btn-primary text-sm'
                }`}>
                {running
                  ? <span className="flex items-center gap-1.5"><svg className="w-3 h-3 animate-spin" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10" strokeDashoffset="3"/></svg>Analyzing…</span>
                  : complete ? '↻ Re-run' : '▶ Run Analysis'}
              </button>
            </div>

            <div className="space-y-3">
              {VARIANTS.map((v, i) => (
                <div key={v.name}
                     className={`rounded-xl border border-blue-50 p-4 bg-[#fafcff] transition-all duration-500 ${complete ? 'opacity-100' : 'opacity-40'}`}
                     style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-display font-600 text-sm text-slate-800">{v.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="chip chip-blue text-[10px] py-0.5 px-1.5">{v.type}</span>
                        <span className="font-sans text-[10px] text-slate-400">VAF {v.vaf}</span>
                      </div>
                    </div>
                    <span className="font-sans text-xs text-slate-400">{v.cancer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bar value={v.conf * 100} delay={i * 120} />
                    <span className="font-display text-xs font-600 text-blue-600 w-10 text-right">{(v.conf * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Tissue of origin */}
            <div className="card-elevated p-6">
              <h3 className="font-display font-700 text-lg text-slate-900 mb-1">Tissue-of-Origin</h3>
              <div className="font-sans text-xs text-slate-400 mb-5">Methylation + expression signatures</div>
              <div className="space-y-3.5">
                {TISSUE.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <span className="font-sans text-xs text-slate-500 w-24 shrink-0">{t.name}</span>
                    <div className="flex-1 progress-track">
                      <div className="progress-fill" style={{ width: `${t.pct}%`, background: t.color }} />
                    </div>
                    <span className="font-display text-xs font-700 w-8 text-right" style={{ color: t.color }}>{t.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-blue-50 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot" />
                <span className="font-sans text-sm text-slate-700">
                  Primary: <span className="font-600 text-blue-600">Non-Small Cell Lung</span>
                </span>
                <span className="font-sans text-xs text-slate-400 ml-auto">71% confidence</span>
              </div>
            </div>

            {/* Model card */}
            <div className="card-elevated p-6">
              <h3 className="font-display font-700 text-lg text-slate-900 mb-4">Model Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['1.2B',  'Parameters',       '#2563eb'],
                  ['2.4M+', 'Training Samples', '#0891b2'],
                  ['5',     'Data Modalities',  '#4f46e5'],
                  ['<2s',   'Inference Time',   '#0284c7'],
                ].map(([val, lbl, col]) => (
                  <div key={lbl} className="text-center rounded-xl py-4 px-2" style={{ background: `${col}08`, border: `1px solid ${col}18` }}>
                    <div className="font-display font-800 text-xl" style={{ color: col }}>{val}</div>
                    <div className="font-sans text-xs text-slate-400 mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['FDA Breakthrough','CE-IVD','CAP Accredited','HIPAA'].map(b => (
                  <span key={b} className="chip chip-blue text-[10px]">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}