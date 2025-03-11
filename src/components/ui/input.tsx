"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, readOnly, onChange, value, ...props }, ref) => {
    // Create a local ref if one isn't provided
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef;
    
    // Use effect to ensure the input is always focusable
    React.useEffect(() => {
      const input = combinedRef.current;
      if (!input) return;
      
      // Special handling for date inputs
      if (input.type === 'date') {
        // Add change event listener for date inputs
        const handleDateChange = (e: Event) => {
          // Your date handling logic here
        };
      }
    }, [onChange, combinedRef, type]);
    
    // Custom change handler to ensure React's synthetic events work
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Call the parent onChange handler if provided
      if (onChange) {
        onChange(e);
      }
    };
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-500/30 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={combinedRef}
        disabled={disabled}
        readOnly={readOnly}
        onChange={handleChange}
        value={value}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
