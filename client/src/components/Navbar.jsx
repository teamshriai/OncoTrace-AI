// Navbar.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home',                    href: '#home' },
  { label: 'AI powered Mammogram Analysis',      href: '#mammogram' },
  { label: 'AI powered Blood-Based cancer Test', href: '#liquid-biopsy' },
  { label: 'Research',                href: '#case-study' },
  { label: 'Team',                    href: '#team' },
  { label: 'Contact',                 href: '#cta' },
];

const PRODUCT_LINKS = [
  {
    label:    'Book a Demo',
    subtitle: 'Liquid Biopsy',
    action:   'book-lb',
    featured: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="3" y="2" width="14" height="16" rx="2"
          stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 1v3M13 1v3M3 7h14"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7"  cy="11" r="1" fill="currentColor" />
        <circle cx="10" cy="11" r="1" fill="currentColor" />
        <circle cx="13" cy="11" r="1" fill="currentColor" />
        <circle cx="7"  cy="14" r="1" fill="currentColor" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label:    'View a Demo',
    subtitle: 'Liquid Biopsy',
    action:   'view-lb',
    featured: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" rx="2"
          stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 8.5l4 2.5-4 2.5V8.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label:    'AI-Powered Mammogram',
    subtitle: 'Analysis Platform',
    action:   'mammo',
    featured: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="16" height="11" rx="2"
          stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10.5" r="3"  stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10.5" r="1"  fill="currentColor" />
        <path d="M14.5 7h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const NAVBAR_HEIGHT  = 108;
const SCROLL_OFFSET  = NAVBAR_HEIGHT + 8;

// ─── Minimal CSS (animations + pseudo-elements) ───────────────────────────────

const STYLE_ID = 'nb-minimal-styles';

function injectMinimalStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  if (!document.getElementById('nb-gf')) {
    const link  = document.createElement('link');
    link.id     = 'nb-gf';
    link.rel    = 'stylesheet';
    link.href   = 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap';
    document.head.appendChild(link);
  }

  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    html { scroll-padding-top: ${SCROLL_OFFSET}px; }

    .nb-font { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; }

    /* Underline indicator */
    .nb-nav-btn::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: calc(100% - 20px);
      height: 2px;
      border-radius: 2px;
      background: #2563eb;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .nb-nav-btn:hover::after,
    .nb-nav-btn.nb-active::after {
      transform: translateX(-50%) scaleX(1);
    }

    /* Keyframes */
    @keyframes nbDropdownIn {
      from { opacity: 0; transform: scale(0.93) translateY(-6px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);    }
    }
    @keyframes nbDrawerIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)     scale(1);    }
    }
    @keyframes nbDrawerOut {
      from { opacity: 1; transform: translateY(0)    scale(1);    }
      to   { opacity: 0; transform: translateY(-8px) scale(0.97); }
    }
    @keyframes nbFadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes nbFadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes nbPulse {
      0%, 100% { opacity: 1;   transform: scale(1);   }
      50%      { opacity: 0.5; transform: scale(0.7); }
    }

    .nb-animate-dropdown  { animation: nbDropdownIn  0.2s  cubic-bezier(0.16,1,0.3,1) both; }
    .nb-animate-drawer    { animation: nbDrawerIn    0.28s cubic-bezier(0.16,1,0.3,1) both; }
    .nb-animate-drawer-out{ animation: nbDrawerOut   0.2s  cubic-bezier(0.4,0,1,1)   both; }
    .nb-animate-fade-in   { animation: nbFadeIn      0.25s ease both; }
    .nb-animate-fade-out  { animation: nbFadeOut     0.2s  ease both; }
    .nb-badge-dot         { animation: nbPulse       2s    ease infinite; }

    /* iOS Safari — prevent elastic scroll bleeding into fixed overlay */
    .nb-drawer-scroll {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    /* Body locked state — avoids the position:fixed jump on iOS */
    body.nb-locked {
      overflow: hidden !important;
      /* do NOT use position:fixed — it resets scroll position on iOS */
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration:        0.01ms !important;
        animation-iteration-count: 1      !important;
        transition-duration:       0.01ms !important;
      }
    }
  `;
  document.head.appendChild(s);
}

injectMinimalStyles();

// ─── Smooth scroll helper ─────────────────────────────────────────────────────

function smoothScrollToId(id) {
  if (!id || id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chevron({ open }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12"
      fill="none" aria-hidden="true"
      className={`transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : 'rotate-0'}`}
    >
      <path
        d="M2.5 4.5L6 8l3.5-3.5"
        stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" aria-hidden="true"
      className="opacity-35 flex-shrink-0 transition-opacity duration-150 group-hover:opacity-70"
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3L5 8l5 5"
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/** Desktop dropdown — rendered inside a portal-like wrapper to avoid stacking issues */
function DesktopDropdown({ onAction, onClose, triggerRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      // Check if clicking inside the panel
      if (panelRef.current && panelRef.current.contains(e.target)) {
        return;
      }
      
      // Check if clicking the trigger button
      if (triggerRef.current && triggerRef.current.contains(e.target)) {
        return;
      }
      
      // Otherwise close the dropdown
      onClose();
    }

    // Use a small timeout to avoid race conditions with the opening click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutside, true);
      document.addEventListener('touchstart', handleOutside, { capture: true, passive: true });
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutside, true);
      document.removeEventListener('touchstart', handleOutside, { capture: true, passive: true });
    };
  }, [onClose, triggerRef]);

  return (
    <div
      ref={panelRef}
      id="nb-dd-panel"
      role="menu"
      aria-label="Products"
      className="
        nb-animate-dropdown
        absolute top-[calc(100%+10px)] right-0
        min-w-[300px] z-[10001]
        bg-white rounded-2xl
        border border-blue-100
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_20px_50px_rgba(37,99,235,0.13)]
        p-2
      "
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {PRODUCT_LINKS.map((p, i) => (
        <div key={p.action}>
          <button
            type="button"
            role="menuitem"
            onClick={() => onAction(p.action)}
            className={`
              group flex items-start gap-3 w-full px-4 py-3.5
              rounded-xl border text-left cursor-pointer outline-none
              transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-blue-400/50
              ${p.featured
                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200'
                : 'bg-transparent border-transparent hover:bg-blue-50 hover:translate-x-0.5'
              }
            `}
          >
            <span className={`
              flex-shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110
              ${p.featured ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-700'}
            `}>
              {p.icon}
            </span>
            <span className="flex flex-col">
              <span className={`
                text-[0.9375rem] font-semibold leading-snug mb-0.5
                transition-colors duration-200
                ${p.featured ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-700'}
              `}>
                {p.label}
              </span>
              <span className="text-[0.8125rem] font-normal text-slate-500 leading-snug">
                {p.subtitle}
              </span>
            </span>
          </button>

          {i < PRODUCT_LINKS.length - 1 && (
            <div
              aria-hidden="true"
              className="h-px my-1.5 bg-gradient-to-r from-transparent via-blue-100 to-transparent"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Custom hook: iOS-safe body scroll lock ───────────────────────────────────

function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    // Simple overflow:hidden approach — avoids iOS position:fixed jump
    const scrollY  = window.scrollY;
    const prevOver = document.body.style.overflow;
    const prevPR   = document.body.style.paddingRight;

    // Account for scrollbar width so content doesn't shift
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow     = 'hidden';
    document.body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      document.body.style.overflow     = prevOver;
      document.body.style.paddingRight = prevPR;
      // Restore scroll position (iOS sometimes resets it)
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, [active]);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Navbar({ currentPage = 'home', onNavigate }) {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [ddOpen,      setDdOpen]      = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [activeHref,  setActiveHref]  = useState('#home');
  const [logoError,   setLogoError]   = useState(false);

  const ddTriggerRef = useRef(null);
  const rafRef       = useRef(null);
  const isDemoPage   = currentPage === 'demo';

  // ── Body scroll lock (iOS-safe) ──────────────────────────────────────────
  useBodyScrollLock(menuOpen);

  // ── Safe navigate ────────────────────────────────────────────────────────
  const navigate = useCallback((page) => {
    if (typeof onNavigate === 'function') onNavigate(page);
  }, [onNavigate]);

  // ── Close menu with exit animation ──────────────────────────────────────
  const closeMenu = useCallback(() => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 220);
  }, []);

  // ── rAF-throttled scroll handler ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const top = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        setScrolled(top > 8);
        setProgress(max > 0 ? Math.min((top / max) * 100, 100) : 0);

        let cur = '#home';
        for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
          const { href } = NAV_LINKS[i];
          if (href === '#home') continue;
          const el = document.getElementById(href.slice(1));
          if (el && el.getBoundingClientRect().top <= SCROLL_OFFSET + 20) {
            cur = href;
            break;
          }
        }
        setActiveHref(cur);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Reset on page change ─────────────────────────────────────────────────
  useEffect(() => {
    setMenuOpen(false);
    setMenuClosing(false);
    setDdOpen(false);
  }, [currentPage]);

  // ── Escape key ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Escape') return;
      if (ddOpen)   { setDdOpen(false); return; }
      if (menuOpen) { closeMenu();      return; }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [ddOpen, menuOpen, closeMenu]);

  // ── Consume cross-page scroll target ────────────────────────────────────
  useEffect(() => {
    if (currentPage !== 'home') return;
    const target = sessionStorage.getItem('nb-scroll-target');
    if (!target) return;
    sessionStorage.removeItem('nb-scroll-target');
    requestAnimationFrame(() => {
      setTimeout(() => smoothScrollToId(target), 120);
    });
  }, [currentPage]);

  // ── Navigation handler (FIXED: Don't close dropdown here) ───────────────
  const handleNavClick = useCallback((href) => {
    const id = href.slice(1);
    closeMenu();
    // REMOVED: setDdOpen(false) — dropdown should only close on outside click or escape
    if (isDemoPage) {
      navigate('home');
      if (id !== 'home') sessionStorage.setItem('nb-scroll-target', id);
    } else {
      setTimeout(() => smoothScrollToId(id), 30);
    }
  }, [isDemoPage, navigate, closeMenu]);

  // ── Logo handler (FIXED: Don't close dropdown here) ─────────────────────
  const handleLogo = useCallback(() => {
    closeMenu();
    // REMOVED: setDdOpen(false) — dropdown should only close on outside click or escape
    if (isDemoPage) {
      navigate('home');
    } else {
      setTimeout(() => smoothScrollToId('home'), 30);
    }
  }, [isDemoPage, navigate, closeMenu]);

  // ── Product action handler ───────────────────────────────────────────────
  const handleProduct = useCallback((action) => {
    setDdOpen(false);
    closeMenu();
    setTimeout(() => {
      if (action === 'book-lb')      navigate('lb');
      else if (action === 'view-lb') navigate('demo');
      else if (action === 'mammo')
        window.open('https://oncotraceai.org/mammo-demo/ui', '_blank', 'noopener,noreferrer');
    }, 50);
  }, [navigate, closeMenu]);

  // ── Toggle dropdown ──────────────────────────────────────────────────────
  const toggleDd = useCallback((e) => {
    e.stopPropagation();
    setDdOpen((prev) => !prev);
  }, []);

  // ── Toggle mobile menu ───────────────────────────────────────────────────
  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
      setDdOpen(false);
    }
  }, [menuOpen, closeMenu]);

  // ── Stagger animation delay ──────────────────────────────────────────────
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const staggerStyle = useCallback((i) =>
    prefersReducedMotion ? {} : { animationDelay: `${i * 35}ms` }
  , [prefersReducedMotion]);

  const showDrawer = menuOpen || menuClosing;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="nb-font">

      {/* ══ FIXED BAR ══════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-[9999]">
        <header
          className={`
            relative flex items-center justify-between
            h-[108px] px-[clamp(1rem,4vw,2.5rem)]
            bg-white/[0.97] backdrop-blur-xl
            border-b transition-all duration-300
            ${scrolled
              ? 'border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.10),0_1px_4px_rgba(37,99,235,0.06)]'
              : 'border-gray-200 shadow-[0_1px_8px_rgba(0,0,0,0.05)]'
            }
          `}
        >
          {/* ── Logo ── */}
          <button
            type="button"
            onClick={handleLogo}
            aria-label="OncoTrace AI — go to homepage"
            className="
              relative z-[10001] flex items-center flex-shrink-0
              bg-transparent border-none p-0 cursor-pointer
              rounded-lg outline-none
              opacity-100 hover:opacity-85 active:opacity-70
              transition-opacity duration-200
              focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
            "
          >
            {logoError ? (
              <span className="text-xl font-bold text-blue-700 tracking-tight">
                OncoTrace AI
              </span>
            ) : (
              <img
                src="/Logo.png"
                alt="OncoTrace AI"
                draggable={false}
                onError={() => setLogoError(true)}
                className="h-[88px] w-auto object-contain block pointer-events-none select-none"
              />
            )}
          </button>

          {/* ── Desktop Nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center flex-1 justify-center"
          >
            <ul role="list" className="flex items-center gap-0.5 list-none m-0 p-0">
              {isDemoPage ? (
                <li>
                  <span
                    aria-live="polite"
                    className="
                      text-xs font-bold tracking-widest uppercase
                      text-blue-600 bg-blue-50 border border-blue-200
                      px-4 py-1.5 rounded-full whitespace-nowrap
                    "
                  >
                    Demo Mode
                  </span>
                </li>
              ) : (
                NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(href)}
                      aria-current={activeHref === href ? 'page' : undefined}
                      className={`
                        nb-nav-btn
                        relative border-none cursor-pointer font-medium
                        text-[0.875rem] px-3 py-[7px] rounded-lg
                        outline-none whitespace-nowrap
                        transition-colors duration-200
                        focus-visible:ring-2 focus-visible:ring-blue-400/50
                        ${activeHref === href
                          ? 'nb-active text-blue-700 font-semibold bg-blue-50'
                          : 'text-gray-600 bg-transparent hover:bg-blue-50 hover:text-blue-700'
                        }
                      `}
                    >
                      {label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </nav>

          {/* ── Desktop Actions ── */}
          <div
            aria-label="Product actions"
            className="hidden lg:flex items-center gap-2 flex-shrink-0"
          >
            {isDemoPage ? (
              <button
                type="button"
                onClick={() => navigate('home')}
                className="
                  flex items-center gap-1.5 border-none cursor-pointer
                  text-[0.875rem] font-semibold text-white
                  px-5 py-2.5 rounded-full outline-none whitespace-nowrap
                  bg-gradient-to-br from-blue-700 to-blue-500
                  shadow-[0_2px_12px_rgba(37,99,235,0.28)]
                  hover:shadow-[0_6px_22px_rgba(37,99,235,0.40)] hover:-translate-y-px
                  active:translate-y-0 active:scale-[0.98]
                  transition-all duration-200
                  focus-visible:ring-2 focus-visible:ring-blue-400
                "
              >
                <ArrowLeft />
                Back to Home
              </button>
            ) : (
              <div className="relative">
                <button
                  ref={ddTriggerRef}
                  type="button"
                  onClick={toggleDd}
                  aria-expanded={ddOpen}
                  aria-haspopup="menu"
                  aria-controls="nb-dd-panel"
                  className="
                    flex items-center gap-1.5 border-none cursor-pointer
                    text-[0.875rem] font-semibold text-white
                    px-5 py-2.5 rounded-full outline-none whitespace-nowrap
                    bg-gradient-to-br from-blue-700 to-blue-500
                    shadow-[0_2px_12px_rgba(37,99,235,0.30)]
                    hover:shadow-[0_6px_22px_rgba(37,99,235,0.42)] hover:-translate-y-px
                    active:translate-y-0 active:scale-[0.98]
                    transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-blue-400
                  "
                >
                  <span>View Products</span>
                  <Chevron open={ddOpen} />
                </button>

                {ddOpen && (
                  <DesktopDropdown
                    onAction={handleProduct}
                    onClose={() => setDdOpen(false)}
                    triggerRef={ddTriggerRef}
                  />
                )}
              </div>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="nb-mobile-drawer"
            className={`
              lg:hidden flex flex-col items-center justify-center gap-[5px]
              w-11 h-11 rounded-xl border cursor-pointer p-0 outline-none
              flex-shrink-0 relative z-[10001]
              transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-blue-400/50
              ${menuOpen
                ? 'border-blue-200 bg-blue-50 shadow-[0_4px_16px_rgba(37,99,235,0.12)]'
                : 'border-gray-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
              }
            `}
          >
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                aria-hidden="true"
                className={`
                  block w-[18px] h-0.5 rounded bg-blue-600
                  transition-all duration-300 origin-center
                  ${menuOpen && n === 1 ? 'translate-y-[7px] rotate-45'  : ''}
                  ${menuOpen && n === 2 ? 'opacity-0 scale-x-0'           : ''}
                  ${menuOpen && n === 3 ? '-translate-y-[7px] -rotate-45' : ''}
                `}
              />
            ))}
          </button>

          {/* ── Scroll progress ── */}
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page scroll progress"
            className="
              absolute bottom-0 left-0 h-0.5 rounded-r-sm pointer-events-none
              bg-gradient-to-r from-blue-700 via-blue-500 to-blue-300
              transition-[width] duration-100 ease-linear
            "
            style={{ width: `${progress}%` }}
          />
        </header>
      </div>

      {/* ══ OVERLAY ════════════════════════════════════════════════════════ */}
      {showDrawer && (
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className={`
            fixed inset-0 z-[9997] cursor-pointer
            bg-slate-900/45 backdrop-blur-[3px]
            ${menuClosing ? 'nb-animate-fade-out' : 'nb-animate-fade-in'}
          `}
          onTouchStart={closeMenu}
        />
      )}

      {/* ══ MOBILE DRAWER ══════════════════════════════════════════════════ */}
      {showDrawer && (
        <div
          id="nb-mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`
            nb-drawer-scroll
            fixed z-[9998]
            top-[116px] left-3 right-3
            bg-white rounded-[20px]
            border border-blue-100
            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_20px_50px_rgba(37,99,235,0.13)]
            max-h-[calc(100dvh-128px)] overflow-y-auto overflow-x-hidden
            pb-[max(env(safe-area-inset-bottom,0px),12px)]
            ${menuClosing ? 'nb-animate-drawer-out' : 'nb-animate-drawer'}
          `}
          onClick={(e)      => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e)  => e.stopPropagation()}
        >
          <div className="p-2.5 pb-1">

            {/* Badge */}
            <div className="px-3 pt-2 pb-1.5" style={staggerStyle(0)}>
              <span className="
                inline-flex items-center gap-1.5
                text-[0.6875rem] font-bold tracking-[0.1em] uppercase
                text-blue-600 bg-blue-50 border border-blue-200
                px-3 py-1 rounded-full
              ">
                <span className="nb-badge-dot w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                {isDemoPage ? 'Demo Mode' : 'Navigate'}
              </span>
            </div>

            {isDemoPage ? (
              <>
                <p
                  className="text-[0.8125rem] text-gray-500 leading-relaxed px-3.5 py-1.5 pb-3"
                  style={staggerStyle(1)}
                >
                  You're currently viewing the OncoTrace platform demo.
                </p>

                <div
                  className="h-px mx-1 my-1.5 bg-gradient-to-r from-blue-100 to-transparent"
                  aria-hidden="true"
                  style={staggerStyle(2)}
                />

                <div className="p-1 pt-0" style={staggerStyle(3)}>
                  <button
                    type="button"
                    onClick={() => { closeMenu(); setTimeout(() => navigate('home'), 50); }}
                    className="
                      block w-full py-3.5 px-4 rounded-xl border cursor-pointer
                      text-[0.9375rem] font-semibold text-center outline-none
                      bg-gray-50 text-gray-700 border-gray-200
                      hover:bg-gray-100 active:bg-gray-200 active:scale-[0.99]
                      transition-all duration-150
                      focus-visible:ring-2 focus-visible:ring-blue-400/50
                    "
                  >
                    ← Back to Home
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Nav links */}
                {NAV_LINKS.map(({ label, href }, i) => (
                  <div
                    key={href}
                    className="nb-animate-drawer"
                    style={staggerStyle(i + 1)}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(href)}
                      aria-current={activeHref === href ? 'page' : undefined}
                      className={`
                        group flex items-center justify-between
                        w-full px-3.5 py-3.5 rounded-xl
                        border-none cursor-pointer font-medium
                        text-[0.9375rem] text-left outline-none
                        transition-all duration-150
                        focus-visible:ring-2 focus-visible:ring-blue-400/50
                        ${activeHref === href
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'bg-transparent text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                        }
                      `}
                    >
                      <span>{label}</span>
                      <ArrowRight />
                    </button>
                  </div>
                ))}

                {/* Separator */}
                <div
                  className="h-px mx-1 my-2 bg-gradient-to-r from-blue-100 to-transparent"
                  aria-hidden="true"
                  style={staggerStyle(NAV_LINKS.length + 1)}
                />

                {/* Products */}
                <div
                  className="nb-animate-drawer"
                  style={staggerStyle(NAV_LINKS.length + 2)}
                >
                  <span className="
                    block text-[0.6875rem] font-bold tracking-[0.09em] uppercase
                    text-gray-400 px-3.5 pt-3 pb-2
                  ">
                    View Products
                  </span>

                  {PRODUCT_LINKS.map((p) => (
                    <button
                      key={p.action}
                      type="button"
                      onClick={() => handleProduct(p.action)}
                      className={`
                        group flex items-start gap-3 w-full
                        px-3.5 py-3 mb-1 rounded-xl
                        border cursor-pointer text-left outline-none
                        transition-all duration-150
                        focus-visible:ring-2 focus-visible:ring-blue-400/50
                        ${p.featured
                          ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200'
                          : 'bg-transparent border-transparent hover:bg-blue-50'
                        }
                      `}
                    >
                      <span className={`
                        flex-shrink-0 mt-0.5
                        ${p.featured ? 'text-blue-600' : 'text-blue-500'}
                      `}>
                        {p.icon}
                      </span>
                      <span className="flex flex-col min-w-0">
                        <span className={`
                          text-[0.9375rem] font-semibold leading-snug mb-0.5
                          ${p.featured ? 'text-blue-700' : 'text-slate-800'}
                        `}>
                          {p.label}
                        </span>
                        <span className="text-[0.8125rem] font-normal text-slate-500 leading-snug">
                          {p.subtitle}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="h-2" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}