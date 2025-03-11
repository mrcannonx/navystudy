"use client"

import { Clock, Calculator, Info, FileText, CheckCircle2, HelpCircle } from "lucide-react"
import { Container } from "@/components/ui/container"

export function PMAInfoSection() {
  return (
    <div className="w-full bg-[rgb(249,250,251)] dark:bg-gray-900 py-16">
      <Container>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-8 slide-in">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm">
              <Info className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">PMA Information Guide</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Understanding Your PMA Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 pma-card fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <Info className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Understanding Your PMA</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Your Performance Mark Average (PMA) uses only the Promotion Recommendation block (Block 45)
                  from evaluations in the current paygrade.
                </p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Only evaluations in your current paygrade count
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Use evaluations within the timeframe specified by the NAVADMIN
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Block 45 is the only part of the evaluation used for PMA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Timeframes Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 pma-card fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Evaluation Timeframes</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Different paygrades have different evaluation periods that count toward advancement.
                </p>
                
                <div className="space-y-3 pt-2">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-medium text-blue-600 dark:text-blue-300">E4</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Past 8 to 9 months of evaluations
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-medium text-purple-600 dark:text-purple-300">E5</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Past 14 to 15 months of evaluations
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-medium text-green-600 dark:text-green-300">E6 and E7</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Past 36 months of evaluations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Method Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 pma-card fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Calculation Method</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300">
                  Block 45 marks are added together, then divided by the number of evaluations
                  used in the computation.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mt-2">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-200">Example Calculation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        If you have three evaluations with Block 45 scores of 3.8, 3.6, and 3.6:
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border mt-2 font-mono text-sm">
                        PMA = (3.8 + 3.6 + 3.6) ÷ 3 = 3.67
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Always verify the current advancement cycle NAVADMIN for specific timeframes and requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
