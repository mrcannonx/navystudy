"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { DirectInput } from '../../direct-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { billetSubcategoryOptions } from '../../template-data';

interface AdditionalInfoSectionProps {
  physicalReadiness?: string;
  billetSubcategory: string;
  onPhysicalReadinessChange?: (readiness: string) => void;
  onBilletSubcategoryChangeAction: (subcategory: string) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  physicalReadiness,
  billetSubcategory,
  onPhysicalReadinessChange,
  onBilletSubcategoryChangeAction
}) => {
  return (
    <div>
      <h4 className="text-base font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 dark:border-gray-700 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Additional Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="physical-readiness-input" className="text-sm font-medium">Physical Readiness</Label>
          <DirectInput
            id="physical-readiness-input"
            value={physicalReadiness || ''}
            onChangeAction={(value) => onPhysicalReadinessChange && onPhysicalReadinessChange(value)}
            placeholder="Physical Readiness"
            className="border-2 border-blue-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billet-subcategory-select" className="text-sm font-medium">Billet Subcategory</Label>
          <Select value={billetSubcategory} onValueChange={onBilletSubcategoryChangeAction}>
            <SelectTrigger 
              id="billet-subcategory-select" 
              className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <SelectValue placeholder="Select billet subcategory" />
            </SelectTrigger>
            <SelectContent>
              {billetSubcategoryOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};