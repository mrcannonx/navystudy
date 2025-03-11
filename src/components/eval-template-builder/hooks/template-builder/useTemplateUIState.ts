"use client"

import { useState } from 'react';
import { SectionKey } from '../../types';

export const useTemplateUIState = () => {
  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoadAdvancedDataDialogOpen, setIsLoadAdvancedDataDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('professional');
  const [showMetrics, setShowMetrics] = useState(true);
  const [showAIEnhancer, setShowAIEnhancer] = useState(true);
  const [showBragSheet, setShowBragSheet] = useState(true);
  const [showUserNotes, setShowUserNotes] = useState(true);
  const [isEnhancing, setIsEnhancing] = useState(false);

  return {
    // UI state
    showAdvanced,
    isLoadAdvancedDataDialogOpen,
    activeSection,
    showMetrics,
    showAIEnhancer,
    showBragSheet,
    showUserNotes,
    isEnhancing,
    
    // UI state setters
    setShowAdvanced,
    setIsLoadAdvancedDataDialogOpen,
    setActiveSection,
    setShowMetrics,
    setShowAIEnhancer,
    setShowBragSheet,
    setShowUserNotes,
    setIsEnhancing,
  };
};