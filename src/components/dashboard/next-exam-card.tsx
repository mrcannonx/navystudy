"use client"

import { CalendarCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

interface NextExamCardProps {
  examInfo?: {
    name: string
    date: string
    target_rank: string | null
  } | null
  targetRankChevronUrl?: string | null
}

export function NextExamCard({ examInfo, targetRankChevronUrl }: NextExamCardProps) {
  if (!examInfo?.date) {
    return (
      <Card className="h-full p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-900 flex flex-col shadow-sm border border-green-100 dark:border-green-800 transition-all duration-300 hover:shadow relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/20 rounded-lg shadow-sm">
              <CalendarCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Next Exam</h3>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 bg-green-50/50 dark:bg-green-900/10 p-2 rounded-lg border border-green-100/50 dark:border-green-800/30">
              No exam scheduled
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const examDate = new Date(examInfo.date)
  const timeUntilExam = formatDistanceToNow(examDate, { addSuffix: true })

  return (
    <Card className="next-exam-card h-full p-4 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-gray-900 flex flex-col shadow-sm border border-green-100 dark:border-green-800 transition-all duration-300 hover:shadow relative overflow-hidden">
      {/* Decorative accent */}
      <div className="accent absolute top-0 left-0 w-full h-1 bg-green-500"></div>
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="icon-bg p-2 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/20 rounded-lg shadow-sm">
            <CalendarCheck className="icon h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Next Exam</h3>
          </div>
        </div>
        <div className="text-center">
          <p className="time-text text-4xl font-bold text-green-600 dark:text-green-400">
            {timeUntilExam}
          </p>
        </div>
        {targetRankChevronUrl && (
          <>
            <div className="divider my-2 border-t border-green-100 dark:border-green-800/30" />
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <Image
                  src={targetRankChevronUrl}
                  alt={`${examInfo.target_rank} chevron`}
                  fill
                  className="object-contain"
                  sizes="80px"
                  priority
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
