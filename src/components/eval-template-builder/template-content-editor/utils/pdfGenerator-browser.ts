import { SectionKey, TemplateSections } from '../../types';
import { PDFGeneratorParams } from '../types';
import { toast as sonnerToast } from "sonner";

// Create a wrapper for toast that mimics the useToast hook's behavior
const toast = (props: { title: string; description: string; variant?: "default" | "destructive" }) => {
  const { title, description, variant = "default" } = props;
  const options = { description };
  
  if (variant === "destructive") {
    sonnerToast.error(title, options);
  } else {
    sonnerToast.success(title, options);
  }
};

// PDF generation function using browser's print capability
export const generatePDF = (params: PDFGeneratorParams) => {
  // Check if we're on the server side - if so, do nothing
  if (typeof window === 'undefined') {
    console.warn('PDF generation attempted on server side - skipping');
    return;
  }
  
  const {
    sections,
    sectionTexts,
    rank,
    rating,
    role,
    evalType,
    includeAdvancedOptions,
    advancedData
  } = params;
  
  try {
    // Build the HTML content
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Evaluation Template - ${rank} ${rating}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 40px; 
            line-height: 1.5;
          }
          h1 { color: #003366; }
          h2 { color: #0055a4; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .header { margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .advanced-options { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
          .advanced-item { margin-bottom: 10px; }
          .advanced-item strong { display: inline-block; min-width: 150px; }
          
          /* Print-specific styles */
          @media print {
            body { font-size: 12pt; }
            .no-print { display: none; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background-color: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
          <h2>Print Instructions</h2>
          <p>To save this as a PDF:</p>
          <ol>
            <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac)</li>
            <li>Select <strong>"Save as PDF"</strong> as the destination</li>
            <li>Click <strong>"Save"</strong></li>
          </ol>
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #0055a4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
            Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <h1>Navy Evaluation Template</h1>
          <p><strong>Rank:</strong> ${rank} | <strong>Rating:</strong> ${rating} | <strong>Role:</strong> ${role} | <strong>Evaluation Type:</strong> ${evalType}</p>
        </div>
    `;
    
    // Add advanced options if included
    if (includeAdvancedOptions) {
      content += `
        <div class="advanced-options">
          <h2>Advanced Options</h2>
          ${advancedData.name ? `<div class="advanced-item"><strong>Name:</strong> ${advancedData.name}</div>` : ''}
          ${advancedData.desig ? `<div class="advanced-item"><strong>Designation:</strong> ${advancedData.desig}</div>` : ''}
          
          ${advancedData.dutyStatus ? `
          <div class="advanced-item">
            <strong>Duty Status:</strong>
            ${advancedData.dutyStatus.act ? 'Active' : ''}
            ${advancedData.dutyStatus.fts ? 'FTS' : ''}
            ${advancedData.dutyStatus.inact ? 'Inactive' : ''}
            ${advancedData.dutyStatus.atAdswDrilling ? 'AT/ADSW/Drilling' : ''}
          </div>` : ''}
          
          ${advancedData.uic ? `<div class="advanced-item"><strong>UIC:</strong> ${advancedData.uic}</div>` : ''}
          ${advancedData.shipStation ? `<div class="advanced-item"><strong>Ship/Station:</strong> ${advancedData.shipStation}</div>` : ''}
          ${advancedData.promotionStatus ? `<div class="advanced-item"><strong>Promotion Status:</strong> ${advancedData.promotionStatus}</div>` : ''}
          ${advancedData.dateReported ? `<div class="advanced-item"><strong>Date Reported:</strong> ${advancedData.dateReported}</div>` : ''}
          
          ${advancedData.occasionForReport ? `
          <div class="advanced-item">
            <strong>Occasion for Report:</strong>
            ${advancedData.occasionForReport.periodic ? 'Periodic' : ''}
            ${advancedData.occasionForReport.detachment ? 'Detachment' : ''}
            ${advancedData.occasionForReport.promotionFrocking ? 'Promotion/Frocking' : ''}
            ${advancedData.occasionForReport.special ? 'Special' : ''}
          </div>` : ''}
          
          ${advancedData.reportPeriod ? `
          <div class="advanced-item">
            <strong>Report Period:</strong>
            From: ${advancedData.reportPeriod.from || 'N/A'}
            To: ${advancedData.reportPeriod.to || 'N/A'}
          </div>` : ''}
          
          ${advancedData.notObservedReport !== undefined ? `<div class="advanced-item"><strong>Not Observed Report:</strong> ${advancedData.notObservedReport ? 'Yes' : 'No'}</div>` : ''}
          
          ${advancedData.reportType ? `
          <div class="advanced-item">
            <strong>Report Type:</strong>
            ${advancedData.reportType.regular ? 'Regular' : ''}
            ${advancedData.reportType.concurrent ? 'Concurrent' : ''}
          </div>` : ''}
          
          ${advancedData.physicalReadiness ? `<div class="advanced-item"><strong>Physical Readiness:</strong> ${advancedData.physicalReadiness}</div>` : ''}
          ${advancedData.billetSubcategory ? `<div class="advanced-item"><strong>Billet Subcategory:</strong> ${advancedData.billetSubcategory}</div>` : ''}
          ${advancedData.commandEmployment ? `<div class="advanced-item"><strong>Command Employment:</strong> ${advancedData.commandEmployment}</div>` : ''}
          ${advancedData.primaryDuties ? `<div class="advanced-item"><strong>Primary Duties:</strong> ${advancedData.primaryDuties}</div>` : ''}
          
          ${advancedData.counselingInfo ? `
          <div class="advanced-item">
            <strong>Counseling Info:</strong>
            Date Counseled: ${advancedData.counselingInfo.dateCounseled || 'N/A'},
            Counselor: ${advancedData.counselingInfo.counselor || 'N/A'},
            Signature: ${advancedData.counselingInfo.signature ? 'Yes' : 'No'}
          </div>` : ''}
        </div>
      `;
    }
    
    // Add each evaluation section
    Object.entries(sections)
      .filter(([sectionKey]) => sectionKey !== 'initiative') // Filter out the initiative section
      .forEach(([sectionKey, section]) => {
        const sectionText = sectionTexts[sectionKey as SectionKey] !== undefined
          ? sectionTexts[sectionKey as SectionKey]
          : section.placeholder || '';
          
        content += `
          <div class="section">
            <h2>${section.title}</h2>
            <div>${sectionText.replace(/\n/g, '<br>')}</div>
          </div>
        `;
      });
    
    // Close the HTML document
    content += `
      </body>
      </html>
    `;
    
    // Open the HTML in a new window
    const newWindow = window.open('', '_blank');
    
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(content);
      newWindow.document.close();
      
      // Show success message
      toast({
        title: "Template Generated",
        description: "Your evaluation template has been opened in a new tab. Use your browser's print function to save as PDF.",
        variant: "default"
      });
    } else {
      // If popup was blocked, create a data URL and provide a direct link
      const htmlBlob = new Blob([content], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      
      const link = document.createElement('a');
      link.href = htmlUrl;
      link.download = `evaluation-template-${rank}-${rating}.html`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(htmlUrl);
      
      toast({
        title: "HTML Downloaded",
        description: "Your evaluation template has been downloaded as HTML. Open it in a browser and use the print function to save as PDF.",
        variant: "default"
      });
    }
  } catch (error) {
    console.error("Error generating template:", error);
    toast({
      title: "Error",
      description: "Failed to generate template. Please try again.",
      variant: "destructive"
    });
  }
};