"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth"
import IntegratedSignupForm from "@/components/auth/integrated-signup/IntegratedSignupForm"
import Link from "next/link"

// Array of inspirational quotes
const quotes = [
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert"
  },
  {
    text: "Anyone who stops learning is old, whether at twenty or eighty. Anyone who keeps learning stays young.",
    author: "Henry Ford"
  },
  {
    text: "Develop a passion for learning. If you do, you will never cease to grow.",
    author: "Anthony J. D'Angelo"
  },
  {
    text: "The mind is not a vessel to be filled, but a fire to be kindled.",
    author: "Plutarch"
  },
  {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  }
]

export default function SignupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams?.get("returnTo") || "/dashboard"
  const [randomQuote, setRandomQuote] = useState(quotes[0])
  
  // Select a random quote on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setRandomQuote(quotes[randomIndex])
  }, [])

  useEffect(() => {
    if (user) {
      // Navigate to the return path, ensuring it starts with a slash
      const path = returnTo.startsWith("/") ? returnTo : `/${returnTo}`
      window.location.href = path
    }
  }, [user, returnTo])

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
        <div className="relative z-20 flex items-center text-lg font-medium mb-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          NAVY Study
        </div>
        
        <div className="relative z-20 mb-8">
          <h2 className="text-2xl font-bold mb-6">Get Started with NAVY Study</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Create your account</h3>
                <p className="text-white/80 text-sm">Sign up with your email and password</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Choose your plan</h3>
                <p className="text-white/80 text-sm">Select a subscription plan that works for you</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/20 rounded-full h-8 w-8 flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Start your free trial</h3>
                <p className="text-white/80 text-sm">Enjoy 3 days of full access to all features</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-20 mt-8">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "{randomQuote.text}"
            </p>
            <footer className="text-sm">{randomQuote.author}</footer>
          </blockquote>
        </div>
      </div>
      
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex justify-end">
            <Link 
              href={{ pathname: "/auth" }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Already have an account? Sign in
            </Link>
          </div>
          
          <IntegratedSignupForm />
        </div>
      </div>
    </div>
  )
}
