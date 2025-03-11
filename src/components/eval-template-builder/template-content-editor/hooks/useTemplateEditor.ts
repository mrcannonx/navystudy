import { useState, useRef, useEffect } from 'react';
import { SectionKey, TemplateSections } from '../../types';
import { TemplateContentEditorProps } from '../types';
import { useSectionSync } from './useSectionSync';
import { useAdvancedOptions } from './useAdvancedOptions';
import { generatePDF } from '../utils/pdfGenerator-browser';

export function useTemplateEditor(props: TemplateContentEditorProps) {
  const {
    sections,
    activeSection,
    rank,
    rating,
    role,
    evalType,
    isEnhancing,
    onUpdateSectionTextAction,
    onEnhanceWithAIAction,
    ...advancedOptions
  } = props;

  // Section text state management
  const [sectionTexts, setSectionTexts] = useState<Record<SectionKey, string>>({} as Record<SectionKey, string>);
  const [isEditing, setIsEditing] = useState(false);
  const [blankSectionError, setBlankSectionError] = useState<boolean>(false);
  
  // Initialize refs for tracking changes
  const initialized = useRef<boolean>(false);
  const prevSectionsRef = useRef<TemplateSections | null>(null);
  const prevActiveSectionRef = useRef<SectionKey | null>(null);

  // Use custom hooks for specific functionality
  const { includeAdvancedOptions, toggleAdvancedOptions } = useAdvancedOptions();
  
  // Effect to handle initial loading and major section changes
  useEffect(() => {
    // Only run this on initial mount or when sections change significantly
    if (!initialized.current || !prevSectionsRef.current) {
      // Initialize with empty section texts
      const initialTexts = {} as Record<SectionKey, string>;
      
      // Fill in initial values from section placeholders
      Object.entries(sections).forEach(([key, section]) => {
        initialTexts[key as SectionKey] = section.placeholder || '';
      });
      
      // Set the initial texts
      setSectionTexts(initialTexts);
      
      // Update our reference
      prevSectionsRef.current = JSON.parse(JSON.stringify(sections));
      initialized.current = true;
    }
  }, [sections]);
  
  // Sync section texts with external changes
  useSectionSync({
    sections,
    activeSection,
    sectionTexts,
    setSectionTexts,
    isEditing,
    initialized,
    prevSectionsRef,
    prevActiveSectionRef
  });

  // Get the current text for the active section
  const activeText = activeSection ? sectionTexts[activeSection] || '' : '';

  // Handle text changes in the textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeSection) return;
    
    // Mark that user is actively editing
    setIsEditing(true);
    
    const newText = e.target.value;
    
    // Update only the active section's text, preserving all other sections
    setSectionTexts(prev => ({
      ...prev,
      [activeSection]: newText
    }));
    
    // Immediately save the changes to the parent component
    onUpdateSectionTextAction(activeSection, newText);
  };
  
  // Handle focus and blur events to track when user is editing
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    
    // Save the current text to the section when user stops editing
    if (activeSection && sectionTexts[activeSection] !== undefined) {
      const currentText = sectionTexts[activeSection];
      const sectionText = sections[activeSection]?.placeholder || '';
      
      // Only update if the text has actually changed
      if (currentText !== sectionText) {
        onUpdateSectionTextAction(activeSection, currentText);
      }
    }
  };
  
  // Handle AI enhancement with validation for blank sections
  const handleEnhanceClick = () => {
    // Clear any previous error
    setBlankSectionError(false);
    
    // Check if the section is blank
    if (!activeText || activeText.trim() === '') {
      // Show error message for blank section
      setBlankSectionError(true);
      
      // Hide error after 5 seconds
      setTimeout(() => {
        setBlankSectionError(false);
      }, 5000);
      
      return; // Don't proceed with enhancement if section is blank
    }
    
    // Proceed with AI enhancement
    onEnhanceWithAIAction(activeText, rating, role);
  };

  // Generate PDF with current state
  const handleGeneratePDF = () => {
    return generatePDF({
      sections,
      sectionTexts,
      rank,
      rating,
      role,
      evalType,
      includeAdvancedOptions,
      advancedData: advancedOptions
    });
  };

  return {
    activeSection,
    sections,
    sectionTexts,
    activeText,
    isEditing,
    isEnhancing,
    blankSectionError,
    handleTextChange,
    handleFocus,
    handleBlur,
    handleEnhanceClick,
    includeAdvancedOptions,
    toggleAdvancedOptions,
    generatePDF: handleGeneratePDF
  };
}