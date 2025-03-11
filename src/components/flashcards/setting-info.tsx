import { Info } from "lucide-react"
import { SETTING_DEPENDENCIES } from "@/config/study-settings"
import { StudySettingPath } from "@/types/study-settings"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SettingInfoProps {
  settingName: StudySettingPath
}

export function SettingInfo({ settingName }: SettingInfoProps) {
  const dependency = SETTING_DEPENDENCIES.find(dep => dep.setting === settingName)
  if (!dependency) return null

  const hasRelations = dependency.requires.length > 0 || 
                      dependency.conflicts.length > 0 || 
                      dependency.suggests.length > 0

  if (!hasRelations) return null

  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      {dependency.requires.length > 0 && (
        <div>
          <p className="font-medium text-sm mb-1">Requires:</p>
          <ul className="space-y-1">
            {dependency.requires.map(req => (
              <li key={req} className="text-amber-400 flex items-center gap-1 text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                {req.replace(/enabledCardTypes\./, '')}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dependency.conflicts.length > 0 && (
        <div>
          <p className="font-medium text-sm mb-1">Cannot be used with:</p>
          <ul className="space-y-1">
            {dependency.conflicts.map(conflict => (
              <li key={conflict} className="text-rose-400 flex items-center gap-1 text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                {conflict.replace(/enabledCardTypes\./, '')}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dependency.suggests.length > 0 && (
        <div>
          <p className="font-medium text-sm mb-1">Recommended with:</p>
          <ul className="space-y-1">
            {dependency.suggests.map(suggestion => (
              <li key={suggestion} className="text-emerald-400 flex items-center gap-1 text-sm">
                <span className="block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {suggestion.replace(/enabledCardTypes\./, '')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">{dependency.description}</p>
    </div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl"
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
