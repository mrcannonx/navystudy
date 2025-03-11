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
      <h4 className="text-sm font-semibold mb-3 text-blue-600 border-b pb-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name-input" className="text-sm font-medium">Name (Last, First MI Suffix)</Label>
          <DirectInput
            id="name-input"
            value={name || ''}
            onChangeAction={(value) => onNameChange && onNameChange(value)}
            placeholder="DOE, JOHN A"
            className="border-blue-100 focus:border-blue-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="desig-input" className="text-sm font-medium">Designation</Label>
          <DirectInput
            id="desig-input"
            value={desig || ''}
            onChangeAction={(value) => onDesigChange && onDesigChange(value)}
            placeholder="USN"
            className="border-blue-100 focus:border-blue-300"
          />
        </div>
      </div>
    </div>
  );
};