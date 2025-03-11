"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ComponentPropsWithoutRef } from "react"

export function ClientNavigationMenu(
  props: ComponentPropsWithoutRef<typeof NavigationMenu>
) {
  return <NavigationMenu {...props} />
}

export function ClientNavigationMenuContent(
  props: ComponentPropsWithoutRef<typeof NavigationMenuContent>
) {
  return <NavigationMenuContent {...props} />
}

export function ClientNavigationMenuItem(
  props: ComponentPropsWithoutRef<typeof NavigationMenuItem>
) {
  return <NavigationMenuItem {...props} />
}

export function ClientNavigationMenuLink(
  props: ComponentPropsWithoutRef<typeof NavigationMenuLink>
) {
  return <NavigationMenuLink {...props} />
}

export function ClientNavigationMenuList(
  props: ComponentPropsWithoutRef<typeof NavigationMenuList>
) {
  return <NavigationMenuList {...props} />
}

export function ClientNavigationMenuTrigger(
  props: ComponentPropsWithoutRef<typeof NavigationMenuTrigger>
) {
  return <NavigationMenuTrigger {...props} />
}