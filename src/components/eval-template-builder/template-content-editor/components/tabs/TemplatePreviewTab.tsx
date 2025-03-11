import React, { memo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PreviewTabProps } from '../../types';
import { SectionKey } from '../../../types';
import { Download, Settings } from 'lucide-react';

const TemplatePreviewTabComponent: React.FC<PreviewTabProps> = ({
  sections,
  sectionTexts,
  rank,
  rating,
  role,
  evalType,
  includeAdvancedOptions,
  toggleAdvancedOptions,
  generatePDF,
  // Advanced options are passed but not directly used in this component
  // They are passed to the PDF generator
}) => {
  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Preview</CardTitle>
        </div>
        <div className="flex items-center gap-3">
          {/* Modern Advanced Options Toggle */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleAdvancedOptions}
            role="button"
            tabIndex={0}
            aria-pressed={includeAdvancedOptions}
            title="Toggle advanced options"
          >
            <Settings size={18} className={`${includeAdvancedOptions ? 'text-blue-600' : 'text-gray-500'}`} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                Include Advanced Options
              </span>
              <span className="text-xs text-gray-500">
                Status: <span className={`font-semibold ${includeAdvancedOptions ? 'text-blue-600' : 'text-gray-600'}`}>
                  {includeAdvancedOptions ? 'Enabled' : 'Disabled'}
                </span>
              </span>
            </div>
            <div className="ml-2">
              <div className={`w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${includeAdvancedOptions ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ease-in-out translate-y-0.5 ${
                    includeAdvancedOptions ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Modern PDF Download Button */}
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg flex items-center gap-2 shadow-sm"
            onClick={generatePDF}
            title="Download as PDF"
          >
            <Download size={18} />
            <span>PDF</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {Object.entries(sections)
            .filter(([sectionKey]) => sectionKey !== 'initiative') // Filter out the initiative section
            .map(([sectionKey, section]) => {
              // Get the text from our local state if available, otherwise use the section's placeholder
              const sectionText = sectionTexts[sectionKey as SectionKey] !== undefined
                ? sectionTexts[sectionKey as SectionKey]
                : section.placeholder || '';
              
              return (
                <div key={sectionKey} className="border-b border-gray-100 pb-4 mb-4 last:border-b-0">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{section.title}</h3>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {sectionText || 'No content yet'}
                  </div>
                </div>
              );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Export a memoized version of the component
export const TemplatePreviewTab = memo(TemplatePreviewTabComponent);