"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ComponentPropsWithoutRef } from "react"

export function ClientDropdownMenu(
  props: ComponentPropsWithoutRef<typeof DropdownMenu>
) {
  return <DropdownMenu {...props} />
}

export function ClientDropdownMenuContent(
  props: ComponentPropsWithoutRef<typeof DropdownMenuContent>
) {
  return <DropdownMenuContent {...props} />
}

export function ClientDropdownMenuTrigger(
  props: ComponentPropsWithoutRef<typeof DropdownMenuTrigger>
) {
  return <DropdownMenuTrigger {...props} />
}