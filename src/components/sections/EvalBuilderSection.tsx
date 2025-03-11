import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { FileText, Database, Zap, FileEdit } from "lucide-react"

export function EvalBuilderSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Navy Evaluation Builder
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional, impactful evaluations with customizable templates and AI-powered enhancements
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 mt-1">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Customizable Templates</h3>
                  <p className="text-muted-foreground">
                    Build and save evaluation templates for different ranks and rates with customizable sections.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 mt-1">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Metrics Library</h3>
                  <p className="text-muted-foreground">
                    Access a comprehensive library of pre-built metrics for different evaluation sections.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 mt-1">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Enhancement</h3>
                  <p className="text-muted-foreground">
                    Improve your evaluation bullets with AI-powered suggestions and professional formatting.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/eval-template-builder">
                <Button size="lg">
                  Build Evaluations
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl bg-slate-100 dark:bg-slate-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <FileEdit className="h-20 w-20 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-bold mb-4">Professional Evaluations</h3>
                  <p className="text-lg text-muted-foreground">
                    Create impactful Navy evaluations with our specialized builder tool designed for career advancement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}