import { useState } from "react"
import { PromotionRecommendation, RSCACalculatorData, RSCAEvaluation } from "./types"
import {
  createEmptyEvaluation,
  createEmptyRSCACalculatorData,
  processRSCACalculatorData
} from "./rsca-calculator-utils"
import { ClientInput } from "@/components/ui/client-input"
import { ClientSelect } from "@/components/ui/client-select"
import { TooltipButton } from "./tooltips"
import { Info, Trash, Plus, Calculator, Database, Save } from "lucide-react"
import { RSCASavedCalculationsModal } from "./rsca-saved-calculations-modal"

interface RSCACalculatorProps {
  onRSCAPMACalculated: (rscaPMA: number) => void
  onTooltipClick: (key: "ita" | "rsca") => void
}

export function RSCACalculator({ onRSCAPMACalculated, onTooltipClick }: RSCACalculatorProps) {
  const [calculatorData, setCalculatorData] = useState<RSCACalculatorData>(createEmptyRSCACalculatorData())
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleAddEvaluation = () => {
    setCalculatorData(prev => ({
      ...prev,
      evaluations: [...prev.evaluations, createEmptyEvaluation()]
    }))
  }
  
  const handleRemoveEvaluation = (id: string) => {
    if (calculatorData.evaluations.length <= 1) return
    
    setCalculatorData(prev => ({
      ...prev,
      evaluations: prev.evaluations.filter(evaluation => evaluation.id !== id)
    }))
  }
  
  const handleEvaluationChange = (id: string, field: keyof RSCAEvaluation, value: any) => {
    setCalculatorData(prev => ({
      ...prev,
      evaluations: prev.evaluations.map(evaluation =>
        evaluation.id === id ? { ...evaluation, [field]: value } : evaluation
      )
    }))
  }
  
  const handleCalculate = () => {
    const processedData = processRSCACalculatorData(calculatorData)
    setCalculatorData(processedData)
    onRSCAPMACalculated(processedData.rscaPMA)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">RSCA PMA Calculator</h2>
        <div className="text-2xl font-bold text-blue-600">
          RSCA PMA: {calculatorData.rscaPMA.toFixed(2)}
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-2" />
          How to Calculate RSCA PMA
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Enter your evaluation data from your current paygrade. For each evaluation, you'll need:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
          <li>Evaluation period (From/To dates)</li>
          <li>Promotion Recommendation (EP, MP, P, etc.)</li>
          <li>Individual Trait Average (ITA) - found on your evaluation</li>
          <li>Reporting Senior Cumulative Average (RSCA) - found on your evaluation or in NSIPS</li>
        </ul>
      </div>
      
      <div className="space-y-6">
        {calculatorData.evaluations.map((evaluation, index) => (
          <div key={evaluation.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Evaluation {index + 1}</h3>
              <button 
                onClick={() => handleRemoveEvaluation(evaluation.id)}
                className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                disabled={calculatorData.evaluations.length <= 1}
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">From Date</label>
                <ClientInput
                  type="date"
                  value={evaluation.evalFrom}
                  onChange={(e) => handleEvaluationChange(evaluation.id, "evalFrom", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To Date</label>
                <ClientInput
                  type="date"
                  value={evaluation.evalTo}
                  onChange={(e) => handleEvaluationChange(evaluation.id, "evalTo", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Promotion Recommendation</label>
              <ClientSelect
                value={evaluation.promotionRecommendation}
                onChange={(e) => handleEvaluationChange(
                  evaluation.id,
                  "promotionRecommendation",
                  e.target.value as PromotionRecommendation
                )}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="EP">Early Promote (EP)</option>
                <option value="MP">Must Promote (MP)</option>
                <option value="P">Promotable (P)</option>
                <option value="Progressing">Progressing</option>
                <option value="Significant Problems">Significant Problems</option>
              </ClientSelect>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TooltipButton tooltipKey="ita" onClick={() => onTooltipClick("ita")} />
                  <label className="text-sm font-medium">Individual Trait Average (ITA)</label>
                </div>
                <ClientInput
                  type="number"
                  value={evaluation.ita || ""}
                  onChange={(e) => handleEvaluationChange(
                    evaluation.id, 
                    "ita", 
                    parseFloat(e.target.value) || 0
                  )}
                  min="1.00"
                  max="5.00"
                  step="0.01"
                  placeholder="1.00 - 5.00"
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TooltipButton tooltipKey="rsca" onClick={() => onTooltipClick("rsca")} />
                  <label className="text-sm font-medium">Reporting Senior Cumulative Average (RSCA)</label>
                </div>
                <ClientInput
                  type="number"
                  value={evaluation.rsca || ""}
                  onChange={(e) => handleEvaluationChange(
                    evaluation.id, 
                    "rsca", 
                    parseFloat(e.target.value) || 0
                  )}
                  min="1.00"
                  max="5.00"
                  step="0.01"
                  placeholder="1.00 - 5.00"
                  className="w-full"
                />
              </div>
            </div>
            
            {evaluation.rscaEvalValue > 0 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800/50">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Points Above RSCA:</span>
                    <span className="ml-2 font-semibold">{evaluation.pointsAboveRSCA.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Additional Points:</span>
                    <span className="ml-2 font-semibold">{evaluation.additionalPoints.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">RSCA Eval Value:</span>
                    <span className="ml-2 font-semibold">{evaluation.rscaEvalValue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddEvaluation}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Evaluation</span>
          </button>
          
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            <span>Calculate RSCA PMA</span>
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save/Load</span>
          </button>
        </div>
        
        {/* Saved Calculations Modal */}
        <RSCASavedCalculationsModal
          isOpen={isModalOpen}
          onCloseAction={() => setIsModalOpen(false)}
          currentCalculatorData={calculatorData}
          onLoadAction={(loadedData: RSCACalculatorData) => {
            setCalculatorData(loadedData);
            onRSCAPMACalculated(loadedData.rscaPMA);
          }}
        />
      </div>
    </div>
  )
}