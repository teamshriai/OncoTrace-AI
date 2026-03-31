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
  const menuRef = useRef(null);
  const isDemoPage = currentPage === 'demo';

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

  // Close menu when page changes
  useEffect(() => {
    setIsOpen(false);
  }, [currentPage]);

  // Smooth-scroll to section
  const handleSectionClick = (href) => {
    setIsOpen(false);

    if (isDemoPage) {
      // Go home first, then scroll
      onNavigate('home');
      setTimeout(() => {
        if (href === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } else {
      if (href === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Main CTA — View Demo / Go to Home
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

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: '1.25rem',
        right: '1.25rem',
        zIndex: 99999,
      }}
    >
      {/* ═══════════ HAMBURGER BUTTON ═══════════ */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
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
        }}
      >
        {/* Top bar */}
        <span
          style={{
            display: 'block',
            width: 18,
            height: 2,
            borderRadius: 4,
            background: '#3B82F6',
            transition: 'all 0.3s cubic-bezier(0.4,0.2,0.2,1)',
            transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none',
          }}
        />
        {/* Middle bar */}
        <span
          style={{
            display: 'block',
            width: 18,
            height: 2,
            borderRadius: 4,
            background: '#60a5fa',
            transition: 'all 0.3s cubic-bezier(0.4,0.2,0.2,1)',
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'scaleX(0)' : 'none',
          }}
        />
        {/* Bottom bar */}
        <span
          style={{
            display: 'block',
            width: 18,
            height: 2,
            borderRadius: 4,
            background: '#3B82F6',
            transition: 'all 0.3s cubic-bezier(0.4,0.2,0.2,1)',
            transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
          }}
        />
      </button>

      {/* ═══════════ FLOATING DROPDOWN PANEL ═══════════ */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 0,
          width: 240,
          background: '#ffffff',
          borderRadius: 18,
          border: '1px solid #f0f0f5',
          boxShadow: '0 16px 48px rgba(0,0,0,0.10)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div style={{ padding: 8 }}>

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
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(12px)',
                  transitionDelay: isOpen ? `${i * 30}ms` : '0ms',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eff6ff';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
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
                }}
              >
                Demo Mode
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                OncoTrack Platform
              </p>
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div style={{ padding: '0 12px' }}>
          <div style={{ height: 1, background: '#eff6ff' }} />
        </div>

        {/* ── CTA BUTTON — View Demo / Go to Home ── */}
        <div style={{ padding: '8px 12px 12px' }}>
          <button
            type="button"
            onClick={handleCtaClick}
            style={{
              display: 'block',
              width: '100%',
              padding: '11px 0',
              borderRadius: 12,
              border: isDemoPage ? '1px solid #e2e8f0' : 'none',
              background: isDemoPage ? '#f8fafc' : '#3B82F6',
              color: isDemoPage ? '#475569' : '#ffffff',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: isOpen
                ? `${isDemoPage ? 80 : NAV_LINKS.length * 30 + 60}ms`
                : '0ms',
              boxShadow: isDemoPage ? 'none' : '0 2px 8px rgba(59,130,246,0.25)',
              fontFamily: 'inherit',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (isDemoPage) {
                e.currentTarget.style.background = '#f1f5f9';
              } else {
                e.currentTarget.style.background = '#2563EB';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.35)';
              }
            }}
            onMouseLeave={(e) => {
              if (isDemoPage) {
                e.currentTarget.style.background = '#f8fafc';
              } else {
                e.currentTarget.style.background = '#3B82F6';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.25)';
              }
            }}
          >
            {isDemoPage ? '← Go to Home' : 'View Demo →'}
          </button>
        </div>
      </div>
    </div>
  );
}