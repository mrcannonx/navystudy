import Link from "next/link"
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Medal, Shield } from "lucide-react"
import { Container } from "@/components/ui/container"

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-900">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">NAVY Study</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The AI-powered platform designed specifically for Navy personnel preparing for advancement exams.
              </p>
              <div className="flex space-x-3">
                <Link href={{ pathname: "#" }} className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link href={{ pathname: "#" }} className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link href={{ pathname: "#" }} className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link href={{ pathname: "#" }} className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={{ pathname: "/" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/quiz" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/flashcards" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Flashcards
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/resources" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/fms-calculator" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Calculators
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={{ pathname: "/privacy" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/terms" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href={{ pathname: "/contact" }} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    support@navystudy.com
                  </span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    +1 (619) 796-2008
                  </span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    30450 Haun Rd Ste 1199<br />
                    Menifee, CA 92584
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NAVY Study. All rights reserved.
            </p>
            
            <div className="flex items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700 shadow-sm mx-auto md:mx-0">
              <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-1 mr-2">
                <Medal className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Proud Veteran-Owned Business</span>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 md:mt-0">
              Designed for U.S. Navy personnel. Not an official U.S. Navy website.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
