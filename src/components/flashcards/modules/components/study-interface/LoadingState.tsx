"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <Skeleton className="h-8 w-3/4 mb-8" />
            <Skeleton className="h-[400px] w-full mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
} 