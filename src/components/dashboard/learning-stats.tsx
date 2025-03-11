import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizStats } from "./stats/quiz-stats"
import { FlashcardStats } from "./stats/flashcard-stats"
import { useStatistics } from "@/contexts/statistics-context"
import { useAnalyticsData } from "./stats/use-analytics-data"
import { useQuizActivityStats } from "./stats/use-quiz-activity-stats"
import { useFlashcardActivityStats } from "./stats/use-flashcard-activity-stats"
import { combineStats } from "./stats/stats-utils"

export function LearningStats() {
  // Get data from custom hooks
  const { analytics } = useAnalyticsData()
  const { quizStats } = useQuizActivityStats()
  const { flashcardStats } = useFlashcardActivityStats()
  
  // Get context data
  const { quizStats: contextQuizStats, flashcardStats: contextFlashcardStats } = useStatistics() || {}
  
  // Combine stats from different sources
  const stats = combineStats(
    analytics,
    quizStats,
    flashcardStats,
    contextQuizStats,
    contextFlashcardStats
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Learning Statistics</h2>
      </div>
      <div>
        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="quiz" className="flex-1">Quiz Stats</TabsTrigger>
            <TabsTrigger value="flashcard" className="flex-1">Flashcard Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            <QuizStats {...stats.quiz} />
          </TabsContent>
          <TabsContent value="flashcard">
            <FlashcardStats {...stats.flashcard} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}