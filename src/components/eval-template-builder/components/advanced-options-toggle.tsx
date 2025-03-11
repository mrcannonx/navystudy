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
    <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
      <Button
        variant={showAdvanced ? "default" : "outline"}
        className={`text-sm font-medium flex items-center transition-all duration-200 ${
          showAdvanced 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        }`}
        onClick={onToggleAdvancedAction}
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
            className="text-sm border-blue-200 text-blue-700 hover:bg-blue-50"
            onClick={onLoadAdvancedDataAction}
          >
            <Database className="mr-2 h-4 w-4" />
            Load Advanced Data
          </Button>
        </div>
      )}
    </div>
  );
};
