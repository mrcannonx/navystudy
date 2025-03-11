import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { FormSectionProps } from "./types"

export function AdditionalInformation({ formData, setFormData }: FormSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell us about yourself"
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duty_station">Duty Station</Label>
        <Input
          id="duty_station"
          value={formData.duty_station}
          onChange={e => setFormData(prev => ({ ...prev, duty_station: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="years_of_service">Years of Service</Label>
        <Input
          id="years_of_service"
          value={formData.years_of_service}
          onChange={e => setFormData(prev => ({ ...prev, years_of_service: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specializations">Rate Title</Label>
        <Input
          id="specializations"
          value={formData.specializations}
          onChange={e => setFormData(prev => ({ ...prev, specializations: e.target.value }))}
          placeholder="Construction Mechanic"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="awards">Awards</Label>
        <Textarea
          id="awards"
          value={formData.awards}
          onChange={e => setFormData(prev => ({ ...prev, awards: e.target.value }))}
          placeholder="List your awards and achievements"
          className="h-20"
        />
      </div>
    </>
  )
} 