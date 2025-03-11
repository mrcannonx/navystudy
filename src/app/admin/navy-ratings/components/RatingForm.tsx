"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/contexts/toast-context"
import { NavyRating, FormValues, ParentRatingOption } from "../types"
import { prepareRatingData, createRating, updateRating } from "../api-service"

interface RatingFormProps {
  selectedRating: NavyRating | null
  setSelectedRatingAction: (rating: NavyRating | null) => void
  parentRatings: ParentRatingOption[]
  onRatingUpdatedAction: () => void
}

export function RatingForm({
  selectedRating,
  setSelectedRatingAction,
  parentRatings,
  onRatingUpdatedAction
}: RatingFormProps) {
  const { addToast } = useToast()
  
  // Form state
  const [formData, setFormData] = useState<FormValues>({
    abbreviation: "",
    name: "",
    description: "",
    keywords: "",
    common_achievements: "",
    parent_rating: "",
    service_rating: "",
    is_variation: false,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Update form when selected rating changes
  useEffect(() => {
    if (selectedRating) {
      setFormData({
        abbreviation: selectedRating.abbreviation,
        name: selectedRating.name,
        description: selectedRating.description,
        keywords: selectedRating.keywords.join(', '),
        common_achievements: selectedRating.common_achievements.join('\n'),
        parent_rating: selectedRating.parent_rating || "",
        service_rating: selectedRating.service_rating,
        is_variation: selectedRating.is_variation,
      })
    }
  }, [selectedRating])

  // Handle form input changes
  const handleInputChange = (field: keyof FormValues, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.abbreviation) errors.abbreviation = "Abbreviation is required"
    if (!formData.name) errors.name = "Name is required"
    if (!formData.description) errors.description = "Description is required"
    if (!formData.keywords) errors.keywords = "Keywords are required"
    if (!formData.common_achievements) errors.common_achievements = "Common achievements are required"
    if (!formData.service_rating) errors.service_rating = "Service rating is required"
    if (formData.is_variation && !formData.parent_rating) errors.parent_rating = "Parent rating is required for sub-ratings"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Reset the form and clear selection
  const resetForm = () => {
    setFormData({
      abbreviation: "",
      name: "",
      description: "",
      keywords: "",
      common_achievements: "",
      parent_rating: "",
      service_rating: "",
      is_variation: false,
    })
    setFormErrors({})
    setSelectedRatingAction(null)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      const ratingData = prepareRatingData(formData)
      
      let data;
      if (selectedRating) {
        // Update existing rating
        data = await updateRating(selectedRating.id, ratingData)
      } else {
        // Create new rating
        data = await createRating(ratingData)
      }
      
      addToast({
        title: "Success",
        description: `Rating ${formData.abbreviation} ${selectedRating ? 'updated' : 'created'} successfully`,
      })
      
      // Reset form and refresh ratings
      resetForm()
      onRatingUpdatedAction()
    } catch (error: any) {
      console.error('Error saving rating:', error)
      addToast({
        title: "Error",
        description: "Failed to save rating: " + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedRating ? "Edit Rating" : "Add New Rating"}</CardTitle>
        <CardDescription>
          {selectedRating 
            ? `Editing ${selectedRating.abbreviation} - ${selectedRating.name}` 
            : "Create a new Navy rating"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="abbreviation">Abbreviation</Label>
              <Input
                id="abbreviation"
                placeholder="AB"
                value={formData.abbreviation}
                onChange={(e) => handleInputChange('abbreviation', e.target.value)}
              />
              {formErrors.abbreviation && (
                <p className="text-sm text-red-500">{formErrors.abbreviation}</p>
              )}
            </div>
            
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <Checkbox
                id="is_variation"
                checked={formData.is_variation}
                onCheckedChange={(checked) => handleInputChange('is_variation', !!checked)}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="is_variation">Is Sub-Rating</Label>
                <p className="text-sm text-muted-foreground">
                  Check if this is a sub-rating of another rating
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Aviation Boatswain's Mate"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {formErrors.name && (
              <p className="text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_rating">Service Rating</Label>
            <Select
              value={formData.service_rating}
              onValueChange={(value) => handleInputChange('service_rating', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aviation">Aviation</SelectItem>
                <SelectItem value="Surface">Surface</SelectItem>
                <SelectItem value="Submarine">Submarine</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Supply">Supply</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Combat Systems">Combat Systems</SelectItem>
                <SelectItem value="Information Warfare">Information Warfare</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="Ordnance">Ordnance</SelectItem>
                <SelectItem value="Seabee">Seabee</SelectItem>
                <SelectItem value="Special Warfare">Special Warfare</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.service_rating && (
              <p className="text-sm text-red-500">{formErrors.service_rating}</p>
            )}
          </div>

          {formData.is_variation && (
            <div className="space-y-2">
              <Label htmlFor="parent_rating">Parent Rating</Label>
              <Select
                value={formData.parent_rating}
                onValueChange={(value) => handleInputChange('parent_rating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent rating" />
                </SelectTrigger>
                <SelectContent>
                  {parentRatings.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Required for sub-ratings
              </p>
              {formErrors.parent_rating && (
                <p className="text-sm text-red-500">{formErrors.parent_rating}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the rating's responsibilities"
              className="min-h-[100px]"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            {formErrors.description && (
              <p className="text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Textarea
              id="keywords"
              placeholder="aircraft handling, flight deck operations, catapults"
              className="min-h-[80px]"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of keywords
            </p>
            {formErrors.keywords && (
              <p className="text-sm text-red-500">{formErrors.keywords}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="common_achievements">Common Achievements</Label>
            <Textarea
              id="common_achievements"
              placeholder="Supervised flight deck operations involving ## personnel
Maintained ## pieces of aircraft handling equipment at ##% operational readiness"
              className="min-h-[150px]"
              value={formData.common_achievements}
              onChange={(e) => handleInputChange('common_achievements', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              One achievement per line. Use ## as placeholders for numbers.
            </p>
            {formErrors.common_achievements && (
              <p className="text-sm text-red-500">{formErrors.common_achievements}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedRating ? "Update Rating" : "Create Rating"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}