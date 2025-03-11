"use client"

import { useCalculatorData } from "@/hooks/use-calculator-data"
import { useAuth } from "@/contexts/auth/auth-context"
import { RSCACalculatorData } from "../../types"
import { DBCalculatorData, SavedCalculation } from "../types/rsca-calculations"

interface UseRSCACalculationsResult {
  calculations: SavedCalculation[]
  isLoading: boolean
  saveCalculation: (name: string, data: RSCACalculatorData) => Promise<boolean>
  deleteCalculation: (id: string) => Promise<boolean>
  clearAllCalculations: () => Promise<boolean>
}

/**
 * Custom hook for managing RSCA calculations in the database
 */
export function useRSCACalculations(): UseRSCACalculationsResult {
  // Auth context
  const { user } = useAuth()
  
  // Database state via existing hook
  const {
    savedCalculations: dbCalculations,
    isLoading,
    saveCalculation: saveToDb,
    updateCalculation: updateInDb,
    deleteCalculation: deleteFromDb
  } = useCalculatorData({ calculatorType: 'rsca' })
  
  /**
   * Save or update a calculation
   */
  const saveCalculation = async (name: string, data: RSCACalculatorData): Promise<boolean> => {
    if (!name.trim() || !user) return false
    
    try {
      // Check if a calculation with this name already exists
      const existingCalculation = dbCalculations.find(calc =>
        calc.name.toLowerCase() === name.trim().toLowerCase()
      )
      
      let result = null
      
      if (existingCalculation) {
        // Update existing calculation
        result = await updateInDb(existingCalculation.id, {
          name: name.trim(),
          data
        })
      } else {
        // Create new calculation
        result = await saveToDb(name.trim(), data)
      }
      
      return result !== null
    } catch (error) {
      console.error("Failed to save calculation:", error)
      return false
    }
  }
  
  /**
   * Delete a calculation
   */
  const deleteCalculation = async (id: string): Promise<boolean> => {
    if (!user) return false
    
    try {
      return await deleteFromDb(id)
    } catch (error) {
      console.error("Failed to delete calculation:", error)
      return false
    }
  }
  
  /**
   * Clear all calculations
   */
  const clearAllCalculations = async (): Promise<boolean> => {
    if (!user) return false
    
    try {
      const promises = dbCalculations.map(calc => deleteFromDb(calc.id))
      await Promise.all(promises)
      return true
    } catch (error) {
      console.error("Failed to clear all calculations:", error)
      return false
    }
  }
  
  return {
    calculations: dbCalculations as DBCalculatorData[],
    isLoading,
    saveCalculation,
    deleteCalculation,
    clearAllCalculations
  }
}