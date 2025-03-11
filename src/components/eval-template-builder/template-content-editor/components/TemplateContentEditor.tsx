import React, { memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateEditTab } from './tabs/TemplateEditTab';
import { TemplatePreviewTab } from './tabs/TemplatePreviewTab';
import { TemplateGuideTab } from './tabs/TemplateGuideTab';
import { TemplateSchedulingTab } from './tabs/TemplateSchedulingTab';
import { TemplatePlanningTab } from './tabs/TemplatePlanningTab';
import { useTemplateEditor } from '../hooks/useTemplateEditor';
import { TemplateContentEditorProps } from '../types';

// Use React.memo to prevent unnecessary re-renders
export const TemplateContentEditor: React.FC<TemplateContentEditorProps> = memo((props) => {
  const {
    activeSection,
    sections,
    sectionTexts,
    isEditing,
    isEnhancing,
    blankSectionError,
    handleTextChange,
    handleFocus,
    handleBlur,
    handleEnhanceClick,
    includeAdvancedOptions,
    toggleAdvancedOptions,
    generatePDF
  } = useTemplateEditor(props);

  return (
    <Tabs defaultValue="edit" className="w-full" id="template-content-tabs">
      <TabsList className="mb-4 dark:bg-gray-700">
        <TabsTrigger value="edit" className="dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-300 dark:text-gray-200">Edit</TabsTrigger>
        <TabsTrigger value="preview" className="dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-300 dark:text-gray-200">Preview</TabsTrigger>
        <TabsTrigger value="guide" className="dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-300 dark:text-gray-200">Guide</TabsTrigger>
        <TabsTrigger value="scheduling" className="dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-300 dark:text-gray-200">Scheduling</TabsTrigger>
        <TabsTrigger value="planning" className="dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-blue-300 dark:text-gray-200">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="edit">
        <TemplateEditTab
          activeSection={activeSection}
          sections={sections}
          sectionTexts={sectionTexts}
          isEnhancing={isEnhancing}
          blankSectionError={blankSectionError}
          handleTextChange={handleTextChange}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          handleEnhanceClick={handleEnhanceClick}
        />
      </TabsContent>
      
      <TabsContent value="preview">
        <TemplatePreviewTab
          sections={sections}
          sectionTexts={sectionTexts}
          rank={props.rank}
          rating={props.rating}
          role={props.role}
          evalType={props.evalType}
          includeAdvancedOptions={includeAdvancedOptions}
          toggleAdvancedOptions={toggleAdvancedOptions}
          generatePDF={generatePDF}
          // Pass through all advanced options
          name={props.name}
          desig={props.desig}
          dutyStatus={props.dutyStatus}
          uic={props.uic}
          shipStation={props.shipStation}
          promotionStatus={props.promotionStatus}
          dateReported={props.dateReported}
          occasionForReport={props.occasionForReport}
          reportPeriod={props.reportPeriod}
          notObservedReport={props.notObservedReport}
          reportType={props.reportType}
          physicalReadiness={props.physicalReadiness}
          billetSubcategory={props.billetSubcategory}
          commandEmployment={props.commandEmployment}
          primaryDuties={props.primaryDuties}
          counselingInfo={props.counselingInfo}
        />
      </TabsContent>
      
      <TabsContent value="guide">
        <TemplateGuideTab activeSection={activeSection} sections={sections} sectionTexts={sectionTexts} />
      </TabsContent>
      
      <TabsContent value="scheduling">
        <TemplateSchedulingTab activeSection={activeSection} sections={sections} sectionTexts={sectionTexts} />
      </TabsContent>
      
      <TabsContent value="planning">
        <TemplatePlanningTab />
      </TabsContent>
    </Tabs>
  );
});