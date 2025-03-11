"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Anchor, Loader2, Save } from "lucide-react"
import { NAVY_RANKS, NAVY_RATES } from "@/constants/navy"
import type { ProfileDetailsProps } from "@/types/profile"

export function ProfileDetails({
  user,
  profile,
  formData,
  isEditing,
  isSaving,
  onSubmitAction,
  setFormDataAction
}: ProfileDetailsProps) {
  if (isEditing && !formData) {
    console.error('FormData is required in edit mode')
    return null
  }

  return (
    <Card className="md:col-span-8 border-none shadow-lg">
      <CardContent className="p-6">
        {isEditing && formData ? (
          <form onSubmit={onSubmitAction} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormDataAction(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormDataAction(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-gray-50"
                />
              </div>
            </div>

            {/* Rank and Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Select
                  value={formData.rank}
                  onValueChange={(value: typeof NAVY_RANKS[number]) => setFormDataAction(prev => ({ ...prev, rank: value }))}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select rank" />
                  </SelectTrigger>
                  <SelectContent>
                    {NAVY_RANKS.map((rank) => (
                      <SelectItem key={rank} value={rank}>
                        {rank}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Rate</Label>
                <Select
                  value={formData.rate}
                  onValueChange={(value: typeof NAVY_RATES[number]) => setFormDataAction(prev => ({ ...prev, rate: value }))}
                >
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {NAVY_RATES.map((rate) => (
                      <SelectItem key={rate} value={rate}>
                        {rate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duty Station and Years of Service */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duty_station">Duty Station</Label>
                <Input
                  id="duty_station"
                  value={formData.duty_station}
                  onChange={(e) => setFormDataAction(prev => ({ ...prev, duty_station: e.target.value }))}
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_of_service">Years of Service</Label>
                <Input
                  id="years_of_service"
                  value={formData.years_of_service}
                  onChange={(e) => setFormDataAction(prev => ({ ...prev, years_of_service: e.target.value }))}
                  className="bg-gray-50"
                  type="number"
                  min="0"
                  max="40"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormDataAction(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-gray-50 min-h-[100px]"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <Label htmlFor="specializations">Specializations</Label>
              <Textarea
                id="specializations"
                value={formData.specializations}
                onChange={(e) => setFormDataAction(prev => ({ ...prev, specializations: e.target.value }))}
                className="bg-gray-50"
                placeholder="List your specializations..."
              />
            </div>

            {/* Awards */}
            <div className="space-y-2">
              <Label htmlFor="awards">Awards</Label>
              <Textarea
                id="awards"
                value={formData.awards}
                onChange={(e) => setFormDataAction(prev => ({ ...prev, awards: e.target.value }))}
                className="bg-gray-50"
                placeholder="List your awards and achievements..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <Mail className="h-4 w-4 text-blue-600 mr-2" />
                  {user.email}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Duty Station</h3>
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <Anchor className="h-4 w-4 text-blue-600 mr-2" />
                  {profile.duty_station || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Years of Service</h3>
                <div className="flex items-center text-gray-900 dark:text-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-blue-600 mr-2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {profile.years_of_service || 'Not specified'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Add Rank Information */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Rank</h3>
                <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex items-center">
                  {profile.rank ? (
                    <>
                      {profile.navy_rank_url && (
                        <img 
                          src={profile.navy_rank_url} 
                          alt={`${profile.rank} insignia`}
                          className="h-6 w-auto mr-2"
                        />
                      )}
                      {profile.rank}
                    </>
                  ) : (
                    'No rank set'
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  {profile.bio || 'No bio provided'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Rate Title</h3>
                <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  {profile.specializations || 'No rate title set'}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Awards</h3>
                <div className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  {profile.awards || 'No awards listed'}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
