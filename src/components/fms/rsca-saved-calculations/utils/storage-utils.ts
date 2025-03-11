import { SavedCalculation, DBCalculatorData } from "../types/rsca-calculations"
import { RSCACalculatorData } from "../../types"

const LOCAL_STORAGE_KEY = "rsca-saved-calculations"

/**
 * Loads saved calculations from localStorage
 * @returns Array of saved calculations or empty array if none found
 */
export const loadFromLocalStorage = (): SavedCalculation[] => {
  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (savedData) {
      return JSON.parse(savedData)
    }
  } catch (error) {
    console.error("Failed to parse saved RSCA calculations:", error)
  }
  return []
}

/**
 * Saves calculations to localStorage
 * @param calculations - Array of calculations to save
 */
export const saveToLocalStorage = (calculations: SavedCalculation[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(calculations))
}

/**
 * Creates a new calculation object for local storage
 * @param name - Name of the calculation
 * @param data - Calculator data to save
 * @returns New calculation object
 */
export const createLocalCalculation = (
  name: string,
  data: RSCACalculatorData
): SavedCalculation => {
  const now = new Date().toISOString();
  return {
    id: Date.now().toString(),
    name: name.trim(),
    data: { ...data },
    created_at: now,
    updated_at: now,
    calculator_type: "rsca",
    is_favorite: false,
    version: "1.0"
  }
}

/**
 * Updates an existing calculation in local storage
 * @param calculations - Current array of calculations
 * @param id - ID of calculation to update
 * @param data - New calculator data
 * @returns Updated array of calculations
 */
export const updateLocalCalculation = (
  calculations: SavedCalculation[],
  id: string,
  data: RSCACalculatorData
): SavedCalculation[] => {
  return calculations.map(calc =>
    calc.id === id
      ? { ...calc, data: { ...data }, updated_at: new Date().toISOString() }
      : calc
  )
}

/**
 * Deletes a calculation from local storage
 * @param calculations - Current array of calculations
 * @param id - ID of calculation to delete
 * @returns Updated array of calculations
 */
export const deleteLocalCalculation = (
  calculations: SavedCalculation[],
  id: string
): SavedCalculation[] => {
  return calculations.filter(calc => calc.id !== id)
}