"use client"

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { TemplateSections, SectionKey, EvaluationTemplateData } from './types';
import { TemplateSectionsNav } from './template-sections-nav';
import { TemplateContentEditor } from './template-content-editor';
import { TemplateProvider, useTemplate } from './contexts/template-context';
import { useTemplateSections } from './hooks/template-builder/useTemplateSections';
import { defaultTemplateSections } from './template-data';
import { useTemplateDialogs, useTemplateHandlers } from './hooks';
import { TemplateLeftSidebar, TemplateRightSidebar, TemplateDialogs } from './components';
import { TemplateHeader } from './template-header';
import { TemplateProgress } from './template-progress';
import { TemplateFeatureToggles } from './template-feature-toggles';
import { Template } from './hooks/useTemplates';

interface EvaluationTemplateBuilderProps {
  initialData?: Partial<EvaluationTemplateData>;
  onSave: (data: EvaluationTemplateData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSaveCustomMetric?: (metric: string, section: string) => void;
  onDeleteCustomMetric?: (metric: string, section: string) => void;
  loadCustomMetrics?: () => Promise<void>;
  clearAllCustomMetrics?: () => Promise<void>;
  templates?: Template[];
  loading?: boolean;
  onLoadTemplate?: (template: Template) => void;
}

// The main component that uses the context
const TemplateBuilderContent: React.FC = () => {
  // Get all state and actions from context
  const {
    // Basic state
    rank,
    rating,
    role,
    evalType,
    title,
    // Advanced section state - Personal Information
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
    showAdvanced,
    // Other state
    activeSection,
    showMetrics,
    showAIEnhancer,
    showBragSheet,
    showUserNotes,
    isEnhancing,
    sections,
    bragSheetEntries,
    aiSuggestions,
    isDemoMode,
    // Custom metrics
    customMetrics,
    // State setters
    setRank,
    setRating,
    setRole,
    setEvalType,
    setTitle,
    // Advanced section setters - Personal Information
    setName,
    setDesig,
    setSsn,
    // Status Information
    setDutyStatus,
    setUic,
    setShipStation,
    setPromotionStatus,
    setDateReported,
    // Report Information
    setOccasionForReport,
    // Period of Report
    setReportPeriod,
    // Report Type
    setNotObservedReport,
    setReportType,
    // Additional Information
    setPhysicalReadiness,
    setBilletSubcategory,
    // Command Information
    setCommandEmployment,
    setPrimaryDuties,
    // Counseling Information
    setCounselingInfo,
    setShowAdvanced,
    // Other setters
    setActiveSection,
    setShowMetrics,
    setShowAIEnhancer,
    setShowBragSheet,
    setShowUserNotes,
    // Actions
    handleSave,
    loadAdvancedData,
    clearDemoData,
    // Template actions
    updateSectionTextAction,
    addBragSheetEntryAction,
    addNewBragSheetEntryAction,
    updateBragSheetEntryAction,
    deleteBragSheetEntryAction,
    addMetricToSectionAction,
    addCustomMetricAction,
    deleteMetricAction,
    enhanceWithAIAction,
    applyAISuggestionAction,
    // Utilities
    toast: addToast,
    // Templates
    templates,
    loading,
    onLoadTemplate,
    // Cancel action
    onCancel
  } = useTemplate();
  
  // Use the template dialogs hook
  const dialogsHook = useTemplateDialogs({
    onLoadTemplateAction: onLoadTemplate,
    loadAdvancedDataAction: loadAdvancedData,
    clearDemoDataAction: clearDemoData,
    handleSaveAction: handleSave,
    setTitleAction: setTitle,
    showAdvanced,
    setShowAdvancedAction: setShowAdvanced
  });

  // Use the template handlers hook
  const handlersHook = useTemplateHandlers({
    setActiveSectionAction: setActiveSection,
    updateSectionTextAction,
    addCustomMetricAction,
    deleteMetricAction,
    addNewBragSheetEntryAction
  });

  // Ensure that section content is saved when switching between sections
  const handleSectionChange = useCallback((sectionKey: string) => {
    // We no longer need to save the current section content before switching
    // as the content is now saved immediately when edited in the TemplateContentEditor
    
    // Just change to the new section
    handlersHook.handleSectionChange(sectionKey);
  }, [handlersHook]);

  // No longer needed - removed logging effect

  // Prepare template data for saving - memoized to avoid unnecessary recalculations
  const templateData = useMemo((): EvaluationTemplateData => {
    return {
      title: title,
      rank,
      rating,
      role,
      evalType,
      
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
      
      // Core data
      sections,
      bragSheetEntries,
      isDemoMode
    };
  }, [
    title, rank, rating, role, evalType,
    name, desig, ssn,
    dutyStatus, uic, shipStation, promotionStatus, dateReported,
    occasionForReport, reportPeriod, notObservedReport, reportType,
    physicalReadiness, billetSubcategory,
    commandEmployment, primaryDuties, counselingInfo,
    sections, bragSheetEntries, isDemoMode
  ]);

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      {/* Header with title and controls */}
      <TemplateHeader
        title={title}
        rank={rank}
        rating={rating}
        role={role}
        evalType={evalType}
        // Advanced section props - Personal Information
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
        // UI state
        showAdvanced={showAdvanced}
        // Actions
        onTitleChangeAction={setTitle}
        onRankChangeAction={setRank}
        onRatingChangeAction={setRating}
        onRoleChangeAction={setRole}
        onEvalTypeChangeAction={setEvalType}
        // Advanced section actions - Personal Information
        onNameChangeAction={setName}
        onDesigChangeAction={setDesig}
        onSsnChangeAction={setSsn}
        // Status Information
        onDutyStatusChangeAction={setDutyStatus}
        onUicChangeAction={setUic}
        onShipStationChangeAction={setShipStation}
        onPromotionStatusChangeAction={setPromotionStatus}
        onDateReportedChangeAction={setDateReported}
        // Report Information
        onOccasionForReportChangeAction={setOccasionForReport}
        // Period of Report
        onReportPeriodChangeAction={setReportPeriod}
        // Report Type
        onNotObservedReportChangeAction={setNotObservedReport}
        onReportTypeChangeAction={setReportType}
        // Additional Information
        onPhysicalReadinessChangeAction={setPhysicalReadiness}
        onBilletSubcategoryChangeAction={setBilletSubcategory}
        // Command Information
        onCommandEmploymentChangeAction={setCommandEmployment}
        onPrimaryDutiesChangeAction={setPrimaryDuties}
        // Counseling Information
        onCounselingInfoChangeAction={setCounselingInfo}
        // UI actions
        onToggleAdvancedAction={dialogsHook.toggleAdvancedSection}
        onLoadAdvancedDataAction={dialogsHook.openLoadAdvancedDataDialog}
        // Other actions
        onSaveAction={dialogsHook.openSaveDialog}
        onCancelAction={onCancel} // Pass the onCancel prop from the parent component
        onLoadAction={dialogsHook.openLoadDialog}
      />
      
      {/* Dialogs */}
      <TemplateDialogs
        isSaveDialogOpen={dialogsHook.isSaveDialogOpen}
        isLoadDialogOpen={dialogsHook.isLoadDialogOpen}
        isLoadAdvancedDataDialogOpen={dialogsHook.isLoadAdvancedDataDialogOpen}
        isClearDemoDialogOpen={dialogsHook.isClearDemoDialogOpen}
        setIsSaveDialogOpenAction={dialogsHook.setIsSaveDialogOpen}
        setIsLoadDialogOpenAction={dialogsHook.setIsLoadDialogOpen}
        setIsLoadAdvancedDataDialogOpenAction={dialogsHook.setIsLoadAdvancedDataDialogOpen}
        setIsClearDemoDialogOpenAction={dialogsHook.setIsClearDemoDialogOpen}
        handleSaveWithCustomTitleAction={dialogsHook.handleSaveWithCustomTitle}
        handleLoadTemplateAction={dialogsHook.handleLoadTemplate}
        handleLoadAdvancedDataAction={dialogsHook.handleLoadAdvancedData}
        handleConfirmClearDemoAction={dialogsHook.handleConfirmClearDemo}
        templateData={templateData}
        templates={templates || []}
        loading={loading || false}
        title={title}
      />
      
      {/* Progress Indicator */}
      <TemplateProgress sections={sections} />
      
      {/* Feature Toggle Buttons */}
      <TemplateFeatureToggles
        showMetrics={showMetrics}
        showAIEnhancer={showAIEnhancer}
        showBragSheet={showBragSheet}
        isDemoMode={isDemoMode}
        onToggleMetricsAction={() => setShowMetrics(!showMetrics)}
        onToggleAIEnhancerAction={() => setShowAIEnhancer(!showAIEnhancer)}
        onToggleBragSheetAction={() => setShowBragSheet(!showBragSheet)}
        onClearDemoAction={dialogsHook.handleClearDemoClick}
      />
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Sections Navigation and AI Enhancer */}
        <TemplateLeftSidebar
          sections={sections}
          activeSection={activeSection}
          showAIEnhancer={showAIEnhancer}
          aiSuggestions={aiSuggestions}
          isEnhancing={isEnhancing}
          rating={rating}
          role={role}
          isDemoMode={isDemoMode}
          onSectionChangeAction={handleSectionChange}
          onApplySuggestionAction={applyAISuggestionAction}
          onEnhanceWithAIAction={enhanceWithAIAction}
        />
        
        {/* Content Editor */}
        <div className="lg:col-span-6">
          <TemplateContentEditor
            sections={sections}
            activeSection={activeSection}
            rank={rank}
            rating={rating}
            role={role}
            evalType={evalType}
            isEnhancing={isEnhancing}
            // Advanced options data
            name={name}
            desig={desig}
            dutyStatus={dutyStatus}
            uic={uic}
            shipStation={shipStation}
            promotionStatus={promotionStatus}
            dateReported={dateReported}
            occasionForReport={occasionForReport}
            reportPeriod={reportPeriod}
            notObservedReport={notObservedReport}
            reportType={reportType}
            physicalReadiness={physicalReadiness}
            billetSubcategory={billetSubcategory}
            commandEmployment={commandEmployment}
            primaryDuties={primaryDuties}
            counselingInfo={counselingInfo}
            onUpdateSectionTextAction={handlersHook.handleUpdateSectionText}
            onEnhanceWithAIAction={enhanceWithAIAction}
          />
        </div>
        
        {/* Right Sidebar - Custom Metrics & Brag Sheet */}
        <TemplateRightSidebar
          showMetrics={showMetrics}
          showBragSheet={showBragSheet}
          activeSection={activeSection}
          rating={rating}
          role={role}
          bragSheetEntries={bragSheetEntries}
          customMetrics={customMetrics || {
            professional: [],
            quality: [],
            climate: [],
            military: [],
            accomplishment: [],
            teamwork: [],
            leadership: []
          }}
          onAddMetricAction={(metric) => {
            addMetricToSectionAction(metric);
          }}
          onAddCustomMetricAction={handlersHook.handleAddCustomMetric}
          onDeleteMetricAction={handlersHook.handleDeleteMetric}
          onAddBragSheetEntryAction={handlersHook.handleAddBragSheetEntry}
          onSelectBragSheetEntryAction={addBragSheetEntryAction}
          onDeleteBragSheetEntryAction={deleteBragSheetEntryAction}
          onUpdateBragSheetEntryAction={updateBragSheetEntryAction}
          addToastAction={addToast}
        />

        {/* User Notes Sidebar removed */}
      </div>
    </div>
  );
};

// Memoize the TemplateBuilderContent component to prevent unnecessary re-renders
const MemoizedTemplateBuilderContent = memo(TemplateBuilderContent);

// The main component that provides the context
const EvaluationTemplateBuilder: React.FC<EvaluationTemplateBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  onDelete,
  onSaveCustomMetric,
  onDeleteCustomMetric,
  loadCustomMetrics,
  clearAllCustomMetrics,
  templates = [],
  loading = false,
  onLoadTemplate
}) => {
  return (
    <TemplateProvider
      initialData={initialData}
      onSaveAction={onSave}
      onCancelAction={onCancel}
      onSaveCustomMetric={onSaveCustomMetric}
      onDeleteCustomMetric={onDeleteCustomMetric}
      loadCustomMetrics={loadCustomMetrics}
      clearAllCustomMetrics={clearAllCustomMetrics}
      templates={templates}
      loading={loading}
      onLoadTemplate={onLoadTemplate}
    >
      <MemoizedTemplateBuilderContent />
    </TemplateProvider>
  );
};

export default EvaluationTemplateBuilder;