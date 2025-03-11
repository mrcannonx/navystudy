import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { FormSectionProps } from "./types"

export function BasicInformation({ formData, setFormData }: FormSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
        />
      </div>
    </div>
  )
} 