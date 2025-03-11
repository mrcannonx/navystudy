"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/contexts/toast-context"
import { NavyRating, ParentRatingOption } from "./types"
import { fetchRatings } from "./api-service"
import { RatingForm } from "./components/RatingForm"
import { RatingsList } from "./components/RatingsList"

export default function NavyRatingsPage() {
  const [ratings, setRatings] = useState<NavyRating[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRating, setSelectedRating] = useState<NavyRating | null>(null)
  const [parentRatings, setParentRatings] = useState<ParentRatingOption[]>([])
  const { addToast } = useToast()

  // Fetch ratings on component mount
  useEffect(() => {
    loadRatings()
  }, [])

  // Update parent ratings options when ratings change
  useEffect(() => {
    const options = ratings
      .filter(rating => !rating.is_variation)
      .map(rating => ({
        value: rating.abbreviation,
        label: `${rating.abbreviation} - ${rating.name}`
      }))
    
    setParentRatings(options)
  }, [ratings])

  // Load ratings from API
  const loadRatings = async () => {
    setLoading(true)
    try {
      const data = await fetchRatings()
      setRatings(data)
    } catch (error: any) {
      console.error('Error fetching ratings:', error)
      addToast({
        title: "Error",
        description: "Failed to fetch ratings: " + error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle selecting a rating for editing
  const handleSelectRating = (rating: NavyRating) => {
    console.log("Selected rating for editing:", rating)
    setSelectedRating(rating)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Navy Ratings Management</h1>
          <p className="text-muted-foreground">
            Create, update, and manage Navy ratings and their details.
          </p>
        </div>
        <Button
          onClick={() => window.location.href = "/admin/navy-ratings-generator"}
          className="ml-auto"
        >
          Content Generator
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Rating Form */}
        <RatingForm
          selectedRating={selectedRating}
          setSelectedRatingAction={setSelectedRating}
          parentRatings={parentRatings}
          onRatingUpdatedAction={loadRatings}
        />

        {/* Ratings List */}
        <RatingsList
          ratings={ratings}
          loading={loading}
          onSelectRatingAction={handleSelectRating}
          onRefreshAction={loadRatings}
        />
      </div>
    </div>
  )
}