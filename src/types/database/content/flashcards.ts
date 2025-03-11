import { CommonFields, CreateInsertType, CreateUpdateType, Json } from '../common'

export interface Flashcard extends CommonFields {
  title: string
  description: string
  cards: Json
  user_id: string
  current_cycle: number
  shown_cards_in_cycle: string[]
}

export type FlashcardTable = {
  Row: Flashcard
  Insert: CreateInsertType<Flashcard>
  Update: CreateUpdateType<Flashcard>
}
