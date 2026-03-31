import { useState, useEffect, useRef, useCallback } from 'react';

const NAV_LINKS = [
  { label: 'Home',          href: '#home' },
  { label: 'Mammogram',     href: '#mammogram' },
  { label: 'Liquid Biopsy', href: '#LiquidBiopsySection' },
  { label: 'Solution',      href: '#solution' },
  { label: 'Case Study',    href: '#case-study' },
  { label: 'Partners',      href: '#partners' },
  { label: 'Team',          href: '#team' },
  { label: 'Contact',       href: '#cta' },
];

export default function Navbar({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const menuRef = useRef(null);
  const isDemoPage = currentPage === 'demo';

  // Responsive breakpoints
  useEffect(() => {
    const checkBreakpoint = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setIsTablet(w >= 640 && w < 1024);
    };
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  // Close on outside click
  const handleClickOutside = useCallback((e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  // Close on Escape
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleClickOutside, handleEscape]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMobile]);

  // Close menu when page changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPage]);

  // Smooth-scroll to section
  const handleSectionClick = (href) => {
    setIsOpen(false);
    if (isDemoPage) {
      onNavigate('home');
      setTimeout(() => {
        if (href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } else {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Main CTA
  const handleCtaClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    if (isDemoPage) {
      onNavigate('home');
    } else {
      onNavigate('demo');
    }
  };

  // Logo click
  const handleLogoClick = () => {
    setIsOpen(false);
    if (isDemoPage) {
      onNavigate('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Responsive values
  const logoWidth = isMobile ? 160 : isTablet ? 200 : 240;
  const logoHeight = isMobile ? 64 : isTablet ? 80 : 96;
  const logoPad = isMobile ? '0.75rem' : '1.25rem';
  const hamburgerSize = isMobile ? 44 : 48;
  const hamburgerRadius = isMobile ? 14 : 16;
  const barWidth = isMobile ? 16 : 18;
  const menuWidth = isMobile ? 'calc(100vw - 2rem)' : 260;
  const menuRight = isMobile ? '50%' : 0;
  const menuTransformOrigin = isMobile ? 'top center' : 'top right';

  // Panel position: vertically centered relative to viewport,
  // but anchored to the hamburger's right edge
  const panelTopStyle = isMobile
    ? { top: 56 }
    : {
        position: 'fixed',
        top: '50%',
        right: '1.25rem',
        transform: isOpen
          ? 'translateY(-50%) scale(1)'
          : 'translateY(-50%) scale(0.95)',
      };

  return (
    <>
      {/* ═══════════ LOGO CONTAINER — TOP LEFT ═══════════ */}
      <div
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        aria-label="Go to homepage"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLogoClick();
          }
        }}
        style={{
          position: 'fixed',
          top: logoPad,
          left: logoPad,
          zIndex: 99999,
          width: logoWidth,
          height: logoHeight,
          borderRadius: isMobile ? 16 : 20,
          border: '1px solid #e5e7eb',
          background: '#ffffff',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          outline: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(59,130,246,0.12)';
          e.currentTarget.style.borderColor = '#bfdbfe';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.3)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
        }}
      >
        <img
          src="/Logo.png"
          alt="OncoTrace AI"
          style={{
            maxWidth: '150%',
            maxHeight: '150%',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </div>

      {/* ═══════════ HAMBURGER + MENU — TOP RIGHT ═══════════ */}
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: logoPad,
          right: logoPad,
          zIndex: 99999,
        }}
      >
        {/* ── HAMBURGER BUTTON ── */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="nav-dropdown-panel"
          style={{
            width: hamburgerSize,
            height: hamburgerSize,
            borderRadius: hamburgerRadius,
            border: isOpen ? '1.5px solid #bfdbfe' : '1px solid #e5e7eb',
            background: '#ffffff',
            boxShadow: isOpen
              ? '0 8px 30px rgba(59,130,246,0.15)'
              : '0 2px 12px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: 0,
            transition: 'all 0.3s ease',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            position: 'relative',
            zIndex: 2,
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.3)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = isOpen
              ? '0 8px 30px rgba(59,130,246,0.15)'
              : '0 2px 12px rgba(0,0,0,0.06)';
          }}
        >
          <span
            style={{
              display: 'block',
              width: barWidth,
              height: 2,
              borderRadius: 4,
              background: '#3B82F6',
              transition: 'all 0.3s cubic-bezier(0.4,0.2,0.2,1)',
              transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: barWidth,
              height: 2,
              borderRadius: 4,
              background: '#60a5fa',
              transition: 'all 0.3s cubic-bezier(0.4,0.2,0.2,1)',
              opacity: isOpen ? 0 : 1,
              transform: isOpen ? 'scaleX(0)' : 'none',
            }}
          />
          <span
            style={{
              display: 'block',
              width: barWidth,
              height: 2,
              borderRadius: 4,
              background: '#3B82F6',
              transition: 'all 0.3s cubic-bezier(0.4,0.2,0.2,1)',
              transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
            }}
          />
        </button>

        {/* ── MOBILE BACKDROP OVERLAY ── */}
        {isMobile && (
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              opacity: isOpen ? 1 : 0,
              pointerEvents: isOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s ease',
              zIndex: 0,
            }}
          />
        )}

        {/* ── FLOATING DROPDOWN PANEL — CENTERED ON RIGHT WALL ── */}
        <div
          id="nav-dropdown-panel"
          role="navigation"
          aria-label="Main navigation"
          style={
            isMobile
              ? {
                  position: 'fixed',
                  top: `calc(${logoPad} + ${hamburgerSize + 12}px)`,
                  left: '1rem',
                  right: '1rem',
                  width: 'auto',
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #f0f0f5',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen
                    ? 'translateY(0) scale(1)'
                    : 'translateY(-10px) scale(0.95)',
                  pointerEvents: isOpen ? 'auto' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  maxHeight: '75vh',
                  overflowY: 'auto',
                  zIndex: 1,
                  transformOrigin: 'top right',
                }
              : {
                  position: 'fixed',
                  top: '50%',
                  right: logoPad,
                  width: menuWidth,
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #f0f0f5',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen
                    ? 'translateY(-50%) scale(1)'
                    : 'translateY(-50%) scale(0.95)',
                  pointerEvents: isOpen ? 'auto' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  zIndex: 1,
                  transformOrigin: 'center right',
                }
          }
        >
          <div style={{ padding: isMobile ? 6 : 8 }}>
            {/* ── HOME PAGE: Section links ── */}
            {!isDemoPage &&
              NAV_LINKS.map((link, i) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleSectionClick(link.href)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: isMobile ? '12px 16px' : '10px 16px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'transparent',
                    color: '#64748b',
                    fontSize: isMobile ? 14 : 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(12px)',
                    transitionDelay: isOpen ? `${i * 30}ms` : '0ms',
                    fontFamily: 'inherit',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  {link.label}
                </button>
              ))}

            {/* ── DEMO PAGE: Label ── */}
            {isDemoPage && (
              <div
                style={{
                  padding: '12px 16px',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(12px)',
                  transition: 'all 0.25s ease',
                  transitionDelay: isOpen ? '30ms' : '0ms',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: '#3B82F6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 700,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  Demo Mode
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: '#94a3b8',
                    marginTop: 2,
                    lineHeight: 1.4,
                  }}
                >
                  OncoTrack Platform
                </p>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ padding: '0 12px' }}>
            <div style={{ height: 1, background: '#eff6ff' }} />
          </div>

          {/* ── CTA BUTTON ── */}
          <div style={{ padding: isMobile ? '8px 10px 10px' : '8px 12px 12px' }}>
            <button
              type="button"
              onClick={handleCtaClick}
              style={{
                display: 'block',
                width: '100%',
                padding: isMobile ? '13px 0' : '11px 0',
                borderRadius: 12,
                border: isDemoPage ? '1px solid #e2e8f0' : 'none',
                background: isDemoPage ? '#f8fafc' : '#3B82F6',
                color: isDemoPage ? '#475569' : '#ffffff',
                fontSize: isMobile ? 14 : 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
                transitionDelay: isOpen
                  ? `${isDemoPage ? 80 : NAV_LINKS.length * 30 + 60}ms`
                  : '0ms',
                boxShadow: isDemoPage
                  ? 'none'
                  : '0 2px 8px rgba(59,130,246,0.25)',
                fontFamily: 'inherit',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                if (isDemoPage) {
                  e.currentTarget.style.background = '#f1f5f9';
                } else {
                  e.currentTarget.style.background = '#2563EB';
                  e.currentTarget.style.boxShadow =
                    '0 4px 16px rgba(37,99,235,0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (isDemoPage) {
                  e.currentTarget.style.background = '#f8fafc';
                } else {
                  e.currentTarget.style.background = '#3B82F6';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(59,130,246,0.25)';
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 0 0 3px rgba(59,130,246,0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = isDemoPage
                  ? 'none'
                  : '0 2px 8px rgba(59,130,246,0.25)';
              }}
            >
              {isDemoPage ? '← Go to Home' : 'View Demo →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}