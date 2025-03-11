"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth"
import { Container } from "@/components/ui/container"
import { Sidebar } from "@/components/layout/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user || !profile) {
        router.push('/auth?redirectedFrom=/admin')
        return
      }

      // Not an admin
      if (!profile.is_admin) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, profile, loading, router])

  // Show nothing while loading or redirecting
  if (loading || !user || !profile || !profile.is_admin) {
    return null
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Container className="py-6 sm:py-8">
          {children}
        </Container>
      </main>
    </div>
  )
} 