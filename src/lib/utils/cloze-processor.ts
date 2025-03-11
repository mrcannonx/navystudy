import { Flashcard } from '../types/content-types';

export function processClozeCard(card: Flashcard): Flashcard {
  if (card.type !== 'cloze') return card;

  // Extract cloze deletions and their positions
  const clozePattern = /\{\{([^{}]+)\}\}/g;
  const clozeData: Array<{text: string, answer: string, position: number}> = [];
  let match;
  let text = card.front;

  while ((match = clozePattern.exec(text)) !== null) {
    clozeData.push({
      text: match[0],
      answer: match[1],
      position: match.index
    });
  }

  // Update card metadata with cloze information and required length fields
  return {
    ...card,
    metadata: {
      ...card.metadata,
      frontLength: card.front.length,
      backLength: card.back.length,
      clozeData: clozeData
    }
  };
}
