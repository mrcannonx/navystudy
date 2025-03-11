"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StudyHeaderProps {
    deckName: string;
    onExit: () => void;
}

export function StudyHeader({
    deckName,
    onExit
}: StudyHeaderProps) {
    return (
        <div className="flex items-center mb-8 relative">
            <Button
                variant="outline"
                size="icon"
                onClick={onExit}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 absolute left-0"
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-full text-center">
                <h1 className="text-2xl font-bold">{deckName}</h1>
            </div>
        </div>
    )
}