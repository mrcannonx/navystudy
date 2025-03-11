"use client"

import { ClientLink } from "@/components/ui/client-link"
import { FileText, Wand2, BookOpen, Brain, Zap, BarChart2, Clock, Lightbulb, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EnhancedManageHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full border-b border-blue-500 shadow-sm">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      {/* Main content container with max width */}
      <div className="relative px-6 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16 md:px-14 lg:pt-16 lg:pb-20 lg:px-16">
        <div className="max-w-[76rem] mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-white mb-4 backdrop-blur-sm">
            <Zap className="h-4 w-4 mr-2" />
            <span>AI-powered content generation</span>
          </div>
          
          {/* Main Hero Section */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white hero-title">
              Create Interactive Study Materials
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl">
              Transform your notes, textbooks, or any learning content into interactive quizzes and flashcards using our advanced AI. Study smarter, not harder.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-transparent hover:bg-blue-500/40 text-white border border-white/40 rounded-lg transition-all duration-300 text-base font-medium backdrop-blur-sm hover:border-white hover:shadow-glow hover:scale-105"
                  >
                    <Brain className="h-5 w-5" />
                    How It Works
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <Lightbulb className="h-6 w-6 text-yellow-500" />
                      How Our AI Generator Works
                    </DialogTitle>
                    <DialogDescription className="text-base pt-2">
                      Our AI-powered system transforms your content into effective study materials in just a few steps.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="mt-6 space-y-6">
                    {/* Content Processing Section */}
                    <div className="bg-blue-50 dark:bg-blue-950/50 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
                      <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                        <FileText className="h-5 w-5" />
                        Content Processing
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        Our AI analyzes your content to identify key concepts, facts, and relationships. It understands context and importance to create meaningful study materials.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Processes text from various sources like notes, textbooks, or articles</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Identifies important concepts and relationships between ideas</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Handles complex topics with nuanced understanding</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quiz Generation Section */}
                    <div className="bg-purple-50 dark:bg-purple-950/50 p-6 rounded-lg border border-purple-100 dark:border-purple-900">
                      <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                        <Wand2 className="h-5 w-5" />
                        Quiz Generation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        For quiz content, our AI creates challenging multiple-choice questions that test your understanding of the material at different cognitive levels.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Creates questions with varying difficulty levels</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Generates plausible distractors that challenge your knowledge</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Includes detailed explanations for each answer</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Flashcard Creation Section */}
                    <div className="bg-green-50 dark:bg-green-950/50 p-6 rounded-lg border border-green-100 dark:border-green-900">
                      <h3 className="flex items-center gap-2 text-xl font-semibold text-green-700 dark:text-green-300 mb-3">
                        <BookOpen className="h-5 w-5" />
                        Flashcard Creation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        For flashcards, our system creates concise question-answer pairs that promote active recall and efficient learning.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Creates different card types including basic, cloze, and reversed cards</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Balances information density for optimal learning</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <p className="text-gray-700 dark:text-gray-300">Organizes cards to build conceptual understanding</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature highlights - full width background with constrained content */}
      <div className="bg-gradient-to-b from-transparent to-blue-900/50 backdrop-blur-sm w-full">
        <div className="max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-8 sm:px-10 sm:pb-10 md:pb-12 md:px-14 lg:pb-16 lg:px-16">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <FileText className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Smart Content Analysis</h3>
              <p className="text-sm text-white/80">
                Our AI identifies key concepts and relationships in your content
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <Wand2 className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Customized Generation</h3>
              <p className="text-sm text-white/80">
                Create quizzes or flashcards tailored to your learning needs
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
              <BookOpen className="h-5 w-5 icon-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Instant Study Materials</h3>
              <p className="text-sm text-white/80">
                Transform any content into effective study tools in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}