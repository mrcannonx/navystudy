import { Clock, Flame, BookOpen, LineChart } from "lucide-react";
import { useStatistics } from "@/contexts/statistics-context";
import { StatItem } from "../ui";

/**
 * FlashcardStats component displays statistics related to flashcard performance
 */
export function FlashcardStats() {
  const { flashcardStats } = useStatistics();
  
  // Study streak - consecutive days with flashcard sessions
  const studyStreak = flashcardStats?.streak || 0;
  
  // Cards completed - total cards studied
  const cardsCompleted = flashcardStats?.cardsStudied || 0;
  
  // Time spent - format from seconds to minutes
  const timeSpentMinutes = Math.floor((flashcardStats?.timeSpent || 0) / 60);
  
  // Calculate confidence rating based on actual confidence ratings
  const calculateConfidenceRating = () => {
    const confidenceRatings = flashcardStats?.confidenceRatings || {};
    const ratings = Object.values(confidenceRatings);
    
    if (ratings.length === 0) return 0;
    
    // Count high confidence ratings (3 or higher)
    const highConfidenceCount = ratings.filter(rating => {
      if (typeof rating === 'number') {
        return rating >= 3;
      }
      return false;
    }).length;
    
    // Calculate percentage of high confidence ratings
    return Math.round((highConfidenceCount / ratings.length) * 100);
  };
  
  const confidenceRating = calculateConfidenceRating();
  
  // Create the progress bar for confidence ratings
  const confidenceProgressBar = (
    <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-1.5">
      <div
        className="bg-emerald-500 h-1.5 rounded-full"
        style={{ width: `${confidenceRating}%` }}
      />
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      <StatItem
        icon={Flame}
        label="Study Streak"
        value={`${studyStreak} days`}
        color="amber"
      />
      <StatItem
        icon={BookOpen}
        label="Cards Completed"
        value={cardsCompleted.toString()}
        color="blue"
      />
      <StatItem
        icon={Clock}
        label="Time Spent"
        value={`${timeSpentMinutes} mins`}
        color="purple"
      />
      <StatItem
        icon={LineChart}
        label="Confidence Ratings"
        value={`${confidenceRating}%`}
        color="emerald"
        visualIndicator={confidenceProgressBar}
        tooltip="Percentage of cards rated with high confidence (3+ out of 5)"
      />
    </div>
  );
}