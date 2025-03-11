import { ContentType, Flashcard } from '../types';

export interface SummaryResponse {
  success: boolean;
  error?: string;
  data: {
    summary: string;
  };
}

export interface FlashcardResponse {
  success: boolean;
  error?: string;
  data: {
    flashcards?: Flashcard[];
  };
}

export function isFlashcardsArray(data: any): data is Flashcard[] {
  return Array.isArray(data) && data.length > 0 && 'front' in data[0];
}

export function isFlashcardResponse(response: any): response is FlashcardResponse {
  return response?.success && response?.data?.flashcards !== undefined;
}

export function isSummaryResponse(response: any): response is SummaryResponse {
  return response?.success && response?.data?.summary !== undefined;
}

export type { ContentType, Flashcard };
