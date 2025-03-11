"use client"

import React, { useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"

interface DirectInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChangeAction: (value: string) => void
  className?: string
}

export function DirectInput({
  value,
  onChangeAction,
  className,
  placeholder,
  type = 'text',
  ...props
}: DirectInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Sync the input value with the React state
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    
    console.log(`DirectInput - Syncing value for ${props.id || 'unnamed input'}:`, {
      inputValue: input.value,
      reactValue: value
    });
    
    // Add more detailed logging for personal info fields
    if (props.id === 'name-input' || props.id === 'desig-input' || props.id === 'ssn-input') {
      console.log(`DirectInput - Personal info field ${props.id}:`, {
        value,
        inputValue: input.value,
        props
      });
    }
    
    // Only update the DOM value if it's different from the React state
    if (input.value !== value) {
      input.value = value
    }
  }, [value, props.id])
  
  // Set up direct DOM event listeners
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    
    // Function to handle input events directly
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      onChangeAction(target.value)
    }
    
    // Function to handle keydown events
    const handleKeyDown = (e: KeyboardEvent) => {
      
      // Manually update the value for certain keys
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
        let newValue = input.value
        
        if (e.key === 'Backspace') {
          newValue = newValue.slice(0, -1)
        } else if (e.key === 'Delete') {
          // Handle delete key
          const selectionStart = input.selectionStart || 0
          const selectionEnd = input.selectionEnd || selectionStart
          
          if (selectionStart === selectionEnd) {
            // No selection, delete the character after the cursor
            newValue = newValue.slice(0, selectionStart) + newValue.slice(selectionStart + 1)
          } else {
            // Delete the selected text
            newValue = newValue.slice(0, selectionStart) + newValue.slice(selectionEnd)
          }
        } else {
          // Add the typed character
          const selectionStart = input.selectionStart || 0
          const selectionEnd = input.selectionEnd || selectionStart
          
          newValue = newValue.slice(0, selectionStart) + e.key + newValue.slice(selectionEnd)
        }
        // Update both the DOM and React state
        input.value = newValue
        onChangeAction(newValue)
        
        // Prevent default behavior to avoid duplicate input
        e.preventDefault()
        
        // Update cursor position for character keys
        if (e.key.length === 1) {
          const selectionStart = input.selectionStart || 0
          setTimeout(() => {
            input.selectionStart = selectionStart + 1
            input.selectionEnd = selectionStart + 1
          }, 0)
        }
      }
    }
    
    // Add event listeners
    input.addEventListener('input', handleInput, true)
    input.addEventListener('keydown', handleKeyDown, true)
    
    // Clean up
    return () => {
      input.removeEventListener('input', handleInput, true)
      input.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [onChangeAction])
  
  return (
    <input
      ref={inputRef}
      type={type}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-500/30 focus-visible:ring-offset-1",
        className
      )}
      // Ensure the input is not disabled or readonly
      disabled={false}
      readOnly={false}
      // Mark this as a DirectInput component to prevent duplicate event handling
      data-direct-input="true"
      // Don't use React's onChange as we're handling events directly
      {...props}
    />
  )
}

interface DirectTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string
  onChangeAction: (value: string) => void
  className?: string
}

export function DirectTextarea({
  value,
  onChangeAction,
  className,
  placeholder,
  ...props
}: DirectTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Sync the textarea value with the React state
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    // Only update the DOM value if it's different from the React state
    if (textarea.value !== value) {
      textarea.value = value
    }
  }, [value])
  
  // Set up direct DOM event listeners
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    // Function to handle input events directly
    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement
      onChangeAction(target.value)
    }
    
    // Function to handle keydown events
    const handleKeyDown = (e: KeyboardEvent) => {
      
      // Manually update the value for certain keys
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
        let newValue = textarea.value
        let selectionStart = textarea.selectionStart || 0
        let selectionEnd = textarea.selectionEnd || selectionStart
        
        if (e.key === 'Backspace') {
          newValue = newValue.slice(0, -1)
        } else if (e.key === 'Delete') {
          // Handle delete key
          if (selectionStart === selectionEnd) {
            // No selection, delete the character after the cursor
            newValue = newValue.slice(0, selectionStart) + newValue.slice(selectionStart + 1)
          } else {
            // Delete the selected text
            newValue = newValue.slice(0, selectionStart) + newValue.slice(selectionEnd)
          }
        } else if (e.key === 'Enter') {
          // Add a newline
          newValue = newValue.slice(0, selectionStart) + '\n' + newValue.slice(selectionEnd)
          selectionStart += 1; // Move cursor after the newline
        } else {
          // Add the typed character
          newValue = newValue.slice(0, selectionStart) + e.key + newValue.slice(selectionEnd)
          selectionStart += 1; // Move cursor after the typed character
        }
        
        // Update both the DOM and React state
        textarea.value = newValue
        onChangeAction(newValue)
        
        // Prevent default behavior to avoid duplicate input
        e.preventDefault()
        
        // Update cursor position
        const finalSelectionStart = selectionStart;
        setTimeout(() => {
          textarea.selectionStart = finalSelectionStart;
          textarea.selectionEnd = finalSelectionStart;
        }, 0)
      }
    }
    
    // Add event listeners
    textarea.addEventListener('input', handleInput, true)
    textarea.addEventListener('keydown', handleKeyDown, true)
    
    // Clean up
    return () => {
      textarea.removeEventListener('input', handleInput, true)
      textarea.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [onChangeAction])
  
  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600/50 dark:focus-visible:ring-blue-500/30 focus-visible:ring-offset-1",
        className
      )}
      // Ensure the textarea is not disabled or readonly
      disabled={false}
      readOnly={false}
      // Mark this as a DirectInput component to prevent duplicate event handling
      data-direct-input="true"
      // Don't use React's onChange as we're handling events directly
      {...props}
    />
  )
}