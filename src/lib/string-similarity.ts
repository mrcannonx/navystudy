/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,  // substitution
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1       // insertion
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity between two strings (0 to 1)
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1; // Both strings are empty
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - (distance / maxLength);
}

/**
 * Calculate similarity between two arrays of strings
 * Takes into account different orderings
 */
export function calculateArraySimilarity(arr1: string[], arr2: string[]): number {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;

  // Create similarity matrix
  const similarities: number[][] = arr1.map(str1 => 
    arr2.map(str2 => calculateStringSimilarity(str1, str2))
  );

  // Find best matches greedily
  let totalSimilarity = 0;
  let matchCount = 0;
  const used = new Set<number>();

  for (let i = 0; i < arr1.length; i++) {
    let bestMatch = -1;
    let bestSimilarity = -1;

    for (let j = 0; j < arr2.length; j++) {
      if (!used.has(j) && similarities[i][j] > bestSimilarity) {
        bestMatch = j;
        bestSimilarity = similarities[i][j];
      }
    }

    if (bestMatch !== -1) {
      used.add(bestMatch);
      totalSimilarity += bestSimilarity;
      matchCount++;
    }
  }

  // Average similarity, weighted by coverage
  const coverage = matchCount / Math.max(arr1.length, arr2.length);
  return (totalSimilarity / Math.max(arr1.length, arr2.length)) * coverage;
}
