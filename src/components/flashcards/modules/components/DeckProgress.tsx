import { FlashcardDeck } from '@/types/flashcard';
import { useMemo } from 'react';

interface DeckProgressProps {
  deck: FlashcardDeck;
}

interface MasteryLevel {
  label: string;
  count: number;
  color: string;
}

export function DeckProgress({ deck }: DeckProgressProps) {
  const safeCards = useMemo(() => Array.isArray(deck.cards) ? deck.cards : [], [deck.cards]);
  
  // Use useMemo for derived state to prevent React static flag error
  const confidenceDistribution = useMemo(() => ({
    high: safeCards.filter(card => (card.confidence || 0) >= 4).length,
    medium: safeCards.filter(card => (card.confidence || 0) >= 2 && (card.confidence || 0) < 4).length,
    low: safeCards.filter(card => (card.confidence || 0) < 2).length
  }), [safeCards]);
  
  // Memoize masteryLevels calculation
  const masteryLevels = useMemo<MasteryLevel[]>(() => [
    {
      label: 'Expert',
      count: safeCards.filter(card => (card.confidence || 0) >= 4).length,
      color: 'bg-green-500'
    },
    {
      label: 'Proficient',
      count: safeCards.filter(card => (card.confidence || 0) === 3).length,
      color: 'bg-blue-500'
    },
    {
      label: 'Learning',
      count: safeCards.filter(card => (card.confidence || 0) > 0 && (card.confidence || 0) < 3).length,
      color: 'bg-yellow-500'
    },
    {
      label: 'New',
      count: safeCards.filter(card => !card.confidence || card.confidence === 0).length,
      color: 'bg-gray-400'
    }
  ], [safeCards]);
  
  const currentCycle = deck.currentCycle || 1;
  const cycleColors = [
    'bg-blue-600 dark:bg-blue-500',
    'bg-purple-600 dark:bg-purple-500',
    'bg-green-600 dark:bg-green-500',
    'bg-orange-600 dark:bg-orange-500'
  ];
  const colorIndex = (currentCycle - 1) % cycleColors.length;
  const progressBarColor = cycleColors[colorIndex];
  
  // Get the completed count from the most reliable source
  const completedCount = deck.progress?.completedCount || deck.completedCount || 0;
  
  const isNewCycle = completedCount === safeCards.length;
  const completedInCycle = deck.shownCardsInCycle?.length || 0;
  const totalCards = safeCards.length;
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
        <div className="flex items-center gap-2">
          <span>{completedCount} of {safeCards.length} cards completed</span>
          {currentCycle > 1 && (
            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
              Cycle {currentCycle}
            </span>
          )}
        </div>
        <span className="text-blue-600 dark:text-blue-400 font-medium">Study Progress</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${progressBarColor} transition-all duration-300 ease-in-out ${
            isNewCycle ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${(completedCount / Math.max(safeCards.length, 1)) * 100}%`
          }}
        />
      </div>
      
      {/* Mastery Stats */}
      <div className="mt-4 mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Mastery Progress</span>
      </div>
      
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
        {masteryLevels.map((level, index) => (
          <div
            key={level.label}
            className={`h-full ${level.color} transition-all duration-300 ease-in-out`}
            style={{
              width: `${(level.count / Math.max(totalCards, 1)) * 100}%`
            }}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-600 dark:text-gray-400">
            High confidence: {confidenceDistribution.high}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Medium confidence: {confidenceDistribution.medium}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-600 dark:text-gray-400">
            Low confidence: {confidenceDistribution.low}
          </span>
        </div>
      </div>
      
      {currentCycle > 1 && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Cards shown this cycle: {completedInCycle} of {safeCards.length}
        </div>
      )}
    </div>
  );
}