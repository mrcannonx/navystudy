"use client"

import { useState, useEffect, useCallback } from 'react';
import { EvaluationTemplateData } from '../../types';

interface UseTemplateCommandInfoProps {
  initialData?: Partial<EvaluationTemplateData>;
}

export const useTemplateCommandInfo = ({ initialData }: UseTemplateCommandInfoProps) => {
  // Command Information
  const [commandEmployment, setCommandEmployment] = useState(initialData?.commandEmployment || '');
  const [primaryDuties, setPrimaryDuties] = useState(initialData?.primaryDuties || '');
  
  // Counseling Information
  const [counselingInfo, setCounselingInfoState] = useState(initialData?.counselingInfo || {
    dateCounseled: '',
    counselor: '',
    signature: false
  });

  // Create a wrapped version of setCounselingInfo with improved logging
  const setCounselingInfo = useCallback((info: any) => {
    console.log('setCounselingInfo called with:', info);
    
    // Ensure we're using camelCase for the dateCounseled field
    const normalizedInfo = {
      dateCounseled: info.dateCounseled || info.date_counseled || '',
      counselor: info.counselor || info.counselor_name || '',
      signature: info.signature || false
    };
    
    console.log('Normalized counselingInfo:', normalizedInfo);
    setCounselingInfoState(normalizedInfo);
  }, []);

  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      // Command Information
      setCommandEmployment(initialData.commandEmployment || '');
      setPrimaryDuties(initialData.primaryDuties || '');
      
      // Counseling Information
      if (initialData.counselingInfo) {
        console.log('Initializing counselingInfo from initialData:', initialData.counselingInfo);
        
        // Parse JSON string if it's a string
        let counselingObj = typeof initialData.counselingInfo === 'string'
          ? JSON.parse(initialData.counselingInfo)
          : initialData.counselingInfo;
        
        console.log('Parsed counselingObj:', counselingObj);
        
        // Normalize field names (convert snake_case to camelCase)
        const normalizedCounselingInfo = {
          dateCounseled: counselingObj.dateCounseled || counselingObj.date_counseled || '',
          counselor: counselingObj.counselor || counselingObj.counselor_name || counselingObj.counselor_title || '',
          signature: counselingObj.signature || false
        };
        
        console.log('Normalized counselingInfo for state:', normalizedCounselingInfo);
        setCounselingInfoState(normalizedCounselingInfo);
      } else {
        console.log('No counselingInfo in initialData, using default empty values');
        setCounselingInfoState({
          dateCounseled: '',
          counselor: '',
          signature: false
        });
      }
    }
  }, [initialData]);

  return {
    // Command Information state
    commandEmployment,
    primaryDuties,
    counselingInfo,
    
    // Command Information setters
    setCommandEmployment,
    setPrimaryDuties,
    setCounselingInfo,
  };
};