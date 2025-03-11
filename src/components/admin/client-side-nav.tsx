"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes, type StaticRoute } from "@/types/routes";
import type { Route } from "next";
import { 
  LayoutDashboard, 
  Users, 
  BarChart, 
  BookOpen, 
  Settings, 
  FileQuestion,
  Medal
} from "lucide-react";

interface NavItem {
  title: string;
  href: Route<StaticRoute>;
  icon: React.ElementType;
}

const sidebarItems: NavItem[] = [
  {
    title: "Overview",
    href: routes.admin as Route<'/admin'>,
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: routes.adminUsers as Route<'/admin/users'>,
    icon: Users,
  },
  {
    title: "Analytics",
    href: routes.adminAnalytics as Route<'/admin/analytics'>,
    icon: BarChart,
  },
  {
    title: "Quiz Management",
    href: routes.adminQuizManagement as Route<'/admin/quiz-management'>,
    icon: FileQuestion,
  },
  {
    title: "Flashcard Decks",
    href: routes.adminFlashcardDecks as Route<'/admin/flashcard-decks'>,
    icon: BookOpen,
  },
  {
    title: "Rank Manager",
    href: routes.adminRankManager as Route<'/admin/rank-manager'>,
    icon: Medal,
  },
  {
    title: "Settings",
    href: routes.adminSettings as Route<'/admin/settings'>,
    icon: Settings,
  },
];

export function ClientSideNav() {
  const pathname = usePathname();

  return (
    <nav className="px-4 space-y-2">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== "/admin" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              isActive 
                ? "bg-gray-100 text-primary font-medium" 
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
} 