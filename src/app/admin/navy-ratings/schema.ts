import * as z from "zod"

// Define the form schema
export const formSchema = z.object({
  abbreviation: z.string().min(1, "Abbreviation is required").max(10),
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().min(1, "Keywords are required"),
  common_achievements: z.string().min(1, "Common achievements are required"),
  parent_rating: z.string().optional(),
  service_rating: z.string().min(1, "Service rating is required"),
  is_variation: z.boolean().default(false),
})