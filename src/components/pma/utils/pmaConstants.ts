export const PAYGRADE_OPTIONS = ["E4", "E5", "E6", "E7"];

export const SCORE_OPTIONS = [
  { label: "Early Promote (4.00)", value: "4.00" },
  { label: "Must Promote (3.80)", value: "3.80" },
  { label: "Promotable (3.60)", value: "3.60" },
  { label: "Progressing (3.40)", value: "3.40" },
  { label: "Significant Problems (2.00)", value: "2.00" },
];

export const DEFAULT_PAYGRADE = "E5";

export const requiresRSCAPMA = (paygrade: string): boolean => 
  paygrade === "E6" || paygrade === "E7";