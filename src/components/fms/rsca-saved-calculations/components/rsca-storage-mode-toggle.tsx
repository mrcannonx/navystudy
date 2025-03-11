"use client"

import React from 'react'

interface RSCAStorageModeToggleProps {
  mode: 'local' | 'database'
  onChangeAction: (mode: 'local' | 'database') => void
}

/**
 * Component for toggling between local storage and database storage modes
 */
export function RSCAStorageModeToggle({
  mode,
  onChangeAction
}: RSCAStorageModeToggleProps) {
  return (
    <div className="flex justify-center p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => onChangeAction('local')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            mode === 'local'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Local Storage
        </button>
        <button
          type="button"
          onClick={() => onChangeAction('database')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            mode === 'database'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
          }`}
        >
          Database
        </button>
      </div>
    </div>
  )
}