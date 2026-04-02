import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DNA3DSection from './components/DNA3DSection';
import Mammogram from './components/Mammogram';
import ProblemSection from './components/ProblemSection';
import SolutionSection from './components/SolutionSection';
import CaseStudySection from './components/CaseStudySection';
import TeamSection from './components/TeamSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import LiquidBiopsySection from './components/LiquidBiopsySection';
import Demo from './components/Demo';
import LBdemo from './components/Lbdemo';
import Mirai from './components/Mamosdemo';

/* ─────────────────────────────────────────────
   HOME PAGE
   All sections live here. Accepts ?section=xxx
   query param OR hash for smooth-scroll targets.
───────────────────────────────────────────── */
function HomePage({ onNavigate }) {
  const location = useLocation();

  // Scroll to target section whenever the location changes while on "/"
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section') || location.hash?.replace('#', '');

    requestAnimationFrame(() => {
      if (!section || section === 'home') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <>
        <div className="relative">
          <span id="home" className="absolute top-0 block" aria-hidden="true" />
          <HeroSection onNavigate={onNavigate} />
        </div>

        <div className="h-32 bg-white" />

        <DNA3DSection />

        <div className="relative">
          <span id="mammogram" className="absolute -top-24 block" aria-hidden="true" />
          <Mammogram />
        </div>

        <div className="relative">
          <span id="liquid-biopsy" className="absolute -top-24 block" aria-hidden="true" />
          <LiquidBiopsySection />
        </div>

        <ProblemSection />

        <div className="relative">
          <span id="solution" className="absolute -top-24 block" aria-hidden="true" />
          <SolutionSection />
        </div>

        <div className="relative">
          <span id="case-study" className="absolute -top-24 block" aria-hidden="true" />
          <CaseStudySection />
        </div>

        <div className="relative">
          <span id="team" className="absolute -top-24 block" aria-hidden="true" />
          <TeamSection />
        </div>

        <div className="relative">
          <span id="cta" className="absolute -top-24 block" aria-hidden="true" />
          <CTASection onNavigate={onNavigate} />
        </div>

        <Footer />
      </>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INNER APP — has access to useNavigate
───────────────────────────────────────────── */
function AppInner() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current "page" for Navbar highlight
  const currentPage =
    location.pathname === '/Book-LB'
      ? 'lb'
      : location.pathname === '/Book-Mammo'
      ? 'mammo'
      : location.pathname === '/demo'
      ? 'demo'
      : 'home';

  /**
   * handleNavigate — unified navigation handler passed to all components.
   *
   * Supported targets:
   *   'home'         → /
   *   'demo'         → /demo
   *   'lb'           → /Book-LB
   *   'mammo'        → /Book-Mammo
   *   any section id → /?section=<id>  (scrolls on home)
   */
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
        navigate('/Book-Mammo');
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      case 'home':
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'auto' });
        break;
      default:
        // Section scroll target (e.g. 'mammogram', 'solution', 'team' …)
        if (location.pathname !== '/') {
          navigate(`/?section=${to}`);
        } else {
          // Already on home — just scroll
          requestAnimationFrame(() => {
            const el = document.getElementById(to);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
    }
  };

  return (
    <>
      {/* Navbar is always visible across all routes */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <Routes>
        {/* ── Home ── */}
        <Route
          path="/"
          element={<HomePage onNavigate={handleNavigate} />}
        />

        {/* ── Internal demo page (unchanged) ── */}
        <Route
          path="/demo"
          element={
            <div className="min-h-screen bg-gray-950">
              <Demo />
            </div>
          }
        />

        {/* ── Liquid Biopsy booking ── */}
        <Route
          path="/Book-LB"
          element={
            <LBdemo onBack={() => handleNavigate('home')} />
          }
        />

        {/* ── Mammogram booking ── */}
        <Route
          path="/Book-Mammo"
          element={
            <Mirai onBack={() => handleNavigate('home')} />
          }
        />

        {/* ── 404 fallback — redirect to home ── */}
        <Route
          path="*"
          element={<NotFound onNavigate={handleNavigate} />}
        />
      </Routes>
    </>
  );
}

/* ─────────────────────────────────────────────
   404 PAGE — lightweight, branded
───────────────────────────────────────────── */
function NotFound({ onNavigate }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className="text-6xl mb-6">🔬</span>
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
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 border-none cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT EXPORT — wraps everything in BrowserRouter
───────────────────────────────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}