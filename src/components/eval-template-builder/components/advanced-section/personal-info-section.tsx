"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { DirectInput } from '../../direct-input';

interface PersonalInfoSectionProps {
  name?: string;
  desig?: string;
  ssn?: string;
  onNameChange?: (name: string) => void;
  onDesigChange?: (desig: string) => void;
  onSsnChange?: (ssn: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  name,
  desig,
  ssn,
  onNameChange,
  onDesigChange,
  onSsnChange
}) => {
  return (
    <div>
      <h4 className="text-base font-semibold mb-4 text-blue-600 dark:text-blue-400 border-b-2 dark:border-gray-700 pb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name-input" className="text-sm font-medium dark:text-gray-300">Name (Last, First MI Suffix)</Label>
          <DirectInput
            id="name-input"
            value={name || ''}
            onChangeAction={(value) => onNameChange && onNameChange(value)}
            placeholder="DOE, JOHN A"
            className="border-2 border-blue-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="desig-input" className="text-sm font-medium dark:text-gray-300">Designation</Label>
          <DirectInput
            id="desig-input"
            value={desig || ''}
            onChangeAction={(value) => onDesigChange && onDesigChange(value)}
            placeholder="USN"
            className="border-2 border-blue-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-gray-600 dark:bg-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:ring-1 focus:ring-blue-300/50 dark:focus:ring-blue-700/30 focus:ring-opacity-50"
          />
        </div>
      </div>
    </div>
  );
};