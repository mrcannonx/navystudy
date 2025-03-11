"use client"

import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: February 15, 2024
            </p>
          </div>

          <Separator />

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg leading-relaxed">
              At NAVY Study, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our service.
            </p>
          </section>

          {/* Information Collection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (email, name)</li>
                <li>Study progress and performance data</li>
                <li>User preferences and settings</li>
                <li>Usage statistics and analytics</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">How We Use Your Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our services</li>
                <li>Personalize your learning experience</li>
                <li>Track your progress and generate statistics</li>
                <li>Send important updates about our service</li>
                <li>Analyze and improve our platform's performance</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Data Protection</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Secure data storage practices</li>
                <li>Limited access to personal information</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Your Rights</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of certain data collection</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@navystudy.com" className="text-primary hover:underline">
                privacy@navystudy.com
              </a>
            </p>
          </section>

          <Separator />

          {/* Footer */}
          <footer className="text-sm text-muted-foreground">
            <p>
              This privacy policy is subject to change. We will notify you of any changes by posting
              the new policy on this page.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
