"use client"

import { useAuth } from "@/contexts/auth"
import { InteractiveButton } from "@/components/ui/interactive-button"

export function SignOutButton() {
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <InteractiveButton
      variant="ghost"
      className="relative w-full flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      action={handleSignOut}
    >
      Sign Out
    </InteractiveButton>
  )
}
