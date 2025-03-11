import { Users, Brain, BookOpen, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activities = [
  {
    user: "John Smith",
    action: "Completed Quiz",
    subject: "Navy Ranks",
    time: "2 minutes ago",
    icon: Brain,
    color: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
    }
  },
  {
    user: "Sarah Johnson",
    action: "Studied Flashcards",
    subject: "Navy Terminology",
    time: "5 minutes ago",
    icon: BookOpen,
    color: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
    }
  },
  {
    user: "Mike Davis",
    action: "Started Session",
    subject: "Study Session",
    time: "10 minutes ago",
    icon: Clock,
    color: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    }
  }
];

export function AdminRecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className={cn("p-2 rounded-full", activity.color.bg)}>
              <activity.icon className={cn("w-4 h-4", activity.color.text)} />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">
                {activity.user} <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-sm text-muted-foreground">{activity.subject}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 