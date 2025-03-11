"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Database, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdvancedOptionsToggleProps {
  showAdvanced: boolean;
  onToggleAdvancedAction: () => void;
  onLoadAdvancedDataAction: () => void;
}

export const AdvancedOptionsToggle: React.FC<AdvancedOptionsToggleProps> = ({
  showAdvanced,
  onToggleAdvancedAction,
  onLoadAdvancedDataAction
}) => {
  return (
    <div className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-900/80 p-3 rounded-lg border border-gray-100 dark:border-gray-800 transition-all duration-200">
      <Button
        variant={showAdvanced ? "default" : "outline"}
        className={`text-sm font-medium flex items-center transition-all duration-200 ${
          showAdvanced
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:shadow-blue-900/30 dark:hover:shadow-blue-800/40"
            : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950/50 dark:border-blue-900/50"
        }`}
        onClick={onToggleAdvancedAction}
        aria-label={showAdvanced ? "Hide advanced options" : "Show advanced options"}
        aria-expanded={showAdvanced}
      >
        {showAdvanced ? (
          <>
            <ChevronUp className="mr-2 h-4 w-4" />
            Hide Advanced Options
          </>
        ) : (
          <>
            <Settings className="mr-2 h-4 w-4" />
            Show Advanced Options
          </>
        )}
      </Button>
      
      {showAdvanced && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-sm border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 dark:hover:text-blue-300 dark:hover:border-blue-700 transition-all duration-200"
            onClick={onLoadAdvancedDataAction}
            aria-label="Load advanced data"
          >
            <Database className="mr-2 h-4 w-4" />
            Load Advanced Data
          </Button>
        </div>
      )}
    </div>
  );
};
