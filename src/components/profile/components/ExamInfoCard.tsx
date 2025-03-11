import { Card } from "@/components/ui/card"
import { CalendarCheck, Target, Award, Clock } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import Image from "next/image"

interface ExamInfoCardProps {
  examInfo?: {
    name: string
    date: string
    target_rank: string | null
    target_rank_chevron_url?: string | null
  } | null
}

export function ExamInfoCard({ examInfo }: ExamInfoCardProps) {
  if (!examInfo?.date) {
    return (
      <Card className="p-6 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CalendarCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Next Exam</h3>
            <p className="text-sm text-muted-foreground">
              No exam scheduled
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const examDate = new Date(examInfo.date)
  const timeUntilExam = formatDistanceToNow(examDate, { addSuffix: true })
  const formattedDate = format(examDate, 'MMM dd, yyyy')

  return (
    <Card className="p-6 bg-white dark:bg-gray-900">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CalendarCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Next Exam</h3>
            <p className="text-sm text-muted-foreground">
              Upcoming advancement exam details
            </p>
          </div>
        </div>

        {/* Exam Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Exam Name Card */}
          <Card className="p-4 bg-blue-50/50 dark:bg-blue-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600/90 dark:text-blue-400/90">Exam Name</p>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{examInfo.name}</p>
              </div>
            </div>
          </Card>

          {/* Date Card */}
          <Card className="p-4 bg-purple-50/50 dark:bg-purple-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CalendarCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600/90 dark:text-purple-400/90">Date</p>
                <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">{formattedDate}</p>
              </div>
            </div>
          </Card>

          {/* Countdown Card */}
          <Card className="p-4 bg-green-50/50 dark:bg-green-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600/90 dark:text-green-400/90">Countdown</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">{timeUntilExam}</p>
              </div>
            </div>
          </Card>

          {/* Target Rank Card */}
          {examInfo.target_rank && (
            <Card className="p-4 bg-amber-50/50 dark:bg-amber-900/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-600/90 dark:text-amber-400/90">Target Rank</p>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                      {typeof examInfo.target_rank === 'string' ? examInfo.target_rank : 'Unknown Rank'}
                    </p>
                    {examInfo.target_rank_chevron_url && (
                      <div className="relative w-8 h-8">
                        <Image
                          src={examInfo.target_rank_chevron_url}
                          alt={`${examInfo.target_rank} chevron`}
                          fill
                          className="object-contain"
                          sizes="32px"
                          priority
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  )
} 