import { FMSFormData, PointBreakdown } from "./types"
import { calculateFMS, getPointsBreakdown, getScoreColor } from "./calculator-utils"

interface ScoreDashboardProps {
  formData: FMSFormData
}

export function ScoreDashboard({ formData }: ScoreDashboardProps) {
  const score = parseFloat(calculateFMS(formData))
  const pointsBreakdown = getPointsBreakdown(formData)
  const scoreColorClass = getScoreColor(score)

  return (
    <div className="bg-slate-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md p-8 border border-blue-100 dark:border-blue-900/30 fms-dashboard relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/30 dark:bg-blue-800/10 rounded-full -mr-10 -mt-10 z-0"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/20 dark:bg-blue-800/5 rounded-full -ml-10 -mb-10 z-0"></div>
      
      <div className="grid sm:grid-cols-2 gap-8 relative z-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">Final Multiple Score</h2>
          <div className={`text-7xl font-bold ${scoreColorClass}`}>
            {score.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Score Range: 20.00 - {formData.prospectivePaygrade === "E6" ? "222.00" : formData.prospectivePaygrade === "E7" ? "200.00" : "169.00"}
          </p>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg inline-block">
            <p className="mb-1">Paygrade: <span className="font-semibold text-gray-800 dark:text-gray-200">{formData.prospectivePaygrade}</span></p>
            <p>Cycle: <span className="font-semibold text-gray-800 dark:text-gray-200">{formData.cycle}</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {pointsBreakdown.map(({ label, value }: PointBreakdown) => {
            const borderColor =
              label === "PMA/RSCA" ? "border-blue-500" :
              label === "Exam" ? "border-purple-500" :
              label === "Awards" ? "border-green-500" :
              label === "Augmentee" ? "border-amber-500" :
              label === "PNA" ? "border-amber-500" :
              label === "Service" ? "border-amber-500" :
              "border-teal-500";
              
            return (
              <div
                key={label}
                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow duration-200 ${borderColor}`}
              >
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-1">{value.toFixed(2)}</div>
                {/* Show raw value and formula if available */}
                {(label === "PMA/RSCA" || label === "Service") && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {label === "PMA/RSCA" && (
                      <>
                        {formData.prospectivePaygrade === "E6" || formData.prospectivePaygrade === "E7" ? (
                          <>
                            RSCA PMA: {parseFloat(formData.rscaPma || "0").toFixed(2)}
                            <br />
                            Formula: {pointsBreakdown.find(p => p.label === "PMA/RSCA")?.formula}
                          </>
                        ) : (
                          <>
                            Raw: {(pointsBreakdown.find(p => p.label === "PMA/RSCA")?.rawValue || 0).toFixed(2)}
                            <br />
                            Formula: {pointsBreakdown.find(p => p.label === "PMA/RSCA")?.formula}
                          </>
                        )}
                      </>
                    )}
                    {label === "Service" && (
                      <>
                        Raw: {(pointsBreakdown.find(p => p.label === "Service")?.rawValue || 0).toFixed(2)} yrs
                        <br />
                        Formula: {pointsBreakdown.find(p => p.label === "Service")?.formula}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
