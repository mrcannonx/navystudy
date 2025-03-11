import { FlashcardDeck, Flashcard, StudySettings } from '@/types/flashcard';
import { CardValidator } from './card-validator';

export function pickRandomCards(cards: Flashcard[], count: number): Flashcard[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

interface StudyHistory {
  cardId: string;
  correctCount: number;
  totalAttempts: number;
}

export class StudySequencer {
  private deck: FlashcardDeck;
  private options: StudySettings;
  private history: Map<string, StudyHistory>;
  private currentCards: Flashcard[];

  constructor(deck: FlashcardDeck, options: StudySettings) {
    this.deck = {
      ...deck,
      currentCycle: deck.currentCycle || 1,
      shownCardsInCycle: deck.shownCardsInCycle || []
    };
    this.options = options;
    this.history = new Map();
    this.currentCards = [];
    this.initializeHistory();
  }

  private initializeHistory() {
    this.deck.cards.forEach(card => {
      if (!this.history.has(card.id)) {
        this.history.set(card.id, {
          cardId: card.id,
          correctCount: 0,
          totalAttempts: 0
        });
      }
    });
  }

  private getCardConfidenceLevel(card: Flashcard): number {
    return card.confidence || 0;
  }

  public getNextCards(): Flashcard[] {
    let availableCards = [...this.deck.cards];
    
    // Get actual available cards count
    const availableCount = CardValidator.getAvailableCardCount(availableCards, this.options);
    
    // Adjust cardsPerSession if needed
    const adjustedCardsPerSession = Math.min(this.options.cardsPerSession, availableCount);

    // Apply shuffling if enabled
    if (this.options.shuffleCards) {
      availableCards = this.shuffleCards(availableCards);
    }

    // Select cards based on adjusted cardsPerSession
    this.currentCards = availableCards.slice(0, adjustedCardsPerSession);

    return this.currentCards;
  }

  public recordResult(cardId: string, isCorrect: boolean) {
    const history = this.history.get(cardId);
    if (history) {
      history.totalAttempts++;
      if (isCorrect) {
        history.correctCount++;
      }
      this.history.set(cardId, history);
    }

    // Find the card and update its confidence
    const card = this.deck.cards.find(c => c.id === cardId);
    if (card) {
      if (isCorrect) {
        // Increase confidence on correct answer (max 5)
        card.confidence = Math.min((card.confidence || 0) + 1, 5);
      } else {
        // Decrease confidence on wrong answer (min 0)
        card.confidence = Math.max((card.confidence || 0) - 1, 0);
      }
    }

    // Update deck completion count when a card is answered correctly
    if (isCorrect) {
      this.deck.completedCount = (this.deck.completedCount || 0) + 1;
    }
  }

  public getStudyHistory(): StudyHistory[] {
    return Array.from(this.history.values());
  }

  private shuffleCards(cards: Flashcard[]): Flashcard[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
