import { Brain, LineChart, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      <div className="relative max-w-3xl mx-auto space-y-12">
        {/* Main Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Interactive Quizzes
          </h1>
          <p className="text-xl text-white/80">
            Test your knowledge and track your progress with AI-generated quizzes
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="Smart Questions"
            description="AI-powered questions that adapt to your knowledge level"
          />
          <FeatureCard
            icon={<LineChart className="h-6 w-6" />}
            title="Progress Tracking"
            description="Monitor your performance with detailed analytics"
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Instant Feedback"
            description="Get detailed explanations and learn from your mistakes"
          />
        </div>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-white/20 rounded-lg">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-white/80">
          {description}
        </p>
      </div>
    </div>
  )
}
