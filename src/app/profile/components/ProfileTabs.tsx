"use client"

import Link from "next/link"
import { User, BookOpen, Medal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Profile } from "@/contexts/auth/types"

interface ProfileTabsProps {
  profile: Profile
}

export function ProfileTabs({ profile }: ProfileTabsProps) {
  return (
    <Card className="overflow-hidden shadow-md">
      <Tabs defaultValue="bio" className="w-full">
        <div className="border-b px-6 py-3">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="bio" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Bio
            </TabsTrigger>
            <TabsTrigger value="specializations" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Specializations
            </TabsTrigger>
            <TabsTrigger value="awards" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">
              <Medal className="h-4 w-4 mr-2" />
              Awards
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="bio" className="p-6">
          <h3 className="text-xl font-semibold mb-4">About Me</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            {profile.bio ? (
              <p className="whitespace-pre-line">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio provided. <Link href="/profile/settings" as="/profile/settings" className="text-blue-600 hover:underline">Add one now</Link></p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="specializations" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Specializations</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            {profile.specializations ? (
              <p className="whitespace-pre-line">{profile.specializations}</p>
            ) : (
              <p className="text-muted-foreground italic">No specializations listed. <Link href="/profile/settings" as="/profile/settings" className="text-blue-600 hover:underline">Add some now</Link></p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="awards" className="p-6">
          <h3 className="text-xl font-semibold mb-4">Awards & Achievements</h3>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            {profile.awards ? (
              <p className="whitespace-pre-line">{profile.awards}</p>
            ) : (
              <p className="text-muted-foreground italic">No awards listed. <Link href="/profile/settings" as="/profile/settings" className="text-blue-600 hover:underline">Add some now</Link></p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}