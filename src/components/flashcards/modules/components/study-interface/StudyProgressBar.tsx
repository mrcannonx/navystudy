"use client"

interface StudyProgressBarProps {
  current: number;
  total: number;
  cardsPerSession: number;
  deckTotalCards: number;
  completedCount: number;
}

export function StudyProgressBar({
  current,
  total,
  cardsPerSession,
  deckTotalCards,
  completedCount
}: StudyProgressBarProps) {
  return (
    <div className="w-full mb-6">
      <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        <span>Completed: {Math.min(current > 1 ? current - 1 : 0, total)} of {total} cards</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-in-out"
          style={{ 
            width: `${Math.min((current / total) * 100, 100)}%`
          }}
        />
      </div>
      <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
        Current card: {Math.min(current, total)} of {total}
      </div>
    </div>
  );
}