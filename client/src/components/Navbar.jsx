// Navbar.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  {
    label: 'Home',
    href: '#home',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="17" height="17" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'AI Mammogram Analysis',
    href: '#mammogram',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="17" height="17" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    label: 'AI Blood-Based cancer Test',
    href: '#liquid-biopsy',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="17" height="17" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 0-6.5 6.8-6.5 11a6.5 6.5 0 0 0 13 0C18.5 9.8 12 3 12 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 15.5a4 4 0 0 0 4 3" />
      </svg>
    ),
  },
  {
    label: 'Research',
    href: '#case-study',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" />
        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
      </svg>
    ),
  },
  {
    label: 'Team',
    href: '#team',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="17" height="17" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: '#cta',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="17" height="17" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const PRODUCT_LINKS = [
  {
    label: 'Book Liquid Biopsy Demo',
    action: 'book-lb',
    featured: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
  {
    label: 'View Liquid Biopsy Demo',
    action: 'view-lb',
    featured: false,
    icon: (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: 'Book MammoAI Demo',
    action: 'book-mammo',
    featured: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
  {
    label: 'View MammoAI Demo',
    action: 'view-mammo',
    featured: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

const NAVBAR_HEIGHT = 108;
const SCROLL_OFFSET = NAVBAR_HEIGHT + 8;

// ─── Minimal CSS ──────────────────────────────────────────────────────────────

const STYLE_ID = 'nb-minimal-styles';

function injectMinimalStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  if (!document.getElementById('nb-gf')) {
    const link = document.createElement('link');
    link.id = 'nb-gf';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap';
    document.head.appendChild(link);
  }

  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    html { scroll-padding-top: ${SCROLL_OFFSET}px; }

    .nb-font { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; }

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

    @keyframes nbDropdownIn {
      from { opacity: 0; transform: scale(0.95) translateY(-8px); }
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

    .nb-animate-dropdown   { animation: nbDropdownIn  0.2s  cubic-bezier(0.16,1,0.3,1) both; }
    .nb-animate-drawer     { animation: nbDrawerIn    0.28s cubic-bezier(0.16,1,0.3,1) both; }
    .nb-animate-drawer-out { animation: nbDrawerOut   0.2s  cubic-bezier(0.4,0,1,1)   both; }
    .nb-animate-fade-in    { animation: nbFadeIn      0.25s ease both; }
    .nb-animate-fade-out   { animation: nbFadeOut     0.2s  ease both; }
    .nb-badge-dot          { animation: nbPulse       2s    ease infinite; }

    .nb-drawer-scroll {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }

    body.nb-locked {
      overflow: hidden !important;
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
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      strokeWidth="2" stroke="currentColor"
      width="13" height="13" aria-hidden="true"
      className={`transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : 'rotate-0'}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="currentColor"
      width="16" height="16" aria-hidden="true"
      className="opacity-30 flex-shrink-0 transition-opacity duration-150 group-hover:opacity-60"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="currentColor"
      width="16" height="16" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

function DesktopDropdown({ onAction, onClose, triggerRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const DELAY = 80;
    let timer;

    function onPointerDown(e) {
      const inPanel   = panelRef.current   && panelRef.current.contains(e.target);
      const inTrigger = triggerRef.current && triggerRef.current.contains(e.target);
      if (!inPanel && !inTrigger) onClose();
    }

    timer = setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown, true);
    }, DELAY);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [onClose, triggerRef]);

  return (
    <>
      {/* Invisible gap bridge */}
      <div aria-hidden="true" className="absolute left-0 right-0" style={{ top: '100%', height: 12 }} />

      <div
        ref={panelRef}
        id="nb-dd-panel"
        role="menu"
        aria-label="Products"
        className="
          nb-animate-dropdown
          absolute top-[calc(100%+10px)] right-0
          min-w-[330px] z-[10001]
          bg-white rounded-2xl
          border border-blue-100
          shadow-[0_4px_6px_-1px_rgba(0,0,0,0.07),0_20px_50px_rgba(37,99,235,0.13)]
          p-2
        "
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
    </>
  );
}

// ─── Body scroll lock ─────────────────────────────────────────────────────────

function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const scrollY    = window.scrollY;
    const prevOver   = document.body.style.overflow;
    const prevPR     = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow     = 'hidden';
    document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow     = prevOver;
      document.body.style.paddingRight = prevPR;
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
  const isDemoPage   = currentPage === 'demo' || currentPage === 'mammo' || currentPage === 'lb';

  useBodyScrollLock(menuOpen);

  const navigate = useCallback((page) => {
    if (typeof onNavigate === 'function') onNavigate(page);
  }, [onNavigate]);

  const closeMenu = useCallback(() => {
    setMenuClosing(true);
    setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 220);
  }, []);

  // rAF-throttled scroll
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

  useEffect(() => {
    setMenuOpen(false);
    setMenuClosing(false);
    setDdOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Escape') return;
      if (ddOpen)   { setDdOpen(false); return; }
      if (menuOpen) { closeMenu();      return; }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [ddOpen, menuOpen, closeMenu]);

  useEffect(() => {
    if (currentPage !== 'home') return;
    const target = sessionStorage.getItem('nb-scroll-target');
    if (!target) return;
    sessionStorage.removeItem('nb-scroll-target');
    requestAnimationFrame(() => {
      setTimeout(() => smoothScrollToId(target), 120);
    });
  }, [currentPage]);

  const handleNavClick = useCallback((href) => {
    const id = href.slice(1);
    closeMenu();
    if (isDemoPage) {
      navigate('home');
      if (id !== 'home') sessionStorage.setItem('nb-scroll-target', id);
    } else {
      setTimeout(() => smoothScrollToId(id), 30);
    }
  }, [isDemoPage, navigate, closeMenu]);

  const handleLogo = useCallback(() => {
    closeMenu();
    if (isDemoPage) {
      navigate('home');
    } else {
      setTimeout(() => smoothScrollToId('home'), 30);
    }
  }, [isDemoPage, navigate, closeMenu]);

  const handleProduct = useCallback((action) => {
    setDdOpen(false);
    closeMenu();
    setTimeout(() => {
      if      (action === 'book-lb')    navigate('lb');
      else if (action === 'view-lb')    navigate('demo');
      else if (action === 'book-mammo') navigate('mammo');
      else if (action === 'view-mammo') window.open('https://oncotraceai.org/mammo-demo/ui', '_blank', 'noopener,noreferrer');
    }, 50);
  }, [navigate, closeMenu]);

  const toggleDd = useCallback(() => {
    setDdOpen((prev) => !prev);
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
    } else {
      setMenuOpen(true);
      setDdOpen(false);
    }
  }, [menuOpen, closeMenu]);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const staggerStyle = useCallback((i) =>
    prefersReducedMotion ? {} : { animationDelay: `${i * 35}ms` }
  , [prefersReducedMotion]);

  const showDrawer = menuOpen || menuClosing;

  const getDemoLabel = () => {
    if (currentPage === 'demo')  return 'LB Demo Mode';
    if (currentPage === 'lb')    return 'LB Booking';
    if (currentPage === 'mammo') return 'Mammo Booking';
    return 'Demo Mode';
  };

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
                src="/logo.png"
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
                    {getDemoLabel()}
                  </span>
                </li>
              ) : (
                NAV_LINKS.map(({ label, href, icon }) => (
                  <li key={href}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(href)}
                      aria-current={activeHref === href ? 'page' : undefined}
                      className={`
                        nb-nav-btn
                        relative border-none cursor-pointer font-medium
                        text-[0.8125rem] px-2.5 py-[7px] rounded-lg
                        outline-none whitespace-nowrap
                        inline-flex items-center gap-1.5
                        transition-colors duration-200
                        focus-visible:ring-2 focus-visible:ring-blue-400/50
                        ${activeHref === href
                          ? 'nb-active text-blue-700 font-semibold bg-blue-50'
                          : 'text-slate-600 bg-transparent hover:bg-blue-50 hover:text-blue-700'
                        }
                      `}
                    >
                      {/* Icon — inherits button colour automatically */}
                      <span className={`
                        flex-shrink-0 transition-colors duration-200
                        ${activeHref === href
                          ? 'text-blue-600'
                          : 'text-blue-400/80'
                        }
                      `}>
                        {icon}
                      </span>
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
                  flex items-center gap-2 border-none cursor-pointer
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
                    flex items-center gap-2 border-none cursor-pointer
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

          {/* ── Scroll progress bar ── */}
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
                {isDemoPage ? getDemoLabel() : 'Navigate'}
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
                      flex items-center justify-center gap-2
                      w-full py-3.5 px-4 rounded-xl border cursor-pointer
                      text-[0.9375rem] font-semibold text-center outline-none
                      bg-gray-50 text-gray-700 border-gray-200
                      hover:bg-gray-100 active:bg-gray-200 active:scale-[0.99]
                      transition-all duration-150
                      focus-visible:ring-2 focus-visible:ring-blue-400/50
                    "
                  >
                    <ArrowLeft />
                    Back to Home
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Nav links */}
                {NAV_LINKS.map(({ label, href, icon }, i) => (
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
                      <span className="flex items-center gap-3">
                        <span className={`
                          flex-shrink-0 transition-colors duration-150
                          ${activeHref === href
                            ? 'text-blue-600'
                            : 'text-blue-400/80 group-hover:text-blue-500'
                          }
                        `}>
                          {icon}
                        </span>
                        {label}
                      </span>
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

                {/* Products section */}
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