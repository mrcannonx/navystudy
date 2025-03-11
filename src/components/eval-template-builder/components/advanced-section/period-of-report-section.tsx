"use client"

import React, { useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PeriodOfReportSectionProps {
  reportPeriod?: {
    from: string;
    to: string;
  };
  onReportPeriodChange?: (period: { from: string; to: string }) => void;
}

export const PeriodOfReportSection: React.FC<PeriodOfReportSectionProps> = ({
  reportPeriod,
  onReportPeriodChange
}) => {
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // Handle direct input changes for date fields
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    if (onReportPeriodChange) {
      // Create a safe copy of the current period, ensuring we don't lose the other field's value
      const currentPeriod = reportPeriod || { from: '', to: '' };
      
      // Update only the changed field while preserving the other field
      onReportPeriodChange({
        ...currentPeriod,
        [field]: value
      });
    }
  };

  // Add direct event listeners to ensure date picker works
  useEffect(() => {
    const fromInput = fromInputRef.current;
    const toInput = toInputRef.current;

    // Event handlers that capture the current reportPeriod state
    const handleFromChange = () => {
      if (fromInput) {
        handleDateChange('from', fromInput.value);
      }
    };
    
    const handleToChange = () => {
      if (toInput) {
        handleDateChange('to', toInput.value);
      }
    };
    
    // Add event listeners to both inputs
    if (fromInput) {
      fromInput.addEventListener('change', handleFromChange);
    }
    
    if (toInput) {
      toInput.addEventListener('change', handleToChange);
    }
    
    // Clean up both event listeners
    return () => {
      if (fromInput) {
        fromInput.removeEventListener('change', handleFromChange);
      }
      if (toInput) {
        toInput.removeEventListener('change', handleToChange);
      }
    };
  }, [onReportPeriodChange, reportPeriod]);

  return (
    <div>
      <h4 className="text-base font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 dark:border-gray-700 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Period of Report
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from-date-input" className="text-sm font-medium flex items-center">
            <span className="mr-1">From</span>
            <span className="text-xs text-blue-500">(required)</span>
          </Label>
          <Input
            id="from-date-input"
            type="date"
            value={reportPeriod?.from || ''}
            onChange={(e) => {
              handleDateChange('from', e.target.value);
            }}
            ref={fromInputRef}
            className="border-2 border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="to-date-input" className="text-sm font-medium flex items-center">
            <span className="mr-1">To</span>
            <span className="text-xs text-blue-500">(required)</span>
          </Label>
          <Input
            id="to-date-input"
            type="date"
            value={reportPeriod?.to || ''}
            onChange={(e) => {
              handleDateChange('to', e.target.value);
            }}
            ref={toInputRef}
            className="border-2 border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};