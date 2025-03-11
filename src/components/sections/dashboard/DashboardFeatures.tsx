import { Container } from "@/components/ui/container"
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  LayoutDashboard, 
  Bell, 
  Zap, 
  Gauge, 
  Users, 
  Sliders 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Image from "next/image"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
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
    </div>
  )
}

export function DashboardFeatures() {
  // Features data array for easy maintenance
  const features = [
    {
      icon: <LayoutDashboard className="h-7 w-7" />,
      title: "Customizable Dashboard",
      description: "Personalize your dashboard with drag-and-drop widgets to focus on the metrics that matter most to your business."
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Advanced Analytics",
      description: "Gain deep insights with comprehensive analytics tools that transform complex data into clear, actionable information."
    },
    {
      icon: <LineChart className="h-7 w-7" />,
      title: "Real-time Monitoring",
      description: "Track performance metrics in real-time with live updates and instant notifications about important changes."
    },
    {
      icon: <PieChart className="h-7 w-7" />,
      title: "Visual Data Reports",
      description: "Create beautiful, informative visualizations that make complex data easy to understand and present."
    },
    {
      icon: <Bell className="h-7 w-7" />,
      title: "Smart Notifications",
      description: "Stay informed with intelligent alerts that notify you of significant changes or when metrics reach important thresholds."
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Performance Optimization",
      description: "Identify bottlenecks and opportunities for improvement with our performance analysis tools."
    }
  ]

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
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
              Powerful Features
            </span>
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 ml-3"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-600">
            Everything You Need in One Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
            Our comprehensive dashboard solution provides all the tools you need to monitor, analyze, and optimize your performance
          </p>
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
            />
          ))}
        </div>
        
        {/* Interactive dashboard showcase */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl -z-10 blur-xl opacity-70"></div>
          
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-blue-100 dark:border-blue-800/30 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
                  <Gauge className="w-4 h-4 mr-2" />
                  <span>Interactive Dashboard</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold">Powerful Analytics at Your Fingertips</h3>
                
                <p className="text-muted-foreground dark:text-slate-400">
                  Our intuitive dashboard puts the power of advanced analytics in your hands with an easy-to-use interface. Customize your view, drill down into data, and gain insights that drive better decision-making.
                </p>
                
                <ul className="space-y-3">
                  {[
                    { icon: <Users className="h-5 w-5" />, text: "User behavior tracking and analysis" },
                    { icon: <Sliders className="h-5 w-5" />, text: "Customizable widgets and layouts" },
                    { icon: <LineChart className="h-5 w-5" />, text: "Performance trend visualization" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mt-0.5">
                        {item.icon}
                      </div>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-blue-200/50 dark:border-blue-800/30">
                  {/* Dashboard screenshot */}
                  <div className="aspect-[16/10] relative">
                    <Image
                      src="/evalbuilder.jpg"
                      alt="Interactive dashboard interface"
                      fill
                      className="object-cover"
                    />
                    
                    {/* Animated overlay elements */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg animate-subtle-pulse">
                      <div className="w-24 h-12 bg-blue-500/20 dark:bg-blue-500/30 rounded-md"></div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg animate-subtle-pulse" style={{ animationDelay: "1s" }}>
                      <div className="w-32 h-8 bg-blue-500/20 dark:bg-blue-500/30 rounded-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-200/30 dark:bg-indigo-800/20 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}