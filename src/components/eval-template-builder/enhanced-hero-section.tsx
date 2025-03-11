"use client"

import { FileText, Database, Zap, Star, ArrowRight, CheckCircle2, Lightbulb, FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EnhancedHeroSection() {
  const scrollToTemplates = () => {
    const templatesSection = document.getElementById('templates-section')
    if (templatesSection) {
      templatesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full border-b border-blue-500 shadow-sm">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      {/* Main content container with max width */}
      <div className="relative px-6 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16 md:px-14 lg:pt-16 lg:pb-20 lg:px-16">
        <div className="max-w-[76rem] mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-white mb-4 backdrop-blur-sm">
            <Zap className="h-4 w-4 mr-2" />
            <span>Create professional, impactful Navy evaluations</span>
          </div>
          
          {/* Main Hero Section */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white hero-title">
              Navy Evaluation Builder
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl">
              Build customized evaluations with AI-powered enhancements, pre-built metrics, and seamless brag sheet integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-white hover:bg-gray-50 text-blue-700 rounded-lg transition-colors text-base font-medium animate-pulse-subtle"
                onClick={scrollToTemplates}
              >
                <FileEdit className="h-5 w-5" />
                Create Evaluation
              </Button>
              
              <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-transparent hover:bg-blue-500/40 text-white border border-white/40 rounded-lg transition-all duration-300 text-base font-medium backdrop-blur-sm hover:border-white hover:shadow-glow hover:scale-105"
                    >
                      <Lightbulb className="h-5 w-5" />
                      How It Works
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        How the Evaluation Builder Works
                      </DialogTitle>
                      <DialogDescription className="text-base pt-2">
                        Our evaluation builder helps you create professional, impactful Navy evaluations with ease.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* Evaluation Creation Section */}
                      <div className="bg-blue-50 dark:bg-blue-950/50 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                          <FileText className="h-5 w-5" />
                          Evaluation Creation
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Create and save evaluations for different ranks and rates with customizable formats and sections.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Build evaluations for any rank or rate</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Customize sections and content to match requirements</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Save templates for future use and quick access</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics Library Section */}
                      <div className="bg-purple-50 dark:bg-purple-950/50 p-6 rounded-lg border border-purple-100 dark:border-purple-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                          <Database className="h-5 w-5" />
                          Metrics Library
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Access a comprehensive library of pre-built metrics for different evaluation sections.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Browse metrics organized by category and section</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Save custom metrics for future evaluations</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Quickly add relevant metrics to any evaluation section</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Enhancement Section */}
                      <div className="bg-green-50 dark:bg-green-950/50 p-6 rounded-lg border border-green-100 dark:border-green-900">
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-green-700 dark:text-green-300 mb-3">
                          <Zap className="h-5 w-5" />
                          AI Enhancement
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Improve your evaluation bullets with AI-powered suggestions and enhancements.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Get AI-generated improvement suggestions</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Enhance clarity and impact of evaluation bullets</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <p className="text-gray-700 dark:text-gray-300">Ensure proper formatting and Navy terminology</p>
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
          <div className="max-w-[76rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 px-6 pb-8 sm:px-10 sm:pb-10 md:pb-12 md:px-14 lg:pb-16 lg:px-16">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <FileText className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Evaluation Creation</h3>
                <p className="text-sm text-white/80">
                  Create and save evaluations for different ranks and rates
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <Database className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Metrics Library</h3>
                <p className="text-sm text-white/80">
                  Access pre-built metrics for different evaluation sections
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <Zap className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">AI Enhancement</h3>
                <p className="text-sm text-white/80">
                  Improve evaluation bullets with AI-powered suggestions
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                <Star className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Brag Sheet</h3>
                <p className="text-sm text-white/80">
                  Import accomplishments from your brag sheet directly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}