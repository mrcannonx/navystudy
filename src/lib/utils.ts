import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { startOfDay, endOfDay, differenceInDays, isWithinInterval } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const getFontSizeClasses = (fontSize: 'small' | 'medium' | 'large') => {
  const baseClasses = {
    small: {
      question: 'text-base',
      option: 'text-sm',
      explanation: 'text-xs',
      heading: 'text-lg'
    },
    medium: {
      question: 'text-lg',
      option: 'text-base',
      explanation: 'text-sm',
      heading: 'text-xl'
    },
    large: {
      question: 'text-xl',
      option: 'text-lg',
      explanation: 'text-base',
      heading: 'text-2xl'
    }
  }
  return baseClasses[fontSize]
}

export function calculateStreak(dates: Date[], timezone: string = 'UTC'): {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: Date | null;
} {
  if (!dates.length) {
    return { currentStreak: 0, bestStreak: 0, lastActiveDate: null }
  }

  // Convert dates to user's timezone
  const zonedDates = dates.map(date => toZonedTime(date, timezone))
  
  // Sort dates in ascending order and convert to start of day
  const sortedDates = zonedDates
    .map(date => startOfDay(date))
    .sort((a, b) => a.getTime() - b.getTime())

  let currentStreak = 1
  let bestStreak = 1
  let tempStreak = 1

  // Get today in user's timezone
  const today = startOfDay(toZonedTime(new Date(), timezone))
  const yesterday = startOfDay(toZonedTime(new Date(Date.now() - 86400000), timezone))

  // Check if the last activity was today or yesterday
  const lastDate = sortedDates[sortedDates.length - 1]
  const isActive = lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()

  // Calculate streaks
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInDays(sortedDates[i], sortedDates[i - 1])
    
    if (diff === 1) {
      tempStreak++
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak
      }
    } else {
      // Break in streak
      tempStreak = 1
    }
  }

  // Only count current streak if it's still active
  if (isActive) {
    currentStreak = tempStreak
  } else {
    currentStreak = 0
  }

  return {
    currentStreak,
    bestStreak,
    lastActiveDate: sortedDates[sortedDates.length - 1]
  }
}

export function isStreakMaintained(lastActiveDate: Date | null, timezone: string = 'UTC'): boolean {
  if (!lastActiveDate) return false

  const today = startOfDay(toZonedTime(new Date(), timezone))
  const yesterday = startOfDay(toZonedTime(new Date(Date.now() - 86400000), timezone))
  const zonedLastActive = startOfDay(toZonedTime(lastActiveDate, timezone))

  return (
    zonedLastActive.getTime() === today.getTime() ||
    zonedLastActive.getTime() === yesterday.getTime()
  )
}

export function getStreakDeadline(lastActiveDate: Date | null, timezone: string = 'UTC'): Date | null {
  if (!lastActiveDate) return null

  const zonedLastActive = toZonedTime(lastActiveDate, timezone)
  const nextDay = startOfDay(new Date(zonedLastActive.getTime() + 86400000))
  const deadline = endOfDay(nextDay)

  // Convert back to UTC by creating a new Date with the timezone offset applied
  return new Date(deadline.getTime() - (deadline.getTimezoneOffset() * 60000))
}

export function formatDuration(minutes: number): string {
  if (!minutes) return "0 min"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours} hr`
  return `${hours} hr ${remainingMinutes} min`
}