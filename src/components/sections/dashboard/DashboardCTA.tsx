import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { BadgeCheck, ChevronRight, Star, Users } from "lucide-react"

export function DashboardCTA() {
  return (
    <section
      className="relative py-20 md:py-28 bg-blue-600 dark:bg-blue-900 text-white overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/navy-grid-pattern.svg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          priority={false}
        />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/20 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-500/20 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      
      <Container>
        <div className="relative z-10 max-w-[900px] mx-auto">
          <div className="text-center animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm">
              <BadgeCheck className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Start your free 14-day trial today</span>
            </div>
            
            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              Transform Your Data Into <span className="text-blue-200">Actionable Insights</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-[700px] mx-auto leading-relaxed">
              Join thousands of businesses that use our dashboard to make better decisions
            </p>
            
            {/* Trial form */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-xl max-w-3xl mx-auto mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2 text-left">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-blue-300/30 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  />
                </div>
                <Button 
                  className="bg-white text-blue-700 hover:bg-blue-50 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base"
                >
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-blue-200 mt-3 text-center md:text-left">
                No credit card required. Cancel anytime.
              </p>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-blue-100">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>10,000+ Active Users</span>
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-300" />
                  ))}
                </div>
                <span>4.9/5 Rating</span>
              </div>
            </div>
            
            {/* Trusted by logos */}
            <div className="mt-12">
              <p className="text-sm text-blue-200 mb-6">TRUSTED BY INNOVATIVE COMPANIES</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-70">
                {/* These would normally be actual company logos */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 w-24 bg-white/20 rounded-md"></div>
                ))}
              </div>
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