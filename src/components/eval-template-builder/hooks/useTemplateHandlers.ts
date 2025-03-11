"use client"

import { useCallback } from 'react';
import { SectionKey, BragSheetEntry } from '../types';

interface UseTemplateHandlersProps {
  setActiveSectionAction: (section: SectionKey) => void;
  updateSectionTextAction: (sectionKey: SectionKey, newText: string) => void;
  addCustomMetricAction: (metric: string, section: SectionKey) => void;
  deleteMetricAction: (metric: string, section: SectionKey) => void;
  addNewBragSheetEntryAction: (entry: Omit<BragSheetEntry, 'id'>) => void;
}

export function useTemplateHandlers({
  setActiveSectionAction,
  updateSectionTextAction,
  addCustomMetricAction,
  deleteMetricAction,
  addNewBragSheetEntryAction
}: UseTemplateHandlersProps) {
  // Type assertion functions to handle type mismatches
  const handleSectionChange = useCallback((section: string) => {
    // Make sure the section is a valid SectionKey before setting it
    const validSectionKeys = ['professional', 'quality', 'climate', 'military', 'accomplishment', 'teamwork', 'leadership', 'initiative'];
    
    console.log("handleSectionChange called with section:", section);
    
    if (!section) {
      console.error("Attempted to change to an undefined or null section");
      return;
    }
    
    if (validSectionKeys.includes(section)) {
      console.log(`Section change validated: ${section} is a valid section key`);
      console.log("About to call setActiveSectionAction");
      
      // Log before changing section
      console.log("Changing active section from current to:", section);
      
      // Update the active section - this will trigger the useEffect in TemplateContentEditor
      // which now properly handles section changes without losing edits
      setActiveSectionAction(section as SectionKey);
      
      console.log("Active section changed to:", section);
    } else {
      console.error(`Invalid section key: ${section}. Valid keys are: ${validSectionKeys.join(', ')}`);
    }
  }, [setActiveSectionAction]);

  const handleUpdateSectionText = useCallback((sectionKey: string, newText: string) => {
    // Validate the section key
    const validSectionKeys = ['professional', 'quality', 'climate', 'military', 'accomplishment', 'teamwork', 'leadership', 'initiative'];
    
    if (!sectionKey) {
      console.error("Attempted to update text for an undefined or null section key");
      return;
    }
    
    if (validSectionKeys.includes(sectionKey)) {
      console.log(`Updating text for section: ${sectionKey}`);
      updateSectionTextAction(sectionKey as SectionKey, newText);
    } else {
      console.error(`Invalid section key for text update: ${sectionKey}`);
    }
  }, [updateSectionTextAction]);

  const handleAddCustomMetric = useCallback((metric: string, section: string) => {
    addCustomMetricAction(metric, section as SectionKey);
  }, [addCustomMetricAction]);

  const handleDeleteMetric = useCallback((metric: string, section: string) => {
    deleteMetricAction(metric, section as SectionKey);
  }, [deleteMetricAction]);

  // Handle adding a new brag sheet entry
  const handleAddBragSheetEntry = useCallback((entry: Omit<BragSheetEntry, 'id'>) => {
    // The addNewBragSheetEntryAction expects an entry without id
    addNewBragSheetEntryAction(entry);
  }, [addNewBragSheetEntryAction]);

  return {
    handleSectionChange,
    handleUpdateSectionText,
    handleAddCustomMetric,
    handleDeleteMetric,
    handleAddBragSheetEntry
  };
}