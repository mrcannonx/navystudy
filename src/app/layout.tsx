import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "react-day-picker/dist/style.css"
import "./globals.css"
import "../styles/us-theme.css"
import { RootLayoutClient } from "@/components/layout/root-layout-client"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NAVY Study - Study Smarter, Not Harder",
  description: "Enhance your learning with NAVY Study's advanced study tools and analytics.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
