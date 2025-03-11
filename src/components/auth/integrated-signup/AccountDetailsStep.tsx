"use client"

import { useState } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { InteractiveInput } from "@/components/ui/interactive-input"
import { useToast } from "@/contexts/toast-context"
import { InteractiveSpinner } from "@/components/ui/interactive-spinner"

interface AccountDetailsStepProps {
  data: {
    email: string
    password: string
  }
  updateDataAction: (data: { email: string; password: string }) => void
  onNextAction: () => void
}

export default function AccountDetailsStep({ 
  data, 
  updateDataAction, 
  onNextAction 
}: AccountDetailsStepProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { addToast } = useToast()

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    // Email validation
    if (!data.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    // Password validation
    if (!data.password) {
      newErrors.password = "Password is required"
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else {
      // Check for Supabase password requirements
      const hasLowercase = /[a-z]/.test(data.password);
      const hasUppercase = /[A-Z]/.test(data.password);
      const hasNumber = /[0-9]/.test(data.password);
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};\\':"\\|<>?,./`~]/.test(data.password);
      
      if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
        newErrors.password = "Password should contain at least one character of each: lowercase letter, uppercase letter, number, and special character"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      console.log(`Checking if user exists with email: ${data.email}`);
      
      // Check if user already exists
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      })
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error response from check-user API:', responseData);
        throw new Error(responseData.error || 'Failed to check user');
      }
      
      const { exists } = responseData;
      console.log(`User exists check result: ${exists}`);
      
      if (exists) {
        console.log('User already exists, showing error message');
        addToast({
          title: "Account exists",
          description: "This email is already registered in our system. Please sign in instead or use a different email address.",
          variant: "destructive",
        })
        setErrors({ email: "This email is already registered. Please sign in or use a different email." })
        return
      }
      
      console.log('User does not exist, proceeding to next step');
      // Proceed to next step
      onNextAction()
    } catch (error) {
      console.error('Error checking user:', error)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and create a password to get started
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <InteractiveInput
            id="email"
            type="email"
            placeholder="m@example.com"
            value={data.email}
            onChange={(e) => updateDataAction({ ...data, email: e.target.value })}
            disabled={loading}
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <InteractiveInput
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => updateDataAction({ ...data, password: e.target.value })}
            disabled={loading}
            required
            className={errors.password ? "border-red-500" : ""}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters and include at least one lowercase letter, 
            one uppercase letter, one number, and one special character.
          </p>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        
        <ClientButton
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <InteractiveSpinner size="sm" className="mr-2" />
          ) : null}
          {loading ? "Checking..." : "Continue"}
        </ClientButton>
      </form>
      
      <div className="text-center text-sm">
        <p>
          Already have an account?{" "}
          <a href="/auth" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
      
      <p className="px-8 text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  )
}
