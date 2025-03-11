import { Container } from "@/components/ui/container"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-transparent relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-fade" />
      </div>
      
      <Container>
        <div className="text-center mb-12 md:mb-16 animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Designed for Navy Personnel
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            See what your shipmates are saying about NAVY Study
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Testimonial 1 */}
          <div className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-600 dark:border-blue-500 shadow-sm">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">
                      JM
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Petty Officer Johnson</h4>
                    <p className="text-sm text-muted-foreground">IT1, USN</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-muted-foreground mb-4">
                  "NAVY Study helped me advance to First Class on my first attempt. The AI-generated quizzes were spot-on for the exam content."
                </blockquote>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    AI Quizzes
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    First Time Advancement
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial 2 */}
          <div className="group md:translate-y-4">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-600 dark:border-blue-500 shadow-sm">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">
                      SR
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Chief Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">HMC, USN</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-muted-foreground mb-4">
                  "The summarizer and flashcards made it easy to stay on track with my busy schedule. I recommend this to all my Sailors."
                </blockquote>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Summarizer
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Flashcards
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial 3 */}
          <div className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-blue-600 dark:border-blue-500 shadow-sm">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">
                      TW
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">Petty Officer Williams</h4>
                    <p className="text-sm text-muted-foreground">MA2, USN</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic text-muted-foreground mb-4">
                  "The military calculators helped me understand exactly what I needed to focus on. This platform is a game-changer for advancement."
                </blockquote>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Military Calculators
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Advancement Focus
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}