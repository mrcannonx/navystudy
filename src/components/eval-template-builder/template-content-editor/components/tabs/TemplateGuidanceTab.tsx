import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { TabProps } from '../../types';

export const TemplateGuidanceTab: React.FC<TabProps> = ({
  activeSection,
  sections
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navy Guidance</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Official Guidance for {activeSection ? sections[activeSection]?.title : 'Current Section'}</h3>
        <p className="mb-4">
          This section should demonstrate your expertise in your rate, technical knowledge, and ability to apply it to your job.
        </p>
        <p>
          Reference: BUPERSINST 1610.10E (Navy Performance Evaluation System)
        </p>
      </CardContent>
    </Card>
  );
};