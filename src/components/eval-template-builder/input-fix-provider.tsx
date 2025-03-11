"use client"

import React, { useEffect } from 'react'
import { useGlobalInputFix } from '@/hooks/use-input-fix'

interface InputFixProviderProps {
  children: React.ReactNode
}

export function InputFixProvider({ children }: InputFixProviderProps) {
  // Apply the global input fix
  useGlobalInputFix()
  
  // Add additional fixes specific to the eval-template-builder
  useEffect(() => {
    // Function to patch React synthetic events if needed
    const patchReactEvents = () => {
      // Check if we're in a React environment
      if (window.React) {
        // Try to access React internals to fix synthetic events
        try {
          // This is a last resort approach that might help with React synthetic events
          const reactRoot = document.querySelector('[data-reactroot]')
          if (reactRoot) {
            // Force React to re-render the component tree
            const event = new Event('resize')
            window.dispatchEvent(event)
          }
        } catch (error) {
          console.error('Error patching React events:', error)
        }
      }
    }
    
    // Apply the patch
    patchReactEvents()
    
    // Add a global click handler to ensure inputs are focusable
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // If clicking on or near an input, ensure it's focusable
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const input = target as HTMLInputElement | HTMLTextAreaElement
        
        // Ensure the input is not disabled or readonly
        if (input.disabled) {
          input.disabled = false
        }
        
        if (input.readOnly) {
          input.readOnly = false
        }
        
        // Don't force focus as it can interfere with React's controlled components
        // and cause state issues between components
      }
    }
    
    // Add a global keydown handler to manually handle keyboard input
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      console.log('InputFixProvider - Global keydown event:', e.key, 'on element:', (e.target as HTMLElement).tagName, (e.target as HTMLElement).id);
      
      // Skip handling for textarea elements - let them use their own event handling
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') {
        console.log('InputFixProvider - Skipping keydown handling for textarea');
        return;
      }
      // Find the active element
      const activeElement = document.activeElement as HTMLElement
      
      // If the active element is an input or textarea
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        // Skip if this is a DirectInput component (which has its own event handling)
        if (activeElement.hasAttribute('data-direct-input')) {
          return
        }
        
        const input = activeElement as HTMLInputElement | HTMLTextAreaElement
        
        // If the key is a printable character, manually update the input value
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          // Get the current selection
          const selectionStart = input.selectionStart || 0
          const selectionEnd = input.selectionEnd || selectionStart
          
          // Create the new value by inserting the character at the cursor position
          const newValue = input.value.slice(0, selectionStart) + e.key + input.value.slice(selectionEnd)
          
          // Update the input value
          input.value = newValue
          
          // Dispatch an input event to notify React
          const inputEvent = new Event('input', { bubbles: true })
          console.log('InputFixProvider - Dispatching input event with value:', newValue)
          input.dispatchEvent(inputEvent)
          
          // Also try to dispatch a React synthetic event
          try {
            const nativeInputEvent = new InputEvent('input', { bubbles: true })
            Object.defineProperty(nativeInputEvent, 'target', { value: input })
            console.log('InputFixProvider - Dispatching native input event')
            input.dispatchEvent(nativeInputEvent)
          } catch (err) {
            console.error('Error dispatching native event:', err)
          }
          
          // Prevent the default behavior to avoid double input
          e.preventDefault()
          
          // Update the cursor position
          setTimeout(() => {
            input.selectionStart = selectionStart + 1
            input.selectionEnd = selectionStart + 1
          }, 0)
        }
        // Handle backspace
        else if (e.key === 'Backspace') {
          const selectionStart = input.selectionStart || 0
          const selectionEnd = input.selectionEnd || selectionStart
          
          // If there's a selection, delete it
          if (selectionStart !== selectionEnd) {
            const newValue = input.value.slice(0, selectionStart) + input.value.slice(selectionEnd)
            input.value = newValue
          }
          // Otherwise delete the character before the cursor
          else if (selectionStart > 0) {
            const newValue = input.value.slice(0, selectionStart - 1) + input.value.slice(selectionStart)
            input.value = newValue
            
            // Update cursor position
            setTimeout(() => {
              input.selectionStart = selectionStart - 1
              input.selectionEnd = selectionStart - 1
            }, 0)
          }
          
          // Dispatch an input event
          const inputEvent = new Event('input', { bubbles: true })
          input.dispatchEvent(inputEvent)
          
          // Prevent default
          e.preventDefault()
        }
      }
    }
    
    // Add the global event handlers
    document.addEventListener('click', handleGlobalClick, true)
    document.addEventListener('keydown', handleGlobalKeydown, true)
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleGlobalClick, true)
      document.removeEventListener('keydown', handleGlobalKeydown, true)
    }
  }, [])
  
  return <>{children}</>
}