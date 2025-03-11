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
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-6 shadow-md hover:shadow-lg transition-all duration-200">
      <h3 className="text-xl font-bold mb-5 text-blue-700 dark:text-blue-400 border-b-2 dark:border-gray-800 pb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Advanced Options
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
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
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
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
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <ReportInfoSection
              occasionForReport={occasionForReport}
              onOccasionForReportChange={onOccasionForReportChange}
            />
          </div>
          
          {/* Period of Report */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <PeriodOfReportSection
              reportPeriod={reportPeriod}
              onReportPeriodChange={onReportPeriodChange}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Report Type */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <ReportTypeSection
              notObservedReport={notObservedReport}
              reportType={reportType}
              onNotObservedReportChange={onNotObservedReportChange}
              onReportTypeChange={onReportTypeChange}
            />
          </div>
          
          {/* Additional Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <AdditionalInfoSection
              physicalReadiness={physicalReadiness}
              billetSubcategory={billetSubcategory}
              onPhysicalReadinessChange={onPhysicalReadinessChange}
              onBilletSubcategoryChangeAction={onBilletSubcategoryChangeAction}
            />
          </div>
          
          {/* Command Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <CommandInfoSection
              commandEmployment={commandEmployment}
              primaryDuties={primaryDuties}
              onCommandEmploymentChange={onCommandEmploymentChange}
              onPrimaryDutiesChange={onPrimaryDutiesChange}
            />
          </div>
          
          {/* Counseling Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-5 border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
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