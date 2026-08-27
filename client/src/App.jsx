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
import Footer             from './components/Footer';
import LiquidBiopsySection from './components/LiquidBiopsySection';
import LiquidBiopsyDemo   from './components/liquidbiopsy';
import Mammodemo          from './components/Mammodemo';
import Blog               from './pages/Blog/Blog';
import BlogPost           from './pages/Blog/BlogPost';

/* ── Navbar height token ──
   Navbar.jsx defines --nav-h responsively (it shrinks on small screens) and
   scrolls/offsets against it; page content below must offset by the same
   var so the fixed header never overlaps it at any breakpoint. */
const NAV_H = 'var(--nav-h, 108px)';

/* ─────────────────────────────────────────────
   Section anchor helper
   Usage: <Section id="mammogram"> … </Section>
   Just carries the id for scroll targeting — the
   fixed-navbar offset itself is applied once,
   globally, via `scroll-padding-top` and
   SCROLL_OFFSET in Navbar.jsx. Baking a second
   offset in here would double-count it and land
   scrolls with a large empty gap under the navbar.
───────────────────────────────────────────── */
function Section({ id, children, className = '' }) {
  return (
    <div id={id} className={`relative ${className}`}>
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
    location.pathname === '/Book-LB'              ? 'lb'    :
    location.pathname === '/demo'                 ? 'demo'  :
    location.pathname === '/mammo-demo'           ? 'mammo' :
    location.pathname === '/blog'                 ? 'blog'  :
    location.pathname.startsWith('/blog/')        ? 'blog'  : 'home';

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
      case 'mammo':
        navigate('/mammo-demo');
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      case 'blog':
        navigate('/blog');
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

  // The liquid biopsy dashboard is a full-screen app experience with its own
  // fixed sidebar/header, not another marketing page — it owns its own chrome
  // (including a working "back to site" button, wired via onBack) rather than
  // sitting underneath the site Navbar. Keeping the global Navbar mounted here
  // put a z-index:10001 element on top of the dashboard's own fixed sidebar,
  // silently intercepting clicks on it.
  const isFullScreenApp = currentPage === 'demo' || currentPage === 'lb';

  return (
    <>
      {!isFullScreenApp && <Navbar currentPage={currentPage} onNavigate={handleNavigate} />}

      <Routes>
        <Route
          path="/"
          element={<HomePage onNavigate={handleNavigate} />}
        />

        <Route
          path="/demo"
          element={<LiquidBiopsyDemo onBack={() => handleNavigate('home')} />}
        />

        <Route
          path="/Book-LB"
          element={<LiquidBiopsyDemo onBack={() => handleNavigate('home')} />}
        />

        <Route
          path="/mammo-demo"
          element={
            <div style={{ paddingTop: NAV_H }}>
              <Mammodemo onBack={() => handleNavigate('home')} />
            </div>
          }
        />

        {/* Blog Routes */}
        <Route
          path="/blog"
          element={<Blog />}
        />

        <Route
          path="/blog/:slug"
          element={<BlogPost />}
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