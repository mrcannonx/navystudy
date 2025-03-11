export type NavyRating = {
  id: number
  abbreviation: string
  name: string
  description: string
  keywords: string[]
  common_achievements: string[]
  parent_rating?: string
  service_rating: string
  is_variation: boolean
  created_at: string
  updated_at: string
}

export type FormValues = {
  abbreviation: string
  name: string
  description: string
  keywords: string
  common_achievements: string
  parent_rating: string
  service_rating: string
  is_variation: boolean
}

export type ParentRatingOption = {
  value: string
  label: string
}