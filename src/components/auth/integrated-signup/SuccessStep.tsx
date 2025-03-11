"use client"

import { useEffect } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { CheckCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SuccessStep() {
  const router = useRouter()
  
  // Automatically redirect to dashboard after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [router])
  
  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to NAVY Study!</h1>
        <p className="text-muted-foreground">
          Your account has been created and your free trial has started.
        </p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-left">
        <h3 className="font-medium text-blue-800 mb-2">What's next?</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Explore all the tools available to you during your 3-day free trial</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Create flashcards, take quizzes, and use the summarizer tool</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Check your subscription status anytime in your account settings</span>
          </li>
        </ul>
      </div>
      
      <ClientButton
        onClick={handleGoToDashboard}
        className="w-full"
      >
        Go to Dashboard
      </ClientButton>
      
      <p className="text-sm text-gray-500">
        You will be automatically redirected to your dashboard in a few seconds.
      </p>
    </div>
  )
}
