import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useStudyAnalytics } from "@/hooks/use-study-analytics"
import { AnalyticsData } from "./types"

export function useAnalyticsData() {
  const { getOverallStats } = useStudyAnalytics()
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    let mounted = true

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        const stats = await getOverallStats()

        if (stats && mounted) {
          setAnalytics(stats)
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error occurred'))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAnalytics()

    return () => {
      mounted = false
    }
  }, [user, getOverallStats])

  return { analytics, isLoading, error }
}