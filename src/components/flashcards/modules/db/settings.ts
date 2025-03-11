import { supabase } from "@/lib/supabase"
import { StudySettings } from "../types"

export async function fetchStudySettings(userId: string) {
  const { data, error } = await supabase
    .from('flashcard_study_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') throw error
  return data?.settings
}

export async function saveStudySettings(userId: string, settings: StudySettings) {
  const { error } = await supabase
    .from('flashcard_study_settings')
    .upsert({
      user_id: userId,
      settings,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (error) throw error
} 