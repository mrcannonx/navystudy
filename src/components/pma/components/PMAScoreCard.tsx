"use client";

import { Info, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requiresRSCAPMA } from "../utils/pmaConstants";

interface PMAScoreCardProps {
  pmaScore: number;
  paygrade: string;
  evaluationCount: number;
}

/**
 * Component that displays the PMA score and calculation information
 */
export function PMAScoreCard({ pmaScore, paygrade, evaluationCount }: PMAScoreCardProps) {
  const showRSCAWarning = requiresRSCAPMA(paygrade);

  return (
    <Card className="pma-card fade-in" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
            <Calculator className="h-5 w-5" />
          </div>
          <CardTitle>PMA Calculation</CardTitle>
        </div>
        <CardDescription>
          {showRSCAWarning
            ? "E6/E7 candidates need RSCA PMA calculation (see alert above)"
            : "Your PMA is calculated based on Block 45 scores from your evaluations"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Evaluations</div>
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{evaluationCount}</div>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full"></div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Score</div>
            <div className={`text-lg font-bold ${
              showRSCAWarning
                ? "text-gray-400 dark:text-gray-500 line-through"
                : "text-blue-600 dark:text-blue-400"
            }`}>
              {pmaScore.toFixed(2)}
              {showRSCAWarning && (
                <span className="text-xs ml-2 no-underline">(Not applicable for {paygrade})</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg flex items-start gap-2">
          <Info className="h-5 w-5 text-purple-500 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>
              PMA = (Sum of Block 45 scores) ÷ (Number of evaluations)
            </p>
            <p className="mt-1">
              <strong>Note:</strong> This simple calculation is only applicable for E4 and E5 candidates.
              E6 and E7 candidates must use the RSCA PMA calculation in the FMS Calculator.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}