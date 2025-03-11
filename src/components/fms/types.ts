/**
 * Tooltip keys for FMS calculator
 * Augmentee removed as per NAVADMIN 312/18
 */
export type TooltipKey = "pma" | "exam" | "awards" | "pna" | "service" | "education" | "rscaPma" | "ita" | "rsca"

export type Education = "None" | "Associate's" | "Bachelor's or Higher"

export type Paygrade = "E4" | "E5" | "E6" | "E7"

export type PromotionRecommendation = "EP" | "MP" | "P" | "Progressing" | "Significant Problems"

/**
 * Form data for FMS calculator
 * Augmentee points removed as per NAVADMIN 312/18
 */
export interface FMSFormData {
  prospectivePaygrade: Paygrade
  cycle: string
  pma: string
  rscaPma: string
  examScore: string
  awards: string
  passNotAdvanced: string
  serviceYears: string
  serviceMonths: string
  education: Education
}

export interface RSCAEvaluation {
  id: string
  evalFrom: string
  evalTo: string
  promotionRecommendation: PromotionRecommendation
  ita: number
  rsca: number
  pointsAboveRSCA: number
  additionalPoints: number
  rscaEvalValue: number
}

export interface RSCACalculatorData {
  evaluations: RSCAEvaluation[]
  rscaPMA: number
}

export interface PointBreakdown {
  label: string
  value: number
  rawValue?: number
  formula?: string
}

export interface TooltipInfo {
  title: string
  content: string
}

export interface TooltipContent {
  [key: string]: TooltipInfo
}
