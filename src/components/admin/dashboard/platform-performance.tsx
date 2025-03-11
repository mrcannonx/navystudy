import { Card } from "@/components/ui/card";

export function PlatformPerformance() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quiz Completion Rate</span>
            <span className="font-medium">85%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[85%] rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">User Engagement</span>
            <span className="font-medium">72%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[72%] rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Study Time Growth</span>
            <span className="font-medium">63%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[63%] rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Content Creation</span>
            <span className="font-medium">91%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[91%] rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
} 