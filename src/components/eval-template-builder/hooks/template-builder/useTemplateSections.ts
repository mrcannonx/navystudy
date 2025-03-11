"use client"

import { useState, useEffect } from 'react';
import { TemplateSections, SectionKey, EvaluationTemplateData } from '../../types';
import { defaultTemplateSections } from '../../template-data';

interface UseTemplateSectionsProps {
  initialData?: Partial<EvaluationTemplateData>;
}

export const useTemplateSections = ({ initialData }: UseTemplateSectionsProps) => {
  // Initialize sections from initialData if available, otherwise use defaults
  const [sections, setSections] = useState<TemplateSections>(() => {
    if (initialData?.sections) {
      try {
        // Handle case where sections might be a string (from DB) instead of an object
        let loadedSections: TemplateSections;
        
        if (typeof initialData.sections === 'string') {
          // Try to parse the string into an object
          loadedSections = JSON.parse(initialData.sections);
        } else {
          // Already an object
          loadedSections = { ...initialData.sections };
        }
        
        // Mark sections as completed if they have content
        Object.keys(loadedSections).forEach(key => {
          const section = loadedSections[key as SectionKey];
          if (section && typeof section === 'object') {
            const placeholder = section.placeholder;
            loadedSections[key as SectionKey].completed = !!(placeholder && placeholder.trim().length > 0);
          }
        });
        
        return loadedSections;
      } catch (error) {
        console.error("Error parsing sections data:", error);
        return defaultTemplateSections;
      }
    }
    return defaultTemplateSections;
  });

  // Update sections when initialData changes
  useEffect(() => {
    if (initialData?.sections) {
      try {
        // Handle case where sections might be a string (from DB) instead of an object
        let loadedSections: TemplateSections;
        
        if (typeof initialData.sections === 'string') {
          // Try to parse the string into an object
          loadedSections = JSON.parse(initialData.sections);
        } else {
          // Already an object
          loadedSections = { ...initialData.sections };
        }
        
        // Mark sections as completed if they have content
        Object.keys(loadedSections).forEach(key => {
          const section = loadedSections[key as SectionKey];
          if (section && typeof section === 'object') {
            const placeholder = section.placeholder;
            loadedSections[key as SectionKey].completed = !!(placeholder && placeholder.trim().length > 0);
          }
        });
        
        setSections(loadedSections);
      } catch (error) {
        console.error("Error parsing sections data in useEffect:", error);
        // Keep current sections if there's an error
      }
    }
  }, [initialData]);

  // Function to update a specific section
  const updateSection = (sectionKey: SectionKey, content: string) => {
    try {
      if (!sectionKey) {
        console.error("Cannot update section: sectionKey is undefined or null");
        return;
      }
      
      console.log(`Updating section ${sectionKey} with content length: ${content?.length || 0}`);
      console.log(`Content preview: ${content?.substring(0, 30)}...`);
      
      // Check if content contains AI Enhanced Version
      const hasAIEnhanced = content?.includes("--- AI Enhanced Version ---") || false;
      console.log(`Content contains AI Enhanced marker: ${hasAIEnhanced}`);
      
      setSections(prev => {
        // Check if the section exists in the current state
        if (!prev[sectionKey]) {
          console.error(`Section ${sectionKey} does not exist in the current sections state`);
          return prev;
        }
        
        // Log the current content before updating
        console.log(`Current section content: ${prev[sectionKey].placeholder?.substring(0, 30)}...`);
        
        // Create a completely new object with deep copies of all sections
        const updatedSections = Object.keys(prev).reduce((acc, key) => {
          if (key === sectionKey) {
            // For the section being updated, create a new object with the new content
            acc[key as SectionKey] = {
              ...prev[key as SectionKey],
              placeholder: content || "",
              completed: (content || "").trim().length > 0
            };
          } else {
            // For other sections, create a new object with the same content
            acc[key as SectionKey] = { ...prev[key as SectionKey] };
          }
          return acc;
        }, {} as TemplateSections);
        
        console.log(`Updated section ${sectionKey}, completed: ${updatedSections[sectionKey].completed}`);
        console.log(`New section content: ${updatedSections[sectionKey].placeholder?.substring(0, 30)}...`);
        
        // Return the updated sections object
        return updatedSections;
      });
    } catch (error) {
      console.error(`Error updating section ${sectionKey}:`, error);
    }
  };

  // Function to mark a section as completed or not
  const markSectionCompleted = (sectionKey: SectionKey, completed: boolean) => {
    setSections(prev => {
      // Create a completely new object with deep copies of all sections
      return Object.keys(prev).reduce((acc, key) => {
        if (key === sectionKey) {
          // For the section being updated, create a new object with the completed status
          acc[key as SectionKey] = {
            ...prev[key as SectionKey],
            completed
          };
        } else {
          // For other sections, create a new object with the same content
          acc[key as SectionKey] = { ...prev[key as SectionKey] };
        }
        return acc;
      }, {} as TemplateSections);
    });
  };

  // Function to clear all sections
  const clearAllSections = () => {
    // Create a completely new object with deep copies of all sections
    const emptySections = Object.keys(sections).reduce((acc, key) => {
      // For each section, create a new object with empty content
      acc[key as SectionKey] = {
        ...sections[key as SectionKey],
        placeholder: "",
        completed: false
      };
      return acc;
    }, {} as TemplateSections);
    
    setSections(emptySections);
  };

  return {
    // Sections state
    sections,
    
    // Sections setters and operations
    setSections,
    updateSection,
    markSectionCompleted,
    clearAllSections
  };
};