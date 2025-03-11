import { useState, useCallback } from 'react';
import { summarizeText } from '@/components/summarizer/summarizer-utils';

export type SummaryFormat = 'bullets' | 'tldr' | 'qa';

export interface SummaryState {
  text: string;
  format: SummaryFormat | undefined;
  result: string;
  isProcessing: boolean;
  error?: string;
  wordCount: number;
  characterCount: number;
  formatLoadingStates: Record<SummaryFormat, boolean>;
}

export interface ValidationState {
  isTextTooLong: boolean;
  isTextTooShort: boolean;
  maxChars: number;
  minChars: number;
}

export function useSummarizerState() {
  const [state, setState] = useState<SummaryState>({
    text: '',
    format: undefined,
    result: '',
    isProcessing: false,
    wordCount: 0,
    characterCount: 0,
    formatLoadingStates: {
      bullets: false,
      tldr: false,
      qa: false
    }
  });

  // Constants for validation
  const validation: ValidationState = {
    maxChars: 25000,
    minChars: 10,
    isTextTooLong: state.characterCount > 25000,
    isTextTooShort: state.characterCount < 10 && state.characterCount > 0
  };

  const updateText = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      text,
      characterCount: text.length,
      wordCount: text.trim() ? text.trim().split(/\s+/).length : 0
    }));
  }, []);

  const updateFormat = useCallback(async (format: SummaryFormat) => {
    if (!state.text.trim() || state.formatLoadingStates[format]) return;

    try {
      setState(prev => ({
        ...prev,
        formatLoadingStates: { ...prev.formatLoadingStates, [format]: true }
      }));

      await processSummary(format);
    } finally {
      setState(prev => ({
        ...prev,
        format,
        formatLoadingStates: { ...prev.formatLoadingStates, [format]: false }
      }));
    }
  }, [state.text, state.formatLoadingStates]);

  const processSummary = useCallback(async (selectedFormat?: SummaryFormat) => {
    const format = selectedFormat || state.format;
    if (!format) return;

    if (validation.isTextTooLong || validation.isTextTooShort || !state.text.trim()) {
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isProcessing: true,
        error: undefined,
        result: ''
      }));

      const summary = await summarizeText(state.text, format);

      setState(prev => ({
        ...prev,
        result: summary,
        isProcessing: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred',
        isProcessing: false
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isProcessing: false
      }));
    }
  }, [state.text, state.format, validation.isTextTooLong, validation.isTextTooShort]);

  const clearState = useCallback(() => {
    setState(prev => ({
      ...prev,
      text: '',
      format: undefined,
      result: '',
      error: undefined,
      isProcessing: false,
      wordCount: 0,
      characterCount: 0
    }));
  }, []);

  return {
    state,
    validation,
    actions: {
      updateText,
      updateFormat,
      processSummary,
      clearState
    }
  };
}
