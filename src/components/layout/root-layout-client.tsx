"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth"
import { Providers } from "@/components/providers"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabase'
import { InputFixScript } from "@/components/input-fix-script"

interface RootLayoutClientProps {
  children: ReactNode
}

function LayoutContent({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
    </div>
  )
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Prevents refetching when tab focus returns
        staleTime: 5 * 60 * 1000,    // Consider data fresh for 5 minutes
      },
    },
  }))

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <AuthProvider>
            <TooltipProvider>
              <Providers>
                <LayoutContent>
                  <InputFixScript />
                  {children}
                </LayoutContent>
              </Providers>
            </TooltipProvider>
          </AuthProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
