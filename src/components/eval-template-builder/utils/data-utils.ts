/**
 * Utility functions for data serialization and deserialization
 */

/**
 * Serializes a complex field to a string if it's an object
 * @param field The field to serialize
 * @returns The serialized field
 */
export function serializeComplexField(field: any): string | null {
  if (field === null || field === undefined) {
    return null;
  }
  return typeof field === 'object' ? JSON.stringify(field) : field;
}

/**
 * Deserializes a field from a string to an object if it's a string
 * @param field The field to deserialize
 * @returns The deserialized field
 */
export function deserializeComplexField(field: any): any {
  if (!field) return null;
  
  try {
    return typeof field === 'string' ? JSON.parse(field) : field;
  } catch (error) {
    console.error('Error deserializing field:', error);
    return field; // Return the original field if parsing fails
  }
}

/**
 * Maps database field names (snake_case) to UI field names (camelCase)
 * @param dbObject The database object
 * @returns The UI object
 */
export function mapDatabaseToUI(dbObject: any): any {
  if (!dbObject) return null;
  
  return {
    // Basic fields
    title: dbObject.title,
    rank: dbObject.rank,
    rating: dbObject.rating,
    role: dbObject.role,
    evalType: dbObject.eval_type,
    
    // Personal Information
    name: dbObject.name,
    desig: dbObject.desig,
    ssn: dbObject.ssn,
    
    // Status Information
    dutyStatus: deserializeComplexField(dbObject.duty_status),
    uic: dbObject.uic,
    shipStation: dbObject.ship_station,
    promotionStatus: dbObject.promotion_status,
    dateReported: dbObject.date_reported,
    
    // Report Information
    occasionForReport: deserializeComplexField(dbObject.occasion_for_report),
    
    // Period of Report
    reportPeriod: deserializeComplexField(dbObject.report_period),
    
    // Report Type
    notObservedReport: dbObject.not_observed_report,
    reportType: deserializeComplexField(dbObject.report_type),
    
    // Additional Information
    physicalReadiness: dbObject.physical_readiness,
    billetSubcategory: dbObject.billet_subcategory,
    
    // Command Information
    commandEmployment: dbObject.command_employment,
    primaryDuties: dbObject.primary_duties,
    
    // Counseling Information
    counselingInfo: deserializeComplexField(dbObject.counseling_info),
    
    // Core data
    sections: deserializeComplexField(dbObject.sections),
    bragSheetEntries: deserializeComplexField(dbObject.brag_sheet_entries),
    isDemoMode: dbObject.is_demo_mode
  };
}

/**
 * Maps UI field names (camelCase) to database field names (snake_case)
 * @param uiObject The UI object
 * @returns The database object
 */
export function mapUIToDatabase(uiObject: any): any {
  if (!uiObject) return null;
  
  return {
    // Basic fields
    title: uiObject.title,
    rank: uiObject.rank,
    rating: uiObject.rating,
    role: uiObject.role,
    eval_type: uiObject.evalType,
    
    // Personal Information
    name: uiObject.name,
    desig: uiObject.desig,
    ssn: uiObject.ssn,
    
    // Status Information
    duty_status: serializeComplexField(uiObject.dutyStatus),
    uic: uiObject.uic,
    ship_station: uiObject.shipStation,
    promotion_status: uiObject.promotionStatus,
    date_reported: uiObject.dateReported,
    
    // Report Information
    occasion_for_report: serializeComplexField(uiObject.occasionForReport),
    
    // Period of Report
    report_period: serializeComplexField(uiObject.reportPeriod),
    
    // Report Type
    not_observed_report: uiObject.notObservedReport,
    report_type: serializeComplexField(uiObject.reportType),
    
    // Additional Information
    physical_readiness: uiObject.physicalReadiness,
    billet_subcategory: uiObject.billetSubcategory,
    
    // Command Information
    command_employment: uiObject.commandEmployment,
    primary_duties: uiObject.primaryDuties,
    
    // Counseling Information
    counseling_info: serializeComplexField(uiObject.counselingInfo),
    
    // Core data
    sections: serializeComplexField(uiObject.sections),
    brag_sheet_entries: serializeComplexField(uiObject.bragSheetEntries),
    is_demo_mode: uiObject.isDemoMode
  };
}