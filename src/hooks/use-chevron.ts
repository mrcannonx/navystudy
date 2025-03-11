"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/contexts/toast-context"
import { supabase } from "@/lib/supabase"

interface NavyRank {
    id: string
    image_url: string | null
}

export function useChevron() {
    const { profile } = useAuth()
    const { addToast } = useToast()
    const [chevron, setChevron] = useState<NavyRank | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchChevron = async () => {
            if (!profile?.rank) {
                setLoading(false)
                return
            }
            
            setLoading(true)
            setError(null)
            
            try {
                const { data, error } = await supabase
                    .from('navy_ranks')
                    .select('id, image_url')
                    .eq('rank', profile.rank)
                    .eq('active', true)
                    .single()

                if (error) throw error
                setChevron(data)
            } catch (error) {
                console.error('Error fetching chevron:', error)
                setError(error as Error)
                addToast({
                    title: "Error Loading Rank Insignia",
                    description: "Failed to load rank insignia. Your progress is still being tracked.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchChevron()
    }, [profile?.rank, addToast])

    return { chevron, loading, error }
}
