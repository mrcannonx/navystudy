"use client";

import { PlusCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EvaluationItem } from "./EvaluationItem";
import { Evaluation } from "../utils/pmaTypes";

interface EvaluationListProps {
  evaluations: Evaluation[];
  addEvaluation: () => void;
  updateEvaluation: (id: string, field: keyof Evaluation, value: string) => void;
  removeEvaluation: (id: string) => void;
}

/**
 * Component that displays and manages the list of evaluations
 */
export function EvaluationList({ 
  evaluations, 
  addEvaluation, 
  updateEvaluation, 
  removeEvaluation 
}: EvaluationListProps) {
  return (
    <Card className="pma-card fade-in" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Your Evaluations</CardTitle>
            <CardDescription>
              Add or modify evaluations to calculate your PMA
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {evaluations.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No evaluations added yet. Click the button below to add your first evaluation.
            </div>
          ) : (
            evaluations.map((evaluation, index) => (
              <EvaluationItem
                key={evaluation.id}
                evaluation={evaluation}
                index={index}
                updateEvaluation={updateEvaluation}
                removeEvaluation={removeEvaluation}
              />
            ))
          )}
        </div>

        <Button
          onClick={addEvaluation}
          variant="outline"
          className="w-full mt-6 h-12 border-dashed border-2 flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Add Evaluation
        </Button>
      </CardContent>
    </Card>
  );
}