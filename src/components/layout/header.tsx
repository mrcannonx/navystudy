"use client"

import { usePathname } from "next/navigation"
import { routes } from "@/lib/routes"
import type { Route } from "next"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth"
import { SUBSCRIPTION_STATUS } from "@/lib/stripe-client"
import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Settings,
  LogOut,
  LayoutDashboard,
  Calendar,
  BookOpen,
  Brain,
  Library,
  Shield,
  FileText,
  FileSearch,
  Star,
  ClipboardList
} from "lucide-react"
import { HeaderTrialStatus } from "./HeaderTrialStatus"

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: routes.dashboard,
    icon: LayoutDashboard
  },
  {
    name: "Flashcards",
    href: routes.flashcards,
    icon: BookOpen
  },
  {
    name: "Quiz",
    href: routes.quiz,
    icon: Brain
  },
  {
    name: "Summarizer",
    href: routes.summarizer,
    icon: FileText
  },
  {
    name: "Eval Builder",
    href: routes.evalTemplateBuilder,
    icon: ClipboardList
  },
  {
    name: "Resources",
    href: routes.resources,
    icon: Library
  },
]

function getInitial(name: string | null | undefined) {
  if (!name) return "U"
  return name.charAt(0).toUpperCase()
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading, signOut } = useAuth()
  const { subscription } = useSubscription()
  
  // Determine if user has an active subscription
  const isSubscribed = subscription?.status === SUBSCRIPTION_STATUS.ACTIVE ||
                       subscription?.status === SUBSCRIPTION_STATUS.TRIALING

  const handleSignOut = async () => {
    await signOut()
    router.push(routes.auth as Route<'/auth'>)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          <Link href={routes.home as Route<'/'> } className="flex items-center space-x-2">
            <span className="font-bold">NAVY Study</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-center">
          <nav className="flex items-center space-x-8 text-sm font-medium">
            {navigation.map((item) => {
              // If user is authenticated, render as link
              if (user) {
                return (
                  <Link
                    key={item.href}
                    href={item.href as Route<typeof item.href>}
                    className={cn(
                      "transition-colors hover:text-foreground/80 flex items-center gap-2",
                      pathname === item.href
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.name}
                  </Link>
                )
              } else {
                // For non-authenticated users, link to relevant homepage sections
                const getHomepageSectionLink = () => {
                  switch(item.name) {
                    case "Flashcards":
                    case "Quiz":
                    case "Summarizer":
                      return `${routes.home}#advanced-study-tools`;
                    case "Eval Builder":
                      return `${routes.home}#navy-evaluation-builder`;
                    case "Resources":
                      return `${routes.home}#advancement-calculators`;
                    default:
                      return routes.home;
                  }
                };
                
                return (
                  <Link
                    key={item.name}
                    href={getHomepageSectionLink() as Route<string>}
                    className="text-foreground/60 flex items-center gap-2 hover:text-foreground/80 transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.name}
                  </Link>
                )
              }
            })}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {user && <HeaderTrialStatus />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0"
                >
                  <Avatar className="overflow-hidden">
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt={profile?.full_name || user.email || "User"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitial(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem key="profile" asChild>
                  <Link href={routes.profile as Route<'/profile'>} className="cursor-pointer">
                    <Avatar className="mr-2 h-4 w-4 overflow-hidden">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={profile?.full_name || user.email || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs">
                        {getInitial(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    Profile
                  </Link>
                </DropdownMenuItem>
                {profile?.is_admin && (
                  <DropdownMenuItem key="admin" asChild>
                    <Link href={routes.admin as Route<'/admin'>} className="cursor-pointer">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem key="settings" asChild>
                  <Link href={routes.settings as Route<'/settings'>} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  key="signout"
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href={`${routes.auth}?mode=signin` as Route<'/auth'>}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href={`${routes.auth}?mode=signup` as Route<'/auth'>}>
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
