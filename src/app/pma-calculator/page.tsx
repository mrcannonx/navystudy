"use client"

import { PMACalculator } from "@/components/pma/pma-calculator"
import { PMAHero } from "@/components/pma/pma-hero"
import { PMAInfoSection } from "@/components/pma/pma-info-section"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import { Container } from "@/components/ui/container"
import { Calculator, ArrowRight, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import "./enhanced-styles.css"

export default function PMACalculatorPage() {
  return (
    <PageWithFooter className="bg-[rgb(249,250,251)]">
      {/* Enhanced Hero Section */}
      <PMAHero />

      {/* Quick Links Section */}
      <div className="bg-[rgb(249,250,251)] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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
                <span>PMA Information</span>
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

      {/* Information Section with Enhanced Styling */}
      <div id="info-guide">
        <PMAInfoSection />
      </div>

      {/* Calculator Section with Enhanced Container */}
      <div id="calculator" className="py-8 bg-[rgb(249,250,251)] dark:bg-gray-900">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="w-full max-w-[1400px] mx-auto mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">PMA Calculator</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Calculate your Performance Mark Average for Navy advancement
                    </p>
                  </div>
                  {/* Save button will be shown in the calculator component */}
                </div>
              </div>
            </div>

            {/* Calculator Component */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 fade-in">
              <PMACalculator />
            </div>
          </div>
        </Container>
      </div>
    </PageWithFooter>
  )
}
