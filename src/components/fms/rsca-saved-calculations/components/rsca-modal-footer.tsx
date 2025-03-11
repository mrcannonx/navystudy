"use client"

import React from 'react'

interface RSCAModalFooterProps {
  onCloseAction: () => void
}

/**
 * Footer component for the RSCA saved calculations modal
 */
export function RSCAModalFooter({ onCloseAction }: RSCAModalFooterProps) {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
      <button
        onClick={onCloseAction}
        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors font-medium"
      >
        Close
      </button>
    </div>
  )
}