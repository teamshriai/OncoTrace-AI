// Navbar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

const NAV_LINKS = [
  { label: 'Home',          href: '#home' },
  { label: 'Mammogram',     href: '#mammogram' },
  { label: 'Liquid Biopsy', href: '#liquid-biopsy' },
  { label: 'Solution',      href: '#solution' },
  { label: 'Research',      href: '#case-study' },
  { label: 'Team',          href: '#team' },
  { label: 'Contact',       href: '#cta' },
];

const STYLE_ID = 'navbar-styles-v3';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const link = document.createElement('link');
  link.id = 'navbar-gf';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap';
  if (!document.getElementById('navbar-gf')) document.head.appendChild(link);

  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; }

    .nb-root {
      font-family: 'DM Sans', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 9999;
    }

    /* ── BAR ── */
    .nb-bar {
      height: 108px; /* ↑ was 72px, now 1.5× = 108px */
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 8px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 clamp(1rem, 4vw, 2.5rem);
      position: relative;
      transition: box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .nb-bar.nb-scrolled {
      border-color: #dbeafe;
      box-shadow: 0 4px 24px rgba(37,99,235,0.10), 0 1px 4px rgba(37,99,235,0.06);
    }

    /* ── LOGO ── */
    .nb-logo-btn {
      background: none; border: none; padding: 0; cursor: pointer;
      display: flex; align-items: center; flex-shrink: 0;
      outline: none; -webkit-tap-highlight-color: transparent;
      border-radius: 8px;
    }
    .nb-logo-btn:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 4px;
    }
    .nb-logo-img {
      height: 100px; /* ↑ was 50px, now 2× = 100px (desktop + mobile) */
      width: auto;
      object-fit: contain; display: block;
      user-select: none; pointer-events: none;
    }
    .nb-logo-text {
      font-size: 1.2rem; font-weight: 700;
      color: #1d4ed8; letter-spacing: -0.02em;
      font-family: 'DM Sans', sans-serif;
    }

    /* ── DESKTOP NAV ── */
    .nb-nav {
      display: flex;
      align-items: center;
      flex: 1;
      justify-content: center;
    }
    .nb-nav ul {
      display: flex; align-items: center;
      gap: 2px; list-style: none;
      margin: 0; padding: 0;
    }
    .nb-link {
      position: relative; border: none; background: none;
      cursor: pointer; font-family: 'DM Sans', inherit;
      font-size: 0.875rem; font-weight: 500;
      color: #374151; padding: 6px 11px; border-radius: 8px;
      transition: color 0.2s ease, background 0.2s ease;
      outline: none; white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-link::after {
      content: ''; position: absolute;
      bottom: 1px; left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: calc(100% - 18px); height: 2px;
      border-radius: 2px; background: #2563eb;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    .nb-link:hover { background: #eff6ff; color: #1d4ed8; }
    .nb-link:hover::after,
    .nb-link.nb-active::after { transform: translateX(-50%) scaleX(1); }
    .nb-link.nb-active { color: #1d4ed8; font-weight: 600; }
    .nb-link:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.3); }

    /* ── DESKTOP CTA ── */
    .nb-cta-area {
      display: flex; align-items: center;
      gap: 8px; flex-shrink: 0;
    }
    .nb-btn-ghost {
      border: 1.5px solid #bfdbfe; background: #eff6ff; color: #1d4ed8;
      font-family: 'DM Sans', inherit; font-size: 0.875rem; font-weight: 600;
      padding: 8px 18px; border-radius: 50px; cursor: pointer;
      transition: all 0.2s ease; outline: none; white-space: nowrap;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-btn-ghost:hover { background: #dbeafe; border-color: #93c5fd; }
    .nb-btn-ghost:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.3); }
    .nb-btn-primary {
      border: none;
      background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
      color: #fff; font-family: 'DM Sans', inherit;
      font-size: 0.875rem; font-weight: 600;
      padding: 8px 20px; border-radius: 50px; cursor: pointer;
      transition: all 0.25s ease; outline: none; white-space: nowrap;
      box-shadow: 0 2px 12px rgba(37,99,235,0.30);
      -webkit-tap-highlight-color: transparent;
    }
    .nb-btn-primary:hover {
      box-shadow: 0 4px 20px rgba(37,99,235,0.45);
      transform: translateY(-1px);
    }
    .nb-btn-primary:active { transform: translateY(0) scale(0.98); }
    .nb-btn-primary:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.4); }

    /* ── PROGRESS BAR ── */
    .nb-progress {
      position: absolute; bottom: 0; left: 0; height: 2px;
      background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa);
      border-radius: 0 2px 2px 0;
      transition: width 0.08s linear;
      pointer-events: none;
    }

    /* ── HAMBURGER ── */
    .nb-hb {
      flex-direction: column; align-items: center;
      justify-content: center; gap: 5px;
      width: 44px; height: 44px; border-radius: 12px;
      border: 1.5px solid #e5e7eb; background: #fff;
      cursor: pointer; padding: 0; outline: none; flex-shrink: 0;
      transition: all 0.25s ease;
      -webkit-tap-highlight-color: transparent;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      display: none;
    }
    .nb-hb.nb-hb-open {
      border-color: #bfdbfe; background: #eff6ff;
      box-shadow: 0 4px 16px rgba(37,99,235,0.12);
    }
    .nb-hb:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.3); }
    .nb-hb-bar {
      display: block; width: 18px; height: 2px; border-radius: 4px;
      background: #2563eb;
      transition: all 0.3s cubic-bezier(0.4,0.2,0.2,1);
      transform-origin: center;
    }
    .nb-hb.nb-hb-open .nb-hb-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nb-hb.nb-hb-open .nb-hb-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .nb-hb.nb-hb-open .nb-hb-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── OVERLAY ── */
    .nb-overlay {
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.4);
      z-index: 9997;
      -webkit-tap-highlight-color: transparent;
      transition: opacity 0.3s ease;
    }

    /* ── DRAWER ── */
    .nb-drawer {
      position: fixed;
      z-index: 9998;
      top: 116px; /* ↑ was 80px, updated to match new 108px bar + 8px gap */
      left: 12px; right: 12px;
      background: #fff;
      border-radius: 20px;
      border: 1px solid #e0ecff;
      box-shadow:
        0 20px 60px rgba(37,99,235,0.12),
        0 4px 16px rgba(0,0,0,0.08);
      max-height: calc(100dvh - 128px); /* ↑ was calc(100dvh - 100px) */
      overflow-y: auto;
      transform-origin: top center;
      padding-bottom: env(safe-area-inset-bottom, 8px);
      overscroll-behavior: contain;
    }

    /* Drawer item stagger via CSS variables */
    .nb-di {
      transition: opacity 0.22s ease, transform 0.22s ease;
    }

    /* Drawer link */
    .nb-dl {
      display: flex; align-items: center;
      justify-content: space-between;
      width: 100%; padding: 13px 14px;
      border-radius: 12px; border: none;
      cursor: pointer; font-family: 'DM Sans', inherit;
      font-size: 0.9375rem; font-weight: 500;
      color: #374151; background: transparent;
      text-align: left;
      transition: background 0.18s ease, color 0.18s ease;
      outline: none; -webkit-tap-highlight-color: transparent;
      -webkit-appearance: none;
    }
    .nb-dl:hover { background: #eff6ff; color: #1d4ed8; }
    .nb-dl:active { background: #dbeafe; }
    .nb-dl.nb-dl-active {
      background: #eff6ff; color: #1d4ed8; font-weight: 600;
    }
    .nb-dl:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.3); }

    /* Drawer CTA */
    .nb-dcta {
      display: block; width: 100%; padding: 13px;
      border-radius: 12px; border: none; cursor: pointer;
      font-family: 'DM Sans', inherit; font-size: 0.9375rem;
      font-weight: 600; letter-spacing: 0.02em;
      text-align: center; outline: none;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
      -webkit-appearance: none;
    }
    .nb-dcta-primary {
      background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
      color: #fff !important;
      box-shadow: 0 2px 12px rgba(37,99,235,0.28);
    }
    .nb-dcta-primary:active { transform: scale(0.98); opacity: 0.9; }
    .nb-dcta-secondary {
      background: #f8fafc; color: #374151 !important;
      border: 1.5px solid #e2e8f0 !important;
    }
    .nb-dcta-secondary:active { background: #f1f5f9; }

    /* Pulse dot */
    @keyframes nbpulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.75); }
    }
    .nb-dot-pulse { animation: nbpulse 2s infinite; }

    /* Demo badge */
    .nb-demo-badge {
      font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #2563eb; background: #eff6ff;
      padding: 4px 12px; border-radius: 50px;
      border: 1px solid #bfdbfe;
      white-space: nowrap;
    }

    /* scroll offset for anchor targets — matches new bar height */
    html { scroll-padding-top: 116px; } /* ↑ was 80px */

    /* ── RESPONSIVE ── */
    @media (min-width: 1024px) {
      .nb-nav      { display: flex !important; }
      .nb-cta-area { display: flex !important; }
      .nb-hb       { display: none !important; }
    }
    @media (max-width: 1023px) {
      .nb-nav      { display: none !important; }
      .nb-cta-area { display: none !important; }
      .nb-hb       { display: flex !important; }

      /* On mobile the bar stays the same 108px tall so logo fits */
      .nb-bar { height: 108px; }
    }
  `;
  document.head.appendChild(s);
}

export default function Navbar({ currentPage, onNavigate }) {
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [activeHref, setActiveHref] = useState('#home');
  const [logoError,  setLogoError]  = useState(false);
  const navRef                       = useRef(null);
  const drawerRef                    = useRef(null);
  const isDemoPage                   = currentPage === 'demo';

  /* ── Scroll: shadow + progress + spy ── */
  useEffect(() => {
    const handle = () => {
      const top = window.scrollY;
      const max =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrolled(top > 8);
      setProgress(max > 0 ? (top / max) * 100 : 0);

      let cur = '#home';
      NAV_LINKS.forEach(({ href }) => {
        if (href === '#home') return;
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) cur = href;
      });
      setActiveHref(cur);
    };
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* ── Escape key ── */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [isOpen]);

  /* ── Close on route/page change ── */
  useEffect(() => { setIsOpen(false); }, [currentPage]);

  /* ── Smooth scroll / navigate ── */
  const scrollTo = useCallback((href) => {
    setIsOpen(false);
    const id = href.replace('#', '');
    const exec = () => {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (isDemoPage) {
      onNavigate(id === 'home' ? 'home' : id);
    } else {
      exec();
    }
  }, [isDemoPage, onNavigate]);

  const handleCta = useCallback(() => {
    setIsOpen(false);
    onNavigate(isDemoPage ? 'home' : 'demo');
  }, [isDemoPage, onNavigate]);

  const handleLogo = useCallback(() => {
    setIsOpen(false);
    if (isDemoPage) onNavigate('home');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isDemoPage, onNavigate]);

  const toggleMenu = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  /* ── Stagger delays for drawer items ── */
  const staggerStyle = (i) => ({
    transitionDelay: isOpen ? `${i * 30}ms` : '0ms',
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateX(0)' : 'translateX(-12px)',
  });

  return (
    <>
      <div ref={navRef} className="nb-root">
        {/* ══ TOP BAR ══ */}
        <div className={`nb-bar${scrolled ? ' nb-scrolled' : ''}`}>

          {/* Logo */}
          <button
            className="nb-logo-btn"
            onClick={handleLogo}
            aria-label="Go to homepage"
            type="button"
          >
            {logoError ? (
              <span className="nb-logo-text">OncoTrace AI</span>
            ) : (
              <img
                className="nb-logo-img"
                src="/Logo.png"
                alt="OncoTrace AI"
                draggable={false}
                onError={() => setLogoError(true)}
              />
            )}
          </button>

          {/* Desktop nav */}
          <nav className="nb-nav" aria-label="Main navigation">
            <ul role="list">
              {!isDemoPage
                ? NAV_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <button
                        className={`nb-link${activeHref === href ? ' nb-active' : ''}`}
                        onClick={() => scrollTo(href)}
                        type="button"
                        aria-current={activeHref === href ? 'page' : undefined}
                      >
                        {label}
                      </button>
                    </li>
                  ))
                : (
                    <li>
                      <span className="nb-demo-badge">Demo Mode</span>
                    </li>
                  )}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <div className="nb-cta-area">
            
            <button className="nb-btn-primary" type="button" onClick={handleCta}>
              {isDemoPage ? '← Back to Home' : 'View Demo →'}
            </button>
          </div>

          {/* Hamburger */}
          <button
            className={`nb-hb${isOpen ? ' nb-hb-open' : ''}`}
            type="button"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="nb-mobile-drawer"
          >
            <span className="nb-hb-bar" aria-hidden="true" />
            <span className="nb-hb-bar" aria-hidden="true" />
            <span className="nb-hb-bar" aria-hidden="true" />
          </button>

          {/* Scroll progress */}
          <div
            className="nb-progress"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ══ BACKDROP ══ */}
      {isOpen && (
        <div
          className="nb-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          style={{ opacity: isOpen ? 1 : 0 }}
        />
      )}

      {/* ══ MOBILE DRAWER ══ */}
      <div
        id="nb-mobile-drawer"
        ref={drawerRef}
        className="nb-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.96)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.28s cubic-bezier(0.16,1,0.3,1)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        <div style={{ padding: '10px 10px 14px' }}>

          {/* Badge */}
          <div className="nb-di" style={staggerStyle(0)}>
            <div style={{ padding: '8px 12px 4px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: '0.6875rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#2563eb', background: '#eff6ff',
                padding: '4px 10px', borderRadius: 50,
                border: '1px solid #bfdbfe',
              }}>
                <span
                  className="nb-dot-pulse"
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#3b82f6', flexShrink: 0,
                    display: 'inline-block',
                  }}
                />
                {isDemoPage ? 'Demo Mode' : 'Navigate'}
              </span>
            </div>
          </div>

          {/* Nav links */}
          {!isDemoPage
            ? NAV_LINKS.map(({ label, href }, i) => (
                <div className="nb-di" key={href} style={staggerStyle(i + 1)}>
                  <button
                    className={`nb-dl${activeHref === href ? ' nb-dl-active' : ''}`}
                    type="button"
                    onClick={() => scrollTo(href)}
                    aria-current={activeHref === href ? 'page' : undefined}
                  >
                    <span>{label}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16"
                      fill="none" aria-hidden="true"
                      style={{ opacity: 0.4, flexShrink: 0 }}
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))
            : (
                <div className="nb-di" style={{ ...staggerStyle(1), padding: '8px 14px 12px' }}>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                    You're currently viewing the OncoTrace platform demo.
                  </p>
                </div>
              )}

          {/* Divider */}
          <div
            className="nb-di"
            style={{
              ...staggerStyle(NAV_LINKS.length + 1),
              padding: '6px 4px',
            }}
          >
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, #dbeafe 0%, transparent 100%)',
            }} />
          </div>

          {/* CTA button */}
          <div
            className="nb-di"
            style={staggerStyle(NAV_LINKS.length + 2)}
          >
            <button
              className={`nb-dcta ${isDemoPage ? 'nb-dcta-secondary' : 'nb-dcta-primary'}`}
              type="button"
              onClick={handleCta}
            >
              {isDemoPage ? '← Back to Home' : 'View Demo →'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}