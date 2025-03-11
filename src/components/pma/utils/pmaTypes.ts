export interface Evaluation {
  id: string;
  date: string;
  score: string;
}

export interface PMACalculatorState {
  paygrade: string;
  evaluations: Evaluation[];
  pmaScore: number;
  lastUpdated?: string;
}

export interface SaveStatus {
  isSaving: boolean;
  showSavedIndicator: boolean;
  hasUnsavedChanges: boolean;
}