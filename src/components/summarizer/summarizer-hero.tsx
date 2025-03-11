import { FileText } from "lucide-react"

export function SummarizerHero() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 animate-pulse" />
          <div className="relative bg-background rounded-full p-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Content Summarizer
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto text-lg">
          Transform lengthy content into concise summaries. Our AI-powered tool helps you extract key information quickly and efficiently.
        </p>
      </div>
    </div>
  )
}
