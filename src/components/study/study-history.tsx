"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useStudyAnalytics } from '@/hooks/use-study-analytics'

interface StudyHistoryProps {
  userId: string
  contentType?: 'quiz' | 'flashcard'
}

export default function StudyHistory({ userId, contentType }: StudyHistoryProps) {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getSessionsByDateRange } = useStudyAnalytics()

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get last 30 days of study sessions
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)

        let sessions = await getSessionsByDateRange(startDate, endDate)

        // Filter by content type if specified
        if (contentType) {
          sessions = sessions.filter(session => session.content_type === contentType)
        }

        // Transform data for display
        const formattedHistory = sessions.map(session => ({
          date: new Date(session.created_at).toLocaleDateString(),
          timeSpent: session.metrics.timeSpent,
          questionsAnswered: session.metrics.questionsAnswered,
          correctAnswers: session.metrics.correctAnswers,
          accuracy: session.metrics.questionsAnswered > 0
            ? ((session.metrics.correctAnswers / session.metrics.questionsAnswered) * 100).toFixed(1)
            : 'N/A',
          confidenceRating: session.metrics.confidenceRating || 'N/A',
          type: session.content_type
        }))

        if (mounted) {
          setHistory(formattedHistory)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error loading study history:', error)
        if (mounted) {
          setError('Failed to load study history')
          setIsLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      mounted = false
    }
  }, [userId, contentType, getSessionsByDateRange])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Study History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Date', 'Type', 'Time Spent', 'Questions', 'Accuracy', 'Confidence'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Study History</h2>
        <div className="p-4 text-center text-red-500">
          Error: {error}
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Study History</h2>
        <div className="p-4 text-center text-gray-500">
          No study history found
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Study History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((session, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{session.date}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{session.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Math.round(session.timeSpent / 60)} min</td>
                <td className="px-6 py-4 whitespace-nowrap">{session.questionsAnswered}</td>
                <td className="px-6 py-4 whitespace-nowrap">{session.accuracy}%</td>
                <td className="px-6 py-4 whitespace-nowrap">{session.confidenceRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
