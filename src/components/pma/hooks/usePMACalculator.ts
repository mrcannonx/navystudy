import { useState, useCallback, useMemo } from "react";
import { Evaluation } from "../utils/pmaTypes";
import { calculatePMA, sortEvaluationsByDate, createDefaultEvaluation } from "../utils/pmaUtils";
import { DEFAULT_PAYGRADE } from "../utils/pmaConstants";

/**
 * Custom hook for managing PMA calculator state and operations
 */
export function usePMACalculator(initialEvaluations: Evaluation[] = []) {
  const [paygrade, setPaygrade] = useState(DEFAULT_PAYGRADE);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);

  /**
   * Add a new evaluation with default values
   */
  const addEvaluation = useCallback(() => {
    const newEvaluation = createDefaultEvaluation();
    setEvaluations(prev => [...prev, newEvaluation]);
    return newEvaluation;
  }, []);

  /**
   * Remove an evaluation by ID
   */
  const removeEvaluation = useCallback((id: string) => {
    setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
  }, []);

  /**
   * Update a specific field of an evaluation
   */
  const updateEvaluation = useCallback((id: string, field: keyof Evaluation, value: string) => {
    setEvaluations(prev => 
      prev.map(evaluation =>
        evaluation.id === id ? { ...evaluation, [field]: value } : evaluation
      )
    );
  }, []);

  /**
   * Get evaluations sorted by date (newest first)
   */
  const getSortedEvaluations = useCallback(() => {
    return sortEvaluationsByDate(evaluations);
  }, [evaluations]);

  /**
   * Calculate the current PMA score
   */
  const pmaScore = useMemo(() => {
    console.log("DEBUG: Calculating PMA score with evaluations:", evaluations);
    const score = calculatePMA(evaluations);
    console.log("DEBUG: Calculated PMA score:", score);
    return score;
  }, [evaluations]);

  /**
   * Reset evaluations to provided values or empty array
   */
  const resetEvaluations = useCallback((newEvaluations: Evaluation[] = []) => {
    console.log("DEBUG: Resetting evaluations with:", newEvaluations);
    
    // Ensure all evaluations have valid IDs and scores
    const validatedEvaluations = newEvaluations.map(evaluation => ({
      ...evaluation,
      id: evaluation.id || String(Date.now()),
      score: evaluation.score || "3.60"
    }));
    
    console.log("DEBUG: Setting evaluations state with validated data:", validatedEvaluations);
    setEvaluations(validatedEvaluations);
    
    // Don't reference the current evaluations state in the callback
    // as it will have the old value due to closure
    setTimeout(() => {
      console.log("DEBUG: Current evaluations state after reset should be updated now");
    }, 100);
  }, []); // Remove evaluations dependency to prevent stale closures

  return {
    paygrade,
    setPaygrade,
    evaluations,
    setEvaluations,
    addEvaluation,
    removeEvaluation,
    updateEvaluation,
    getSortedEvaluations,
    pmaScore,
    resetEvaluations,
  };
}