"use client"

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Template } from '../hooks/useTemplates';
import { LoadingSpinner } from '@/components/loading-spinner';

interface LoadAdvancedDataDialogProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onLoadAction: (template: Template) => void;
  templates: Template[];
  loading: boolean;
}

export const LoadAdvancedDataDialog: React.FC<LoadAdvancedDataDialogProps> = ({
  isOpen,
  onCloseAction,
  onLoadAction,
  templates,
  loading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Load Advanced Data</DialogTitle>
          <DialogDescription>
            This will only load advanced fields like promotion status and billet subcategory without affecting your current evaluation content.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No saved templates found.</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-md p-3 hover:bg-accent cursor-pointer"
                    onClick={() => onLoadAction(template)}
                  >
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {template.rank} {template.rating} - {template.role}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Last updated: {new Date(template.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};