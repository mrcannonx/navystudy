"use client"

import React, { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useGlobalInputFix } from '@/hooks/use-input-fix'

export default function InputTestPage() {
  // Apply the global input fix
  useGlobalInputFix()
  
  // State for input values
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [nativeInputValue, setNativeInputValue] = useState('')
  const [nativeTextareaValue, setNativeTextareaValue] = useState('')
  
  // Refs for direct DOM access
  const nativeInputRef = useRef<HTMLInputElement>(null)
  const nativeTextareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Function to log input values
  const logValues = () => {
    console.log('Input values:', {
      inputValue,
      textareaValue,
      nativeInputValue,
      nativeTextareaValue,
      nativeInputRefValue: nativeInputRef.current?.value,
      nativeTextareaRefValue: nativeTextareaRef.current?.value
    })
  }
  
  // Function to reset input values
  const resetValues = () => {
    setInputValue('')
    setTextareaValue('')
    setNativeInputValue('')
    setNativeTextareaValue('')
    
    if (nativeInputRef.current) {
      nativeInputRef.current.value = ''
    }
    
    if (nativeTextareaRef.current) {
      nativeTextareaRef.current.value = ''
    }
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Input Test Page</h1>
      
      <div className="grid gap-8">
        {/* UI Component Library Inputs */}
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">UI Component Library Inputs</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="ui-input" className="block text-sm font-medium mb-1">
                Input Component
              </label>
              <Input
                id="ui-input"
                value={inputValue}
                onChange={(e) => {
                  console.log('Input onChange event:', e.target.value)
                  setInputValue(e.target.value)
                }}
                placeholder="Type something here..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Value: {inputValue || '(empty)'}
              </p>
            </div>
            
            <div>
              <label htmlFor="ui-textarea" className="block text-sm font-medium mb-1">
                Textarea Component
              </label>
              <Textarea
                id="ui-textarea"
                value={textareaValue}
                onChange={(e) => {
                  console.log('Textarea onChange event:', e.target.value)
                  setTextareaValue(e.target.value)
                }}
                placeholder="Type something here..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Value: {textareaValue || '(empty)'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Native HTML Inputs */}
        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Native HTML Inputs</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="native-input" className="block text-sm font-medium mb-1">
                Native Input
              </label>
              <input
                id="native-input"
                ref={nativeInputRef}
                value={nativeInputValue}
                onChange={(e) => {
                  console.log('Native input onChange event:', e.target.value)
                  setNativeInputValue(e.target.value)
                }}
                placeholder="Type something here..."
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">
                Value: {nativeInputValue || '(empty)'}
              </p>
            </div>
            
            <div>
              <label htmlFor="native-textarea" className="block text-sm font-medium mb-1">
                Native Textarea
              </label>
              <textarea
                id="native-textarea"
                ref={nativeTextareaRef}
                value={nativeTextareaValue}
                onChange={(e) => {
                  console.log('Native textarea onChange event:', e.target.value)
                  setNativeTextareaValue(e.target.value)
                }}
                placeholder="Type something here..."
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">
                Value: {nativeTextareaValue || '(empty)'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={logValues}>
            Log Values
          </Button>
          
          <Button variant="outline" onClick={resetValues}>
            Reset Values
          </Button>
        </div>
      </div>
    </div>
  )
}