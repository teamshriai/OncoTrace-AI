import { useState } from 'react';

const CHART_DATA = [
  { month: 'Jan', biopsy: 23, liquid: 18 },
  { month: 'Feb', biopsy: 31, liquid: 28 },
  { month: 'Mar', biopsy: 27, liquid: 36 },
  { month: 'Apr', biopsy: 34, liquid: 45 },
  { month: 'May', biopsy: 29, liquid: 52 },
  { month: 'Jun', biopsy: 38, liquid: 61 },
  { month: 'Jul', biopsy: 35, liquid: 69 },
  { month: 'Aug', biopsy: 42, liquid: 75 },
];

const MAX_VAL = 80;

function MiniBarChart() {
  return (
    <div className="flex items-end gap-2 h-32">
      {CHART_DATA.map((d, i) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-end gap-0.5 w-full">
            <div
              className="flex-1 rounded-t-sm transition-all duration-1000"
              style={{
                height: `${(d.biopsy / MAX_VAL) * 100}%`,
                minHeight: 4,
                background: 'rgba(74,122,155,0.4)',
                animationDelay: `${i * 100}ms`,
              }}
            />
            <div
              className="flex-1 rounded-t-sm transition-all duration-1000"
              style={{
                height: `${(d.liquid / MAX_VAL) * 100}%`,
                minHeight: 4,
                background: 'linear-gradient(180deg, #00d4c8, #3a9eff)',
                boxShadow: '0 0 8px rgba(0,212,200,0.4)',
              }}
            />
          </div>
          <span className="font-mono text-[9px] text-[#4a7a9b]">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DataSection() {
  const [tab, setTab] = useState('performance');

  const tabs = [
    { id: 'performance', label: 'Performance' },
    { id: 'coverage', label: 'Coverage' },
    { id: 'validation', label: 'Validation' },
  ];

  return (
    <section id="data" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <span className="font-mono text-xs text-[#00d4c8] tracking-widest uppercase">Clinical Evidence</span>
            <h2 className="font-display text-4xl font-700 text-white mt-3">
              Validated across<br />
              <span className="gradient-text">12 clinical trials</span>
            </h2>
            <p className="font-body text-[#8ab4d4] mt-4 leading-relaxed">
              Our platform has been rigorously validated across diverse populations, cancer types, and clinical settings. Over 240 peer-reviewed publications support the BiopsAI methodology.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { label: 'Analytical sensitivity', value: '99.2%', detail: 'LOD 0.01% VAF', color: '#00d4c8' },
                { label: 'Clinical specificity', value: '98.7%', detail: 'FPR < 1.3%', color: '#3a9eff' },
                { label: 'Concordance with tissue', value: '96.4%', detail: 'n=12,847 samples', color: '#00e5c3' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-sm text-[#8ab4d4]">{item.label}</span>
                      <span className="font-mono text-sm font-500" style={{ color: item.color }}>{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: item.value,
                          background: item.color,
                          boxShadow: `0 0 8px ${item.color}50`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[#4a7a9b] mt-0.5 block">{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button className="glass-bright border border-[#00d4c8]/30 text-[#00d4c8] font-body text-sm px-5 py-2.5 rounded-full hover:bg-[#00d4c8]/10 transition-all">
                View Publications →
              </button>
              <button className="glass border border-white/10 text-[#8ab4d4] font-body text-sm px-5 py-2.5 rounded-full hover:border-white/20 transition-all">
                Download White Paper
              </button>
            </div>
          </div>

          {/* Right: Dashboard card */}
          <div className="glass rounded-2xl border border-[rgba(0,212,200,0.12)] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/5 px-6 pt-4">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`font-mono text-xs tracking-wide px-4 py-2.5 border-b-2 transition-all duration-200 -mb-px ${
                    tab === t.id
                      ? 'border-[#00d4c8] text-[#00d4c8]'
                      : 'border-transparent text-[#4a7a9b] hover:text-[#8ab4d4]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'performance' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-display text-sm font-600 text-white">Detection Rate</h4>
                      <p className="font-mono text-xs text-[#4a7a9b]">Liquid vs. tissue biopsy</p>
                    </div>
                    <div className="flex gap-3 text-[10px] font-mono">
                      <span className="flex items-center gap-1 text-[#4a7a9b]"><span className="w-2 h-2 rounded-sm inline-block bg-[#4a7a9b]/40" />Tissue</span>
                      <span className="flex items-center gap-1 text-[#00d4c8]"><span className="w-2 h-2 rounded-sm inline-block bg-[#00d4c8]" />Liquid</span>
                    </div>
                  </div>
                  <MiniBarChart />
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4">
                    {[['Cases', '12,847'], ['Median VAF', '0.032%'], ['Lead time', '+6.2 mo']].map(([l, v]) => (
                      <div key={l} className="text-center">
                        <div className="font-display text-lg font-700 gradient-text">{v}</div>
                        <div className="font-mono text-[10px] text-[#4a7a9b] mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'coverage' && (
                <div className="space-y-3">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h4 className="font-display text-sm font-600 text-white">Cancer Type Coverage</h4>
                      <p className="font-mono text-xs text-[#4a7a9b]">47 tumor types validated</p>
                    </div>
                  </div>
                  {[['Lung', 99], ['Colorectal', 97], ['Breast', 96], ['Pancreatic', 91], ['Ovarian', 94], ['Melanoma', 93]].map(([cancer, pct]) => (
                    <div key={cancer} className="flex items-center gap-3">
                      <span className="font-body text-xs text-[#8ab4d4] w-20">{cancer}</span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#00d4c8] to-[#3a9eff]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="font-mono text-xs text-[#00d4c8] w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'validation' && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm font-600 text-white mb-4">Multi-site Validation Studies</h4>
                  {[
                    { study: 'LUNAR-1 Trial', n: '2,847', sites: 28, result: '99.1% concordance' },
                    { study: 'ECLIPSE Study', n: '6,621', sites: 17, result: 'OR 5.6 early detection' },
                    { study: 'PATHFINDER', n: '3,379', sites: 34, result: '99.2% specificity' },
                  ].map((v) => (
                    <div key={v.study} className="glass-bright rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-body text-sm text-white font-500">{v.study}</div>
                          <div className="font-mono text-xs text-[#4a7a9b] mt-1">n={v.n} · {v.sites} sites</div>
                        </div>
                        <span className="font-mono text-xs text-[#00d4c8] text-right">{v.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}