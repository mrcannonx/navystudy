"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"

const MOTIVATIONAL_QUOTES = [
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Anonymous"
  },
  {
    text: "Your talent determines what you can do. Your motivation determines how much you're willing to do. Your attitude determines how well you do it.",
    author: "Lou Holtz"
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Excellence is not a skill. It's an attitude.",
    author: "Ralph Marston"
  }
]

export function DailyQuoteCard() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null)

  useEffect(() => {
    // Get today's date and use it as a seed for selecting the quote
    const today = new Date()
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    
    // Create a simple hash from the date string to use as an index
    let hash = 0
    for (let i = 0; i < dateString.length; i++) {
      hash = ((hash << 5) - hash) + dateString.charCodeAt(i)
      hash = hash & hash // Convert to 32bit integer
    }
    
    // Use the hash to select a quote
    const index = Math.abs(hash) % MOTIVATIONAL_QUOTES.length
    setQuote(MOTIVATIONAL_QUOTES[index])
  }, [])

  if (!quote) return null

  return (
    <Card className="daily-quote-card w-full p-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-6">
        <div className="icon-bg p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
          <Quote className="icon h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1">
          <p className="quote-text text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 mb-4 leading-relaxed">
            "{quote.text}"
          </p>
          <p className="author text-right text-gray-600 dark:text-gray-400 font-medium">
            — {quote.author}
          </p>
        </div>
      </div>
    </Card>
  )
}