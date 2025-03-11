import { useCallback } from "react"
import { toast as sonnerToast } from "sonner"

export interface ToastProps {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = useCallback(({ title, description, variant = "default" }: ToastProps) => {
    const options = {
      description,
    }

    if (variant === "destructive") {
      sonnerToast.error(title, options)
    } else {
      sonnerToast.success(title, options)
    }
  }, [])

  return { toast }
} 