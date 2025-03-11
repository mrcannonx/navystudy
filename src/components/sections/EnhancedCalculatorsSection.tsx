import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { 
  Award, 
  Calculator, 
  BarChart3, 
  TrendingUp, 
  ChevronRight,
  Medal
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"

export function EnhancedCalculatorsSection() {
  return (
    <section id="advancement-calculators" className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Advancement Calculators
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take the guesswork out of your advancement scores with our specialized calculators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* PMA Calculator Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="mt-4 text-2xl">PMA Calculator</CardTitle>
              <CardDescription className="text-base">
                Accurately calculate your Performance Mark Average from your evaluation data.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Official Navy evaluation formulas
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Accurate score calculations
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Save and track your progress
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Link href="/pma-calculator" className="w-full">
                <Button variant="outline" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                  Try PMA Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Award Points Calculator Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <Medal className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <CardTitle className="mt-4 text-2xl">Award Points Calculator</CardTitle>
              <CardDescription className="text-base">
                Determine your award points contribution to your final multiple score.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                  Calculate points for all award types
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                  Up-to-date with latest NAVADMIN guidance
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                  Maximize your advancement potential
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Link href="/award-points-calculator" className="w-full">
                <Button variant="outline" className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
                  Try Award Points Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* FMS Calculator Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-blue-100 dark:border-blue-900 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <CardTitle className="mt-4 text-2xl">FMS Calculator</CardTitle>
              <CardDescription className="text-base">
                Calculate your Final Multiple Score to estimate your advancement potential.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Comprehensive score breakdown
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Compare with historical cutoff scores
                </li>
                <li className="flex items-center text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Plan your advancement strategy
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Link href="/fms-calculator" className="w-full">
                <Button variant="outline" className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30">
                  Try FMS Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 md:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Precision Matters</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Our calculators use the official Navy formulas to ensure accuracy in your advancement planning. Take control of your career progression with tools designed specifically for Navy personnel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/resources">
                  <Button size="lg" className="w-full sm:w-auto">
                    Try All Calculators
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
                <Calculator className="h-24 w-24 text-blue-600 dark:text-blue-400 relative z-10" />
              </div>
              <div className="absolute top-0 right-0 -mr-4 -mt-4 bg-blue-100 dark:bg-blue-800 rounded-full p-3 shadow-lg">
                <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute bottom-0 left-0 -ml-4 -mb-4 bg-blue-100 dark:bg-blue-800 rounded-full p-3 shadow-lg">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}