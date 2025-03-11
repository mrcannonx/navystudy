"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InteractiveInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InteractiveInput = React.forwardRef<HTMLInputElement, InteractiveInputProps>(
  ({ className, type, ...props }, ref) => {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return null
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out shadow-sm hover:border-blue-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
InteractiveInput.displayName = "InteractiveInput"
