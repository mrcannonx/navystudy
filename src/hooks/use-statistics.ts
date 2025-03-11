import { useContext } from "react"
import { StatisticsContext } from "@/contexts/statistics-context"
import { StatisticsContextType } from "@/types/statistics.types"

export function useStatistics(): StatisticsContextType {
  const context = useContext(StatisticsContext)
  if (!context) {
    throw new Error("useStatistics must be used within a StatisticsProvider")
  }
  return context
}
