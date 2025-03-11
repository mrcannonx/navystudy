"use client"

import { Spinner } from "@/components/ui/spinner"
import { ComponentPropsWithoutRef } from "react"

export function ClientSpinner(props: ComponentPropsWithoutRef<typeof Spinner>) {
  return <Spinner {...props} />
}