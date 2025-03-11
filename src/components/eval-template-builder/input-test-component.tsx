"use client"

import React, { useState } from 'react'
import { DirectInput, DirectTextarea } from './direct-input'

export function InputTestComponent() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded-md shadow-lg z-50 w-80">
      <h3 className="text-lg font-semibold mb-2">Input Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Test Input
          </label>
          <DirectInput
            value={inputValue}
            onChangeAction={setInputValue}
            placeholder="Type here to test input..."
            className="border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Value: {inputValue || '(empty)'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Test Textarea
          </label>
          <DirectTextarea
            value={textareaValue}
            onChangeAction={setTextareaValue}
            placeholder="Type here to test textarea..."
            className="border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Value: {textareaValue || '(empty)'}
          </p>
        </div>
      </div>
    </div>
  )
}