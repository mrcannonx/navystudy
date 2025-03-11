"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import type { StaticRoute } from "@/types/routes"
import type { Route } from "next"

type TypedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: Route<StaticRoute>
}

export function TypedLink({ href, ...props }: TypedLinkProps) {
  return <Link href={href} {...props} />
} 