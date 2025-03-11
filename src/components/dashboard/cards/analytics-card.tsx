"use client"

import { useState, useEffect } from "react"
import { LineChart, Target, Activity, Clock, Calendar, Brain, BookOpen, TrendingUp } from "lucide-react"
import { useStudyAnalytics } from "@/hooks/use-study-analytics"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth"

interface WeeklyProgress {
    completed: number
    total: number
    percentage: number
}

export function AnalyticsCard() {
    const { getOverallStats, isLoading, error } = useStudyAnalytics()
    const { user } = useAuth()
    const [analytics, setAnalytics] = useState<{
        totalTimeSpent: number;
        totalQuestionsAnswered: number;
        totalCorrectAnswers: number;
        sessionCount: number;
    } | null>(null)

    useEffect(() => {
        let mounted = true;
        
        const fetchAnalytics = async () => {
            if (!user) return;
            
            try {
                const stats = await getOverallStats()
                if (stats && mounted) {
                    setAnalytics(stats)
                }
            } catch (err) {
                console.error('Failed to fetch analytics:', err)
            }
        }
        
        fetchAnalytics()
        
        return () => {
            mounted = false;
        }
    }, [user]) // Remove getOverallStats from dependencies

    if (isLoading) {
        return (
            <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
                <div className="flex items-center justify-center h-[200px]">
                    <div className="animate-pulse">Loading analytics...</div>
                </div>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
                <div className="flex items-center justify-center h-[200px] text-red-500">
                    Error loading analytics: {error}
                </div>
            </Card>
        )
    }

    if (!analytics) {
        return (
            <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    No analytics data available
                </div>
            </Card>
        )
    }

    const calculateWeeklyProgress = (): WeeklyProgress => {
        const weeklyGoal = 50
        const weeklyCompleted = Math.min(analytics.totalQuestionsAnswered, weeklyGoal)
        const percentage = Math.round((weeklyCompleted / weeklyGoal) * 100)

        return {
            completed: weeklyCompleted,
            total: weeklyGoal,
            percentage: Math.min(100, percentage)
        }
    }

    const weeklyProgress = calculateWeeklyProgress()

    // Calculate retention and efficiency with null checks
    const retentionRate = analytics.totalQuestionsAnswered > 0 
        ? (analytics.totalCorrectAnswers / analytics.totalQuestionsAnswered) * 100 
        : 0
    const reviewEfficiency = analytics.sessionCount > 0 
        ? (analytics.totalQuestionsAnswered / analytics.sessionCount) / 10 * 100 
        : 0

    return (
        <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
            
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium">Weekly Progress</h3>
                    <div className="flex items-center gap-2">
                        <Progress value={weeklyProgress.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground">
                            {weeklyProgress.completed}/{weeklyProgress.total} cards
                        </span>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium">Retention Rate</h3>
                    <div className="flex items-center gap-2">
                        <Progress value={retentionRate} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{Math.round(retentionRate)}%</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium">Review Efficiency</h3>
                    <div className="flex items-center gap-2">
                        <Progress value={reviewEfficiency} className="flex-1" />
                        <span className="text-sm text-muted-foreground">{Math.round(reviewEfficiency)}%</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium">Weekly Cards</h3>
                        <p className="text-2xl font-bold">{weeklyProgress.completed}</p>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium">Total Cards</h3>
                        <p className="text-2xl font-bold">{analytics.totalQuestionsAnswered}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
