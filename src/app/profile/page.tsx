"use client"

import { ProfileLoading } from "@/components/profile/profile-loading"
import { Container } from "@/components/ui/container"
import { Footer } from "@/components/footer"
import { useProfileData } from "./hooks"
import { ProfileHero, ProfileSidebar, ProfileContent } from "./components"

export default function ProfilePage() {
  const { user, profile, loading } = useProfileData()
  
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow">
        <ProfileHero user={user} profile={profile} />
        <Container className="py-8 md:py-12 mt-16 md:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <ProfileSidebar user={user} profile={profile} />
            <ProfileContent user={user} profile={profile} />
          </div>
        </Container>
      </div>
      <div className="mt-16"></div>
      <Footer />
    </div>
  )
}
