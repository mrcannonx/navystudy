import { Target, Activity, Clock, Calendar } from "lucide-react"
import { useAnalyticsData } from "@/hooks/useAnalyticsData"
import { formatStudyTime, calculatePerformanceScore, formatDate } from "@/utils/analytics"
import { AnalyticsCard } from "@/components/analytics/AnalyticsCard"
import { LoadingState, ErrorState, EmptyState } from "@/components/analytics/AnalyticsStates"

export function StudyAnalytics() {
  const { analytics, activityStats, isLoading, error } = useAnalyticsData()

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!analytics || !activityStats) {
    return <EmptyState />
  }

  // Calculate performance score from normalized retention rate and review efficiency (0-1 values)
  const retentionRate = analytics.retentionRate || 0;
  const reviewEfficiency = analytics.reviewEfficiency || 0;
  
  const performanceScore = calculatePerformanceScore(
    retentionRate,
    reviewEfficiency
  )

  // Format study time from seconds to hours/minutes
  const { hours, minutes } = formatStudyTime(analytics.totalStudyTime || 0)
  
  const formattedLastStudy = activityStats.lastActivity 
    ? formatDate(activityStats.lastActivity)
    : "N/A"

  // Prevent NaN from displaying in the UI and ensure percentages
  const displayPerformanceScore = Number.isNaN(performanceScore) ? 0 : Math.min(100, performanceScore)
  const displayAverageScore = Number.isNaN(activityStats.averageScore) ? 0 : Math.min(100, activityStats.averageScore)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsCard
        icon={Target}
        label="Overall Learning"
        value={`${displayPerformanceScore}%`}
        color="purple"
      />

      <AnalyticsCard
        icon={Activity}
        label="Quiz Accuracy"
        value={`${displayAverageScore}%`}
        color="cyan"
      />

      <AnalyticsCard
        icon={Clock}
        label="Total Study Time"
        value={`${hours}h ${minutes}m`}
        color="emerald"
      />

      <AnalyticsCard
        icon={Calendar}
        label="Last Session"
        value={formattedLastStudy}
        color="amber"
      />
    </div>
  )
}