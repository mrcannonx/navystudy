"use client"

import { LoadingState } from "@/components/ui/loading-state"
import { ComponentPropsWithoutRef } from "react"

export function ClientLoadingState(
  props: ComponentPropsWithoutRef<typeof LoadingState>
) {
  return <LoadingState {...props} />
}