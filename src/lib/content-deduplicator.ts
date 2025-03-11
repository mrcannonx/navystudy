import { Flashcard, QuizQuestion } from './types/content-types';
import { calculateStringSimilarity } from './string-similarity';

type DeduplicatableContent = Flashcard | QuizQuestion;

export class ContentDeduplicator {
  private similarityThreshold: number;

  constructor(similarityThreshold: number = 0.75) {
    this.similarityThreshold = similarityThreshold;
  }

  deduplicate<T extends DeduplicatableContent>(items: T[], type: 'flashcards' | 'quiz'): T[] {
    if (!items.length) return items;

    const uniqueItems: T[] = [];
    const seen = new Set<number>();

    for (let i = 0; i < items.length; i++) {
      if (seen.has(i)) continue;

      const current = items[i];
      uniqueItems.push(current);

      // Compare with remaining items
      for (let j = i + 1; j < items.length; j++) {
        if (seen.has(j)) continue;

        const other = items[j];
        if (this.areSimilar(current, other, type)) {
          seen.add(j);
        }
      }
    }

    return uniqueItems;
  }

  private areSimilar(a: DeduplicatableContent, b: DeduplicatableContent, type: 'flashcards' | 'quiz'): boolean {
    if (type === 'flashcards') {
      const cardA = a as Flashcard;
      const cardB = b as Flashcard;
      return (
        calculateStringSimilarity(cardA.front, cardB.front) > this.similarityThreshold ||
        calculateStringSimilarity(cardA.back, cardB.back) > this.similarityThreshold
      );
    } else {
      const questionA = a as QuizQuestion;
      const questionB = b as QuizQuestion;
      return calculateStringSimilarity(questionA.question, questionB.question) > this.similarityThreshold;
    }
  }
}
