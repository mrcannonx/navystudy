import React from "react";
import { Progress } from "@/components/ui/progress";
import { ChangeIndicator } from "./change-indicator";
import { ProgressSectionProps } from "../types";

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  title,
  value,
  total = 100,
  color,
  current,
  previous,
  unit = "%"
}) => {
  // Calculate percentage for the progress bar
  const percentage = total ? (value / total) * 100 : value;
  
  // Get the appropriate color classes based on the color prop
  const getProgressClasses = () => {
    switch (color) {
      case 'text-blue-600':
        return 'h-2 w-full overflow-hidden rounded-full bg-blue-100 [&>div]:bg-blue-600';
      case 'text-green-600':
        return 'h-2 w-full overflow-hidden rounded-full bg-green-100 [&>div]:bg-green-600';
      case 'text-purple-600':
        return 'h-2 w-full overflow-hidden rounded-full bg-purple-100 [&>div]:bg-purple-600';
      case 'text-orange-600':
        return 'h-2 w-full overflow-hidden rounded-full bg-orange-100 [&>div]:bg-orange-600';
      case 'text-red-600':
        return 'h-2 w-full overflow-hidden rounded-full bg-red-100 [&>div]:bg-red-600';
      default:
        return 'h-2 w-full overflow-hidden rounded-full bg-gray-100 [&>div]:bg-gray-600';
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <span className={`font-medium ${color}`}>{title}</span>
          {previous !== undefined && (
            <ChangeIndicator current={current} previous={previous} />
          )}
        </div>
        <span className="text-sm text-gray-500">
          {value}{total !== 100 && `/${total}`} {unit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={getProgressClasses()}
      />
    </div>
  );
};