"use client"

import { ReactNode } from "react"

interface InteractiveWrapperProps {
  children: ReactNode
  onInteract?: () => void
}

const InteractiveWrapper = ({ children, onInteract }: InteractiveWrapperProps) => {
  const handleClick = () => {
    if (onInteract) {
      onInteract()
    }
  }

  return (
    <div 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick()
        }
      }}
    >
      {children}
    </div>
  )
}

InteractiveWrapper.displayName = "InteractiveWrapper"

export { InteractiveWrapper }
