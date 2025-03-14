"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { DirectTextarea } from '../../direct-input';

interface CommandInfoSectionProps {
  commandEmployment?: string;
  primaryDuties?: string;
  onCommandEmploymentChange?: (employment: string) => void;
  onPrimaryDutiesChange?: (duties: string) => void;
}

export const CommandInfoSection: React.FC<CommandInfoSectionProps> = ({
  commandEmployment,
  primaryDuties,
  onCommandEmploymentChange,
  onPrimaryDutiesChange
}) => {
  return (
    <div>
      <h4 className="text-base font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 dark:border-gray-700 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
        Command Information
      </h4>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="command-employment-input" className="text-sm font-medium dark:text-gray-300">
            Command Employment and Command Achievements
          </Label>
          <DirectTextarea
            id="command-employment-input"
            value={commandEmployment || ''}
            onChangeAction={(value) => onCommandEmploymentChange && onCommandEmploymentChange(value)}
            placeholder="Command employment and command achievements"
            className="w-full min-h-[100px] border-2 border-blue-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 resize-y shadow-sm hover:shadow-md transition-all duration-200 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Describe the command's employment and significant achievements during the reporting period.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="primary-duties-input" className="text-sm font-medium dark:text-gray-300">
            Primary/Collateral/Watchstanding Duties
          </Label>
          <DirectTextarea
            id="primary-duties-input"
            value={primaryDuties || ''}
            onChangeAction={(value) => onPrimaryDutiesChange && onPrimaryDutiesChange(value)}
            placeholder="Enter primary duties, collateral duties, and watchstanding duties"
            className="w-full min-h-[100px] border-2 border-blue-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 resize-y shadow-sm hover:shadow-md transition-all duration-200 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            List all primary duties, collateral duties, and watchstanding responsibilities.
          </p>
        </div>
      </div>
    </div>
  );
};