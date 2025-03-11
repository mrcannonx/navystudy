import { ClientLink } from "@/components/ui/client-link"
import { Brain, FileText, Zap, BarChart2, Clock, Lightbulb, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EnhancedSummarizerHeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full border-b border-blue-500 shadow-sm">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      {/* Main content container with max width */}
      <div className="relative px-6 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16 md:px-14 lg:pt-16 lg:pb-20 lg:px-16">
        <div className="max-w-[76rem] mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-white mb-4 backdrop-blur-sm">
            <Zap className="h-4 w-4 mr-2" />
            <span>Transform lengthy content into concise summaries</span>
          </div>
          
          {/* Main Hero Section */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white hero-title">
              Content Summarizer
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl">
              Save time and extract key insights from any text with our AI-powered summarizer. Perfect for articles, research papers, and long documents.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-white hover:bg-gray-50 text-blue-700 rounded-lg transition-all duration-300 text-base font-medium animate-pulse-subtle hover:shadow-glow hover:scale-105"
                    >
                      <Brain className="h-5 w-5" />
                      How It Works
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        How Summarization Works
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Our summarization system uses advanced AI to extract the most important information from any text.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* AI Analysis Section */}
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                          <Brain className="h-5 w-5" />
                          AI-Powered Analysis
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Our AI system analyzes your text to identify key concepts, important facts, and main arguments, creating a concise summary that captures the essence of the original content.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Identifies main topics and key points</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Preserves critical information while removing redundancy</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Maintains the original meaning and context</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Multiple Formats Section */}
                      <div className="bg-purple-50 dark:bg-purple-950/50 p-6 rounded-lg border border-purple-100 dark:border-purple-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                          <FileText className="h-5 w-5" />
                          Multiple Summary Formats
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Choose from different summary formats to suit your specific needs and preferences.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Bullet Points: Quick, scannable key points</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">TL;DR: Brief paragraph summary of the main content</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Q&A: Key information presented in question-answer format</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Save & Organize Section */}
                      <div className="bg-green-50 dark:bg-green-950/50 p-6 rounded-lg border border-green-100 dark:border-green-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-green-700 dark:text-green-300 mb-3">
                          <BarChart2 className="h-5 w-5" />
                          Save & Organize
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Save your summaries for future reference and organize them for easy access.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Save summaries with custom titles</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Access your saved summaries anytime</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Edit and update summary titles as needed</p>
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
                <Brain className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Smart Analysis</h3>
                <p className="text-sm text-white/80">
                  AI-powered content analysis for accurate summaries
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <FileText className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Multiple Formats</h3>
                <p className="text-sm text-white/80">
                  Choose between bullet points, TL;DR, or Q&A formats
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <Zap className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Fast Processing</h3>
                <p className="text-sm text-white/80">
                  Get summaries quickly with advanced AI technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}