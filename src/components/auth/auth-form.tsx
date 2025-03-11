"use client"

import { useState } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { InteractiveInput } from "@/components/ui/interactive-input"
import { useToast } from "@/contexts/toast-context"
import { InteractiveSpinner } from "@/components/ui/interactive-spinner"
import { useAuth } from "@/contexts/auth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthFormProps {
  mode?: "signin" | "signup"
  onSuccess?: () => void
  onToggleMode?: () => void
  returnTo?: string
}

export function AuthForm({ mode = "signin", onSuccess, onToggleMode, returnTo = "/dashboard" }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('[AuthForm] Starting auth process:', { mode })
      
      if (mode === "signin") {
        console.log('[AuthForm] Attempting sign in...')
        await signIn(email, password)
        
        // Check if we actually got a session with retries
        let session = null
        let attempt = 0
        for (let i = 0; i < 3; i++) {
          attempt = i + 1
          const { data } = await supabase.auth.getSession()
          if (data.session) {
            session = data.session
            break
          }
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        console.log('[AuthForm] Sign in result:', { 
          success: !!session,
          userId: session?.user?.id,
          attempt
        })
        
        if (!session) {
          throw new Error('Failed to establish session after sign in')
        }
        
        addToast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
          variant: "default",
        })

        onSuccess?.()
        // Use window.location.href for full page navigation
        window.location.href = returnTo
      } else {
        const result = await signUp(email, password)
        console.log('[AuthForm] Sign up result:', result)
        
        if (result.type === 'EXISTING_USER') {
          addToast({
            title: "Account exists",
            description: "This email is already registered. Please sign in.",
            variant: "default",
          })
          setEmail("")
          setPassword("")
          onToggleMode?.()
          return
        }
        
        if (result.type === 'ERROR') {
          throw new Error(result.message)
        }
        
        addToast({
          title: "Account created",
          description: "Please check your email to verify your account.",
          variant: "default",
        })
        onSuccess?.()
      }
    } catch (err) {
      console.error('[AuthForm] Error:', err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      
      if (mode === "signin") {
        if (errorMessage.includes("not verified")) {
          addToast({
            title: "Email not verified",
            description: "Please check your inbox for the verification link.",
            variant: "default",
          })
        } else if (errorMessage.includes("Invalid password")) {
          addToast({
            title: "Invalid password",
            description: "Please check your password and try again.",
            variant: "destructive",
          })
        } else {
          addToast({
            title: "Sign in failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } else {
        addToast({
          title: "Sign up failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        {mode !== "signin" && (
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>
        )}
        <p className="text-sm text-muted-foreground">
          {mode === "signin"
            ? "Enter your credentials to access your account"
            : "Create a new account to get started"}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </label>
          <InteractiveInput
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="border-blue-200 focus-visible:ring-blue-500 auth-input"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Password
          </label>
          <InteractiveInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="border-blue-200 focus-visible:ring-blue-500 auth-input"
          />
        </div>
        <ClientButton
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2.5 auth-button"
          disabled={loading}
        >
          {loading ? (
            <InteractiveSpinner size="sm" className="mr-2" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          )}
          {loading
            ? "Loading..."
            : mode === "signin"
            ? "Sign In"
            : "Sign Up"}
        </ClientButton>
      </form>
      <div className="pt-2">
        {mode === "signin" ? (
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-slate-950 px-2 text-muted-foreground">New to NAVY Study?</span>
              </div>
            </div>
            <div className="grid gap-1.5">
              <a
                href="/signup"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-blue-200 bg-white hover:bg-blue-50 h-10 px-4 py-2 text-blue-700 auth-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create a free account
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-50 text-blue-700 hover:bg-blue-100 h-10 px-4 py-2 auth-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sign up with subscription (includes 3-day free trial)
              </a>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <ClientButton
              type="button"
              variant="link"
              onClick={onToggleMode}
              className="h-auto p-0 text-blue-600 hover:text-blue-800 font-medium"
              disabled={loading}
            >
              Sign in
            </ClientButton>
          </p>
        )}
      </div>
    </div>
  )
}
