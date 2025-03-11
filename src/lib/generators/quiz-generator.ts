import { QuizQuestion, isQuizQuestion } from '../types/content-types';
import { ContentDeduplicator } from '../content-deduplicator';
import { chunkContent, preprocessContent, processChunks } from '../utils/chunk-processor';

interface QuizGeneratorOptions {
  maxChunkSize?: number;
  deduplicationThreshold?: number;
  onProgress?: (current: number, message?: string) => void;
}

interface QuizContent {
  questions: QuizQuestion[];
  metadata: {
    questionCount: number;
    topics: string[];
  };
}

export async function generateQuiz(
  content: string,
  options: QuizGeneratorOptions = {}
): Promise<QuizContent> {
  try {
    // Preprocess content
    const processedContent = preprocessContent(content);
    if (!processedContent) {
      throw new Error('Content preprocessing failed');
    }

    // Chunk content
    const chunks = chunkContent(processedContent, options.maxChunkSize || 2500);
    if (!chunks.length) {
      throw new Error('Content chunking failed');
    }

    // Process chunks to generate quiz questions
    const rawQuestions = await processChunks(chunks, 'quiz', undefined, options.onProgress);

    // Validate questions
    const validQuestions = rawQuestions.filter((question: unknown): question is QuizQuestion => {
      return isQuizQuestion(question);
    });

    if (!validQuestions.length) {
      throw new Error('No valid quiz questions were generated');
    }

    // Deduplicate questions if necessary
    let finalQuestions = validQuestions;
    if (chunks.length > 1 && validQuestions.length > 1) {
      options.onProgress?.(chunks.length, 'Deduplicating questions...');
      const deduplicator = new ContentDeduplicator(
        options.deduplicationThreshold || 0.75
      );
      finalQuestions = deduplicator.deduplicate(validQuestions, 'quiz');
    }

    // Extract unique topics, filtering out undefined values
    const topics = Array.from(
      new Set(
        finalQuestions
          .map(question => question.topic)
          .filter((topic): topic is string => typeof topic === 'string')
      )
    );

    // Create the final quiz content with metadata
    return {
      questions: finalQuestions,
      metadata: {
        questionCount: finalQuestions.length,
        topics
      }
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
}
