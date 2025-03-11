import { Clock, Flame, Target, BarChart } from "lucide-react";
import { useStatistics } from "@/contexts/statistics-context";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { StatItem } from "../ui";

/**
 * QuizStats component displays statistics related to quiz performance
 */
export function QuizStats() {
  const { quizStats } = useStatistics();
  const { analytics } = useAnalyticsData();
  
  // Study streak - consecutive days with quiz sessions
  const studyStreak = quizStats?.streak || 0;
  
  // Questions completed - total questions answered
  const questionsCompleted = quizStats?.questionsAnswered || 0;
  
  // Time spent - format from seconds to minutes
  const timeSpentMinutes = Math.floor((quizStats?.timeSpent || 0) / 60);
  
  // Average score - already a percentage from the backend
  const avgScore = quizStats?.averageScore
    ? Math.round(quizStats.averageScore)
    : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <StatItem
        icon={Flame}
        label="Study Streak"
        value={`${studyStreak} days`}
        color="amber"
      />
      <StatItem
        icon={Target}
        label="Questions Completed"
        value={questionsCompleted.toString()}
        color="blue"
      />
      <StatItem
        icon={Clock}
        label="Time Spent"
        value={`${timeSpentMinutes} mins`}
        color="purple"
      />
      <StatItem
        icon={BarChart}
        label="Avg. Score"
        value={`${avgScore}%`}
        color="emerald"
      />
    </div>
  );
}