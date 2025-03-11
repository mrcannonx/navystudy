"use client"

import { useEffect } from "react"
import { ClientButton } from "@/components/ui/client-button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Safely log the error to avoid rendering objects directly
    if (error) {
      console.error(typeof error === 'object' ? JSON.stringify(error) : error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="mt-2 text-muted-foreground">
          {typeof error.message === 'string'
            ? error.message
            : "An unexpected error occurred"}
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <ClientButton onClick={reset} variant="default">
            Try again
          </ClientButton>
          <ClientButton onClick={() => window.location.href = "/"} variant="outline">
            Go back home
          </ClientButton>
        </div>
      </div>
    </div>
  )
}