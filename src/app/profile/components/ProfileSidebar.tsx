"use client"

import { Card } from "@/components/ui/card"
import { Mail, User as UserIcon, Shield, Anchor, Clock } from "lucide-react"
import type { User as AuthUser } from "@supabase/supabase-js"
import type { Profile } from "@/contexts/auth/types"
import { useInsigniaData } from "../hooks"
import { InsigniaDisplay } from "./InsigniaDisplay"

interface ProfileSidebarProps {
  user: AuthUser
  profile: Profile
}

export function ProfileSidebar({ user, profile }: ProfileSidebarProps) {
  const { rankImage, insigniaImage, isLoading } = useInsigniaData(profile)
  
  return (
    <div className="lg:col-span-4 space-y-6">
      <PersonalInfoCard user={user} profile={profile} />
      <InsigniaCard 
        rankImage={rankImage} 
        insigniaImage={insigniaImage} 
        profile={profile} 
        isLoading={isLoading} 
      />
    </div>
  )
}

function PersonalInfoCard({ user, profile }: { user: AuthUser, profile: Profile }) {
  return (
    <Card className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-950 transition-all duration-200 hover:shadow-xl">
      <div className="relative">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            Personal Information
          </h2>
        </div>
        
        {/* Content area with improved spacing */}
        <div className="p-5 space-y-5">
          {/* Email */}
          <div className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
            </div>
          </div>
          
          {/* Rank */}
          <div className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rank</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.rank || 'Not specified'}</p>
            </div>
          </div>
          
          {/* Rate */}
          <div className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rate</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.rate || 'Not specified'}</p>
            </div>
          </div>
          
          {/* Duty Station */}
          <div className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Anchor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duty Station</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.duty_station || 'Not specified'}</p>
            </div>
          </div>
          
          {/* Years of Service */}
          <div className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Years of Service</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{profile.years_of_service || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

interface InsigniaCardProps {
  rankImage: { id: string; rank_code: string; image_url: string | null } | null
  insigniaImage: { id: string; rate: string; image_url: string | null } | null
  profile: Profile
  isLoading: boolean
}

function InsigniaCard({ rankImage, insigniaImage, profile, isLoading }: InsigniaCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-950 transition-all duration-200 hover:shadow-xl">
      <div className="relative">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center">
            Insignia
          </h2>
        </div>
        
        <div className="p-5">
          <div className="flex flex-col items-center gap-8 py-2">
            <InsigniaDisplay
              title="Rank Insignia"
              imageUrl={rankImage?.image_url || null}
              altText={`${profile.rank} insignia`}
              isLoading={isLoading && !!profile.rank}
            />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
            
            <InsigniaDisplay
              title="Rate Insignia"
              imageUrl={insigniaImage?.image_url || null}
              altText={`${profile.rate} insignia`}
              isLoading={isLoading && !!profile.rate}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}