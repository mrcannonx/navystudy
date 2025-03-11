import { SavedCalculation } from "../types/rsca-calculations"

/**
 * Sorts and filters calculations based on search term and sort order
 * @param calculations - Array of saved calculations
 * @param searchTerm - Optional search term to filter by
 * @param sortOrder - Sort order ('newest', 'oldest', or 'name')
 * @returns Filtered and sorted calculations
 */
export const getSortedAndFilteredCalculations = (
  calculations: SavedCalculation[],
  searchTerm: string,
  sortOrder: 'newest' | 'oldest' | 'name'
): SavedCalculation[] => {
  let filtered = [...calculations]
  
  // Apply search filter
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim()
    filtered = filtered.filter(calc =>
      calc.name.toLowerCase().includes(term)
    )
  }
  
  // Apply sorting
  switch (sortOrder) {
    case 'newest':
      return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    case 'oldest':
      return filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
    case 'name':
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return filtered
  }
}