"use client"

import { Toaster } from "sonner"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { ThemeProvider } from "@/contexts/theme-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SettingsProvider>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </SettingsProvider>
    </ToastProvider>
  )
}
