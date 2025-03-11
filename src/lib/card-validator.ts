import { Flashcard, StudyMode, StudySettings } from '@/types/flashcard';

export class CardValidator {
  // Simplified version that just returns the total number of cards
  static getAvailableCardCount(cards: Flashcard[], settings: StudySettings): number {
    console.log("CARD-VALIDATOR-LOG: Getting available card count", {
      totalCards: cards.length,
      cardsPerSession: settings.cardsPerSession
    });
    
    // Always return at least one card
    return Math.max(1, cards.length);
  }

  // Get requirements for each study mode
  static getModeRequirements(mode: StudyMode): { minimumCards: number; description: string } {
    switch (mode) {
      case 'quickReview':
        return {
          minimumCards: 5,
          description: 'Requires at least 5 cards'
        };
      case 'standard':
      default:
        return {
          minimumCards: 1,
          description: 'No minimum requirements'
        };
    }
  }
}