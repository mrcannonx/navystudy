import React, { memo } from 'react';
import { AdvancedOptionsToggleProps } from '../types';
import { Settings } from 'lucide-react';

const AdvancedOptionsToggleComponent: React.FC<AdvancedOptionsToggleProps> = ({
  includeAdvancedOptions,
  toggleAdvancedOptions
}) => {
  return (
    <div 
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
      onClick={toggleAdvancedOptions}
      role="switch"
      aria-checked={includeAdvancedOptions}
      tabIndex={0}
      title="Toggle to include or exclude advanced options in the PDF (Alt+A)"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAdvancedOptions();
        }
      }}
    >
      <Settings size={18} className={`${includeAdvancedOptions ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
      <div className="flex flex-col">
        <span className="text-sm font-medium dark:text-gray-200">
          Include Advanced Options <span className="text-xs text-gray-500 dark:text-gray-400">(Alt+A)</span>
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Status: <span className={`font-semibold ${includeAdvancedOptions ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-500'}`}>
            {includeAdvancedOptions ? 'Enabled' : 'Disabled'}
          </span>
        </span>
      </div>
      <div className="ml-2">
        <div className={`w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${includeAdvancedOptions ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <div
            className={`bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow transform transition-transform duration-300 ease-in-out translate-y-0.5 ${
              includeAdvancedOptions ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

// Export a memoized version of the component
export const AdvancedOptionsToggle = memo(AdvancedOptionsToggleComponent);