import { ClientButton } from "@/components/ui/client-button"
import { ClientInput } from "@/components/ui/client-input"
import { ClientSelect } from "@/components/ui/client-select"
import { getCycleOptions, PAYGRADE_OPTIONS } from "./constants"
import { FMSFormData, TooltipKey } from "./types"
import { TooltipButton } from "./tooltips"
import { Database } from "lucide-react"

interface CalculatorFormProps {
  formData: FMSFormData
  onInputChange: (field: string, value: string) => void
  onReset: () => void
  onTooltipClick: (key: TooltipKey) => void
  onSaveLoadClick?: () => void
}

export function CalculatorForm({
  formData,
  onInputChange,
  onReset,
  onTooltipClick,
  onSaveLoadClick
}: CalculatorFormProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <h1 className="text-2xl font-bold mb-6">Calculator Inputs</h1>
      
      {formData.prospectivePaygrade === "E7" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-md mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> For E7 advancement, only RSCA Performance Mark Average and Exam Standard Score are used in the FMS calculation. Other fields are disabled as they don't contribute to the E7 FMS.
          </p>
        </div>
      )}
      
      <div className="grid gap-6">
        {/* Basic Info Section */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="text-sm font-medium">Prospective Paygrade</label>
            <ClientSelect
              value={formData.prospectivePaygrade}
              onChange={(e) => onInputChange("prospectivePaygrade", e.target.value)}
              className="w-full h-10 mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {PAYGRADE_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </ClientSelect>
          </div>
          <div>
            <label className="text-sm font-medium">Cycle</label>
            <ClientSelect
              value={formData.cycle}
              onChange={(e) => onInputChange("cycle", e.target.value)}
              className="w-full h-10 mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {getCycleOptions(formData.prospectivePaygrade).map((cycle: string) => (
                <option key={cycle} value={cycle}>
                  {cycle}
                </option>
              ))}
            </ClientSelect>
          </div>
        </div>

        {/* Performance Section */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TooltipButton tooltipKey="pma" onClick={onTooltipClick} />
              <label className="text-sm font-medium flex-1">Performance Mark Average</label>
            </div>
            <ClientInput
              type="number"
              value={formData.pma}
              onChange={(e) => onInputChange("pma", e.target.value)}
              min="0"
              max="4.00"
              step="0.01"
              placeholder="0 - 4.00"
              className="w-full"
              disabled={formData.prospectivePaygrade === "E6" || formData.prospectivePaygrade === "E7"}
            />
            {(formData.prospectivePaygrade === "E6" || formData.prospectivePaygrade === "E7") && (
              <p className="text-xs text-amber-600 mt-1">
                For {formData.prospectivePaygrade}, use the RSCA PMA Calculator below
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <TooltipButton tooltipKey="exam" onClick={onTooltipClick} />
              <label className="text-sm font-medium flex-1">Exam Standard Score</label>
            </div>
            <ClientInput
              type="number"
              value={formData.examScore}
              onChange={(e) => onInputChange("examScore", e.target.value)}
              min="0"
              max="80.00"
              step="0.01"
              placeholder="0 - 80.00"
              className="w-full"
            />
          </div>
        </div>

        {/* Points Section */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TooltipButton tooltipKey="awards" onClick={onTooltipClick} />
              <label className="text-sm font-medium flex-1">Award Points</label>
            </div>
            <ClientInput
              type="number"
              value={formData.awards}
              onChange={(e) => onInputChange("awards", e.target.value)}
              min="0"
              max={formData.prospectivePaygrade === "E6" ? "12" : "10"}
              step="1"
              placeholder={formData.prospectivePaygrade === "E6" ? "0 - 12" : "0 - 10"}
              className="w-full"
              disabled={formData.prospectivePaygrade === "E7"}
            />
            <p className={formData.prospectivePaygrade === "E7" ? "text-xs text-amber-600 mt-1" : "text-xs text-gray-500 mt-1"}>
              {formData.prospectivePaygrade === "E7"
                ? "Not used for E7 advancement"
                : formData.prospectivePaygrade === "E6"
                  ? "Max 12 points for E6"
                  : "Max 10 points for E5"}
            </p>
          </div>

          {/* Augmentee Points removed as per NAVADMIN 312/18 */}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <TooltipButton tooltipKey="pna" onClick={onTooltipClick} />
              <label className="text-sm font-medium flex-1">Pass Not Advanced</label>
            </div>
            <ClientInput
              type="number"
              value={formData.passNotAdvanced}
              onChange={(e) => onInputChange("passNotAdvanced", e.target.value)}
              min="0"
              max="9"
              step="0.1"
              placeholder="0.0 - 9.0"
              className="w-full"
              disabled={formData.prospectivePaygrade === "E7"}
            />
            <p className={formData.prospectivePaygrade === "E7" ? "text-xs text-amber-600 mt-1" : "text-xs text-gray-500 mt-1"}>
              {formData.prospectivePaygrade === "E7"
                ? "Not used for E7 advancement"
                : "Limited to 3 previous advancement cycles"}
            </p>
          </div>
        </div>

        {/* Service & Education Section */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TooltipButton tooltipKey="service" onClick={onTooltipClick} />
              <label className="text-sm font-medium flex-1">Service in Paygrade</label>
            </div>
            {formData.prospectivePaygrade === "E7" && (
              <p className="text-xs text-amber-600 mb-2">
                Not used for E7 advancement
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Years</label>
                <ClientInput
                  type="number"
                  value={formData.serviceYears}
                  onChange={(e) => onInputChange("serviceYears", e.target.value)}
                  min="0"
                  max="30"
                  placeholder="0 - 30"
                  className="w-full"
                  disabled={formData.prospectivePaygrade === "E7"}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Months</label>
                <ClientInput
                  type="number"
                  value={formData.serviceMonths}
                  onChange={(e) => onInputChange("serviceMonths", e.target.value)}
                  min="0"
                  max="11"
                  placeholder="0 - 11"
                  className="w-full"
                  disabled={formData.prospectivePaygrade === "E7"}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <TooltipButton tooltipKey="education" onClick={onTooltipClick} />
              <label className="text-sm font-medium flex-1">Education</label>
            </div>
            {formData.prospectivePaygrade === "E7" && (
              <p className="text-xs text-amber-600 mb-2">
                Not used for E7 advancement
              </p>
            )}
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="text-xs text-muted-foreground opacity-0">Type</label>
                <ClientSelect
                  value={formData.education}
                  onChange={(e) => onInputChange("education", e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={formData.prospectivePaygrade === "E7"}
                >
                  <option value="None">None</option>
                  <option value="Associate's">Associate's (2 points)</option>
                  <option value="Bachelor's or Higher">Bachelor's or Higher (4 points)</option>
                </ClientSelect>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <button
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-lg"
        >
          Calculate Final Multiple Score
        </button>
        <button
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
          onClick={onReset}
        >
          Reset All Parameters
        </button>
        <button
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          onClick={onSaveLoadClick}
        >
          <Database className="h-5 w-5" />
          <span>Save/Load</span>
        </button>
      </div>
    </div>
  )
}
