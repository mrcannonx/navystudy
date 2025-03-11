"use client"

import { useCallback } from 'react';
import {
  TemplateSections,
  BragSheetEntry,
  AISuggestion,
  MetricsLibrary,
  SectionKey
} from '../types';
import { ToastProps } from '../types';
import { updateSectionText, replaceTextInSection } from '../utils/section-utils';
import { 
  markBragSheetEntryAsAdded, 
  addBragSheetEntry as addBragEntry,
  deleteBragSheetEntry as deleteBragEntry,
  addBragSheetEntryToSection
} from '../utils/brag-sheet-utils';
import { 
  addMetricToSection as addMetricToSectionUtil,
  addCustomMetric as addCustomMetricUtil,
  deleteMetric as deleteMetricUtil
} from '../utils/metrics-utils';
import { enhanceWithAI } from '../utils/ai-enhancement-utils';

interface UseTemplateActionsProps {
  sections: TemplateSections;
  setSectionsAction: (sections: TemplateSections) => void;
  bragSheetEntries: BragSheetEntry[];
  setBragSheetEntriesAction: (entries: BragSheetEntry[]) => void;
  aiSuggestions: AISuggestion[];
  setAiSuggestionsAction: (updater: (prev: AISuggestion[]) => AISuggestion[]) => void;
  isEnhancing: boolean;
  setIsEnhancingAction: (isEnhancing: boolean) => void;
  activeSection: SectionKey;
  customMetrics: MetricsLibrary;
  setCustomMetricsAction: (metrics: MetricsLibrary) => void;
  addToastAction: (props: ToastProps) => void;
  onSaveCustomMetric?: (metric: string, section: string) => void;
  onDeleteCustomMetric?: (metric: string, section: string) => void;
  isDemoMode?: boolean;
  setIsDemoMode?: (isDemoMode: boolean) => void;
}

export const useTemplateActions = ({
  sections,
  setSectionsAction,
  bragSheetEntries,
  setBragSheetEntriesAction,
  aiSuggestions,
  setAiSuggestionsAction,
  isEnhancing,
  setIsEnhancingAction,
  activeSection,
  customMetrics,
  setCustomMetricsAction,
  addToastAction,
  onSaveCustomMetric,
  onDeleteCustomMetric,
  isDemoMode,
  setIsDemoMode
}: UseTemplateActionsProps) => {
  
  // Section actions
  const updateSectionTextAction = useCallback((sectionKey: string, newText: string) => {
    // Always update the section with the exact text provided
    // This ensures that edits to AI-enhanced text are preserved
    setSectionsAction(updateSectionText(sections, sectionKey as SectionKey, newText));
  }, [sections, setSectionsAction]);

  // Brag sheet actions
  const addBragSheetEntryAction = useCallback(async (entry: BragSheetEntry) => {
    try {
      // Update brag sheet entry to show it's been added
      setBragSheetEntriesAction(markBragSheetEntryAsAdded(bragSheetEntries, entry.id));
      
      // Show loading toast
      addToastAction({
        title: 'Processing',
        description: 'Integrating metrics with description...'
      });
      
      // Add entry to the current section text (now async)
      const updatedSections = await addBragSheetEntryToSection(sections, entry);
      setSectionsAction(updatedSections);
      
      // Show success toast with appropriate message
      const isReAdding = entry.added;
      addToastAction({
        title: 'Success',
        description: isReAdding
          ? `Re-added "${entry.title}" to ${entry.category} section`
          : `Added "${entry.title}" to ${entry.category} section`
      });
    } catch (error) {
      console.error('Error in addBragSheetEntryAction:', error);
      
      // Show error toast
      addToastAction({
        title: 'Error',
        description: 'Failed to add entry to evaluation. Please try again.',
        variant: 'destructive'
      });
    }
  }, [bragSheetEntries, setBragSheetEntriesAction, sections, setSectionsAction, addToastAction]);

  const addNewBragSheetEntryAction = useCallback((entry: Omit<BragSheetEntry, 'id'>) => {
    setBragSheetEntriesAction(addBragEntry(bragSheetEntries, entry));
  }, [bragSheetEntries, setBragSheetEntriesAction]);
  
  const updateBragSheetEntryAction = useCallback((updatedEntry: BragSheetEntry) => {
    // Update the entry in the brag sheet entries array
    const updatedEntries = bragSheetEntries.map(entry =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    
    setBragSheetEntriesAction(updatedEntries);
    
    addToastAction({
      title: 'Success',
      description: 'Accomplishment updated successfully',
    });
  }, [bragSheetEntries, setBragSheetEntriesAction, addToastAction]);
  
  const deleteBragSheetEntryAction = useCallback((entryId: number | string) => {
    setBragSheetEntriesAction(deleteBragEntry(bragSheetEntries, entryId));
    
    addToastAction({
      title: 'Success',
      description: 'Accomplishment deleted successfully',
    });
  }, [bragSheetEntries, setBragSheetEntriesAction, addToastAction]);

  // Metrics actions
  const addMetricToSectionAction = useCallback((metric: string) => {
    // Check if the active section exists in sections
    if (!sections[activeSection]) {
      // Section doesn't exist, just return silently
      return;
    }
    
    // Add the metric to the section
    try {
      // Get the current section content
      const currentSection = sections[activeSection];
      const currentText = currentSection.placeholder || '';
      
      // Format the metric as a bullet point if it's not already
      const formattedMetric = metric.trim().startsWith('-')
        ? metric.trim()
        : `- ${metric.trim()}`;
      
      // Create the new text by appending the metric
      const newText = currentText.trim()
        ? `${currentText.trim()}\n${formattedMetric}`
        : formattedMetric;
      
      // Use the addMetricToSectionUtil function which properly handles deep copying
      // This ensures the section is properly updated with the new metric
      const updatedSections = addMetricToSectionUtil(sections, activeSection, metric);
      
      // Update the state with the new sections object
      setSectionsAction(updatedSections);
      
      // Show success toast
      addToastAction({
        title: 'Metric Added',
        description: `Added metric to ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section`
      });
    } catch (error) {
      addToastAction({
        title: 'Error',
        description: 'Failed to add metric to section'
      });
    }
  }, [sections, setSectionsAction, activeSection, addToastAction]);

  const addCustomMetricAction = useCallback(async (metric: string, section: string) => {
    // Update the customMetrics object to include the new metric for future use
    if (metric && section) {
      try {
        // First, update the local customMetrics state to include the new metric
        // This ensures the UI is updated immediately
        const sectionKey = section as SectionKey;
        
        // Only add if it doesn't already exist
        if (!customMetrics[sectionKey]?.includes(metric)) {
          // Create a new customMetrics object with the new metric added
          const updatedMetrics = {
            ...customMetrics,
            [sectionKey]: [
              ...(customMetrics[sectionKey] || []),
              metric
            ]
          };
          
          // Update the customMetrics state
          setCustomMetricsAction(updatedMetrics);
          
          // Log the updated metrics for debugging
          if (process.env.NODE_ENV === 'development') {
            console.debug('Updated metrics library:', updatedMetrics);
          }
        }
        
        // Save to database if onSaveCustomMetric is provided
        if (onSaveCustomMetric) {
          await onSaveCustomMetric(metric, section);
          
          // Show success toast
          addToastAction({
            title: 'Success',
            description: 'Custom metric saved to your library',
          });
        } else {
          // Show success message if no save function is provided
          addToastAction({
            title: 'Success',
            description: 'Custom metric added successfully',
          });
        }
        
        // Add the metric to the section text
        addMetricToSectionAction(metric);
      } catch (error) {
        console.error('Error adding custom metric:', error);
        addToastAction({
          title: 'Error',
          description: 'Failed to save custom metric. Please try again.',
          variant: 'destructive'
        });
      }
    }
  }, [customMetrics, setCustomMetricsAction, onSaveCustomMetric, addToastAction, addMetricToSectionAction]);

  const deleteMetricAction = useCallback((metric: string, section: string) => {
    // Always call onDeleteCustomMetric if provided, regardless of whether the metric exists in memory
    if (metric && section) {
      try {
        // First, update the local customMetrics state to remove the metric
        // This ensures the UI is updated immediately
        const sectionKey = section as SectionKey;
        
        if (customMetrics[sectionKey]?.includes(metric)) {
          // Create a new customMetrics object with the metric removed
          const updatedMetrics = {
            ...customMetrics,
            [sectionKey]: customMetrics[sectionKey].filter(m => m !== metric)
          };
          
          // Update the customMetrics state
          setCustomMetricsAction(updatedMetrics);
          
          // Log the updated metrics for debugging
          if (process.env.NODE_ENV === 'development') {
            console.debug('Updated metrics library after deletion:', updatedMetrics);
          }
        }
        
        // Save to database if onDeleteCustomMetric is provided
        if (onDeleteCustomMetric) {
          onDeleteCustomMetric(metric, section);
          
          // Show success message
          addToastAction({
            title: 'Success',
            description: 'Metric deleted successfully',
          });
        } else {
          // Show error message if no delete function is provided
          addToastAction({
            title: 'Error',
            description: 'Unable to delete metric - no delete function provided',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error deleting custom metric:', error);
        addToastAction({
          title: 'Error',
          description: 'Failed to delete custom metric. Please try again.',
          variant: 'destructive'
        });
      }
    }
  }, [customMetrics, setCustomMetricsAction, onDeleteCustomMetric, addToastAction]);

  // AI enhancement actions
  const enhanceWithAIAction = useCallback(async (text: string, rating?: string, role?: string) => {
    await enhanceWithAI(text, activeSection, setIsEnhancingAction, setAiSuggestionsAction, addToastAction, setIsDemoMode, rating, role);
  }, [activeSection, setIsEnhancingAction, setAiSuggestionsAction, addToastAction, setIsDemoMode]);

  const applyAISuggestionAction = useCallback((suggestion: AISuggestion) => {
    setSectionsAction(replaceTextInSection(
      sections, 
      activeSection, 
      suggestion.original, 
      suggestion.improved
    ));
  }, [sections, setSectionsAction, activeSection]);

  return {
    // Section actions
    updateSectionTextAction,
    
    // Brag sheet actions
    addBragSheetEntryAction,
    addNewBragSheetEntryAction,
    updateBragSheetEntryAction,
    deleteBragSheetEntryAction,
    
    // Metrics actions
    addMetricToSectionAction,
    addCustomMetricAction,
    deleteMetricAction,
    
    // AI enhancement actions
    enhanceWithAIAction,
    applyAISuggestionAction
  };
};