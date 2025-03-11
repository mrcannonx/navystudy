"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { formatNameWithRankRate } from "@/app/profile/utils"

interface ProfileCardProps {
    name: string
    userId: string
    isAdmin: boolean
    rank?: string
    rate?: string
    rateTitle?: string
    avatarUrl?: string
    insigniaUrl?: string
    onProfileUpdate?: (data: any) => void
}

export function ProfileCard({
    name,
    userId,
    isAdmin,
    rank,
    rate,
    rateTitle,
    avatarUrl,
    insigniaUrl,
    onProfileUpdate
}: ProfileCardProps) {
    const router = useRouter()
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()

    return (
        <Card className="profile-card h-full overflow-hidden flex flex-col shadow-sm border border-blue-100 dark:border-blue-800 transition-all duration-300 hover:shadow">
            <div className="header-bg relative h-16 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 after:absolute after:inset-0 after:bg-[url('/map-pattern.svg')] after:opacity-10 after:bg-no-repeat after:bg-cover">
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-3 h-8 w-8 bg-white/10 hover:bg-white/20 text-white z-10"
                    onClick={() => router.push('/profile')}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>
            <div className="px-4 py-3.5 flex-1 bg-white dark:bg-gray-900">
                <div className="flex flex-col items-center -mt-12 h-full">
                    <Avatar className="avatar-ring h-20 w-20 ring-4 ring-white dark:ring-gray-900 bg-blue-100">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={name} />
                        ) : (
                            <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="mt-2 text-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatNameWithRankRate({
                                full_name: name,
                                rank: rank || null,
                                rate: rate || null
                            } as any)}
                        </h2>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 mt-3">
                        {rank && rank !== "E6" && (
                            <Badge variant="secondary" className="font-medium px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                {rank}
                            </Badge>
                        )}
                        {rate && (
                            <div className="relative w-12 h-12 border border-blue-200 dark:border-blue-800 rounded-full p-0.5 bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                <div className="flex items-center justify-center w-full h-full text-sm md:text-base font-semibold text-blue-700 dark:text-blue-300">
                                    {rate}
                                </div>
                            </div>
                        )}
                        {isAdmin && (
                            <Badge variant="secondary" className="font-medium px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                                Admin
                            </Badge>
                        )}
                        {insigniaUrl && (
                            <div className="relative w-12 h-12 border border-blue-200 dark:border-blue-800 rounded-full p-0.5 bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                <Image
                                    src={insigniaUrl}
                                    alt="Rate insignia"
                                    fill
                                    className="object-contain rounded-full p-0.5"
                                    sizes="48px"
                                    priority
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )
}
