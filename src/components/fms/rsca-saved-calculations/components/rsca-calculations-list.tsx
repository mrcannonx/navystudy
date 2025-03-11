"use client"

import React, { useState, useMemo } from 'react'
import { Search, Trash2, Database } from 'lucide-react'
import { ClientInput } from "@/components/ui/client-input"
import { SavedCalculation } from '../types/rsca-calculations'
import { RSCACalculationItem } from './rsca-calculation-item'
import { getSortedAndFilteredCalculations } from '../utils/filtering-utils'

interface RSCACalculationsListProps {
  calculations: SavedCalculation[]
  isLoading: boolean
  onLoadAction: (calculation: SavedCalculation) => void
  onUpdateAction: (calculation: SavedCalculation) => void
  onDeleteAction: (id: string) => void
  onClearAllAction: () => void
}

/**
 * Component for displaying a list of saved calculations with search and sort functionality
 */
export function RSCACalculationsList({
  calculations,
  isLoading,
  onLoadAction,
  onUpdateAction,
  onDeleteAction,
  onClearAllAction
}: RSCACalculationsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest')
  
  // Memoize filtered calculations to avoid recalculating on every render
  const filteredCalculations = useMemo(() => 
    getSortedAndFilteredCalculations(calculations, searchTerm, sortOrder),
    [calculations, searchTerm, sortOrder]
  )
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  // Empty state
  if (calculations.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Database className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No saved calculations yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Save your current calculation to access it later or compare different scenarios.
        </p>
      </div>
    )
  }
  
  return (
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
          onClick={onClearAllAction}
          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
          title="Clear all saved calculations"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Clear All</span>
        </button>
      </div>
      
      {/* Results Count */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {filteredCalculations.length === calculations.length ? (
          <span>Showing all {calculations.length} saved calculations</span>
        ) : (
          <span>Showing {filteredCalculations.length} of {calculations.length} saved calculations</span>
        )}
      </div>
      
      {/* Saved Calculations List */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 pb-2">
        {filteredCalculations.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No calculations match your search</p>
          </div>
        ) : (
          filteredCalculations.map((calculation) => (
            <RSCACalculationItem
              key={calculation.id}
              calculation={calculation}
              onLoad={onLoadAction}
              onUpdate={onUpdateAction}
              onDelete={onDeleteAction}
            />
          ))
        )}
      </div>
    </div>
  )
}