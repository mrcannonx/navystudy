// Color mapping utilities for stat components

export type ColorKey = 'purple' | 'cyan' | 'emerald' | 'amber' | 'blue';

export interface ColorStyle {
  bg: string;
  text: string;
  border: string;
  dark: string;
  gradient: string;
  accent: string;
  iconBg: string;
}

export const colorMap: Record<ColorKey, ColorStyle> = {
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    dark: "dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    gradient: "bg-white dark:bg-gray-800",
    accent: "border-l-4 border-l-purple-500 dark:border-l-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/30"
  },
  cyan: {
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    border: "border-cyan-200",
    dark: "dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    gradient: "bg-white dark:bg-gray-800",
    accent: "border-l-4 border-l-cyan-500 dark:border-l-cyan-400",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/30"
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
    dark: "dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    gradient: "bg-white dark:bg-gray-800",
    accent: "border-l-4 border-l-emerald-500 dark:border-l-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30"
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    dark: "dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    gradient: "bg-white dark:bg-gray-800",
    accent: "border-l-4 border-l-amber-500 dark:border-l-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/30"
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    dark: "dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    gradient: "bg-white dark:bg-gray-800",
    accent: "border-l-4 border-l-blue-500 dark:border-l-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30"
  }
};

export const getColorStyle = (color: ColorKey): ColorStyle => {
  return colorMap[color];
};