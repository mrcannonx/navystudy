"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CustomCalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  initialFocus?: boolean
}

export function CustomCalendar({
  className,
  selected,
  onSelect,
  initialFocus,
}: CustomCalendarProps) {
  const [month, setMonth] = React.useState<Date>(selected || new Date())

  const handlePreviousMonth = () => {
    const previousMonth = new Date(month)
    previousMonth.setMonth(month.getMonth() - 1)
    setMonth(previousMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(month)
    nextMonth.setMonth(month.getMonth() + 1)
    setMonth(nextMonth)
  }

  return (
    <div className="custom-calendar-container w-full">
      {/* Custom navigation header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded-full"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded-full"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>

      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        month={month}
        onMonthChange={setMonth}
        initialFocus={initialFocus}
        required={false}
        showOutsideDays
        className={cn(
          "p-2 mx-auto",
          "bg-background rounded-lg",
          className
        )}
        classNames={{
          months: "flex flex-col space-y-2",
          month: "space-y-2",
          caption: "hidden", // Hide the default caption with month navigation
          nav: "hidden", // Hide the default navigation
          table: "w-full border-collapse space-y-1",
          head_row: "flex justify-between",
          head_cell:
            "text-indigo-600/70 dark:text-indigo-400/70 font-medium text-xs uppercase tracking-wider w-10",
          row: "flex w-full mt-1 justify-between",
          cell: "h-9 w-10 text-center p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            "h-9 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded-full mx-auto flex items-center justify-center transition-colors"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white rounded-full shadow-sm",
          day_today: "border border-indigo-300 dark:border-indigo-700 bg-transparent text-indigo-600 dark:text-indigo-400",
          day_outside:
            "day-outside text-gray-400 dark:text-gray-600 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
      />
    </div>
  )
}