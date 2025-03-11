"use client"

import { User } from "@supabase/supabase-js"
import { useAuth } from "@/contexts/auth"
import Link from "next/link"
import { FolderKanban, Settings, LogOut, LayoutDashboard, Shield } from "lucide-react"

interface ProfileMenuItemsProps {
  user: User
}

export function ProfileMenuItems({ user }: ProfileMenuItemsProps) {
  const { signOut, profile } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="py-2">
      <div className="px-3 py-2 text-sm text-muted-foreground">
        {user.email}
      </div>
      
      <Link href="/dashboard" className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
        <LayoutDashboard className="mr-2 h-4 w-4" />
        <span>Dashboard</span>
      </Link>

      {profile?.is_admin && (
        <Link href="/admin" className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
          <Shield className="mr-2 h-4 w-4" />
          <span>Admin Dashboard</span>
        </Link>
      )}

      <Link href="/profile" className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
        <Settings className="mr-2 h-4 w-4" />
        <span>Profile Settings</span>
      </Link>
      
      <Link href="/manage" className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
        <FolderKanban className="mr-2 h-4 w-4" />
        <span>Content Manager</span>
      </Link>
      
      <button
        onClick={handleSignOut}
        className="relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </button>
    </div>
  )
}
