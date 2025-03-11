"use client"

import { useState } from 'react'
import { useToast } from '@/contexts/toast-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { customMetrics as defaultCustomMetrics } from '../template-data'
import { MetricsLibrary, SectionKey } from '../types'

export function useCustomMetrics(userId: string) {
  const [loading, setLoading] = useState(false)
  // Initialize with empty metrics instead of default metrics
  const [customMetrics, setCustomMetrics] = useState<MetricsLibrary>({
    professional: [],
    quality: [],
    climate: [],
    military: [],
    accomplishment: [],
    teamwork: [],
    leadership: []
  })
  const { addToast } = useToast()
  
  // Create an authenticated Supabase client
  const supabaseClient = createClientComponentClient()

  // Function to completely clear all custom metrics
  const clearAllCustomMetrics = async () => {
    try {
      setLoading(true)
      
      // Get the current session
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        console.error('No active session found')
        return
      }
      
      // Use the authenticated user's ID from the session
      const authenticatedUserId = session.user.id
      
      // Delete all custom metrics for this user
      const { error } = await supabaseClient
        .from('custom_metrics')
        .delete()
        .eq('user_id', authenticatedUserId)
      
      if (error) throw error
      
      // Create an empty metrics library - IMPORTANT: Don't include any default metrics
      const emptyMetrics: MetricsLibrary = {
        professional: [],
        quality: [],
        climate: [],
        military: [],
        accomplishment: [],
        teamwork: [],
        leadership: []
      }
      
      // Update the state with empty metrics - completely replacing the state, not merging
      setCustomMetrics(emptyMetrics)
      
      console.log("All custom metrics cleared successfully")
    } catch (error: any) {
      console.error('Error clearing custom metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to load custom metrics from the database
  const loadCustomMetrics = async () => {
    try {
      setLoading(true)
      
      // Get the current session
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        console.error('No active session found')
        // Don't show error toast for authentication issues during initial load
        // Just return empty metrics
        setCustomMetrics({
          professional: [],
          quality: [],
          climate: [],
          military: [],
          accomplishment: [],
          teamwork: [],
          leadership: []
        })
        return
      }
      
      // Use the authenticated user's ID from the session
      const authenticatedUserId = session.user.id
      
      // Fetch custom metrics
      const { data, error } = await supabaseClient
        .from('custom_metrics')
        .select('*')
        .eq('user_id', authenticatedUserId)
        
      if (error) throw error
      
      // Start with empty metrics
      const updatedMetrics: MetricsLibrary = {
        professional: [],
        quality: [],
        climate: [],
        military: [],
        accomplishment: [],
        teamwork: [],
        leadership: []
      }
      
      // Add the user's saved metrics
      if (data && data.length > 0) {
        data.forEach(item => {
          const sectionKey = item.section as SectionKey;
          if (!updatedMetrics[sectionKey]) {
            updatedMetrics[sectionKey] = []
          }
          
          if (!updatedMetrics[sectionKey].includes(item.metric)) {
            updatedMetrics[sectionKey].push(item.metric)
          }
        })
      }
      
      setCustomMetrics(updatedMetrics)
      // We'll avoid logging this message to prevent console spam
      // console.debug('Custom metrics loaded successfully')
    } catch (error: any) {
      console.error('Error loading custom metrics:', error)
      // Don't show error toast for loading issues during initial load
      // Just set empty metrics
      setCustomMetrics({
        professional: [],
        quality: [],
        climate: [],
        military: [],
        accomplishment: [],
        teamwork: [],
        leadership: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to save a custom metric to the database
  const saveCustomMetric = async (metric: string, section: string) => {
    try {
      setLoading(true)
      
      // Get the current session
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        console.error('No active session found')
        addToast({
          title: 'Authentication Error',
          description: 'You need to be logged in to save custom metrics',
          variant: 'destructive'
        })
        return
      }
      
      // Use the authenticated user's ID from the session
      const authenticatedUserId = session.user.id
      // Only log in development mode for debugging
      if (process.env.NODE_ENV === 'development' && process.env.DEBUG_AUTH === 'true') {
        console.debug('[TemplateBuilder] Auth - Session user ID:', authenticatedUserId)
        console.debug('[TemplateBuilder] Auth - Provided user ID:', userId)
      }
      
      // First, update the local state immediately for better UX
      setCustomMetrics(prev => {
        const updated = {...prev}
        const sectionKey = section as SectionKey;
        if (!updated[sectionKey]) {
          updated[sectionKey] = []
        }
        
        if (!updated[sectionKey].includes(metric)) {
          updated[sectionKey] = [...updated[sectionKey], metric]
        }
        
        return updated
      })
      
      // Use upsert operation to handle the case where the metric already exists
      const { error } = await supabaseClient
        .from('custom_metrics')
        .upsert({
          user_id: authenticatedUserId,
          section: section,
          metric: metric,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,section,metric',
          ignoreDuplicates: true
        })

      if (error) throw error
      
      // Avoid logging to prevent console spam
      // if (process.env.NODE_ENV === 'development') {
      //   console.debug('Custom metric saved successfully')
      // }
      
      addToast({
        title: 'Success',
        description: 'Custom metric saved to your library',
      })
    } catch (error: any) {
      console.error('Error saving custom metric:', error)
      addToast({
        title: 'Error',
        description: `Failed to save custom metric: ${error.message || String(error)}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to delete a custom metric from the database
  const deleteCustomMetric = async (metric: string, section: string) => {
    try {
      setLoading(true)
      
      // Get the current session
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (!session) {
        throw new Error('No active session found')
      }
      
      // Use the authenticated user's ID from the session
      const authenticatedUserId = session.user.id
      
      const { error } = await supabaseClient
        .from('custom_metrics')
        .delete()
        .eq('user_id', authenticatedUserId)
        .eq('section', section)
        .eq('metric', metric)

      if (error) throw error
      
      // Update the customMetrics object to remove this metric
      setCustomMetrics(prev => {
        const updated = {...prev}
        const sectionKey = section as SectionKey;
        if (updated[sectionKey]) {
          updated[sectionKey] = updated[sectionKey].filter((m: string) => m !== metric)
        }
        return updated
      })
      
      addToast({
        title: 'Success',
        description: 'Custom metric deleted from your library',
      })
    } catch (error: any) {
      console.error('Error deleting custom metric:', error)
      addToast({
        title: 'Error',
        description: `Failed to delete custom metric: ${error.message || String(error)}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    customMetrics,
    loading,
    loadCustomMetrics,
    saveCustomMetric,
    deleteCustomMetric,
    clearAllCustomMetrics
  }
}