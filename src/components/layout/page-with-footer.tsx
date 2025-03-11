import React from "react"
import { Footer } from "@/components/footer"

interface PageWithFooterProps {
  children: React.ReactNode
  className?: string
}

export function PageWithFooter({ children, className }: PageWithFooterProps) {
  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col bg-background ${className || ''}`}>
      <div className="flex-grow">
        {children}
      </div>
      <div className="mt-[23rem]">
        <Footer />
      </div>
    </div>
  )
}
