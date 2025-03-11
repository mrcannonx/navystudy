import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ClientButton } from '@/components/ui/client-button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface SessionRecoveryProps {
  sessionData: {
    lastActive: number;
    currentCardIndex: number;
    totalCards: number;
    responses: Record<string, { confidence: number; timestamp: number }>;
  };
  onRecover: () => void;
  onDiscard: () => void;
}

export function SessionRecovery({ sessionData, onRecover, onDiscard }: SessionRecoveryProps) {
  const [isRecovering, setIsRecovering] = useState(false);

  const handleRecover = async () => {
    setIsRecovering(true);
    await onRecover();
    setIsRecovering(false);
  };

  const progress = (sessionData.currentCardIndex / sessionData.totalCards) * 100;
  const responseCount = Object.keys(sessionData.responses).length;

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Previous Session Found</h2>
        <p className="text-muted-foreground">
          We found a previous study session that was interrupted. Would you like to continue where you left off?
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Session Details:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Last active: {format(sessionData.lastActive, 'PPp')}</li>
            <li>Progress: {sessionData.currentCardIndex} of {sessionData.totalCards} cards</li>
            <li>Responses recorded: {responseCount}</li>
          </ul>
        </div>

        <Progress value={progress} className="h-2" />
        
        <p className="text-sm text-muted-foreground">
          {Math.round(progress)}% complete
        </p>
      </div>

      <div className="flex gap-3">
        <ClientButton
          action={handleRecover}
          disabled={isRecovering}
          className="flex-1"
        >
          {isRecovering ? 'Recovering...' : 'Continue Session'}
        </ClientButton>
        
        <ClientButton
          variant="outline"
          action={onDiscard}
          disabled={isRecovering}
          className="flex-1"
        >
          Start New Session
        </ClientButton>
      </div>
    </Card>
  );
} 