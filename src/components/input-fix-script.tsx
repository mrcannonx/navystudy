"use client"

import { useEffect } from 'react'

export function InputFixScript() {
  useEffect(() => {
    // This script will run only on the client side
    const script = document.createElement('script')
    script.src = '/input-fix.js'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    // Clean up function to remove the script when component unmounts
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, []) // Empty dependency array ensures this runs only once

  return null // This component doesn't render anything
}