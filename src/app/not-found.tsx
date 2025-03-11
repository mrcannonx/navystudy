"use client"

import Link from "next/link"
import { ClientButton } from "@/components/ui/client-button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <ClientButton onClick={() => window.history.back()} variant="default">
            Go back
          </ClientButton>
          <ClientButton asChild variant="outline">
            <Link href="/">Go home</Link>
          </ClientButton>
        </div>
      </div>
    </div>
  )
}