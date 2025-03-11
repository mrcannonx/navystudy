"use client"

import { useState, useEffect } from "react"
import { differenceInDays } from "date-fns"
import { UserSubscription } from "@/types/database"
import { SUBSCRIPTION_STATUS } from "@/lib/stripe-client"
import Link from "next/link"

interface TrialStatusBadgeProps {
  subscription: UserSubscription | null
}

export default function TrialStatusBadge({ subscription }: TrialStatusBadgeProps) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null)
  
  useEffect(() => {
    if (
      subscription?.status === SUBSCRIPTION_STATUS.TRIALING && 
      subscription.trial_end_date
    ) {
      const trialEndDate = new Date(subscription.trial_end_date)
      const today = new Date()
      const days = differenceInDays(trialEndDate, today)
      setDaysLeft(Math.max(0, days))
    } else {
      setDaysLeft(null)
    }
  }, [subscription])
  
  if (daysLeft === null) {
    return null
  }
  
  return (
    <Link 
      href="/settings/subscription" 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${daysLeft <= 1 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}
        hover:bg-opacity-80 transition-colors
      `}
    >
      {daysLeft === 0 ? (
        <span>Trial ends today</span>
      ) : daysLeft === 1 ? (
        <span>1 day left in trial</span>
      ) : (
        <span>{daysLeft} days left in trial</span>
      )}
    </Link>
  )
}
