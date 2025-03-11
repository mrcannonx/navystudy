"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComponentPropsWithoutRef } from "react"

export function ClientTabs(props: ComponentPropsWithoutRef<typeof Tabs>) {
  return <Tabs {...props} />
}

export function ClientTabsContent(
  props: ComponentPropsWithoutRef<typeof TabsContent>
) {
  return <TabsContent {...props} />
}

export function ClientTabsList(
  props: ComponentPropsWithoutRef<typeof TabsList>
) {
  return <TabsList {...props} />
}

export function ClientTabsTrigger(
  props: ComponentPropsWithoutRef<typeof TabsTrigger>
) {
  return <TabsTrigger {...props} />
}