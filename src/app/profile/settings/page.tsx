"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "@/components/profile"
import { ProfileLoading } from "@/components/profile/profile-loading"
import { Footer } from "@/components/footer"

export default function ProfileSettingsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <ProfileLoading />
        </div>
        <Footer />
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Container className="py-8 md:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Link href="/profile">
            <Button variant="outline" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Back to Profile
            </Button>
          </Link>
        </div>
        
        <Card className="p-4 md:p-6">
          <ProfileForm />
        </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  )
} 