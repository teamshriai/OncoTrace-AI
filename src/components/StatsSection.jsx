import { useEffect, useRef, useState } from 'react'

function Counter({ target, suffix, start }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let s = null
    const dur = 1800
    const begin = performance.now()
    const step = (now) => {
      const p = Math.min((now - begin) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.floor(eased * target))
      if (p < 1) s = requestAnimationFrame(step)
    }
    s = requestAnimationFrame(step)
    return () => cancelAnimationFrame(s)
  }, [start, target])
  return <>{val}{suffix}</>
}

const STATS = [
  { value: 30,   suffix: 'M+',  label: 'Global Users',       icon: '👥' },
  { value: 30,   suffix: '%',   label: 'Upto Savings Rate',  icon: '📈' },
  { value: 100,  suffix: 'M',   label: 'Capital Raised',     prefix: '$', icon: '💰' },
  { value: 60,   suffix: '+',   label: 'Team Members',       icon: '🔬' },
  { value: 47,   suffix: '+',   label: 'Cancer Types',       icon: '🧬' },
  { value: 99.2, suffix: '%',   label: 'AI Sensitivity',     icon: '🎯' },
]

export default function StatsSection() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-16 bg-white border-y border-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="font-display font-800 text-3xl text-slate-900 mb-1">
                {s.prefix || ''}
                <Counter target={s.value} suffix={s.suffix} start={started} />
              </div>
              <div className="font-sans text-xs text-slate-400 font-medium">{s.label}</div>
              <div className="w-8 h-0.5 bg-blue-200 mx-auto mt-2 rounded group-hover:w-12 group-hover:bg-blue-500 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}