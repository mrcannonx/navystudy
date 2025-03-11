"use client"

// Note: Server-side directives like dynamic, fetchCache, and revalidate
// cannot be used in client components

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Bell, 
  Moon,
  Sun,
  Mail,
  Shield,
  Smartphone,
  Globe,
  Volume2,
  Eye,
  Clock,
  Save,
  UserX,
  KeyRound
} from "lucide-react"
import { useToast } from "@/contexts/toast-context"
import { useAuth } from "@/contexts/auth"
import { useSettings } from "@/contexts/settings-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Container } from "@/components/ui/container"
import { SettingsForm } from "@/components/settings/settings-form"
import { Footer } from "@/components/footer"

export default function SettingsPage() {
  const { addToast } = useToast()
  const { user, profile, signOut, loading: authLoading } = useAuth()
  
  let settingsContext;
  try {
    settingsContext = useSettings();
  } catch (error) {
    // Return a fallback during static generation
    return null;
  }
  
  const { settings, loading: settingsLoading, updateSettings } = settingsContext;
  const { theme, setTheme } = useTheme()

  // Appearance Settings
  const [darkMode, setDarkMode] = useState(false)

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [showProgress, setShowProgress] = useState(true)
  const [showActivity, setShowActivity] = useState(true)

  // Account Management
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleSaveSettings = async () => {
    try {
      const newSettings = {
        dark_mode: darkMode,
        profile_visibility: profileVisibility as 'public' | 'private',
        show_progress: showProgress,
        show_activity: showActivity,
      }
      
      await updateSettings(newSettings)
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      addToast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      setIsChangingPassword(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      addToast({
        title: "Success",
        description: "Password updated successfully",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      addToast({
        title: "Error",
        description: "Please enter your email correctly to confirm deletion",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeletingAccount(true)
      
      // Delete user data from profiles table (which includes all settings)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Delete user authentication
      const { error: authError } = await supabase.auth.admin.deleteUser(user?.id!)

      if (authError) throw authError

      addToast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      })

      // Sign out after successful deletion
      await signOut()
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      })
    } finally {
      setIsDeletingAccount(false)
      setDeleteConfirmation("")
    }
  }

  useEffect(() => {
    if (settings) {
      const isDark = settings.dark_mode ?? false
      setDarkMode(isDark)
      setProfileVisibility(settings.profile_visibility ?? 'public')
      setShowProgress(settings.show_progress ?? true)
      setShowActivity(settings.show_activity ?? true)
      setTheme(isDark ? 'dark' : 'light')
    }
  }, [settings, setTheme])

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked)
    setTheme(checked ? 'dark' : 'light')
  }

  if (authLoading || settingsLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-gray-500">Please sign in to access settings</p>
            <Link href="/auth" className="inline-block">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!settings) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Container className="py-8 md:py-12">
          <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and preferences
          </p>
        </div>
        
        <Card className="p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Customize how the app looks and feels
              </p>
            </div>
            <Separator />
            <SettingsForm />
          </div>
        </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  )
}