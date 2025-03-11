"use client"

import React from 'react';
import { TemplateMetricsLibrary } from '../template-metrics-library';
import BragSheet from '../brag-sheet';
import { BragSheetEntry, SectionKey, ToastProps, MetricsLibrary } from '../types';

interface TemplateRightSidebarProps {
  showMetrics: boolean;
  showBragSheet: boolean;
  activeSection: SectionKey;
  rating: string;
  role: string;
  bragSheetEntries: BragSheetEntry[];
  customMetrics: MetricsLibrary;
  onAddMetricAction: (metric: string) => void;
  onAddCustomMetricAction: (metric: string, section: string) => void;
  onDeleteMetricAction: (metric: string, section: string) => void;
  onAddBragSheetEntryAction: (entry: Omit<BragSheetEntry, 'id'>) => void;
  onSelectBragSheetEntryAction: (entry: BragSheetEntry) => Promise<void>;
  onDeleteBragSheetEntryAction: (entryId: number | string) => void;
  onUpdateBragSheetEntryAction?: (entry: BragSheetEntry) => void;
  addToastAction: (props: ToastProps) => void;
}

export const TemplateRightSidebar: React.FC<TemplateRightSidebarProps> = ({
  showMetrics,
  showBragSheet,
  activeSection,
  rating,
  role,
  bragSheetEntries,
  customMetrics,
  onAddMetricAction,
  onAddCustomMetricAction,
  onDeleteMetricAction,
  onAddBragSheetEntryAction,
  onSelectBragSheetEntryAction,
  onDeleteBragSheetEntryAction,
  onUpdateBragSheetEntryAction,
  addToastAction
}) => {
  return (
    <div className="lg:col-span-3">
      {/* Metrics Library Panel */}
      {showMetrics && (
        <TemplateMetricsLibrary
          metrics={customMetrics}
          activeSection={activeSection}
          rating={rating}
          role={role}
          onAddMetricAction={onAddMetricAction}
          onAddCustomMetricAction={onAddCustomMetricAction}
          onDeleteMetricAction={onDeleteMetricAction}
          onError={(message) => addToastAction({
            title: 'Error',
            description: message,
            variant: 'destructive'
          })}
        />
      )}
      
      {/* Brag Sheet Panel */}
      {showBragSheet && (
        <div className={`${showMetrics ? 'mt-6' : ''}`}>
          <BragSheet
            entries={bragSheetEntries}
            onAddEntryAction={onAddBragSheetEntryAction}
            onSelectEntryAction={onSelectBragSheetEntryAction}
            onDeleteEntryAction={onDeleteBragSheetEntryAction}
            onUpdateEntryAction={onUpdateBragSheetEntryAction}
          />
        </div>
      )}
    </div>
  );
};