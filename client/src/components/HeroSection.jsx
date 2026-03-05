import { useState, useEffect, useRef } from 'react'

const TYPING = [
  'Monitoring the treatment',
  'Analyzing AI-powered progress',
  'Delivering personalized insights',
  'Bringing care to your community',
]

function TypeWriter() {
  const [idx, setIdx] = useState(0)
  const [char, setChar] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const cur = TYPING[idx]
    const t = setTimeout(() => {
      if (!del) {
        setChar(c => c + 1)
        if (char + 1 === cur.length) setTimeout(() => setDel(true), 1800)
      } else {
        setChar(c => c - 1)
        if (char - 1 === 0) { setDel(false); setIdx(i => (i + 1) % TYPING.length) }
      }
    }, del ? 35 : 65)
    return () => clearTimeout(t)
  }, [char, del, idx])

  return (
    <span style={{ color: '#3b82f6', fontFamily: 'inherit', fontSize: '13px', fontWeight: 500 }}>
      {TYPING[idx].slice(0, char)}
      <span style={{ animation: 'blink 1s infinite' }}>|</span>
    </span>
  )
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(48px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideRight { from{opacity:0;transform:translateX(60px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes glowPulse { 0%,100%{opacity:0.4;transform:scale(1) translate(-50%,-50%)} 50%{opacity:0.7;transform:scale(1.08) translate(-50%,-50%)} }
  @keyframes dotPulse { 0%,100%{box-shadow:0 0 7px rgba(59,130,246,0.9)} 50%{box-shadow:0 0 18px rgba(59,130,246,1)} }
  @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:0.9} }
  @keyframes horizontalDrift { 0%{transform:translateX(-30px)} 50%{transform:translateX(30px)} 100%{transform:translateX(-30px)} }
  @keyframes verticalDrift { 0%{transform:translateY(-20px)} 50%{transform:translateY(20px)} 100%{transform:translateY(-20px)} }
  @keyframes grainShift { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 30%{transform:translate(3%,5%)} 50%{transform:translate(-8%,2%)} 70%{transform:translate(6%,-6%)} 90%{transform:translate(-3%,8%)} }
  @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes ringPulse { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.15} 50%{transform:translate(-50%,-50%) scale(1.06);opacity:0.25} }

  @keyframes sphereFloat {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -52%) scale(1.03); }
  }
  @keyframes sphereShine {
    0% { opacity: 0.35; }
    50% { opacity: 0.65; }
    100% { opacity: 0.35; }
  }
  @keyframes precisionFadeIn {
    from { opacity: 0; transform: translateY(50px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes searchBarFade {
    from { opacity: 0; transform: translate(-50%, 16px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  .sai-hero * { box-sizing:border-box; }
  .sai-hero { font-family:'Plus Jakarta Sans', sans-serif; }
  .sai-display { font-family:'Outfit', sans-serif; }

  .sai-shimmer {
    background: linear-gradient(90deg,#1d4ed8 0%,#3b82f6 30%,#93c5fd 50%,#3b82f6 70%,#1d4ed8 100%);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation: shimmer 3.5s linear infinite;
  }

  .sai-grain {
    position: fixed;
    top: -50%;
    left: -50%;
    right: -50%;
    bottom: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.028;
    animation: grainShift 0.5s steps(1) infinite;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .sai-glass {
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    border: 1px solid rgba(255,255,255,0.55);
    box-shadow: 0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
  }

  .sai-glass-dark {
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(30px) saturate(1.4);
    -webkit-backdrop-filter: blur(30px) saturate(1.4);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3);
  }

  .sai-glass-card {
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: 0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8);
  }

  .sai-a0 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0s both; }
  .sai-a1 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
  .sai-a2 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .sai-a3 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
  .sai-a4 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both; }
  .sai-img-anim { animation: slideRight 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s both; }

  .sai-btn-primary {
    display:inline-flex; align-items:center; gap:10px;
    background:linear-gradient(135deg,#1d4ed8,#3b82f6);
    color:#fff; border:none; border-radius:100px;
    padding:16px 36px; font-family:'Cormorant Garamond',serif;
    font-size:15px; font-weight:500; cursor:pointer; letter-spacing:0.02em;
    box-shadow:0 8px 32px rgba(59,130,246,0.35), 0 2px 8px rgba(59,130,246,0.2);
    transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }
  .sai-btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .sai-btn-primary:hover::before { left: 100%; }
  .sai-btn-primary:hover { transform:translateY(-3px); box-shadow:0 18px 48px rgba(59,130,246,0.45), 0 4px 12px rgba(59,130,246,0.25); }

  .sai-btn-ghost {
    display:inline-flex; align-items:center; gap:10px;
    background:rgba(255,255,255,0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color:#2563eb;
    border:1.5px solid rgba(59,130,246,0.2); border-radius:100px;
    padding:15px 30px; font-family:'Cormorant Garamond',serif;
    font-size:15px; font-weight:500; cursor:pointer; letter-spacing:0.02em;
    transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  }
  .sai-btn-ghost:hover { background:rgba(59,130,246,0.08); border-color:rgba(59,130,246,0.5); transform:translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }

  .sai-terminal {
    border-radius:100px;
    padding:12px 22px; display:inline-flex;
    align-items:center; gap:12px;
  }

  .sai-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(59,130,246,0.06);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius:100px;
    padding:8px 18px; font-size:13px; color:#1d4ed8; font-weight:500;
    border:1px solid rgba(59,130,246,0.12); letter-spacing:0.03em;
  }

  .sai-precision-section {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #e8edf5 0%, #f0f3f9 30%, #dde3ef 60%, #c8cdd8 100%);
  }

  .sai-precision-title {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: clamp(3rem, 7vw, 5.5rem);
    font-weight: 400;
    color: #1a1a2e;
    text-align: center;
    line-height: 1.08;
    letter-spacing: -0.03em;
    position: relative;
    z-index: 2;
    animation: precisionFadeIn 1.2s ease-out 0.2s both;
  }

  .sai-sphere {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: clamp(320px, 40vw, 520px);
    height: clamp(320px, 40vw, 520px);
    border-radius: 50%;
    z-index: 1;
    animation: sphereFloat 7s ease-in-out infinite;
    background: radial-gradient(
      ellipse at 35% 25%,
      rgba(255, 255, 255, 0.85) 0%,
      rgba(200, 210, 235, 0.7) 25%,
      rgba(170, 185, 220, 0.8) 45%,
      rgba(150, 165, 210, 0.75) 60%,
      rgba(135, 150, 200, 0.85) 75%,
      rgba(120, 135, 185, 0.9) 100%
    );
    box-shadow:
      inset -30px -30px 60px rgba(100, 120, 180, 0.3),
      inset 20px 20px 40px rgba(255, 255, 255, 0.5),
      0 20px 80px rgba(100, 120, 180, 0.2),
      0 0 150px rgba(150, 170, 220, 0.12);
  }

  .sai-sphere::before {
    content: '';
    position: absolute;
    top: 8%;
    left: 18%;
    width: 55%;
    height: 40%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.7) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transform: rotate(-15deg);
    animation: sphereShine 5s ease-in-out infinite;
  }

  .sai-sphere::after {
    content: '';
    position: absolute;
    bottom: 15%;
    right: 15%;
    width: 20%;
    height: 15%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 100%
    );
  }

  .sai-search-bar {
    position: absolute;
    top: 58%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(24px) saturate(1.5);
    -webkit-backdrop-filter: blur(24px) saturate(1.5);
    border-radius: 100px;
    padding: 6px 6px 6px 22px;
    min-width: 300px;
    max-width: 380px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.8);
    border: 1px solid rgba(255, 255, 255, 0.6);
    animation: searchBarFade 0.9s ease-out 0.6s both;
  }

  .sai-search-bar input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #4a5568;
    padding: 8px 0;
  }

  .sai-search-bar input::placeholder {
    color: #94a3b8;
  }

  .sai-search-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #a0b4d6, #8a9fc7);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 2px 10px rgba(130, 150, 200, 0.3);
  }

  .sai-search-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(130, 150, 200, 0.5);
  }

  .sai-divider-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent);
    transform-origin: left;
    animation: lineGrow 1.2s ease-out 0.6s both;
  }

  @media (max-width: 900px) {
    .sai-hero-grid {
      grid-template-columns: 1fr !important;
      gap: 48px !important;
      padding: 100px 24px 60px !important;
    }
    .sai-hero-right {
      display: none !important;
    }
  }
`

export default function HeroSection() {
  const mouse = useMousePosition()
  const heroRef = useRef(null)
  const heroVisible = useInView(heroRef)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <style>{css}</style>

      {/* Global grain overlay */}
      <div className="sai-grain" />

      {/* ── PRECISION SECTION ── */}
      <section className="sai-precision-section">
        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Ambient light blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '20%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%)',
          animation: 'horizontalDrift 12s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '15%',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,197,253,0.08), transparent 70%)',
          animation: 'verticalDrift 10s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Concentric glass rings */}
        <div style={{
          position: 'absolute', top: '55%', left: '50%',
          width: 'clamp(400px, 52vw, 640px)', height: 'clamp(400px, 52vw, 640px)',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)',
          transform: 'translate(-50%,-50%)',
          animation: 'ringPulse 6s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '50%',
          width: 'clamp(480px, 62vw, 760px)', height: 'clamp(480px, 62vw, 760px)',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
          transform: 'translate(-50%,-50%)',
          animation: 'ringPulse 6s ease-in-out 1s infinite',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* The 3D sphere */}
        <div className="sai-sphere" />

        {/* Heading */}
        <div style={{
          position: 'relative', zIndex: 2, textAlign: 'center',
          marginTop: '-80px',
          transform: `translateY(${scrollY * 0.15}px)`,
          transition: 'transform 0.1s linear',
        }}>
          <h1 className="sai-precision-title">
            AI-enabled<br />
            precision medical<br />
            monitoring
          </h1>

          {/* Subtle sub-line */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px', color: '#7a8599',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginTop: '24px', fontWeight: 400,
            animation: 'precisionFadeIn 1s ease-out 0.6s both',
          }}>
            Next-Generation Healthcare Intelligence
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px',
          background: 'linear-gradient(to bottom, transparent, rgba(190, 198, 212, 0.5))',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%',
          transform: 'translateX(-50%)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: '8px',
          opacity: 0.3, zIndex: 4,
        }}>
          <span style={{
            fontSize: '9px', color: '#6b7a90', letterSpacing: '0.18em',
            textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>Scroll</span>
          <div style={{
            width: '1px', height: '42px',
            background: 'linear-gradient(to bottom, #6b7a90, transparent)',
          }} />
        </div>
      </section>

      {/* ── MAIN HERO SECTION ── */}
      <section
        ref={heroRef}
        id="home"
        className="sai-hero"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #f0f5ff 0%, #fafcff 35%, #ffffff 55%, #f0f5ff 100%)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}
      >
        {/* Reactive mouse glow */}
        <div style={{
          position: 'fixed',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)',
          left: mouse.x - 300, top: mouse.y - 300,
          pointerEvents: 'none', zIndex: 0,
          transition: 'left 0.3s ease-out, top 0.3s ease-out',
        }} />

        {/* BG blobs */}
        <div style={{
          position: 'absolute', top: '-260px', right: '-200px',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 65%)',
          pointerEvents: 'none', animation: 'breathe 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '-200px', left: '-180px',
          width: '580px', height: '580px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,78,216,0.07) 0%, transparent 65%)',
          pointerEvents: 'none', animation: 'breathe 8s ease-in-out 2s infinite',
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,197,253,0.06) 0%, transparent 60%)',
          pointerEvents: 'none', transform: 'translate(-50%,-50%)',
          animation: 'breathe 10s ease-in-out 4s infinite',
        }} />

        {/* Refined dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.22,
          backgroundImage: 'radial-gradient(circle, #93c5fd 0.8px, transparent 0.8px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Fine horizontal lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(59,130,246,0.3) 80px)',
        }} />

        <div className="sai-hero-grid" style={{
          maxWidth: '1300px', margin: '0 auto',
          padding: '130px 56px 90px', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '80px', alignItems: 'center',
        }}>

          {/* ── LEFT ── */}
          <div>
            <div className="sai-a0" style={{ marginBottom: '24px' }}>
              <span className="sai-badge">
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#3b82f6', display: 'inline-block',
                  boxShadow: '0 0 7px rgba(59,130,246,0.8)',
                  animation: 'dotPulse 2s ease-in-out infinite',
                }} />
                Launching Soon
              </span>
            </div>

            <div className="sai-a1">
              <h1 className="sai-display" style={{
                fontSize: 'clamp(2.8rem,5vw,4.2rem)',
                lineHeight: 1.04, fontWeight: 300,
                color: '#0f172a', marginBottom: '6px',
                letterSpacing: '-0.03em',
              }}>
                AI For Health.
              </h1>
              <h1 className="sai-display sai-shimmer" style={{
                fontSize: 'clamp(2.8rem,5vw,4.2rem)',
                lineHeight: 1.04, fontWeight: 400,
                marginBottom: '6px', letterSpacing: '-0.03em',
              }}>
                Care For All!
              </h1>
              <p style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: '13px', color: '#2563eb',
                fontWeight: 400, letterSpacing: '0.12em',
                textTransform: 'uppercase', opacity: 0.65, marginBottom: '8px',
              }}>
                Open Source · Not for Profit
              </p>
            </div>

            {/* Decorative divider */}
            <div className="sai-a1 sai-divider-line" style={{
              maxWidth: '160px', marginBottom: '22px',
            }} />

            <div className="sai-a2">
              <p style={{
                fontSize: '15px', color: '#64748b', lineHeight: 1.78,
                maxWidth: '440px', marginBottom: '30px', fontWeight: 300,
              }}>
                Shri-AI brings AI-powered breast cancer screening directly to your neighbourhood —
                early detection, personalized insights, and complete privacy at every step.
              </p>
            </div>

            <div className="sai-a2" style={{ marginBottom: '32px' }}>
              <div className="sai-terminal sai-glass-card" style={{ borderRadius: '100px' }}>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {['#fca5a5', '#fde68a', '#6ee7b7'].map((c, i) => (
                    <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>Shri AI ~</span>
                <TypeWriter />
              </div>
            </div>

            <div className="sai-a3" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
              <button className="sai-btn-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" />
                  <path d="M5 8h6M8 5v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Book a Demo
              </button>
              <button className="sai-btn-ghost">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#2563eb" strokeWidth="1.5" />
                  <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="#2563eb" />
                </svg>
                Partner With Us
              </button>
            </div>

            {/* Trust indicators */}
            <div className="sai-a4" style={{
              display: 'flex', gap: '24px', alignItems: 'center',
            }}>
              {[
                { label: 'Accuracy', value: '98.2%' },
                { label: 'Communities', value: '150+' },
                { label: 'Privacy', value: '100%' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                }}>
                  <span className="sai-display" style={{
                    fontSize: '18px', fontWeight: 600, color: '#1d4ed8',
                    letterSpacing: '-0.01em',
                  }}>{item.value}</span>
                  <span style={{
                    fontSize: '11px', color: '#94a3b8', fontWeight: 400,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — IMAGE ── */}
          <div className="sai-img-anim sai-hero-right" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            {/* Outer wrapper — uses native 1200×672 aspect ratio */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              aspectRatio: '1200 / 672',
            }}>

              {/* Main image container */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                height: '100%',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
              }}>
                <img
                  src="/gene.jpg"
                  alt="Shri-AI Breast Cancer Screening"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Bottom gradient overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '160px',
                  background: 'linear-gradient(to top, rgba(15,23,42,0.7), transparent)',
                  borderRadius: '0 0 20px 20px',
                }} />
              </div>

              {/* Floating accuracy card — 25% overlaps image on bottom-left, 75% floats outside top-right */}
              <div className="sai-glass-card" style={{
                position: 'absolute',
                top: '-55px',
                right: '-115px',
                zIndex: 3,
                borderRadius: '20px',
                padding: '16px 20px',
                minWidth: '155px',
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 400, letterSpacing: '0.04em' }}>
                  Detection Accuracy
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span className="sai-display" style={{ fontSize: '32px', fontWeight: 700, color: '#2563eb', letterSpacing: '-0.02em' }}>
                    98.2
                  </span>
                  <span style={{ fontSize: '15px', color: '#1d4ed8', fontWeight: 500 }}>%</span>
                </div>
                <div style={{
                  marginTop: '8px',
                  height: '3px',
                  borderRadius: '3px',
                  background: 'rgba(59,130,246,0.1)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '98.2%',
                    height: '100%',
                    borderRadius: '3px',
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  }} />
                </div>
              </div>

              {/* Floating privacy card — 25% overlaps image on right edge, 75% floats outside left */}
              <div className="sai-glass-card" style={{
                position: 'absolute',
                top: '50%',
                left: '-120px',
                transform: 'translateY(-50%)',
                zIndex: 3,
                borderRadius: '20px',
                padding: '14px 18px',
                minWidth: '160px',
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Privacy Status
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                    Fully Secured
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                    End-to-end encrypted
                  </div>
                </div>
              </div>

              {/* Floating communities card — 25% overlaps image on top-left, 75% floats outside bottom-right */}
              <div className="sai-glass-card" style={{
                position: 'absolute',
                bottom: '-50px',
                right: '-100px',
                zIndex: 3,
                borderRadius: '20px',
                padding: '14px 18px',
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.04em' }}>
                  Communities
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex' }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][i],
                        border: '2px solid white',
                        marginLeft: i > 0 ? '-8px' : 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8px',
                        color: 'white',
                        fontWeight: 700,
                      }}>
                        {i < 3 ? '' : '···'}
                      </div>
                    ))}
                  </div>
                  <span className="sai-display" style={{ fontSize: '16px', fontWeight: 600, color: '#1d4ed8' }}>
                    150+
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.35,
        }}>
          <span style={{
            fontSize: '9px', color: '#94a3b8', letterSpacing: '0.18em',
            textTransform: 'uppercase', fontFamily: "'Cormorant Garamond',serif", fontWeight: 500,
          }}>Scroll</span>
          <div style={{ width: '1px', height: '42px', background: 'linear-gradient(to bottom, #94a3b8, transparent)' }} />
        </div>
      </section>
    </>
  )
}