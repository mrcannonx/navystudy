"use client"

import React, { useState } from 'react'
import { Database, Save, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { ClientInput } from "@/components/ui/client-input"
import { RSCACalculatorData } from "../../types"
import { useRSCACalculations } from '../hooks/use-rsca-calculations'
import { useAuth } from "@/contexts/auth/auth-context"

interface RSCASaveTabProps {
  currentData: RSCACalculatorData
  onSaveSuccessAction: () => void
}

/**
 * Component for the "Save" tab in the RSCA saved calculations modal
 */
export function RSCASaveTab({
  currentData,
  onSaveSuccessAction
}: RSCASaveTabProps) {
  const { user } = useAuth()
  const [saveName, setSaveName] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  const { calculations, isLoading, saveCalculation } = useRSCACalculations()
  
  const handleSave = async () => {
    if (!user) {
      setSaveMessage("You must be signed in to save calculations")
      return
    }
    
    if (!saveName.trim()) {
      setSaveMessage("Please enter a name for your calculation")
      return
    }
    
    // Check if name already exists
    const existingCalculation = calculations.find(calc =>
      calc.name.toLowerCase() === saveName.trim().toLowerCase()
    )
    
    if (existingCalculation) {
      if (!confirm(`A calculation named "${saveName}" already exists. Do you want to overwrite it?`)) {
        return
      }
    }
    
    // Save the calculation
    const result = await saveCalculation(saveName.trim(), currentData)
    
    if (result) {
      setSaveMessage(`"${saveName}" ${existingCalculation ? 'updated' : 'saved'} successfully!`)
      
      // Show success animation
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      
      setSaveName("")
      onSaveSuccessAction()
      
      // Clear success message after delay
      setTimeout(() => {
        setSaveMessage("")
      }, 3000)
    } else {
      setSaveMessage("Failed to save calculation. Please try again.")
    }
  }
  
  if (!user) {
    return (
      <div className="text-center py-10 px-4">
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Database className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Sign in to save calculations</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          You need to be signed in to save and load calculations.
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
        <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>Enter a name for your current RSCA calculation to save it to the database.</span>
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <ClientInput
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Enter a name for this calculation"
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Database className="h-5 w-5" />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!saveName.trim() || isLoading}
          className={`px-5 py-3 ${saveSuccess ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <span>Saving...</span>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>
                {calculations.some(calc => calc.name.toLowerCase() === saveName.trim().toLowerCase())
                  ? 'Update Existing'
                  : 'Save New'}
              </span>
            </>
          )}
        </button>
      </div>
      
      {/* Success Message */}
      {saveMessage && (
        <div className={`${saveMessage.includes("successfully") || saveMessage.includes("loaded") ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"} p-3 rounded-lg mt-2 text-sm flex items-center gap-2 animate-fadeIn`}>
          {saveMessage.includes("successfully") || saveMessage.includes("loaded") ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{saveMessage}</span>
        </div>
      )}
    </div>
  )
}