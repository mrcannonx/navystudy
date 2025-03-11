import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Navy Resources | Calculators, Study Tools & References",
  description: "Access Navy advancement calculators, study tools, and reference materials to help you excel in your Navy career and advancement journey.",
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}