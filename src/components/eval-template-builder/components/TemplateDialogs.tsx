"use client"

import React from 'react';
import { SaveTemplateDialog } from '../dialogs/save-template-dialog';
import { LoadTemplateDialog } from '../dialogs/load-template-dialog';
import { LoadAdvancedDataDialog } from '../dialogs/load-advanced-data-dialog';
import { ClearDemoDialog } from '../dialogs/clear-demo-dialog';
import { EvaluationTemplateData } from '../types';
import { Template } from '../hooks/useTemplates';

interface TemplateDialogsProps {
  isSaveDialogOpen: boolean;
  isLoadDialogOpen: boolean;
  isLoadAdvancedDataDialogOpen: boolean;
  isClearDemoDialogOpen: boolean;
  setIsSaveDialogOpenAction: (isOpen: boolean) => void;
  setIsLoadDialogOpenAction: (isOpen: boolean) => void;
  setIsLoadAdvancedDataDialogOpenAction: (isOpen: boolean) => void;
  setIsClearDemoDialogOpenAction: (isOpen: boolean) => void;
  handleSaveWithCustomTitleAction: (templateData: EvaluationTemplateData, customTitle: string) => void;
  handleLoadTemplateAction: (template: Template) => void;
  handleLoadAdvancedDataAction: (template: Template) => void;
  handleConfirmClearDemoAction: () => void;
  templateData: EvaluationTemplateData;
  templates: Template[];
  loading: boolean;
  title: string;
}

export const TemplateDialogs: React.FC<TemplateDialogsProps> = ({
  isSaveDialogOpen,
  isLoadDialogOpen,
  isLoadAdvancedDataDialogOpen,
  isClearDemoDialogOpen,
  setIsSaveDialogOpenAction,
  setIsLoadDialogOpenAction,
  setIsLoadAdvancedDataDialogOpenAction,
  setIsClearDemoDialogOpenAction,
  handleSaveWithCustomTitleAction,
  handleLoadTemplateAction,
  handleLoadAdvancedDataAction,
  handleConfirmClearDemoAction,
  templateData,
  templates,
  loading,
  title
}) => {
  return (
    <>
      <LoadAdvancedDataDialog
        isOpen={isLoadAdvancedDataDialogOpen}
        onCloseAction={() => setIsLoadAdvancedDataDialogOpenAction(false)}
        onLoadAction={handleLoadAdvancedDataAction}
        templates={templates || []}
        loading={loading || false}
      />
      
      <SaveTemplateDialog
        isOpen={isSaveDialogOpen}
        onCloseAction={() => setIsSaveDialogOpenAction(false)}
        onSaveAction={handleSaveWithCustomTitleAction}
        templateData={templateData}
        defaultTitle={title || `Template`}
      />
      
      <LoadTemplateDialog
        isOpen={isLoadDialogOpen}
        onCloseAction={() => setIsLoadDialogOpenAction(false)}
        onLoadAction={handleLoadTemplateAction}
        templates={templates || []}
        loading={loading || false}
      />
      
      <ClearDemoDialog
        isOpen={isClearDemoDialogOpen}
        onCloseAction={() => setIsClearDemoDialogOpenAction(false)}
        onConfirmAction={handleConfirmClearDemoAction}
      />
    </>
  );
};