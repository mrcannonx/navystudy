"use client";

import { Evaluation } from "./utils/pmaTypes";
import { PaygradeSelector } from "./components/PaygradeSelector";
import { PMAScoreCard } from "./components/PMAScoreCard";
import { EvaluationList } from "./components/EvaluationList";

interface PMACalculatorFormProps {
  paygrade: string;
  setPaygrade: (paygrade: string) => void;
  evaluations: Evaluation[];
  addEvaluation: () => void;
  removeEvaluation: (id: string) => void;
  updateEvaluation: (id: string, field: keyof Evaluation, value: string) => void;
  requiresRSCAPMA: boolean;
  pmaScore: number;
}

/**
 * Component that composes all the form elements for the PMA Calculator
 */
export function PMACalculatorForm({
  paygrade,
  setPaygrade,
  evaluations,
  addEvaluation,
  removeEvaluation,
  updateEvaluation,
  requiresRSCAPMA,
  pmaScore
}: PMACalculatorFormProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <PaygradeSelector 
          paygrade={paygrade} 
          setPaygrade={setPaygrade} 
        />
        
        <PMAScoreCard 
          pmaScore={pmaScore} 
          paygrade={paygrade} 
          evaluationCount={evaluations.length} 
        />
      </div>

      <EvaluationList
        evaluations={evaluations}
        addEvaluation={addEvaluation}
        updateEvaluation={updateEvaluation}
        removeEvaluation={removeEvaluation}
      />
    </>
  );
}