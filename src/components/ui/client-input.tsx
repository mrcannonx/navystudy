"use client"

import { Input } from "@/components/ui/input"
import { ComponentPropsWithoutRef } from "react"

export function ClientInput(props: ComponentPropsWithoutRef<typeof Input>) {
  return <Input {...props} />
}