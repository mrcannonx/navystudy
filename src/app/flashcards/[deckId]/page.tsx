"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Flashcard } from '@/types/flashcard';

interface FlashcardSessionProps {
  cards: Flashcard[];
}

function FlashcardSession({ cards }: FlashcardSessionProps) {
  const params = useParams();
  const deckId = params?.deckId as string || '';
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };
  
  const handleReviewAgain = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  };
  
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Deck Completed!</h2>
        <div className="flex space-x-4">
          <Button onClick={handleReviewAgain}>Review Again</Button>
          <Link href="/flashcards" as={`/flashcards/${deckId}`} legacyBehavior>
            <Button>Back to Deck</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div 
          className="min-h-[200px] flex items-center justify-center p-4 mb-4 bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          <p className="text-lg font-medium text-center">
            {showAnswer ? cards[currentCardIndex].back : cards[currentCardIndex].front}
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <button 
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? 'Show Question' : 'Show Answer'}
          </button>
          
          <button 
            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            onClick={handleNextCard}
          >
            Next Card
          </button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 text-center">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
      </div>
    </div>
  );
}

// Page component that fetches the deck and renders the FlashcardSession
export default function FlashcardPage() {
  const params = useParams();
  const deckId = params?.deckId as string || '';
  const [deck, setDeck] = useState<{ cards: Flashcard[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the deck data
  useEffect(() => {
    async function fetchDeck() {
      try {
        setLoading(true);
        // In a real app, this would be an API call to fetch the deck
        // For now, we'll create a mock deck with sample cards
        const mockDeck = {
          id: deckId,
          name: 'Sample Deck',
          cards: [
            {
              id: '1',
              front: 'What is React?',
              back: 'A JavaScript library for building user interfaces',
              confidence: 0
            },
            {
              id: '2',
              front: 'What is JSX?',
              back: 'A syntax extension for JavaScript that looks similar to HTML',
              confidence: 0
            },
            {
              id: '3',
              front: 'What is a component?',
              back: 'A reusable piece of code that returns a React element',
              confidence: 0
            }
          ]
        };
        
        setDeck(mockDeck);
        setError(null);
      } catch (err) {
        console.error('Error fetching deck:', err);
        setError('Failed to load flashcard deck');
      } finally {
        setLoading(false);
      }
    }

    fetchDeck();
  }, [deckId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700">{error || 'Failed to load flashcard deck'}</p>
          <Link href="/flashcards" className="mt-4 inline-block" legacyBehavior>
            <Button>Back to Decks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <FlashcardSession cards={deck.cards} />;
}
