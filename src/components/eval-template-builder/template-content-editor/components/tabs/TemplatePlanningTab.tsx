import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { UserNotes } from '../../../user-notes';

export const TemplatePlanningTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <UserNotes />
      </CardContent>
    </Card>
  );
};