import { Container } from "@/components/ui/container"
import { FileText, Brain, BarChart2 } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HowItWorksSectionProps {
  id?: string;
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  delay?: number;
}

function StepCard({ number, title, description, icon, isActive = false, delay = 0 }: StepCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div
      className={cn(
        "relative transition-all duration-500 ease-in-out transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        "group hover:shadow-lg dark:hover:shadow-blue-900/20 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
        isActive && "ring-2 ring-blue-500 dark:ring-blue-400"
      )}
    >
      <div className="absolute -top-5 left-6 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-md">
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{number}</span>
      </div>
      
      <div className="pt-6 pb-2">
        <div className="mb-4 text-blue-600 dark:text-blue-400 transition-transform duration-300 ease-in-out transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      <div className="h-1.5 w-0 group-hover:w-full bg-blue-500 dark:bg-blue-400 mt-4 transition-all duration-300 rounded-full"></div>
    </div>
  );
}

export function HowItWorksSection({ id }: HowItWorksSectionProps) {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section
      id={id}
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        backgroundImage: "url('/navy-grid-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 opacity-95"></div>
      
      <Container className="relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            How NAVY Study Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            A simple, effective process designed for busy Navy personnel
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <StepCard
            number={1}
            title="Upload Your Materials"
            description="Import your study materials or choose from our extensive library of Navy-specific content. Supports various formats including PDF, DOC, and TXT."
            icon={<FileText size={32} />}
            isActive={activeStep === 0}
            delay={100}
          />
          
          <StepCard
            number={2}
            title="AI Processes Content"
            description="Our advanced AI analyzes your materials and creates personalized quizzes, flashcards, and study guides tailored to your learning style."
            icon={<Brain size={32} />}
            isActive={activeStep === 1}
            delay={300}
          />
          
          <StepCard
            number={3}
            title="Study & Track Progress"
            description="Study with our adaptive tools and track your progress with detailed analytics. Identify strengths and focus on areas that need improvement."
            icon={<BarChart2 size={32} />}
            isActive={activeStep === 2}
            delay={500}
          />
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center space-x-2">
            <button
              onClick={() => setActiveStep(0)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeStep === 0 ? "bg-blue-600 dark:bg-blue-400 w-6" : "bg-slate-300 dark:bg-slate-600"
              )}
              aria-label="Step 1"
            />
            <button
              onClick={() => setActiveStep(1)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeStep === 1 ? "bg-blue-600 dark:bg-blue-400 w-6" : "bg-slate-300 dark:bg-slate-600"
              )}
              aria-label="Step 2"
            />
            <button
              onClick={() => setActiveStep(2)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeStep === 2 ? "bg-blue-600 dark:bg-blue-400 w-6" : "bg-slate-300 dark:bg-slate-600"
              )}
              aria-label="Step 3"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}