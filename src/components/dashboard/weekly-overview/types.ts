export interface WeeklyStats {
  cardsStudied: number;
  totalCards: number;
  retentionRate: number;
  reviewEfficiency: number;
  weekStartDate: Date;
  weekEndDate: Date;
  previousWeekStats?: {
    cardsStudied: number;
    retentionRate: number;
    reviewEfficiency: number;
  }
}

export interface ProgressSectionProps {
  title: string;
  value: number;
  total?: number;
  color: string;
  current: number;
  previous?: number;
  unit?: string;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  extraContent?: React.ReactNode;
}