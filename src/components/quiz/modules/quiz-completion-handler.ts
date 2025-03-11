import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { Quiz } from "./types"

export async function handleQuizCompletion(
  user: User,
  quiz: Quiz,
  score: number,
  questionResults: Array<{questionId: string, correct: boolean}>,
  timeSpent: number,
  totalQuestions: number
): Promise<void> {
  const now = new Date().toISOString()
  const correctAnswers = questionResults.filter(r => r.correct).length

  // Record quiz completion in user_activities
  const { error: activityError } = await supabase
    .from('user_activities')
    .insert({
      user_id: user.id,
      activity_type: 'quiz_completion',
      content_id: quiz.id,
      content_type: 'quiz',
      content_title: quiz.title || 'Quiz',
      activity_data: {
        score: score,
        timeSpent: timeSpent,
        questionsAnswered: totalQuestions,
        correctAnswers: correctAnswers,
        completed: true,
        currentAnswers: questionResults.map(result => ({
          questionId: result.questionId,
          correct: result.correct,
          timeSpent: timeSpent / totalQuestions // Approximate time per question
        })),
        metrics: {
          accuracy: (correctAnswers / totalQuestions) * 100,
          averageTimePerQuestion: timeSpent / totalQuestions
        }
      },
      created_at: now,
      completed_at: now
    })

  if (activityError) {
    throw new Error('Failed to record quiz completion')
  }
}
