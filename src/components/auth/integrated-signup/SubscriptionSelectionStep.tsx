"use client"

import { useState, useEffect } from "react"
import { ClientButton } from "@/components/ui/client-button"
import { InteractiveSpinner } from "@/components/ui/interactive-spinner"
import { useToast } from "@/contexts/toast-context"
import { CheckIcon } from "lucide-react"
import { SubscriptionPlan } from "@/types/database"

interface SubscriptionSelectionStepProps {
  data: {
    planId: string
    priceId: string
    billingInterval: 'month' | 'year'
  }
  updateDataAction: (data: Partial<{
    planId: string
    priceId: string
    billingInterval: 'month' | 'year'
  }>) => void
  onNextAction: () => void
  onBackAction: () => void
}

export default function SubscriptionSelectionStep({
  data,
  updateDataAction,
  onNextAction,
  onBackAction
}: SubscriptionSelectionStepProps) {
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const { addToast } = useToast()
  
  // Fallback plan to use if no plans are returned from the API
  const fallbackPlan: SubscriptionPlan = {
    id: 'premium-plan',
    created_at: new Date().toISOString(),
    name: 'Premium Plan',
    description: 'Full access to all premium features',
    price_monthly: 2000, // $20.00
    price_yearly: 20400, // $204.00 (15% off annual)
    features: [
      'Access to Flashcards Generator',
      'Quiz Generator',
      'AI Summarizer',
      'Eval Builder',
      'Unlimited AI Generation'
    ],
    trial_days: 3,
    stripe_monthly_price_id: 'price_mock_monthly',
    stripe_yearly_price_id: 'price_mock_yearly',
    active: true
  }
  
  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/stripe/subscription-plans')
        const data = await response.json()
        
        console.log('API response:', data)
        
        if (data.plans && Array.isArray(data.plans) && data.plans.length > 0) {
          console.log('Plans from API:', data.plans)
          setPlans(data.plans)
          
          // Select the first plan by default if none is selected
          if (!data.planId) {
            const defaultPlan = data.plans[0]
            updateDataAction({
              planId: defaultPlan.id,
              priceId: data.billingInterval === 'year' 
                ? defaultPlan.stripe_yearly_price_id || ''
                : defaultPlan.stripe_monthly_price_id || ''
            })
          }
        } else {
          // Use fallback plan if no plans are returned
          console.log('Using fallback plan')
          setPlans([fallbackPlan])
          
          // Select the fallback plan
          updateDataAction({
            planId: fallbackPlan.id,
            priceId: data.billingInterval === 'year' 
              ? fallbackPlan.stripe_yearly_price_id || ''
              : fallbackPlan.stripe_monthly_price_id || ''
          })
        }
      } catch (error) {
        console.error('Error fetching plans:', error)
        
        // Use fallback plan if there's an error
        console.log('Using fallback plan due to error')
        setPlans([fallbackPlan])
        
        // Select the fallback plan
        updateDataAction({
          planId: fallbackPlan.id,
          priceId: data.billingInterval === 'year' 
            ? fallbackPlan.stripe_yearly_price_id || ''
            : fallbackPlan.stripe_monthly_price_id || ''
        })
        
        addToast({
          title: "Using default plan",
          description: "We're having trouble loading subscription plans, but you can continue with our Premium plan.",
          variant: "default",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlans()
  }, [])
  
  const toggleBillingInterval = () => {
    const newInterval = data.billingInterval === 'month' ? 'year' : 'month'
    
    // Update the price ID based on the selected plan and new billing interval
    const selectedPlan = plans.find(plan => plan.id === data.planId)
    if (selectedPlan) {
      const newPriceId = newInterval === 'month' 
        ? selectedPlan.stripe_monthly_price_id || ''
        : selectedPlan.stripe_yearly_price_id || ''
      
      updateDataAction({
        billingInterval: newInterval,
        priceId: newPriceId
      })
    } else {
      updateDataAction({ billingInterval: newInterval })
    }
  }
  
  const selectPlan = (plan: SubscriptionPlan) => {
    const priceId = data.billingInterval === 'month' 
      ? plan.stripe_monthly_price_id || ''
      : plan.stripe_yearly_price_id || ''
    
    updateDataAction({
      planId: plan.id,
      priceId
    })
  }
  
  const handleContinue = () => {
    if (!data.planId || !data.priceId) {
      addToast({
        title: "Please select a plan",
        description: "You need to select a subscription plan to continue.",
        variant: "destructive",
      })
      return
    }
    
    onNextAction()
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <InteractiveSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Loading subscription plans...</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">
          Select a subscription plan to access all features.
          All plans include a 3-day free trial.
        </p>
      </div>
      
      {/* Billing interval toggle */}
      <div className="flex justify-center mb-6">
        <div className="relative flex items-center p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => updateDataAction({ billingInterval: 'month' })}
            className={`relative px-4 py-2 text-sm font-medium rounded-md ${
              data.billingInterval === 'month'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => updateDataAction({ billingInterval: 'year' })}
            className={`relative px-4 py-2 text-sm font-medium rounded-md ${
              data.billingInterval === 'year'
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Yearly <span className="text-green-600 font-medium">(Save 15%)</span>
          </button>
        </div>
      </div>
      
      {/* Subscription plans */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No subscription plans available. Please try again later.</p>
          </div>
        ) : (
          plans.map((plan) => {
          // Calculate the price based on the billing interval
          const price = data.billingInterval === 'month'
            ? (plan.price_monthly / 100).toFixed(2)
            : (plan.price_yearly / 100).toFixed(2);
          
          // Parse features from JSON string if needed
          const features = typeof plan.features === 'string'
            ? JSON.parse(plan.features)
            : plan.features;
          
          const isSelected = data.planId === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`
                p-6 border rounded-lg cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'}
              `}
              onClick={() => selectPlan(plan)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  
                  <div className="mt-3 flex items-baseline">
                    <span className="text-3xl font-bold">${price}</span>
                    <span className="ml-1 text-gray-600">/{data.billingInterval}</span>
                  </div>
                  
                  <p className="mt-2 text-blue-600 text-sm">
                    Includes {plan.trial_days}-day free trial
                  </p>
                </div>
                
                {isSelected && (
                  <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <ul className="mt-4 space-y-2">
                {Array.isArray(features) && features.map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
        )}
      </div>
      
      <div className="flex space-x-4 pt-4">
        <ClientButton
          type="button"
          variant="outline"
          onClick={onBackAction}
          className="flex-1"
        >
          Back
        </ClientButton>
        
        <ClientButton
          type="button"
          onClick={handleContinue}
          className="flex-1"
        >
          Continue
        </ClientButton>
      </div>
    </div>
  )
}
