import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export function DashboardNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "/contact" }
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
              D
            </div>
            <span className={cn(
              "font-bold text-xl transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}>
              Dashboard
            </span>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href as any}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                  isScrolled ? "text-foreground" : "text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* CTA buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth">
              <Button 
                variant="ghost" 
                className={cn(
                  "transition-colors",
                  isScrolled 
                    ? "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800" 
                    : "text-white hover:bg-white/10"
                )}
              >
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className={cn(
                  "transition-colors",
                  isScrolled 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-white text-blue-600 hover:bg-blue-50"
                )}
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href as any}
                  className="text-foreground dark:text-white font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link href="/auth">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>
  )
}