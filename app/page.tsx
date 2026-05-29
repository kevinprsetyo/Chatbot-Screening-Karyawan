import Hero from '@/components/landing/Hero'
import TrustedBy from '@/components/landing/TrustedBy'
import Deliverables from '@/components/landing/Deliverables'
import Challenges from '@/components/landing/Challenges'
import Benefits from '@/components/landing/Benefits'
import SolutionOverview from '@/components/landing/SolutionOverview'
import HowItWorks from '@/components/landing/HowItWorks'
import PositionCriteria from '@/components/landing/PositionCriteria'
import ExplainableDecision from '@/components/landing/ExplainableDecision'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="bg-white min-h-screen font-sans">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Deliverables />
      <Challenges />
      <Benefits />
      <SolutionOverview />
      <HowItWorks />
      <PositionCriteria />
      <ExplainableDecision />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
