"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ClearDemoDialogProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
}

export const ClearDemoDialog: React.FC<ClearDemoDialogProps> = ({
  isOpen,
  onCloseAction,
  onConfirmAction
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset All Content?</DialogTitle>
          <DialogDescription>
            Please confirm if you want to completely reset all content and metrics to default.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">
            This will completely reset your template to a blank state, removing:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li>Rank/Rate, Rating, and Role/Billet information</li>
            <li>All evaluation section content</li>
            <li>All metrics and statistics</li>
            <li>All AI enhancements and suggestions</li>
            <li>All custom metrics and templates</li>
            <li>All brag sheet entries</li>
          </ul>
          <p className="text-sm text-gray-600 mb-4">
            Note: Eval Type selection will be preserved.
          </p>
          <p className="mb-4 text-red-600 font-medium">
            This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCloseAction}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmAction}
          >
            Reset All Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};