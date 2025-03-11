import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, CheckCircle2 } from 'lucide-react';
import type { StudyResults } from '@/types/flashcard';

interface StudyStatsProps {
  results: StudyResults;
}

export function StudyStats({ results }: StudyStatsProps) {
  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    return Math.round((results.correctAnswers / results.totalAnswers) * 100);
  }, [results.correctAnswers, results.totalAnswers]);

  // Format study duration
  const formattedDuration = useMemo(() => {
    const minutes = Math.floor(results.studyDuration / 60);
    const seconds = results.studyDuration % 60;
    return `${minutes}m ${seconds}s`;
  }, [results.studyDuration]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Study Progress */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Study Progress</h3>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Completed</span>
            <span>{results.totalAnswers} cards</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>
      </Card>

      {/* Performance */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-medium">Performance</h3>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Mastered</span>
            <span>{results.correctAnswers} of {results.totalAnswers}</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-center text-gray-500">{completionPercentage}% mastery rate</p>
        </div>
      </Card>

      {/* Study Time */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium">Study Time</h3>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Duration</span>
            <span>{formattedDuration}</span>
          </div>
          <div className="text-xs text-center text-gray-500">
            {Math.round(results.studyDuration / results.totalAnswers)} seconds per card
          </div>
        </div>
      </Card>
    </div>
  );
} 