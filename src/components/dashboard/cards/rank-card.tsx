import { Trophy } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface RankCardProps {
    rank?: string
    rate?: number
    rateTitle?: string
    insigniaUrl?: string
}

export function RankCard({
    rank = 'Novice',
    rate,
    rateTitle,
    insigniaUrl
}: RankCardProps) {

    return (
        <Card className="rank-card h-full p-4 bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-900 flex flex-col shadow-sm border border-amber-100 dark:border-amber-800 transition-all duration-300 hover:shadow relative overflow-hidden">
            {/* Decorative accent */}
            <div className="accent absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            
            <div className="flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className="icon-bg p-2 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/20 rounded-lg shadow-sm">
                        <Trophy className="icon h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Current Rank</h3>
                    </div>
                </div>
                <div className="text-center">
                    <p className="rank-text text-4xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                        {rank}
                    </p>
                </div>
                <div className="divider my-2 border-t border-amber-100 dark:border-amber-800/30" />
                {insigniaUrl && (
                    <div className="flex justify-center">
                        <div className="relative w-20 h-20">
                            <Image
                                src={insigniaUrl}
                                alt={`${rank} insignia`}
                                fill
                                className="object-contain"
                                sizes="80px"
                                priority
                            />
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
