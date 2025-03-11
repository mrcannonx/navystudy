"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, Zap, Star, Trash2 } from 'lucide-react';

interface TemplateFeatureTogglesProps {
  showMetrics: boolean;
  showAIEnhancer: boolean;
  showBragSheet: boolean;
  isDemoMode?: boolean;
  onToggleMetricsAction: () => void;
  onToggleAIEnhancerAction: () => void;
  onToggleBragSheetAction: () => void;
  onClearDemoAction?: () => void;
}

export const TemplateFeatureToggles: React.FC<TemplateFeatureTogglesProps> = ({
  showMetrics,
  showAIEnhancer,
  showBragSheet,
  isDemoMode = false,
  onToggleMetricsAction,
  onToggleAIEnhancerAction,
  onToggleBragSheetAction,
  onClearDemoAction
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button 
        variant="ghost"
        className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${showMetrics ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        onClick={onToggleMetricsAction}
      >
        <Database size={16} className="mr-1.5" />
        Metrics Library
      </Button>
      <Button 
        variant="ghost"
        className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${showAIEnhancer ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}
        onClick={onToggleAIEnhancerAction}
      >
        <Zap size={16} className="mr-1.5" />
        AI Enhancement
      </Button>
      <Button
        variant="ghost"
        className={`flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${showBragSheet ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
        onClick={onToggleBragSheetAction}
      >
        <Star size={16} className="mr-1.5" />
        Brag Sheet
      </Button>
      
      {/* Clear Demo Button - only show when isDemoMode is true */}
      {isDemoMode && onClearDemoAction && (
        <Button
          variant="ghost"
          className="flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-red-100 text-red-800 ml-auto"
          onClick={onClearDemoAction}
        >
          <Trash2 size={16} className="mr-1.5" />
          Reset All
        </Button>
      )}
    </div>
  );
};