"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { useToast } from "@/contexts/toast-context"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface NavyRank {
  id: string
  rank: string
  image_url: string | null
  description: string | null
  active: boolean
}

export function NavyRankManager() {
  const [navyRanks, setNavyRanks] = useState<NavyRank[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchNavyRanks()
  }, [])

  const fetchNavyRanks = async () => {
    try {
      const { data, error } = await supabase
        .from('navy_ranks')
        .select('*')
        .order('rank_code')

      if (error) throw error
      setNavyRanks(data || [])
    } catch (error) {
      console.error('Error fetching navy ranks:', error)
      addToast({
        title: "Error",
        description: "Failed to load navy ranks",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, navyRankId: string) => {
    try {
      setUploading(navyRankId)

      const fileExt = file.name.split('.').pop()
      const fileName = `${navyRankId}.${fileExt}`

      console.log('Attempting to upload file:', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        navyRankId
      })

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('navy-rank-manager')
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          error: uploadError,
          name: uploadError.name,
        })
        throw uploadError
      }

      console.log('File uploaded successfully:', uploadData)

      const { data: { publicUrl } } = supabase.storage
        .from('navy-rank-manager')
        .getPublicUrl(fileName)

      console.log('Generated public URL:', publicUrl)

      const { data: updateData, error: updateError } = await supabase
        .from('navy_ranks')
        .update({ image_url: publicUrl })
        .eq('id', navyRankId)

      if (updateError) {
        console.error('Database update error:', {
          error: updateError,
          message: updateError.message
        })
        throw updateError
      }

      console.log('Database updated successfully:', updateData)

      addToast({
        title: "Success",
        description: "Navy rank image updated successfully"
      })

      fetchNavyRanks()
    } catch (error) {
      console.error('Error uploading navy rank image:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload navy rank image",
        variant: "destructive"
      })
    } finally {
      setUploading(null)
    }
  }

  const handleDescriptionUpdate = async (navyRankId: string, description: string) => {
    try {
      const { error } = await supabase
        .from('navy_ranks')
        .update({ description })
        .eq('id', navyRankId)

      if (error) throw error

      addToast({
        title: "Success",
        description: "Navy rank description updated"
      })

      fetchNavyRanks()
    } catch (error) {
      console.error('Error updating navy rank description:', error)
      addToast({
        title: "Error",
        description: "Failed to update navy rank description",
        variant: "destructive"
      })
    }
  }

  const toggleActive = async (navyRankId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('navy_ranks')
        .update({ active: !currentActive })
        .eq('id', navyRankId)

      if (error) throw error

      addToast({
        title: "Success",
        description: `Navy rank ${currentActive ? 'deactivated' : 'activated'}`
      })

      fetchNavyRanks()
    } catch (error) {
      console.error('Error toggling navy rank status:', error)
      addToast({
        title: "Error",
        description: "Failed to update navy rank status",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Navy Rank Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {navyRanks.map((navyRank) => (
          <Card key={navyRank.id} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Rank {navyRank.rank}</Label>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                {navyRank.image_url ? (
                  <Image
                    src={navyRank.image_url}
                    alt={`${navyRank.rank} navy rank`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={`navy-rank-${navyRank.id}`}
                  className="flex-1 px-3 py-2 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  {uploading === navyRank.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <input
                    id={`navy-rank-${navyRank.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file, navyRank.id)
                    }}
                    disabled={uploading === navyRank.id}
                  />
                </Label>
                {navyRank.image_url && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={async () => {
                      try {
                        const { error } = await supabase
                          .from('navy_ranks')
                          .update({ image_url: null })
                          .eq('id', navyRank.id)
                        
                        if (error) throw error
                        fetchNavyRanks()
                      } catch (error) {
                        console.error('Error removing image:', error)
                        addToast({
                          title: "Error",
                          description: "Failed to remove image",
                          variant: "destructive"
                        })
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${navyRank.id}`}>Description</Label>
              <Input
                id={`description-${navyRank.id}`}
                value={navyRank.description || ''}
                onChange={(e) => handleDescriptionUpdate(navyRank.id, e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <Button
              variant={navyRank.active ? "default" : "secondary"}
              className="w-full"
              onClick={() => toggleActive(navyRank.id, navyRank.active)}
            >
              {navyRank.active ? 'Active' : 'Inactive'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}