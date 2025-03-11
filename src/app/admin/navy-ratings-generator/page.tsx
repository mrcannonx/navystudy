"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useToast } from "@/contexts/toast-context"
import { db } from "@/lib/db"

type NavyRating = {
  id: number
  abbreviation: string
  name: string
  description?: string
  keywords?: string[]
  common_achievements?: string[]
  parent_rating?: string
  service_rating: string
  is_variation: boolean
}

export default function NavyRatingsGeneratorPage() {
  const [ratings, setRatings] = useState<NavyRating[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedRating, setSelectedRating] = useState("")
  const [serviceRating, setServiceRating] = useState("")
  const [inputText, setInputText] = useState("")
  const [generatedContent, setGeneratedContent] = useState({
    description: "",
    keywords: "",
    achievements: ""
  })
  const { addToast } = useToast()

  // Fetch ratings on component mount
  useEffect(() => {
    fetchRatings()
  }, []) // Add empty dependency array to run only once on mount

  // Fetch all ratings from the database
  const fetchRatings = async () => {
    setLoading(true)
    try {
      const { data, error } = await db
        .from('navy_ratings')
        .select('*')
        .order('abbreviation', { ascending: true })

      if (error) throw error
      setRatings(data || [])
    } catch (error) {
      console.error('Error fetching ratings:', error)
      addToast({
        title: "Error",
        description: "Failed to fetch ratings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!inputText.trim()) {
      addToast({
        title: "Error",
        description: "Please enter text about the rating",
        variant: "destructive",
      })
      return
    }

    setGenerating(true)
    try {
      // Call our API endpoint to generate content
      const response = await fetch('/api/generate-rating-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ratingAbbreviation: selectedRating,
          serviceRating: serviceRating,
          inputText: inputText,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      setGeneratedContent({
        description: data.description,
        keywords: data.keywords,
        achievements: data.achievements,
      });
      
      addToast({
        title: "Success",
        description: "Content generated successfully",
      })
      
      setGenerating(false)
      
    } catch (error) {
      console.error('Error generating content:', error)
      addToast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      })
      setGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const formatAndCopyAchievements = (text: string) => {
    if (!text) return;
    
    // Common verbs that typically start achievement statements
    const achievementStartingVerbs = [
      'Safely', 'Maintained', 'Conducted', 'Supervised', 'Qualified', 'Oversaw',
      'Led', 'Managed', 'Responded', 'Trained', 'Spearheaded', 'Implemented',
      'Developed', 'Executed', 'Coordinated', 'Performed', 'Directed', 'Ensured',
      'Established', 'Facilitated', 'Improved', 'Increased', 'Reduced', 'Streamlined',
      'Spotted', 'Operated', 'Supported'
    ];
    
    // Create a regex pattern to find achievement starts
    const verbPattern = achievementStartingVerbs.join('|');
    const achievementStartRegex = new RegExp(`(^|\\s+)(${verbPattern})\\b`, 'g');
    
    // First, normalize spaces
    let normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Add periods after each achievement
    // First, mark where each achievement starts
    let markedText = ' ' + normalizedText; // Add space at beginning to help with regex
    markedText = markedText.replace(achievementStartRegex, '|||$2');
    
    // Split by the markers
    const achievements = markedText.split('|||')
      .map(part => part.trim())
      .filter(part => part.length > 0);
    
    // Format each achievement with a period at the end
    const formattedAchievements = achievements.map(achievement => {
      let formatted = achievement.trim();
      // Remove any trailing punctuation
      formatted = formatted.replace(/[.,;:!?]+$/, '');
      // Add period
      formatted += '.';
      return formatted;
    });
    
    // Join with newlines
    const formattedText = formattedAchievements.join('\n');
    
    // Copy the formatted text to clipboard
    navigator.clipboard.writeText(formattedText);
    
    addToast({
      title: "Formatted & Copied",
      description: "Achievements formatted and copied to clipboard",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Navy Ratings Content Generator</h1>
        <p className="text-muted-foreground">
          Generate descriptions, keywords, and achievements for Navy ratings using AI.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Input Information</CardTitle>
            <CardDescription>
              Select a rating and paste text about it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Select
                  value={selectedRating}
                  onValueChange={setSelectedRating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map((rating) => (
                      <SelectItem key={rating.id} value={rating.abbreviation}>
                        {rating.abbreviation} - {rating.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_rating">Service Rating</Label>
                <Select
                  value={serviceRating}
                  onValueChange={setServiceRating}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="input_text">Rating Information</Label>
                <Textarea
                  id="input_text"
                  placeholder="Paste comprehensive text about the rating here..."
                  className="min-h-[200px]"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-muted-foreground">
                    The more detailed information you provide, the better the generated content will be.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inputText.length} characters
                  </p>
                </div>
              </div>

              <Button 
                onClick={generateContent} 
                disabled={generating || !selectedRating || !inputText.trim()}
                className="w-full"
              >
                {generating ? "Generating..." : "Generate Content"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              AI-generated content for the selected rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  {generatedContent.description && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.description)}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  id="description"
                  placeholder="Generated description will appear here..."
                  className="min-h-[120px]"
                  value={generatedContent.description}
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {generatedContent.description ? `${generatedContent.description.length} characters` : ''}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keywords">Keywords</Label>
                  {generatedContent.keywords && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.keywords)}
                    >
                      Copy
                    </Button>
                  )}
                </div>
                <Textarea
                  id="keywords"
                  placeholder="Generated keywords will appear here..."
                  className="min-h-[80px]"
                  value={generatedContent.keywords}
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {generatedContent.keywords ? `${generatedContent.keywords.split(',').length} keywords` : ''}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="achievements">Common Achievements</Label>
                  {generatedContent.achievements && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => formatAndCopyAchievements(generatedContent.achievements)}
                        title="Format and copy achievements with each one on its own line"
                      >
                        Format & Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedContent.achievements)}
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
                <Textarea
                  id="achievements"
                  placeholder="Generated achievements will appear here..."
                  className="min-h-[200px]"
                  value={generatedContent.achievements}
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {generatedContent.achievements ? `${generatedContent.achievements.split('\n').length} achievements` : ''}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setGeneratedContent({
                description: "",
                keywords: "",
                achievements: ""
              })}
              disabled={!generatedContent.description}
            >
              Clear Results
            </Button>
            <Button 
              onClick={() => window.location.href = "/admin/navy-ratings"}
            >
              Go to Ratings Management
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}