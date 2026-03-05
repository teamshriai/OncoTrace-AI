import { useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatsSection from './components/StatsSection'
import AboutSection from './components/AboutSection'
import PipelineSection from './components/PipelineSection'
import AIEngineSection from './components/AIEngineSection'
import ServicesSection from './components/ServicesSection'
import SupportSection from './components/SupportSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'



export default function App() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        }),
      { threshold: 0.1 }
    )

    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))

    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <PipelineSection />
        <AIEngineSection />
        <ServicesSection />
        <SupportSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
