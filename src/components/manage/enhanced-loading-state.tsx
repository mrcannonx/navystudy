"use client"

import { Loader2, Sparkles, CheckCircle2 } from "lucide-react"

interface EnhancedLoadingStateProps {
  text: string
  progress?: { current: number; total: number }
}

export function EnhancedLoadingState({ text, progress }: EnhancedLoadingStateProps) {
  // Calculate progress percentage
  const percentage = progress ? Math.round((progress.current / progress.total) * 100) : null;
  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 blur-sm animate-pulse"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
          {percentage !== null && percentage >= 100 ? (
            <CheckCircle2 className="h-10 w-10 text-green-500 animate-bounce" />
          ) : (
            <div className="relative">
              <Loader2 className="h-10 w-10 text-blue-600 dark:text-blue-400 animate-spin" />
              <Sparkles className="h-4 w-4 text-yellow-500 absolute top-0 right-0 animate-pulse" />
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{text}</p>
        {progress && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {progress.current} of {progress.total} chunks processed
            {percentage !== null && ` (${percentage}%)`}
          </p>
        )}
      </div>
      
      {progress && (
        <div className="w-full max-w-md">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Starting</span>
            <span>Processing</span>
            <span>Finishing</span>
          </div>
        </div>
      )}
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-md">
        <p>This may take a few moments depending on the size of your content. We're using AI to analyze and transform your material.</p>
      </div>
    </div>
  )
}