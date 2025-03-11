"use client"

import Link from "next/link"
import * as React from "react"
import { ComponentProps } from "react"

export function InteractiveLink({ children, ...props }: ComponentProps<typeof Link>) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Link {...props}>
      {children}
    </Link>
  )
}
