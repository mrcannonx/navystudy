"use client"

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import {
  TemplateSections,
  BragSheetEntry,
  AISuggestion,
  EvaluationTemplateData,
  MetricsLibrary,
  SectionKey
} from '../types';
import { useTemplateBuilder } from '../hooks/useTemplateBuilder';
import { useTemplateActions } from '../hooks/useTemplateActions';
import { Template } from '../hooks/useTemplates';
import { useCustomMetrics } from '../hooks/useCustomMetrics';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define the context type
interface TemplateContextType {
  // State
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  title: string;
  // Advanced section state - Personal Information
  name?: string;
  desig?: string;
  ssn?: string;
  
  // Status Information
  dutyStatus: {
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
  occasionForReport: {
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
  reportType: {
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
  // Other state
  activeSection: SectionKey;
  showMetrics: boolean;
  showAIEnhancer: boolean;
  showBragSheet: boolean;
  showUserNotes: boolean;
  isEnhancing: boolean;
  sections: TemplateSections;
  bragSheetEntries: BragSheetEntry[];
  aiSuggestions: AISuggestion[];
  isDemoMode: boolean;
  showAdvanced: boolean;
  isLoadAdvancedDataDialogOpen: boolean;
  customMetrics: MetricsLibrary;
  
  // State setters
  setRank: (rank: string) => void;
  setRating: (rating: string) => void;
  setRole: (role: string) => void;
  setEvalType: (evalType: string) => void;
  setTitle: (title: string) => void;
  // Advanced section setters - Personal Information
  setName: (name: string) => void;
  setDesig: (desig: string) => void;
  setSsn: (ssn: string) => void;
  
  // Status Information
  setDutyStatus: (status: any) => void;
  setUic: (uic: string) => void;
  setShipStation: (shipStation: string) => void;
  setPromotionStatus: (status: string) => void;
  setDateReported: (date: string) => void;
  
  // Report Information
  setOccasionForReport: (report: any) => void;
  
  // Period of Report
  setReportPeriod: (period: any) => void;
  
  // Report Type
  setNotObservedReport: (notObserved: boolean) => void;
  setReportType: (type: any) => void;
  
  // Additional Information
  setPhysicalReadiness: (readiness: string) => void;
  setBilletSubcategory: (subcategory: string) => void;
  
  // Command Information
  setCommandEmployment: (employment: string) => void;
  setPrimaryDuties: (duties: string) => void;
  
  // Counseling Information
  setCounselingInfo: (info: any) => void;
  
  // UI state
  setShowAdvanced: (show: boolean) => void;
  setIsLoadAdvancedDataDialogOpen: (isOpen: boolean) => void;
  // Other setters
  setActiveSection: (section: SectionKey) => void;
  setShowMetrics: (show: boolean) => void;
  setShowAIEnhancer: (show: boolean) => void;
  setShowBragSheet: (show: boolean) => void;
  setShowUserNotes: (show: boolean) => void;
  setIsEnhancing: (isEnhancing: boolean) => void;
  setSections: (sections: TemplateSections) => void;
  setBragSheetEntries: (entries: BragSheetEntry[]) => void;
  setAiSuggestions: (suggestions: AISuggestion[]) => void;
  setIsDemoMode: (isDemoMode: boolean) => void;
  
  // Actions
  handleSave: (customTemplateData?: EvaluationTemplateData) => void;
  loadAdvancedData: (templateData: EvaluationTemplateData) => void;
  clearDemoData: () => void;
  onCancel: () => void;
  
  // Template actions
  updateSectionTextAction: (sectionKey: SectionKey, newText: string) => void;
  addBragSheetEntryAction: (entry: BragSheetEntry) => Promise<void>;
  addNewBragSheetEntryAction: (entry: Omit<BragSheetEntry, 'id'>) => void;
  updateBragSheetEntryAction: (entry: BragSheetEntry) => void;
  deleteBragSheetEntryAction: (entryId: number | string) => void;
  addMetricToSectionAction: (metric: string) => void;
  addCustomMetricAction: (metric: string, section: SectionKey) => void;
  deleteMetricAction: (metric: string, section: SectionKey) => void;
  enhanceWithAIAction: (text: string) => Promise<void>;
  applyAISuggestionAction: (suggestion: AISuggestion) => void;
  
  // Utilities
  toast: (props: import('../types').ToastProps) => void;
  
  // Templates
  templates?: Template[];
  loading?: boolean;
  onLoadTemplate?: (template: Template) => void;
}

// Create the context with a default undefined value
const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Provider props
interface TemplateProviderProps {
  children: ReactNode;
  initialData?: Partial<EvaluationTemplateData>;
  onSaveAction: (data: EvaluationTemplateData) => void;
  onCancelAction: () => void;
  onSaveCustomMetric?: (metric: string, section: string) => void;
  onDeleteCustomMetric?: (metric: string, section: string) => void;
  loadCustomMetrics?: () => Promise<void>;
  clearAllCustomMetrics?: () => Promise<void>;
  templates?: Template[];
  loading?: boolean;
  onLoadTemplate?: (template: Template) => void;
}

// Provider component
export const TemplateProvider: React.FC<TemplateProviderProps> = ({
  children,
  initialData,
  onSaveAction,
  onCancelAction,
  onSaveCustomMetric,
  onDeleteCustomMetric,
  loadCustomMetrics,
  clearAllCustomMetrics,
  templates = [],
  loading = false,
  onLoadTemplate
}) => {
  // Use the template builder hook to manage state
  const templateBuilder = useTemplateBuilder({
    initialData,
    onSaveAction,
    onSaveCustomMetric,
    onDeleteCustomMetric,
    loadCustomMetrics,
    clearAllCustomMetrics
  });
  
  // Create a state to hold custom metrics
  const [customMetricsState, setCustomMetricsState] = useState<MetricsLibrary>({
    professional: [],
    quality: [],
    climate: [],
    military: [],
    accomplishment: [],
    teamwork: [],
    leadership: []
  });
  
  // Create a function to update the custom metrics state
  const updateCustomMetricsState = useCallback((metrics: MetricsLibrary) => {
    setCustomMetricsState(metrics);
  }, []);
  
  // This effect will run once on mount to load custom metrics
  useEffect(() => {
    if (loadCustomMetrics) {
      // Create a wrapper function to capture the metrics after loading
      const loadAndUpdateMetrics = async () => {
        try {
          // Call the original loadCustomMetrics function
          await loadCustomMetrics();
          
          // Get the current session to fetch metrics
          const supabaseClient = createClientComponentClient();
          const { data: { session } } = await supabaseClient.auth.getSession();
          
          if (session) {
            const authenticatedUserId = session.user.id;
            
            // Fetch custom metrics directly
            const { data, error } = await supabaseClient
              .from('custom_metrics')
              .select('*')
              .eq('user_id', authenticatedUserId);
              
            if (error) throw error;
            
            // Process the metrics into the correct format
            const updatedMetrics: MetricsLibrary = {
              professional: [],
              quality: [],
              climate: [],
              military: [],
              accomplishment: [],
              teamwork: [],
              leadership: []
            };
            
            if (data && data.length > 0) {
              data.forEach(item => {
                const sectionKey = item.section as SectionKey;
                if (!updatedMetrics[sectionKey]) {
                  updatedMetrics[sectionKey] = [];
                }
                
                if (!updatedMetrics[sectionKey].includes(item.metric)) {
                  updatedMetrics[sectionKey].push(item.metric);
                }
              });
            }
            
            // Update the state with the fetched metrics
            setCustomMetricsState(updatedMetrics);
          }
        } catch (error) {
          console.error('Error loading custom metrics:', error);
        }
      };
      
      loadAndUpdateMetrics();
    }
  }, []);

  // Use the template actions hook to handle actions
  const templateActions = useTemplateActions({
    sections: templateBuilder.sections,
    setSectionsAction: templateBuilder.setSections,
    bragSheetEntries: templateBuilder.bragSheetEntries,
    setBragSheetEntriesAction: templateBuilder.setBragSheetEntries,
    aiSuggestions: templateBuilder.aiSuggestions,
    setAiSuggestionsAction: templateBuilder.setAiSuggestions,
    isEnhancing: templateBuilder.isEnhancing,
    setIsEnhancingAction: templateBuilder.setIsEnhancing,
    activeSection: templateBuilder.activeSection as SectionKey,
    customMetrics: customMetricsState, // Use the state we created
    setCustomMetricsAction: setCustomMetricsState, // Pass the setter function
    addToastAction: templateBuilder.toast,
    onSaveCustomMetric,
    onDeleteCustomMetric,
    isDemoMode: templateBuilder.isDemoMode,
    setIsDemoMode: templateBuilder.setIsDemoMode
  });
  
  // Combine all values into a single context value
  const contextValue: TemplateContextType = {
    ...templateBuilder,
    ...templateActions,
    templates,
    loading,
    onLoadTemplate,
    onCancel: onCancelAction,
    customMetrics: customMetricsState
  } as TemplateContextType; // Type assertion to handle any type mismatches
  
  return (
    <TemplateContext.Provider value={contextValue}>
      {children}
    </TemplateContext.Provider>
  );
};

// Custom hook to use the template context
export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};