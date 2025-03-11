import { FlashcardsClientWrapper } from "@/components/flashcards/flashcards-client-wrapper"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import { Metadata } from "next"
import "./enhanced-styles.css"

export const metadata: Metadata = {
  title: "Flashcards | Study with Spaced Repetition",
  description: "Create and study flashcards with our enhanced interface. Use active recall and spaced repetition to improve your learning efficiency.",
}

export default function FlashcardsPage() {
  return (
    <PageWithFooter>
      <div className="min-h-screen pt-0">
        <FlashcardsClientWrapper />
      </div>
    </PageWithFooter>
  )
}
