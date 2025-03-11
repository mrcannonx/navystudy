import { CommonFields, CreateInsertType, CreateUpdateType } from '../common'

export interface Insignia extends CommonFields {
  name: string
  imageUrl: string | null
  order: number
}

export type InsigniaTable = {
  Row: Insignia
  Insert: CreateInsertType<Insignia>
  Update: CreateUpdateType<Insignia>
}
