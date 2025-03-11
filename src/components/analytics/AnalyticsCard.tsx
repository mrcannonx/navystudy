import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AnalyticsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "purple" | "cyan" | "emerald" | "amber";
}

const colorStyles = {
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/10 dark:to-background dark:border-purple-500/30 border border-purple-200/50",
    iconWrapper: "bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
    value: "text-purple-700 dark:text-purple-300"
  },
  cyan: {
    card: "bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/10 dark:to-background dark:border-cyan-500/30 border border-cyan-200/50",
    iconWrapper: "bg-cyan-100 dark:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-500/30",
    text: "text-cyan-600 dark:text-cyan-400",
    value: "text-cyan-700 dark:text-cyan-300"
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/10 dark:to-background dark:border-emerald-500/30 border border-emerald-200/50",
    iconWrapper: "bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-700 dark:text-emerald-300"
  },
  amber: {
    card: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/10 dark:to-background dark:border-amber-500/30 border border-amber-200/50",
    iconWrapper: "bg-amber-100 dark:bg-amber-900/50 border border-amber-200 dark:border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    value: "text-amber-700 dark:text-amber-300"
  }
}

export function AnalyticsCard({ icon: Icon, label, value, color }: AnalyticsCardProps) {
  const styles = colorStyles[color]
  
  return (
    <Card className={`p-4 ${styles.card}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${styles.iconWrapper}`}>
          <Icon className={`h-5 w-5 ${styles.text}`} />
        </div>
        <div>
          <p className={`text-sm ${styles.text}`}>{label}</p>
          <p className={`text-2xl font-bold ${styles.value}`}>{value}</p>
        </div>
      </div>
    </Card>
  )
}
