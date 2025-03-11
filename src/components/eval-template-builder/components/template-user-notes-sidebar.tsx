"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserNotes } from '../user-notes';

interface TemplateUserNotesSidebarProps {
  showUserNotes: boolean;
}

export const TemplateUserNotesSidebar: React.FC<TemplateUserNotesSidebarProps> = ({
  showUserNotes
}) => {
  if (!showUserNotes) return null;

  return (
    <div className="lg:col-span-3">
      <Card className="h-full">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base">My Notes</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <UserNotes />
        </CardContent>
      </Card>
    </div>
  );
};