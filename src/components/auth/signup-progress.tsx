"use client"

import { CheckIcon } from "lucide-react"

interface SignupProgressProps {
  currentStep: number
  totalSteps: number
}

export default function SignupProgress({ currentStep, totalSteps }: SignupProgressProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div 
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full 
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              
              {/* Step label */}
              <span className={`
                mt-2 text-xs font-medium
                ${isCurrent ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {stepNumber === 1 && "Account"}
                {stepNumber === 2 && "Plan"}
                {stepNumber === 3 && "Payment"}
                {stepNumber === 4 && "Complete"}
              </span>
            </div>
          )
        })}
      </div>
      
      {/* Progress bar */}
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
        <div 
          className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}
