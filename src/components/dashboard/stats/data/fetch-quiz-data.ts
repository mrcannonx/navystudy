import { supabase } from "@/lib/supabase";

/**
 * Fetches the total number of quiz questions available to the user
 * @returns The total number of questions across all quizzes
 */
export async function fetchTotalQuizQuestions(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    
    // Get all quizzes for the user
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('questions')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching quizzes:', error);
      return 0;
    }
    
    // Count all questions in all quizzes
    let totalQuestions = 0;
    quizzes?.forEach((quiz: { questions?: { questions?: any[] } }) => {
      if (quiz.questions?.questions && Array.isArray(quiz.questions.questions)) {
        totalQuestions += quiz.questions.questions.length;
      }
    });
    
    return totalQuestions;
  } catch (error) {
    console.error('Error counting quiz questions:', error);
    return 0;
  }
}