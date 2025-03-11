import { Card } from '@/components/ui/card';
import type { Flashcard } from '@/types/flashcard';

interface ReversedCardProps {
  card: Flashcard;
  showAnswer: boolean;
  onFlip: () => void;
}

export function ReversedCard({ card, showAnswer, onFlip }: ReversedCardProps) {
  return (
    <Card
      className="p-6 min-h-[200px] cursor-pointer"
      onClick={onFlip}
    >
      <div className="text-lg">
        {showAnswer ? card.front : card.back}
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Reversed Card
      </div>
    </Card>
  );
} 