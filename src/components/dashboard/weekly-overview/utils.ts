// Calculate date boundaries for weekly stats
export const calculateWeekBoundaries = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Calculate the end of the week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Calculate previous week boundaries
  const previousWeekStart = new Date(startOfWeek);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  
  const previousWeekEnd = new Date(endOfWeek);
  previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

  return {
    startOfWeek,
    endOfWeek,
    previousWeekStart,
    previousWeekEnd
  };
};

// Format date as Month Day with safety check
export const formatDate = (date: Date | null | undefined) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return ''; // Return empty string for invalid dates
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Calculate percentage change between current and previous week
export const calculateChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};