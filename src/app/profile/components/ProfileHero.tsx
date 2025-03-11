"use client"

import Link from "next/link"
import { Pencil, Anchor } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User as AuthUser } from "@supabase/supabase-js"
import type { Profile } from "@/contexts/auth/types"
import { useAvatarUpload } from "../hooks"

interface ProfileHeroProps {
  user: AuthUser
  profile: Profile
}

export function ProfileHero({ user, profile }: ProfileHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-40 md:h-56">
      <div className="absolute inset-0 bg-opacity-30 bg-black"
           style={{
             backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
             backgroundSize: "20px 20px"
           }}>
      </div>
      <Container className="relative h-full flex items-end pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8 w-full">
          <ProfileHeroAvatar profile={profile} user={user} />
          <ProfileHeroInfo profile={profile} />
          <div className="mt-4 md:mt-0">
            <Link href={"/profile/settings" as any}>
              <Button className="bg-white text-blue-700 hover:bg-blue-50">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}

function ProfileHeroAvatar({ profile, user }: { profile: Profile, user: AuthUser }) {
  const { handleAvatarUpload, isUploading } = useAvatarUpload(user, profile)
  
  return (
    <div className="relative -mb-20 md:-mb-16 z-10 mt-auto">
      <div className="relative">
        <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
          <img
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.full_name}&background=0D8ABC&color=fff`}
            alt={profile.full_name || "Profile"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${profile.full_name}&background=0D8ABC&color=fff`;
            }}
          />
        </div>
        <Link href={"/profile/settings" as any} className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors">
          <Pencil className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}

import { formatNameWithRankRate } from "../utils"

function ProfileHeroInfo({ profile }: { profile: Profile }) {

  return (
    <div className="flex-grow pt-4 md:pt-0 text-white">
      <h1 className="text-3xl md:text-4xl font-bold">{formatNameWithRankRate(profile)}</h1>
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {profile.rank && profile.rate && (
          <Badge variant="secondary" className="text-sm font-medium text-white bg-blue-800/70 hover:bg-blue-700/80 border border-blue-400/30 px-3 py-1 rounded-full shadow-sm transition-all duration-200">
            {[profile.rank, profile.rate].filter(Boolean).join(' ')}
          </Badge>
        )}
        {profile.duty_station && (
          <Badge variant="secondary" className="text-sm font-medium text-white bg-blue-800/70 hover:bg-blue-700/80 border border-blue-400/30 px-3 py-1 rounded-full shadow-sm transition-all duration-200">
            <Anchor className="h-3.5 w-3.5 mr-1.5 text-white" />
            {profile.duty_station}
          </Badge>
        )}
      </div>
    </div>
  )
}