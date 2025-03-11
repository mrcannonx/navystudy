"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { AuthForm } from "@/components/auth/auth-form"
import { useAuth } from "@/contexts/auth"
import "./auth.css"

export default function AuthPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams?.get("returnTo") || "/"

  useEffect(() => {
    if (user) {
      // Navigate to the return path, ensuring it starts with a slash
      const path = returnTo.startsWith("/") ? returnTo : `/${returnTo}`
      window.location.href = path
    }
  }, [user, returnTo])

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 auth-container">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('/map-pattern.svg')] bg-repeat"></div>
        </div>
        <div className="relative z-20 flex items-center text-xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-7 w-7"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          NAVY Study
        </div>
        <div className="relative z-20 mt-auto mb-24">
          <blockquote className="space-y-3 border-l-4 border-white/30 pl-4">
            <p className="text-xl font-light leading-relaxed italic">
              "The more that you read, the more things you will know. The more that you learn, the more places you'll go."
            </p>
            <footer className="text-sm font-medium opacity-80">— Dr. Seuss</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-6">
        <div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-blue-600">
              Welcome to NAVY Study
            </h1>
            <p className="text-sm text-muted-foreground">
              Your journey to excellence starts here
            </p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-800 dark:bg-slate-950 auth-card">
            <AuthForm returnTo={returnTo} />
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
