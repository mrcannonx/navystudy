"use client"

import { useState, useEffect } from "react"
import { FMSFormData } from "./types"
import { calculateFMS } from "./calculator-utils"
import { ClientInput } from "@/components/ui/client-input"
import { Save, Trash2, FolderOpen, X } from "lucide-react"

interface SavedCalculation {
  id: string
  name: string
  data: FMSFormData
  savedAt: string
}

interface SavedCalculationsProps {
  currentFormData: FMSFormData
  onLoadAction: (data: FMSFormData) => void
}

export function SavedCalculations({ currentFormData, onLoadAction }: SavedCalculationsProps) {
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([])
  const [saveName, setSaveName] = useState("")
  const [showSavedList, setShowSavedList] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  // Load saved calculations from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("fms-saved-calculations")
    if (savedData) {
      try {
        setSavedCalculations(JSON.parse(savedData))
      } catch (error) {
        console.error("Failed to parse saved calculations:", error)
      }
    }
  }, [])

  // Save calculations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fms-saved-calculations", JSON.stringify(savedCalculations))
    
    // Auto-expand the list when there are saved calculations
    if (savedCalculations.length > 0 && !showSavedList) {
      setShowSavedList(true)
    }
  }, [savedCalculations, showSavedList])

  const handleSave = () => {
    if (!saveName.trim()) {
      alert("Please enter a name for your calculation")
      return
    }

    // Check for duplicate names
    const existingCalculation = savedCalculations.find(calc => calc.name.toLowerCase() === saveName.trim().toLowerCase())
    
    if (existingCalculation) {
      if (!confirm(`A calculation named "${saveName}" already exists. Do you want to overwrite it?`)) {
        return
      }
      
      // Update existing calculation
      setSavedCalculations(prev => prev.map(calc =>
        calc.id === existingCalculation.id
          ? { ...calc, data: { ...currentFormData }, savedAt: new Date().toISOString() }
          : calc
      ))
      
      setSaveMessage(`"${saveName}" updated successfully!`)
    } else {
      // Create new calculation
      const newCalculation: SavedCalculation = {
        id: Date.now().toString(),
        name: saveName.trim(),
        data: { ...currentFormData },
        savedAt: new Date().toISOString()
      }

      setSavedCalculations(prev => [newCalculation, ...prev])
      setSaveMessage(`"${saveName}" saved successfully!`)
    }
    
    setSaveName("")
    setShowSavedList(true)
    
    // Clear success message after delay
    setTimeout(() => {
      setSaveMessage("")
    }, 3000)
  }

  const handleLoad = (calculation: SavedCalculation) => {
    onLoadAction(calculation.data)
    // Provide visual feedback
    const element = document.getElementById(calculation.id)
    if (element) {
      element.classList.add("bg-green-100", "dark:bg-green-900/30")
      setTimeout(() => {
        element.classList.remove("bg-green-100", "dark:bg-green-900/30")
      }, 1000)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this saved calculation?")) {
      setSavedCalculations(prev => prev.filter(calc => calc.id !== id))
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete ALL saved calculations? This cannot be undone.")) {
      setSavedCalculations([])
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Save & Load Calculations</h2>
      
      {/* Save Form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        <ClientInput
          type="text"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Enter a name for this calculation"
          className="flex-grow"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Current</span>
        </button>
      </div>
      
      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-2 rounded-md mb-2 text-sm text-center">
          {saveMessage}
        </div>
      )}

      {/* Toggle Saved List */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowSavedList(!showSavedList)}
          className="flex-grow px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          <span>
            {showSavedList
              ? "Hide Saved Calculations"
              : `Show Saved Calculations${savedCalculations.length > 0 ? ` (${savedCalculations.length})` : ""}`
            }
          </span>
        </button>
        
        {savedCalculations.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-800 dark:text-red-200 rounded-md transition-colors flex items-center justify-center gap-2"
            title="Clear all saved calculations"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      {/* Saved Calculations List */}
      {showSavedList && (
        <div className="mt-4">
          {savedCalculations.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No saved calculations yet</p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {savedCalculations.map((calc) => (
                <div
                  key={calc.id}
                  id={calc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{calc.name}</h3>
                      <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                        FMS: {calculateFMS(calc.data)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Saved on {formatDate(calc.savedAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(calc)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      title="Load this calculation"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(calc.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                      title="Delete this calculation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}