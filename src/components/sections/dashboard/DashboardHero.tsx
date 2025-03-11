import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ArrowRight, CheckCircle, ChevronRight, Play } from "lucide-react"
import { useState } from "react"

export function DashboardHero() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 min-h-[90vh] flex items-center">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-white/10 animate-grid-fade opacity-30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-blue-400/10 blur-2xl"></div>
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 via-blue-600/80 to-blue-800/90"></div>
      
      <Container className="relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-[fadeIn_0.8s_ease-in-out]">
            <div className="inline-flex items-center rounded-full border border-blue-300/30 px-4 py-1.5 text-sm font-medium bg-blue-700/50 backdrop-blur-sm">
              <span className="text-white">Next-Generation Dashboard Experience</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Visualize Your <span className="text-blue-200">Success</span> With Powerful Insights
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 max-w-[600px] leading-relaxed">
              Our intuitive dashboard transforms complex data into actionable insights, helping you make informed decisions faster and with greater confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-300 shadow-lg hover:shadow-xl border-2 border-white hero-btn-primary group"
                >
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 hover:border-blue-200 transition-colors duration-300 hero-btn-outline"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            
            <div className="pt-4 border-t border-blue-500/30">
              <div className="flex flex-wrap items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-200" />
                  <span>Real-time Analytics</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-200" />
                  <span>Customizable Widgets</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-200" />
                  <span>Data Visualization</span>
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="ml-4 text-sm text-blue-100">
                  <span className="font-semibold">1,000+</span> users already trust our dashboard
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="relative h-[600px] w-full overflow-hidden rounded-xl shadow-2xl group perspective">
              {/* Dashboard mockup with hover animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-blue-800/80 rounded-xl transform rotate-2 scale-[1.03] z-0"></div>
              <div className="relative h-full w-full rounded-xl overflow-hidden border border-blue-700/50 backdrop-blur-sm transform transition-all duration-500 ease-in-out group-hover:scale-[1.02] group-hover:-rotate-1 z-10">
                <Image
                  src="/navy-eval-builder-mockup.png"
                  alt="Dashboard interface showing analytics and data visualization"
                  fill
                  priority
                  className="object-cover object-center"
                />
                
                {/* Interactive elements overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent flex items-end">
                  <div className="p-6 w-full">
                    <div className="flex items-center justify-between">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white text-sm">
                        Interactive Demo
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => setIsVideoModalOpen(true)}
                      >
                        Explore Features
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements for visual interest */}
              <div className="absolute top-10 right-10 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg transform rotate-3 animate-subtle-pulse">
                <div className="w-16 h-8 bg-blue-500/50 rounded-md"></div>
              </div>
              <div className="absolute bottom-20 left-10 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg transform -rotate-2 animate-subtle-pulse" style={{ animationDelay: "1s" }}>
                <div className="w-20 h-10 bg-blue-500/50 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Video modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsVideoModalOpen(false)}>
          <div className="relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden max-w-4xl w-full max-h-[80vh] aspect-video" onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-black/20 hover:bg-black/40 text-white" 
                onClick={() => setIsVideoModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </Button>
            </div>
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dashboard Demo Video</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Experience our dashboard in action</p>
                <Button className="bg-blue-600 hover:bg-blue-700">Play Demo</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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