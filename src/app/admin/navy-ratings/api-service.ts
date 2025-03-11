"use client"

import { NavyRating, FormValues } from "./types"

export const fetchRatings = async (): Promise<NavyRating[]> => {
  try {
    console.log("Fetching ratings from API...")
    const response = await fetch('/api/admin/navy-ratings')
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch ratings')
    }
    
    const data = await response.json()
    console.log("Ratings fetched successfully:", data)
    return data || []
  } catch (error: any) {
    console.error('Error fetching ratings:', error)
    throw error
  }
}

export const createRating = async (ratingData: any): Promise<NavyRating[]> => {
  console.log("Creating new rating")
  const response = await fetch('/api/admin/navy-ratings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ratingData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to save rating')
  }

  return await response.json()
}

export const updateRating = async (id: number, ratingData: any): Promise<NavyRating[]> => {
  console.log("Updating existing rating with ID:", id)
  
  const response = await fetch('/api/admin/navy-ratings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      ...ratingData
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to save rating')
  }

  return await response.json()
}

export const deleteRating = async (id: number): Promise<void> => {
  console.log("Deleting rating with ID:", id)
  const response = await fetch(`/api/admin/navy-ratings?id=${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete rating')
  }
}

export const prepareRatingData = (formData: FormValues) => {
  // Convert keywords and common_achievements from string to array
  const keywordsArray = formData.keywords.split(',').map(k => k.trim())
  const achievementsArray = formData.common_achievements.split('\n').map(a => a.trim()).filter(a => a)

  return {
    abbreviation: formData.abbreviation,
    name: formData.name,
    description: formData.description,
    keywords: keywordsArray,
    common_achievements: achievementsArray,
    parent_rating: formData.parent_rating || null,
    service_rating: formData.service_rating,
    is_variation: formData.is_variation,
    updated_at: new Date().toISOString()
  }
}