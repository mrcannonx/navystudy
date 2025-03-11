"use client"

import React from 'react';
import { TemplateSections } from './types';

interface TemplateProgressProps {
  sections: TemplateSections;
}

export const TemplateProgress: React.FC<TemplateProgressProps> = ({ sections }) => {
  const progressPercentage = () => {
    const completedSections = Object.values(sections).filter(section => section.completed).length;
    return Math.round((completedSections / Object.keys(sections).length) * 100);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Completion Progress</span>
        <span className="text-sm font-medium">{progressPercentage()}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progressPercentage()}%` }}
        ></div>
      </div>
    </div>
  );
};