import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DNA3DSection from "./components/DNA3DSection";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import ImpactSection from "./components/ImpactSection";
import CaseStudySection from "./components/CaseStudySection";
import PartnersSection from "./components/PartnersSection";
import TeamSection from "./components/TeamSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <main>
        <HeroSection />

        {/* Smooth dark → white transition bridge */}
        <div className="h-32 bg-white" />

        <DNA3DSection />
        <ProblemSection />
        <SolutionSection />
        <ImpactSection />
        <CaseStudySection />
        <PartnersSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
