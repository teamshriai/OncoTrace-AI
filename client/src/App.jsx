import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DNA3DSection from "./components/DNA3DSection";
import Mammogram from "./components/Mammogram";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import ImpactSection from "./components/ImpactSection";
import CaseStudySection from "./components/CaseStudySection";
import PartnersSection from "./components/PartnersSection";
import TeamSection from "./components/TeamSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import LiquidBiopsySection from "./components/LiquidBiopsySection";

export default function App() {
  return (
    <div className="min-h-screen bg-white antialiased scroll-smooth">
      <Navbar />
      <main>
        <HeroSection />

        <div className="h-32 bg-white" />

        <DNA3DSection />

        <div className="relative">
          <span id="mammogram" className="absolute -top-24 block" aria-hidden="true" />
          <Mammogram />
        </div>

        <ProblemSection />

        <div className="relative">
          <span id="solution" className="absolute -top-24 block" aria-hidden="true" />
          <SolutionSection />
        </div>

        <div className="relative">
          <span id="liquid-biopsy" className="absolute -top-24 block" aria-hidden="true" />
          <LiquidBiopsySection />
        </div>

        <div className="relative">
          <span id="impact" className="absolute -top-24 block" aria-hidden="true" />
          <ImpactSection />
        </div>

        <div className="relative">
          <span id="case-study" className="absolute -top-24 block" aria-hidden="true" />
          <CaseStudySection />
        </div>

        <div className="relative">
          <span id="partners" className="absolute -top-24 block" aria-hidden="true" />
          <PartnersSection />
        </div>

        <div className="relative">
          <span id="team" className="absolute -top-24 block" aria-hidden="true" />
          <TeamSection />
        </div>

        <div className="relative">
          <span id="cta" className="absolute -top-24 block" aria-hidden="true" />
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}