"use client"

import { useToast } from '@/components/ui/use-toast';
import { EvaluationTemplateData, TemplateSections, BragSheetEntry, ToastProps } from '../../types';
import { transformCounselingInfoToBackend, transformTemplateDataFromBackend } from '../../utils/data-transformers';

interface UseTemplateDataOperationsProps {
  onSaveAction: (data: EvaluationTemplateData) => void;
  onSaveCustomMetric?: (metric: string, section: string) => void;
  onDeleteCustomMetric?: (metric: string, section: string) => void;
  
  // Basic template information
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  title: string;
  
  // Setters for basic information (needed for reset)
  setRankAction?: (rank: string) => void;
  setRatingAction?: (rating: string) => void;
  setRoleAction?: (role: string) => void;
  
  // Personal Information
  name: string;
  desig: string;
  ssn: string;
  
  // Status Information
  dutyStatus: {
    act: boolean;
    fts: boolean;
    inact: boolean;
    atAdswDrilling: boolean;
  };
  uic: string;
  shipStation: string;
  promotionStatus: string;
  dateReported: string;
  
  // Report Information
  occasionForReport: {
    periodic: boolean;
    detachment: boolean;
    promotionFrocking: boolean;
    special: boolean;
  };
  
  // Period of Report
  reportPeriod: {
    from: string;
    to: string;
  };
  
  // Report Type
  notObservedReport: boolean;
  reportType: {
    regular: boolean;
    concurrent: boolean;
  };
  
  // Additional Information
  physicalReadiness: string;
  billetSubcategory: string;
  
  // Command Information
  commandEmployment: string;
  primaryDuties: string;
  
  // Counseling Information
  counselingInfo: {
    dateCounseled: string;
    counselor: string;
    signature: boolean;
  };
  
  // Core data
  sections: TemplateSections;
  bragSheetEntries: BragSheetEntry[];
  isDemoMode: boolean;
  
  // Functions needed for operations
  setIsDemoModeAction: (isDemoMode: boolean) => void;
  setSectionsAction: (sections: TemplateSections | ((prev: TemplateSections) => TemplateSections)) => void;
  setBragSheetEntriesAction: (entries: BragSheetEntry[] | ((prev: BragSheetEntry[]) => BragSheetEntry[])) => void;
  setAiSuggestionsAction: (updater: (prev: any[]) => any[]) => void;
  setIsLoadAdvancedDataDialogOpenAction: (isOpen: boolean) => void;
  
  // Custom metrics operations
  loadCustomMetrics?: () => Promise<void>;
  clearAllCustomMetrics?: () => Promise<void>;
}

export const useTemplateDataOperations = ({
  onSaveAction,
  onSaveCustomMetric,
  onDeleteCustomMetric,
  
  // All the state from other hooks
  rank,
  rating,
  role,
  evalType,
  title,
  
  // Setters for basic information
  setRankAction,
  setRatingAction,
  setRoleAction,
  name,
  desig,
  ssn,
  dutyStatus,
  uic,
  shipStation,
  promotionStatus,
  dateReported,
  occasionForReport,
  reportPeriod,
  notObservedReport,
  reportType,
  physicalReadiness,
  billetSubcategory,
  commandEmployment,
  primaryDuties,
  counselingInfo,
  sections,
  bragSheetEntries,
  isDemoMode,
  
  // Functions needed for operations
  setIsDemoModeAction,
  setSectionsAction,
  setBragSheetEntriesAction,
  setAiSuggestionsAction,
  setIsLoadAdvancedDataDialogOpenAction,
  
  // Custom metrics operations
  loadCustomMetrics,
  clearAllCustomMetrics
}: UseTemplateDataOperationsProps) => {
  const { toast } = useToast();

  const handleSave = (customTemplateData?: EvaluationTemplateData) => {
    console.log("useTemplateBuilder - handleSave called");
    
    // Prepare data for saving
    const templateData: EvaluationTemplateData = customTemplateData || {
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
      counselingInfo: {
        ...counselingInfo,
        // Ensure dateCounseled is properly set
        dateCounseled: counselingInfo?.dateCounseled || ''
      },
      
      // Core data
      sections,
      bragSheetEntries,
      isDemoMode
    };
    
    // Log the original template data
    console.log("useTemplateBuilder - Original templateData:", templateData);
    
    // Create a transformed version of the data for backend compatibility
    const backendData = {
      ...templateData,
      // Transform counselingInfo to snake_case format
      counselingInfo: {
        dateCounseled: counselingInfo.dateCounseled || '',
        counselor: counselingInfo.counselor || '',
        signature: counselingInfo.signature || false,
        // Add snake_case versions for backend compatibility
        date_counseled: counselingInfo.dateCounseled || '',
        counselor_name: counselingInfo.counselor || ''
      }
    };
    
    // Log the transformed template data
    console.log("useTemplateBuilder - Transformed templateData for backend:", backendData);
    
    // Call the save action with the transformed data
    onSaveAction(backendData);
  };

  // Function to load only advanced data from a template
  const loadAdvancedData = (templateData: EvaluationTemplateData) => {
    console.log("loadAdvancedData - Original data:", templateData);
    
    // Transform the data to use camelCase for frontend compatibility
    const transformedData = transformTemplateDataFromBackend(templateData);
    console.log("loadAdvancedData - Transformed data for frontend:", transformedData);
    
    // Show toast notification
    toast({
      title: "Advanced data loaded",
      description: "Advanced data has been loaded from the selected template.",
      variant: "default"
    });
    
    // Close the dialog
    setIsLoadAdvancedDataDialogOpenAction(false);
    
    // Return the transformed data for use by the caller
    return transformedData;
  };

  // Function to completely reset all data to initial state
  const clearDemoData = async () => {
    // Create empty sections with the same structure but no content
    const emptySections = { ...sections };
    Object.keys(emptySections).forEach(key => {
      emptySections[key as keyof typeof emptySections] = {
        ...emptySections[key as keyof typeof emptySections],
        placeholder: "", // Clear all text content
        completed: false // Mark as not completed
      };
    });
    
    // Update state for sections and entries
    setSectionsAction(emptySections);
    setBragSheetEntriesAction([]); // Clear all brag sheet entries
    setAiSuggestionsAction(() => []); // Clear all AI suggestions
    
    // Reset personal information fields
    if (setRankAction) setRankAction(""); // Reset Rank/Rate to blank
    if (setRatingAction) setRatingAction(""); // Reset Rating to blank
    if (setRoleAction) setRoleAction(""); // Reset Role/Billet to blank
    
    // Turn off demo mode to prevent AI suggestions from regenerating
    setIsDemoModeAction(false);
    
    // Clear all custom metrics
    if (clearAllCustomMetrics) {
      try {
        await clearAllCustomMetrics();
        console.log("Custom metrics library cleared completely");
      } catch (error) {
        console.error("Failed to clear custom metrics library:", error);
      }
    }
    
    // Show toast notification
    toast({
      title: "All content cleared",
      description: "All content, personal information, metrics, and brag sheet items have been reset to default.",
      variant: "default"
    });
  };

  return {
    // Data operations
    handleSave,
    loadAdvancedData,
    clearDemoData,
    
    // Utilities
    toast,
    onSaveCustomMetric,
    onDeleteCustomMetric
  };
};