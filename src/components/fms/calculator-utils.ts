import { FMSFormData, PointBreakdown } from "./types"
import { E5_E6_CYCLE_OPTIONS, E7_CYCLE_OPTIONS } from "./constants"

/**
 * Calculate service in paygrade points based on NAVADMIN 312/18
 * For E5, SIPG = SIPG/5, max 2 points
 * For E6, SIPG = SIPG/5, max 3 points
 * For E7, no SIPG points
 */
export const calculateServicePoints = (years: number, months: number, paygrade: string): number => {
  const totalYears = years + months/12
  
  if (paygrade === "E5") {
    return Math.min(2, totalYears / 5)
  } else if (paygrade === "E6") {
    return Math.min(3, totalYears / 5)
  } else {
    return 0
  }
}

/**
 * Calculate award points based on paygrade per NAVADMIN 312/18
 * E4/E5: Max 10 points
 * E6: Max 12 points
 * E7: Not included in FMS calculation
 */
export const calculateAwardPoints = (awards: number, paygrade: string): number => {
  if (paygrade === "E5" || paygrade === "E4") {
    return Math.min(10, awards)
  } else if (paygrade === "E6") {
    return Math.min(12, awards)
  } else if (paygrade === "E7") {
    return 0 // E7 doesn't include award points in FMS
  } else {
    return 0
  }
}

export const calculateEducationPoints = (education: string): number => {
  switch (education.toLowerCase()) {
    case "associate's":
      return 2
    case "bachelor's or higher":
      return 4
    default:
      return 0
  }
}

export const calculatePMAPoints = (pma: number, rscaPma: number, paygrade: string): number => {
  // For E5 and E4, PMA = (PMA*80) - 256, max 64 points
  // For E6, RSCA PMA = (RSCA PMA*30) - 60, max 114 points
  // For E7, RSCA PMA = (RSCA PMA*30) - 54, max 120 points
  if (paygrade === "E5" || paygrade === "E4") {
    return Math.max(0, Math.min(64, (pma * 80) - 256))
  } else if (paygrade === "E6") {
    // Use RSCA PMA for E6
    return Math.max(0, Math.min(114, (rscaPma * 30) - 60))
  } else if (paygrade === "E7") {
    // Use RSCA PMA for E7
    return Math.max(0, Math.min(120, (rscaPma * 30) - 54))
  } else {
    return 0
  }
}

/**
 * Get a breakdown of all points contributing to the FMS
 * Implements NAVADMIN 312/18 guidelines
 */
export const getPointsBreakdown = (formData: FMSFormData): PointBreakdown[] => {
  const paygrade = formData.prospectivePaygrade
  
  // Use RSCA PMA if available, otherwise use regular PMA
  const rawPma = parseFloat(formData.rscaPma) || parseFloat(formData.pma) || 0
  const examScore = parseFloat(formData.examScore) || 0
  const rawAwards = parseFloat(formData.awards) || 0
  const passNotAdvanced = parseFloat(formData.passNotAdvanced) || 0
  const years = parseFloat(formData.serviceYears) || 0
  const months = parseFloat(formData.serviceMonths) || 0
  
  // Apply Navy FMS calculation formulas
  const rscaPma = parseFloat(formData.rscaPma) || 0
  const pmaPoints = calculatePMAPoints(rawPma, rscaPma, paygrade)
  const servicePoints = calculateServicePoints(years, months, paygrade)
  const educationPoints = calculateEducationPoints(formData.education)
  const awardPoints = calculateAwardPoints(rawAwards, paygrade)

  // Get formulas based on paygrade
  let pmaFormula = ""
  let serviceFormula = ""
  let awardsFormula = ""
  
  if (paygrade === "E5" || paygrade === "E4") {
    pmaFormula = "(PMA*80) - 256, max 64"
    serviceFormula = "SIPG/5, max 2"
    awardsFormula = "max 10 points"
  } else if (paygrade === "E6") {
    pmaFormula = "(RSCA PMA*30) - 60, max 114"
    serviceFormula = "SIPG/5, max 3"
    awardsFormula = "max 12 points"
  } else if (paygrade === "E7") {
    pmaFormula = "(RSCA PMA*30) - 54, max 120"
    serviceFormula = "N/A"
    awardsFormula = "N/A"
  }

  return [
    {
      label: "PMA/RSCA",
      value: pmaPoints,
      rawValue: rawPma,
      formula: pmaFormula
    },
    {
      label: "Exam",
      value: examScore
    },
    {
      label: "Awards",
      value: awardPoints,
      rawValue: rawAwards,
      formula: awardsFormula
    },
    {
      label: "PNA",
      value: passNotAdvanced,
      formula: "max 9 points, last 3 cycles"
    },
    {
      label: "Service",
      value: servicePoints,
      rawValue: years + months/12,
      formula: serviceFormula
    },
    {
      label: "Education",
      value: educationPoints
    }
  ]
}

/**
 * Calculate the Final Multiple Score (FMS) based on NAVADMIN 312/18
 * Enforces maximum total points by paygrade:
 * - E4/E5: Max 169 points
 * - E6: Max 222 points
 * - E7: Max 200 points
 */
export const calculateFMS = (formData: FMSFormData): string => {
  const breakdown = getPointsBreakdown(formData)
  const total = breakdown.reduce((sum, item) => sum + item.value, 0)
  
  // Apply maximum total points by paygrade
  const paygrade = formData.prospectivePaygrade
  let maxTotal = 0
  
  if (paygrade === "E5" || paygrade === "E4") {
    maxTotal = 169
  } else if (paygrade === "E6") {
    maxTotal = 222
  } else if (paygrade === "E7") {
    maxTotal = 200
  }
  
  // Ensure total doesn't exceed maximum for paygrade
  const finalTotal = Math.min(total, maxTotal)
  
  return finalTotal.toFixed(2)
}

export const getScoreColor = (score: number): string => {
  if (score >= 150) return "text-green-500"
  if (score >= 130) return "text-blue-500"
  if (score >= 100) return "text-yellow-500"
  return "text-gray-500"
}

/**
 * Get initial form data with default values
 * Augmentee points removed as per NAVADMIN 312/18
 */
export const getInitialFormData = (): FMSFormData => {
  // Default to E5
  const paygrade = "E5" as const;
  
  // Get default cycle based on paygrade
  const defaultCycle = E5_E6_CYCLE_OPTIONS.find(cycle => cycle.includes("Mar 2025")) || E5_E6_CYCLE_OPTIONS[0];
  
  return {
    prospectivePaygrade: paygrade,
    cycle: defaultCycle,
    pma: "0",
    rscaPma: "0",
    examScore: "0",
    awards: "0",
    passNotAdvanced: "0",
    serviceYears: "0",
    serviceMonths: "0",
    education: "None"
  };
}
