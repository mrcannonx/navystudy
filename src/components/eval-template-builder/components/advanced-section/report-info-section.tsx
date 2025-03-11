"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ReportInfoSectionProps {
  occasionForReport?: {
    periodic: boolean;
    detachment: boolean;
    promotionFrocking: boolean;
    special: boolean;
  };
  onOccasionForReportChange?: (occasion: { periodic: boolean; detachment: boolean; promotionFrocking: boolean; special: boolean }) => void;
}

export const ReportInfoSection: React.FC<ReportInfoSectionProps> = ({
  occasionForReport,
  onOccasionForReportChange
}) => {
  // Determine the current value for the radio group
  const radioValue = React.useMemo(() => {
    if (!occasionForReport) return "periodic"; // Default value
    return occasionForReport.periodic ? "periodic" :
           occasionForReport.detachment ? "detachment" :
           occasionForReport.promotionFrocking ? "promotionFrocking" :
           occasionForReport.special ? "special" : "periodic";
  }, [occasionForReport]);

  return (
    <div>
      <h4 className="text-base font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 dark:border-gray-700 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Occasion for Report
      </h4>
      
      <div className="bg-white dark:bg-gray-800 p-3 rounded-md border border-blue-50 dark:border-gray-700">
        <RadioGroup
          value={radioValue}
          onValueChange={(value) => {
            if (onOccasionForReportChange) {
              onOccasionForReportChange({
                periodic: value === "periodic",
                detachment: value === "detachment",
                promotionFrocking: value === "promotionFrocking",
                special: value === "special"
              });
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
            <RadioGroupItem value="periodic" id="periodic-radio" className="text-blue-600" />
            <Label htmlFor="periodic-radio" className="text-sm font-medium cursor-pointer dark:text-gray-200">Periodic</Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
            <RadioGroupItem value="detachment" id="detachment-radio" className="text-blue-600" />
            <Label htmlFor="detachment-radio" className="text-sm font-medium cursor-pointer dark:text-gray-200">Detachment of Individual</Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
            <RadioGroupItem value="promotionFrocking" id="promotion-frocking-radio" className="text-blue-600" />
            <Label htmlFor="promotion-frocking-radio" className="text-sm font-medium cursor-pointer dark:text-gray-200">Promotion/Frocking</Label>
          </div>
          
          <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
            <RadioGroupItem value="special" id="special-radio" className="text-blue-600" />
            <Label htmlFor="special-radio" className="text-sm font-medium cursor-pointer dark:text-gray-200">Special</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};