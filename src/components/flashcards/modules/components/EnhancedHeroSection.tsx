import { ClientLink } from "@/components/ui/client-link"
import { Brain, Plus, Zap, BarChart2, Clock, Lightbulb, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EnhancedHeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full border-b border-blue-500 shadow-sm">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      {/* Main content container with max width */}
      <div className="relative px-6 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16 md:px-14 lg:pt-16 lg:pb-20 lg:px-16">
        <div className="max-w-[76rem] mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-white mb-4 backdrop-blur-sm">
            <Zap className="h-4 w-4 mr-2" />
            <span>Boost your learning with active recall</span>
          </div>
          
          {/* Main Hero Section */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white hero-title">
              Master Any Subject with Flashcards
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl">
              Create customized flashcard decks, study at your own pace, and track your progress. Our spaced repetition system helps you remember information for the long term.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <ClientLink
                href="/manage"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-white hover:bg-gray-50 text-blue-700 rounded-lg transition-colors text-base font-medium animate-pulse-subtle"
              >
                <Plus className="h-5 w-5" />
                Create New Deck
              </ClientLink>
              
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
                        How Flashcards Work
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Our flashcard system is designed to help you learn efficiently and retain information for the long term.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* Active Recall Section */}
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                          <Brain className="h-5 w-5" />
                          Active Recall
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Active recall is a learning principle that involves actively stimulating memory during the learning process. Instead of passively reviewing material, you test yourself to strengthen neural connections.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Flashcards force you to recall information from memory</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">This process strengthens memory pathways more effectively than re-reading</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Self-testing identifies knowledge gaps you need to focus on</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Spaced Repetition Section */}
                      <div className="bg-purple-50 dark:bg-purple-950/50 p-6 rounded-lg border border-purple-100 dark:border-purple-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                          <Clock className="h-5 w-5" />
                          Spaced Repetition
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Spaced repetition is a technique where review sessions are spaced over time, with difficult items appearing more frequently and easier items less often.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Our system schedules reviews at optimal intervals based on your performance</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Cards you find difficult appear more frequently</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">This approach maximizes learning efficiency and long-term retention</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Tracking Section */}
                      <div className="bg-green-50 dark:bg-green-950/50 p-6 rounded-lg border border-green-100 dark:border-green-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-green-700 dark:text-green-300 mb-3">
                          <BarChart2 className="h-5 w-5" />
                          Progress Tracking
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Our system tracks your performance and provides insights to help you focus your study efforts where they're most needed.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">View statistics on your overall progress and performance</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Identify challenging cards that require more attention</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Track your improvement over time to stay motivated</p>
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
                <h3 className="font-semibold text-white mb-1">Active Recall</h3>
                <p className="text-sm text-white/80">
                  Test yourself to strengthen memory connections and improve retention
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <Clock className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Spaced Repetition</h3>
                <p className="text-sm text-white/80">
                  Review cards at optimal intervals to maximize long-term memory
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <BarChart2 className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Progress Tracking</h3>
                <p className="text-sm text-white/80">
                  Monitor your learning progress and focus on challenging cards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}