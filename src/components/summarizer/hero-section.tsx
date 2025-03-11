import { Brain, Sparkles, Zap } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function HeroSection() {
  const features = [
    {
      icon: Brain,
      title: "Smart Analysis",
      description: "AI-powered content analysis for accurate summaries"
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Get summaries quickly with advanced AI technology"
    },
    {
      icon: Sparkles,
      title: "Multiple Formats",
      description: "Choose between bullet points, TL;DR, or Q&A formats"
    }
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      <div className="relative max-w-3xl mx-auto space-y-12">
        {/* Main Hero Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Content Summarizer
          </h1>
          <p className="text-xl text-white/80">
            Transform lengthy content into concise summaries using AI-powered technology
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
