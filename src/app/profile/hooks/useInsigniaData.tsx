"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Profile } from "@/contexts/auth/types"

interface NavyRankImage {
  id: string
  rank_code: string
  image_url: string | null
}

interface InsigniaImage {
  id: string
  rate: string
  image_url: string | null
}

export function useInsigniaData(profile: Profile | null) {
  const [rankImage, setRankImage] = useState<NavyRankImage | null>(null)
  const [insigniaImage, setInsigniaImage] = useState<InsigniaImage | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const fetchChevron = async () => {
      if (!profile?.rank) return
      
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('navy_ranks')
          .select('id, rank_code, image_url')
          .eq('rank_code', profile.rank)
          .eq('active', true)
          .single()

        if (error) throw error
        setRankImage(data)
      } catch (error) {
        console.error('Error fetching chevron:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchInsignia = async () => {
      if (!profile?.rate) return
      
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('insignias')
          .select('id, rate, image_url')
          .eq('rate', profile.rate)
          .eq('active', true)
          .single()

        if (error) throw error
        setInsigniaImage(data)
      } catch (error) {
        console.error('Error fetching insignia:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (profile) {
      fetchChevron()
      fetchInsignia()
    }
  }, [profile?.rank, profile?.rate])
  
  return { rankImage, insigniaImage, isLoading }
}