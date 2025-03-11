import { ManagePageClient } from "@/components/manage/manage-page-client"
import { Footer } from "@/components/footer"
import { Metadata } from "next"
import "./enhanced-styles.css"

export const metadata: Metadata = {
  title: "Create Study Materials | AI-Powered Content Generator",
  description: "Transform your notes, textbooks, or any learning content into interactive quizzes and flashcards using our advanced AI. Study smarter, not harder.",
}

export default function ManagePage() {
  return (
    <>
      <ManagePageClient />
      <Footer />
    </>
  )
}
