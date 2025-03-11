import { CommonFields, CreateInsertType, CreateUpdateType } from '../common'

export interface NavyRank extends CommonFields {
  name: string
  imageUrl: string | null
  order: number
}

export type NavyRankTable = {
  Row: NavyRank
  Insert: CreateInsertType<NavyRank>
  Update: CreateUpdateType<NavyRank>
}