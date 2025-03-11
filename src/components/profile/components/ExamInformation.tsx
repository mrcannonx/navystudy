import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NAVY_RANKS } from "@/constants/navy"
import type { FormSectionProps } from "./types"

export function ExamInformation({ formData, setFormData }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Next Exam Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="exam_name">Exam Name</Label>
          <Input
            id="exam_name"
            value={formData.exam_info.name}
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              exam_info: {
                ...prev.exam_info,
                name: e.target.value
              }
            }))}
            placeholder="Chief Exam"
          />
        </div>
        <div>
          <Label htmlFor="exam_date">Exam Date</Label>
          <Input
            id="exam_date"
            type="date"
            value={formData.exam_info.date}
            onChange={(e) => setFormData((prev) => ({
              ...prev,
              exam_info: {
                ...prev.exam_info,
                date: e.target.value
              }
            }))}
          />
        </div>
        <div>
          <Label htmlFor="target_rank">Target Rank</Label>
          <Select
            value={formData.exam_info.target_rank || ''}
            onValueChange={(value) => setFormData((prev) => ({
              ...prev,
              exam_info: {
                ...prev.exam_info,
                target_rank: value
              }
            }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select target rank" />
            </SelectTrigger>
            <SelectContent>
              {NAVY_RANKS.map((rank) => (
                <SelectItem key={rank.code} value={rank.code}>
                  {rank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 