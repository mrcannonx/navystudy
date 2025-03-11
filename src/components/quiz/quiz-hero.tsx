"use client"

import { Brain, CheckCircle, Clock, Trophy, BarChart } from "lucide-react"

export function QuizHero() {
  return (
    <div className="w-full bg-gradient-to-b from-muted/50 to-muted px-8 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Test Your Knowledge</h2>
              <p className="text-muted-foreground">
                Challenge yourself with our interactive quizzes designed to help you learn and grow. 
                Track your progress and improve your understanding through engaging questions and immediate feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Instant Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate results and explanations for each answer to enhance your learning experience
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Self-Paced Learning</h3>
              <p className="text-sm text-muted-foreground">
                Take quizzes at your own pace, with the ability to pause and resume when needed
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Trophy className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement over time with detailed score tracking and performance metrics
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BarChart className="h-8 w-8 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium mb-2">Performance Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Review your quiz history and identify areas for improvement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
