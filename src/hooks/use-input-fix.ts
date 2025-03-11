"use client"

import { useEffect, useRef } from 'react'

/**
 * A hook to fix issues with input fields not accepting typing
 * @param inputRef - Reference to the input element
 */
export function useInputFix(inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>) {
  const isFixed = useRef(false)

  useEffect(() => {
    // Only run this once per input
    if (isFixed.current || !inputRef.current) return
    
    const input = inputRef.current
    
    // Skip if this is a DirectInput component (which has its own event handling)
    if (input.hasAttribute('data-direct-input')) {
      console.log('Skipping input fix for DirectInput component')
      return
    }
    
    // Log input details
    console.log('Fixing input:', {
      id: input.id,
      name: input.name,
      type: input.type,
      disabled: input.disabled,
      readOnly: input.readOnly
    })
    
    // Ensure the input is not disabled or readonly
    if (input.disabled) {
      console.log('Enabling disabled input')
      input.disabled = false
    }
    
    if (input.readOnly) {
      console.log('Removing readonly from input')
      input.readOnly = false
    }
    
    // Add direct event listeners to ensure input events work
    const handleKeyDown = (e: Event) => {
      const keyEvent = e as KeyboardEvent;
      console.log('Keydown on fixed input:', keyEvent.key)
      // Make sure the event propagates
      e.stopPropagation = function() {
        console.log('stopPropagation prevented')
      }
    }
    
    const handleInput = (e: Event) => {
      console.log('Input event on fixed input:', input.value)
      console.log('Input event details:', {
        target: (e.target as HTMLInputElement).id,
        value: (e.target as HTMLInputElement).value,
        type: e.type
      })
    }
    
    // Add the event listeners
    input.addEventListener('keydown', handleKeyDown, true)
    input.addEventListener('input', handleInput, true)
    
    // Mark as fixed
    isFixed.current = true
    
    // Clean up function
    return () => {
      input.removeEventListener('keydown', handleKeyDown, true)
      input.removeEventListener('input', handleInput, true)
    }
  }, [inputRef])
}

/**
 * A hook to fix issues with input fields not accepting typing
 * This version works with uncontrolled inputs
 */
export function useGlobalInputFix() {
  useEffect(() => {
    // Function to fix all inputs on the page
    const fixAllInputs = () => {
      const inputs = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
      
      console.log(`Fixing ${inputs.length} input elements`)
      
      inputs.forEach((input, index) => {
        // Skip if already fixed
        if (input.dataset.fixed === 'true') return
        
        // Skip if this is a DirectInput component (which has its own event handling)
        if (input.hasAttribute('data-direct-input')) {
          console.log(`Skipping input fix for DirectInput component #${index}`)
          return
        }
        
        // Log input details
        console.log(`Fixing input #${index}:`, {
          id: input.id,
          name: input.name,
          type: input.type,
          disabled: input.disabled,
          readOnly: input.readOnly
        })
        
        // Ensure the input is not disabled or readonly
        if (input.disabled) {
          console.log(`Enabling disabled input #${index}`)
          input.disabled = false
        }
        
        if (input.readOnly) {
          console.log(`Removing readonly from input #${index}`)
          input.readOnly = false
        }
        
        // Mark as fixed
        input.dataset.fixed = 'true'
      })
    }
    
    // Fix inputs initially
    fixAllInputs()
    
    // Set up a MutationObserver to watch for new inputs
    const observer = new MutationObserver((mutations) => {
      let shouldFix = false
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          shouldFix = true
        }
      })
      
      if (shouldFix) {
        fixAllInputs()
      }
    })
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    // Clean up
    return () => {
      observer.disconnect()
    }
  }, [])
}