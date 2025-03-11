import React, { useState, useEffect, useMemo } from "react";
import { Target, Calendar } from "lucide-react";
import { useStatistics } from "@/contexts/statistics-context";
import { useStudyAnalytics } from "@/hooks/use-study-analytics";
import { WeeklyStats } from "./types";
import { calculateWeekBoundaries, formatDate } from "./utils";
import { ProgressSection } from "./components/progress-section";
import { StatsCard } from "./components/stats-card";
import { LoadingState } from "./components/loading-state";

export function WeeklyOverview() {
  const { quizStats, flashcardStats } = useStatistics() || { quizStats: null, flashcardStats: null };
  const { getSessionsByDateRange } = useStudyAnalytics();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    cardsStudied: 0,
    totalCards: 0, // No default target
    retentionRate: 0,
    reviewEfficiency: 0,
    weekStartDate: new Date(),
    weekEndDate: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize weekly stats with data from context immediately
  useEffect(() => {
    // Get week boundaries
    const { startOfWeek, endOfWeek } = calculateWeekBoundaries();
    
    // Set initial stats from available context data
    const cards = (flashcardStats?.cardsStudied || 0) + (quizStats?.questionsAnswered || 0);
    const retention = quizStats?.averageScore ? Math.round(quizStats.averageScore) : 0;
    
    // Update state with context data right away
    setWeeklyStats({
      cardsStudied: cards,
      totalCards: 0, // No default goal
      retentionRate: retention,
      reviewEfficiency: 0, // No default value
      weekStartDate: startOfWeek,
      weekEndDate: endOfWeek,
      previousWeekStats: {
        cardsStudied: 0,
        retentionRate: 0,
        reviewEfficiency: 0
      }
    });
    
    // Mark as initialized so we don't show loading state for too long
    setInitialized(true);
  }, [flashcardStats, quizStats]);

  // Memoize stats to prevent unnecessary re-fetching
  const memoizedDeps = useMemo(() => {
    // Calculate a stable hash based on the stats that matter
    const quizStatsHash = quizStats ? `${quizStats.totalQuestions}-${quizStats.questionsAnswered}` : 'no-quiz';
    const flashcardStatsHash = flashcardStats ? `${flashcardStats.cardsStudied}-${flashcardStats.studiedCardIds?.length}` : 'no-flash';
    
    return {
      getSessionsByDateRange,
      quizStatsHash,
      flashcardStatsHash
    };
  }, [getSessionsByDateRange, quizStats, flashcardStats]);
  
  useEffect(() => {
    let isMounted = true;
    let loadingTimer: ReturnType<typeof setTimeout> | null = null;
    
    const fetchWeeklyStats = async () => {
      if (isMounted) {
        setLoading(true);
      }
      
      try {
        const { startOfWeek, endOfWeek, previousWeekStart, previousWeekEnd } = calculateWeekBoundaries();
        
        // Get this week's study sessions
        const thisWeekSessions = await getSessionsByDateRange(startOfWeek, endOfWeek);
        
        // Get previous week's study sessions for comparison
        const prevWeekSessions = await getSessionsByDateRange(previousWeekStart, previousWeekEnd);
        
        // Check if component is still mounted before updating state
        if (!isMounted) return;
        
        // Calculate combined stats from quiz and flashcard data for this week
        const cardsStudied = thisWeekSessions.reduce((total, session) =>
          total + (session.questions_answered || 0), 0);
        
        // Calculate retention rate from correct answers
        const totalAnswers = thisWeekSessions.reduce((total, session) =>
          total + (session.questions_answered || 0), 0);
        
        const correctAnswers = thisWeekSessions.reduce((total, session) =>
          total + (session.correct_answers || 0), 0);
        
        const retentionRate = totalAnswers > 0
          ? (correctAnswers / totalAnswers) * 100
          : 0;
        
        // Calculate review efficiency (questions per session)
        // Normalize to percentage where 10 questions per session is considered optimal (100%)
        const avgQuestionsPerSession = thisWeekSessions.length > 0
          ? cardsStudied / thisWeekSessions.length
          : 0;
          
        const reviewEfficiency = Math.min(100, Math.round(avgQuestionsPerSession / 10 * 100));
        
        // Calculate previous week metrics for comparison
        const prevCardsStudied = prevWeekSessions.reduce((total, session) =>
          total + (session.questions_answered || 0), 0);
        
        const prevTotalAnswers = prevWeekSessions.reduce((total, session) =>
          total + (session.questions_answered || 0), 0);
        
        const prevCorrectAnswers = prevWeekSessions.reduce((total, session) =>
          total + (session.correct_answers || 0), 0);
        
        const prevRetentionRate = prevTotalAnswers > 0
          ? (prevCorrectAnswers / prevTotalAnswers) * 100
          : 0;
        
        // Calculate previous week's review efficiency using same formula as current week
        const prevAvgQuestionsPerSession = prevWeekSessions.length > 0
          ? prevCardsStudied / prevWeekSessions.length
          : 0;
          
        const prevReviewEfficiency = Math.min(100, Math.round(prevAvgQuestionsPerSession / 10 * 100));
        
        // Use user-set goal or default to 0
        const weeklyGoal = 0; // This could be retrieved from user settings
        
        // Combine data from sessions and stats contexts
        const combinedCardsStudied = cardsStudied > 0
          ? cardsStudied
          : (flashcardStats?.cardsStudied || 0) + (quizStats?.questionsAnswered || 0);
          
        const combinedRetentionRate = retentionRate > 0
          ? Math.round(retentionRate)
          : (quizStats?.averageScore ? Math.round(quizStats.averageScore) : 0);
          
        const combinedReviewEfficiency = Math.min(100, Math.round(reviewEfficiency)) || 0; // No default if no data
        
        if (isMounted) {
          setWeeklyStats({
            cardsStudied: combinedCardsStudied,
            totalCards: weeklyGoal,
            retentionRate: combinedRetentionRate,
            reviewEfficiency: combinedReviewEfficiency,
            weekStartDate: startOfWeek,
            weekEndDate: endOfWeek,
            previousWeekStats: {
              cardsStudied: prevCardsStudied,
              retentionRate: Math.round(prevRetentionRate),
              reviewEfficiency: Math.min(100, Math.round(prevReviewEfficiency))
            }
          });
        }
      } catch (error) {
        console.error("Error fetching weekly stats:", error);
        
        // If there's an error fetching from API, fall back to context data
        if (isMounted) {
          const { startOfWeek, endOfWeek } = calculateWeekBoundaries();
          setWeeklyStats({
            cardsStudied: (flashcardStats?.cardsStudied || 0) + (quizStats?.questionsAnswered || 0),
            totalCards: 0, // No default weekly goal
            retentionRate: quizStats?.averageScore ? Math.round(quizStats.averageScore) : 0,
            reviewEfficiency: 0, // No default value
            weekStartDate: startOfWeek,
            weekEndDate: endOfWeek,
            previousWeekStats: {
              cardsStudied: 0,
              retentionRate: 0,
              reviewEfficiency: 0
            }
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Fetch data when component mounts or dependencies change
    fetchWeeklyStats();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, [memoizedDeps]); // Use the memoized dependencies for stability

  // Calculate the total collection size
  const totalCollectionSize = useMemo(() => {
    return (flashcardStats?.studiedCardIds?.length || 0) + (quizStats?.totalQuestions || 0);
  }, [flashcardStats, quizStats]);

  // Render the UI - always show content, never show loading state
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weekly Overview</h2>
        <div className="text-sm text-gray-500">
          Week of {formatDate(weeklyStats.weekStartDate)} - {formatDate(weeklyStats.weekEndDate)}
        </div>
      </div>
      
      {/* Always show content */}
      <>
          <div className="space-y-6">
            {/* Weekly Progress */}
            <ProgressSection
              title="Weekly Progress"
              value={weeklyStats.cardsStudied}
              total={weeklyStats.totalCards}
              color="text-blue-600"
              current={weeklyStats.cardsStudied}
              previous={weeklyStats.previousWeekStats?.cardsStudied}
              unit="cards"
            />
            
            {/* Retention Rate */}
            <ProgressSection
              title="Retention Rate"
              value={weeklyStats.retentionRate}
              color="text-green-600"
              current={weeklyStats.retentionRate}
              previous={weeklyStats.previousWeekStats?.retentionRate}
            />
            
            {/* Review Efficiency */}
            <ProgressSection
              title="Review Efficiency"
              value={weeklyStats.reviewEfficiency}
              color="text-purple-600"
              current={weeklyStats.reviewEfficiency}
              previous={weeklyStats.previousWeekStats?.reviewEfficiency}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Cards Studied This Week */}
            <StatsCard
              title="Cards Studied This Week"
              value={weeklyStats.cardsStudied}
              icon={<Target className="h-5 w-5 text-blue-600" />}
              bgColor="border-blue-200 bg-blue-50/30"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              extraContent={
                <div className="flex">
                  <span className="h-3 w-3 rounded-full bg-cyan-400 mr-1" title="Quiz"></span>
                  <span className="h-3 w-3 rounded-full bg-purple-400" title="Flashcard"></span>
                </div>
              }
            />
            
            {/* Total Collection Size */}
            <StatsCard
              title="Total Collection Size"
              value={totalCollectionSize}
              icon={<Calendar className="h-5 w-5 text-orange-600" />}
              bgColor="border-orange-200 bg-orange-50/30"
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>
      </>
    </div>
  );
}