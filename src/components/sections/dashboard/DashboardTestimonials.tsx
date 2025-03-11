import { Container } from "@/components/ui/container"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  rating: number
  image: string
  delay: number
}

function TestimonialCard({ quote, author, role, company, rating, image, delay }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900/80 rounded-xl p-8 shadow-sm",
        "transition-all duration-300 ease-in-out",
        "border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50",
        "hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/30",
        "group backdrop-blur-sm relative",
        "animate-fadeIn"
      )}
      style={{ animationDelay: `${delay * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative quote icon */}
      <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
        <Quote className="h-5 w-5" />
      </div>
      
      {/* Decorative gradient background that appears on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent dark:from-blue-950/30 dark:to-transparent",
        "rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
      )} />
      
      {/* Star rating */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "h-5 w-5 mr-1", 
              i < rating 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300 dark:text-gray-600"
            )} 
          />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-muted-foreground dark:text-slate-400 mb-6 leading-relaxed">
        "{quote}"
      </p>
      
      {/* Author info */}
      <div className="flex items-center">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-blue-100 dark:border-blue-900/50">
          <Image
            src={image}
            alt={author}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              isHovered ? "scale-110" : ""
            )}
            onError={(e) => {
              // Fallback to a default avatar if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "/evalbuilder.jpg";
            }}
          />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{author}</h4>
          <p className="text-sm text-muted-foreground">
            {role}, {company}
          </p>
        </div>
      </div>
    </div>
  )
}

export function DashboardTestimonials() {
  // Testimonials data
  const testimonials = [
    {
      quote: "This dashboard has completely transformed how we analyze our data. The visualizations are intuitive and the insights have directly contributed to a 27% increase in our efficiency.",
      author: "Sarah Johnson",
      role: "Operations Director",
      company: "TechCorp",
      rating: 5,
      image: "/navy-eval-builder-mockup.png"
    },
    {
      quote: "I've used many analytics platforms before, but this dashboard stands out with its ease of use and powerful features. It's become an essential tool for our decision-making process.",
      author: "Michael Chen",
      role: "Data Analyst",
      company: "DataDrive Inc.",
      rating: 5,
      image: "/hero-navy-study.jpg"
    },
    {
      quote: "The customizable widgets and real-time updates have made a huge difference in how quickly we can respond to changes. Our team is more agile than ever before.",
      author: "Jessica Williams",
      role: "Product Manager",
      company: "Innovate Solutions",
      rating: 4,
      image: "/evalbuilder.jpg"
    }
  ]

  return (
    <section id="testimonials" className="py-20 md:py-28 relative overflow-hidden bg-blue-50/50 dark:bg-blue-950/10">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>
      
      <Container>
        {/* Section header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 mr-3"></div>
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
              Testimonials
            </span>
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 ml-3"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-600">
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
            Discover how our dashboard solution has helped professionals across industries improve their analytics and decision-making
          </p>
        </div>
        
        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              rating={testimonial.rating}
              image={testimonial.image}
              delay={index + 2}
            />
          ))}
        </div>
        
        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: "98%", label: "Customer Satisfaction" },
            { value: "10,000+", label: "Active Users" },
            { value: "27%", label: "Average Efficiency Increase" }
          ].map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 border border-blue-100 dark:border-blue-800/30 shadow-sm animate-fadeIn"
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}