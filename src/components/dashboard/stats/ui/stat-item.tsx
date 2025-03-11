import { LucideIcon } from "lucide-react";
import { ColorKey, getColorStyle } from "./color-utils";

interface StatItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: ColorKey;
  visualIndicator?: React.ReactNode; // New prop for visual elements
  tooltip?: string; // Optional tooltip for additional context
}

/**
 * StatItem component for displaying smaller statistics in the dashboard
 * Used primarily for the quiz and flashcard statistics
 */
export function StatItem({
  icon: Icon,
  label,
  value,
  color,
  visualIndicator,
  tooltip
}: StatItemProps) {
  const colorStyle = getColorStyle(color);

  return (
    <div
      className={`${colorStyle.gradient} ${colorStyle.accent} rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg`}
      title={tooltip}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${colorStyle.iconBg} ${colorStyle.text}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {/* Render the visual indicator if provided */}
      {visualIndicator && (
        <div className="mt-2">
          {visualIndicator}
        </div>
      )}
    </div>
  );
}