"use client"

import { FMSCalculatorClient } from "@/components/fms/fms-calculator-client"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import "./enhanced-styles.css"

export default function FMSCalculatorPage() {
  return (
    <PageWithFooter>
      <FMSCalculatorClient />
    </PageWithFooter>
  )
}
