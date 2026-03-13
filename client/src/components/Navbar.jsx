import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['Home', 'Platform', 'Pipeline', 'Data', 'Clinical', 'About']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(59,130,246,0.08)] py-3'
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img 
            src="/logo-Photoroom.png" 
            alt="ShriAI Logo" 
            className="w-20 h-20 object-contain"
          />
          <span className={`font-display font-700 text-lg tracking-tight ${
            scrolled ? 'text-slate-900' : 'text-white'
          }`}>
            Shri<span className="text-gradient">-AI</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
               className={`font-sans text-sm hover:text-blue-600 transition-colors duration-200 font-medium ${
                 scrolled ? 'text-slate-500' : 'text-white'
               }`}>
              {l}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button className={`font-sans text-sm hover:text-blue-600 font-medium px-4 py-2 transition-colors ${
            scrolled ? 'text-slate-600' : 'text-white'
          }`}>
            Log in
          </button>
          <button className="btn-primary text-sm px-5 py-2.5">
            Get a Demo
            <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors">
          <div className={`w-5 h-0.5 transition-all duration-300 ${open ? 'rotate-45 translate-y-1.5' : ''} ${
            scrolled ? 'bg-slate-600' : 'bg-white'
          }`} />
          <div className={`w-5 h-0.5 mt-1 transition-all duration-300 ${open ? 'opacity-0' : ''} ${
            scrolled ? 'bg-slate-600' : 'bg-white'
          }`} />
          <div className={`w-5 h-0.5 mt-1 transition-all duration-300 ${open ? '-rotate-45 -translate-y-1.5' : ''} ${
            scrolled ? 'bg-slate-600' : 'bg-white'
          }`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-blue-50 px-6 py-4 flex flex-col gap-3 shadow-card">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
               className="font-sans text-sm text-slate-600 hover:text-blue-600 font-medium py-1 transition-colors">
              {l}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-blue-50">
            <button className="btn-outline text-sm px-4 py-2 flex-1">Log in</button>
            <button className="btn-primary text-sm px-4 py-2 flex-1">Get a Demo</button>
          </div>
        </div>
      )}
    </nav>
  )
}