export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Common table fields that most tables share
export interface CommonFields {
  id: string
  created_at: string
}

// Helper type to create Insert types
export type CreateInsertType<T> = Omit<T, 'id' | 'created_at'>

// Helper type to create Update types
export type CreateUpdateType<T> = Partial<Omit<T, 'id' | 'created_at'>>
