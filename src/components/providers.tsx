"use client"

import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { StatisticsProvider } from "@/contexts/statistics-context"
import { ThemeProvider } from "@/contexts/theme-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SettingsProvider>
        <ThemeProvider>
          <StatisticsProvider>
            {children}
          </StatisticsProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ToastProvider>
  )
}
