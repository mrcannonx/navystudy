"use client"

import { Textarea } from "@/components/ui/textarea"
import { ComponentPropsWithoutRef } from "react"

export function ClientTextarea(props: ComponentPropsWithoutRef<typeof Textarea>) {
  return <Textarea {...props} />
}