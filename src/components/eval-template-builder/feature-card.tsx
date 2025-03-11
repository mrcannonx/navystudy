"use client"

import { LucideIcon } from "lucide-react";
import React from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "blue" | "purple" | "green" | "orange";
}

export function FeatureCard({ icon: Icon, title, description, color = "blue" }: FeatureCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/15 transition-colors duration-300 shadow-md hover:shadow-lg">
      <div className="flex flex-col items-center text-center space-y-3">
        <Icon className="h-8 w-8" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}
