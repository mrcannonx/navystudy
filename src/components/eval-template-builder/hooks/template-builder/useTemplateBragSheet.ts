"use client"

import { useState, useEffect } from 'react';
import { BragSheetEntry, EvaluationTemplateData } from '../../types';
import { defaultBragSheetEntries } from '../../template-data';

interface UseTemplateBragSheetProps {
  initialData?: Partial<EvaluationTemplateData>;
}

export const useTemplateBragSheet = ({ initialData }: UseTemplateBragSheetProps) => {
  // Initialize brag sheet entries from initialData if available
  const [bragSheetEntries, setBragSheetEntries] = useState<BragSheetEntry[]>(() => {
    if (initialData?.bragSheetEntries) {
      return initialData.bragSheetEntries;
    }
    return defaultBragSheetEntries;
  });

  // Update brag sheet entries when initialData changes
  useEffect(() => {
    if (initialData?.bragSheetEntries) {
      setBragSheetEntries(initialData.bragSheetEntries);
    }
  }, [initialData]);

  // Function to add a new brag sheet entry
  const addBragSheetEntry = (entry: BragSheetEntry) => {
    setBragSheetEntries(prev => [...prev, entry]);
  };

  // Function to update an existing brag sheet entry
  const updateBragSheetEntry = (id: number | string, updatedEntry: Partial<BragSheetEntry>) => {
    setBragSheetEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  // Function to remove a brag sheet entry
  const removeBragSheetEntry = (id: number | string) => {
    setBragSheetEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Function to mark a brag sheet entry as added to a section
  const markBragSheetEntryAdded = (id: number | string, added: boolean) => {
    setBragSheetEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, added } : entry
      )
    );
  };

  // Function to clear all brag sheet entries
  const clearBragSheetEntries = () => {
    setBragSheetEntries([]);
  };

  return {
    // Brag sheet state
    bragSheetEntries,
    
    // Brag sheet setters and operations
    setBragSheetEntries,
    addBragSheetEntry,
    updateBragSheetEntry,
    removeBragSheetEntry,
    markBragSheetEntryAdded,
    clearBragSheetEntries
  };
};