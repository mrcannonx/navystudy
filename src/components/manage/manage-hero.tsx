"use client"

import { FileText, Wand2, BookOpen } from "lucide-react"

export function ManageHero() {
  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      <div className="relative max-w-3xl mx-auto space-y-12">
        {/* Main Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Create Study Material
          </h1>
          <p className="text-xl text-white/80">
            Transform your study content into interactive quizzes and flashcards using our AI-powered system.
          </p>
        </div>

        {/* How it Works Section */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">1. Paste Content</h3>
              <p className="text-sm text-white/80">
                Add your study material in the text area below
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">2. Choose Format</h3>
              <p className="text-sm text-white/80">
                Select whether you want to generate a quiz or flashcards
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">3. Generate & Study</h3>
              <p className="text-sm text-white/80">
                Our AI will create study materials that you can access anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
