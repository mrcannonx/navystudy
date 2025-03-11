"use client"

import { Clock, Calculator, Info, ArrowRight, BarChart3 } from "lucide-react"
import { FeatureCard } from "./feature-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PMAHero() {
  const features = [
    {
      icon: Info,
      title: "Understanding Your PMA",
      description: "Performance Mark Average uses Block 45 from evaluations in your current paygrade"
    },
    {
      icon: Clock,
      title: "Timeframe Specific",
      description: "Different evaluation periods for E4, E5, and E6/E7 advancement"
    },
    {
      icon: Calculator,
      title: "Accurate Calculation",
      description: "Precise computation based on Navy advancement guidelines"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full border-b border-blue-500 shadow-sm">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      {/* Main content container with max width */}
      <div className="relative px-6 pt-12 pb-16 sm:px-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 md:px-16 lg:pt-24 lg:pb-28 lg:px-20">
        <div className="max-w-[76rem] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-white backdrop-blur-sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span>Navy advancement calculator</span>
            </div>
          </div>
          
          {/* Main Hero Section */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white hero-title">
              PMA Calculator
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Calculate your Performance Mark Average accurately for Navy advancement purposes.
              Track your evaluation scores and understand your standing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#calculator">
                <Button
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-white hover:bg-gray-50 text-blue-700 rounded-lg transition-colors text-base font-medium animate-pulse-subtle"
                >
                  <Calculator className="h-5 w-5" />
                  Start Calculating
                </Button>
              </Link>
              
              <Link href="/fms-calculator">
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-transparent hover:bg-blue-600/20 text-white border border-white/30 rounded-lg transition-colors text-base font-medium backdrop-blur-sm"
                >
                  <ArrowRight className="h-5 w-5" />
                  FMS Calculator
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Feature highlights - full width background with constrained content */}
      <div className="bg-gradient-to-b from-transparent to-blue-900/50 backdrop-blur-sm w-full">
        <div className="max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6 pb-12 sm:px-12 sm:pb-16 md:pb-20 md:px-16 lg:pb-24 lg:px-20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <Calculator className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">PMA Calculation</h3>
              <p className="text-sm text-white/80">
                Accurate calculation based on Navy guidelines
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <Clock className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Evaluation Periods</h3>
              <p className="text-sm text-white/80">
                Specific timeframes for each paygrade
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <BarChart3 className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Score Tracking</h3>
              <p className="text-sm text-white/80">
                Monitor your performance trends over time
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <Info className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Advancement Info</h3>
              <p className="text-sm text-white/80">
                Understand how PMA affects your advancement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
