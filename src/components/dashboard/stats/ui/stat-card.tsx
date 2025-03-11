import { LucideIcon } from "lucide-react";
import { ColorKey, getColorStyle } from "./color-utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: ColorKey;
}

/**
 * StatCard component for displaying larger statistics in the dashboard
 * Used primarily for the top row of statistics
 */
export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorStyle = getColorStyle(color);

  return (
    <div className={`${colorStyle.gradient} ${colorStyle.accent} rounded-lg p-6 shadow-md transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorStyle.iconBg} ${colorStyle.text}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}