import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Timer, CheckCircle2, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth'
import { Progress } from '@/components/ui/progress'
interface DailyMetrics {
    studyTime: number
    cardsViewed: number
    cardsCompleted: number
}

interface StudyAnalytics {
    metrics: {
        timeSpent: number
        questionsAnswered: number
        correctAnswers: number
    }
}

interface UserActivity {
    created_at: string
    activity_type: string
}

export function DailyStudyTime() {
    const { user } = useAuth()
    const [metrics, setMetrics] = useState<DailyMetrics>({
        studyTime: 0,
        cardsViewed: 0,
        cardsCompleted: 0
    })
    const [loading, setLoading] = useState(true)
    const [studySettings, setStudySettings] = useState<any>(null)

    // Add event listener for stats reset
    useEffect(() => {
        const handleStatsReset = () => {
            setMetrics({
                studyTime: 0,
                cardsViewed: 0,
                cardsCompleted: 0
            });
        };

        window.addEventListener('statsReset', handleStatsReset);
        return () => window.removeEventListener('statsReset', handleStatsReset);
    }, []);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user?.id) return
            const { data } = await supabase
                .from('profiles')
                .select('preferences')
                .eq('id', user.id)
                .single()
            setStudySettings(data?.preferences?.settings)
        }
        fetchSettings()
    }, [user?.id])

    useEffect(() => {
        const fetchDailyMetrics = async () => {
            if (!user?.id || !studySettings?.trackStatistics) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                
                // Get today's analytics
                const { data: analytics, error: analyticsError } = await supabase
                    .from('study_analytics')
                    .select('metrics')
                    .eq('user_id', user.id)
                    .eq('content_type', 'flashcard')
                    .gte('created_at', today.toISOString())
                    .lt('created_at', tomorrow.toISOString())

                if (analyticsError) {
                    console.error('Error fetching study analytics:', analyticsError)
                    return
                }

                // Get today's activities
                const { data: activities, error: activitiesError } = await supabase
                    .from('user_activities')
                    .select('created_at')
                    .eq('user_id', user.id)
                    .eq('activity_type', 'flashcard_study')
                    .gte('created_at', today.toISOString())
                    .lt('created_at', tomorrow.toISOString())

                if (activitiesError) {
                    console.error('Error fetching user activities:', activitiesError)
                    return
                }

                // Calculate totals from analytics
                const dailyMetrics = (analytics || []).reduce((acc, record: StudyAnalytics) => {
                    return {
                        studyTime: acc.studyTime + (record.metrics.timeSpent || 0),
                        cardsViewed: acc.cardsViewed + (record.metrics.questionsAnswered || 0),
                        cardsCompleted: acc.cardsCompleted + (record.metrics.correctAnswers || 0)
                    }
                }, {
                    studyTime: 0,
                    cardsViewed: 0,
                    cardsCompleted: 0
                })

                setMetrics(dailyMetrics)
            } catch (err) {
                console.error('Error in fetchDailyMetrics:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchDailyMetrics()
        
        // Set up interval to check for time reset at midnight
        const checkMidnight = () => {
            const now = new Date()
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                fetchDailyMetrics() // Automatically resets since we query by today's date
            }
        }

        const interval = setInterval(checkMidnight, 60000) // Check every minute

        return () => clearInterval(interval)
    }, [user?.id, studySettings?.trackStatistics])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    }

    const completionPercentage = metrics.cardsViewed > 0 
        ? (metrics.cardsCompleted / metrics.cardsViewed) * 100 
        : 0

    return (
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                        <Timer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Study Time</p>
                        <h3 className="text-2xl font-bold">
                            {loading ? "..." : formatTime(metrics.studyTime)}
                        </h3>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-500">Viewed</span>
                        </div>
                        <span className="font-medium">{metrics.cardsViewed}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-gray-500">Completed</span>
                        </div>
                        <span className="font-medium">{metrics.cardsCompleted}</span>
                    </div>
                    <Progress value={completionPercentage} className="h-1.5" />
                    <p className="text-xs text-gray-500 text-center">
                        {completionPercentage.toFixed(0)}% completion rate
                    </p>
                </div>
            </div>
        </Card>
    )
}
