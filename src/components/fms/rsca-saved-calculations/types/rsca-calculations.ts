import { RSCACalculatorData } from "../../types"

// Interface to match database structure
export interface DBCalculatorData {
  id: string
  name: string
  data: RSCACalculatorData
  updated_at: string
  created_at: string
  calculator_type: string
  is_favorite: boolean
  version: string
  notes?: string
}

// Type alias for saved calculations (now only database)
export type SavedCalculation = DBCalculatorData

// Props for the main modal component
export interface RSCASavedCalculationsModalProps {
  isOpen: boolean
  onCloseAction: () => void
  currentCalculatorData: RSCACalculatorData
  onLoadAction: (data: RSCACalculatorData) => void
}

// Custom styles for the modal tabs
export const tabStyles = {
  active: "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 font-medium",
  inactive: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium"
}