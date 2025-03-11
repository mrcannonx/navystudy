import { Brain, LineChart, Sparkles } from "lucide-react"

export function HeroSection() {
    return (
        <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-24 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
            </div>
            
            <div className="relative max-w-3xl mx-auto">
                <div className="text-center space-y-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                            Master Any Topic with Flashcards
                        </h1>
                        <p className="text-xl text-white/80">
                            Create, study, and track your progress with our intelligent flashcard system. 
                            Perfect for memorization, language learning, and exam preparation.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
                        <FeatureCard
                            icon={<Brain />}
                            title="Smart Learning"
                            description="Adaptive algorithms adjust to your performance for optimal learning"
                        />
                        <FeatureCard
                            icon={<LineChart />}
                            title="Track Progress"
                            description="Monitor your learning journey with detailed statistics and insights"
                        />
                        <FeatureCard
                            icon={<Sparkles />}
                            title="Multiple Formats"
                            description="Support for basic and cloze cards to enhance learning"
                        />
                    </div>
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
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-6 w-6 text-white/80">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-white/80">
                {description}
            </p>
        </div>
    )
}
