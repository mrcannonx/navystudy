"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientInput } from "@/components/ui/client-input";
import { Evaluation } from "../utils/pmaTypes";
import { SCORE_OPTIONS } from "../utils/pmaConstants";

interface EvaluationItemProps {
  evaluation: Evaluation;
  index: number;
  updateEvaluation: (id: string, field: keyof Evaluation, value: string) => void;
  removeEvaluation: (id: string) => void;
}

/**
 * Component for a single evaluation entry with date and score inputs
 */
export function EvaluationItem({ 
  evaluation, 
  index, 
  updateEvaluation, 
  removeEvaluation 
}: EvaluationItemProps) {
  return (
    <div
      className="flex gap-4 items-center p-3 rounded-lg border border-gray-100 dark:border-gray-700 evaluation-item"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
        {index + 1}
      </div>
      
      <ClientInput
        type="date"
        value={evaluation.date}
        onChange={(e) => updateEvaluation(evaluation.id, "date", e.target.value)}
        className="flex-1 enhanced-input"
      />
      
      <select
        value={evaluation.score}
        onChange={(e) => updateEvaluation(evaluation.id, "score", e.target.value)}
        className="flex-1 p-2 border rounded-md bg-background enhanced-input"
      >
        {SCORE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeEvaluation(evaluation.id)}
        className="flex-shrink-0 text-gray-500 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}