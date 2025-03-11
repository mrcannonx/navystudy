"use client"

import { useState, useEffect } from 'react';
import { AISuggestion, SectionKey, EvaluationTemplateData, ToastProps } from '../../types';
import { generateSectionSpecificSuggestions, enhanceWithAI } from '../../utils/ai-enhancement-utils';
import { useToast } from '@/components/ui/use-toast';

interface UseTemplateAIEnhancementProps {
  initialData?: Partial<EvaluationTemplateData>;
  activeSection: SectionKey;
}

export const useTemplateAIEnhancement = ({ initialData, activeSection }: UseTemplateAIEnhancementProps) => {
  const { toast } = useToast();
  
  // Track if demo mode is active (use initialData if available, otherwise default to true)
  const [isDemoMode, setIsDemoMode] = useState(initialData?.isDemoMode !== undefined ? initialData.isDemoMode : true);
  
  // Track if demo data has been manually cleared
  const [hasBeenCleared, setHasBeenCleared] = useState(false);
  
  // Initialize AI enhancement suggestions based on active section and demo mode
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>(() => {
    // Only generate suggestions if in demo mode
    const isInDemoMode = initialData?.isDemoMode !== undefined ? initialData.isDemoMode : true;
    return isInDemoMode ? generateSectionSpecificSuggestions(activeSection) : [];
  });
  
  // Update AI suggestions when active section changes (only if in demo mode AND not manually cleared)
  useEffect(() => {
    if (isDemoMode && !hasBeenCleared) {
      setAiSuggestions(generateSectionSpecificSuggestions(activeSection));
    }
  }, [activeSection, isDemoMode, hasBeenCleared]);
  
  // Update demo mode when initialData changes
  useEffect(() => {
    if (initialData?.isDemoMode !== undefined) {
      setIsDemoMode(initialData.isDemoMode);
      // If isDemoMode is set to false from initialData, consider it as cleared
      if (!initialData.isDemoMode) {
        setHasBeenCleared(true);
      }
    }
  }, [initialData]);
  
  // Function to enhance text with AI
  const enhanceText = async (text: string) => {
    await enhanceWithAI(
      text,
      activeSection,
      (isEnhancing) => {}, // This is handled by the UI state hook
      setAiSuggestions,
      toast,
      setIsDemoMode
    );
  };
  
  // Function to apply an AI suggestion
  const applyAISuggestion = (suggestion: AISuggestion) => {
    // This function would typically update the section content
    // But we'll return the suggestion to be applied by the parent component
    return suggestion.improved;
  };
  
  // Function to clear AI suggestions
  const clearAISuggestions = () => {
    setAiSuggestions([]);
    setHasBeenCleared(true);
  };
  
  // Custom setter for isDemoMode that also updates hasBeenCleared
  const setIsDemoModeWithTracking = (newValue: boolean) => {
    setIsDemoMode(newValue);
    if (!newValue) {
      setHasBeenCleared(true);
    }
  };

  return {
    // AI enhancement state
    aiSuggestions,
    isDemoMode,
    
    // AI enhancement setters and operations
    setAiSuggestions,
    setIsDemoMode: setIsDemoModeWithTracking,
    enhanceText,
    applyAISuggestion,
    clearAISuggestions
  };
};