"use client"

import { Button } from "@/components/ui/button"
import { Edit2, X } from "lucide-react"
import type { ProfileHeaderProps } from "@/types/profile"

export function ProfileHeader({ isEditing, setIsEditing }: ProfileHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {isEditing ? 'Edit Profile' : 'Profile'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isEditing ? 'Update your profile information' : 'View and manage your profile'}
        </p>
      </div>
      {!isEditing ? (
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setIsEditing(false)}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      )}
    </div>
  )
} 