import { Container } from "@/components/ui/container"
import { Brain, BarChart4, FileText, FileEdit, BookOpen, Calculator, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"
import { routes } from "@/lib/routes"

// Feature card component with hover effects and animations
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
  link?: string
}

function FeatureCard({ icon, title, description, delay, link }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className={cn(
        "relative bg-white dark:bg-slate-900/80 rounded-xl p-8 shadow-sm",
        "transition-all duration-300 ease-in-out",
        "border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50",
        "hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30",
        "group backdrop-blur-sm",
        "animate-fadeIn"
      )}
      style={{ animationDelay: `${delay * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* No decorative elements in the corner as requested */}
      
      {/* Decorative gradient background that appears on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent dark:from-blue-950/30 dark:to-transparent",
        "rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
      )} />
      
      {/* Icon with animated background */}
      <div className={cn(
        "h-14 w-14 rounded-lg flex items-center justify-center mb-6",
        "bg-blue-100 dark:bg-blue-900/50",
        "transition-all duration-300",
        isHovered ? "scale-110 shadow-md shadow-blue-200/50 dark:shadow-blue-900/30 animate-subtle-pulse" : ""
      )}>
        <div className="text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>
      
      {/* Title with hover effect */}
      <h3 className={cn(
        "text-xl font-bold mb-3",
        "group-hover:text-blue-700 dark:group-hover:text-blue-400",
        "transition-colors duration-300"
      )}>
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground dark:text-slate-400 leading-relaxed">
        {description}
      </p>
      
      {/* "Learn more" links have been removed as requested */}
    </div>
  )
}

export function FeaturesSection() {
  // Features data array for easy maintenance
  const features = [
    {
      icon: <Brain className="h-7 w-7" />,
      title: "AI-Powered Quiz Generation",
      description: "Convert your study material into interactive quizzes using advanced AI technology that identifies key concepts."
    },
    {
      icon: <BarChart4 className="h-7 w-7" />,
      title: "Smart Flashcards",
      description: "Create and study with digital flashcards that adapt to your learning pace and focus on areas where you need improvement."
    },
    {
      icon: <FileText className="h-7 w-7" />,
      title: "Content Summarizer",
      description: "Transform lengthy study materials into concise, easy-to-understand summaries with our AI-powered summarization tool."
    },
    {
      icon: <FileEdit className="h-7 w-7" />,
      title: "Evaluation Builder",
      description: "Create professional, impactful Navy evaluations with customizable templates and AI-powered enhancements."
    },
    {
      icon: <Calculator className="h-7 w-7" />,
      title: "Advancement Calculators",
      description: "Accurately calculate your PMA, Award Points, and Final Multiple Score with our specialized advancement calculators."
    },
    {
      icon: <LayoutDashboard className="h-7 w-7" />,
      title: "Interactive Dashboard",
      description: "Experience our powerful analytics dashboard that transforms complex data into actionable insights for better decision-making.",
      link: routes.dashboardLanding
    }
  ]

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background pattern with parallax effect */}
      <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-[url('/navy-grid-pattern.svg')] bg-repeat transform-gpu motion-safe:animate-[slowFloat_30s_ease-in-out_infinite]" />
      </div>
      
      <Container>
        {/* Section header with animation */}
        <div className="text-center mb-16 animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <div className="inline-flex items-center justify-center mb-3">
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 mr-3"></div>
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
              All-in-one platform
            </span>
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 ml-3"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-600">
            Powerful Features for Navy Advancement
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
            Everything you need to excel in your advancement exam, all in one platform
          </p>
          
          {/* Decorative dots */}
          <div className="flex items-center justify-center mt-8 space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-300 dark:bg-blue-700"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-500"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400 dark:bg-blue-600"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-300 dark:bg-blue-700"></div>
          </div>
        </div>
        
        {/* Features grid with responsive layout and staggered animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Decorative background element */}
          <div className="absolute -z-10 w-full h-full">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-blue-50/50 dark:bg-blue-950/20 blur-3xl opacity-70"></div>
          </div>
          
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index + 2}
              link={feature.link}
            />
          ))}
        </div>
        
        {/* Enhanced CTA section */}
        <div className="mt-20 text-center animate-fadeIn relative" style={{ animationDelay: "800ms" }}>
          {/* Decorative background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:from-transparent dark:via-blue-950/10 dark:to-transparent rounded-3xl"></div>
          
          <div className="py-10 px-6 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to advance your Navy career?</h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Be among the first to accelerate your advancement with our comprehensive tools.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:translate-y-[-2px]"
                aria-label="Get started with Navy advancement tools"
              >
                Get Started
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              
              <a
                href="/resources"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-white/80 dark:bg-slate-900/80 text-blue-700 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 backdrop-blur-sm"
                aria-label="Explore resources"
              >
                Explore Resources
              </a>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground flex items-center justify-center">
              <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              To get started is easy • Free trial available
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}