"use client"

import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FeatureTooltipProps {
  content: string | React.ReactNode
  color?: "blue" | "green" | "purple"
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export function FeatureTooltip({ 
  content, 
  color = "blue", 
  side = "top", 
  align = "center" 
}: FeatureTooltipProps) {
  // Define color classes based on the color prop
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800"
  }

  const iconColorClasses = {
    blue: "text-blue-500 hover:text-blue-700",
    green: "text-green-500 hover:text-green-700",
    purple: "text-purple-500 hover:text-purple-700"
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center ${iconColorClasses[color]}`}
            aria-label="Help"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align} 
          className={`max-w-xs p-3 border shadow-md text-sm ${colorClasses[color]}`}
        >
          {typeof content === 'string' ? (
            <p>{content}</p>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}