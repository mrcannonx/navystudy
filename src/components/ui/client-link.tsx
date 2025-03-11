"use client"

import Link from "next/link"
import { ComponentProps } from "react"

export function ClientLink({ children, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props}>{children}</Link>
}
