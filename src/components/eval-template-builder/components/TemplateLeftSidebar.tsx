"use client"

import React from 'react';
import { TemplateSectionsNav } from '../template-sections-nav';
import { TemplateAIEnhancer } from '../template-ai-enhancer';
import { TemplateSections, AISuggestion, SectionKey } from '../types';

interface TemplateLeftSidebarProps {
  sections: TemplateSections;
  activeSection: SectionKey;
  showAIEnhancer: boolean;
  aiSuggestions: AISuggestion[];
  isEnhancing: boolean;
  rating?: string;
  role?: string;
  isDemoMode?: boolean;
  onSectionChangeAction: (section: string) => void;
  onApplySuggestionAction: (suggestion: AISuggestion) => void;
  onEnhanceWithAIAction: (text: string, rating?: string, role?: string) => Promise<void>;
}

export const TemplateLeftSidebar: React.FC<TemplateLeftSidebarProps> = ({
  sections,
  activeSection,
  showAIEnhancer,
  aiSuggestions,
  isEnhancing,
  rating,
  role,
  isDemoMode = false,
  onSectionChangeAction,
  onApplySuggestionAction,
  onEnhanceWithAIAction
}) => {
  return (
    <div className="lg:col-span-3">
      <TemplateSectionsNav
        sections={sections}
        activeSection={activeSection}
        onSectionChangeAction={onSectionChangeAction}
      />
      
      {/* AI Enhancement Panel */}
      {showAIEnhancer && (
        <TemplateAIEnhancer
          aiSuggestions={aiSuggestions}
          isEnhancing={isEnhancing}
          onApplySuggestionAction={onApplySuggestionAction}
          onEnhanceWithAIAction={onEnhanceWithAIAction}
          currentSectionText={sections[activeSection]?.placeholder || ''}
          activeSection={activeSection}
          rating={rating}
          role={role}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
};