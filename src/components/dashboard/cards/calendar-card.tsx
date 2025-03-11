"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import * as React from "react"

interface CalendarCardProps {
  className?: string
}

export function CalendarCard({ className }: CalendarCardProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Card className="calendar-card h-full bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-900 flex flex-col shadow-sm border border-indigo-100 dark:border-indigo-800 transition-all duration-300 hover:shadow relative overflow-hidden">
      {/* Decorative accent */}
      <div className="accent absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
      
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-bg p-2 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/20 rounded-lg shadow-sm">
            <CalendarIcon className="icon h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Calendar</h3>
          </div>
        </div>
        
        <div className="calendar-container flex-1 flex items-center justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </div>
    </Card>
  )
}