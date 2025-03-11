"use client"

import { Label } from "@radix-ui/react-label"
import { ComponentPropsWithoutRef } from "react"

export function ClientLabel(props: ComponentPropsWithoutRef<typeof Label>) {
  return <Label {...props} />
}