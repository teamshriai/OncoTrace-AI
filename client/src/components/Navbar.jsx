// Navbar.jsx
import { useState, useEffect, useRef, useCallback } from 'react';

const NAV_LINKS = [
  { label: 'Home',          href: '#home' },
  { label: 'Mammogram risk-analysis',     href: '#mammogram' },
  { label: 'Blood-Based Cancer Test', href: '#liquid-biopsy' },
  { label: 'Research',      href: '#case-study' },
  { label: 'Team',          href: '#team' },
  { label: 'Contact',       href: '#cta' },
];

const PRODUCT_LINKS = [
  { 
    label: 'Book a Demo',
    subtitle: 'Liquid Biopsy',
    action: 'book-lb',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 1v3M11 1v3M3 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="9.5" r="0.75" fill="currentColor" />
        <circle cx="9" cy="9.5" r="0.75" fill="currentColor" />
        <circle cx="11" cy="9.5" r="0.75" fill="currentColor" />
      </svg>
    ),
    featured: true
  },
  { 
    label: 'View a Demo',
    subtitle: 'Liquid Biopsy',
    action: 'view-lb',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8l3 2-3 2V8z" fill="currentColor" />
      </svg>
    ),
    featured: false
  },
  { 
    label: 'AI-Powered Mammogram',
    subtitle: 'Analysis Platform',
    action: 'mammo',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="1" fill="currentColor" />
        <path d="M13 6h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    featured: false
  },
];

const STYLE_ID = 'navbar-styles-v4';
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
      height: 108px;
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
      position: relative;
      z-index: 10001;
    }
    .nb-logo-btn:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 4px;
    }
    .nb-logo-img {
      height: 100px;
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
      position: relative;
    }
    
    /* ── DROPDOWN BUTTON ── */
    .nb-dropdown {
      position: relative;
    }
    .nb-btn-dropdown {
      border: none;
      background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
      color: #fff; font-family: 'DM Sans', inherit;
      font-size: 0.875rem; font-weight: 600;
      padding: 8px 20px; border-radius: 50px; cursor: pointer;
      transition: all 0.25s ease; outline: none; white-space: nowrap;
      box-shadow: 0 2px 12px rgba(37,99,235,0.30);
      -webkit-tap-highlight-color: transparent;
      display: flex; align-items: center; gap: 6px;
    }
    .nb-btn-dropdown:hover {
      box-shadow: 0 4px 20px rgba(37,99,235,0.45);
      transform: translateY(-1px);
    }
    .nb-btn-dropdown:active { transform: translateY(0) scale(0.98); }
    .nb-btn-dropdown:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.4); }
    
    .nb-dropdown-icon {
      width: 12px; height: 12px;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .nb-dropdown-icon.nb-open {
      transform: rotate(180deg);
    }
    
    /* ── DROPDOWN MENU ── */
    .nb-dropdown-menu {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      background: #fff;
      border-radius: 16px;
      border: 1px solid #e0ecff;
      box-shadow: 
        0 20px 60px rgba(37,99,235,0.12),
        0 8px 24px rgba(0,0,0,0.08),
        0 0 0 1px rgba(37,99,235,0.04);
      min-width: 340px;
      overflow: hidden;
      z-index: 10000;
      transform-origin: top right;
      padding: 8px;
    }
    
    /* Enhanced dropdown item */
    .nb-dropdown-item {
      display: flex; 
      align-items: flex-start;
      gap: 14px;
      width: 100%; 
      padding: 14px 16px;
      border: none; 
      background: transparent;
      cursor: pointer; 
      font-family: 'DM Sans', inherit;
      text-align: left;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none; 
      -webkit-tap-highlight-color: transparent;
      border-radius: 12px;
      position: relative;
    }
    
    .nb-dropdown-item::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 12px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    
    .nb-dropdown-item:hover::before {
      opacity: 1;
    }
    
    .nb-dropdown-item:hover {
      transform: translateX(2px);
    }
    
    .nb-dropdown-item:active {
      transform: translateX(2px) scale(0.98);
    }
    
    .nb-dropdown-item:focus-visible {
      box-shadow: inset 0 0 0 2px rgba(59,130,246,0.5);
    }
    
    .nb-dropdown-item-icon {
      flex-shrink: 0;
      color: #3b82f6;
      transition: all 0.2s ease;
      position: relative;
      z-index: 1;
      margin-top: 2px;
    }
    
    .nb-dropdown-item:hover .nb-dropdown-item-icon {
      color: #1d4ed8;
      transform: scale(1.1);
    }
    
    .nb-dropdown-item-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }
    
    .nb-dropdown-item-label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.3;
      display: block;
      margin-bottom: 2px;
    }
    
    .nb-dropdown-item-subtitle {
      font-size: 0.8125rem;
      font-weight: 400;
      color: #64748b;
      line-height: 1.3;
      display: block;
    }
    
    .nb-dropdown-item:hover .nb-dropdown-item-label {
      color: #1d4ed8;
    }
    
    .nb-dropdown-item:hover .nb-dropdown-item-subtitle {
      color: #475569;
    }
    
    /* Featured item badge */
    .nb-dropdown-item-featured {
      border: 1.5px solid #bfdbfe;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }
    
    .nb-dropdown-item-featured::before {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    }
    
    .nb-dropdown-item-featured .nb-dropdown-item-label {
      color: #1d4ed8;
    }
    
    /* Divider */
    .nb-dropdown-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #e0ecff 50%, transparent 100%);
      margin: 6px 0;
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
      position: relative;
      z-index: 10001;
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
      position: fixed; 
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15,23,42,0.4);
      z-index: 9998;
      -webkit-tap-highlight-color: transparent;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    /* ── DRAWER ── */
    .nb-drawer {
      position: fixed;
      z-index: 9999;
      top: 116px;
      left: 12px; 
      right: 12px;
      background: #fff;
      border-radius: 20px;
      border: 1px solid #e0ecff;
      box-shadow:
        0 20px 60px rgba(37,99,235,0.12),
        0 4px 16px rgba(0,0,0,0.08);
      max-height: calc(100vh - 128px);
      max-height: calc(100dvh - 128px);
      overflow-y: auto;
      overflow-x: hidden;
      transform-origin: top center;
      padding-bottom: env(safe-area-inset-bottom, 8px);
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }

    .nb-di {
      transition: opacity 0.22s ease, transform 0.22s ease;
    }

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
      user-select: none;
    }
    .nb-dl:hover { background: #eff6ff; color: #1d4ed8; }
    .nb-dl:active { background: #dbeafe; }
    .nb-dl.nb-dl-active {
      background: #eff6ff; color: #1d4ed8; font-weight: 600;
    }
    .nb-dl:focus-visible { box-shadow: 0 0 0 3px rgba(59,130,246,0.3); }

    .nb-dcta {
      display: block; width: 100%; padding: 13px;
      border-radius: 12px; border: none; cursor: pointer;
      font-family: 'DM Sans', inherit; font-size: 0.9375rem;
      font-weight: 600; letter-spacing: 0.02em;
      text-align: center; outline: none;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
      -webkit-appearance: none;
      user-select: none;
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

    /* Mobile dropdown section */
    .nb-mobile-dropdown-section {
      padding: 4px;
    }
    .nb-mobile-dropdown-label {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b7280;
      padding: 12px 14px 8px;
      display: block;
      user-select: none;
    }
    
    /* Mobile dropdown item */
    .nb-mobile-dropdown-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      width: 100%;
      padding: 12px 14px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      font-family: 'DM Sans', inherit;
      background: transparent;
      text-align: left;
      transition: all 0.18s ease;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-appearance: none;
      margin-bottom: 4px;
      user-select: none;
    }
    
    .nb-mobile-dropdown-item:hover {
      background: #eff6ff;
    }
    
    .nb-mobile-dropdown-item:active {
      background: #dbeafe;
    }
    
    .nb-mobile-dropdown-item:focus-visible {
      box-shadow: 0 0 0 3px rgba(59,130,246,0.3);
    }
    
    .nb-mobile-dropdown-item-icon {
      flex-shrink: 0;
      color: #3b82f6;
      margin-top: 2px;
    }
    
    .nb-mobile-dropdown-item-content {
      flex: 1;
      min-width: 0;
    }
    
    .nb-mobile-dropdown-item-label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1e293b;
      line-height: 1.3;
      display: block;
      margin-bottom: 2px;
    }
    
    .nb-mobile-dropdown-item-subtitle {
      font-size: 0.8125rem;
      font-weight: 400;
      color: #64748b;
      line-height: 1.3;
      display: block;
    }
    
    .nb-mobile-dropdown-item-featured {
      border: 1.5px solid #bfdbfe;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }
    
    .nb-mobile-dropdown-item-featured .nb-mobile-dropdown-item-label {
      color: #1d4ed8;
    }

    @keyframes nbpulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.75); }
    }
    .nb-dot-pulse { animation: nbpulse 2s infinite; }

    .nb-demo-badge {
      font-size: 0.75rem; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #2563eb; background: #eff6ff;
      padding: 4px 12px; border-radius: 50px;
      border: 1px solid #bfdbfe;
      white-space: nowrap;
    }

    html { scroll-padding-top: 116px; }
    body { overflow-x: hidden; }

    @media (min-width: 1024px) {
      .nb-nav      { display: flex !important; }
      .nb-cta-area { display: flex !important; }
      .nb-hb       { display: none !important; }
    }
    @media (max-width: 1023px) {
      .nb-nav      { display: none !important; }
      .nb-cta-area { display: none !important; }
      .nb-hb       { display: flex !important; }
      .nb-bar { height: 108px; }
      
      /* Mobile dropdown adjustments */
      .nb-dropdown-menu {
        min-width: auto;
        left: 12px;
        right: 12px;
        width: calc(100% - 24px);
      }
    }
    
    @media (max-width: 374px) {
      .nb-dropdown-item-label,
      .nb-mobile-dropdown-item-label {
        font-size: 0.875rem;
      }
      .nb-dropdown-item-subtitle,
      .nb-mobile-dropdown-item-subtitle {
        font-size: 0.75rem;
      }
      .nb-logo-img {
        height: 80px;
      }
    }

    /* Safe area for iOS notch */
    @supports (padding: max(0px)) {
      .nb-bar {
        padding-left: max(1rem, env(safe-area-inset-left));
        padding-right: max(1rem, env(safe-area-inset-right));
      }
      .nb-drawer {
        left: max(12px, env(safe-area-inset-left));
        right: max(12px, env(safe-area-inset-right));
      }
    }

    /* Prevent scrolling issues on iOS */
    @supports (-webkit-touch-callout: none) {
      .nb-drawer {
        max-height: calc(100vh - 128px - env(safe-area-inset-bottom));
      }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .nb-bar {
        border-width: 2px;
      }
      .nb-link:focus-visible,
      .nb-dl:focus-visible,
      .nb-dcta:focus-visible {
        outline: 3px solid;
        outline-offset: 2px;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(s);
}

export default function Navbar({ currentPage, onNavigate }) {
  const [isOpen,        setIsOpen]        = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [activeHref,    setActiveHref]    = useState('#home');
  const [logoError,     setLogoError]     = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  
  const navRef      = useRef(null);
  const drawerRef   = useRef(null);
  const dropdownRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const savedScrollPos = useRef(0);
  
  const isDemoPage = currentPage === 'demo';

  /* ── Scroll: shadow + progress + spy ── */
  useEffect(() => {
    const handle = () => {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Debounce scroll handler for better performance
      scrollTimeoutRef.current = setTimeout(() => {
        const top = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        const max =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        
        setScrolled(top > 8);
        setProgress(max > 0 ? (top / max) * 100 : 0);

        // Active section detection
        let cur = '#home';
        const offset = 120; // Account for navbar height + some buffer
        
        for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
          const { href } = NAV_LINKS[i];
          if (href === '#home') continue;
          
          const id = href.replace('#', '');
          const el = document.getElementById(id);
          
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= offset) {
              cur = href;
              break;
            }
          }
        }
        
        setActiveHref(cur);
      }, 10);
    };

    window.addEventListener('scroll', handle, { passive: true });
    handle();
    
    return () => {
      window.removeEventListener('scroll', handle);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  /* ── Escape key ── */
  useEffect(() => {
    const fn = (e) => { 
      if (e.key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
          e.preventDefault();
          e.stopPropagation();
        }
        if (dropdownOpen) {
          setDropdownOpen(false);
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, dropdownOpen]);

  /* ── Click outside dropdown ── */
  useEffect(() => {
    if (!dropdownOpen) return;
    
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    
    // Use capture phase for better reliability
    document.addEventListener('mousedown', handleClick, true);
    document.addEventListener('touchstart', handleClick, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClick, true);
      document.removeEventListener('touchstart', handleClick, true);
    };
  }, [dropdownOpen]);

  /* ── Body scroll lock with improved mobile handling ── */
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      savedScrollPos.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollPos.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
      
      // Prevent bounce on iOS
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Release body scroll lock
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (savedScrollPos.current !== 0) {
        window.scrollTo(0, savedScrollPos.current);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* ── Close on route/page change ── */
  useEffect(() => { 
    setIsOpen(false);
    setDropdownOpen(false);
  }, [currentPage]);

  /* ── IMPROVED: Smooth scroll / navigate with proper mobile handling ── */
  const scrollTo = useCallback((href) => {
    const id = href.replace('#', '');
    
    // Calculate scroll target BEFORE closing drawer (while body position is still fixed)
    let targetScrollPosition = 0;
    
    if (href !== '#home' && id !== 'home') {
      const el = document.getElementById(id);
      if (el) {
        // Get element position relative to the document
        const navbarHeight = 116;
        const rect = el.getBoundingClientRect();
        // Add saved scroll position because body is fixed
        targetScrollPosition = rect.top + savedScrollPos.current - navbarHeight;
      }
    }
    
    // Close menus
    setIsOpen(false);
    setDropdownOpen(false);
    
    // Wait for drawer to close and body scroll lock to be released
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (isDemoPage) {
          // Navigate to home page first
          onNavigate(id === 'home' ? 'home' : id);
          // Execute scroll after navigation completes
          setTimeout(() => {
            window.scrollTo({
              top: targetScrollPosition,
              behavior: 'smooth'
            });
          }, 150);
        } else {
          // Directly scroll to target
          window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
          });
        }
      }, 50); // Small delay to allow drawer animation to start
    });
  }, [isDemoPage, onNavigate]);

  const handleProductClick = useCallback((action) => {
    // Close all menus
    setDropdownOpen(false);
    setIsOpen(false);
    
    // Small delay to allow UI to update
    setTimeout(() => {
      if (action === 'book-lb') {
        // Book a demo - navigate to liquid biopsy booking
        onNavigate('lb');
      } else if (action === 'view-lb') {
        // View a demo - navigate to liquid biopsy demo
        onNavigate('demo');
      } else if (action === 'mammo') {
        // Mammogram - external link
        window.location.href = 'https://oncotraceai.org/mammo-demo/ui';
      }
    }, 50);
  }, [onNavigate]);

  const handleLogo = useCallback(() => {
    setIsOpen(false);
    setDropdownOpen(false);
    
    if (isDemoPage) {
      onNavigate('home');
    } else {
      // Close drawer first, then scroll
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      });
    }
  }, [isDemoPage, onNavigate]);

  const toggleMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsOpen((prev) => !prev);
    setDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDropdownOpen((prev) => !prev);
  }, []);

  /* ── Stagger delays for drawer items ── */
  const staggerStyle = useCallback((i) => ({
    transitionDelay: isOpen ? `${i * 30}ms` : '0ms',
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateX(0)' : 'translateX(-12px)',
  }), [isOpen]);

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

          {/* Desktop CTA with Dropdown */}
          <div className="nb-cta-area">
            {!isDemoPage ? (
              <div className="nb-dropdown" ref={dropdownRef}>
                <button 
                  className="nb-btn-dropdown" 
                  type="button" 
                  onClick={toggleDropdown}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span>View Products</span>
                  <svg 
                    className={`nb-dropdown-icon${dropdownOpen ? ' nb-open' : ''}`}
                    viewBox="0 0 12 12" 
                    fill="none"
                    aria-hidden="true"
                  >
                    <path 
                      d="M3 4.5L6 7.5L9 4.5" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div 
                    className="nb-dropdown-menu"
                    style={{
                      opacity: dropdownOpen ? 1 : 0,
                      transform: dropdownOpen ? 'scale(1)' : 'scale(0.95)',
                      transition: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {PRODUCT_LINKS.map((product, idx) => (
                      <div key={product.action}>
                        <button
                          className={`nb-dropdown-item${product.featured ? ' nb-dropdown-item-featured' : ''}`}
                          type="button"
                          onClick={() => handleProductClick(product.action)}
                        >
                          <div className="nb-dropdown-item-icon">
                            {product.icon}
                          </div>
                          <div className="nb-dropdown-item-content">
                            <span className="nb-dropdown-item-label">
                              {product.label}
                            </span>
                            <span className="nb-dropdown-item-subtitle">
                              {product.subtitle}
                            </span>
                          </div>
                        </button>
                        {idx < PRODUCT_LINKS.length - 1 && (
                          <div className="nb-dropdown-divider" aria-hidden="true" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="nb-btn-primary" 
                type="button" 
                onClick={() => onNavigate('home')}
              >
                ← Back to Home
              </button>
            )}
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
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Page scroll progress"
          />
        </div>
      </div>

      {/* ══ BACKDROP ══ */}
      {isOpen && (
        <div
          className="nb-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          style={{ 
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none'
          }}
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
        inert={!isOpen ? '' : undefined}
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

          {/* Product Links Section (Mobile) */}
          {!isDemoPage && (
            <>
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

              <div className="nb-di nb-mobile-dropdown-section" style={staggerStyle(NAV_LINKS.length + 2)}>
                <span className="nb-mobile-dropdown-label">View Products</span>
                {PRODUCT_LINKS.map((product) => (
                  <button
                    key={product.action}
                    className={`nb-mobile-dropdown-item${product.featured ? ' nb-mobile-dropdown-item-featured' : ''}`}
                    type="button"
                    onClick={() => handleProductClick(product.action)}
                  >
                    <div className="nb-mobile-dropdown-item-icon">
                      {product.icon}
                    </div>
                    <div className="nb-mobile-dropdown-item-content">
                      <span className="nb-mobile-dropdown-item-label">
                        {product.label}
                      </span>
                      <span className="nb-mobile-dropdown-item-subtitle">
                        {product.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Final divider */}
          {isDemoPage && (
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
          )}

          {/* Back to Home (Demo mode only) */}
          {isDemoPage && (
            <div
              className="nb-di"
              style={staggerStyle(NAV_LINKS.length + 2)}
            >
              <button
                className="nb-dcta nb-dcta-secondary"
                type="button"
                onClick={() => onNavigate('home')}
              >
                ← Back to Home
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}