import { PromotionRecommendation, RSCAEvaluation, RSCACalculatorData } from "./types"

/**
 * Converts a promotion recommendation to its evaluation value
 * @param promotionRecommendation The promotion recommendation
 * @returns The evaluation value
 */
export const getEvaluationValue = (promotionRecommendation: PromotionRecommendation): number => {
  switch (promotionRecommendation) {
    case "EP":
      return 4.00
    case "MP":
      return 3.80
    case "P":
      return 3.60
    case "Progressing":
      return 3.40
    case "Significant Problems":
      return 2.00
    default:
      return 0
  }
}

/**
 * Calculates the additional RSCA points based on the points above RSCA
 * @param pointsAboveRSCA The points above RSCA
 * @returns The additional RSCA points
 */
export const calculateAdditionalRSCAPoints = (pointsAboveRSCA: number): number => {
  if (pointsAboveRSCA <= 0.04) return 0
  if (pointsAboveRSCA >= 0.05 && pointsAboveRSCA <= 0.19) return 0.20
  if (pointsAboveRSCA >= 0.20 && pointsAboveRSCA <= 0.34) return 0.40
  if (pointsAboveRSCA >= 0.35 && pointsAboveRSCA <= 0.49) return 0.60
  if (pointsAboveRSCA >= 0.50 && pointsAboveRSCA <= 0.64) return 0.80
  if (pointsAboveRSCA >= 0.65 && pointsAboveRSCA <= 0.79) return 1.00
  if (pointsAboveRSCA >= 0.80 && pointsAboveRSCA <= 0.94) return 1.20
  if (pointsAboveRSCA >= 0.95 && pointsAboveRSCA <= 1.09) return 1.40
  if (pointsAboveRSCA >= 1.10 && pointsAboveRSCA <= 1.24) return 1.60
  if (pointsAboveRSCA >= 1.25) return 1.80
  return 0
}

/**
 * Calculates the RSCA evaluation value
 * @param evalValue The evaluation value
 * @param additionalPoints The additional RSCA points
 * @returns The RSCA evaluation value
 */
export const calculateRSCAEvalValue = (evalValue: number, additionalPoints: number): number => {
  return evalValue + additionalPoints
}

/**
 * Calculates the RSCA PMA
 * @param evaluations The evaluations
 * @returns The RSCA PMA
 */
export const calculateRSCAPMA = (evaluations: RSCAEvaluation[]): number => {
  if (evaluations.length === 0) return 0

  // Check if any evaluation is missing RSCA value
  const missingRSCA = evaluations.some(evaluation => evaluation.rsca === 0 || isNaN(evaluation.rsca))
  if (missingRSCA) return 0

  const totalRSCAEvalValue = evaluations.reduce((sum, evaluation) => sum + evaluation.rscaEvalValue, 0)
  return parseFloat((totalRSCAEvalValue / evaluations.length).toFixed(2))
}

/**
 * Processes an evaluation to calculate the RSCA evaluation value
 * @param evaluation The evaluation to process
 * @returns The processed evaluation
 */
export const processEvaluation = (evaluation: RSCAEvaluation): RSCAEvaluation => {
  const evalValue = getEvaluationValue(evaluation.promotionRecommendation)
  const pointsAboveRSCA = Math.max(0, evaluation.ita - evaluation.rsca)
  const additionalPoints = calculateAdditionalRSCAPoints(pointsAboveRSCA)
  const rscaEvalValue = calculateRSCAEvalValue(evalValue, additionalPoints)

  return {
    ...evaluation,
    pointsAboveRSCA,
    additionalPoints,
    rscaEvalValue
  }
}

/**
 * Processes all evaluations and calculates the RSCA PMA
 * @param data The RSCA calculator data
 * @returns The updated RSCA calculator data
 */
export const processRSCACalculatorData = (data: RSCACalculatorData): RSCACalculatorData => {
  const processedEvaluations = data.evaluations.map(processEvaluation)
  const rscaPMA = calculateRSCAPMA(processedEvaluations)

  return {
    evaluations: processedEvaluations,
    rscaPMA
  }
}

/**
 * Creates a new empty evaluation
 * @returns A new empty evaluation
 */
export const createEmptyEvaluation = (): RSCAEvaluation => ({
  id: Date.now().toString(),
  evalFrom: "",
  evalTo: "",
  promotionRecommendation: "P",
  ita: 0,
  rsca: 0,
  pointsAboveRSCA: 0,
  additionalPoints: 0,
  rscaEvalValue: 0
})

/**
 * Creates empty RSCA calculator data
 * @returns Empty RSCA calculator data
 */
export const createEmptyRSCACalculatorData = (): RSCACalculatorData => ({
  evaluations: [createEmptyEvaluation()],
  rscaPMA: 0
})