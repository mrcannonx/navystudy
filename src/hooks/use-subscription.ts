"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { UserSubscription } from '@/types/database'
import { useAuth } from '@/contexts/auth'

// Cache time in milliseconds (5 minutes)
const CACHE_TIME = 5 * 60 * 1000
// Debounce time in milliseconds (500ms)
const DEBOUNCE_TIME = 500

// Keep a global cache of the subscription data
interface SubscriptionCache {
  data: UserSubscription | null
  timestamp: number
  fetchPromise: Promise<UserSubscription | null> | null
}

let subscriptionCache: SubscriptionCache = {
  data: null,
  timestamp: 0,
  fetchPromise: null
}

// Debounce function to prevent multiple API calls in quick succession
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, wait)
  }
}

/**
 * Custom hook to fetch and cache user subscription data
 * @returns Subscription data and loading state
 */
export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(subscriptionCache.data)
  const [loading, setLoading] = useState<boolean>(!subscriptionCache.data)
  const [error, setError] = useState<Error | null>(null)
  const isMounted = useRef(true)
  
  // Function to fetch subscription data
  const fetchSubscriptionData = useCallback(async (): Promise<UserSubscription | null> => {
    try {
      console.log('[useSubscription] Fetching subscription data', {
        userId: user?.id,
        cacheAge: Date.now() - subscriptionCache.timestamp,
        hasCachedData: !!subscriptionCache.data,
        hasFetchPromise: !!subscriptionCache.fetchPromise
      })
      const response = await fetch('/api/stripe/user-subscription')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subscription: ${response.status}`)
      }
      
      const data = await response.json()
      return data.subscription
    } catch (err) {
      console.error('[useSubscription] Error fetching subscription:', err)
      throw err
    }
  }, [user?.id])

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async (force = false) => {
      console.log('[useSubscription] debouncedFetch called', {
        userId: user?.id,
        force,
        cacheAge: Date.now() - subscriptionCache.timestamp,
        hasCachedData: !!subscriptionCache.data,
        hasFetchPromise: !!subscriptionCache.fetchPromise
      })
      
      // If no user, clear subscription data
      if (!user) {
        console.log('[useSubscription] No user, clearing subscription data')
        if (isMounted.current) {
          setSubscription(null)
          setLoading(false)
        }
        return
      }

      // Check if we have cached data that's still valid
      const now = Date.now()
      if (
        !force &&
        subscriptionCache.data &&
        now - subscriptionCache.timestamp < CACHE_TIME
      ) {
        console.log('[useSubscription] Using cached data', {
          cacheAge: now - subscriptionCache.timestamp,
          cacheTimeLimit: CACHE_TIME
        })
        if (isMounted.current) {
          setSubscription(subscriptionCache.data)
          setLoading(false)
        }
        return
      }

      // Check if there's already a fetch in progress
      if (subscriptionCache.fetchPromise) {
        try {
          const data = await subscriptionCache.fetchPromise
          if (isMounted.current) {
            setSubscription(data)
            setLoading(false)
          }
        } catch (err) {
          if (isMounted.current) {
            setError(err instanceof Error ? err : new Error('Unknown error'))
            setLoading(false)
          }
        }
        return
      }

      // Otherwise fetch fresh data
      if (isMounted.current) {
        setLoading(true)
        setError(null)
      }

      try {
        // Create a new fetch promise and store it in the cache
        subscriptionCache.fetchPromise = fetchSubscriptionData()
        
        // Wait for the fetch to complete
        const data = await subscriptionCache.fetchPromise
        
        // Update the cache
        subscriptionCache = {
          data,
          timestamp: now,
          fetchPromise: null
        }
        
        if (isMounted.current) {
          setSubscription(data)
          setLoading(false)
        }
      } catch (err) {
        // Clear the fetch promise
        subscriptionCache.fetchPromise = null
        
        if (isMounted.current) {
          console.error('[useSubscription] Error fetching subscription:', err)
          setError(err instanceof Error ? err : new Error('Unknown error'))
          setLoading(false)
        }
      }
    }, DEBOUNCE_TIME),
    [user, fetchSubscriptionData]
  )

  // Fetch subscription data when user changes
  useEffect(() => {
    console.log('[useSubscription] User dependency changed, triggering fetch', {
      userId: user?.id,
      hasCachedData: !!subscriptionCache.data,
      cacheAge: Date.now() - subscriptionCache.timestamp
    })
    debouncedFetch()
    
    // Cleanup function
    return () => {
      console.log('[useSubscription] Cleanup effect for user', { userId: user?.id })
      isMounted.current = false
    }
  }, [debouncedFetch, user?.id])

  // Reset isMounted ref when component mounts
  useEffect(() => {
    isMounted.current = true
    
    return () => {
      isMounted.current = false
    }
  }, [])

  return {
    subscription,
    loading,
    error,
    refetch: () => debouncedFetch(true)
  }
}