import { QuizQuestion } from './types';

export function randomizeQuizOptions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map(q => {
    const optionsWithIndex = q.options.map((opt, idx) => ({ opt, idx }));
    const shuffledOptions = optionsWithIndex.sort(() => Math.random() - 0.5);
    
    // Find the new index of the correct answer
    const correctAnswerNewIndex = shuffledOptions.findIndex(
      item => item.opt === q.correctAnswer
    );
    
    return {
      ...q,
      options: shuffledOptions.map(item => item.opt),
      correctAnswer: q.correctAnswer
    };
  });
}

export function processQuizContent(questions: QuizQuestion[]): QuizQuestion[] {
  // Add any additional quiz-specific processing here
  // For now, we just randomize the options
  return randomizeQuizOptions(questions);
}

export function validateQuizStructure(question: QuizQuestion): boolean {
  return (
    typeof question.question === "string" &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    typeof question.correctAnswer === "string" &&
    typeof question.explanation === "string" &&
    question.options.includes(question.correctAnswer)
  );
}
