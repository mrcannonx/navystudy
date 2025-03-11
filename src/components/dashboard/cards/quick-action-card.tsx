import { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import Link, { LinkProps } from "next/link"

interface QuickActionCardProps {
    title: string
    description: string
    icon: ReactNode
    href: LinkProps<{}>["href"]
    color: "blue" | "purple" | "green" | "orange" | "indigo"
}

// Material UI inspired color classes
const colorClasses = {
    // Blue - Material UI primary blue (500)
    blue: {
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
        gradient: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900",
        border: "border-blue-200 dark:border-blue-800",
        shadow: "shadow-sm",
        hoverShadow: "hover:shadow",
        accent: "after:absolute after:top-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 after:rounded-t-lg"
    },
    // Purple - Material UI purple (500)
    purple: {
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
        gradient: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900",
        border: "border-purple-200 dark:border-purple-800",
        shadow: "shadow-sm",
        hoverShadow: "hover:shadow",
        accent: "after:absolute after:top-0 after:left-0 after:w-full after:h-1 after:bg-purple-500 after:rounded-t-lg"
    },
    // Green - Material UI green (500)
    green: {
        icon: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
        gradient: "bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-900",
        border: "border-green-200 dark:border-green-800",
        shadow: "shadow-sm",
        hoverShadow: "hover:shadow",
        accent: "after:absolute after:top-0 after:left-0 after:w-full after:h-1 after:bg-green-500 after:rounded-t-lg"
    },
    // Orange - Material UI orange (500)
    orange: {
        icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
        gradient: "bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-900",
        border: "border-orange-200 dark:border-orange-800",
        shadow: "shadow-sm",
        hoverShadow: "hover:shadow",
        accent: "after:absolute after:top-0 after:left-0 after:w-full after:h-1 after:bg-orange-500 after:rounded-t-lg"
    },
    // Indigo - Material UI indigo (500)
    indigo: {
        icon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",
        gradient: "bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-900",
        border: "border-indigo-200 dark:border-indigo-800",
        shadow: "shadow-sm",
        hoverShadow: "hover:shadow",
        accent: "after:absolute after:top-0 after:left-0 after:w-full after:h-1 after:bg-indigo-500 after:rounded-t-lg"
    }
}

export function QuickActionCard({
    title,
    description,
    icon,
    href,
    color
}: QuickActionCardProps) {
    const colorStyle = colorClasses[color];
    
    return (
        <Link href={href} className="h-full block">
            <Card className={`p-6 h-full relative overflow-hidden ${colorStyle.gradient} ${colorStyle.border} ${colorStyle.shadow} ${colorStyle.hoverShadow} ${colorStyle.accent} transition-all duration-300 cursor-pointer hover:translate-y-[-2px]`}>
                <div className="flex items-start gap-4 h-full">
                    <div className={`p-3 rounded-lg ${colorStyle.icon} shadow-sm`}>
                        {icon}
                    </div>
                    <div className="min-h-[4rem] flex flex-col">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                    </div>
                </div>
            </Card>
        </Link>
    )
}
