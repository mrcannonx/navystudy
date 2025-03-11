"use client"

import { Footer } from "../../components/footer"
import { DashboardHero } from "../../components/sections/dashboard/DashboardHero"
import { DashboardFeatures } from "../../components/sections/dashboard/DashboardFeatures"
import { DashboardTestimonials } from "../../components/sections/dashboard/DashboardTestimonials"
import { DashboardPricing } from "../../components/sections/dashboard/DashboardPricing"
import { DashboardCTA } from "../../components/sections/dashboard/DashboardCTA"
import { DashboardNavigation } from "../../components/sections/dashboard/DashboardNavigation"

export default function DashboardLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      <DashboardHero />
      <DashboardFeatures />
      <DashboardTestimonials />
      <DashboardPricing />
      <DashboardCTA />
      <Footer />
    </div>
  )
}