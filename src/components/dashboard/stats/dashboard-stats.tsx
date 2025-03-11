import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStatistics } from "@/contexts/statistics-context";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { formatStudyTime } from "@/utils/analytics";
import { Clock, Calendar, Target, BookOpen } from "lucide-react";

// Import our modularized components
import { StatCard } from "./ui";
import { fetchTotalQuizQuestions, fetchTotalFlashcards } from "./data";
import { QuizStats, FlashcardStats } from "./sections";

/**
 * DashboardStats component displays all statistics for the user's dashboard
 */
export function DashboardStats() {
  const { analytics, activityStats, isLoading } = useAnalyticsData();
  const { quizStats, flashcardStats } = useStatistics();
  
  // Use state to store the fetched values
  const [totalQuizQuestions, setTotalQuizQuestions] = useState(0);
  const [totalFlashcards, setTotalFlashcards] = useState(0);
  
  // Format study time from seconds to hours/minutes
  const { hours, minutes } = formatStudyTime(analytics?.totalStudyTime || 0);
  
  // Fetch the data when the component mounts
  useEffect(() => {
    fetchTotalQuizQuestions().then(setTotalQuizQuestions);
    fetchTotalFlashcards().then(setTotalFlashcards);
  }, []);
  
  // Format the last session date
  const lastSessionDate = activityStats?.lastActivity || quizStats?.lastStudied || flashcardStats?.lastStudied;
  const lastSession = lastSessionDate
    ? new Date(lastSessionDate).toLocaleDateString()
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Top stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Total Quiz Questions"
          value={totalQuizQuestions.toString()}
          color="purple"
        />
        <StatCard
          icon={BookOpen}
          label="Total Flashcards"
          value={totalFlashcards.toString()}
          color="cyan"
        />
        <StatCard
          icon={Clock}
          label="Total Study Time"
          value={`${hours}h ${minutes}m`}
          color="emerald"
        />
        <StatCard
          icon={Calendar}
          label="Last Session"
          value={lastSession}
          color="amber"
        />
      </div>

      {/* Learning Statistics section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Learning Statistics</h2>
        
        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="quiz" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Quiz Stats</TabsTrigger>
            <TabsTrigger value="flashcard" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Flashcard Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            <QuizStats />
          </TabsContent>
          <TabsContent value="flashcard">
            <FlashcardStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}