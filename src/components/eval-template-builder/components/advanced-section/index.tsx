"use client"

import React from 'react';
import { PersonalInfoSection } from './personal-info-section';
import { StatusInfoSection } from './status-info-section';
import { ReportInfoSection } from './report-info-section';
import { PeriodOfReportSection } from './period-of-report-section';
import { ReportTypeSection } from './report-type-section';
import { AdditionalInfoSection } from './additional-info-section';
import { CommandInfoSection } from './command-info-section';
import { CounselingInfoSection } from './counseling-info-section';

interface AdvancedSectionProps {
  // Personal Information
  name?: string;
  desig?: string;
  ssn?: string;
  
  // Status Information
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
  
  // Report Information
  occasionForReport?: {
    periodic: boolean;
    detachment: boolean;
    promotionFrocking: boolean;
    special: boolean;
  };
  
  // Period of Report
  reportPeriod?: {
    from: string;
    to: string;
  };
  
  // Report Type
  notObservedReport?: boolean;
  reportType?: {
    regular: boolean;
    concurrent: boolean;
  };
  
  // Additional Information
  physicalReadiness?: string;
  billetSubcategory: string;
  
  // Command Information
  commandEmployment?: string;
  primaryDuties?: string;
  
  // Counseling Information
  counselingInfo?: {
    dateCounseled: string;
    counselor: string;
    signature: boolean;
  };
  
  // Actions
  onNameChange?: (name: string) => void;
  onDesigChange?: (desig: string) => void;
  onSsnChange?: (ssn: string) => void;
  
  onDutyStatusChange?: (status: { act: boolean; fts: boolean; inact: boolean; atAdswDrilling: boolean }) => void;
  onUicChange?: (uic: string) => void;
  onShipStationChange?: (shipStation: string) => void;
  onPromotionStatusChangeAction: (status: string) => void;
  onDateReportedChange?: (date: string) => void;
  
  onOccasionForReportChange?: (occasion: { periodic: boolean; detachment: boolean; promotionFrocking: boolean; special: boolean }) => void;
  
  onReportPeriodChange?: (period: { from: string; to: string }) => void;
  
  onNotObservedReportChange?: (notObserved: boolean) => void;
  onReportTypeChange?: (type: { regular: boolean; concurrent: boolean }) => void;
  
  onPhysicalReadinessChange?: (readiness: string) => void;
  onBilletSubcategoryChangeAction: (subcategory: string) => void;
  
  onCommandEmploymentChange?: (employment: string) => void;
  onPrimaryDutiesChange?: (duties: string) => void;
  
  onCounselingInfoChange?: (info: { dateCounseled: string; counselor: string; signature: boolean }) => void;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({
  // Personal Information
  name,
  desig,
  ssn,
  
  // Status Information
  dutyStatus,
  uic,
  shipStation,
  promotionStatus,
  dateReported,
  
  // Report Information
  occasionForReport,
  
  // Period of Report
  reportPeriod,
  
  // Report Type
  notObservedReport,
  reportType,
  
  // Additional Information
  physicalReadiness,
  billetSubcategory,
  
  // Command Information
  commandEmployment,
  primaryDuties,
  
  // Counseling Information
  counselingInfo,
  
  // Actions
  onNameChange,
  onDesigChange,
  onSsnChange,
  
  onDutyStatusChange,
  onUicChange,
  onShipStationChange,
  onPromotionStatusChangeAction,
  onDateReportedChange,
  
  onOccasionForReportChange,
  
  onReportPeriodChange,
  
  onNotObservedReportChange,
  onReportTypeChange,
  
  onPhysicalReadinessChange,
  onBilletSubcategoryChangeAction,
  
  onCommandEmploymentChange,
  onPrimaryDutiesChange,
  
  onCounselingInfoChange
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm transition-all duration-200">
      <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b pb-2">Advanced Options</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <PersonalInfoSection
              name={name}
              desig={desig}
              ssn={ssn}
              onNameChange={onNameChange}
              onDesigChange={onDesigChange}
              onSsnChange={onSsnChange}
            />
          </div>
          
          {/* Status Information */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <StatusInfoSection
              dutyStatus={dutyStatus}
              uic={uic}
              shipStation={shipStation}
              promotionStatus={promotionStatus}
              dateReported={dateReported}
              onDutyStatusChange={onDutyStatusChange}
              onUicChange={onUicChange}
              onShipStationChange={onShipStationChange}
              onPromotionStatusChangeAction={onPromotionStatusChangeAction}
              onDateReportedChange={onDateReportedChange}
            />
          </div>
          
          {/* Report Information */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <ReportInfoSection
              occasionForReport={occasionForReport}
              onOccasionForReportChange={onOccasionForReportChange}
            />
          </div>
          
          {/* Period of Report */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <PeriodOfReportSection
              reportPeriod={reportPeriod}
              onReportPeriodChange={onReportPeriodChange}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Report Type */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <ReportTypeSection
              notObservedReport={notObservedReport}
              reportType={reportType}
              onNotObservedReportChange={onNotObservedReportChange}
              onReportTypeChange={onReportTypeChange}
            />
          </div>
          
          {/* Additional Information */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <AdditionalInfoSection
              physicalReadiness={physicalReadiness}
              billetSubcategory={billetSubcategory}
              onPhysicalReadinessChange={onPhysicalReadinessChange}
              onBilletSubcategoryChangeAction={onBilletSubcategoryChangeAction}
            />
          </div>
          
          {/* Command Information */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <CommandInfoSection
              commandEmployment={commandEmployment}
              primaryDuties={primaryDuties}
              onCommandEmploymentChange={onCommandEmploymentChange}
              onPrimaryDutiesChange={onPrimaryDutiesChange}
            />
          </div>
          
          {/* Counseling Information */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
            <CounselingInfoSection
              counselingInfo={counselingInfo}
              onCounselingInfoChange={onCounselingInfoChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};