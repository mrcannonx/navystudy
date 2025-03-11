"use client"

/**
 * Utility functions for transforming data between frontend and backend formats
 * to handle naming convention differences (camelCase vs snake_case)
 */

// Transform from backend (snake_case) to frontend (camelCase)
export function transformCounselingInfoFromBackend(data: any) {
  if (!data) return null;
  
  // Handle string JSON
  const counselingObj = typeof data === 'string' ? JSON.parse(data) : data;
  
  console.log('Transforming counseling info from backend:', counselingObj);
  
  const result = {
    dateCounseled: counselingObj.date_counseled || counselingObj.dateCounseled || '',
    counselor: counselingObj.counselor_name || counselingObj.counselor || '',
    signature: counselingObj.signature || false
  };
  
  console.log('Transformed to frontend format:', result);
  return result;
}

// Transform from frontend (camelCase) to backend (snake_case)
export function transformCounselingInfoToBackend(data: any) {
  if (!data) return null;
  
  console.log('Transforming counseling info to backend:', data);
  
  const result = {
    date_counseled: data.dateCounseled || '',
    counselor_name: data.counselor || '',
    signature: data.signature || false
  };
  
  console.log('Transformed to backend format:', result);
  return result;
}

// Transform entire template data for saving to backend
export function transformTemplateDataToBackend(data: any) {
  if (!data) return data;
  
  // Create a copy of the data
  const result = { ...data };
  
  // Transform counselingInfo if it exists
  if (result.counselingInfo) {
    result.counselingInfo = transformCounselingInfoToBackend(result.counselingInfo);
  }
  
  return result;
}

// Transform entire template data from backend to frontend
export function transformTemplateDataFromBackend(data: any) {
  if (!data) return data;
  
  // Create a copy of the data
  const result = { ...data };
  
  // Transform counselingInfo if it exists
  if (result.counselingInfo) {
    result.counselingInfo = transformCounselingInfoFromBackend(result.counselingInfo);
  }
  
  return result;
}