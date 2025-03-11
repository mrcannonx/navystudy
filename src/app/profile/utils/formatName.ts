import type { Profile } from "@/contexts/auth/types";

/**
 * Formats a user's name based on their rank and rate
 * - E7: "Chief [Name]"
 * - E6: "[Rate]1 [Name]"
 * - E5: "[Rate]2 [Name]"
 * - E4: "[Rate]3 [Name]"
 * 
 * @param profile The user profile containing rank, rate, and full_name
 * @returns Formatted name string
 */
export function formatNameWithRankRate(profile: Profile): string {
  if (!profile.full_name) return "";
  
  // Only apply formatting if both rank and rate are available
  if (profile.rank && profile.rate) {
    // Apply formatting based on rank
    if (profile.rank === "E7") {
      return `Chief ${profile.full_name}`;
    } else if (profile.rank === "E6") {
      return `${profile.rate}1 ${profile.full_name}`;
    } else if (profile.rank === "E5") {
      return `${profile.rate}2 ${profile.full_name}`;
    } else if (profile.rank === "E4") {
      return `${profile.rate}3 ${profile.full_name}`;
    }
  }
  
  // Default case - just return the name
  return profile.full_name;
}