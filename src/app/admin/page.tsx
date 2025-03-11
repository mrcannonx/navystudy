"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import {
  Users,
  Brain,
  BookOpen,
  Clock,
  TrendingUp,
  Target,
  Activity,
  Smartphone,
  Laptop,
  Tablet,
  FileQuestion,
  ClipboardCheck
} from "lucide-react"
import { useAdminAnalytics } from "@/hooks/use-admin-analytics"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from 'date-fns'

export default function AdminPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const { analytics, loading, error } = useAdminAnalytics()

  // Protect admin route
  useEffect(() => {
    if (!profile?.is_admin) {
      router.push("/")
    }
  }, [profile, router])

  if (!profile?.is_admin) return null

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-red-500 mt-2">Error loading dashboard: {error.message}</p>
        </div>
      </div>
    )
  }

  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz_completion':
        return <FileQuestion className="w-4 h-4 text-purple-600" />
      case 'flashcard_study':
        return <BookOpen className="w-4 h-4 text-green-600" />
      case 'study_session':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'content_creation':
        return <Target className="w-4 h-4 text-orange-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{analytics?.platformStats.totalUsers.toLocaleString()}</p>
                <span className="text-sm text-green-600">+{analytics?.platformStats.growthRates.users || 0}%</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Quizzes</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{analytics?.platformStats.activeQuizzes.toLocaleString()}</p>
                <span className="text-sm text-green-600">+{analytics?.platformStats.growthRates.quizzes || 0}%</span>
              </div>
            </div>
            <div className="p-2 bg-purple-50 rounded-full">
              <FileQuestion className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Flashcard Decks</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{analytics?.platformStats.flashcardDecks.toLocaleString()}</p>
                <span className="text-sm text-green-600">+{analytics?.platformStats.growthRates.flashcards || 0}%</span>
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Evaluations Created</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{analytics?.platformStats.evaluationsCreated.toLocaleString()}</p>
                <span className="text-sm text-green-600">+{analytics?.platformStats.growthRates.evaluations || 0}%</span>
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded-full">
              <ClipboardCheck className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* User Growth & Engagement */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* New Users & Retention */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New Users (7 Days)</span>
                <span className="font-medium">{analytics?.newUsers7Days || 0}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: formatPercentage((analytics?.newUsers7Days || 0) / (analytics?.platformStats.totalUsers || 1)) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Daily Active Users</span>
                <span className="font-medium">{analytics?.dailyActiveUsers || 0}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: formatPercentage((analytics?.dailyActiveUsers || 0) / (analytics?.platformStats.totalUsers || 1)) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">User Retention</span>
                <span className="font-medium">{formatPercentage(analytics?.retentionRate || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.retentionRate || 0) }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Device Distribution */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Device Distribution</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <span className="text-muted-foreground">Desktop</span>
                </div>
                <span className="font-medium">{formatPercentage(analytics?.deviceDistribution.desktop || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.deviceDistribution.desktop || 0) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">Mobile</span>
                </div>
                <span className="font-medium">{formatPercentage(analytics?.deviceDistribution.mobile || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.deviceDistribution.mobile || 0) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-purple-600" />
                  <span className="text-muted-foreground">Tablet</span>
                </div>
                <span className="font-medium">{formatPercentage(analytics?.deviceDistribution.tablet || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.deviceDistribution.tablet || 0) }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Peak Usage Times */}
        <Card className="p-6 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Peak Usage Times</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Morning (6-12)</span>
                <span className="font-medium">{formatPercentage(analytics?.peakUsageTimes.morning || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.peakUsageTimes.morning || 0) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Afternoon (12-18)</span>
                <span className="font-medium">{formatPercentage(analytics?.peakUsageTimes.afternoon || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.peakUsageTimes.afternoon || 0) }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Evening (18-24)</span>
                <span className="font-medium">{formatPercentage(analytics?.peakUsageTimes.evening || 0)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: formatPercentage(analytics?.peakUsageTimes.evening || 0) }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 