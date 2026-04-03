// App.jsx
import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Navbar        from './components/Navbar';
import HeroSection   from './components/HeroSection';
import DNA3DSection  from './components/DNA3DSection';
import Mammogram     from './components/Mammogram';
import ProblemSection     from './components/ProblemSection';
import SolutionSection    from './components/SolutionSection';
import CaseStudySection   from './components/CaseStudySection';
import TeamSection        from './components/TeamSection';
import CTASection         from './components/CTASection';
import Footer             from './components/Footer';
import LiquidBiopsySection from './components/LiquidBiopsySection';
import Demo               from './components/Demo';
import LBdemo             from './components/Lbdemo';

/* ── Navbar height token — change once here ── */
const NAV_H = 108; // px  (matches .nb-bar height: 108px in Navbar.jsx)

/* ─────────────────────────────────────────────
   Section anchor helper
   Usage: <Section id="mammogram"> … </Section>
   Renders a zero-height anchor that sits above
   the visible top edge so the navbar doesn't
   cover the heading when scrolled into view.
───────────────────────────────────────────── */
function Section({ id, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <span
        id={id}
        style={{
          position: 'absolute',
          top: `-${NAV_H + 16}px`,
          display: 'block',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ onNavigate }) {
  const location = useLocation();
  const didMount = useRef(false);

  useEffect(() => {
    const params  = new URLSearchParams(location.search);
    const section = params.get('section') || location.hash?.replace('#', '');

    // On first mount with no target → ensure we're at the top
    if (!section || section === 'home') {
      if (!didMount.current) window.scrollTo({ top: 0, behavior: 'auto' });
      didMount.current = true;
      return;
    }

    didMount.current = true;

    // Small delay so the DOM is fully painted before we scroll
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
    return () => cancelAnimationFrame(raf);
  }, [location.search, location.hash]);

  return (
    <main
      className="min-h-screen bg-white"
      /* push content below the fixed navbar */
      style={{ paddingTop: NAV_H }}
    >
      {/* Hero — occupies full viewport height naturally */}
      <div id="home">
        <HeroSection onNavigate={onNavigate} />
      </div>

      {/* Breathing room */}
      <div style={{ height: '8rem', background: '#fff' }} />

      <DNA3DSection />

      <Section id="mammogram">
        <Mammogram />
      </Section>

      <Section id="liquid-biopsy">
        <LiquidBiopsySection />
      </Section>

      <ProblemSection />

      <Section id="solution">
        <SolutionSection />
      </Section>

      <Section id="case-study">
        <CaseStudySection />
      </Section>

      <Section id="team">
        <TeamSection />
      </Section>

      <Section id="cta">
        <CTASection onNavigate={onNavigate} />
      </Section>

      <Footer />
    </main>
  );
}

/* ─────────────────────────────────────────────
   INNER APP
───────────────────────────────────────────── */
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage =
    location.pathname === '/Book-LB' ? 'lb'   :
    location.pathname === '/demo'    ? 'demo' : 'home';

  const handleNavigate = (to) => {
    switch (to) {
      case 'demo':
        navigate('/demo');
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      case 'lb':
        navigate('/Book-LB');
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      case 'home':
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      default: {
        // Section scroll target
        if (location.pathname !== '/') {
          navigate(`/?section=${to}`);
        } else {
          requestAnimationFrame(() => {
            const el = document.getElementById(to);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
        break;
      }
    }
  };

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <Routes>
        <Route
          path="/"
          element={<HomePage onNavigate={handleNavigate} />}
        />

        <Route
          path="/demo"
          element={
            <div
              className="min-h-screen bg-gray-50"
              style={{ paddingTop: NAV_H }}
            >
              <Demo />
            </div>
          }
        />

        <Route
          path="/Book-LB"
          element={
            <div style={{ paddingTop: NAV_H }}>
              <LBdemo onBack={() => handleNavigate('home')} />
            </div>
          }
        />

        <Route
          path="*"
          element={<NotFound onNavigate={handleNavigate} />}
        />
      </Routes>
    </>
  );
}

/* ─────────────────────────────────────────────
   404
───────────────────────────────────────────── */
function NotFound({ onNavigate }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4"
      style={{ fontFamily: "'DM Sans', sans-serif", paddingTop: NAV_H }}
    >
      <span className="text-6xl mb-6" role="img" aria-label="microscope">🔬</span>
      <h1
        className="text-5xl font-bold text-slate-900 mb-3 tracking-tight"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        404
      </h1>
      <p className="text-slate-400 text-sm mb-8 text-center max-w-xs leading-relaxed">
        This page doesn't exist. Head back to the platform.
      </p>
      <button
        onClick={() => onNavigate('home')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '12px 28px', borderRadius: 12,
          background: '#2563eb', color: '#fff',
          fontSize: '0.9375rem', fontWeight: 600,
          border: 'none', cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)';
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}