"use client"

import React from 'react'
import { Database, X } from 'lucide-react'

interface RSCAModalHeaderProps {
  onCloseAction: () => void
}

/**
 * Header component for the RSCA saved calculations modal
 */
export function RSCAModalHeader({ onCloseAction }: RSCAModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-t-xl">
      <h2 className="text-xl font-bold flex items-center gap-2 text-blue-800 dark:text-blue-300">
        <Database className="h-5 w-5" />
        <span>Save & Load RSCA Calculations</span>
      </h2>
      <button
        onClick={onCloseAction}
        className="p-2 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors text-gray-600 dark:text-gray-300"
        aria-label="Close modal"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}