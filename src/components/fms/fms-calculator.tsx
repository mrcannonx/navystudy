"use client"

import { useState } from "react"
import { FMSFormData, TooltipKey } from "./types"
import { getInitialFormData } from "./calculator-utils"
import { ScoreDashboard } from "./score-dashboard"
import { CalculatorForm } from "./calculator-form"
import { Tooltips } from "./tooltips"
import { FMSInfo } from "./fms-info"
import { SavedCalculationsModal } from "./saved-calculations-modal"
import { RSCACalculator } from "./rsca-calculator"
import { AlertTriangle, Info, Award, Save, Database, Calculator } from "lucide-react"
import { getCycleOptions } from "./constants"
export function FMSCalculator() {
  const [activeTooltip, setActiveTooltip] = useState<TooltipKey | null>(null)
  const [formData, setFormData] = useState<FMSFormData>(getInitialFormData())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showRSCACalculator, setShowRSCACalculator] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    // If changing paygrade, check if we need to show/hide RSCA calculator
    // and update the cycle options
    if (field === "prospectivePaygrade") {
      setShowRSCACalculator(value === "E6" || value === "E7")
      
      // Get appropriate cycle options for the selected paygrade
      const cycleOptions = getCycleOptions(value)
      
      // Set a default cycle for the selected paygrade
      const defaultCycle = value === "E7"
        ? cycleOptions.find(c => c.includes("Jan 2025")) || cycleOptions[0]
        : cycleOptions.find(c => c.includes("Mar 2025")) || cycleOptions[0]
      
      // Update form data with new paygrade and appropriate cycle
      setFormData(prev => {
        return {
          ...prev,
          prospectivePaygrade: value as "E5" | "E6" | "E7", // Cast to Paygrade type
          cycle: defaultCycle
        };
      });
      
      return // Skip the default update below since we've already updated
    }
    
    // Default update for other fields
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFormData(getInitialFormData())
    setShowRSCACalculator(false)
  }

  const handleTooltipClick = (key: TooltipKey) => {
    setActiveTooltip(key)
  }
  
  const handleRSCAPMACalculated = (rscaPMA: number) => {
    setFormData(prev => ({ ...prev, rscaPma: rscaPMA.toFixed(2) }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* E4 Alert Box */}
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md mb-6 alert-box">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-300">E4 Alert</h3>
            <p className="text-gray-700 dark:text-gray-300 mt-1">
              E4 advancement is no longer determined by Final Multiple Score, as directed by NAVADMIN 168/23.
            </p>
          </div>
        </div>
      </div>
      
      {/* Two-column layout for advancement info and instructions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Advancement Opportunity Box - Creative Enhancement */}
        <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50 border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-all duration-300 h-full overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/50 dark:bg-blue-800/20 rounded-full -mr-8 -mt-8 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md transform hover:scale-105 transition-transform duration-200">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Advancement Opportunity</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              For E5/6, advancement opportunity is based on quotas vacancies at the next-higher paygrade in your rating or billet based advancement. Some rates have limited quotas; therefore, the Navy advances the most qualified Sailors using the FMS Whole Person Concept.
            </p>
          </div>
        </div>
        
        {/* Calculator Instructions - Creative Enhancement */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 p-6 rounded-xl border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-100/70 dark:bg-blue-800/20 rounded-full -mr-10 -mb-10 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md transform hover:rotate-12 transition-transform duration-200">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">Calculator Instructions</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Select an element name to view the choices/constraints for that element. If you want to learn more about calculating your final multiple score, press the help button on each of the parameters to find out more about them.
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full mx-auto">
        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50 shadow-md">
          <ScoreDashboard formData={formData} />
          
          <div className="mt-6 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <CalculatorForm
                formData={formData}
                onInputChange={handleInputChange}
                onReset={handleReset}
                onTooltipClick={handleTooltipClick}
                onSaveLoadClick={() => setIsModalOpen(true)}
              />

              {/* RSCA PMA Calculator for E6 and E7 */}
              {showRSCACalculator && (
                <div className="mt-8 border-t pt-8">
                  <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      RSCA PMA Calculator Required
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      For {formData.prospectivePaygrade} advancement, you need to calculate your RSCA PMA using the calculator below.
                      The calculated RSCA PMA will be used in your Final Multiple Score calculation.
                    </p>
                  </div>
                  
                  <RSCACalculator
                    onRSCAPMACalculated={handleRSCAPMACalculated}
                    onTooltipClick={handleTooltipClick}
                  />
                </div>
              )}

              <Tooltips
                activeTooltip={activeTooltip}
                onClose={() => setActiveTooltip(null)}
              />
            </div>
            
            {/* Saved Calculations Modal */}
            <SavedCalculationsModal
              isOpen={isModalOpen}
              onCloseAction={() => setIsModalOpen(false)}
              currentFormData={formData}
              onLoadAction={(savedData: FMSFormData) => setFormData(savedData)}
            />
          </div>
        </div>
      </div>

      <FMSInfo />
    </div>
  )
}
