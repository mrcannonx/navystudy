"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we already have a session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log("Session already exists, redirecting to dashboard")
          router.push("/dashboard")
          return
        }

        // If we don't have a session, try to restore it
        console.log("No session found, attempting to restore session")
        
        // Get stored credentials from localStorage if available
        const storedEmail = localStorage.getItem("signup_email")
        const storedPassword = localStorage.getItem("signup_password")
        
        if (storedEmail && storedPassword) {
          console.log("Found stored credentials, attempting to sign in")
          
          // Sign in with stored credentials
          const { error } = await supabase.auth.signInWithPassword({
            email: storedEmail,
            password: storedPassword,
          })
          
          if (error) {
            console.error("Error signing in:", error)
            setStatus("error")
            setErrorMessage("Failed to restore your session. Please sign in manually.")
            return
          }
          
          // Wait a moment to ensure the auth state is updated
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Verify that the profile exists
          try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              // Check if profile exists
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()
                
              if (profileError || !profile) {
                console.log("Profile not found, creating one")
                // Create a minimal profile
                const { error: createError } = await supabase
                  .from('profiles')
                  .insert({
                    id: user.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    username: null,
                    full_name: null,
                    avatar_url: null,
                    bio: null,
                    preferences: {},
                    rank_id: null,        // This is correct
                    rate: null,
                    duty_station: null,
                    years_of_service: null,
                    specializations: null,
                    awards: null,
                    insignia_id: null,
                    is_admin: false,
                    email: storedEmail
                  })
                  
                if (createError) {
                  console.error("Error creating profile:", createError)
                  // Continue anyway, the auth provider will handle this
                }
              }
            }
          } catch (profileCheckError) {
            console.error("Error checking profile:", profileCheckError)
            // Continue anyway, the auth provider will handle this
          }
          
          // Clear stored credentials for security
          localStorage.removeItem("signup_email")
          localStorage.removeItem("signup_password")
          
          console.log("Successfully signed in, redirecting to dashboard")
          setStatus("success")
          
          // Short delay before redirecting to ensure session is fully established
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          console.log("No stored credentials found")
          setStatus("error")
          setErrorMessage("Your session has expired. Please sign in to access your account.")
        }
      } catch (error) {
        console.error("Error in checkout success page:", error)
        setStatus("error")
        setErrorMessage("An unexpected error occurred. Please try signing in.")
      }
    }

    checkSession()
  }, [router])

  if (status === "loading") {
    return (
      <Container className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Processing Your Subscription</h1>
          <p className="text-gray-500">Please wait while we set up your account...</p>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </Container>
    )
  }

  if (status === "error") {
    return (
      <Container className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-gray-500">{errorMessage}</p>
          <div className="pt-4">
            <Link href="/auth">
              <Button size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Subscription Successful!</h1>
        <p className="text-gray-500">
          Thank you for subscribing. Your account has been set up successfully.
        </p>
        <p className="text-gray-500">
          You will be redirected to your dashboard in a moment...
        </p>
      </div>
    </Container>
  )
}
