import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Study App",
  description: "An app to help you study effectively",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Study App",
    description: "An app to help you study effectively",
    siteName: "Study App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study App",
    description: "An app to help you study effectively",
  },
} 