import { SummarizerClientWrapper } from "@/components/summarizer/summarizer-client-wrapper"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import { Metadata } from "next"
import "./enhanced-styles.css"

export const metadata: Metadata = {
  title: "Content Summarizer | Transform Text Efficiently",
  description: "Transform lengthy content into concise summaries using AI-powered technology. Perfect for articles, research papers, and long documents.",
}

export default function SummarizerPage() {
  return (
    <PageWithFooter>
      <div className="min-h-screen pt-0">
        <SummarizerClientWrapper />
      </div>
    </PageWithFooter>
  )
}
