import { useState, useEffect } from "react"
import { Brain, BookOpen, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface RecentActivityProps {
    userId: string
}

interface UserActivity {
    id: string;
    content_type: 'quiz' | 'flashcard';
    content_id: string | null;
    content_title: string;
    activity_type: string | null;
    activity_data: {
        score: number;
        timeSpent: number;
        questionsAnswered: number;
        correctAnswers: number;
        completed: boolean;
        topic: string | null;
        metrics?: Record<string, any>;
    } | null;
    created_at: string | null;
    completed_at: string | null;
    user_id: string | null;
}

export function RecentActivity({ userId }: RecentActivityProps) {
    const [activities, setActivities] = useState<UserActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchActivities() {
            if (!userId) {
                setLoading(false)
                return
            }
            
            try {
                const { data: activities, error: apiError } = await supabase
                    .from('user_activities')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })
                    .limit(5)

                if (apiError) {
                    console.error('Error fetching activities:', apiError)
                    setError(apiError.message)
                    setActivities([])
                } else {
                    setActivities(activities || [])
                    setError(null)
                }
            } catch (err) {
                console.error('Error fetching activities:', err)
                setError('Failed to fetch activities')
                setActivities([])
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [userId])

    function getActivityIcon(type: string) {
        switch (type) {
            case 'quiz':
                return <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            case 'flashcard':
                return <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
            default:
                return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        }
    }

    function getActivityColor(type: string) {
        switch (type) {
            case 'quiz':
                return 'bg-purple-100 dark:bg-purple-900/20'
            case 'flashcard':
                return 'bg-green-100 dark:bg-green-900/20'
            default:
                return 'bg-gray-100 dark:bg-gray-900/20'
        }
    }

    function getActivityTitle(activity: UserActivity) {
        const score = activity.activity_data?.score || 0
        const type = activity.content_type || 'unknown'
        const topic = activity.activity_data?.topic || null
        return `${type.charAt(0).toUpperCase() + type.slice(1)} Session${topic ? ` - ${topic}` : ''} (Score: ${score}%)`
    }

    if (loading) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <div className="flex items-center justify-center p-8">
                    <Clock className="h-6 w-6 animate-spin text-blue-600" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-red-500 dark:text-red-400 text-center">
                    Error loading activities
                </p>
            </div>
        )
    }

    if (activities.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    No recent activity to display
                </p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <Card key={activity.id} className="p-4 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${getActivityColor(activity.content_type)}`}>
                                    {getActivityIcon(activity.content_type)}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {getActivityTitle(activity)}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {activity.activity_data?.questionsAnswered || 0} questions, {activity.activity_data?.correctAnswers || 0} correct
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {activity.created_at ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true }) : 'Unknown time'}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}