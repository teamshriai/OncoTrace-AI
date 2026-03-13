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
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(48px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideRight { from{opacity:0;transform:translateX(60px) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes dotPulse { 0%,100%{box-shadow:0 0 7px rgba(59,130,246,0.9)} 50%{box-shadow:0 0 18px rgba(59,130,246,1)} }
  @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.15);opacity:0.9} }
  @keyframes horizontalDrift { 0%{transform:translateX(-30px)} 50%{transform:translateX(30px)} 100%{transform:translateX(-30px)} }
  @keyframes verticalDrift { 0%{transform:translateY(-20px)} 50%{transform:translateY(20px)} 100%{transform:translateY(-20px)} }
  @keyframes grainShift { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 30%{transform:translate(3%,5%)} 50%{transform:translate(-8%,2%)} 70%{transform:translate(6%,-6%)} 90%{transform:translate(-3%,8%)} }
  @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes slowZoom { 0%{transform:scale(1)} 100%{transform:scale(1.08)} }
  @keyframes glitchGrain { 0%{opacity:0.03} 20%{opacity:0.06} 40%{opacity:0.02} 60%{opacity:0.05} 80%{opacity:0.03} 100%{opacity:0.04} }
  @keyframes textReveal { from{opacity:0;transform:translateY(80px) rotateX(15deg)} to{opacity:1;transform:translateY(0) rotateX(0deg)} }
  @keyframes subtleFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulseRing { 0%{transform:scale(0.95);opacity:0.5} 50%{transform:scale(1.05);opacity:0.8} 100%{transform:scale(0.95);opacity:0.5} }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes counterUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes typeBarPulse { 0%,100%{opacity:0.4;width:2px} 50%{opacity:1;width:3px} }

  .sai-hero * { box-sizing:border-box; }
  .sai-hero { font-family:'Plus Jakarta Sans', sans-serif; }
  .sai-display { font-family:'Outfit', sans-serif; }

  .sai-grain {
    position: fixed;
    top: -50%; left: -50%; right: -50%; bottom: -50%;
    width: 200%; height: 200%;
    pointer-events: none; z-index: 9999;
    opacity: 0.028;
    animation: grainShift 0.5s steps(1) infinite;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .sai-grainy-text {
    background: linear-gradient(
      135deg,
      #0a1628 0%,
      #1a2d52 15%,
      #1d4ed8 30%,
      #3b82f6 45%,
      #0f172a 55%,
      #1e3a6e 70%,
      #2563eb 85%,
      #0a1628 100%
    );
    background-size: 300% 300%;
    animation: gradientShift 8s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    filter: url(#grainy-filter);
  }

  .sai-grainy-text::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.12;
    mix-blend-mode: overlay;
    pointer-events: none;
    animation: glitchGrain 2s steps(3) infinite;
  }

  .sai-grainy-accent {
    background: linear-gradient(
      135deg,
      #1d4ed8 0%,
      #3b82f6 25%,
      #60a5fa 50%,
      #2563eb 75%,
      #1d4ed8 100%
    );
    background-size: 200% 200%;
    animation: gradientShift 6s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }

  .sai-shimmer {
    background: linear-gradient(90deg,#1d4ed8 0%,#3b82f6 30%,#93c5fd 50%,#3b82f6 70%,#1d4ed8 100%);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation: shimmer 3.5s linear infinite;
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
    position: relative; overflow: hidden;
  }
  .sai-btn-primary::before {
    content: ''; position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.5s;
  }
  .sai-btn-primary:hover::before { left: 100%; }
  .sai-btn-primary:hover { transform:translateY(-3px); box-shadow:0 18px 48px rgba(59,130,246,0.45), 0 4px 12px rgba(59,130,246,0.25); }

  .sai-btn-ghost {
    display:inline-flex; align-items:center; gap:10px;
    background:rgba(255,255,255,0.4);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
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
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    border-radius:100px;
    padding:8px 18px; font-size:13px; color:#1d4ed8; font-weight:500;
    border:1px solid rgba(59,130,246,0.12); letter-spacing:0.03em;
  }

  .sai-divider-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent);
    transform-origin: left;
    animation: lineGrow 1.2s ease-out 0.6s both;
  }

  /* ── PRECISION HERO SECTION ── */
  .sai-precision-hero {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #070c18;
  }

  .sai-precision-hero .sai-hero-image-wrap {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sai-precision-hero .sai-hero-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    animation: slowZoom 25s ease-in-out infinite alternate;
  }

  .sai-precision-hero .sai-hero-image-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      linear-gradient(180deg,
        rgba(7,12,24,0.35) 0%,
        rgba(7,12,24,0.15) 25%,
        rgba(7,12,24,0.25) 50%,
        rgba(7,12,24,0.7) 75%,
        rgba(7,12,24,0.95) 100%
      );
  }

  .sai-precision-hero .sai-hero-image-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 80%, rgba(29,78,216,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.04) 0%, transparent 50%);
  }

  .sai-hero-content-top {
    position: relative;
    z-index: 5;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0 32px 0;
    text-align: center;
    min-height: 100vh;
    padding-top: 120px;
    padding-bottom: 100px;
  }

  .sai-hero-headline {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(2.8rem, 8vw, 6.5rem);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -0.04em;
    margin-bottom: 0;
    position: relative;
    perspective: 800px;
  }

  .sai-hero-headline .line {
    display: block;
    animation: textReveal 1.2s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sai-hero-headline .line:nth-child(1) { animation-delay: 0.1s; }
  .sai-hero-headline .line:nth-child(2) { animation-delay: 0.25s; }
  .sai-hero-headline .line:nth-child(3) { animation-delay: 0.4s; }

  .sai-hero-headline .line-light {
    color: rgba(255,255,255,0.92);
    font-weight: 300;
  }

  .sai-hero-headline .line-bold {
    font-weight: 800;
    background: linear-gradient(
      135deg,
      #e2e8f0 0%,
      #93c5fd 20%,
      #60a5fa 35%,
      #ffffff 50%,
      #93c5fd 65%,
      #3b82f6 80%,
      #e2e8f0 100%
    );
    background-size: 300% 300%;
    animation: textReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.25s both, gradientShift 6s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }

  .sai-hero-headline .line-bold::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.08;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  .sai-hero-headline .line-accent {
    font-weight: 700;
    font-size: clamp(2.4rem, 6.5vw, 5.5rem);
    background: linear-gradient(
      90deg,
      #3b82f6 0%,
      #60a5fa 20%,
      #93c5fd 40%,
      #bfdbfe 50%,
      #93c5fd 60%,
      #60a5fa 80%,
      #3b82f6 100%
    );
    background-size: 200% auto;
    animation: textReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s both, shimmer 4s linear infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }

  .sai-hero-headline .line-accent::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.15;
    mix-blend-mode: soft-light;
    pointer-events: none;
    animation: glitchGrain 1.5s steps(4) infinite;
  }

  .sai-hero-sub-line {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: rgba(255,255,255,0.45);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 28px;
    font-weight: 400;
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both;
  }

  .sai-type-bar {
    margin-top: 24px;
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.7s both;
  }

  .sai-hero-stats-row {
    display: flex;
    gap: 48px;
    margin-top: 40px;
    animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.8s both;
  }

  .sai-hero-stat {
    text-align: center;
  }

  .sai-hero-stat-value {
    font-family: 'Outfit', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #60a5fa;
    letter-spacing: -0.02em;
  }

  .sai-hero-stat-label {
    font-size: 10px;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-top: 4px;
    font-weight: 500;
  }

  .sai-scroll-indicator {
    position: absolute;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0.3;
    z-index: 6;
    animation: fadeIn 1s 1.5s both;
  }

  .sai-corner-accent {
    position: absolute;
    z-index: 4;
    pointer-events: none;
  }

  .sai-corner-accent.top-left {
    top: 32px; left: 32px;
    width: 60px; height: 60px;
    border-left: 1px solid rgba(59,130,246,0.2);
    border-top: 1px solid rgba(59,130,246,0.2);
  }

  .sai-corner-accent.top-right {
    top: 32px; right: 32px;
    width: 60px; height: 60px;
    border-right: 1px solid rgba(59,130,246,0.2);
    border-top: 1px solid rgba(59,130,246,0.2);
  }

  .sai-corner-accent.bottom-left {
    bottom: 32px; left: 32px;
    width: 60px; height: 60px;
    border-left: 1px solid rgba(59,130,246,0.15);
    border-bottom: 1px solid rgba(59,130,246,0.15);
  }

  .sai-corner-accent.bottom-right {
    bottom: 32px; right: 32px;
    width: 60px; height: 60px;
    border-right: 1px solid rgba(59,130,246,0.15);
    border-bottom: 1px solid rgba(59,130,246,0.15);
  }

  .sai-floating-tag {
    position: absolute;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.03em;
    animation: subtleFloat 5s ease-in-out infinite;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
  }

  .sai-floating-tag.tag-1 {
    top: 18%;
    left: 5%;
    animation-delay: 0s;
  }

  .sai-floating-tag.tag-2 {
    top: 25%;
    right: 5%;
    animation-delay: 1.5s;
  }

  .sai-floating-tag.tag-3 {
    top: 50%;
    left: 3%;
    animation-delay: 3s;
  }

  .sai-marquee-strip {
    position: absolute;
    bottom: 70px;
    left: 0; right: 0;
    z-index: 5;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.08;
  }

  .sai-marquee-track {
    display: flex;
    white-space: nowrap;
    animation: marqueeScroll 30s linear infinite;
  }

  .sai-marquee-item {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(40px, 5vw, 70px);
    font-weight: 800;
    color: white;
    padding: 0 60px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ── RESPONSIVE STYLES ── */
  
  /* Tablets and smaller desktops */
  @media (max-width: 1200px) {
    .sai-hero-grid {
      gap: 50px !important;
      padding: 120px 40px 80px !important;
    }
    
    .sai-hero-right .sai-glass-card {
      transform: scale(0.9);
    }
  }
  
  /* Tablets */
  @media (max-width: 900px) {
    .sai-hero-grid {
      grid-template-columns: 1fr !important;
      gap: 48px !important;
      padding: 100px 24px 60px !important;
    }
    .sai-hero-right { display: none !important; }
    .sai-hero-stats-row { gap: 28px; }
    .sai-floating-tag { display: none !important; }
    .sai-corner-accent { display: none !important; }
    .sai-marquee-strip { bottom: 60px; }
    .sai-hero-content-top {
      padding-top: 100px;
    }
    
    .sai-precision-hero {
      min-height: auto;
      aspect-ratio: 2568 / 1696;
    }
    
    .sai-precision-hero .sai-hero-image-wrap img {
      object-fit: contain;
      animation: none;
    }
    
    .sai-hero-content-top {
      min-height: auto;
      padding-top: 60px;
      padding-bottom: 60px;
    }
  }
  
  /* Mobile landscape and small tablets */
  @media (max-width: 768px) {
    .sai-precision-hero {
      min-height: auto;
      width: 100%;
    }
    
    .sai-precision-hero .sai-hero-image-wrap {
      position: relative;
      width: 100%;
      height: auto;
      aspect-ratio: 2568 / 1696;
    }
    
    .sai-precision-hero .sai-hero-image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center center;
      animation: none;
    }
    
    .sai-precision-hero .sai-hero-image-overlay {
      background: linear-gradient(180deg,
        rgba(7,12,24,0.2) 0%,
        rgba(7,12,24,0.1) 40%,
        rgba(7,12,24,0.4) 70%,
        rgba(7,12,24,0.85) 100%
      );
    }
    
    .sai-hero-content-top {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      min-height: auto;
      padding: 20px 16px 40px;
      justify-content: flex-end;
    }
    
    .sai-hero-sub-line {
      font-size: 12px;
      letter-spacing: 0.15em;
      margin-top: 16px;
    }
    
    .sai-marquee-strip {
      bottom: 40px;
      opacity: 0.05;
    }
    
    .sai-marquee-item {
      font-size: 28px;
      padding: 0 30px;
    }
    
    .sai-scroll-indicator {
      bottom: 12px;
    }
    
    .sai-btn-primary,
    .sai-btn-ghost {
      padding: 14px 28px;
      font-size: 14px;
    }
    
    .sai-terminal {
      padding: 10px 16px;
      gap: 8px;
    }
    
    .sai-badge {
      padding: 6px 14px;
      font-size: 11px;
    }
  }
  
  /* Mobile portrait */
  @media (max-width: 480px) {
    .sai-precision-hero {
      background: #070c18;
    }
    
    .sai-precision-hero .sai-hero-image-wrap {
      aspect-ratio: 2568 / 1696;
    }
    
    .sai-hero-content-top {
      padding: 16px 12px 32px;
    }
    
    .sai-hero-sub-line {
      font-size: 10px;
      letter-spacing: 0.1em;
      margin-top: 12px;
    }
    
    .sai-marquee-strip {
      bottom: 30px;
    }
    
    .sai-marquee-item {
      font-size: 22px;
      padding: 0 20px;
    }
    
    .sai-hero-grid {
      padding: 80px 16px 50px !important;
    }
    
    .sai-btn-primary,
    .sai-btn-ghost {
      padding: 12px 24px;
      font-size: 13px;
      width: 100%;
      justify-content: center;
    }
    
    .sai-a3 > div,
    .sai-a3 {
      flex-direction: column !important;
      width: 100%;
    }
    
    .sai-terminal {
      width: 100%;
      justify-content: flex-start;
    }
    
    .sai-hero-stats-row {
      gap: 16px;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .sai-a4 {
      flex-wrap: wrap !important;
      justify-content: center !important;
      gap: 16px !important;
    }
    
    .sai-scroll-indicator {
      bottom: 8px;
      opacity: 0.2;
    }
    
    .sai-scroll-indicator div {
      height: 30px !important;
    }
  }
  
  /* Very small screens */
  @media (max-width: 360px) {
    .sai-hero-grid {
      padding: 70px 12px 40px !important;
    }
    
    .sai-hero-sub-line {
      font-size: 9px;
    }
    
    .sai-badge {
      padding: 5px 12px;
      font-size: 10px;
    }
  }
  
  /* Landscape orientation on mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    .sai-precision-hero {
      min-height: 100vh;
    }
    
    .sai-precision-hero .sai-hero-image-wrap {
      position: absolute;
      inset: 0;
      aspect-ratio: auto;
    }
    
    .sai-precision-hero .sai-hero-image-wrap img {
      object-fit: cover;
    }
    
    .sai-hero-content-top {
      position: relative;
      min-height: 100vh;
      justify-content: center;
      padding-top: 40px;
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
      <div className="sai-grain" />

      {/* SVG noise filter for grainy text */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="grainy-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* ── PRECISION HERO WITH IMAGE ── */}
      <section className="sai-precision-hero">
        {/* Hospital image background */}
        <div className="sai-hero-image-wrap">
          <img
            src="/cover-image.png"
            alt="Medical facility"
          />
          <div className="sai-hero-image-overlay" />
        </div>

        {/* Corner accents */}
        <div className="sai-corner-accent top-left" />
        <div className="sai-corner-accent top-right" />
        <div className="sai-corner-accent bottom-left" />
        <div className="sai-corner-accent bottom-right" />

        {/* Subtle dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, zIndex: 3,
          backgroundImage: 'radial-gradient(circle, rgba(147,197,253,0.8) 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px', pointerEvents: 'none',
        }} />

        {/* Content */}
        <div className="sai-hero-content-top" style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          transition: 'transform 0.05s linear',
        }}>
          {/* Top badge */}
          <div style={{
            marginBottom: '32px',
            animation: 'fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0s both',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 100,
              padding: '8px 20px', fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 500, letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#3b82f6',
                boxShadow: '0 0 10px rgba(59,130,246,0.8)',
                animation: 'dotPulse 2s ease-in-out infinite',
              }} />
              Launching Soon — Open Source · Not for Profit
            </span>
          </div>


          {/* Subtitle */}
          <p className="sai-hero-sub-line">
            Next-Generation Healthcare Intelligence
          </p>
        </div>

        {/* Marquee strip */}
        <div className="sai-marquee-strip">
          <div className="sai-marquee-track">
            {Array(4).fill(null).map((_, i) => (
              <span key={i} className="sai-marquee-item">
                AI Precision Monitoring — Diagnostics — Healthcare —
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="sai-scroll-indicator">
          <span style={{
            fontSize: 9, color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          }}>Scroll</span>
          <div style={{
            width: 1, height: 42,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
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
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '160px',
                  background: 'linear-gradient(to top, rgba(15,23,42,0.7), transparent)',
                  borderRadius: '0 0 20px 20px',
                }} />
              </div>

              {/* Floating accuracy card */}
              <div className="sai-glass-card" style={{
                position: 'absolute',
                top: '-55px', right: '-115px',
                zIndex: 3, borderRadius: '20px',
                padding: '16px 20px', minWidth: '155px',
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
                  marginTop: '8px', height: '3px',
                  borderRadius: '3px',
                  background: 'rgba(59,130,246,0.1)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '98.2%', height: '100%',
                    borderRadius: '3px',
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  }} />
                </div>
              </div>

              {/* Floating privacy card */}
              <div className="sai-glass-card" style={{
                position: 'absolute',
                top: '50%', left: '-120px',
                transform: 'translateY(-50%)',
                zIndex: 3, borderRadius: '20px',
                padding: '14px 18px', minWidth: '160px',
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Privacy Status
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>Fully Secured</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>End-to-end encrypted</div>
                </div>
              </div>

              {/* Floating communities card */}
              <div className="sai-glass-card" style={{
                position: 'absolute',
                bottom: '-50px', right: '-100px',
                zIndex: 3, borderRadius: '20px',
                padding: '14px 18px',
              }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.04em' }}>
                  Communities
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex' }}>
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][i],
                        border: '2px solid white',
                        marginLeft: i > 0 ? '-8px' : 0,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8px', color: 'white', fontWeight: 700,
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