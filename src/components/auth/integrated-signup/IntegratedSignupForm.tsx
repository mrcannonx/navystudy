"use client"

import { useState } from "react"
import AccountDetailsStep from "./AccountDetailsStep"
import SubscriptionSelectionStep from "./SubscriptionSelectionStep"
import CheckoutStep from "./CheckoutStep"
import SuccessStep from "./SuccessStep"
import SignupProgress from "../signup-progress"

type SignupData = {
  email: string
  password: string
  planId: string
  priceId: string
  billingInterval: 'month' | 'year'
}

export default function IntegratedSignupForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<SignupData>({
    email: '',
    password: '',
    planId: '',
    priceId: '',
    billingInterval: 'month'
  })
  
  const updateDataAction = (newData: Partial<SignupData>) => {
    setData({ ...data, ...newData })
  }
  
  const nextStepAction = () => setStep(step + 1)
  const prevStepAction = () => setStep(step - 1)
  
  return (
    <div className="w-full max-w-md mx-auto">
      <SignupProgress currentStep={step} totalSteps={4} />
      
      {step === 1 && (
        <AccountDetailsStep 
          data={data} 
          updateDataAction={updateDataAction} 
          onNextAction={nextStepAction} 
        />
      )}
      
      {step === 2 && (
        <SubscriptionSelectionStep 
          data={data} 
          updateDataAction={updateDataAction} 
          onNextAction={nextStepAction} 
          onBackAction={prevStepAction} 
        />
      )}
      
      {step === 3 && (
        <CheckoutStep 
          data={data} 
          onNextAction={nextStepAction} 
          onBackAction={prevStepAction} 
        />
      )}
      
      {step === 4 && (
        <SuccessStep />
      )}
    </div>
  )
}
