import React, { memo } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Zap, AlertTriangle } from 'lucide-react';
import { EditTabProps } from '../../types';

const TemplateEditTabComponent: React.FC<EditTabProps> = ({
  activeSection,
  sections,
  sectionTexts,
  isEnhancing,
  blankSectionError,
  handleTextChange,
  handleFocus,
  handleBlur,
  handleEnhanceClick
}) => {
  if (!activeSection) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">No Section Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="dark:text-gray-300">Please select a section to edit.</p>
        </CardContent>
      </Card>
    );
  }

  // Get the current text for the active section
  const activeText = sectionTexts[activeSection] || '';
  
  // Get character limit (now much higher)
  const characterLimit = sections[activeSection]?.characterLimit || 10000;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">{sections[activeSection]?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {blankSectionError && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-amber-800 flex items-start">
              <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>This section cannot be blank. Please enter at least one bullet point (more would be better) before using the AI enhancement feature.</p>
            </div>
          )}
          <textarea
            className="w-full h-64 p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            value={activeText}
            onChange={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            data-direct-input="true" // Mark this as a direct input element
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <HelpCircle size={16} className="mr-1" />
          Use bullet points with metrics and quantifiable achievements
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-purple-100 text-purple-700 py-1 px-3 rounded flex items-center"
            onClick={handleEnhanceClick}
            disabled={isEnhancing}
          >
            <Zap size={14} className="mr-1" />
            {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Export a memoized version of the component
export const TemplateEditTab = memo(TemplateEditTabComponent);