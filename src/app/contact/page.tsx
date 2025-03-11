"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-blue-600">
      <div className="container relative py-20">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:60px_60px] motion-safe:animate-grid-fade" />
        
        <div className="relative">
          {/* Main Content */}
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center text-white mb-12">
              <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
              <p className="text-xl text-white/80">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <form className="space-y-8">
                {/* Name Fields */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-neutral-800">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="h-12 bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-neutral-800">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="h-12 bg-neutral-50 border-neutral-200"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-800">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-neutral-800">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 555-5555"
                      className="h-12 bg-neutral-50 border-neutral-200"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-neutral-800">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    className="min-h-[150px] bg-neutral-50 border-neutral-200 resize-none"
                  />
                </div>

                {/* Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" className="border-neutral-300" />
                  <Label htmlFor="notifications" className="text-sm text-neutral-600">
                    I'd like to receive updates and notifications
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </Button>
              </form>

              {/* Address Section */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Address Column */}
                  <div className="flex items-start space-x-2 text-neutral-600">
                    <MapPin className="w-5 h-5 mt-0.5 text-blue-600 shrink-0" />
                    <div className="text-sm">
                      <p>30450 Haun Road #1199</p>
                      <p>Menifee, CA 92584</p>
                      <p>United States</p>
                    </div>
                  </div>

                  {/* Phone Column */}
                  <div className="flex items-start space-x-2 text-neutral-600">
                    <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <a href="tel:619-796-2008" className="text-sm hover:text-blue-600 transition-colors">
                        619-796-2008
                      </a>
                    </div>
                  </div>

                  {/* Hours Column */}
                  <div className="flex items-start space-x-2 text-neutral-600">
                    <Clock className="w-5 h-5 mt-0.5 text-blue-600 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Office Hours</p>
                      <p>Monday - Friday</p>
                      <p>9:00 AM - 5:00 PM</p>
                      <p className="text-neutral-500">Closed on weekends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 