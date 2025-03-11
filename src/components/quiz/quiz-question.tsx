import { Button } from '@/components/ui/button'
import { StudySettings } from './modules/study-settings-types'

interface QuizQuestionProps {
  question: string
  choices: string[]
  onAnswer: (choice: string) => void
  currentQuestionNumber: number
  totalQuestions: number
  selectedAnswer: string | null
  correctAnswer: string
  explanation: string | null
  onNextQuestion: () => void
  isAnswered: boolean
  settings?: StudySettings
}

export function QuizQuestion({
  question,
  choices,
  onAnswer,
  currentQuestionNumber,
  totalQuestions,
  selectedAnswer,
  correctAnswer,
  explanation,
  onNextQuestion,
  isAnswered,
  settings
}: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Question {currentQuestionNumber} of {totalQuestions}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {question}
        </h2>
      </div>

      {/* Answer choices */}
      <div className="grid gap-4">
        {choices.map((choice, index) => {
          const isSelected = selectedAnswer === choice;
          const isCorrect = choice === correctAnswer;
          console.log('Rendering choice:', {
            choice,
            isSelected,
            isCorrect,
            isAnswered,
            selectedAnswer
          });
          
          let buttonStyle = "w-full justify-start text-left px-6 py-4 h-auto whitespace-normal";
          
          if (isAnswered) {
            if (isSelected && isCorrect) {
              buttonStyle += " bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500";
            } else if (isSelected && !isCorrect) {
              buttonStyle += " bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500";
            }
          } else {
            buttonStyle += " hover:bg-gray-50 dark:hover:bg-gray-800 border";
          }

          return (
            <Button
              key={index}
              variant="outline"
              className={buttonStyle}
              onClick={() => !isAnswered && onAnswer(choice)}
              disabled={isAnswered}
            >
              {choice}
            </Button>
          );
        })}
      </div>

      {/* Explanation - only show when correct answer is selected and showExplanations is enabled */}
      {isAnswered && selectedAnswer === correctAnswer && explanation && settings?.showExplanations && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">{explanation}</p>
        </div>
      )}

      {/* Next Question or Complete Quiz Button */}
      {isAnswered && (
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onNextQuestion}
            className="bg-primary hover:bg-primary/90 text-white px-6"
          >
            {currentQuestionNumber === totalQuestions ? "Complete Quiz" : "Next Question"}
          </Button>
        </div>
      )}
    </div>
  )
}
