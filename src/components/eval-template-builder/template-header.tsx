"use client"

import React from 'react';
import { HeaderActions } from './components/header-actions';
import { AdvancedOptionsToggle } from './components/advanced-options-toggle';
import { BasicSelectionControls } from './components/basic-selection-controls';
import { AdvancedSection } from './components/advanced-section';

interface TemplateHeaderProps {
  title: string;
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  
  // Advanced section props - Personal Information
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
  
  // UI state
  showAdvanced: boolean;
  
  // Actions
  onTitleChangeAction: (title: string) => void;
  onRankChangeAction: (rank: string) => void;
  onRatingChangeAction: (rating: string) => void;
  onRoleChangeAction: (role: string) => void;
  onEvalTypeChangeAction: (evalType: string) => void;
  
  // Advanced section actions - Personal Information
  onNameChangeAction?: (name: string) => void;
  onDesigChangeAction?: (desig: string) => void;
  onSsnChangeAction?: (ssn: string) => void;
  
  // Status Information
  onDutyStatusChangeAction?: (status: { act: boolean; fts: boolean; inact: boolean; atAdswDrilling: boolean }) => void;
  onUicChangeAction?: (uic: string) => void;
  onShipStationChangeAction?: (shipStation: string) => void;
  onPromotionStatusChangeAction: (status: string) => void;
  onDateReportedChangeAction?: (date: string) => void;
  
  // Report Information
  onOccasionForReportChangeAction?: (occasion: { periodic: boolean; detachment: boolean; promotionFrocking: boolean; special: boolean }) => void;
  
  // Period of Report
  onReportPeriodChangeAction?: (period: { from: string; to: string }) => void;
  
  // Report Type
  onNotObservedReportChangeAction?: (notObserved: boolean) => void;
  onReportTypeChangeAction?: (type: { regular: boolean; concurrent: boolean }) => void;
  
  // Additional Information
  onPhysicalReadinessChangeAction?: (readiness: string) => void;
  onBilletSubcategoryChangeAction: (subcategory: string) => void;
  
  // Command Information
  onCommandEmploymentChangeAction?: (employment: string) => void;
  onPrimaryDutiesChangeAction?: (duties: string) => void;
  
  // Counseling Information
  onCounselingInfoChangeAction?: (info: { dateCounseled: string; counselor: string; signature: boolean }) => void;
  
  // UI actions
  onToggleAdvancedAction: () => void;
  onLoadAdvancedDataAction: () => void;
  
  // Other actions
  onSaveAction: () => void;
  onCancelAction: () => void;
  onLoadAction: () => void;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  title,
  rank,
  rating,
  role,
  evalType,
  
  // Advanced section props - Personal Information
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
  
  // UI state
  showAdvanced,
  
  // Actions
  onTitleChangeAction,
  onRankChangeAction,
  onRatingChangeAction,
  onRoleChangeAction,
  onEvalTypeChangeAction,
  
  // Advanced section actions - Personal Information
  onNameChangeAction,
  onDesigChangeAction,
  onSsnChangeAction,
  
  // Status Information
  onDutyStatusChangeAction,
  onUicChangeAction,
  onShipStationChangeAction,
  onPromotionStatusChangeAction,
  onDateReportedChangeAction,
  
  // Report Information
  onOccasionForReportChangeAction,
  
  // Period of Report
  onReportPeriodChangeAction,
  
  // Report Type
  onNotObservedReportChangeAction,
  onReportTypeChangeAction,
  
  // Additional Information
  onPhysicalReadinessChangeAction,
  onBilletSubcategoryChangeAction,
  
  // Command Information
  onCommandEmploymentChangeAction,
  onPrimaryDutiesChangeAction,
  
  // Counseling Information
  onCounselingInfoChangeAction,
  
  // UI actions
  onToggleAdvancedAction,
  onLoadAdvancedDataAction,
  
  // Other actions
  onSaveAction,
  onCancelAction,
  onLoadAction
}) => {
  // Removed debugging logs
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-200">
      <HeaderActions
        title={title}
        rank={rank}
        rating={rating}
        role={role}
        onTitleChangeAction={onTitleChangeAction}
        onSaveAction={onSaveAction}
        onCancelAction={onCancelAction}
        onLoadAction={onLoadAction}
      />
      
      <AdvancedOptionsToggle
        showAdvanced={showAdvanced}
        onToggleAdvancedAction={onToggleAdvancedAction}
        onLoadAdvancedDataAction={onLoadAdvancedDataAction}
      />
      
      {showAdvanced && (
        <AdvancedSection
          // Personal Information
          name={name}
          desig={desig}
          ssn={ssn}
          
          // Status Information
          dutyStatus={dutyStatus}
          uic={uic}
          shipStation={shipStation}
          promotionStatus={promotionStatus}
          dateReported={dateReported}
          
          // Report Information
          occasionForReport={occasionForReport}
          
          // Period of Report
          reportPeriod={reportPeriod}
          
          // Report Type
          notObservedReport={notObservedReport}
          reportType={reportType}
          
          // Additional Information
          physicalReadiness={physicalReadiness}
          billetSubcategory={billetSubcategory}
          
          // Command Information
          commandEmployment={commandEmployment}
          primaryDuties={primaryDuties}
          
          // Counseling Information
          counselingInfo={counselingInfo}
          
          // Actions
          onNameChange={onNameChangeAction}
          onDesigChange={onDesigChangeAction}
          onSsnChange={onSsnChangeAction}
          
          onDutyStatusChange={onDutyStatusChangeAction}
          onUicChange={onUicChangeAction}
          onShipStationChange={onShipStationChangeAction}
          onPromotionStatusChangeAction={onPromotionStatusChangeAction}
          onDateReportedChange={onDateReportedChangeAction}
          
          onOccasionForReportChange={onOccasionForReportChangeAction}
          
          onReportPeriodChange={onReportPeriodChangeAction}
          
          onNotObservedReportChange={onNotObservedReportChangeAction}
          onReportTypeChange={onReportTypeChangeAction}
          
          onPhysicalReadinessChange={onPhysicalReadinessChangeAction}
          onBilletSubcategoryChangeAction={onBilletSubcategoryChangeAction}
          
          onCommandEmploymentChange={onCommandEmploymentChangeAction}
          onPrimaryDutiesChange={onPrimaryDutiesChangeAction}
          
          onCounselingInfoChange={onCounselingInfoChangeAction}
        />
      )}
      
      <BasicSelectionControls
        rank={rank}
        rating={rating}
        role={role}
        evalType={evalType}
        onRankChangeAction={onRankChangeAction}
        onRatingChangeAction={onRatingChangeAction}
        onRoleChangeAction={onRoleChangeAction}
        onEvalTypeChangeAction={onEvalTypeChangeAction}
      />
    </div>
  );
};