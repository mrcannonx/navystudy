"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface ReportTypeSectionProps {
  notObservedReport?: boolean;
  reportType?: {
    regular: boolean;
    concurrent: boolean;
  };
  onNotObservedReportChange?: (notObserved: boolean) => void;
  onReportTypeChange?: (type: { regular: boolean; concurrent: boolean }) => void;
}

export const ReportTypeSection: React.FC<ReportTypeSectionProps> = ({
  notObservedReport,
  reportType,
  onNotObservedReportChange,
  onReportTypeChange
}) => {
  // Determine the current value for the radio group
  const radioValue = React.useMemo(() => {
    if (!reportType) return "regular"; // Default value
    return reportType.regular ? "regular" :
           reportType.concurrent ? "concurrent" : "regular";
  }, [reportType]);

  return (
    <div>
      <h4 className="text-base font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 dark:border-gray-700 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Report Type
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Not Observed Report checkbox with improved styling */}
        <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
          <Checkbox
            id="not-observed-checkbox"
            checked={notObservedReport || false}
            onCheckedChange={(checked) => 
              onNotObservedReportChange && onNotObservedReportChange(checked === true)
            }
            className="h-4 w-4 border-blue-300 data-[state=checked]:bg-blue-600"
          />
          <Label
            htmlFor="not-observed-checkbox"
            className="text-sm font-medium cursor-pointer dark:text-gray-200"
          >
            Not Observed Report
          </Label>
        </div>
        
        {/* Report type radio group with improved styling */}
        <div className="md:col-span-2">
          <RadioGroup
            value={radioValue}
            onValueChange={(value) => {
              if (onReportTypeChange) {
                onReportTypeChange({
                  regular: value === "regular",
                  concurrent: value === "concurrent"
                });
              }
            }}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
              <RadioGroupItem value="regular" id="regular-radio" className="text-blue-600" />
              <Label htmlFor="regular-radio" className="text-sm font-medium cursor-pointer dark:text-gray-200">Regular</Label>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
              <RadioGroupItem value="concurrent" id="concurrent-radio" className="text-blue-600" />
              <Label htmlFor="concurrent-radio" className="text-sm font-medium cursor-pointer dark:text-gray-200">Concurrent</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};