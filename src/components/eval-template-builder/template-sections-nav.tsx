"use client"

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Check,
  BookOpen,
  Award,
  Users,
  Shield,
  Target,
  UserPlus,
  Compass
} from 'lucide-react';
import { TemplateSections, SectionKey } from './types';
import { FeatureTooltip } from './components/feature-tooltip';

interface TemplateSectionsNavProps {
  sections: TemplateSections;
  activeSection: string;
  onSectionChangeAction: (section: string) => void;
}

export const TemplateSectionsNav: React.FC<TemplateSectionsNavProps> = ({
  sections,
  activeSection,
  onSectionChangeAction
}) => {
  // Define section icons
  const sectionIcons: Record<SectionKey, React.ReactNode> = {
    professional: <BookOpen size={18} className="mr-2 text-blue-500" />,
    quality: <Award size={18} className="mr-2 text-purple-500" />,
    climate: <Users size={18} className="mr-2 text-orange-500" />,
    military: <Shield size={18} className="mr-2 text-red-500" />,
    accomplishment: <Target size={18} className="mr-2 text-green-500" />,
    teamwork: <UserPlus size={18} className="mr-2 text-teal-500" />,
    leadership: <Compass size={18} className="mr-2 text-indigo-500" />
  };

  // Define custom section titles
  const sectionTitles: Record<SectionKey, string> = {
    professional: "Professional Knowledge",
    quality: "Quality of Work",
    climate: "Command Climate/EO",
    military: "Military Bearing/Character",
    accomplishment: "Job Accomplishment/Init.",
    teamwork: "Teamwork",
    leadership: "Leadership"
  };

  // Define the order of sections
  const sectionOrder: SectionKey[] = [
    'professional',
    'quality',
    'climate',
    'military',
    'accomplishment',
    'teamwork',
    'leadership'
  ];

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg dark:text-gray-100">Evaluation Sections</CardTitle>
          <div>
            <FeatureTooltip
              color="blue"
              content={
                <div>
                  <p className="font-medium mb-1">Evaluation Sections</p>
                  <p className="mb-2">Navigate between the seven standard Navy evaluation sections required for all personnel evaluations.</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Click any section to edit its content</li>
                    <li>Green checkmarks indicate completed sections</li>
                    <li>Each section has specific requirements and character limits</li>
                    <li>All sections must be completed for a valid evaluation</li>
                    <li>Sections follow the official Navy evaluation form structure</li>
                  </ul>
                </div>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="flex flex-col">
          {sectionOrder.map((key) => {
            const section = sections[key];
            return (
              <button
                key={key}
                className={`flex items-center p-3 text-left border-b dark:border-gray-700 ${activeSection === key ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-600' : ''} dark:text-gray-200`}
                onClick={() => onSectionChangeAction(key)}
              >
                {section.completed ? (
                  <Check size={18} className="mr-2 text-green-500" />
                ) : (
                  sectionIcons[key as SectionKey]
                )}
                <span>{sectionTitles[key as SectionKey]}</span>
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};