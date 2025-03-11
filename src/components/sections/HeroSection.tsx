import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ArrowRight, CheckCircle, GraduationCap, Anchor } from "lucide-react"
import { routes } from "@/lib/routes"

interface HeroSectionProps {
  scrollToHowItWorks: () => void;
}

export function HeroSection({ scrollToHowItWorks }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-blue-600">
      {/* Grid overlay with enhanced animation */}
      <div className="absolute inset-0 bg-grid-white/10 animate-grid-fade opacity-30"></div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl"></div>
      
      {/* Radial gradient for enhanced effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 opacity-90"></div>
      
      <Container className="relative z-10 py-16 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-[fadeIn_0.8s_ease-in-out]">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-blue-300/30 px-4 py-1.5 text-sm font-medium bg-blue-700/50 backdrop-blur-sm">
              <span className="text-white">U.S. Navy Advancement Exam Preparation</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Study Smarter, <span className="text-blue-200">Advance Faster</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-[600px]">
              The AI-powered platform designed specifically for Navy personnel preparing for advancement exams. Transform how you study with intelligent tools built for success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={routes.auth}>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-300 shadow-lg hover:shadow-xl border-2 border-white hero-btn-primary"
                >
                  Get Started
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-blue-200 transition-colors duration-300 hero-btn-outline"
                onClick={scrollToHowItWorks}
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-blue-200" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-blue-200" />
                <span>Navy-Specific</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-1 h-4 w-4 text-blue-200" />
                <span>Personalized</span>
              </div>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-2xl">
              {/* Hero image */}
              <Image
                src="https://krfijvkfyngcofhnmfhe.supabase.co/storage/v1/object/public/homepage//homepagehero.png"
                alt="Navy advancement study platform"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </Container>
      
      {/* Wave effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            className="dark:fill-background"
          ></path>
        </svg>
      </div>
    </section>
  )
}