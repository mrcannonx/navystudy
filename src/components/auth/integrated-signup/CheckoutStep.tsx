"use client"

import { useState } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { InteractiveSpinner } from "@/components/ui/interactive-spinner"
import { useToast } from "@/contexts/toast-context"
import { CreditCardIcon, LockIcon } from "lucide-react"

interface CheckoutStepProps {
  data: {
    email: string
    password: string
    planId: string
    priceId: string
  }
  onNextAction: () => void
  onBackAction: () => void
}

export default function CheckoutStep({ data, onNextAction, onBackAction }: CheckoutStepProps) {
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!data.email || !data.password || !data.priceId) {
      addToast({
        title: "Missing information",
        description: "Please complete all previous steps before proceeding.",
        variant: "destructive",
      })
      return
    }
    
    setLoading(true)
    
    try {
      console.log('Submitting signup data to API');
      
      // Call the integrated signup API
      const response = await fetch('/api/auth/integrated-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          priceId: data.priceId
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        console.error('API response not OK:', { status: response.status, error: result.error });
        throw new Error(result.error || 'Failed to process signup')
      }
      
      console.log('Signup successful, checkout URL received');
      
      // Store credentials in localStorage for the success page to use
      localStorage.setItem("signup_email", data.email)
      localStorage.setItem("signup_password", data.password)
      
      // Redirect to Stripe checkout
      if (result.checkoutUrl) {
        console.log('Redirecting to Stripe checkout');
        window.location.href = result.checkoutUrl
      } else {
        console.log('No checkout URL provided, proceeding to next step');
        // If no checkout URL, proceed to success step
        onNextAction()
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      
      // Handle specific error cases
      if (error instanceof Error) {
        const errorMessage = error.message;
        
        if (errorMessage === 'User already registered') {
          addToast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead or use a different email address.",
            variant: "destructive",
          })
          // Take the user back to step 1 to try a different email
          onBackAction()
        } else if (errorMessage.includes('price ID')) {
          // Handle invalid price ID errors
          addToast({
            title: "Configuration error",
            description: "There was an issue with the subscription plan. Please contact support.",
            variant: "destructive",
          })
        } else if (errorMessage.includes('API key')) {
          // Handle Stripe API key errors
          addToast({
            title: "Payment system error",
            description: "Our payment system is currently unavailable. Please try again later or contact support.",
            variant: "destructive",
          })
        } else {
          // Generic error handling with the specific message
          addToast({
            title: "Signup failed",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } else {
        // Fallback for non-Error objects
        addToast({
          title: "Signup failed",
          description: "An unexpected error occurred during signup. Please try again later.",
          variant: "destructive",
        })
      }
      
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Complete your subscription</h1>
        <p className="text-sm text-muted-foreground">
          You're almost there! Review your selection and proceed to payment.
        </p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">3-Day Free Trial</h3>
          <div className="text-sm text-gray-500">No charge today</div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Email</div>
            <div>{data.email}</div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Subscription</div>
            <div>Premium Plan</div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <LockIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Your free trial starts today</p>
            <p>You won't be charged until your trial ends in 3 days. You can cancel anytime before then.</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center mb-4">
            <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="font-medium">Payment Information</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            You'll be redirected to our secure payment processor to complete your subscription.
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">Payment processor</div>
            <div className="font-medium">Stripe</div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <ClientButton
            type="button"
            variant="outline"
            onClick={onBackAction}
            disabled={loading}
            className="flex-1"
          >
            Back
          </ClientButton>
          
          <ClientButton
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <InteractiveSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </ClientButton>
        </div>
      </form>
      
      <div className="text-center text-xs text-gray-500">
        <p>
          By proceeding, you agree to our Terms of Service and acknowledge that your subscription will automatically renew after the trial period. You can cancel anytime.
        </p>
      </div>
    </div>
  )
}
