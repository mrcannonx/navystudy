export const formatStudyTime = (timeValue: number): { hours: number; minutes: number } => {
  // Guard against invalid values
  if (typeof timeValue !== 'number' || isNaN(timeValue) || timeValue < 0) {
    return { hours: 0, minutes: 0 };
  }
  
  // ALWAYS assume the input is in seconds
  // Convert seconds to minutes
  const totalMinutes = Math.round(timeValue / 60);
  
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  }
}

export const calculatePerformanceScore = (
  retentionRate: number = 0,
  reviewEfficiency: number = 0
): number => {
  // Guard against invalid values
  if (typeof retentionRate !== 'number' || isNaN(retentionRate)) {
    retentionRate = 0;
  }
  
  if (typeof reviewEfficiency !== 'number' || isNaN(reviewEfficiency)) {
    reviewEfficiency = 0;
  }
  
  // Ensure values are between 0 and 1 for percentage calculation
  const normalizedRetention = Math.min(1, Math.max(0, retentionRate));
  const normalizedEfficiency = Math.min(1, Math.max(0, reviewEfficiency));
  
  // Give more weight to retention rate (70%) than review efficiency (30%)
  const weightedScore = (normalizedRetention * 0.7) + (normalizedEfficiency * 0.3);
  
  // Convert to percentage and round to nearest integer
  return Math.round(weightedScore * 100);
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
