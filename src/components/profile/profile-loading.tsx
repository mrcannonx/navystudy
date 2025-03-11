"use client"

import { Loader2 } from "lucide-react"

export function ProfileLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="mt-2 text-muted-foreground">Loading profile...</p>
      </div>
    </div>
  )
} 