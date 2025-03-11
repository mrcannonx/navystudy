"use client"

import React from 'react';
import { Label } from '@/components/ui/label';
import { DirectInput } from '../../direct-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { promotionStatusOptions } from '../../template-data';

interface StatusInfoSectionProps {
  dutyStatus?: {
    act: boolean;
    fts: boolean;
    inact: boolean;
    atAdswDrilling: boolean;
  };
  uic?: string;
  shipStation?: string;
  promotionStatus: string;
  dateReported?: string;
  onDutyStatusChange?: (status: { act: boolean; fts: boolean; inact: boolean; atAdswDrilling: boolean }) => void;
  onUicChange?: (uic: string) => void;
  onShipStationChange?: (shipStation: string) => void;
  onPromotionStatusChangeAction: (status: string) => void;
  onDateReportedChange?: (date: string) => void;
}

export const StatusInfoSection: React.FC<StatusInfoSectionProps> = ({
  dutyStatus,
  uic,
  shipStation,
  promotionStatus,
  dateReported,
  onDutyStatusChange,
  onUicChange,
  onShipStationChange,
  onPromotionStatusChangeAction,
  onDateReportedChange
}) => {
  // Determine the current value for the radio group
  const radioValue = React.useMemo(() => {
    if (!dutyStatus) return "act"; // Default value
    return dutyStatus.act ? "act" :
           dutyStatus.fts ? "fts" :
           dutyStatus.inact ? "inact" :
           dutyStatus.atAdswDrilling ? "atAdswDrilling" : "act";
  }, [dutyStatus]);

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 text-blue-600 border-b pb-1 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Status Information
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Duty Status</Label>
          <RadioGroup
            value={radioValue}
            onValueChange={(value) => {
              if (onDutyStatusChange) {
                onDutyStatusChange({
                  act: value === "act",
                  fts: value === "fts",
                  inact: value === "inact",
                  atAdswDrilling: value === "atAdswDrilling"
                });
              }
            }}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="act" id="act-radio" />
              <Label htmlFor="act-radio" className="text-sm">ACT</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fts" id="fts-radio" />
              <Label htmlFor="fts-radio" className="text-sm">FTS</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="inact" id="inact-radio" />
              <Label htmlFor="inact-radio" className="text-sm">INACT</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="atAdswDrilling" id="at-adsw-radio" />
              <Label htmlFor="at-adsw-radio" className="text-sm">AT/ADSW/265</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="uic-input" className="text-sm font-medium">UIC</Label>
          <DirectInput
            id="uic-input"
            value={uic || ''}
            onChangeAction={(value) => onUicChange && onUicChange(value)}
            placeholder="UIC"
            className="border-blue-100 focus:border-blue-300"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ship-station-input" className="text-sm font-medium">Ship/Station</Label>
          <DirectInput
            id="ship-station-input"
            value={shipStation || ''}
            onChangeAction={(value) => onShipStationChange && onShipStationChange(value)}
            placeholder="Ship/Station"
            className="border-blue-100 focus:border-blue-300"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="promotion-status-select" className="text-sm font-medium">Promotion Status</Label>
          <Select value={promotionStatus} onValueChange={onPromotionStatusChangeAction}>
            <SelectTrigger id="promotion-status-select" className="w-full border-blue-100 focus:border-blue-300">
              <SelectValue placeholder="Select promotion status" />
            </SelectTrigger>
            <SelectContent>
              {promotionStatusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date-reported-input" className="text-sm font-medium">Date Reported</Label>
          <DirectInput
            id="date-reported-input"
            type="date"
            value={dateReported || ''}
            onChangeAction={(value) => onDateReportedChange && onDateReportedChange(value)}
            className="border-blue-100 focus:border-blue-300"
          />
        </div>
      </div>
    </div>
  );
};