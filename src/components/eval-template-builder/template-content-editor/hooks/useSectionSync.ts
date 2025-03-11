import { useEffect } from 'react';
import { SectionKey } from '../../types';
import { SectionSyncParams } from '../types';

export function useSectionSync({
  sections,
  activeSection,
  sectionTexts,
  setSectionTexts,
  isEditing,
  initialized,
  prevSectionsRef,
  prevActiveSectionRef
}: SectionSyncParams) {
  // Initialize or update section texts when sections change
  useEffect(() => {
    if (!sections) return;
    
    // Only run this effect if we haven't initialized yet or if sections have changed
    if (!initialized.current || JSON.stringify(sections) !== JSON.stringify(prevSectionsRef.current)) {
      // Initialize sectionTexts with content from sections if not already done
      const updatedSectionTexts = { ...sectionTexts };
      let hasChanges = false;
      
      Object.entries(sections).forEach(([key, section]) => {
        const sectionKey = key as SectionKey;
        const currentSectionText = section.placeholder || '';
        
        // If we don't have this section in our state yet, or if it's changed externally
        if (
          !updatedSectionTexts[sectionKey] ||
          updatedSectionTexts[sectionKey] !== currentSectionText ||
          (prevSectionsRef.current &&
           prevSectionsRef.current[sectionKey]?.placeholder !== currentSectionText)
        ) {
          updatedSectionTexts[sectionKey] = currentSectionText;
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setSectionTexts(updatedSectionTexts);
      }
      
      // Update our reference to the current sections
      // Create a deep copy to ensure we're not affected by reference changes
      prevSectionsRef.current = JSON.parse(JSON.stringify(sections));
      
      // Mark as initialized
      initialized.current = true;
    }
  }, [sections, setSectionTexts, initialized, prevSectionsRef]);
  
  // Save the previous active section when it changes and update the text for the new active section
  useEffect(() => {
    if (activeSection) {
      // Only update if the active section has changed
      if (prevActiveSectionRef.current !== activeSection) {
        // Save the previous active section
        prevActiveSectionRef.current = activeSection;
        
        // When switching sections, update the text for the new active section
        const currentSectionText = sections[activeSection]?.placeholder || '';
        
        // Update the text for the new active section only if it doesn't exist yet
        setSectionTexts(prev => {
          // Only update if the section doesn't have text yet
          if (prev[activeSection] === undefined) {
            return {
              ...prev,
              [activeSection]: currentSectionText
            };
          }
          return prev;
        });
      }
    }
  }, [activeSection, sections, setSectionTexts, prevActiveSectionRef]);
  
  // Special effect to update the active section text when external changes occur
  useEffect(() => {
    if (!activeSection || !initialized.current) return;
    
    // Skip external updates if user is actively editing
    if (isEditing) {
      return;
    }
    
    // Store current values in refs to avoid dependency issues
    const currentSectionText = sections[activeSection]?.placeholder || '';
    const currentStateText = sectionTexts[activeSection] || '';
    
    // Only update if the text has actually changed and we're not in an editing state
    if (currentSectionText !== currentStateText && !isEditing) {
      // Use a ref to track the last update to prevent infinite loops
      const lastUpdateRef = { current: Date.now() };
      
      // Debounce the update to prevent rapid changes
      const timerId = setTimeout(() => {
        // Check if the current section text contains the state text
        // This would indicate that a metric was added to the existing text
        const isMetricAdded = currentSectionText.includes(currentStateText.trim()) &&
                             currentSectionText.length > currentStateText.length;
        
        // Update our local state to match the external state
        setSectionTexts(prev => {
          // Only update if the text is still different
          if (prev[activeSection] !== currentSectionText) {
            return {
              ...prev,
              [activeSection]: currentSectionText
            };
          }
          return prev;
        });
      }, 50);
      
      // Clean up the timer
      return () => clearTimeout(timerId);
    }
  }, [activeSection, sections, isEditing, setSectionTexts, initialized]);
}