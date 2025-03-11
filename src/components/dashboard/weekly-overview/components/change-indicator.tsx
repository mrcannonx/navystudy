import React from "react";
import { calculateChange } from "../utils";

interface ChangeIndicatorProps {
  current: number;
  previous: number;
}

export const ChangeIndicator: React.FC<ChangeIndicatorProps> = ({ current, previous }) => {
  // If previous is undefined or not a number, don't show any indicator
  if (previous === undefined || isNaN(previous) || previous === null) {
    return null;
  }
  
  const change = calculateChange(current, previous);
  
  // Don't show indicator if the change is zero or can't be calculated
  if (change === 0 || isNaN(change)) return null;
  
  const isPositive = change > 0;
  const color = isPositive ? "text-green-600" : "text-red-600";
  
  return (
    <span className={`text-xs font-medium ${color} ml-2`}>
      {isPositive ? "↑" : "↓"} {Math.abs(change)}%
    </span>
  );
};