import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Interface for Navy rating data
 */
export interface NavyRating {
  id: number;
  abbreviation: string;
  name: string;
  description: string;
  keywords: string[];
  common_achievements: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Get a Navy rating by abbreviation
 */
export async function getNavyRatingByAbbreviation(abbreviation: string): Promise<NavyRating | null> {
  try {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('navy_ratings')
      .select('*')
      .eq('abbreviation', abbreviation)
      .single();
    
    if (error) {
      console.error('Error fetching Navy rating:', error);
      return null;
    }
    
    return data as NavyRating;
  } catch (error) {
    console.error('Unexpected error fetching Navy rating:', error);
    return null;
  }
}

/**
 * Get all Navy ratings
 */
export async function getAllNavyRatings(): Promise<NavyRating[]> {
  try {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('navy_ratings')
      .select('*')
      .order('abbreviation');
    
    if (error) {
      console.error('Error fetching Navy ratings:', error);
      return [];
    }
    
    return data as NavyRating[];
  } catch (error) {
    console.error('Unexpected error fetching Navy ratings:', error);
    return [];
  }
}

/**
 * Search Navy ratings by keyword
 */
export async function searchNavyRatings(query: string): Promise<NavyRating[]> {
  try {
    const supabase = createClientComponentClient();
    
    const { data, error } = await supabase
      .from('navy_ratings')
      .select('*')
      .or(`name.ilike.%${query}%,abbreviation.ilike.%${query}%,description.ilike.%${query}%`)
      .order('abbreviation');
    
    if (error) {
      console.error('Error searching Navy ratings:', error);
      return [];
    }
    
    return data as NavyRating[];
  } catch (error) {
    console.error('Unexpected error searching Navy ratings:', error);
    return [];
  }
}