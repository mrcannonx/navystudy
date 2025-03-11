"use client"

import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">
              Last updated: February 15, 2024
            </p>
          </div>

          <Separator />

          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg leading-relaxed">
              Welcome to NAVY Study. By accessing or using our service, you agree to be bound by these Terms of Service.
              Please read these terms carefully before using our platform.
            </p>
          </section>

          {/* Account Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Account Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>To use our services, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 13 years of age</li>
                <li>Provide accurate and complete registration information</li>
                <li>Be responsible for maintaining the security of your account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Not share your account credentials with others</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Acceptable Use</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>When using our service, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Share inappropriate or offensive content</li>
                <li>Attempt to access unauthorized areas of the service</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use the service for any illegal purposes</li>
              </ul>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Content and Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The content and materials available through our service are protected by intellectual property laws.
                You may not copy, modify, distribute, or create derivative works without our permission.
              </p>
              <p>
                By submitting content to our platform, you grant us a non-exclusive, worldwide license to use,
                store, display, and distribute such content in connection with our service.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to suspend or terminate your access to our service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For violations of these terms</li>
                <li>For conduct that risks harm to other users</li>
                <li>For illegal activities</li>
                <li>At our sole discretion</li>
              </ul>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Disclaimer</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our service is provided "as is" without any warranties, express or implied.
                We do not guarantee that our service will be uninterrupted, secure, or error-free.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may modify these terms at any time. We will notify you of any material changes
                by posting the new terms on this site. Your continued use of the service after
                such changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
              <br />
              <a href="mailto:legal@navystudy.com" className="text-primary hover:underline">
                legal@navystudy.com
              </a>
            </p>
          </section>

          <Separator />

          {/* Footer */}
          <footer className="text-sm text-muted-foreground">
            <p>
              By using NAVY Study, you acknowledge that you have read and understood these terms
              and agree to be bound by them.
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
