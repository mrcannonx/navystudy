import { SectionKey, TemplateSections } from '../../types';
import { PDFGeneratorParams } from '../types';
import { toast as sonnerToast } from "sonner";

// We'll dynamically import html2pdf only on the client side
// to avoid server-side rendering issues
let html2pdf: any = null;

// Check if we're on the client side before importing
if (typeof window !== 'undefined') {
  // Dynamic import for client-side only
  import('html2pdf.js').then((module) => {
    html2pdf = module.default;
  }).catch(err => {
    console.error('Failed to load html2pdf.js:', err);
  });
}

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

// PDF generation function
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
    // Build the PDF content
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Evaluation Template</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.5;
            font-size: 12pt;
          }
          h1 {
            color: #003366;
            margin-bottom: 15px;
            page-break-after: avoid;
          }
          h2 {
            color: #0055a4;
            margin-top: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            page-break-after: avoid;
          }
          .header {
            margin-bottom: 30px;
            page-break-after: avoid;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
            display: block;
            overflow: visible;
          }
          .advanced-options {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .advanced-item {
            margin-bottom: 10px;
          }
          .advanced-item strong {
            display: inline-block;
            min-width: 150px;
          }
          /* Add page break controls */
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          /* Ensure content doesn't get cut off at page boundaries */
          p, div {
            orphans: 3;
            widows: 3;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Navy Evaluation Template</h1>
          <p><strong>Rank:</strong> ${rank} | <strong>Rating:</strong> ${rating} | <strong>Role:</strong> ${role} | <strong>Evaluation Type:</strong> ${evalType}</p>
        </div>
        
        ${includeAdvancedOptions ? `
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
        ` : ''}
    `;
    
    // Add each evaluation section
    Object.entries(sections)
      .filter(([sectionKey]) => sectionKey !== 'initiative') // Filter out the initiative section
      .forEach(([sectionKey, section]) => {
        const sectionText = sectionTexts[sectionKey as SectionKey] !== undefined
          ? sectionTexts[sectionKey as SectionKey]
          : section.placeholder || '';
          
        // Format the section text with proper paragraphs to improve PDF rendering
        const formattedText = sectionText
          .replace(/\n{2,}/g, '</p><p>') // Convert double line breaks to paragraphs
          .replace(/\n/g, '<br>'); // Convert single line breaks to <br>
        
        content += `
          <div class="section">
            <h2>${section.title}</h2>
            <div><p>${formattedText}</p></div>
          </div>
        `;
      });
    
    // Close the HTML document
    content += `
      </body>
      </html>
    `;
    
    // Create a temporary div to hold the content
    const element = document.createElement('div');
    element.innerHTML = content;
    // Set styles to ensure visibility but keep it out of the way
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '0px';
    element.style.width = '816px'; // Roughly A4 width in pixels
    document.body.appendChild(element);
    
    // Configure html2pdf options with improved settings to prevent content cutoff
    const opt = {
      margin: [15, 15, 15, 15], // Increased margins
      filename: `evaluation-template-${rank}-${rating}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Back to safer value
        letterRendering: true,
        useCORS: true,
        logging: true,
        backgroundColor: '#FFFFFF', // Ensure white background
        windowHeight: Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        )
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    };
    
    // Check if html2pdf is loaded
    if (!html2pdf) {
      // If not loaded yet, try to load it dynamically
      const loadAndGeneratePDF = async () => {
        try {
          const module = await import('html2pdf.js');
          html2pdf = module.default;
          
          if (html2pdf) {
            // Now that it's loaded, generate the PDF
            // @ts-ignore - html2pdf.js method chaining doesn't match TypeScript definitions
            html2pdf().from(element).set(opt).save().then(() => {
              // Remove the temporary element
              document.body.removeChild(element);
              
              // Show success message
              toast({
                title: "PDF Generated",
                description: `Your evaluation template has been downloaded as a PDF${includeAdvancedOptions ? ' with advanced options' : ''}.`,
                variant: "default"
              });
            }).catch((error: unknown) => {
              console.error("Error generating PDF:", error);
              // Remove the temporary element
              if (document.body.contains(element)) {
                document.body.removeChild(element);
              }
              
              toast({
                title: "Error",
                description: "Failed to generate PDF. Please try again.",
                variant: "destructive"
              });
            });
          } else {
            throw new Error("Failed to load html2pdf.js");
          }
        } catch (error) {
          console.error("Error loading html2pdf.js:", error);
          // Remove the temporary element
          if (document.body.contains(element)) {
            document.body.removeChild(element);
          }
          
          toast({
            title: "Error",
            description: "Failed to load PDF generator. Please try again.",
            variant: "destructive"
          });
        }
      };
      
      loadAndGeneratePDF();
    } else {
      // html2pdf is already loaded, use it directly
      // @ts-ignore - html2pdf.js method chaining doesn't match TypeScript definitions
      html2pdf().from(element).set(opt).save().then(() => {
        // Remove the temporary element
        document.body.removeChild(element);
        
        // Show success message
        toast({
          title: "PDF Generated",
          description: `Your evaluation template has been downloaded as a PDF${includeAdvancedOptions ? ' with advanced options' : ''}.`,
          variant: "default"
        });
      }).catch((error: unknown) => {
        console.error("Error generating PDF:", error);
        // Remove the temporary element
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
        
        toast({
          title: "Error",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive"
        });
      });
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({
      title: "Error",
      description: "Failed to generate PDF. Please try again.",
      variant: "destructive"
    });
  }
};