import { Users, Clock, BookOpen, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: "users" | "quiz" | "flashcards" | "clock";
}

const iconMap = {
  users: Users,
  quiz: FileQuestion,
  flashcards: BookOpen,
  clock: Clock,
};

const colorMap = {
  users: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  quiz: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
  },
  flashcards: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
  },
  clock: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
  },
};

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const Icon = iconMap[icon];
  const colors = colorMap[icon];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold">{value}</p>
            <p className={cn("ml-2 text-sm", colors.text)}>{change}</p>
          </div>
        </div>
        <div className={cn("p-3 rounded-full", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.text)} />
        </div>
      </div>
    </Card>
  );
} 