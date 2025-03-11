"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Template } from './hooks/useTemplates';
import { Loader2 } from 'lucide-react';

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
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleLoadClick = () => {
    if (selectedTemplate) {
      onLoadAction(selectedTemplate);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Load Advanced Data</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Select an evaluation to load advanced data from. This will load Rank/Rate, Rating, Role/Billet, Eval Type, and all advanced fields into your current evaluation.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> This will overwrite your current advanced data. Your evaluation content will remain unchanged.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading templates...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No saved evaluations found.</p>
              <p className="text-sm mt-2">Save an evaluation first to use this feature.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`border p-3 rounded-md cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{template.title}</h3>
                      <p className="text-sm text-gray-600">
                        {template.rank} {template.rating} {template.role}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(template.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
          <Button
            onClick={handleLoadClick}
            disabled={!selectedTemplate || loading}
          >
            Load Advanced Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};