"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InteractiveTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const InteractiveTextarea = React.forwardRef<HTMLTextAreaElement, InteractiveTextareaProps>(
  ({ className, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return null
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
InteractiveTextarea.displayName = "InteractiveTextarea"
