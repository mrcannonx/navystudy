"use client"

import { ComponentPropsWithoutRef } from "react"

export function ClientSelect(props: ComponentPropsWithoutRef<"select">) {
  return <select {...props} />
}
