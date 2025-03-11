"use client"

import React from 'react'
import { Save, FolderOpen } from 'lucide-react'
import { tabStyles } from '../types/rsca-calculations'

interface RSCATabNavigationProps {
  activeTab: 'save' | 'load'
  onTabChangeAction: (tab: 'save' | 'load') => void
  savedCount: number
}

/**
 * Tab navigation component for the RSCA saved calculations modal
 */
export function RSCATabNavigation({
  activeTab,
  onTabChangeAction,
  savedCount
}: RSCATabNavigationProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <button
        className={`flex-1 py-3.5 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
          activeTab === 'save' ? tabStyles.active : tabStyles.inactive
        }`}
        onClick={() => onTabChangeAction('save')}
      >
        <Save className="h-4 w-4" />
        <span>Save Current</span>
      </button>
      <button
        className={`flex-1 py-3.5 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
          activeTab === 'load' ? tabStyles.active : tabStyles.inactive
        }`}
        onClick={() => onTabChangeAction('load')}
      >
        <FolderOpen className="h-4 w-4" />
        <span>Load Saved {savedCount > 0 && `(${savedCount})`}</span>
      </button>
    </div>
  )
}