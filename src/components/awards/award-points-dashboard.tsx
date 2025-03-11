import { Medal, AlertCircle, CheckCircle, Award } from "lucide-react"

interface AwardPointsDashboardProps {
  totalPoints: number
  paygrade: string
  selectedAwardsCount: number
}

export function AwardPointsDashboard({ totalPoints, paygrade, selectedAwardsCount }: AwardPointsDashboardProps) {
  const maxPoints = paygrade === "E6" ? 12 : 10
  const pointsRemaining = Math.max(0, maxPoints - totalPoints)
  const isOverLimit = totalPoints > maxPoints
  
  // Dynamic color classes based on point status
  const getPointsColorClass = () => {
    if (isOverLimit) return "points-danger"
    if (totalPoints >= maxPoints * 0.8) return "points-excellent"
    if (totalPoints >= maxPoints * 0.5) return "points-good"
    return "points-warning"
  }
  
  const scoreColorClass = getPointsColorClass()
  const StatusIcon = isOverLimit ? AlertCircle : CheckCircle

  return (
    <div className="award-dashboard rounded-xl shadow-lg p-6 border mb-8 slide-in text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-900/70"></div>
      <div className="absolute inset-0 radial-gradient"></div>
      <div className="relative z-10">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <Medal className="h-6 w-6 text-white icon-pulse" />
            <h2 className="text-xl font-semibold text-white">Total Award Points</h2>
          </div>
          <div className={`text-6xl font-bold mt-2 ${scoreColorClass}`}>
            {totalPoints.toFixed(1)}
          </div>
          <div className="flex items-center mt-3">
            <StatusIcon className={`h-5 w-5 mr-2 ${isOverLimit ? 'text-red-300' : 'text-white'}`} />
            <p className="text-sm text-white/80">
              {isOverLimit
                ? `Exceeds maximum of ${maxPoints} points for ${paygrade}`
                : `Within maximum of ${maxPoints} points for ${paygrade}`}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg shadow-sm border-l-[4px] border-l-blue-500 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Selected Awards</div>
            </div>
            <div className="text-2xl font-semibold text-gray-900">0</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-sm border-l-[4px] border-l-purple-500 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
              </svg>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Paygrade</div>
            </div>
            <div className="text-2xl font-semibold text-gray-900">E4</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-sm border-l-[4px] border-l-green-500 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M12 8V4"></path>
                <circle cx="12" cy="12" r="8"></circle>
                <path d="M12 16h.01"></path>
              </svg>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Points Remaining</div>
            </div>
            <div className="text-2xl font-semibold text-gray-900">10.0</div>
          </div>
          
          <div className="p-4 rounded-lg shadow-sm border-l-[4px] border-l-orange-500 bg-white">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isOverLimit ? "text-red-500" : "text-orange-600"}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <path d="M22 4 12 14.01l-3-3"></path>
              </svg>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</div>
            </div>
            <div className="text-2xl font-semibold text-green-500">
              Within Limit
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>
  )
}
