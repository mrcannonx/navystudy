"use client"

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Edit3, AlertTriangle, HelpCircle } from 'lucide-react';
import { AISuggestion } from './types';
import { FeatureTooltip } from './components/feature-tooltip';

interface TemplateAIEnhancerProps {
  aiSuggestions: AISuggestion[];
  isEnhancing: boolean;
  onApplySuggestionAction: (suggestion: AISuggestion) => void;
  onEnhanceWithAIAction: (text: string, rating?: string, role?: string) => void;
  currentSectionText: string;
  activeSection: string;
  rating?: string;
  role?: string;
  isDemoMode?: boolean;
}

export const TemplateAIEnhancer: React.FC<TemplateAIEnhancerProps> = ({
  aiSuggestions,
  isEnhancing,
  onApplySuggestionAction,
  onEnhanceWithAIAction,
  currentSectionText,
  activeSection,
  rating,
  role,
  isDemoMode = false
}) => {
  // Add state for warning message
  const [showWarning, setShowWarning] = useState<boolean>(false);
  
  // Helper function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Function to handle enhance button click
  const handleEnhanceClick = () => {
    // If demo mode is disabled and content is empty, show warning
    if (!isDemoMode && (!currentSectionText || currentSectionText.trim() === '')) {
      // Show warning for empty content
      setShowWarning(true);
      
      // Hide warning after 3 seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      
      return; // Don't proceed with enhancement if demo mode is off and content is empty
    }
    
    // Normal enhancement
    setShowWarning(false);
    onEnhanceWithAIAction(currentSectionText, rating, role);
  };
  
  return (
    <Card className="mt-6 border-purple-200 dark:border-purple-800/50">
      <CardHeader className="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/30">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center text-purple-800">
            <Zap size={16} className="mr-2" />
            {capitalizeFirstLetter(activeSection)} AI Enhancement
          </CardTitle>
          <div>
            <FeatureTooltip
              color="purple"
              content={
                <div>
                  <p className="font-medium mb-1">AI Enhancement</p>
                  <p className="mb-2">This tool adapts to your current section, providing intelligent assistance specific to {capitalizeFirstLetter(activeSection)}.</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Analyzes your current content and suggests improvements</li>
                    <li>Adds relevant metrics and quantifiable achievements</li>
                    <li>Strengthens language with powerful action verbs</li>
                    <li>Tailors suggestions to your rating and role</li>
                    <li>Adapts to each section's unique requirements</li>
                  </ul>
                  <p className="mt-2 text-xs">Use the "Enhance with AI" button in the content editor to generate AI-powered suggestions.</p>
                </div>
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3 text-sm">
          {showWarning && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded p-2 text-amber-800 dark:text-amber-300 flex items-start">
              <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>Please add content to the {capitalizeFirstLetter(activeSection)} section before enhancing.</p>
            </div>
          )}
          
          {aiSuggestions.length > 0 ? (
            <>
              <p className="text-gray-600">Select any suggestion below to enhance your {capitalizeFirstLetter(activeSection)} section:</p>
              
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border rounded p-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 dark:border-purple-800/50"
                  onClick={() => onApplySuggestionAction(suggestion)}
                >
                  <div className="text-gray-500 mb-1 line-through">{suggestion.original}</div>
                  <div className="font-medium">{suggestion.improved}</div>
                  <div className="mt-1 text-xs text-purple-600 flex items-center">
                    <Edit3 size={12} className="mr-1" />
                    {suggestion.type}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">No AI suggestions available yet.</p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded p-2 text-blue-700 dark:text-blue-300 flex items-start">
                <HelpCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>Use the "Enhance with AI" button in the content editor to generate suggestions.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};