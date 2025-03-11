import { CommonFields, CreateInsertType, CreateUpdateType, Json } from '../common'

export interface Quiz extends CommonFields {
  title: string
  description: string
  questions: Json
  user_id: string
}

export type QuizTable = {
  Row: Quiz
  Insert: CreateInsertType<Quiz>
  Update: CreateUpdateType<Quiz>
}
