"use client"

import { AwardPointsCalculator } from "./award-points-calculator"
import { AwardPointsHero } from "./award-points-hero"
import { AwardPointsInfoSection } from "./award-points-info-section"
import { Container } from "@/components/ui/container"
import { Calculator, ArrowRight, Info, Medal } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AwardPointsCalculatorClient() {
  return (
    <div>
      {/* Enhanced Hero Section */}
      <AwardPointsHero />

      {/* Quick Links Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="#calculator">
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Calculator className="h-4 w-4" />
                <span>Jump to Calculator</span>
              </Button>
            </Link>
            <Link href="#info-guide">
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <Info className="h-4 w-4" />
                <span>Award Points Information</span>
              </Button>
            </Link>
            <Link href="/fms-calculator">
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10"
              >
                <ArrowRight className="h-4 w-4" />
                <span>FMS Calculator</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Calculator Section with Enhanced Container */}
      <div id="calculator" className="py-8 bg-gray-50 dark:bg-gray-900">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="w-full max-w-[1400px] mx-auto mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                    <Medal className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Award Points Calculator</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Calculate your award points accurately for Navy advancement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Component */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 fade-in">
              <AwardPointsCalculator />
            </div>
          </div>
        </Container>
      </div>
      
      {/* Information Section with Enhanced Styling */}
      <div id="info-guide">
        <AwardPointsInfoSection />
      </div>
    </div>
  )
}