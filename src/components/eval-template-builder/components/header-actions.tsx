"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Save, FolderOpen } from 'lucide-react';

interface HeaderActionsProps {
  title: string;
  rank: string;
  rating: string;
  role: string;
  onTitleChangeAction: (title: string) => void;
  onSaveAction: () => void;
  onCancelAction: () => void;
  onLoadAction: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  title,
  rank,
  rating,
  role,
  onTitleChangeAction,
  onSaveAction,
  onCancelAction,
  onLoadAction
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex-1 mr-4">
        <div
          className="text-2xl font-bold mb-2 p-0 h-auto w-full transition-all duration-200"
          title="Title can only be changed when saving the evaluation"
        >
          {title || `${rank} ${rating} ${role} Evaluation`}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          variant="outline"
          onClick={onCancelAction}
          className="transition-all duration-200 hover:bg-gray-50"
        >
          <X className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={onLoadAction}
          className="transition-all duration-200 hover:bg-gray-50"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Load Evaluation
        </Button>
        <Button
          onClick={onSaveAction}
          className="transition-all duration-200"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Evaluation
        </Button>
      </div>
    </div>
  );
};