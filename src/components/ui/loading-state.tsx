"use client"

import { Spinner } from "@/components/ui/spinner"

interface LoadingStateProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingState({
  text = "Loading...",
  size = "md",
  className,
}: LoadingStateProps) {
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