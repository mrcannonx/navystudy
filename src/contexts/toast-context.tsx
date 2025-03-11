"use client"

import { createContext, useContext } from "react"
import { useToast as useToastHook, ToastProps } from "@/components/ui/use-toast"

interface ToastContextType {
  addToast: (props: ToastProps) => void
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toast: hookToast } = useToastHook()

  const addToast = ({ title, description, variant = "default" }: ToastProps) => {
    hookToast({
      title,
      description,
      variant,
    })
  }

  return (
    <ToastContext.Provider value={{ 
      addToast,
      toast: addToast // Expose toast as an alias for addToast for compatibility
    }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
