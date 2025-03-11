"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disabled, readOnly, ...props }, ref) => {
    // Create a local ref if one isn't provided
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = ref || textareaRef;
    
    // Use effect to ensure the textarea is always focusable
    React.useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
    }, []);
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-500/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={combinedRef as React.RefObject<HTMLTextAreaElement>}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
