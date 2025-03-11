import { SectionKey, TemplateSections } from '../types';

export interface TemplateContentEditorProps {
  sections: TemplateSections;
  activeSection: SectionKey;
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  isEnhancing: boolean;
  // Advanced options data
  name?: string;
  desig?: string;
  dutyStatus?: {
    act: boolean;
    fts: boolean;
    inact: boolean;
    atAdswDrilling: boolean;
  };
  uic?: string;
  shipStation?: string;
  promotionStatus?: string;
  dateReported?: string;
  occasionForReport?: {
    periodic: boolean;
    detachment: boolean;
    promotionFrocking: boolean;
    special: boolean;
  };
  reportPeriod?: {
    from: string;
    to: string;
  };
  notObservedReport?: boolean;
  reportType?: {
    regular: boolean;
    concurrent: boolean;
  };
  physicalReadiness?: string;
  billetSubcategory?: string;
  commandEmployment?: string;
  primaryDuties?: string;
  counselingInfo?: {
    dateCounseled: string;
    counselor: string;
    signature: boolean;
  };
  onUpdateSectionTextAction: (sectionKey: SectionKey, text: string) => void;
  onEnhanceWithAIAction: (text: string, rating: string, role: string) => void;
}

export interface TabProps {
  activeSection?: SectionKey;
  sections: TemplateSections;
  sectionTexts: Record<SectionKey, string>;
}

export interface EditTabProps extends TabProps {
  isEnhancing: boolean;
  blankSectionError: boolean;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleEnhanceClick: () => void;
}

export interface PreviewTabProps extends TabProps {
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  includeAdvancedOptions: boolean;
  toggleAdvancedOptions: () => void;
  generatePDF: () => void;
  // Advanced options
  name?: string;
  desig?: string;
  dutyStatus?: {
    act: boolean;
    fts: boolean;
    inact: boolean;
    atAdswDrilling: boolean;
  };
  uic?: string;
  shipStation?: string;
  promotionStatus?: string;
  dateReported?: string;
  occasionForReport?: {
    periodic: boolean;
    detachment: boolean;
    promotionFrocking: boolean;
    special: boolean;
  };
  reportPeriod?: {
    from: string;
    to: string;
  };
  notObservedReport?: boolean;
  reportType?: {
    regular: boolean;
    concurrent: boolean;
  };
  physicalReadiness?: string;
  billetSubcategory?: string;
  commandEmployment?: string;
  primaryDuties?: string;
  counselingInfo?: {
    dateCounseled: string;
    counselor: string;
    signature: boolean;
  };
}

export interface AdvancedOptionsToggleProps {
  includeAdvancedOptions: boolean;
  toggleAdvancedOptions: () => void;
}

export interface SectionSyncParams {
  sections: TemplateSections;
  activeSection: SectionKey;
  sectionTexts: Record<SectionKey, string>;
  setSectionTexts: React.Dispatch<React.SetStateAction<Record<SectionKey, string>>>;
  isEditing: boolean;
  initialized: React.MutableRefObject<boolean>;
  prevSectionsRef: React.MutableRefObject<TemplateSections | null>;
  prevActiveSectionRef: React.MutableRefObject<SectionKey | null>;
}

export interface PDFGeneratorParams {
  sections: TemplateSections;
  sectionTexts: Record<SectionKey, string>;
  rank: string;
  rating: string;
  role: string;
  evalType: string;
  includeAdvancedOptions: boolean;
  advancedData: any;
}