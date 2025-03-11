import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  isProcessing: boolean;
}

export function ProgressIndicator({ isProcessing }: ProgressIndicatorProps) {
  if (!isProcessing) return null;

  return (
    <div className="space-y-2 animate-in fade-in">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Processing...</span>
      </div>
      <Progress value={null} className="h-1" />
    </div>
  );
}
