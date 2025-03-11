import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SettingTooltipProps {
  content: string
}

export function SettingTooltip({ content }: SettingTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="center" 
          className="max-w-xs p-3 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl text-sm"
        >
          <p className="text-gray-100">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
