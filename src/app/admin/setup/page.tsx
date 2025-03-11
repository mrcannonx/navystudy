"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { setUserAsAdmin } from "../set-admin"
import { useToast } from "@/contexts/toast-context"
import { useRouter } from "next/navigation"
import { Shield, Loader2 } from "lucide-react"

export default function AdminSetup() {
  const { user, profile, onProfileUpdate } = useAuth()
  const { addToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSetAdmin = async () => {
    if (!user) return

    try {
      setLoading(true)
      const result = await setUserAsAdmin(user.id)

      if (!result.success) {
        throw new Error(result.error)
      }

      await onProfileUpdate()
      
      addToast({
        title: "Success",
        description: "You are now an admin user",
      })

      router.push("/admin")
    } catch (error) {
      console.error('Error setting admin:', error)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set admin status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (profile?.is_admin) {
    router.push("/admin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-lg py-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Admin Setup</h1>
            </div>
            <p className="text-muted-foreground">
              Click the button below to set yourself as an admin user. This will give you access to the admin dashboard and other administrative features.
            </p>
            <Button
              onClick={handleSetAdmin}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up admin...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Make me an admin
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 