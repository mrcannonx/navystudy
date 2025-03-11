import { CommonFields, CreateInsertType, CreateUpdateType } from '../common'

export interface Chevron extends CommonFields {
  name: string
  imageUrl: string | null
  order: number
}

export type ChevronTable = {
  Row: Chevron
  Insert: CreateInsertType<Chevron>
  Update: CreateUpdateType<Chevron>
}
