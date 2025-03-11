"use client"

import { useAuth } from "@/contexts/auth"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { HowItWorksSection } from "@/components/sections/HowItWorksSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { StudyToolsSection } from "@/components/sections/StudyToolsSection"
import EnhancedEvalBuilderSection from "@/components/sections/enhanced-eval-builder-section"
import { EnhancedCalculatorsSection } from "@/components/sections/EnhancedCalculatorsSection"
import { CTASection } from "@/components/sections/CTASection"

export default function HomePage() {
  const { user } = useAuth()
  
  // Function to scroll to the How NAVY Study Works section
  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-navy-study-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <HeroSection scrollToHowItWorks={scrollToHowItWorks} />
      <FeaturesSection />
      <HowItWorksSection id="how-navy-study-works" />
      <TestimonialsSection />
      <StudyToolsSection />
      <EnhancedEvalBuilderSection />
      <EnhancedCalculatorsSection />
      <CTASection user={user} scrollToHowItWorks={scrollToHowItWorks} />
      <Footer />
    </div>
  )
}
