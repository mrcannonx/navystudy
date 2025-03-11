import { TrendingUp, TrendingDown, Minus, BarChart3, Clock, Award, AlertTriangle } from "lucide-react"

interface PMADashboardProps {
  pmaScore: number
  paygrade: string
  evaluations: Array<{
    id: string
    date: string
    score: string
  }>
}

export function PMADashboard({ pmaScore, paygrade, evaluations }: PMADashboardProps) {
  // Sort evaluations by date (newest first) to ensure latest date is correct
  const sortedEvaluations = [...evaluations].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  const latestEvaluation = sortedEvaluations[0]
  const previousEvaluation = sortedEvaluations[1]
  const trend = latestEvaluation && previousEvaluation
    ? parseFloat(latestEvaluation.score) - parseFloat(previousEvaluation.score)
    : 0
    
  // Check if the selected paygrade requires RSCA PMA calculation
  const requiresRSCAPMA = paygrade === "E6" || paygrade === "E7"
  
  // Format date consistently (MM/DD/YYYY)
  const formatDate = (dateString: string) => {
    let dateObj: Date;
    
    // Handle different date formats
    if (dateString.includes('-') && !dateString.includes('T')) {
      // ISO format (YYYY-MM-DD) - add time component to ensure consistent parsing
      dateObj = new Date(`${dateString}T00:00:00`);
    } else {
      // MM/DD/YYYY format or already has time component
      dateObj = new Date(dateString);
    }
    
    // Get date parts in local timezone
    const month = dateObj.getMonth() + 1; // getMonth() returns 0-11
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    
    return `${month}/${day}/${year}`;
  }

  const getTrendDisplay = () => {
    if (trend === 0) return "Stable"
    return trend > 0 ? "Improving" : "Declining"
  }

  const getTrendIcon = () => {
    if (trend === 0) return <Minus className="h-4 w-4 text-gray-500" />
    return trend > 0
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return "score-outstanding"
    if (score >= 3.8) return "score-excellent"
    if (score >= 3.6) return "score-good"
    if (score >= 3.4) return "score-average"
    return "score-poor"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 4.0) return "Outstanding"
    if (score >= 3.8) return "Excellent"
    if (score >= 3.6) return "Good"
    if (score >= 3.4) return "Average"
    return "Needs Improvement"
  }

  return (
    <div className="pma-dashboard rounded-xl shadow-lg p-6 border mb-8 fade-in">
      <div className="flex items-start mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">Performance Mark Average</h2>
        </div>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          
          {requiresRSCAPMA ? (
            <>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border-l-4 border-amber-500">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      RSCA PMA Required for {paygrade}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Please use the FMS Calculator for accurate {paygrade} RSCA PMA calculation
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Simple PMA not applicable for {paygrade}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    NAVADMIN 312/18 requires RSCA PMA calculation
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-end gap-3">
                <div className={`text-6xl font-bold ${getScoreColor(pmaScore)}`}>
                  {pmaScore.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 pb-2 flex items-center gap-1">
                  {getTrendIcon()}
                  <span>{getTrendDisplay()}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating: {getScoreLabel(pmaScore)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Based on {evaluations.length} evaluation{evaluations.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="stat-card stat-card-primary bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Evaluations</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{evaluations.length}</div>
          </div>
          
          <div className="stat-card stat-card-secondary bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Paygrade</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{paygrade}</div>
          </div>
          
          <div className="stat-card stat-card-success bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Latest Score</div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {latestEvaluation ? latestEvaluation.score : "N/A"}
            </div>
          </div>
          
          <div className="stat-card stat-card-warning bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Latest Date</div>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {latestEvaluation ? formatDate(latestEvaluation.date) : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
