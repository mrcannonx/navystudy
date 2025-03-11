import React from 'react'
import { FolderOpen, Save, Trash2, Clock } from 'lucide-react'
import { SavedCalculation } from '../types/rsca-calculations'
import { formatDate } from '../utils/formatting-utils'

interface RSCACalculationItemProps {
  calculation: SavedCalculation
  onLoad: (calculation: SavedCalculation) => void
  onUpdate: (calculation: SavedCalculation) => void
  onDelete: (id: string) => void
}

/**
 * Component for displaying an individual saved calculation with action buttons
 */
export const RSCACalculationItem = React.memo(({
  calculation,
  onLoad,
  onUpdate,
  onDelete
}: RSCACalculationItemProps) => {
  return (
    <div
      id={calculation.id}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow"
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {calculation.name}
          </h3>
          <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
            RSCA PMA: {calculation.data.rscaPMA.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Saved on {formatDate(calculation.updated_at)}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onLoad(calculation)}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          title="Load this calculation"
        >
          <FolderOpen className="h-4 w-4" />
        </button>
        <button
          onClick={() => onUpdate(calculation)}
          className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
          title="Update this calculation"
        >
          <Save className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(calculation.id)}
          className="p-2.5 bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white rounded-lg transition-all duration-200"
          title="Delete this calculation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})

// Display name for debugging
RSCACalculationItem.displayName = 'RSCACalculationItem'