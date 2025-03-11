// NOTE: This ContentType is not used in the application.
// The main ContentType definition is in src/lib/types.ts
// This definition is kept for backward compatibility but should be removed in future refactoring
export type ContentType = 'quiz' | 'flashcards' | 'summary' | 'metrics';

export interface Flashcard {
  front: string;
  back: string;
  type?: 'basic' | 'cloze';
  topic?: string;
  metadata?: {
    frontLength?: number;
    backLength?: number;
    clozeData?: Array<{
      text: string;
      answer: string;
      position: number;
    }>;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  topic?: string;
}

export interface GenerateContentResponse {
  success: boolean;
  data: any;
  error?: string;
}

export function isFlashcard(card: unknown): card is Flashcard {
  return card &&
    typeof (card as any).front === 'string' &&
    typeof (card as any).back === 'string' &&
    (card as any).front.trim() &&
    (card as any).back.trim();
}

export function isQuizQuestion(card: unknown): card is QuizQuestion {
  return card &&
    typeof (card as any).question === 'string' &&
    Array.isArray((card as any).options) &&
    typeof (card as any).correctAnswer === 'string' &&
    (card as any).question.trim() &&
    (card as any).options.length > 0 &&
    (card as any).correctAnswer.trim();
}
