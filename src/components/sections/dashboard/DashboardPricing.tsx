import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import Link from "next/link"

interface PricingTierProps {
  name: string
  price: string
  description: string
  features: Array<{ included: boolean; text: string }>
  highlighted?: boolean
  ctaText: string
  ctaLink: string
  delay: number
}

function PricingTier({ 
  name, 
  price, 
  description, 
  features, 
  highlighted = false, 
  ctaText, 
  ctaLink,
  delay 
}: PricingTierProps) {
  return (
    <div 
      className={cn(
        "rounded-xl p-8 transition-all duration-300 animate-fadeIn",
        "border shadow-sm",
        highlighted 
          ? "bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/30 dark:to-slate-900 border-blue-200 dark:border-blue-800 shadow-blue-100/50 dark:shadow-blue-900/20 scale-105 z-10" 
          : "bg-white dark:bg-slate-900/80 border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/50"
      )}
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
          Most Popular
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className={cn(
          "text-xl font-bold mb-2",
          highlighted ? "text-blue-700 dark:text-blue-400" : "text-foreground"
        )}>
          {name}
        </h3>
        <div className="text-3xl font-bold mb-2">{price}</div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            {feature.included ? (
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
            )}
            <span className={cn(
              "text-sm",
              feature.included ? "text-foreground" : "text-muted-foreground"
            )}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
      
      <Link href={ctaLink as any}>
        <Button 
          className={cn(
            "w-full",
            highlighted 
              ? "bg-blue-600 hover:bg-blue-700 text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
          )}
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  )
}

export function DashboardPricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  
  const pricingTiers = [
    {
      name: "Starter",
      price: billingPeriod === 'monthly' ? "$29/month" : "$290/year",
      description: "Perfect for individuals and small teams",
      features: [
        { included: true, text: "Basic dashboard features" },
        { included: true, text: "Up to 5 custom widgets" },
        { included: true, text: "Data export (CSV)" },
        { included: true, text: "7-day data history" },
        { included: false, text: "Advanced analytics" },
        { included: false, text: "Custom branding" },
        { included: false, text: "API access" },
        { included: false, text: "Dedicated support" }
      ],
      ctaText: "Get Started",
      ctaLink: "/signup?plan=starter"
    },
    {
      name: "Professional",
      price: billingPeriod === 'monthly' ? "$79/month" : "$790/year",
      description: "Ideal for growing businesses",
      features: [
        { included: true, text: "All Starter features" },
        { included: true, text: "Unlimited custom widgets" },
        { included: true, text: "Data export (CSV, Excel, PDF)" },
        { included: true, text: "30-day data history" },
        { included: true, text: "Advanced analytics" },
        { included: true, text: "Custom branding" },
        { included: false, text: "API access" },
        { included: false, text: "Dedicated support" }
      ],
      highlighted: true,
      ctaText: "Start Free Trial",
      ctaLink: "/signup?plan=professional&trial=true"
    },
    {
      name: "Enterprise",
      price: billingPeriod === 'monthly' ? "$199/month" : "$1,990/year",
      description: "For organizations with advanced needs",
      features: [
        { included: true, text: "All Professional features" },
        { included: true, text: "Unlimited custom widgets" },
        { included: true, text: "Data export (all formats)" },
        { included: true, text: "Unlimited data history" },
        { included: true, text: "Advanced analytics" },
        { included: true, text: "Custom branding" },
        { included: true, text: "API access" },
        { included: true, text: "Dedicated support" }
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact?inquiry=enterprise"
    }
  ]

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" id="pricing">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/10 dark:to-transparent -z-10"></div>
      
      <Container>
        {/* Section header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 mr-3"></div>
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30">
              Pricing Plans
            </span>
            <div className="h-px w-8 bg-blue-300 dark:bg-blue-700 ml-3"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-600">
            Choose the Perfect Plan for Your Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed mb-10">
            Flexible pricing options designed to scale with your business
          </p>
          
          {/* Billing period toggle */}
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-12">
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                billingPeriod === 'monthly'
                  ? "bg-white dark:bg-gray-700 shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                billingPeriod === 'annual'
                  ? "bg-white dark:bg-gray-700 shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setBillingPeriod('annual')}
            >
              Annual <span className="text-green-600 dark:text-green-400 font-normal">Save 20%</span>
            </button>
          </div>
        </div>
        
        {/* Pricing tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              highlighted={tier.highlighted}
              ctaText={tier.ctaText}
              ctaLink={tier.ctaLink}
              delay={index + 2}
            />
          ))}
        </div>
        
        {/* FAQ teaser */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">
            Have questions about our pricing or features?
          </p>
          <Link href="/contact">
            <Button variant="outline" className="border-blue-200 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700/50">
              Contact Our Sales Team
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}