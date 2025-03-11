"use client"

import Link from "next/link"
import "./enhanced-styles.css"
import { Calculator, Medal, Scale, FileText, Book, Lightbulb, CheckCircle2, ArrowRight, BookOpen, GraduationCap, Award, BarChart3 } from "lucide-react"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Container } from "@/components/ui/container"

export default function ResourcesPage() {
  return (
    <PageWithFooter>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 w-full border-b border-blue-500 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
        
        {/* Main content container with max width */}
        <div className="relative px-6 pt-8 pb-10 sm:px-10 sm:pt-10 sm:pb-12 md:pt-12 md:pb-16 md:px-14 lg:pt-16 lg:pb-20 lg:px-16">
          <div className="max-w-[76rem] mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/30 text-white mb-4 backdrop-blur-sm">
              <Book className="h-4 w-4 mr-2" />
              <span>Tools and resources for Navy advancement</span>
            </div>
            
            {/* Main Hero Section */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white hero-title">
                Navy Resources
              </h1>
              
              <p className="text-xl text-white/90 max-w-2xl">
                Access calculators, study tools, and reference materials to help you excel in your Navy career and advancement.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="#calculators">
                  <Button
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-white hover:bg-gray-50 text-blue-700 rounded-lg transition-colors text-base font-medium animate-pulse-subtle"
                  >
                    <Calculator className="h-5 w-5" />
                    Explore Calculators
                  </Button>
                </Link>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 bg-transparent hover:bg-blue-500/40 text-white border border-white/40 rounded-lg transition-all duration-300 text-base font-medium backdrop-blur-sm hover:border-white hover:shadow-glow hover:scale-105"
                    >
                      <Lightbulb className="h-5 w-5" />
                      How to Use
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                          <Lightbulb className="h-6 w-6 text-yellow-500" />
                          How to Use Navy Resources
                        </DialogTitle>
                        <DialogDescription className="text-base pt-2">
                          Our resources are designed to help you excel in your Navy career and advancement journey.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="mt-6 space-y-6">
                        {/* Calculators Section */}
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-6 rounded-lg border border-blue-100 dark:border-blue-900">
                          <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3">
                            <Calculator className="h-5 w-5" />
                            Advancement Calculators
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Use our calculators to track your advancement metrics and understand your standing.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Calculate your Performance Mark Average (PMA)</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Determine your award points for advancement</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Calculate your Final Multiple Score (FMS)</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Study Tools Section */}
                        <div className="bg-purple-50 dark:bg-purple-950/50 p-6 rounded-lg border border-purple-100 dark:border-purple-900">
                          <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-700 dark:text-purple-300 mb-3">
                            <BookOpen className="h-5 w-5" />
                            Study Tools
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Access comprehensive study tools to prepare for advancement exams and qualifications.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Practice with flashcards tailored to your rating</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Take quizzes to test your knowledge</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Track your progress and identify areas for improvement</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Reference Materials Section */}
                        <div className="bg-green-50 dark:bg-green-950/50 p-6 rounded-lg border border-green-100 dark:border-green-900">
                          <h3 className="flex items-center gap-2 text-xl font-semibold text-green-700 dark:text-green-300 mb-3">
                            <FileText className="h-5 w-5" />
                            Reference Materials
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Access important Navy documents and references to stay informed.
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">View the latest NAVADMINs and policy updates</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Access evaluation and career development resources</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                              <p className="text-gray-700 dark:text-gray-300">Find templates and guides for Navy documentation</p>
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
                  <Calculator className="h-5 w-5 icon-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Advancement Calculators</h3>
                  <p className="text-sm text-white/80">
                    Track your metrics for Navy advancement
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                  <BookOpen className="h-5 w-5 icon-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Study Tools</h3>
                  <p className="text-sm text-white/80">
                    Prepare for exams with flashcards and quizzes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                  <FileText className="h-5 w-5 icon-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Reference Materials</h3>
                  <p className="text-sm text-white/80">
                    Access important Navy documents and references
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/30 text-white shadow-sm backdrop-blur-sm">
                  <GraduationCap className="h-5 w-5 icon-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Career Development</h3>
                  <p className="text-sm text-white/80">
                    Tools to help you advance in your Navy career
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>

      <div className="py-6">
        <Container>
          <div className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="w-full max-w-[1400px] mx-auto mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6 fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                      <Book className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Navy Resources</h1>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Tools and references to help you excel in your Navy career
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculators Section */}
            <section id="calculators" className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6 slide-in">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm">
                  <Calculator className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Advancement Calculators</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Link
                  href="/pma-calculator"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card calculator-card
                            hover:border-primary/20 hover:bg-primary/5 hover:shadow-md fade-in"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary 
                                      group-hover:bg-primary/20 transition-colors">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">PMA Calculator</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Calculate your Performance Mark Average based on your evaluations.
                        Track and compute your PMA scores for advancement purposes.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                      Calculate PMA
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/award-points-calculator"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card calculator-card
                            hover:border-primary/20 hover:bg-primary/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary 
                                      group-hover:bg-primary/20 transition-colors">
                          <Award className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Award Points Calculator</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Calculate your award points based on decorations and service awards.
                        Track points for E4/5 and E6 candidates.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                      Calculate Award Points
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/fms-calculator"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card calculator-card
                            hover:border-primary/20 hover:bg-primary/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary 
                                      group-hover:bg-primary/20 transition-colors">
                          <Scale className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">FMS Calculator</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Calculate your Final Multiple Score using the "Whole Person Concept" 
                        for advancement selection.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                      Calculate FMS
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Study Tools Section */}
            <section id="study-tools" className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6 slide-in">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 shadow-sm">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Study Tools</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Link
                  href="/flashcards"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card study-card
                            hover:border-purple-500/20 hover:bg-purple-500/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-500/10 p-2 text-purple-500 
                                      group-hover:bg-purple-500/20 transition-colors">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Flashcards</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Study with flashcards tailored to your rating and advancement exam.
                        Track your progress and focus on areas that need improvement.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-purple-500 group-hover:translate-x-1 transition-transform">
                      Study Flashcards
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/quiz"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card study-card
                            hover:border-purple-500/20 hover:bg-purple-500/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-500/10 p-2 text-purple-500 
                                      group-hover:bg-purple-500/20 transition-colors">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Quizzes</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Test your knowledge with quizzes designed to prepare you for advancement exams.
                        Practice with real exam-style questions.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-purple-500 group-hover:translate-x-1 transition-transform">
                      Take Quizzes
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/summarizer"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card study-card
                            hover:border-purple-500/20 hover:bg-purple-500/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-500/10 p-2 text-purple-500 
                                      group-hover:bg-purple-500/20 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Content Summarizer</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Summarize complex Navy instructions and publications to focus on key points.
                        Create study notes from official documentation.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-purple-500 group-hover:translate-x-1 transition-transform">
                      Summarize Content
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Career Tools Section */}
            <section id="career-tools" className="mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6 slide-in">
                <div className="p-3 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Career Tools</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Link
                  href="/eval-template-builder"
                  className="group relative rounded-lg border border-border bg-card p-6
                            transition-all duration-200 ease-in-out resource-card career-card
                            hover:border-green-500/20 hover:bg-green-500/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-500/10 p-2 text-green-500 
                                      group-hover:bg-green-500/20 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Evaluation Builder</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        Create professional, impactful Navy evaluations with customizable formats, 
                        AI-powered enhancements, and brag sheet integration.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-500 group-hover:translate-x-1 transition-transform">
                      Build Evaluations
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>


                <div className="group relative rounded-lg border border-border bg-card p-6
                          transition-all duration-200 ease-in-out resource-card career-card
                          hover:border-green-500/20 hover:bg-green-500/5 hover:shadow-md fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-500/10 p-2 text-green-500 
                                      group-hover:bg-green-500/20 transition-colors">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Coming Soon</h3>
                      </div>
                      <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        More career tools are in development to help you excel in your Navy career.
                        Check back soon for updates.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-green-500 group-hover:translate-x-1 transition-transform">
                      Stay Tuned
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </PageWithFooter>
  )
}
