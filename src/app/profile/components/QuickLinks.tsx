"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { BookOpen, ChevronRight } from "lucide-react"

export function QuickLinks() {
  return (
    <Card className="overflow-hidden shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard" className="group">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-grow">
                <p className="font-medium">Dashboard</p>
                <p className="text-sm text-muted-foreground">View your study dashboard</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>
          
          <Link href="/flashcards" className="group">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-grow">
                <p className="font-medium">Flashcards</p>
                <p className="text-sm text-muted-foreground">Study with flashcards</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
            </div>
          </Link>
          
          <Link href="/quiz" className="group">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-grow">
                <p className="font-medium">Quiz</p>
                <p className="text-sm text-muted-foreground">Test your knowledge</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
            </div>
          </Link>
          
          <Link href="/settings" className="group">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-grow">
                <p className="font-medium">Settings</p>
                <p className="text-sm text-muted-foreground">Manage your account</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </Card>
  )
}