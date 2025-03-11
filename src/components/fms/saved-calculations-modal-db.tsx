"use client"

import { useState, useEffect } from "react"
import { FMSFormData } from "./types"
import { calculateFMS } from "./calculator-utils"
import { ClientInput } from "@/components/ui/client-input"
import { Save, Trash2, FolderOpen, X, Database, Clock, Search, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { useCalculatorData } from "@/hooks/use-calculator-data"
import { useAuth } from "@/contexts/auth/auth-context"
import { Button } from "@/components/ui/button"

interface SavedCalculationsModalProps {
  isOpen: boolean
  onCloseAction: () => void
  currentFormData: FMSFormData
  onLoadAction: (data: FMSFormData) => void
}

// Custom styles for the modal tabs
const tabStyles = {
  active: "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium",
  inactive: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
}

export function SavedCalculationsModal({
  isOpen,
  onCloseAction,
  currentFormData,
  onLoadAction
}: SavedCalculationsModalProps) {
  const { user } = useAuth()
  const { 
    savedCalculations, 
    isLoading, 
    saveCalculation, 
    deleteCalculation 
  } = useCalculatorData({ calculatorType: 'fms' })
  
  const [saveName, setSaveName] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save')
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    if (!saveName.trim()) {
      setSaveMessage("Please enter a name for your calculation")
      return
    }

    // Check for duplicate names
    const existingCalculation = savedCalculations.find(calc => 
      calc.name.toLowerCase() === saveName.trim().toLowerCase()
    )
    
    if (existingCalculation) {
      if (!confirm(`A calculation named "${saveName}" already exists. Do you want to overwrite it?`)) {
        return
      }
      
      // Update existing calculation
      const result = await saveCalculation(saveName.trim(), currentFormData)
      
      if (result) {
        setSaveMessage(`"${saveName}" updated successfully!`)
      }
    } else {
      // Create new calculation
      const result = await saveCalculation(saveName.trim(), currentFormData)
      
      if (result) {
        setSaveMessage(`"${saveName}" saved successfully!`)
      }
    }
    
    // Show success animation
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
    
    setSaveName("")
    setActiveTab('load')
    
    // Clear success message after delay
    setTimeout(() => {
      setSaveMessage("")
    }, 3000)
  }

  const handleLoad = (calculation: any) => {
    onLoadAction(calculation.data)
    // Provide visual feedback
    const element = document.getElementById(calculation.id)
    if (element) {
      element.classList.add("bg-green-100", "dark:bg-green-900/30")
      setTimeout(() => {
        element.classList.remove("bg-green-100", "dark:bg-green-900/30")
      }, 1000)
    }
    onCloseAction()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this saved calculation?")) {
      await deleteCalculation(id)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete ALL saved calculations? This cannot be undone.")) {
      savedCalculations.forEach(calc => {
        deleteCalculation(calc.id)
      })
    }
  }

  // Sort and filter calculations
  const getSortedAndFilteredCalculations = () => {
    let filtered = [...savedCalculations]
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(calc =>
        calc.name.toLowerCase().includes(term) ||
        calculateFMS(calc.data).toString().includes(term)
      )
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'newest':
        return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return filtered
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isOpen) return null

  // Get filtered and sorted calculations
  const filteredCalculations = getSortedAndFilteredCalculations()

  // CSS animations
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }

    .animate-slideUp {
      animation: slideUp 0.3s ease-out forwards;
    }
  `;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out animate-slideUp">
        {/* Modal Header - Modern Design */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-xl">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Database className="h-5 w-5" />
            <span>Save & Load Calculations</span>
          </h2>
          <button
            onClick={onCloseAction}
            className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors text-gray-600 dark:text-gray-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modern Tabs with Indicators */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            className={`flex-1 py-3.5 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'save' ? tabStyles.active : tabStyles.inactive
            }`}
            onClick={() => setActiveTab('save')}
          >
            <Save className="h-4 w-4" />
            <span>Save Current</span>
          </button>
          <button
            className={`flex-1 py-3.5 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'load' ? tabStyles.active : tabStyles.inactive
            }`}
            onClick={() => setActiveTab('load')}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Load Saved {savedCalculations.length > 0 && `(${savedCalculations.length})`}</span>
          </button>
        </div>

        {/* Modal Content - Enhanced UI */}
        <div className="p-5 overflow-y-auto flex-grow">
          {!user ? (
            <div className="text-center py-10 px-4">
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Database className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Sign in to save calculations</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You need to be signed in to save and load calculations from the database.
              </p>
              <Button
                onClick={onCloseAction}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto"
              >
                Sign In
              </Button>
            </div>
          ) : activeTab === 'save' ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>Enter a name for your current calculation to save it to the database.</span>
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
                      <span>Save Current</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Success Message - Enhanced */}
              {saveMessage && (
                <div className={`${saveMessage.includes("successfully") ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"} p-3 rounded-lg mt-2 text-sm flex items-center gap-2 animate-fadeIn`}>
                  {saveMessage.includes("successfully") ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span>{saveMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              ) : savedCalculations.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Database className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No saved calculations yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">Save your current calculation to access it later or compare different scenarios.</p>
                  <button
                    onClick={() => setActiveTab('save')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto"
                  >
                    <Save className="h-4 w-4" />
                    <span>Create Your First Saved Calculation</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search and Sort Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-2">
                    <div className="relative flex-grow">
                      <ClientInput
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search saved calculations..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Search className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'name')}
                      className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="name">Sort by Name</option>
                    </select>
                    
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                      title="Clear all saved calculations"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Clear All</span>
                    </button>
                  </div>
                  
                  {/* Results Count */}
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredCalculations.length === savedCalculations.length ? (
                      <span>Showing all {savedCalculations.length} saved calculations</span>
                    ) : (
                      <span>Showing {filteredCalculations.length} of {savedCalculations.length} saved calculations</span>
                    )}
                  </div>
                  
                  {/* Saved Calculations List - Enhanced */}
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 pb-2">
                    {filteredCalculations.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 dark:text-gray-400">No calculations match your search</p>
                      </div>
                    ) : (
                      filteredCalculations.map((calc) => (
                        <div
                          key={calc.id}
                          id={calc.id}
                          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow"
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{calc.name}</h3>
                              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                FMS: {calculateFMS(calc.data)}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Saved on {formatDate(calc.updated_at)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleLoad(calc)}
                              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                              title="Load this calculation"
                            >
                              <FolderOpen className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(calc.id)}
                              className="p-2.5 bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white rounded-lg transition-all duration-200"
                              title="Delete this calculation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer - Enhanced */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <button
            onClick={onCloseAction}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}