"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/contexts/toast-context"
import { NavyRating } from "../types"
import { deleteRating } from "../api-service"

interface RatingsListProps {
  ratings: NavyRating[]
  loading: boolean
  onSelectRatingAction: (rating: NavyRating) => void
  onRefreshAction: () => Promise<void>
}

export function RatingsList({
  ratings,
  loading,
  onSelectRatingAction,
  onRefreshAction
}: RatingsListProps) {
  const { addToast } = useToast()

  // Handle rating deletion
  const handleDeleteRating = async (id: number) => {
    if (!confirm("Are you sure you want to delete this rating?")) return

    try {
      await deleteRating(id)
      
      addToast({
        title: "Success",
        description: "Rating deleted successfully",
      })
      
      // Refresh the ratings list
      await onRefreshAction()
    } catch (error: any) {
      console.error('Error deleting rating:', error)
      addToast({
        title: "Error",
        description: "Failed to delete rating: " + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navy Ratings</CardTitle>
        <CardDescription>
          All available Navy ratings in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">Loading ratings...</div>
        ) : (
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableCaption>List of Navy ratings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Abbreviation</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ratings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No ratings found
                    </TableCell>
                  </TableRow>
                ) : (
                  ratings.map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell className="font-medium">{rating.abbreviation}</TableCell>
                      <TableCell>{rating.name}</TableCell>
                      <TableCell>
                        {rating.is_variation ? (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Sub-Rating
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Main Rating
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onSelectRatingAction(rating)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteRating(rating.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRefreshAction}>
          Refresh List
        </Button>
        <div className="text-sm text-muted-foreground">
          Total: {ratings.length} ratings
        </div>
      </CardFooter>
    </Card>
  )
}