"use client"

import React from 'react'
import { Database, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth/auth-context"
import { RSCACalculationsList } from './rsca-calculations-list'
import { useRSCACalculations } from '../hooks/use-rsca-calculations'
import { SavedCalculation } from '../types/rsca-calculations'

interface RSCALoadTabProps {
  onLoadAction: (data: any) => void
  onCloseAction: () => void
}

/**
 * Component for the "Load" tab in the RSCA saved calculations modal
 */
export function RSCALoadTab({
  onLoadAction,
  onCloseAction
}: RSCALoadTabProps) {
  const { user } = useAuth()
  const { calculations, isLoading, deleteCalculation, clearAllCalculations } = useRSCACalculations()
  
  // Handle loading a calculation
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
    onCloseAction()
  }
  
  // Handle updating a calculation (load and prepare for save)
  const handleUpdate = (calculation: SavedCalculation) => {
    // This will be handled by the parent component
    onLoadAction(calculation.data)
    // We'll close the modal and let the parent handle the rest
    onCloseAction()
  }
  
  // Handle deleting a calculation
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saved calculation?")) {
      return
    }
    await deleteCalculation(id)
  }
  
  // Handle clearing all calculations
  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to delete ALL saved calculations? This cannot be undone.")) {
      return
    }
    await clearAllCalculations()
  }
  
  // If user is not logged in
  if (!user) {
    return (
      <div className="text-center py-10 px-4">
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Database className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Sign in to load calculations</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          You need to be signed in to save and load calculations from the database.
        </p>
        <Button
          onClick={() => window.location.href = '/auth/signin'}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto"
        >
          Sign In
        </Button>
      </div>
    )
  }
  
  return (
    <RSCACalculationsList
      calculations={calculations}
      isLoading={isLoading}
      onLoadAction={handleLoad}
      onUpdateAction={handleUpdate}
      onDeleteAction={handleDelete}
      onClearAllAction={handleClearAll}
    />
  )
}