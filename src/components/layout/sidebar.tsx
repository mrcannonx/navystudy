"use client"

import Link from "next/link"
import type { LinkProps } from 'next/link'
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Medal,
  DollarSign,
  Anchor
} from "lucide-react"
import { useAuth } from "@/contexts/auth"

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "Finance",
    href: "/admin/finance",
    icon: DollarSign
  },
  {
    title: "Navy Ranks",
    href: "/admin/navy-ranks",
    icon: Medal
  },
  {
    title: "Navy Ratings",
    href: "/admin/navy-ratings",
    icon: Anchor
  },
  {
    title: "Insignias",
    href: "/admin/insignias",
    icon: Medal
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="w-64 h-screen bg-background border-r flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href as LinkProps<string>['href']}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
} 