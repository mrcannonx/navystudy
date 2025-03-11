import { CommonFields, CreateInsertType, CreateUpdateType } from '../common'

export interface Rank extends CommonFields {
  name: string
  imageUrl: string | null
  order: number
}

export type RankTable = {
  Row: Rank
  Insert: CreateInsertType<Rank>
  Update: CreateUpdateType<Rank>
}
