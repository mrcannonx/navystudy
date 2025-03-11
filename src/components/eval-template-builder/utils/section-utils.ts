import { TemplateSections, SectionKey } from '../types';
import { debug } from './error-utils';

/**
 * Updates the text content of a specific section
 */
export const updateSectionText = (
  sections: TemplateSections,
  sectionKey: SectionKey,
  newText: string
): TemplateSections => {
  // If sections is null or undefined, return it
  if (!sections) {
    return sections;
  }
  
  // If the section doesn't exist, return the original sections object
  if (!sections[sectionKey]) {
    return sections;
  }
  
  // If the text is the same, return the original sections object to prevent unnecessary re-renders
  if (sections[sectionKey].placeholder === newText) {
    return sections;
  }
  
  // Create a completely new object with deep copies of all sections
  const updatedSections = Object.keys(sections).reduce((acc, key) => {
    if (key === sectionKey) {
      // For the section being updated, create a new object with the new text
      acc[key as SectionKey] = {
        ...sections[key as SectionKey],
        placeholder: newText,
        completed: newText.trim().length > 0
      };
    } else {
      // For other sections, create a new object with the same content
      acc[key as SectionKey] = { ...sections[key as SectionKey] };
    }
    return acc;
  }, {} as TemplateSections);
  
  return updatedSections;
};

/**
 * Adds text to the end of a section's content
 */
export const appendToSection = (
  sections: TemplateSections,
  sectionKey: SectionKey,
  textToAdd: string
): TemplateSections => {
  if (!sections) {
    return sections;
  }
  
  if (!sections[sectionKey]) {
    return sections;
  }

  if (!textToAdd || textToAdd.trim() === '') {
    return sections;
  }
  
  // Format the text to add as a new bullet point if it's not already
  const formattedTextToAdd = textToAdd.trim().startsWith('-')
    ? textToAdd.trim()
    : `- ${textToAdd.trim()}`;
  
  const currentText = sections[sectionKey].placeholder || '';
  
  // If the current text is empty, just add the new text
  // Otherwise, add a new line and then the text
  const updatedText = currentText.trim()
    ? `${currentText.trim()}\n${formattedTextToAdd}`
    : formattedTextToAdd;
  
  // Use our improved updateSectionText to update the section with the new text
  // This will ensure proper deep copying of all section objects
  return updateSectionText(sections, sectionKey, updatedText);
};

/**
 * Replaces a specific text in a section with new text
 * Now preserves the original text and appends the improved version below it
 */
export const replaceTextInSection = (
  sections: TemplateSections,
  sectionKey: SectionKey,
  originalText: string,
  newText: string
): TemplateSections => {
  if (!sections[sectionKey]) {
    return sections;
  }

  if (!originalText || !newText) {
    debug(`replaceTextInSection: Missing original or new text for section ${sectionKey}`);
    return sections;
  }

  debug("replaceTextInSection called with:", {
    sectionKey,
    originalTextLength: originalText.length,
    newTextLength: newText.length
  });
  
  // Don't replace the original text, instead append the improved version
  const currentText = sections[sectionKey].placeholder;
  debug("Current text in section:", currentText.substring(0, 30) + "...");
  
  // Check if the current text already contains the improved version
  // We need to check both with and without the AI Enhanced marker
  if (currentText.includes(newText) ||
      (currentText.includes("--- AI Enhanced Version ---") &&
       currentText.split("--- AI Enhanced Version ---")[1]?.trim() === newText.trim())) {
    debug("Section already contains the improved text, no change needed");
    return sections; // No change needed
  }
  
  // Check if the current text already contains an AI Enhanced Version marker
  if (currentText.includes("--- AI Enhanced Version ---")) {
    debug("Section already contains an AI Enhanced marker");
    
    // If the user has edited the AI enhanced text, we should preserve those edits
    // Instead of appending a new AI enhanced version, we'll update the existing one
    const parts = currentText.split("--- AI Enhanced Version ---");
    if (parts.length >= 2) {
      // Keep the original text and replace the AI enhanced part without the marker
      const updatedText = parts[0] + newText;
      debug("Updating existing AI Enhanced text without marker");
      return updateSectionText(sections, sectionKey, updatedText);
    }
  }
  
  // Format the improved text to be added below the original
  const improvedText = `\n\n${newText}`;
  debug("Adding improved text without marker");
  
  // Append the improved text to the current content
  debug("Appending improved text to section");
  // Use our improved updateSectionText which ensures proper deep copying
  return updateSectionText(sections, sectionKey, currentText + improvedText);
};

/**
 * Calculates the completion percentage of all sections
 */
export const calculateCompletionPercentage = (sections: TemplateSections): number => {
  const totalSections = Object.keys(sections).length;
  if (totalSections === 0) return 0;
  
  const completedSections = Object.values(sections).filter(section => section.completed).length;
  return Math.round((completedSections / totalSections) * 100);
};
