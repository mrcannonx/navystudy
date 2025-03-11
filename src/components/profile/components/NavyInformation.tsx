import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { NAVY_RANKS, NAVY_RATES, type NavyRank, type NavyRate } from "@/constants/navy"
import type { FormSectionProps } from "./types"

export function NavyInformation({ formData, setFormData }: FormSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="rank">Rank</Label>
        <Select
          value={formData.rank}
          onValueChange={(value) => {
            console.log('[NavyInformation] Selected rank code:', value);
            console.log('[NavyInformation] Selected rank object:', NAVY_RANKS.find(r => r.code === value));
            setFormData(prev => ({ ...prev, rank: value }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rank" />
          </SelectTrigger>
          <SelectContent>
            {NAVY_RANKS.map(rank => (
              <SelectItem key={rank.code} value={rank.code}>
                {rank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rate">Rate</Label>
        <Select
          value={formData.rate}
          onValueChange={value => setFormData(prev => ({ ...prev, rate: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select rate" />
          </SelectTrigger>
          <SelectContent>
            {NAVY_RATES.map(rate => (
              <SelectItem key={rate} value={rate}>
                {rate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 