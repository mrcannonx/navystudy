"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EvaluationTemplateData } from '../types';

interface SaveTemplateDialogProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSaveAction: (templateData: EvaluationTemplateData, customTitle: string) => void;
  templateData: EvaluationTemplateData;
  defaultTitle: string;
}

export const SaveTemplateDialog: React.FC<SaveTemplateDialogProps> = ({
  isOpen,
  onCloseAction,
  onSaveAction,
  templateData,
  defaultTitle
}) => {
  const [customTitle, setCustomTitle] = useState(defaultTitle);
  const [initialRender, setInitialRender] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only reset the customTitle when the dialog first opens, not on every render
  useEffect(() => {
    if (isOpen) {
      if (initialRender) {
        console.log("SaveTemplateDialog - Dialog opened with defaultTitle:", defaultTitle);
        setCustomTitle(defaultTitle);
        setInitialRender(false);
      }
      
      // Log the input element value directly
      if (inputRef.current) {
        console.log("SaveTemplateDialog - Input element direct value:", inputRef.current.value);
      }
    } else {
      // Reset the initialRender flag when dialog closes
      setInitialRender(true);
    }
  }, [isOpen, defaultTitle, initialRender]);
  
  // Add a synchronization effect to keep the state in sync with the DOM
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Create a function to sync the input value with state
      const syncInputValue = () => {
        const currentInputValue = inputRef.current?.value;
        if (currentInputValue && currentInputValue !== customTitle) {
          console.log("SaveTemplateDialog - Syncing input value with state:", currentInputValue);
          setCustomTitle(currentInputValue);
        }
      };
      
      // Add event listeners to catch any changes
      const inputElement = inputRef.current;
      inputElement.addEventListener('input', syncInputValue);
      inputElement.addEventListener('change', syncInputValue);
      
      return () => {
        // Clean up event listeners
        inputElement.removeEventListener('input', syncInputValue);
        inputElement.removeEventListener('change', syncInputValue);
      };
    }
  }, [isOpen, customTitle]);

  const handleSave = () => {
    console.log("SaveTemplateDialog - handleSave called with:", {
      templateData,
      customTitle
    });
    
    // Get the actual input value directly from the DOM
    let actualTitle = customTitle;
    if (inputRef.current) {
      actualTitle = inputRef.current.value;
      console.log("SaveTemplateDialog - Input element value at save time:", actualTitle);
      
      // Sync the DOM value with state if they're different
      if (actualTitle !== customTitle) {
        console.log("SaveTemplateDialog - Syncing DOM value with state:", actualTitle);
        setCustomTitle(actualTitle);
      }
    }
    
    console.log("SaveTemplateDialog - Final title being saved:", actualTitle);
    
    // Create a new template data object with the updated title
    const updatedTemplateData = {
      ...templateData,
      title: actualTitle
    };
    
    console.log("SaveTemplateDialog - Updated template data:", updatedTemplateData);
    
    // Pass both the updated template data and the actual title
    onSaveAction(updatedTemplateData, actualTitle);
    onCloseAction();
  };

  // Handle input change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    console.log("SaveTemplateDialog - Title changed to:", newTitle);
    console.log("SaveTemplateDialog - Event details:", {
      target: e.target.id,
      value: e.target.value,
      type: e.type,
      currentState: customTitle
    });
    setCustomTitle(newTitle);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Evaluation</DialogTitle>
          <DialogDescription>Please enter a title for your evaluation template.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-title" className="text-right">
              Evaluation Title
            </Label>
            <Input
              id="template-title"
              value={customTitle}
              onChange={handleTitleChange}
              autoFocus
              className="col-span-3"
              ref={inputRef}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Evaluation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};