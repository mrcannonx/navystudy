"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { DarkModeToggle } from '../dark-mode-toggle'

interface EnhancedPageHeaderProps {
  onCreateTemplateAction: () => void
  isCreating: boolean
  hasCurrentTemplate: boolean
}

export function EnhancedPageHeader({
  onCreateTemplateAction,
  isCreating,
  hasCurrentTemplate
}: EnhancedPageHeaderProps) {
  // Only show the button on the main page (not creating and no current template)
  const showNewButton = !isCreating && !hasCurrentTemplate;
  
  return (
    <div className="w-full max-w-[1400px] mx-auto mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Navy Evaluation Builder</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Create professional and impactful Navy evaluation templates
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {showNewButton && (
              <Button
                onClick={onCreateTemplateAction}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Evaluation
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}