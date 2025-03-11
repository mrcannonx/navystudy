import { Evaluation } from "./pmaTypes";

/**
 * Calculates the Performance Mark Average (PMA) from a list of evaluations
 */
export const calculatePMA = (evaluations: Evaluation[]): number => {
  if (evaluations.length === 0) return 0;

  const sum = evaluations.reduce(
    (acc, evaluation) => acc + parseFloat(evaluation.score),
    0
  );
  return parseFloat((sum / evaluations.length).toFixed(2));
};

/**
 * Sorts evaluations by date (newest first)
 */
export const sortEvaluationsByDate = (evaluations: Evaluation[]): Evaluation[] => {
  return [...evaluations].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Formats a date string to MM/DD/YYYY format
 */
export const formatDate = (dateString: string): string => {
  let dateObj: Date;
  
  // Handle different date formats
  if (dateString.includes('-') && !dateString.includes('T')) {
    // ISO format (YYYY-MM-DD) - add time component to ensure consistent parsing
    dateObj = new Date(`${dateString}T00:00:00`);
  } else {
    // MM/DD/YYYY format or already has time component
    dateObj = new Date(dateString);
  }
  
  // Get date parts in local timezone
  const month = dateObj.getMonth() + 1; // getMonth() returns 0-11
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${month}/${day}/${year}`;
};

/**
 * Returns a CSS class based on the PMA score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 4.0) return "score-outstanding";
  if (score >= 3.8) return "score-excellent";
  if (score >= 3.6) return "score-good";
  if (score >= 3.4) return "score-average";
  return "score-poor";
};

/**
 * Returns a descriptive label based on the PMA score
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 4.0) return "Outstanding";
  if (score >= 3.8) return "Excellent";
  if (score >= 3.6) return "Good";
  if (score >= 3.4) return "Average";
  return "Needs Improvement";
};

/**
 * Returns a trend display text based on score comparison
 */
export const getTrendDisplay = (trend: number): string => {
  if (trend === 0) return "Stable";
  return trend > 0 ? "Improving" : "Declining";
};

/**
 * Creates a new evaluation with default values
 */
export const createDefaultEvaluation = (): Evaluation => ({
  id: String(Date.now()),
  date: new Date().toISOString().split("T")[0],
  score: "3.60",
});

/**
 * Creates default evaluations for new users
 */
export const createDefaultEvaluations = (): Evaluation[] => [
  { 
    id: "1", 
    date: new Date().toISOString().split("T")[0], 
    score: "3.80" 
  },
  { 
    id: "2", 
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], 
    score: "3.60" 
  },
];