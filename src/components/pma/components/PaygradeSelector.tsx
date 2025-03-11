"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PAYGRADE_OPTIONS } from "../utils/pmaConstants";

interface PaygradeSelectorProps {
  paygrade: string;
  setPaygrade: (paygrade: string) => void;
}

/**
 * Component for selecting paygrade with information about implications
 */
export function PaygradeSelector({ paygrade, setPaygrade }: PaygradeSelectorProps) {
  return (
    <Card className="pma-card fade-in">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 8c-1.654 0-3 1.346-3 3v7c0 1.654 1.346 3 3 3s3-1.346 3-3v-7c0-1.654-1.346-3-3-3z" />
              <path d="M19 8v2a7 7 0 0 1-14 0V8" />
              <path d="M12 8V3" />
            </svg>
          </div>
          <CardTitle>Paygrade Selection</CardTitle>
        </div>
        <CardDescription>
          Select your current paygrade to ensure accurate PMA calculation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {PAYGRADE_OPTIONS.map((grade) => (
            <Button
              key={grade}
              variant={paygrade === grade ? "default" : "outline"}
              className={`h-12 text-lg font-medium ${paygrade === grade ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              onClick={() => setPaygrade(grade)}
            >
              {grade}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>
              Your paygrade determines which evaluations are used and the calculation method for PMA.
            </p>
            <p className="mt-1">
              <strong>E4-E5:</strong> Simple PMA calculation (shown here)<br />
              <strong>E6-E7:</strong> RSCA PMA calculation (available in FMS Calculator)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}