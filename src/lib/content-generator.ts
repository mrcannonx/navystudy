import { ContentType } from './types/content-types';
import { generateFlashcards } from './generators/flashcard-generator';
import { generateQuiz } from './generators/quiz-generator';
import { generateSummary } from './generators/summary-generator';

interface GeneratorOptions {
  maxChunkSize?: number;
  deduplicationThreshold?: number;
  onProgress?: (current: number, message?: string) => void;
}

export async function generateContent(
  content: string,
  type: ContentType,
  options: GeneratorOptions = {}
): Promise<any> {
  try {
    // Validate input
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a non-empty string');
    }

    if (!type || !['quiz', 'flashcards', 'summary'].includes(type)) {
      throw new Error('Invalid content type. Must be "quiz", "flashcards", or "summary"');
    }

    // Delegate to appropriate generator based on type
    switch (type) {
      case 'flashcards':
        return generateFlashcards(content, options);
      case 'quiz':
        return generateQuiz(content, options);
      case 'summary':
        return generateSummary(content, options);
      default:
        throw new Error(`Unsupported content type: ${type}`);
    }
  } catch (error) {
    console.error('Error in content generation:', error);
    throw error;
  }
}
