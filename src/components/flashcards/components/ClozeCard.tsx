import React, { useState, useEffect, ReactElement } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flashcard } from '@/types/flashcard';

interface ClozeContent {
  text: string;
  answer: string;
  hints?: string[];
  position: number;
}

interface ClozeMetadata {
  clozeData: ClozeContent[];
}

interface ClozeCardProps {
  card: Flashcard & { clozeData?: ClozeContent[] };
  onAnswer: (confidence: number) => void;
  showAnswer: boolean;
}

export function ClozeCard({ card, onAnswer, showAnswer }: ClozeCardProps) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [showHints, setShowHints] = useState<boolean[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean[]>([]);

  const clozeData = card.clozeData || [];

  useEffect(() => {
    // Reset state when card changes
    setAnswers(new Array(clozeData.length).fill(''));
    setShowHints(new Array(clozeData.length).fill(false));
    setIsCorrect(new Array(clozeData.length).fill(false));
  }, [card.id, clozeData.length]);

  const checkAnswer = (cloze: ClozeContent, index: number) => {
    const userAnswer = answers[index].trim().toLowerCase();
    const correctAnswer = cloze.answer.toLowerCase();
    const correct = userAnswer === correctAnswer;
    
    const newIsCorrect = [...isCorrect];
    newIsCorrect[index] = correct;
    setIsCorrect(newIsCorrect);

    // If all answers are correct, call onAnswer with high confidence
    if (newIsCorrect.every(Boolean)) {
      onAnswer(5); // High confidence for all correct
    }
  };

  const renderClozeText = (): ReactElement[] => {
    let lastIndex = 0;
    const elements: ReactElement[] = [];

    clozeData.forEach((cloze, index) => {
      // Add text before the cloze
      if (cloze.position > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {card.front.slice(lastIndex, cloze.position)}
          </span>
        );
      }

      // Add the cloze input
      elements.push(
        <span key={`cloze-${index}`} className="inline-block mx-1">
          {showAnswer ? (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">
              {cloze.answer}
            </span>
          ) : (
            <Input
              type="text"
              value={answers[index]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setAnswers(newAnswers);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  checkAnswer(cloze, index);
                }
              }}
              className={`w-32 inline-block ${
                isCorrect[index] ? 'border-green-500' : ''
              }`}
            />
          )}
          {!showAnswer && cloze.hints && cloze.hints.length > 0 && (
            <div className="mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newShowHints = [...showHints];
                  newShowHints[index] = !newShowHints[index];
                  setShowHints(newShowHints);
                }}
              >
                {showHints[index] ? 'Hide Hint' : 'Show Hint'}
              </Button>
              {showHints[index] && (
                <div className="text-sm text-gray-500 mt-1">
                  {cloze.hints.join(', ')}
                </div>
              )}
            </div>
          )}
        </span>
      );

      lastIndex = cloze.position + cloze.answer.length;
    });

    // Add remaining text
    if (lastIndex < card.front.length) {
      elements.push(
        <span key="text-end">{card.front.slice(lastIndex)}</span>
      );
    }

    return elements;
  };

  const calculateProgress = () => {
    const total = clozeData.length;
    const correct = isCorrect.filter(Boolean).length;
    return (correct / total) * 100;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-lg">{renderClozeText()}</div>
        {!showAnswer && (
          <div className="space-y-2">
            <Progress value={calculateProgress()} className="h-2" />
            <div className="text-sm text-gray-500 text-center">
              {isCorrect.filter(Boolean).length} of {clozeData.length} correct
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 