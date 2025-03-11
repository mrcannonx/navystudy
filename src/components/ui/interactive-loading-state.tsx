"use client"

import * as React from "react"
import { Spinner } from "@/components/ui/spinner"

interface InteractiveLoadingStateProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function InteractiveLoadingState({
  text = "Loading...",
  size = "md",
  className,
}: InteractiveLoadingStateProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Spinner size={size} />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground">
          {text}
        </p>
      )}
    </div>
  )
}
