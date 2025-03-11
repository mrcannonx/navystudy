import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
}

export function TimePickerInput({
  className,
  value,
  onChange,
  ...props
}: TimePickerInputProps) {
  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // Validate time format (HH:mm)
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
      onChange(newValue)
    } else if (newValue === "") {
      // Allow empty input for clearing
      onChange("")
    }
  }

  // Format value to ensure HH:mm format
  const formatValue = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const paddedHours = hours.padStart(2, "0")
    const paddedMinutes = minutes ? minutes.padStart(2, "0") : "00"
    return `${paddedHours}:${paddedMinutes}`
  }

  return (
    <Input
      type="time"
      className={cn(
        "w-full",
        className
      )}
      value={formatValue(value)}
      onChange={handleInputChange}
      {...props}
    />
  )
} 