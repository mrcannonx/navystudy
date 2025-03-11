"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CounselingInfoSectionProps {
  counselingInfo?: {
    dateCounseled?: string;
    date_counseled?: string;
    counselor?: string;
    counselor_name?: string;
    signature?: boolean;
  };
  onCounselingInfoChange?: (info: { dateCounseled: string; counselor: string; signature: boolean }) => void;
}

export const CounselingInfoSection: React.FC<CounselingInfoSectionProps> = ({
  counselingInfo,
  onCounselingInfoChange
}) => {
  // Get the date value, handling both camelCase and snake_case field names
  const getDateValue = () => {
    if (!counselingInfo) return '';
    return counselingInfo.dateCounseled || counselingInfo.date_counseled || '';
  };

  // Get the counselor value, handling both camelCase and snake_case field names
  const getCounselorValue = () => {
    if (!counselingInfo) return '';
    return counselingInfo.counselor || counselingInfo.counselor_name || '';
  };

  // Get the signature value - keeping this for data structure compatibility
  const getSignatureValue = () => {
    if (!counselingInfo) return false;
    return counselingInfo.signature || false;
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCounselingInfoChange) {
      onCounselingInfoChange({
        dateCounseled: e.target.value,
        counselor: getCounselorValue(),
        signature: getSignatureValue() // Maintain existing value
      });
    }
  };

  // Handle counselor change
  const handleCounselorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCounselingInfoChange) {
      onCounselingInfoChange({
        dateCounseled: getDateValue(),
        counselor: e.target.value,
        signature: getSignatureValue() // Maintain existing value
      });
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 text-blue-600 border-b pb-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Mid-term Counseling Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-counseled-input" className="text-sm font-medium">Date Counseled</Label>
          <Input
            id="date-counseled-input"
            type="date"
            value={getDateValue()}
            onChange={handleDateChange}
            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="counselor-input" className="text-sm font-medium">Counselor</Label>
          <Input
            id="counselor-input"
            value={getCounselorValue()}
            onChange={handleCounselorChange}
            placeholder="Counselor name"
            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-500 italic mt-2">
        Record of mid-term counseling session. Date and counselor name.
      </p>
    </div>
  );
};