"use client"

import { useState } from 'react';
import { EvaluationTemplateData } from '../types';
import { Template } from './useTemplates';

interface UseTemplateDialogsProps {
  onLoadTemplateAction?: (template: Template) => void;
  loadAdvancedDataAction: (templateData: EvaluationTemplateData) => void;
  clearDemoDataAction: () => void;
  handleSaveAction: (data: EvaluationTemplateData) => void;
  setTitleAction: (title: string) => void;
  showAdvanced: boolean;
  setShowAdvancedAction: (show: boolean) => void;
}

export function useTemplateDialogs({
  onLoadTemplateAction,
  loadAdvancedDataAction,
  clearDemoDataAction,
  handleSaveAction,
  setTitleAction,
  showAdvanced,
  setShowAdvancedAction
}: UseTemplateDialogsProps) {
  // Dialog states
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [isLoadAdvancedDataDialogOpen, setIsLoadAdvancedDataDialogOpen] = useState(false);
  const [isClearDemoDialogOpen, setIsClearDemoDialogOpen] = useState(false);
  
  // Open save dialog instead of directly saving
  const openSaveDialog = () => {
    setIsSaveDialogOpen(true);
  };
  
  // Open load dialog
  const openLoadDialog = () => {
    setIsLoadDialogOpen(true);
  };
  
  // Open load advanced data dialog
  const openLoadAdvancedDataDialog = () => {
    setIsLoadAdvancedDataDialogOpen(true);
  };
  
  // Toggle advanced section
  const toggleAdvancedSection = () => {
    setShowAdvancedAction(!showAdvanced);
  };
  
  // Handle load template
  const handleLoadTemplate = (template: Template) => {
    if (onLoadTemplateAction) {
      onLoadTemplateAction(template);
    }
    setIsLoadDialogOpen(false);
  };
  
  // Handle load advanced data
  const handleLoadAdvancedData = (template: Template) => {
    // Convert Template to EvaluationTemplateData
    const templateData: EvaluationTemplateData = {
      title: template.title,
      rank: template.rank,
      rating: template.rating,
      role: template.role,
      evalType: template.eval_type,
      
      // Personal Information
      name: template.name,
      desig: template.desig,
      ssn: template.ssn,
      
      // Status Information
      dutyStatus: template.duty_status ? {
        act: template.duty_status.act,
        fts: template.duty_status.fts,
        inact: template.duty_status.inact,
        atAdswDrilling: template.duty_status.at_adsw_drilling
      } : undefined,
      uic: template.uic,
      shipStation: template.ship_station,
      promotionStatus: template.promotion_status || 'Regular',
      dateReported: template.date_reported,
      
      // Report Information
      occasionForReport: template.occasion_for_report ? {
        periodic: template.occasion_for_report.periodic,
        detachment: template.occasion_for_report.detachment,
        promotionFrocking: template.occasion_for_report.promotion_frocking,
        special: template.occasion_for_report.special
      } : undefined,
      
      // Period of Report
      reportPeriod: template.report_period ? {
        from: template.report_period.from,
        to: template.report_period.to
      } : undefined,
      
      // Report Type
      notObservedReport: template.not_observed_report,
      reportType: template.report_type ? {
        regular: template.report_type.regular,
        concurrent: template.report_type.concurrent
      } : undefined,
      
      // Additional Information
      physicalReadiness: template.physical_readiness,
      billetSubcategory: template.billet_subcategory || 'N/A',
      
      // Command Information
      commandEmployment: template.command_employment,
      primaryDuties: template.primary_duties,
      
      // Counseling Information
      counselingInfo: template.counseling_info ? {
        dateCounseled: template.counseling_info.date_counseled,
        counselor: template.counseling_info.counselor,
        signature: template.counseling_info.signature
      } : undefined,
      
      // Core data
      sections: template.sections,
      bragSheetEntries: template.brag_sheet_entries,
      isDemoMode: template.is_demo_mode
    };
    
    loadAdvancedDataAction(templateData);
    setIsLoadAdvancedDataDialogOpen(false);
  };
  
  // Handle save with custom title
  const handleSaveWithCustomTitle = (_templateData: EvaluationTemplateData, customTitle: string) => {
    console.log("useTemplateDialogs - handleSaveWithCustomTitle called with:", {
      _templateData,
      customTitle
    });
    
    // Verify the custom title is being received correctly
    console.log("useTemplateDialogs - Custom title received:", customTitle);
    console.log("useTemplateDialogs - Custom title type:", typeof customTitle);
    console.log("useTemplateDialogs - Custom title length:", customTitle ? customTitle.length : 0);
    
    if (!customTitle || customTitle.trim() === '') {
      console.warn("useTemplateDialogs - Empty custom title received, using default title");
      customTitle = `${_templateData.rank} ${_templateData.rating} ${_templateData.role} Evaluation`;
    }
    
    // Log the final title being used
    console.log("useTemplateDialogs - Final title being used:", customTitle);
    
    // Create a copy of the template data with the updated title
    const updatedTemplateData: EvaluationTemplateData = {
      ..._templateData,
      // Ensure the title is set to the custom title
      title: customTitle,
      // Ensure the role is preserved correctly
      role: _templateData.role
    };
    
    console.log("useTemplateDialogs - Updated template data with new title:", updatedTemplateData);
    
    // Update the title state first to ensure UI updates
    setTitleAction(customTitle);
    
    // Close the save dialog before calling handleSave to prevent UI glitches
    setIsSaveDialogOpen(false);
    
    // Add a small delay before calling handleSave to allow UI to update
    setTimeout(() => {
      // Call handleSave with the updated template data
      console.log("TemplateBuilder - Calling handleSave with updated title:", customTitle);
      console.log("TemplateBuilder - Updated template data:", updatedTemplateData);
      handleSaveAction(updatedTemplateData);
    }, 300); // Increased delay to ensure UI updates
  };

  // Handle clear demo button click
  const handleClearDemoClick = () => {
    setIsClearDemoDialogOpen(true);
  };

  // Handle confirm clear demo
  const handleConfirmClearDemo = () => {
    clearDemoDataAction();
    setIsClearDemoDialogOpen(false);
  };

  return {
    // Dialog states
    isSaveDialogOpen,
    isLoadDialogOpen,
    isLoadAdvancedDataDialogOpen,
    isClearDemoDialogOpen,
    // Dialog actions
    openSaveDialog,
    openLoadDialog,
    openLoadAdvancedDataDialog,
    toggleAdvancedSection,
    handleLoadTemplate,
    handleLoadAdvancedData,
    handleSaveWithCustomTitle,
    handleClearDemoClick,
    handleConfirmClearDemo,
    // Dialog state setters
    setIsSaveDialogOpen,
    setIsLoadDialogOpen,
    setIsLoadAdvancedDataDialogOpen,
    setIsClearDemoDialogOpen
  };
}
