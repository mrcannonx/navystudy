import { ContentType } from '@/lib/types';

// Type guard for text block responses from Anthropic
export interface TextBlock {
  type: 'text';
  text: string;
}

export function isTextBlock(block: any): block is TextBlock {
  return block && block.type === 'text' && typeof block.text === 'string';
}

// Quiz related types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Flashcard related types
export interface Flashcard {
  type: 'basic' | 'cloze';
  front: string;
  back: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export function isValidCard(card: any): card is Flashcard {
  return (
    card &&
    typeof card.type === 'string' &&
    typeof card.front === 'string' &&
    typeof card.back === 'string' &&
    card.front.trim() !== '' &&
    card.back.trim() !== ''
  );
}

// API Request/Response types
export interface AIRequest {
  content: string;
  type: ContentType;
  timestamp: number;
}

export interface AIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
} 