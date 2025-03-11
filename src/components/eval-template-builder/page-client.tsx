"use client"

import React, { useEffect } from 'react'
import { useTemplates } from './hooks/useTemplates'
import { useCustomMetrics } from './hooks/useCustomMetrics'
import EvaluationTemplateBuilder from './template-builder'
import { EnhancedPageHeader } from './components/enhanced-page-header'
import { EnhancedTemplateList } from './components/enhanced-template-list'
import { EnhancedHeroSection } from './enhanced-hero-section'
import { EvaluationTemplateData } from './types'
import { Template } from './hooks/useTemplates'
import { Container } from '@/components/ui/container'
import { PageWithFooter } from '@/components/layout/page-with-footer'

interface EvalTemplateBuilderPageProps {
  userId: string
}

// Helper function to convert Template to EvaluationTemplateData
function convertTemplateToEvalData(template: Template | null): Partial<EvaluationTemplateData> | undefined {
  if (!template) return undefined
  
  // Add default values for all fields
  const result = {
    title: template.title,
    rank: template.rank,
    rating: template.rating,
    role: template.role,
    evalType: template.eval_type,
    
    // Personal Information
    name: template.name || '',
    desig: template.desig || '',
    ssn: template.ssn || '',
    
    // Status Information
    dutyStatus: template.duty_status ?
      (typeof template.duty_status === 'string'
        ? JSON.parse(template.duty_status)
        : {
            act: template.duty_status.act,
            fts: template.duty_status.fts,
            inact: template.duty_status.inact,
            atAdswDrilling: template.duty_status.at_adsw_drilling
          }
      ) : {
        act: false,
        fts: false,
        inact: false,
        atAdswDrilling: false
      },
    uic: template.uic || '',
    shipStation: template.ship_station || '',
    promotionStatus: template.promotion_status || 'Regular',
    dateReported: template.date_reported || '',
    
    // Report Information
    occasionForReport: template.occasion_for_report ?
      (typeof template.occasion_for_report === 'string'
        ? JSON.parse(template.occasion_for_report)
        : {
            periodic: template.occasion_for_report.periodic,
            detachment: template.occasion_for_report.detachment,
            promotionFrocking: template.occasion_for_report.promotion_frocking,
            special: template.occasion_for_report.special
          }
      ) : {
        periodic: true,
        detachment: false,
        promotionFrocking: false,
        special: false
      },
    
    // Period of Report
    reportPeriod: template.report_period ?
      (typeof template.report_period === 'string'
        ? JSON.parse(template.report_period)
        : {
            from: template.report_period.from,
            to: template.report_period.to
          }
      ) : {
        from: '',
        to: ''
      },
    
    // Report Type
    notObservedReport: template.not_observed_report || false,
    reportType: template.report_type ?
      (typeof template.report_type === 'string'
        ? JSON.parse(template.report_type)
        : {
            regular: template.report_type.regular,
            concurrent: template.report_type.concurrent
          }
      ) : {
        regular: true,
        concurrent: false
      },
    
    // Additional Information
    physicalReadiness: template.physical_readiness || 'Good',
    billetSubcategory: template.billet_subcategory || 'N/A',
    
    // Command Information
    commandEmployment: template.command_employment || '',
    primaryDuties: template.primary_duties || '',
    
    // Counseling Information
    counselingInfo: template.counseling_info ?
      (typeof template.counseling_info === 'string'
        ? (() => {
            // Parse the JSON string
            const parsed = JSON.parse(template.counseling_info);
            // Convert snake_case to camelCase
            return {
              dateCounseled: parsed.date_counseled || '',
              counselor: parsed.counselor || '',
              signature: parsed.signature || false
            };
          })()
        : {
            // Convert snake_case to camelCase
            dateCounseled: template.counseling_info.date_counseled || '',
            counselor: template.counseling_info.counselor || '',
            signature: template.counseling_info.signature || false
          }
      ) : {
        dateCounseled: '',
        counselor: '',
        signature: false
      },
    
    // Core data
    sections: (() => {
      try {
        if (template.sections) {
          // Handle case where sections might be a string (from DB) instead of an object
          if (typeof template.sections === 'string') {
            // Try to parse the string into an object
            return JSON.parse(template.sections);
          } else {
            // Already an object
            return template.sections;
          }
        }
        return undefined;
      } catch (error) {
        return undefined;
      }
    })(),
    
    bragSheetEntries: (() => {
      try {
        if (template.brag_sheet_entries) {
          // Handle case where brag_sheet_entries might be a string (from DB) instead of an object
          if (typeof template.brag_sheet_entries === 'string') {
            // Try to parse the string into an object
            return JSON.parse(template.brag_sheet_entries);
          } else {
            // Already an object
            return template.brag_sheet_entries;
          }
        }
        return [];
      } catch (error) {
        return [];
      }
    })(),
    
    isDemoMode: template.is_demo_mode
  }
  
  return result;
}

export default function EvalTemplateBuilderPage({ userId }: EvalTemplateBuilderPageProps) {
  const {
    templates,
    currentTemplate,
    isCreating,
    loading,
    setCurrentTemplate,
    saveTemplate,
    deleteTemplate,
    createNewTemplate,
    cancelEditing
  } = useTemplates(userId)
  
  // Use the custom metrics hook to manage metrics
  const {
    customMetrics,
    saveCustomMetric,
    deleteCustomMetric,
    loadCustomMetrics,
    clearAllCustomMetrics
  } = useCustomMetrics(userId)

  // Convert the currentTemplate to the format expected by EvaluationTemplateBuilder
  const templateData = convertTemplateToEvalData(currentTemplate);

  return (
    <PageWithFooter>
      {/* Hero section outside of container for full width */}
      {!isCreating && !currentTemplate && <EnhancedHeroSection />}
      
      <div className="py-6">
        <Container>
          <div className="max-w-[1400px] mx-auto" id="templates-section">
            <EnhancedPageHeader
              onCreateTemplateAction={createNewTemplate}
              isCreating={isCreating}
              hasCurrentTemplate={!!currentTemplate}
            />

            {isCreating || currentTemplate ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <EvaluationTemplateBuilder
                  initialData={templateData}
                  onSave={saveTemplate}
                  onCancel={cancelEditing}
                  onSaveCustomMetric={saveCustomMetric}
                  onDeleteCustomMetric={deleteCustomMetric}
                  loadCustomMetrics={loadCustomMetrics}
                  clearAllCustomMetrics={clearAllCustomMetrics}
                  templates={templates}
                  loading={loading}
                  onLoadTemplate={setCurrentTemplate}
                />
              </div>
            ) : (
              <EnhancedTemplateList
                templates={templates}
                loading={loading}
                onCreateTemplateAction={createNewTemplate}
                onEditTemplateAction={setCurrentTemplate}
                onDeleteTemplateAction={deleteTemplate}
              />
            )}
          </div>
        </Container>
      </div>
    </PageWithFooter>
  )
}
