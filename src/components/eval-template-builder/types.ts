// Define section key type for better type safety
export type SectionKey = 'professional' | 'quality' | 'climate' | 'military' | 'accomplishment' | 'teamwork' | 'leadership';

export interface TemplateSection {
  title: string;
  placeholder: string;
  characterLimit: number;
  completed: boolean;
}

// Use Record instead of mapped type
export type TemplateSections = Record<SectionKey, TemplateSection>;

export interface BragSheetEntry {
  id: number | string;
  date: string;
  category: SectionKey; // Updated to use SectionKey instead of string
  title: string;
  description: string;
  metrics: string[];
  added: boolean;
}

export interface EvaluationTemplateData {
  title: string;
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  // Advanced fields
  // Personal Information
  name?: string; // 1. Name (Last, First MI Suffix)
  desig?: string; // 3. Desig
  ssn?: string; // 4. SSN (not marked in green but related)
  
  // Status Information
  dutyStatus?: {
    act: boolean;
    fts: boolean;
    inact: boolean;
    atAdswDrilling: boolean;
  }; // 5. ACT, FTS, INACT, AT/ADSW/265
  uic?: string; // 6. UIC
  shipStation?: string; // 7. Ship/Station
  promotionStatus?: string; // 8. Promotion Status
  dateReported?: string; // 9. Date Reported
  
  // Report Information
  occasionForReport?: {
    periodic: boolean;
    detachment: boolean;
    promotionFrocking: boolean;
    special: boolean;
  }; // 10-13. Occasion for Report
  
  // Period of Report
  reportPeriod?: {
    from: string;
    to: string;
  }; // 14-15. Period of Report
  
  // Report Type
  notObservedReport?: boolean; // 16. Not Observed Report
  reportType?: {
    regular: boolean;
    concurrent: boolean;
  }; // 17-18. Type of Report
  
  // Additional Information
  physicalReadiness?: string; // 20. Physical Readiness
  billetSubcategory?: string; // 21. Billet Subcategory
  
  // Command Information
  commandEmployment?: string; // 28. Command employment and command achievements
  primaryDuties?: string; // 29. Primary/Collateral/Watchstanding duties
  
  // Counseling Information
  counselingInfo?: {
    dateCounseled: string;
    counselor: string;
    signature: boolean;
  }; // 30-32. Mid-term Counseling fields
  
  // Core data
  sections: TemplateSections;
  bragSheetEntries: BragSheetEntry[];
  isDemoMode?: boolean;
}

export interface AISuggestion {
  original: string;
  improved: string;
  type: string;
}

// Use Record instead of mapped type
export type MetricsLibrary = Record<SectionKey, string[]>;

// Toast types for better type safety
export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}