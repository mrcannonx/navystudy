"use client"

import { useAuth } from "@/contexts/auth"
import TrialStatusBadge from "@/components/subscription/TrialStatusBadge"
import { useSubscription } from "@/hooks/use-subscription"

export function HeaderTrialStatus() {
  const { user } = useAuth()
  const { subscription, loading } = useSubscription()
  
  if (loading || !user) {
    return null
  }
  
  return <TrialStatusBadge subscription={subscription} />
}
