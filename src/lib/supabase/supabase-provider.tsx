import { createContext, useContext, useState, useEffect } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface SupabaseContextType {
    supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ))

    return (
        <SupabaseContext.Provider value={{ supabase }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export function useSupabase() {
    const context = useContext(SupabaseContext)
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider')
    }
    return context
} 