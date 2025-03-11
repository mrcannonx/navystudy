"use client"

import { useState, useEffect } from 'react';
import { EvaluationTemplateData } from '../../types';

interface UseTemplateReportInfoProps {
  initialData?: Partial<EvaluationTemplateData>;
}

export const useTemplateReportInfo = ({ initialData }: UseTemplateReportInfoProps) => {
  // Report Information
  const [occasionForReport, setOccasionForReport] = useState(initialData?.occasionForReport || {
    periodic: true,
    detachment: false,
    promotionFrocking: false,
    special: false
  });
  
  // Period of Report
  const [reportPeriod, setReportPeriod] = useState(initialData?.reportPeriod || {
    from: '',
    to: ''
  });
  
  // Report Type
  const [notObservedReport, setNotObservedReport] = useState(initialData?.notObservedReport || false);
  const [reportType, setReportType] = useState(initialData?.reportType || {
    regular: true,
    concurrent: false
  });
  
  // Additional Information
  const [physicalReadiness, setPhysicalReadiness] = useState(initialData?.physicalReadiness || '');
  const [billetSubcategory, setBilletSubcategory] = useState(initialData?.billetSubcategory || 'N/A');

  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      // Report Information
      if (initialData.occasionForReport) {
        // Parse JSON string if it's a string
        const occasionObj = typeof initialData.occasionForReport === 'string'
          ? JSON.parse(initialData.occasionForReport)
          : initialData.occasionForReport;
        setOccasionForReport(occasionObj);
      } else {
        setOccasionForReport({
          periodic: true,
          detachment: false,
          promotionFrocking: false,
          special: false
        });
      }
      
      // Period of Report
      if (initialData.reportPeriod) {
        // Parse JSON string if it's a string
        const periodObj = typeof initialData.reportPeriod === 'string'
          ? JSON.parse(initialData.reportPeriod)
          : initialData.reportPeriod;
        setReportPeriod(periodObj);
      } else {
        setReportPeriod({
          from: '',
          to: ''
        });
      }
      
      // Report Type
      setNotObservedReport(initialData.notObservedReport || false);
      
      if (initialData.reportType) {
        // Parse JSON string if it's a string
        const typeObj = typeof initialData.reportType === 'string'
          ? JSON.parse(initialData.reportType)
          : initialData.reportType;
        setReportType(typeObj);
      } else {
        setReportType({
          regular: true,
          concurrent: false
        });
      }
      
      // Additional Information
      setPhysicalReadiness(initialData.physicalReadiness || '');
      setBilletSubcategory(initialData.billetSubcategory || 'N/A');
    }
  }, [initialData]);

  return {
    // Report Information state
    occasionForReport,
    reportPeriod,
    notObservedReport,
    reportType,
    physicalReadiness,
    billetSubcategory,
    
    // Report Information setters
    setOccasionForReport,
    setReportPeriod,
    setNotObservedReport,
    setReportType,
    setPhysicalReadiness,
    setBilletSubcategory,
  };
};