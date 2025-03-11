import { Info } from "lucide-react"
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { TOOLTIP_CONTENT } from "./constants"
import { TooltipKey } from "./types"

interface TooltipsProps {
  activeTooltip: TooltipKey | null
  onClose: () => void
}

export function Tooltips({ activeTooltip, onClose }: TooltipsProps) {
  // Only render if there's an active tooltip
  if (!activeTooltip) return null;
  
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white p-4 rounded-lg shadow-lg max-w-md" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">{TOOLTIP_CONTENT[activeTooltip].title}</h3>
        <p className="text-gray-700">{TOOLTIP_CONTENT[activeTooltip].content}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

interface TooltipButtonProps {
  tooltipKey: TooltipKey
  onClick: (key: TooltipKey) => void
}

export function TooltipButton({ tooltipKey, onClick }: TooltipButtonProps) {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClick(tooltipKey);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Info className="h-4 w-4 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" className="bg-white text-gray-800 p-2 max-w-xs">
          <div>
            <h4 className="font-medium mb-1">{TOOLTIP_CONTENT[tooltipKey].title}</h4>
            <p className="text-xs">Click for more details</p>
          </div>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}
