"use client"

import { useState, useEffect } from 'react';
import { EvaluationTemplateData } from '../../types';

interface UseTemplatePersonalInfoProps {
  initialData?: Partial<EvaluationTemplateData>;
}

export const useTemplatePersonalInfo = ({ initialData }: UseTemplatePersonalInfoProps) => {
  // Personal Information
  const [name, setName] = useState(initialData?.name || '');
  const [desig, setDesig] = useState(initialData?.desig || '');
  const [ssn, setSsn] = useState(initialData?.ssn || '');
  
  // Status Information
  const [dutyStatus, setDutyStatus] = useState(initialData?.dutyStatus || {
    act: false,
    fts: false,
    inact: false,
    atAdswDrilling: false
  });
  
  const [uic, setUic] = useState(initialData?.uic || '');
  const [shipStation, setShipStation] = useState(initialData?.shipStation || '');
  const [promotionStatus, setPromotionStatus] = useState(initialData?.promotionStatus || 'Regular');
  const [dateReported, setDateReported] = useState(initialData?.dateReported || '');

  // Update state when initialData changes
  useEffect(() => {
    if (initialData) {
      // Update personal information
      setName(initialData.name || '');
      setDesig(initialData.desig || '');
      setSsn(initialData.ssn || '');
      
      // Status Information
      if (initialData.dutyStatus) {
        // Parse JSON string if it's a string
        const dutyStatusObj = typeof initialData.dutyStatus === 'string'
          ? JSON.parse(initialData.dutyStatus)
          : initialData.dutyStatus;
        setDutyStatus(dutyStatusObj);
      } else {
        setDutyStatus({
          act: false,
          fts: false,
          inact: false,
          atAdswDrilling: false
        });
      }
      
      setUic(initialData.uic || '');
      setShipStation(initialData.shipStation || '');
      setPromotionStatus(initialData.promotionStatus || 'Regular');
      setDateReported(initialData.dateReported || '');
    }
  }, [initialData]);

  return {
    // Personal Information state
    name,
    desig,
    ssn,
    
    // Status Information state
    dutyStatus,
    uic,
    shipStation,
    promotionStatus,
    dateReported,
    
    // Personal Information setters
    setName,
    setDesig,
    setSsn,
    
    // Status Information setters
    setDutyStatus,
    setUic,
    setShipStation,
    setPromotionStatus,
    setDateReported,
  };
};