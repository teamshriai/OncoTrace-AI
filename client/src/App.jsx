import { useEffect, useState } from 'react';
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

export default function App() {
  // Only two pages:
  const [page, setPage] = useState('home'); // 'home' | 'demo'
  const [targetSection, setTargetSection] = useState('home'); // section id to scroll to on home

  const handleNavigate = (to) => {
    if (to === 'demo') {
      setPage('demo');
      setTargetSection('home');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    // Anything else navigates to HOME + scrolls to a section (or top)
    setPage('home');
    setTargetSection(to || 'home');
  };

  // After rendering HOME, scroll to the requested section
  useEffect(() => {
    if (page !== 'home') return;

    // next frame ensures DOM is mounted before scrolling
    requestAnimationFrame(() => {
      if (targetSection === 'home') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }
      const el = document.getElementById(targetSection);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [page, targetSection]);

  const isDemoPage = page === 'demo';

  return (
    <div className={isDemoPage ? 'min-h-screen bg-gray-950' : 'min-h-screen bg-white'}>
      {/* Always visible */}
      <Navbar currentPage={page} onNavigate={handleNavigate} />

      {isDemoPage ? (
        <Demo />
      ) : (
        <>
          <div className="relative">
            <span id="home" className="absolute top-0 block" aria-hidden="true" />
            <HeroSection onNavigate={handleNavigate} />
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
            <CTASection onNavigate={handleNavigate} />
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}