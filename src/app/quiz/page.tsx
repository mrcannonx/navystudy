import { QuizClientWrapper } from "@/components/quiz/quiz-client-wrapper"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import { Metadata } from "next"
import "./enhanced-styles.css"

export const metadata: Metadata = {
  title: "Interactive Quizzes | Test Your Knowledge",
  description: "Challenge yourself with AI-generated quizzes, track your progress, and identify areas for improvement with our interactive quiz system.",
}

export default function QuizPage() {
  return (
    <PageWithFooter>
      <div className="min-h-screen pt-0">
        <QuizClientWrapper />
      </div>
    </PageWithFooter>
  )
}
