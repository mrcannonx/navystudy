"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AvatarUpload } from "@/components/profile/components/AvatarUpload"

export default function TestUploadPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <Container className="py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        </div>
      </Container>
    )
  }

  if (!user || !profile) return null

  return (
    <Container className="py-8 md:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Test Profile Image Upload</h1>
            <p className="text-muted-foreground">
              This page is for testing the profile image upload functionality
            </p>
          </div>
          <Link href="/profile">
            <Button variant="outline" className="gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Back to Profile
            </Button>
          </Link>
        </div>
        
        <Card className="p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Profile Image</h2>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image load error:', e);
                        e.currentTarget.src = 'https://via.placeholder.com/80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                      {profile.full_name?.split(" ").map(n => n[0]).join("") || user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{profile.full_name || 'No name set'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {profile.avatar_url && (
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      URL: {profile.avatar_url}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
              <AvatarUpload />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
              <div className="bg-muted p-3 rounded-md text-xs font-mono overflow-auto max-h-40">
                <pre>User ID: {user.id}</pre>
                <pre>Email: {user.email}</pre>
                <pre>Avatar URL: {profile.avatar_url || 'null'}</pre>
                <pre>Last Updated: {profile.updated_at}</pre>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  )
}