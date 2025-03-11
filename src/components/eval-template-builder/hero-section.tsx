"use client"

import { FileText, Database, Zap, Star, ArrowRight } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const features = [
    {
      icon: FileText,
      title: "Evaluation Creation",
      description: "Create and save evaluations for different ranks and rates",
      color: "blue" as const
    },
    {
      icon: Database,
      title: "Metrics Library",
      description: "Access pre-built metrics for different evaluation sections",
      color: "purple" as const
    },
    {
      icon: Zap,
      title: "AI Enhancement",
      description: "Improve evaluation bullets with AI-powered suggestions",
      color: "green" as const
    },
    {
      icon: Star,
      title: "Brag Sheet",
      description: "Import accomplishments from your brag sheet directly into evaluations",
      color: "orange" as const
    }
  ];

  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl px-8 py-16 mb-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] motion-safe:animate-grid-fade" />
      
      <div className="relative max-w-5xl mx-auto space-y-10">
        {/* Main Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Navy Evaluation Builder
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Create professional, impactful Navy evaluations with customizable formats and AI-powered enhancements
          </p>
          <div>
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              onClick={() => {
                // Scroll to the templates section
                const templatesSection = document.getElementById('templates-section');
                if (templatesSection) {
                  templatesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
