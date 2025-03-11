"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/footer"

export function RootClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}