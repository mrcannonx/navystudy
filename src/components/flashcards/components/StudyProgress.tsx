import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Timer, Book, CheckCircle2, BarChart2 } from 'lucide-react';
import { formatDuration } from 'date-fns';

interface StudyProgressProps {
  currentCardIndex: number;
  totalCards: number;
  startTime: number;
  responseCount: number;
  averageConfidence?: number;
  className?: string;
}

export function StudyProgress({
  currentCardIndex,
  totalCards,
  startTime,
  responseCount,
  averageConfidence,
  className
}: StudyProgressProps) {
  const progress = Math.round((currentCardIndex / totalCards) * 100);
  const elapsedTime = Date.now() - startTime;
  const formattedDuration = formatDuration({
    seconds: Math.floor(elapsedTime / 1000)
  }, { format: ['hours', 'minutes', 'seconds'] });

  const stats = [
    {
      icon: <Book className="h-4 w-4" />,
      label: 'Progress',
      value: `${currentCardIndex} / ${totalCards}`,
      detail: `${progress}% Complete`
    },
    {
      icon: <Timer className="h-4 w-4" />,
      label: 'Time',
      value: formattedDuration,
      detail: 'Study Duration'
    },
    {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: 'Responses',
      value: responseCount.toString(),
      detail: 'Cards Reviewed'
    },
    {
      icon: <BarChart2 className="h-4 w-4" />,
      label: 'Confidence',
      value: averageConfidence ? `${Math.round(averageConfidence * 100)}%` : 'N/A',
      detail: 'Average Rating'
    }
  ];

  return (
    <Card className={cn('p-4 space-y-4', className)}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className="h-2"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={cn(
              "p-2 rounded-lg bg-muted/50",
              "transition-all duration-200 hover:bg-muted"
            )}
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <div className="space-y-0.5">
              <div className="text-lg font-semibold tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 