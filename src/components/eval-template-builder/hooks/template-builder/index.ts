"use client"

import { EvaluationTemplateData } from '../../types';
import { useTemplateBasicInfo } from './useTemplateBasicInfo';
import { useTemplatePersonalInfo } from './useTemplatePersonalInfo';
import { useTemplateReportInfo } from './useTemplateReportInfo';
import { useTemplateCommandInfo } from './useTemplateCommandInfo';
import { useTemplateUIState } from './useTemplateUIState';
import { useTemplateSections } from './useTemplateSections';
import { useTemplateBragSheet } from './useTemplateBragSheet';
import { useTemplateAIEnhancement } from './useTemplateAIEnhancement';
import { useTemplateDataOperations } from './useTemplateDataOperations';

interface UseTemplateBuilderProps {
  initialData?: Partial<EvaluationTemplateData>;
  onSaveAction: (data: EvaluationTemplateData) => void;
  onSaveCustomMetric?: (metric: string, section: string) => void;
  onDeleteCustomMetric?: (metric: string, section: string) => void;
  loadCustomMetrics?: () => Promise<void>;
  clearAllCustomMetrics?: () => Promise<void>;
}

export const useTemplateBuilder = (props: UseTemplateBuilderProps) => {
  // Initialize all the individual hooks
  const basicInfo = useTemplateBasicInfo({ initialData: props.initialData });
  const personalInfo = useTemplatePersonalInfo({ initialData: props.initialData });
  const reportInfo = useTemplateReportInfo({ initialData: props.initialData });
  const commandInfo = useTemplateCommandInfo({ initialData: props.initialData });
  const uiState = useTemplateUIState();
  const sections = useTemplateSections({ initialData: props.initialData });
  const bragSheet = useTemplateBragSheet({ initialData: props.initialData });
  const aiEnhancement = useTemplateAIEnhancement({ 
    initialData: props.initialData, 
    activeSection: uiState.activeSection 
  });
  
  // Initialize data operations with all the state and setters from other hooks
  const dataOperations = useTemplateDataOperations({
    onSaveAction: props.onSaveAction,
    onSaveCustomMetric: props.onSaveCustomMetric,
    onDeleteCustomMetric: props.onDeleteCustomMetric,
    
    // Pass all state from other hooks
    ...basicInfo,
    ...personalInfo,
    ...reportInfo,
    ...commandInfo,
    sections: sections.sections,
    bragSheetEntries: bragSheet.bragSheetEntries,
    isDemoMode: aiEnhancement.isDemoMode,
    
    // Pass required setters for operations
    setIsDemoModeAction: aiEnhancement.setIsDemoMode,
    setSectionsAction: sections.setSections,
    setBragSheetEntriesAction: bragSheet.setBragSheetEntries,
    setAiSuggestionsAction: aiEnhancement.setAiSuggestions,
    setIsLoadAdvancedDataDialogOpenAction: uiState.setIsLoadAdvancedDataDialogOpen,
    
    // Pass setters for basic information (needed for reset)
    setRankAction: basicInfo.setRank,
    setRatingAction: basicInfo.setRating,
    setRoleAction: basicInfo.setRole,
    
    // Pass custom metrics operations
    loadCustomMetrics: props.loadCustomMetrics
  });

  // Return a merged object with all the state and functions from all hooks
  return {
    // State and setters from basicInfo
    ...basicInfo,
    
    // State and setters from personalInfo
    ...personalInfo,
    
    // State and setters from reportInfo
    ...reportInfo,
    
    // State and setters from commandInfo
    ...commandInfo,
    
    // State and setters from uiState
    ...uiState,
    
    // State and functions from sections
    ...sections,
    
    // State and functions from bragSheet
    ...bragSheet,
    
    // State and functions from aiEnhancement
    ...aiEnhancement,
    
    // Functions from dataOperations
    ...dataOperations
  };
};