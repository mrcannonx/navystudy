"use client"

import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/contexts/auth/types"
import { ExamInfoCard } from "@/components/profile/components/ExamInfoCard"
import { ProfileTabs } from "./ProfileTabs"
import { QuickLinks } from "./QuickLinks"

interface ProfileContentProps {
  user: User
  profile: Profile
}

export function ProfileContent({ user, profile }: ProfileContentProps) {
  return (
    <div className="lg:col-span-8 space-y-6">
      <ExamInfoCard examInfo={profile.exam_info} />
      <ProfileTabs profile={profile} />
      <QuickLinks />
    </div>
  )
}