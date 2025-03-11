import { SupabaseClient } from '@supabase/supabase-js'
// Re-export everything with explicit names to avoid conflicts
import { fetchStatistics as fetchOverallStatistics } from './overall'
import { updateStatistics as updateOverallStatistics } from './overall'
import { cleanupDuplicateOverallStatistics } from './overall'

import { fetchDeckStatistics } from './deck'
import { updateDeckStatistics, resetDeckStatistics } from './deck'

// Alias exports for backward compatibility
export const fetchFlashcardStatistics = fetchOverallStatistics
export const updateStatistics = updateOverallStatistics

export {
  // Overall statistics
  fetchOverallStatistics,
  updateOverallStatistics,
  cleanupDuplicateOverallStatistics,
  
  // Deck statistics
  fetchDeckStatistics,
  updateDeckStatistics,
  resetDeckStatistics,
}

// Re-export types
export * from './types'
export * from './constants'
export * from './defaults'

export async function recordFlashcardAnalytics(
  supabase: SupabaseClient,
  timeSpent: number,
  topic: string
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    const studyDate = new Date().toISOString().split('T')[0];
    const hourOfDay = new Date().getHours();
    const minutesSpent = Math.max(1, Math.round(timeSpent / 60));

    const { error } = await supabase
      .from('study_time_distribution')
      .insert({
        user_id: user.id,
        study_date: studyDate,
        hour_of_day: hourOfDay,
        minutes_spent: minutesSpent,
      });

    if (error) {
      console.error('Error recording analytics:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in recordFlashcardAnalytics:', error);
    throw error;
  }
} 