"use client"

import { AwardPointsCalculatorClient } from "@/components/awards/award-points-calculator-client"
import { PageWithFooter } from "@/components/layout/page-with-footer"
import "./enhanced-styles.css"

export default function AwardPointsCalculatorPage() {
  return (
    <PageWithFooter>
      <AwardPointsCalculatorClient />
    </PageWithFooter>
  )
}
