import { CommonFields, CreateInsertType, CreateUpdateType } from '../common'
import { SessionData } from '../activities'

export interface StudySession extends CommonFields {
  user_id: string
  content_id: string | null
  content_type: 'quiz' | 'flashcard'
  session_data: SessionData
  completed_at: string | null
}

export type StudySessionTable = {
  Row: StudySession
  Insert: CreateInsertType<StudySession>
  Update: CreateUpdateType<StudySession>
}
