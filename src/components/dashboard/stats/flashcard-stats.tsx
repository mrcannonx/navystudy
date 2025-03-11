import { Target, Clock, Activity, Flame } from "lucide-react"

interface FlashcardStatsProps {
  streak: number
  cardsStudied: number
  totalCards: number
  timeSpent: number
  avgScore: number
}

export function FlashcardStats({ 
  streak, 
  cardsStudied, 
  totalCards, 
  timeSpent, 
  avgScore 
}: FlashcardStatsProps) {
  // Convert timeSpent from seconds to minutes for display
  const minutesSpent = Math.floor(timeSpent / 60);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/10 rounded-lg border border-orange-200/50 dark:border-orange-500/30">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg border border-orange-200 dark:border-orange-500/30">
          <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <p className="text-sm text-orange-600 dark:text-orange-400">Study Streak</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {streak} <span className="text-base font-normal">days</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/10 rounded-lg border border-blue-200/50 dark:border-blue-500/30">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-500/30">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Cards</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {cardsStudied} <span className="text-base font-normal">/ {totalCards}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-950/10 rounded-lg border border-purple-200/50 dark:border-purple-500/30">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg border border-purple-200 dark:border-purple-500/30">
          <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-400">Time Spent</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {minutesSpent} <span className="text-base font-normal">mins</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/10 rounded-lg border border-green-200/50 dark:border-green-500/30">
        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-500/30">
          <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <p className="text-sm text-green-600 dark:text-green-400">Retention</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {Math.min(100, Math.round(avgScore))}<span className="text-base font-normal">%</span>
          </p>
        </div>
      </div>
    </div>
  )
} 