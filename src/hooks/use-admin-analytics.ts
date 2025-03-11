import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

interface RecentActivity {
  id: string;
  user_id: string;
  activity_type: 'quiz_completion' | 'flashcard_study' | 'study_session' | 'content_creation';
  content_title: string | null;
  created_at: string;
  user: {
    full_name: string | null;
  } | null;
}

interface AdminAnalytics {
  newUsers7Days: number;
  dailyActiveUsers: number;
  retentionRate: number;
  deviceDistribution: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  peakUsageTimes: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  rankAdvancementRate: number;
  avgSessionLength: number;
  learningPathProgress: number;
  recentActivities: RecentActivity[];
  platformStats: {
    totalUsers: number;
    activeQuizzes: number;
    flashcardDecks: number;
    evaluationsCreated: number;
    growthRates: {
      users: number;
      quizzes: number;
      flashcards: number;
      evaluations: number;
    };
  };
}

export function useAdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient<Database>();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      console.log('[useAdminAnalytics] Starting analytics fetch...');
      
      // Get platform stats
      const { count: totalUsers, error: totalUsersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

      console.log('[useAdminAnalytics] Total users query:', { totalUsers, error: totalUsersError });

      if (totalUsersError) {
        throw new Error(`Failed to fetch total users: ${totalUsersError.message}`);
      }

      // Get new users in last 30 days for growth rate
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: recentUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate user growth rate
      const userGrowthRate = totalUsers ? (recentUsers || 0) / totalUsers : 0;

      // Get active quizzes
      const { count: activeQuizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact' });

      console.log('[useAdminAnalytics] Active quizzes query:', { activeQuizzes, error: quizzesError });

      if (quizzesError) {
        throw new Error(`Failed to fetch quizzes: ${quizzesError.message}`);
      }

      // Get recent quizzes for growth rate
      const { count: recentQuizzes } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate quiz growth rate
      const quizGrowthRate = activeQuizzes ? (recentQuizzes || 0) / activeQuizzes : 0;

      // Get total evaluations created (using quizzes as evaluations)
      const { count: totalEvaluations, error: evaluationsError } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact' });

      console.log('[useAdminAnalytics] Total evaluations query:', { totalEvaluations, error: evaluationsError });

      if (evaluationsError) {
        throw new Error(`Failed to fetch evaluations: ${evaluationsError.message}`);
      }

      // Get recent evaluations for growth rate
      const { count: recentEvaluations } = await supabase
        .from('quizzes')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate evaluations growth rate
      const evaluationsGrowthRate = totalEvaluations ? (recentEvaluations || 0) / totalEvaluations : 0;

      // Get flashcard decks
      const { count: flashcardDecks, error: flashcardsError } = await supabase
        .from('flashcards')
        .select('id', { count: 'exact' });

      console.log('[useAdminAnalytics] Flashcard decks query:', { flashcardDecks, error: flashcardsError });

      if (flashcardsError) {
        throw new Error(`Failed to fetch flashcards: ${flashcardsError.message}`);
      }

      // Get recent flashcards for growth rate
      const { count: recentFlashcards } = await supabase
        .from('flashcards')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Calculate flashcard growth rate
      const flashcardGrowthRate = flashcardDecks ? (recentFlashcards || 0) / flashcardDecks : 0;

      // Get study hours from user activities
      const { data: studySessions, error: sessionsError } = await supabase
        .from('user_activities')
        .select(`
          created_at,
          activity_data
        `)
        .eq('content_type', 'quiz')
        .eq('activity_type', 'quiz_completion')
        .not('activity_data', 'is', null)
        .not('activity_data', 'eq', '{}');

      console.log('[useAdminAnalytics] Study sessions query:', {
        sessionsCount: studySessions?.length,
        error: sessionsError
      });

      if (sessionsError) {
        throw new Error(`Failed to fetch study sessions: ${sessionsError.message}`);
      }

      // Filter sessions with valid data
      const validSessions = (studySessions || []).filter(session => {
        const data = session.activity_data
        return data &&
               typeof data.score === 'number' && data.score >= 0 &&
               typeof data.timeSpent === 'number' && data.timeSpent >= 0 &&
               typeof data.questionsAnswered === 'number' && data.questionsAnswered >= 0 &&
               typeof data.correctAnswers === 'number' && data.correctAnswers >= 0
      });

      // Calculate total study hours from study sessions
      const totalStudyHours = validSessions.reduce((total, record) =>
        total + ((record.activity_data.timeSpent || 0) / 3600), // Convert seconds to hours
        0
      );

      // Get recent study sessions for growth rate
      const recentSessions = validSessions.filter(record =>
        new Date(record.created_at) >= thirtyDaysAgo
      );

      // Calculate recent study hours
      const recentStudyHours = recentSessions.reduce((total, record) =>
        total + ((record.activity_data.timeSpent || 0) / 3600),
        0
      );

      // Calculate study hours growth rate
      const studyHoursGrowthRate = totalStudyHours 
        ? recentStudyHours / totalStudyHours 
        : 0;

      const analyticsData = {
        newUsers7Days: recentUsers || 0,
        dailyActiveUsers: 0,
        retentionRate: 0,
        deviceDistribution: {
          desktop: 1,
          mobile: 0,
          tablet: 0,
        },
        peakUsageTimes: {
          morning: 0.33,
          afternoon: 0.33,
          evening: 0.34,
        },
        rankAdvancementRate: 0,
        avgSessionLength: 0,
        learningPathProgress: 0,
        recentActivities: [],
        platformStats: {
          totalUsers: totalUsers || 0,
          activeQuizzes: activeQuizzes || 0,
          flashcardDecks: flashcardDecks || 0,
          evaluationsCreated: totalEvaluations || 0,
          growthRates: {
            users: userGrowthRate,
            quizzes: quizGrowthRate,
            flashcards: flashcardGrowthRate,
            evaluations: evaluationsGrowthRate
          }
        }
      };

      console.log('[useAdminAnalytics] Setting analytics data:', analyticsData);
      setAnalytics(analyticsData);

    } catch (err) {
      console.error('[useAdminAnalytics] Error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
    } finally {
      setLoading(false);
      console.log('[useAdminAnalytics] Analytics fetch complete');
    }
  };

  useEffect(() => {
    console.log('[useAdminAnalytics] Hook initialized');
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    refreshAnalytics: fetchAnalytics,
  };
}
