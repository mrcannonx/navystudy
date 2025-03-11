import { Flashcard, isFlashcard } from '../types/content-types';
import { processClozeCard } from '../utils/cloze-processor';
import { ContentDeduplicator } from '../content-deduplicator';
import { chunkContent, preprocessContent, processChunks } from '../utils/chunk-processor';

interface FlashcardGeneratorOptions {
  maxChunkSize?: number;
  deduplicationThreshold?: number;
  onProgress?: (current: number, message?: string) => void;
}

interface FlashcardDeck {
  cards: Flashcard[];
  metadata: {
    cardCount: number;
    topics: string[];
  };
}

export async function generateFlashcards(
  content: string,
  options: FlashcardGeneratorOptions = {}
): Promise<FlashcardDeck> {
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

    // Process chunks to generate flashcards
    const rawCards = await processChunks(chunks, 'flashcards', undefined, options.onProgress);

    // Validate and process cards
    const validCards = rawCards
      .filter((card: unknown): card is Flashcard => {
        if (!isFlashcard(card)) return false;
        
        if ((card as Flashcard).type === 'cloze') {
          return processClozeCard(card as Flashcard) !== null;
        }
        return true;
      })
      .map(card => card.type === 'cloze' ? processClozeCard(card) : card);

    if (!validCards.length) {
      throw new Error('No valid flashcards were generated');
    }

    // Deduplicate cards if necessary
    let finalCards = validCards;
    if (chunks.length > 1 && validCards.length > 1) {
      options.onProgress?.(chunks.length, 'Deduplicating flashcards...');
      const deduplicator = new ContentDeduplicator(
        options.deduplicationThreshold || 0.75
      );
      finalCards = deduplicator.deduplicate(validCards, 'flashcards') as Flashcard[];
    }

    // Extract unique topics, filtering out undefined values
    const topics = Array.from(
      new Set(
        finalCards
          .map(card => card.topic)
          .filter((topic): topic is string => typeof topic === 'string')
      )
    );

    // Create the final deck with metadata
    return {
      cards: finalCards,
      metadata: {
        cardCount: finalCards.length,
        topics
      }
    };
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
}
