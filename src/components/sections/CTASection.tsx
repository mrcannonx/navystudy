import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import { BadgeCheck, ChevronRight, Star, Users } from "lucide-react"

interface CTASectionProps {
  user: User | null;
  scrollToHowItWorks: () => void;
}

export function CTASection({ user, scrollToHowItWorks }: CTASectionProps) {
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
      
      <Container>
        <div className="relative z-10 text-center max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm">
              <BadgeCheck className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Trusted by thousands of sailors</span>
            </div>
            
            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
            >
              Ready to Advance Your Career?
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-[700px] mx-auto leading-relaxed">
              Join thousands of Navy personnel who are using NAVY Study to prepare for advancement exams
            </p>
            
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/manage" className="group">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-base px-8 py-6 h-auto"
                  >
                    <span>Create Study Material</span>
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth" className="group">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-600 hover:bg-blue-50 border-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-base px-8 py-6 h-auto"
                  >
                    <span>Create Free Account</span>
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              
              <Button
                variant="ghost"
                onClick={scrollToHowItWorks}
                className="text-blue-100 hover:text-white hover:bg-blue-500/20 border border-blue-400/30 w-full sm:w-auto text-base px-8 py-6 h-auto"
              >
                Learn How It Works
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}