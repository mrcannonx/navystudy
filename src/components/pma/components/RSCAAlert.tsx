"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RSCAAlertProps {
  paygrade: string;
}

/**
 * Alert component for E6/E7 users about RSCA PMA requirements
 */
export function RSCAAlert({ paygrade }: RSCAAlertProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-md mb-6 alert-box fade-in">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-700 dark:text-amber-300">
            RSCA PMA Required for {paygrade}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            Per NAVADMIN 312/18, {paygrade} candidates must use the RSCA PMA calculation method, 
            which is available in the FMS Calculator.
          </p>
          <div className="mt-3">
            <Link href="/fms-calculator">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Go to FMS Calculator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}