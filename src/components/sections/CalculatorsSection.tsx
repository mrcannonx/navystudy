import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Award, Calculator } from "lucide-react"

export function CalculatorsSection() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-transparent">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative hidden md:block order-last md:order-first">
            <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl bg-slate-100 dark:bg-slate-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <Calculator className="h-20 w-20 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-bold mb-4">Precision Matters</h3>
                  <p className="text-lg text-muted-foreground">
                    Our calculators use the official Navy formulas to ensure accuracy in your advancement planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Advancement Calculators
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the guesswork out of your advancement scores with our specialized calculators
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 mt-1">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">PMA Calculator</h3>
                  <p className="text-muted-foreground">
                    Accurately calculate your Performance Mark Average from your evaluation data.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 mt-1">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Award Points Calculator</h3>
                  <p className="text-muted-foreground">
                    Determine your award points contribution to your final multiple score.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 mt-1">
                  <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">FMS Calculator</h3>
                  <p className="text-muted-foreground">
                    Calculate your Final Multiple Score to estimate your advancement potential.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/resources">
                <Button size="lg">
                  Try Calculators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}