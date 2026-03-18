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
  @keyframes grainShift { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 30%{transform:translate(3%,5%)} 50%{transform:translate(-8%,2%)} 70%{transform:translate(6%,-6%)} 90%{transform:translate(-3%,8%)} }
  @keyframes lineGrow { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes slowZoom { 0%{transform:scale(1)} 100%{transform:scale(1.08)} }
  @keyframes textReveal { from{opacity:0;transform:translateY(80px) rotateX(15deg)} to{opacity:1;transform:translateY(0) rotateX(0deg)} }
  @keyframes pulseRing { 0%{transform:translate(-50%,-50%) scale(0.95);opacity:0.5} 50%{transform:translate(-50%,-50%) scale(1.05);opacity:0.8} 100%{transform:translate(-50%,-50%) scale(0.95);opacity:0.5} }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes floatUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes widthExpand { from{width:0} to{width:72px} }
  @keyframes glowPulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }

  .sai-hero * { box-sizing:border-box; }
  .sai-hero { font-family:'Plus Jakarta Sans', sans-serif; }
  .sai-display { font-family:'Outfit', sans-serif; }

  .sai-grain {
    position: fixed;
    top: -50%; left: -50%; right: -50%; bottom: -50%;
    width: 200%; height: 200%;
    pointer-events: none; z-index: 9999;
    opacity: 0.022;
    animation: grainShift 0.5s steps(1) infinite;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
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

  /* ── PRECISION HERO — SPLIT LAYOUT ── */
  .sai-precision-hero {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #070c18;
  }

  /* Split content area — 60/40 */
  .sai-precision-content {
    flex: 1;
    display: grid;
    grid-template-columns: 3fr 2fr;
    position: relative;
  }

  /* Left Column — Image */
  .sai-precision-left {
    position: relative;
    overflow: hidden;
  }

  .sai-precision-left .sai-hero-image-wrap {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .sai-precision-left .sai-hero-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    animation: slowZoom 25s ease-in-out infinite alternate;
  }

  .sai-precision-left .sai-hero-image-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      linear-gradient(180deg,
        rgba(7,12,24,0.5) 0%,
        rgba(7,12,24,0.1) 30%,
        rgba(7,12,24,0.15) 50%,
        rgba(7,12,24,0.6) 75%,
        rgba(7,12,24,0.95) 100%
      );
  }

  .sai-precision-left .sai-hero-image-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 80%, rgba(29,78,216,0.08) 0%, transparent 60%),
      linear-gradient(90deg, transparent 50%, rgba(7,12,24,0.85) 100%);
  }

  /* ── Tags overlay — centered on image, below navbar ── */
  .sai-precision-tags-overlay {
    position: absolute;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 8;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    animation: floatUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both;
    pointer-events: none;
  }

  .sai-precision-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 100px;
    padding: 7px 18px;
    font-size: 11px;
    color: rgba(255,255,255,0.55);
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.06);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    pointer-events: auto;
  }

  .sai-precision-tag-secondary {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.3);
    font-weight: 400;
    letter-spacing: 0.16em;
    font-size: 10px;
    padding: 6px 16px;
  }

  /* Right Column */
  .sai-precision-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 80px 64px 80px 72px;
    position: relative;
    z-index: 5;
  }

  /* Vertical Separator — at 60% */
  .sai-precision-separator {
    position: absolute;
    top: 8%;
    bottom: 8%;
    left: 60%;
    width: 1px;
    background: linear-gradient(180deg, transparent, rgba(59,130,246,0.1) 20%, rgba(59,130,246,0.18) 50%, rgba(59,130,246,0.1) 80%, transparent);
    z-index: 6;
    pointer-events: none;
  }

  /* Background glow for right side */
  .sai-right-glow {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-30%, -50%);
    pointer-events: none;
    z-index: 0;
  }

  .sai-right-ring {
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 1px solid rgba(59,130,246,0.04);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulseRing 7s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .sai-right-ring-2 {
    width: 520px;
    height: 520px;
    border-color: rgba(59,130,246,0.025);
    animation: pulseRing 9s ease-in-out 2s infinite;
  }

  /* Right label */
  .sai-right-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    animation: floatUp 1s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }

  /* Clean Heading — No Grain */
  .sai-clean-heading {
    position: relative;
    margin: 0;
    padding: 0;
    perspective: 800px;
  }

  .sai-hw {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: clamp(3.2rem, 6.5vw, 7.5rem);
    line-height: 0.92;
    letter-spacing: -0.05em;
    position: relative;
    z-index: 2;
  }

  .sai-hw-light {
    font-weight: 300;
    color: rgba(148,163,184,0.5);
    animation: textReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both;
  }

  .sai-hw-bold {
    font-weight: 800;
    background: linear-gradient(
      135deg,
      #93c5fd 0%,
      #60a5fa 20%,
      #ffffff 45%,
      #e2e8f0 55%,
      #60a5fa 75%,
      #3b82f6 100%
    );
    background-size: 200% 200%;
    animation: textReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.5s both,
               gradientShift 6s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .sai-hw-accent {
    font-weight: 600;
    background: linear-gradient(
      90deg,
      #3b82f6 0%,
      #60a5fa 30%,
      #93c5fd 50%,
      #60a5fa 70%,
      #3b82f6 100%
    );
    background-size: 200% 200%;
    animation: textReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s both,
               gradientShift 5s ease infinite;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Right accent line */
  .sai-right-accent-line {
    width: 72px;
    height: 1px;
    background: linear-gradient(90deg, rgba(59,130,246,0.5), rgba(59,130,246,0.02));
    margin-top: 40px;
    margin-bottom: 24px;
    transform-origin: left;
    animation: lineGrow 1.2s ease-out 0.9s both;
  }

  /* Right body text */
  .sai-right-body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14.5px;
    color: rgba(255,255,255,0.3);
    line-height: 1.8;
    max-width: 380px;
    font-weight: 300;
    letter-spacing: 0.01em;
    animation: floatUp 1s cubic-bezier(0.16,1,0.3,1) 1s both;
  }

  /* Right CTA row */
  .sai-right-cta-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 36px;
    animation: floatUp 1s cubic-bezier(0.16,1,0.3,1) 1.1s both;
  }

  .sai-right-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    border: none;
    position: relative;
    overflow: hidden;
  }

  .sai-right-cta-primary {
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    color: white;
    box-shadow: 0 8px 32px rgba(59,130,246,0.3), 0 2px 8px rgba(59,130,246,0.15);
  }
  .sai-right-cta-primary::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transition: left 0.5s;
  }
  .sai-right-cta-primary:hover::before { left: 100%; }
  .sai-right-cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 48px rgba(59,130,246,0.4);
  }

  .sai-right-cta-ghost {
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.5);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .sai-right-cta-ghost:hover {
    background: rgba(59,130,246,0.08);
    color: rgba(255,255,255,0.7);
    border-color: rgba(59,130,246,0.3);
    transform: translateY(-2px);
  }

  /* Scroll indicator */
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

  /* Corner accents */
  .sai-corner-accent {
    position: absolute;
    z-index: 4;
    pointer-events: none;
  }
  .sai-corner-accent.top-left {
    top: 32px; left: 32px;
    width: 48px; height: 48px;
    border-left: 1px solid rgba(59,130,246,0.15);
    border-top: 1px solid rgba(59,130,246,0.15);
  }
  .sai-corner-accent.top-right {
    top: 32px; right: 32px;
    width: 48px; height: 48px;
    border-right: 1px solid rgba(59,130,246,0.15);
    border-top: 1px solid rgba(59,130,246,0.15);
  }
  .sai-corner-accent.bottom-left {
    bottom: 32px; left: 32px;
    width: 48px; height: 48px;
    border-left: 1px solid rgba(59,130,246,0.1);
    border-bottom: 1px solid rgba(59,130,246,0.1);
  }
  .sai-corner-accent.bottom-right {
    bottom: 32px; right: 32px;
    width: 48px; height: 48px;
    border-right: 1px solid rgba(59,130,246,0.1);
    border-bottom: 1px solid rgba(59,130,246,0.1);
  }

  /* Marquee */
  .sai-marquee-strip {
    position: absolute;
    bottom: 70px;
    left: 0; right: 0;
    z-index: 5;
    overflow: hidden;
    pointer-events: none;
    opacity: 0.04;
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

  /* Left overlay stats */
  .sai-left-overlay-stats {
    position: absolute;
    bottom: 48px;
    left: 40px;
    right: 40px;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 32px;
    animation: floatUp 1s cubic-bezier(0.16,1,0.3,1) 0.6s both;
  }

  .sai-left-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sai-left-stat-value {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: white;
    letter-spacing: -0.02em;
  }

  .sai-left-stat-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 400;
  }

  .sai-left-stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255,255,255,0.08);
  }

  /* ── RESPONSIVE ── */

  @media (max-width: 1200px) {
    .sai-precision-right {
      padding: 60px 40px 60px 56px;
    }
    .sai-hero-grid {
      gap: 50px !important;
      padding: 120px 40px 80px !important;
    }
    .sai-hero-right .sai-glass-card {
      transform: scale(0.9);
    }
  }

  @media (max-width: 1024px) {
    .sai-hw {
      font-size: clamp(2.8rem, 5.5vw, 5.5rem);
    }
    .sai-precision-right {
      padding: 60px 32px 60px 48px;
    }
    .sai-precision-tags-overlay {
      top: 80px;
    }
  }

  @media (max-width: 900px) {
    .sai-precision-content {
      grid-template-columns: 1fr;
    }
    .sai-precision-left {
      min-height: 50vh;
    }
    .sai-precision-right {
      padding: 56px 32px;
      align-items: center;
      text-align: center;
    }
    .sai-clean-heading {
      text-align: center;
    }
    .sai-right-label {
      justify-content: center;
      width: 100%;
    }
    .sai-right-accent-line {
      margin-left: auto;
      margin-right: auto;
    }
    .sai-right-body {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
    }
    .sai-right-cta-row {
      justify-content: center;
      flex-wrap: wrap;
    }
    .sai-precision-separator {
      display: none;
    }
    .sai-hw {
      font-size: clamp(2.5rem, 9vw, 5rem);
    }
    .sai-precision-tags-overlay {
      top: 76px;
    }
    .sai-corner-accent { display: none !important; }
    .sai-marquee-strip { bottom: 40px; opacity: 0.03; }
    .sai-hero-grid {
      grid-template-columns: 1fr !important;
      gap: 48px !important;
      padding: 100px 24px 60px !important;
    }
    .sai-hero-right { display: none !important; }
  }

  @media (max-width: 768px) {
    .sai-precision-left {
      min-height: 42vh;
    }
    .sai-precision-right {
      padding: 44px 24px;
    }
    .sai-hw {
      font-size: clamp(2.2rem, 10vw, 4rem);
    }
    .sai-right-label {
      font-size: 10px;
      margin-bottom: 22px;
    }
    .sai-right-accent-line {
      margin-top: 28px;
      margin-bottom: 18px;
    }
    .sai-right-body {
      font-size: 13px;
    }
    .sai-left-overlay-stats {
      bottom: 24px;
      left: 20px;
      gap: 16px;
    }
    .sai-left-stat-value { font-size: 18px; }
    .sai-left-stat-label { font-size: 9px; }
    .sai-marquee-item {
      font-size: 28px;
      padding: 0 30px;
    }
    .sai-scroll-indicator {
      bottom: 12px;
    }
    .sai-btn-primary, .sai-btn-ghost {
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
    .sai-precision-tags-overlay {
      top: 72px;
      gap: 8px;
    }
    .sai-precision-tag {
      font-size: 10px;
      padding: 6px 14px;
    }
    .sai-precision-tag-secondary {
      font-size: 9px;
      padding: 5px 12px;
    }
    .sai-right-cta-btn {
      padding: 12px 26px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .sai-precision-left {
      min-height: 38vh;
    }
    .sai-precision-right {
      padding: 36px 16px 50px;
    }
    .sai-hw {
      font-size: clamp(2rem, 12vw, 3.5rem);
    }
    .sai-right-label {
      font-size: 9px;
      letter-spacing: 0.15em;
      margin-bottom: 18px;
    }
    .sai-right-accent-line {
      width: 48px;
      margin-top: 22px;
      margin-bottom: 14px;
    }
    .sai-right-body {
      font-size: 12px;
      line-height: 1.7;
    }
    .sai-left-overlay-stats {
      bottom: 16px;
      left: 16px;
      gap: 12px;
    }
    .sai-left-stat-value { font-size: 16px; }
    .sai-left-stat-divider { height: 24px; }
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
    .sai-btn-primary, .sai-btn-ghost {
      padding: 12px 24px;
      font-size: 13px;
      width: 100%;
      justify-content: center;
    }
    .sai-a3 > div, .sai-a3 {
      flex-direction: column !important;
      width: 100%;
    }
    .sai-terminal {
      width: 100%;
      justify-content: flex-start;
    }
    .sai-a4 {
      flex-wrap: wrap !important;
      justify-content: center !important;
      gap: 16px !important;
    }
    .sai-right-cta-row {
      flex-direction: column;
      width: 100%;
    }
    .sai-right-cta-btn {
      width: 100%;
      justify-content: center;
    }
    .sai-precision-tags-overlay {
      top: 68px;
      gap: 6px;
    }
    .sai-precision-tag {
      font-size: 9px;
      padding: 5px 12px;
      gap: 6px;
    }
    .sai-precision-tag-secondary {
      font-size: 8px;
      padding: 4px 10px;
    }
    .sai-scroll-indicator {
      bottom: 8px;
      opacity: 0.2;
    }
    .sai-scroll-indicator div {
      height: 30px !important;
    }
  }

  @media (max-width: 360px) {
    .sai-hero-grid {
      padding: 70px 12px 40px !important;
    }
    .sai-badge {
      padding: 5px 12px;
      font-size: 10px;
    }
    .sai-hw {
      font-size: clamp(1.8rem, 13vw, 3rem);
    }
  }

  @media (max-height: 500px) and (orientation: landscape) {
    .sai-precision-hero {
      min-height: 100vh;
    }
    .sai-precision-content {
      grid-template-columns: 3fr 2fr;
    }
    .sai-precision-right {
      padding: 40px 32px;
    }
    .sai-hw {
      font-size: clamp(1.8rem, 4vw, 3rem);
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

      {/* ── PRECISION HERO — 60/40 SPLIT LAYOUT ── */}
      <section className="sai-precision-hero">

        {/* ── SPLIT CONTENT ── */}
        <div className="sai-precision-content">

          {/* ── LEFT: Image (60%) ── */}
          <div className="sai-precision-left">
            <div className="sai-hero-image-wrap">
              <img
                src="/cover-image.png"
                alt="Medical facility"
              />
              <div className="sai-hero-image-overlay" />
            </div>

            {/* Dot grid */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.03, zIndex: 3,
              backgroundImage: 'radial-gradient(circle, rgba(147,197,253,0.8) 0.5px, transparent 0.5px)',
              backgroundSize: '40px 40px', pointerEvents: 'none',
            }} />

            {/* ── Tags — vertically stacked, centered on image, below navbar ── */}
            <div className="sai-precision-tags-overlay">
              <span className="sai-precision-tag">
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#3b82f6',
                  boxShadow: '0 0 10px rgba(59,130,246,0.8)',
                  animation: 'dotPulse 2s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                Launching Soon — Open Source · Not for Profit
              </span>
              <span className="sai-precision-tag sai-precision-tag-secondary">
                Next-Generation Healthcare Intelligence
              </span>
            </div>
          </div>

          {/* ── RIGHT: Clean Text (40%) ── */}
          <div className="sai-precision-right">
            {/* Background glow */}
            <div className="sai-right-glow" />
            <div className="sai-right-ring" />
            <div className="sai-right-ring sai-right-ring-2" />

            {/* Subtle dot grid */}
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.015, zIndex: 0,
              backgroundImage: 'radial-gradient(circle, rgba(147,197,253,0.5) 0.5px, transparent 0.5px)',
              backgroundSize: '48px 48px', pointerEvents: 'none',
            }} />

            {/* Label */}
            <span className="sai-right-label">
              <span style={{
                display: 'inline-block',
                width: 22, height: 1,
                background: 'rgba(59,130,246,0.35)',
                marginRight: 14,
                flexShrink: 0,
              }} />
              Healthcare AI Platform
            </span>

            {/* Main clean heading */}
            <h1 className="sai-clean-heading">
              <span className="sai-hw sai-hw-light">Realtime</span>
              <span className="sai-hw sai-hw-bold">Precision</span>
              <span className="sai-hw sai-hw-accent">Monitoring</span>
            </h1>

            {/* Accent line */}
            <div className="sai-right-accent-line" />

            {/* Body text */}
            <p className="sai-right-body">
              AI-powered diagnostics delivering real-time precision insights
              for next-generation healthcare monitoring — accessible, private,
              and built for every community.
            </p>

            {/* CTA Buttons */}
            <div className="sai-right-cta-row">
              <button className="sai-right-cta-btn sai-right-cta-primary">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.5" />
                  <path d="M5 8h6M8 5v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Book a Demo
              </button>
              <button className="sai-right-cta-btn sai-right-cta-ghost">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="rgba(255,255,255,0.5)" />
                </svg>
                Learn More
              </button>
            </div>
          </div>

          {/* Vertical separator */}
          <div className="sai-precision-separator" />
        </div>

        {/* Corner accents */}
        <div className="sai-corner-accent top-left" />
        <div className="sai-corner-accent top-right" />
        <div className="sai-corner-accent bottom-left" />
        <div className="sai-corner-accent bottom-right" />

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