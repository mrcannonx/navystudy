"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import { useToast } from "@/contexts/toast-context"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Insignia {
  id: string
  rate: string
  image_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}

const NAVY_RATES = [
  "AB", "ABE", "ABF", "ABH", "AC", "AD", "AE", "AG", "AM", "AME", "AO", "AS", "ATI", "ATO",
  "AWF", "AWO", "AWR", "AWS", "AWV", "AZ", "BM", "BU", "CE", "CM", "CS", "CSS", "CTI",
  "CTM", "CTR", "CTT", "CWT", "DC", "EA", "EM", "EMN", "EN", "EO", "EOD", "ET", "ETN",
  "ETV", "FC", "FCA", "FT", "GM", "GSE", "GSM", "HM", "HT", "IC", "IS", "IT", "ITE",
  "ITN", "ITR", "LN", "LS", "LSS", "MA", "MC", "MM", "MMA", "MMN", "MN", "MR", "MT",
  "MU", "ND", "OS", "PR", "PS", "QM", "RP", "RS", "RW", "SB", "SO", "STG", "STS",
  "SW", "TM", "UT", "YN", "YNS"
] as const;

const RATE_LABELS: Record<string, string> = {
  'E1': 'Seaman Recruit',
  'E2': 'Seaman Apprentice',
  'E3': 'Seaman',
  'E4': 'Petty Officer Third Class',
  'E5': 'Petty Officer Second Class',
  'E6': 'Petty Officer First Class',
  'E7': 'Chief Petty Officer',
  'E8': 'Senior Chief Petty Officer',
  'E9': 'Master Chief Petty Officer',
  'W1': 'Warrant Officer 1',
  'W2': 'Chief Warrant Officer 2',
  'W3': 'Chief Warrant Officer 3',
  'W4': 'Chief Warrant Officer 4',
  'W5': 'Chief Warrant Officer 5',
  'O1': 'Ensign',
  'O2': 'Lieutenant Junior Grade',
  'O3': 'Lieutenant',
  'O4': 'Lieutenant Commander',
  'O5': 'Commander',
  'O6': 'Captain',
  'O7': 'Rear Admiral Lower Half',
  'O8': 'Rear Admiral Upper Half',
  'O9': 'Vice Admiral',
  'O10': 'Admiral'
};

export function InsigniaManager() {
  const [insignias, setInsignias] = useState<Insignia[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchInsignias()
  }, [])

  const fetchInsignias = async () => {
    try {
      const { data, error } = await supabase
        .from('insignias')
        .select('*')
        .order('rate')

      if (error) throw error
      setInsignias(data || [])
    } catch (error) {
      console.error('Error fetching insignias:', error)
      addToast({
        title: "Error",
        description: "Failed to load insignias",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File, rate: string) => {
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      setUploading(rate)

      // First, ensure the insignia record exists
      const { data: existingInsignia, error: checkError } = await supabase
        .from('insignias')
        .select('*')
        .eq('rate', rate)
        .single()

      let insigniaId: string
      if (checkError) {
        // Create new insignia record if it doesn't exist
        const { data: newInsignia, error: createError } = await supabase
          .from('insignias')
          .insert({
            rate: rate,
            active: true
            // Let the database generate the UUID
          })
          .select()
          .single()

        if (createError) {
          console.error('Create error:', createError)
          throw new Error(`Failed to create insignia record: ${createError.message}`)
        }
        if (!newInsignia) throw new Error('Failed to create insignia record')
        insigniaId = newInsignia.id
      } else {
        if (!existingInsignia) throw new Error('Failed to find existing insignia')
        insigniaId = existingInsignia.id
      }

      const fileExt = file.name.split('.').pop()
      // Add timestamp to filename to make it unique and avoid RLS policy issues
      const timestamp = new Date().getTime()
      const fileName = `${rate}_${timestamp}.${fileExt}`

      console.log('Uploading file:', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        rate,
        insigniaId
      })

      // Check if file already exists in storage
      const { data: existingFiles } = await supabase.storage
        .from('insignia')
        .list('', {
          search: fileName
        });
      
      console.log('Checking if file already exists in storage:', existingFiles);
      
      // Upload the file
      console.log('Attempting to upload file with options:', {
        fileName,
        upsert: true,
        contentType: file.type,
        fileExists: existingFiles && existingFiles.length > 0
      });
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('insignia')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      console.log('Upload response:', uploadData || 'No data returned');
      
      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          name: uploadError.name,
          // Log the entire error object to see all available properties
          fullError: JSON.stringify(uploadError)
        });
        throw new Error(`Error uploading insignia image: ${uploadError.message}`)
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('insignia')
        .getPublicUrl(fileName)

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image')
      }

      console.log('File uploaded, public URL:', urlData.publicUrl)

      // Update the insignia record with the new image URL
      const { error: updateError } = await supabase
        .from('insignias')
        .update({ image_url: urlData.publicUrl })
        .eq('id', insigniaId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error(`Error updating insignia record: ${updateError.message}`)
      }

      addToast({
        title: "Success",
        description: "Insignia image updated successfully"
      })

      fetchInsignias()
    } catch (error) {
      console.error('Error uploading insignia image:', error)
      addToast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload insignia image",
        variant: "destructive"
      })
    } finally {
      setUploading(null)
    }
  }

  const toggleActive = async (insigniaId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('insignias')
        .update({ active: !currentActive })
        .eq('id', insigniaId)

      if (error) throw error

      addToast({
        title: "Success",
        description: `Insignia ${currentActive ? 'deactivated' : 'activated'}`
      })

      fetchInsignias()
    } catch (error) {
      console.error('Error toggling insignia status:', error)
      addToast({
        title: "Error",
        description: "Failed to update insignia status",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {NAVY_RATES.map((rate) => {
          const insignia = insignias.find(i => i.rate === rate) || {
            id: rate,
            rate,
            image_url: null,
            active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          return (
            <Card key={insignia.id} className="p-4 flex flex-col">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-center">
                  <Label className="text-xl font-bold">{rate}</Label>
                </div>

                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                  {insignia.image_url ? (
                    <Image
                      src={insignia.image_url}
                      alt={`${insignia.rate} insignia`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`insignia-${insignia.rate}`}
                    className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800"
                  >
                    {uploading === insignia.rate ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Upload Insignia</span>
                      </>
                    )}
                    <input
                      id={`insignia-${insignia.rate}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, insignia.rate)
                      }}
                      disabled={uploading === insignia.rate}
                    />
                  </Label>
                  {insignia.image_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                      onClick={async () => {
                        try {
                          console.log('Attempting to delete image for insignia:', insignia.id, 'with rate:', insignia.rate);
                          
                          // First, get the file extension from the current image URL
                          const currentImageUrl = insignia.image_url;
                          console.log('Current image URL:', currentImageUrl);
                          
                          if (currentImageUrl) {
                            // Extract filename from URL
                            const urlParts = currentImageUrl.split('/');
                            const filename = urlParts[urlParts.length - 1];
                            console.log('Extracted filename:', filename);
                            
                            // Try to delete the file from storage first
                            const { error: storageError } = await supabase.storage
                              .from('insignia')
                              .remove([filename]);
                            
                            console.log('Storage deletion result:', storageError ? `Error: ${storageError.message}` : 'Success');
                            
                            // If there was an error deleting the file, log it but continue with the database update
                            if (storageError) {
                              console.warn('Warning: Could not delete file from storage, but will continue with database update:', storageError.message);
                            }
                          }
                          
                          // Then update the database record
                          const { error } = await supabase
                            .from('insignias')
                            .update({ image_url: null })
                            .eq('id', insignia.id);
                          
                          if (error) throw error;
                          console.log('Database record updated successfully');
                          
                          fetchInsignias();
                        } catch (error) {
                          console.error('Error removing image:', error);
                          addToast({
                            title: "Error",
                            description: "Failed to remove image",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <Button
                variant={insignia.active ? "default" : "secondary"}
                className={cn(
                  "w-full mt-4",
                  insignia.active 
                    ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" 
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                )}
                onClick={() => toggleActive(insignia.id, insignia.active)}
              >
                {insignia.active ? 'Active' : 'Inactive'}
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 