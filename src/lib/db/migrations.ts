import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function applyCardMetricsMigration() {
  try {
    // Add the columns if they don't exist
    const { error: alterError } = await supabase.rpc('add_card_metrics_columns');
    
    if (alterError) {
      console.error('Error adding card metrics columns:', alterError);
      return false;
    }

    // Update existing records
    const { error: updateError } = await supabase
      .from('daily_study_time')
      .update({ 
        cards_viewed: 0,
        cards_completed: 0 
      })
      .is('cards_viewed', null)
      .is('cards_completed', null);

    if (updateError) {
      console.error('Error updating existing records:', updateError);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error applying card metrics migration:', err);
    return false;
  }
} 