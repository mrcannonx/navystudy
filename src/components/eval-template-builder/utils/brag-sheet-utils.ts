import { BragSheetEntry, TemplateSections } from '../types';
import { appendToSection } from './section-utils';
import { makeAIRequest } from '@/lib/ai-client';
import { ContentType } from '@/lib/types';

/**
 * Marks a brag sheet entry as added and returns the updated entries array
 */
export const markBragSheetEntryAsAdded = (
  entries: BragSheetEntry[],
  entryId: number | string
): BragSheetEntry[] => {
  return entries.map(item =>
    item.id === entryId ? { ...item, added: true } : item
  );
};

/**
 * Adds a brag sheet entry to the entries array
 */
export const addBragSheetEntry = (
  entries: BragSheetEntry[],
  entry: Omit<BragSheetEntry, 'id'>
): BragSheetEntry[] => {
  return [...entries, { ...entry, id: Date.now() }];
};

/**
 * Removes a brag sheet entry from the entries array
 */
export const deleteBragSheetEntry = (
  entries: BragSheetEntry[],
  entryId: number | string
): BragSheetEntry[] => {
  return entries.filter(entry => entry.id !== entryId);
};

/**
 * Synthesizes a brag sheet entry's description and metrics into a single, impactful text
 */
export const synthesizeEntryText = (entry: BragSheetEntry): string => {
  // If there are no metrics, just return the description
  if (!entry.metrics || entry.metrics.length === 0) {
    return entry.description;
  }

  // Filter out empty metrics
  const validMetrics = entry.metrics.filter(metric => metric.trim() !== '');
  
  if (validMetrics.length === 0) {
    return entry.description;
  }

  // Check if metrics are already included in the description
  const metricsAlreadyIncluded = validMetrics.every(metric =>
    entry.description.toLowerCase().includes(metric.toLowerCase())
  );
  
  // If all metrics are already included, return the description as is
  if (metricsAlreadyIncluded) {
    return entry.description;
  }
  
  // Get metrics that aren't already in the description
  const uniqueMetrics = validMetrics.filter(metric =>
    !entry.description.toLowerCase().includes(metric.toLowerCase())
  );
  
  if (uniqueMetrics.length === 0) {
    return entry.description;
  }
  
  // Check if the description ends with a period, question mark, or exclamation point
  const descriptionEndsWithPunctuation = /[.!?]$/.test(entry.description.trim());
  
  // Create a natural language integration of the metrics
  let synthesizedText = entry.description;
  
  // Add appropriate punctuation if needed
  if (!descriptionEndsWithPunctuation) {
    synthesizedText += '.';
  }
  
  // Add a space after the punctuation
  synthesizedText += ' ';
  
  // Integrate metrics based on how many there are
  if (uniqueMetrics.length === 1) {
    // For a single metric, integrate it directly
    synthesizedText += `Achieved ${uniqueMetrics[0]}.`;
  } else if (uniqueMetrics.length === 2) {
    // For two metrics, use "and" to connect them
    synthesizedText += `Achieved ${uniqueMetrics[0]} and ${uniqueMetrics[1]}.`;
  } else {
    // For three or more metrics, use commas and "and" for the last one
    const lastMetric = uniqueMetrics.pop();
    synthesizedText += `Achieved ${uniqueMetrics.join(', ')}, and ${lastMetric}.`;
  }
  
  return synthesizedText;
};

/**
 * Synthesizes a brag sheet entry's description and metrics into a single, impactful text using AI
 */
export const synthesizeEntryTextWithAI = async (entry: BragSheetEntry): Promise<string> => {
  try {
    // If there are no metrics, just return the description
    if (!entry.metrics || entry.metrics.length === 0) {
      return entry.description;
    }

    // Filter out empty metrics
    const validMetrics = entry.metrics.filter(metric => metric.trim() !== '');
    
    if (validMetrics.length === 0) {
      return entry.description;
    }

    // Check if metrics are already included in the description
    const metricsAlreadyIncluded = validMetrics.every(metric =>
      entry.description.toLowerCase().includes(metric.toLowerCase())
    );
    
    // If all metrics are already included, return the description as is
    if (metricsAlreadyIncluded) {
      return entry.description;
    }

    // Prepare the prompt for the AI
    const prompt = `
      I have an accomplishment description and some metrics that I want to combine into a single, impactful bullet point for a professional evaluation.
      
      Description: "${entry.description}"
      
      Metrics:
      ${validMetrics.map(metric => `- ${metric}`).join('\n')}
      
      Please create a single, natural-sounding bullet point that integrates the description and metrics. The result should be concise, impactful, and suitable for a professional evaluation.
      
      Important guidelines:
      - Start with a strong action verb
      - Be specific and quantifiable
      - Focus on achievements and impact
      - Keep it under 100 characters if possible
      - Do not include any explanations or additional text
      - Do not include bullet point markers or formatting
      - Return only the final bullet point text
    `;

    // Make the AI request
    const response = await makeAIRequest(
      prompt,
      'summary' as ContentType,
      'bullet',
      undefined
    );

    if (!response.success || !response.data || !response.data.summary) {
      console.error('Failed to generate integrated text with AI:', response);
      // Log more detailed error information
      if (response.error) {
        console.error('AI Error details:', response.error);
      }
      // Fall back to the non-AI version if the AI request fails
      return synthesizeEntryText(entry);
    }

    // Extract the bullet point from the AI response
    let aiGeneratedText = response.data.summary.trim();
    
    // Remove any explanatory text that might be in the response
    if (aiGeneratedText.includes('\n\n')) {
      // Take only the content after the last double newline
      aiGeneratedText = aiGeneratedText.split('\n\n').pop() || aiGeneratedText;
    }
    
    // Remove any bullet point markers or HTML tags that might be in the response
    const cleanedText = aiGeneratedText
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/^[-•*]\s*/, '') // Remove bullet point markers at the start
      .trim();

    return cleanedText;
  } catch (error) {
    console.error('Error in synthesizeEntryTextWithAI:', error);
    // Fall back to the non-AI version if there's an error
    return synthesizeEntryText(entry);
  }
};

/**
 * Adds a brag sheet entry to the appropriate section in the template
 */
export const addBragSheetEntryToSection = async (
  sections: TemplateSections,
  entry: BragSheetEntry
): Promise<TemplateSections> => {
  try {
    // Synthesize description and metrics into a single text using AI
    const synthesizedText = await synthesizeEntryTextWithAI(entry);
    
    // Add the synthesized text to the appropriate section
    return appendToSection(sections, entry.category, synthesizedText);
  } catch (error) {
    console.error('Error in addBragSheetEntryToSection:', error);
    
    // Fall back to the non-AI version if there's an error
    const fallbackText = synthesizeEntryText(entry);
    return appendToSection(sections, entry.category, fallbackText);
  }
};

/**
 * Filters brag sheet entries by category
 */
export const filterEntriesByCategory = (
  entries: BragSheetEntry[],
  category: string
): BragSheetEntry[] => {
  return entries.filter(entry => entry.category === category);
};

/**
 * Filters brag sheet entries by added status
 */
export const filterEntriesByAddedStatus = (
  entries: BragSheetEntry[],
  added: boolean
): BragSheetEntry[] => {
  return entries.filter(entry => entry.added === added);
};