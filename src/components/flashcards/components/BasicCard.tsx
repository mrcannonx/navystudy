import { Card } from '@/components/ui/card';
import type { Flashcard } from '@/types/flashcard';

interface BasicCardProps {
  card: Flashcard;
  showAnswer: boolean;
  onFlip: () => void;
}

export function BasicCard({ card, showAnswer, onFlip }: BasicCardProps) {
  return (
    <Card
      className="p-6 min-h-[200px] cursor-pointer"
      onClick={onFlip}
    >
      <div className="text-lg">
        {showAnswer ? card.back : card.front}
      </div>
    </Card>
  );
} 