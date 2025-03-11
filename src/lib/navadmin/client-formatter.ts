/**
 * Client-side NAVADMIN formatter
 * Formats NAVADMIN text into HTML without using AI
 */

/**
 * Format NAVADMIN text into HTML
 */
export function formatNavadminClient(content: string): string {
  if (!content || typeof content !== 'string' || !content.trim()) {
    return '<div class="p-4 text-red-500">No valid content to format</div>';
  }

  // Preprocess the content
  const processedContent = preprocessNavadminContent(content);
  
  // Parse the NAVADMIN into sections
  const sections = parseNavadminSections(processedContent);
  
  // Generate HTML
  return generateNavadminHtml(sections);
}

/**
 * Preprocess NAVADMIN content
 */
function preprocessNavadminContent(content: string): string {
  return content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Normalize multiple line breaks
    .replace(/\t/g, '    ') // Convert tabs to spaces
    .trim();
}

/**
 * Parse NAVADMIN into sections
 */
function parseNavadminSections(content: string): NavadminSections {
  const sections: NavadminSections = {
    header: {
      navadminNumber: '',
      date: '',
      classification: '',
      from: '',
      to: '',
      info: '',
    },
    subject: '',
    references: [],
    remarks: [],
    mainContent: [],
    pointsOfContact: [],
    footer: '',
  };

  // Extract NAVADMIN number and date
  const navadminMatch = content.match(/NAVADMIN\s+(\d+\/\d+)/i);
  if (navadminMatch) {
    sections.header.navadminNumber = navadminMatch[1];
  }

  // Extract date (various formats)
  const dateMatch = content.match(/(?:DTG|DATE):\s*(\d{1,2}\s+[A-Z]{3}\s+\d{2,4})/i) ||
                   content.match(/(\d{1,2}\s+[A-Z]{3}\s+\d{2,4})/i);
  if (dateMatch) {
    sections.header.date = dateMatch[1];
  }

  // Extract classification
  const classMatch = content.match(/(UNCLAS|UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET)[^\n]*/i);
  if (classMatch) {
    sections.header.classification = classMatch[1];
  }

  // Extract sender (FROM)
  const fromMatch = content.match(/FM\s+([^\n]+)/i);
  if (fromMatch) {
    sections.header.from = fromMatch[1].trim();
  }

  // Extract recipient (TO)
  const toMatch = content.match(/TO\s+([^\n]+)/i);
  if (toMatch) {
    sections.header.to = toMatch[1].trim();
  }

  // Extract INFO
  const infoMatch = content.match(/INFO\s+([^\n]+)/i);
  if (infoMatch) {
    sections.header.info = infoMatch[1].trim();
  }

  // Extract subject
  const subjectMatch = content.match(/SUBJ(?:ECT)?[:\/]?\s+([^\n]+)/i);
  if (subjectMatch) {
    sections.subject = subjectMatch[1].trim();
  }

  // Extract references (NARR/REF format or standard REF format)
  // First try to get the complete NARR/REF block with all lines
  const narrRefBlockMatch = content.match(/NARR\/REF\s+[A-Z]\s+IS\s+([\s\S]*?)(?=\n\s*RMKS|$)/i);
  if (narrRefBlockMatch && narrRefBlockMatch[1]) {
    // Process the entire block
    const narrRefBlock = narrRefBlockMatch[1].trim();
    // Split by line breaks and filter out empty lines
    const narrRefLines = narrRefBlock.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Join the lines with proper spacing
    if (narrRefLines.length > 0) {
      // Process each reference line separately for better formatting
      narrRefLines.forEach((line, index) => {
        if (index === 0) {
          sections.references.push(`NARR/REF A IS ${line}`);
        } else {
          sections.references.push(line);
        }
      });
    }
  } else {
    // Fallback to the original approach
    const narrRefMatches = content.match(/NARR\/REF\s+[A-Z]\s+IS\s+([^\n]+)/ig);
    const refMatches = content.match(/REF(?:ERENCE)?[S]?[:\/]?\s+([^\n]+)/ig);
    
    if (narrRefMatches) {
      sections.references = narrRefMatches.map(ref => ref.trim());
    } else if (refMatches) {
      // Process each reference separately
      const processedRefs: string[] = [];
      refMatches.forEach(ref => {
        const cleanRef = ref.replace(/REF(?:ERENCE)?[S]?[:\/]?\s+/i, '').trim();
        // Split by commas if it looks like a list
        if (cleanRef.includes(',')) {
          const refParts = cleanRef.split(',').map(part => part.trim()).filter(Boolean);
          if (refParts.length > 1) {
            processedRefs.push(...refParts);
            return;
          }
        }
        processedRefs.push(cleanRef);
      });
      sections.references = processedRefs;
    }
  }
  
  // Look for REF/A, REF/B format references
  if (sections.references.length === 0) {
    const refLetterMatches = content.match(/REF\/[A-Z]\/[^\/]+\/\//g);
    if (refLetterMatches && refLetterMatches.length > 0) {
      sections.references = refLetterMatches.map(ref => ref.trim());
    }
  }

  // Extract remarks (RMK/1 format) - multiple approaches to ensure capture
  
  // First approach: Look for RMK/# format with extended content capture
  const rmkMatches = content.match(/RMK[S]?\/\d+\.\s+([\s\S]+?)(?=\n\s*RMK[S]?\/\d+\.|\n\s*\d+\.\s+|$)/ig);
  if (rmkMatches) {
    sections.remarks = rmkMatches.map(rmk => {
      // Preserve paragraph structure by replacing periods followed by spaces with line breaks
      // but avoid breaking abbreviations like "U.S." or "e.g."
      return rmk.replace(/(?<!\b[A-Za-z])\.\s+/g, '.\n').trim();
    });
  }

  // Second approach: Look for RMKS #. format
  if (sections.remarks.length === 0) {
    const rmksNumberedMatches = content.match(/RMKS\s+\d+\.\s+([\s\S]+?)(?=\n\s*\d+\.\s+|$)/ig);
    if (rmksNumberedMatches) {
      sections.remarks = rmksNumberedMatches.map(rmk => {
        // Preserve paragraph structure
        return rmk.replace(/(?<!\b[A-Za-z])\.\s+/g, '.\n').trim();
      });
    }
  }

  // Third approach: Look for the entire block after RMKS
  if (sections.remarks.length === 0) {
    const rmksBlockMatch = content.match(/RMKS[\s\/]+\d+\.([\s\S]*?)(?=\n\s*\d+\.\s+[A-Z]|$)/i);
    if (rmksBlockMatch && rmksBlockMatch[1]) {
      // Process the remarks block to preserve paragraph structure
      const rmksContent = rmksBlockMatch[1].trim();
      
      // Split by double newlines to preserve paragraph breaks
      const paragraphs = rmksContent.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
      
      if (paragraphs.length > 0) {
        // Join with proper paragraph formatting
        sections.remarks.push(`RMKS/1. ${paragraphs.join('\n\n')}`);
      } else {
        // Fallback to original content with basic formatting
        sections.remarks.push(`RMKS/1. ${rmksContent.replace(/(?<!\b[A-Za-z])\.\s+/g, '.\n')}`);
      }
    }
  }

  // Fourth approach: Look for highlighted blue sections in the NAVADMIN
  if (sections.remarks.length === 0) {
    // This would typically be in a blue highlighted section in the original document
    const narrRefBlockMatch = content.match(/NARR\/REF\s+A\s+IS\s+([\s\S]*?)(?=\n\s*RMKS|$)/i);
    if (narrRefBlockMatch && narrRefBlockMatch[1]) {
      // Add this to references if not already there
      if (sections.references.length === 0) {
        const refContent = narrRefBlockMatch[1].trim();
        // Split by line breaks for better formatting
        const refLines = refContent.split('\n').map(line => line.trim()).filter(Boolean);
        if (refLines.length > 0) {
          sections.references.push(`NARR/REF A IS ${refLines.join('\n')}`);
        } else {
          sections.references.push(`NARR/REF A IS ${refContent}`);
        }
      }
    }
  }

  // Fifth approach: Look for any content between REF section and numbered paragraphs
  if (sections.remarks.length === 0 && sections.references.length > 0) {
    const contentAfterRefs = content.split(/REF\/[A-Z]\/[^\/]+\/\//).pop();
    if (contentAfterRefs) {
      const beforeNumberedParagraphs = contentAfterRefs.split(/\n\s*\d+\.\s+/)[0];
      if (beforeNumberedParagraphs && beforeNumberedParagraphs.includes('RMKS')) {
        const rmksContent = beforeNumberedParagraphs.split(/RMKS[\s\/]*\d*\.?\s*/i)[1];
        if (rmksContent) {
          // Process for better paragraph structure
          const paragraphs = rmksContent.trim().split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
          if (paragraphs.length > 0) {
            sections.remarks.push(`RMKS/1. ${paragraphs.join('\n\n')}`);
          } else {
            sections.remarks.push(`RMKS/1. ${rmksContent.trim().replace(/(?<!\b[A-Za-z])\.\s+/g, '.\n')}`);
          }
        }
      }
    }
  }

  // Extract main content (paragraphs) with improved paragraph handling
  const lines = content.split('\n');
  let inMainContent = false;
  let currentParagraph = '';
  let inRemarks = false;
  let paragraphIndent = 0; // Track indentation level for nested paragraphs

  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;

    // Check if we've reached the remarks section
    if (line.match(/^RMK[S]?\/\d+\./i)) {
      inRemarks = true;
      inMainContent = false;
      continue; // Skip this line as we've already processed remarks
    }

    // Check if we've reached the main content
    if (!inMainContent && !inRemarks && (line.match(/^\d+\.\s+/) || line.match(/^[A-Z]\.\s+/))) {
      inMainContent = true;
    }

    // If we're in the main content, process paragraphs
    if (inMainContent && !inRemarks) {
      // Check for different paragraph types
      const isNumberedPara = line.match(/^\d+\.\s+/);
      const isLetteredPara = line.match(/^[A-Z]\.\s+/);
      const isSubNumberedPara = line.match(/^\s*\(\d+\)\s+/);
      const isSubLetteredPara = line.match(/^\s*\([a-z]\)\s+/);
      
      // Determine if this is a new paragraph of any type
      const isNewParagraph = isNumberedPara || isLetteredPara || isSubNumberedPara || isSubLetteredPara;
      
      if (isNewParagraph) {
        // Save the previous paragraph if it exists
        if (currentParagraph) {
          sections.mainContent.push(currentParagraph.trim());
        }
        
        // Start a new paragraph
        currentParagraph = line;
        
        // Set indentation level based on paragraph type
        if (isNumberedPara) paragraphIndent = 0;
        else if (isLetteredPara) paragraphIndent = 1;
        else if (isSubNumberedPara) paragraphIndent = 2;
        else if (isSubLetteredPara) paragraphIndent = 3;
      } else {
        // Check if this line might be a list item
        const isListItem = line.trim().match(/^[-•*]\s+/) || line.trim().match(/^\d+\)\s+/);
        
        if (isListItem) {
          // Add a line break before list items for better formatting
          currentParagraph += '\n' + line;
        } else {
          // Continue the current paragraph with proper spacing
          currentParagraph += ' ' + line;
        }
      }
    }
  }

  // Add the last paragraph if it exists
  if (currentParagraph) {
    sections.mainContent.push(currentParagraph.trim());
  }

  // Process main content to improve paragraph structure
  if (sections.mainContent.length > 0) {
    sections.mainContent = sections.mainContent.map(paragraph => {
      // Look for potential list items and format them with line breaks
      return paragraph.replace(/(?<=\s)[-•*]\s+/g, '\n- ') // Convert dash/bullet lists
                     .replace(/(?<=\s)\d+\)\s+/g, '\n$&') // Convert numbered lists with parentheses
                     .replace(/(?<!\b[A-Za-z])\.\s+(?=[A-Z])/g, '.\n'); // Add breaks after sentences
    });
  }

  // If we didn't find any main content, try a more aggressive approach
  if (sections.mainContent.length === 0) {
    // Look for numbered paragraphs anywhere in the content - using a compatible regex approach
    const paragraphMatches = content.match(/\n\s*\d+\.\s+[\s\S]+?(?=\n\s*\d+\.|$)/g);
    if (paragraphMatches) {
      sections.mainContent = paragraphMatches.map(p => {
        // Improve paragraph formatting
        return p.trim().replace(/(?<!\b[A-Za-z])\.\s+(?=[A-Z])/g, '.\n');
      });
    }
    
    // If still no content, try to extract everything between RMKS and the end
    if (sections.mainContent.length === 0) {
      const rmksMatch = content.match(/RMKS\/1\.([\s\S]+?)(?=\n\s*\d+\.\s+Released by|\n\s*\d+\.\s+This NAVADMIN will|BT|$)/i);
      if (rmksMatch && rmksMatch[1]) {
        // Split the content by numbered paragraphs
        const paragraphs = rmksMatch[1].trim().split(/(?=\n\s*\d+\.)/);
        for (const para of paragraphs) {
          if (para.trim()) {
            // Skip the first paragraph as it's part of RMKS/1
            if (!para.trim().startsWith("1.")) {
              sections.mainContent.push(para.trim().replace(/(?<!\b[A-Za-z])\.\s+(?=[A-Z])/g, '.\n'));
            }
          }
        }
      }
    }
  }
  
  // Special case for blue highlighted sections in the NAVADMIN
  // Look for content between NARR/REF and RMKS that might be highlighted
  if (sections.mainContent.length === 0) {
    const narrRefToRmksMatch = content.match(/NARR\/REF[\s\S]*?(?=RMKS)/i);
    if (narrRefToRmksMatch) {
      const highlightedContent = narrRefToRmksMatch[0];
      // Look for content that might be in parentheses or special formatting
      const specialContentMatch = highlightedContent.match(/\([^\)]+\)/g);
      if (specialContentMatch) {
        for (const specialContent of specialContentMatch) {
          if (specialContent.length > 10) { // Avoid small parenthetical content
            sections.remarks.push(`HIGHLIGHTED CONTENT: ${specialContent.trim()}`);
          }
        }
      }
    }
  }
  
  // Look for any blue highlighted sections that might be between references and numbered paragraphs
  if (sections.references.length > 0 && sections.mainContent.length > 0) {
    const firstMainContentItem = sections.mainContent[0];
    const firstNumberMatch = firstMainContentItem.match(/^(\d+)\./);
    
    if (firstNumberMatch && parseInt(firstNumberMatch[1]) > 1) {
      // We're missing paragraph 1, which might be in a highlighted section
      const contentBeforeFirstPara = content.split(firstMainContentItem)[0];
      const possibleHighlightedSection = contentBeforeFirstPara.split(/NARR\/REF/).pop();
      
      if (possibleHighlightedSection) {
        const cleanedSection = possibleHighlightedSection
          .replace(/REF\s+[A-Z]\s+IS\s+/g, '')
          .replace(/\/\/\s*$/, '')
          .trim();
          
        if (cleanedSection && !cleanedSection.match(/^\s*$/)) {
          sections.mainContent.unshift(`1. ${cleanedSection.replace(/(?<!\b[A-Za-z])\.\s+(?=[A-Z])/g, '.\n')}`);
        }
      }
    }
  }

  // Extract points of contact
  const pocMatches = content.match(/(?:POC|POINT OF CONTACT)[S]?[:\/]?\s+([^\n]+)/ig);
  if (pocMatches) {
    sections.pointsOfContact = pocMatches.map(poc =>
      poc.replace(/(?:POC|POINT OF CONTACT)[S]?[:\/]?\s+/i, '').trim()
    );
  }

  // Look for "The point of contact is" pattern
  const pocPattern = /The\s+point\s+of\s+contact\s+is\s+([^\n\.]+)/i;
  const pocMatch = content.match(pocPattern);
  if (pocMatch && pocMatch[1] && sections.pointsOfContact.length === 0) {
    sections.pointsOfContact.push(pocMatch[1].trim());
  }

  // Extract footer (usually classification repeated)
  const footerMatch = content.match(/((?:UNCLAS|UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET)[^\n]*$)/i);
  if (footerMatch) {
    sections.footer = footerMatch[1];
  }

  return sections;
}

/**
 * Generate HTML from parsed NAVADMIN sections
 */
function generateNavadminHtml(sections: NavadminSections): string {
  // Create the HTML content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>NAVADMIN ${sections.header.navadminNumber}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          body { font-size: 12pt; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
        }
        /* Enhanced paragraph spacing for readability */
        .content-paragraph {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        /* List styling */
        .navadmin-list {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .navadmin-list li {
          margin-bottom: 0.5rem;
        }
        /* Improved section spacing */
        .section-divider {
          margin: 1.5rem 0;
          border-top: 1px solid rgba(209, 213, 219, 0.5);
        }
      </style>
    </head>
    <body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div class="no-print bg-blue-50 dark:bg-blue-900 p-4 mb-6 rounded-lg max-w-7xl mx-auto mt-4">
        <h2 class="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">Print Instructions</h2>
        <p class="mb-2">To save this as a PDF:</p>
        <ol class="list-decimal pl-6 mb-4">
          <li>Press <strong>Ctrl+P</strong> (Windows) or <strong>Cmd+P</strong> (Mac)</li>
          <li>Select <strong>"Save as PDF"</strong> as the destination</li>
          <li>Click <strong>"Save"</strong></li>
        </ol>
        <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Print / Save as PDF
        </button>
      </div>

      <div class="max-w-7xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <!-- Header with NAVADMIN number and classification -->
        <div class="bg-blue-900 text-white p-6 rounded-t-lg">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 class="text-3xl font-bold">NAVADMIN ${sections.header.navadminNumber || 'N/A'}</h1>
            <div class="text-right mt-2 md:mt-0">
              <p>Date: ${sections.header.date || 'N/A'}</p>
              <p>From: ${sections.header.from || 'N/A'}</p>
              <p>To: ${sections.header.to || 'N/A'}</p>
              ${sections.header.info ? `<p>Info: ${sections.header.info}</p>` : ''}
            </div>
          </div>
          <p class="mt-2 text-sm">${sections.header.classification || 'UNCLASSIFIED//ROUTINE'}</p>
        </div>
        
        <!-- Main content area -->
        <div class="p-8">
          <!-- Title -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-blue-800 dark:text-blue-300">${sections.subject || 'NAVADMIN MESSAGE'}</h2>
          </div>
          
          <!-- References Section -->
          ${sections.references.length > 0 ? `
          <div class="mb-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-blue-800 dark:text-blue-300 border-b border-blue-200 dark:border-blue-700 pb-2 mb-4">References</h3>
            <ul class="list-none space-y-2 navadmin-list">
              ${sections.references.map(ref => `<li class="text-gray-800 dark:text-gray-200">${ref}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          <!-- Remarks Section -->
          ${sections.remarks.length > 0 ? `
          <div class="mb-8 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-indigo-800 dark:text-indigo-300 border-b border-indigo-200 dark:border-indigo-700 pb-2 mb-4">Remarks</h3>
            <div class="space-y-3">
              ${sections.remarks.map(remark => {
                // Extract the RMK number if present
                const rmkMatch = remark.match(/^(RMK[S]?\/\d+\.)\s+(.+)$/i);
                if (rmkMatch) {
                  // Process the content to add paragraph breaks
                  const content = rmkMatch[2].replace(/\.\s+/g, '.\n').split('\n').map(para =>
                    para.trim() ? `<p class="content-paragraph">${para}</p>` : ''
                  ).join('');
                  
                  return `
                    <div class="mb-4">
                      <p class="text-gray-800 dark:text-gray-200 font-bold mb-2">
                        ${rmkMatch[1]}
                      </p>
                      <div class="pl-4 text-gray-800 dark:text-gray-200">
                        ${content}
                      </div>
                    </div>
                  `;
                } else {
                  // Process regular remarks with paragraph breaks
                  const paragraphs = remark.replace(/\.\s+/g, '.\n').split('\n');
                  return paragraphs.map(para =>
                    para.trim() ? `<p class="content-paragraph text-gray-800 dark:text-gray-200">${para}</p>` : ''
                  ).join('');
                }
              }).join('')}
            </div>
          </div>
          ` : ''}
          
          <!-- Main Content Section -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-blue-800 dark:text-blue-300 border-b border-blue-200 dark:border-blue-700 pb-2 mb-4">Message Content</h3>
            <div class="space-y-4">
              ${sections.mainContent.map(paragraph => {
                // Check if this is a numbered paragraph (e.g., "1. Content")
                const numMatch = paragraph.match(/^(\d+\.\s+)(.+)$/);
                // Check if this is a lettered subparagraph (e.g., "A. Content")
                const letterMatch = paragraph.match(/^([A-Z]\.\s+)(.+)$/);
                // Check if this is a sub-subparagraph (e.g., "(1) Content")
                const subNumMatch = paragraph.match(/^\s*\((\d+)\)\s+(.+)$/);
                // Check if this is a sub-sub-subparagraph (e.g., "(a) Content")
                const subLetterMatch = paragraph.match(/^\s*\(([a-z])\)\s+(.+)$/);
                
                // Function to process paragraph content with better formatting
                const processContent = (content: string) => {
                  // Split content by periods followed by spaces to create paragraphs
                  // but avoid splitting abbreviations like "U.S." or "e.g."
                  const paragraphs = content
                    .replace(/(?<!\b[A-Za-z])\.\s+/g, '.\n')  // Split on periods not part of abbreviations
                    .replace(/;\s+/g, ';\n')  // Split on semicolons
                    .split('\n');
                  
                  // Check if content contains a list (items with dashes, asterisks, or numbers)
                  const hasList = /(?:^|\n)[\s-]*(?:-|\*|\d+\.)\s+/.test(content);
                  
                  if (hasList) {
                    // Process as a list
                    const listItems = content.split(/(?:^|\n)[\s-]*(?:-|\*|\d+\.)\s+/).filter(Boolean);
                    if (listItems.length > 1) {
                      return `
                        <ul class="list-disc pl-5 space-y-2 navadmin-list">
                          ${listItems.map(item => `<li>${item.trim()}</li>`).join('')}
                        </ul>
                      `;
                    }
                  }
                  
                  // Regular paragraph processing
                  return paragraphs.map(para =>
                    para.trim() ? `<p class="content-paragraph">${para}</p>` : ''
                  ).join('');
                };
                
                if (numMatch) {
                  return `
                    <div class="mb-6">
                      <h4 class="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">${numMatch[1]}</h4>
                      <div class="text-gray-800 dark:text-gray-200 pl-2">
                        ${processContent(numMatch[2])}
                      </div>
                    </div>
                  `;
                } else if (letterMatch) {
                  return `
                    <div class="mb-5 ml-6">
                      <h5 class="font-bold text-gray-900 dark:text-gray-100 mb-2">${letterMatch[1]}</h5>
                      <div class="text-gray-800 dark:text-gray-200 pl-2">
                        ${processContent(letterMatch[2])}
                      </div>
                    </div>
                  `;
                } else if (subNumMatch) {
                  return `
                    <div class="mb-4 ml-12">
                      <p class="text-gray-800 dark:text-gray-200 mb-2">
                        <span class="font-bold">(${subNumMatch[1]})</span>
                      </p>
                      <div class="pl-6 text-gray-800 dark:text-gray-200">
                        ${processContent(subNumMatch[2])}
                      </div>
                    </div>
                  `;
                } else if (subLetterMatch) {
                  return `
                    <div class="mb-4 ml-16">
                      <p class="text-gray-800 dark:text-gray-200 mb-2">
                        <span class="font-bold">(${subLetterMatch[1]})</span>
                      </p>
                      <div class="pl-6 text-gray-800 dark:text-gray-200">
                        ${processContent(subLetterMatch[2])}
                      </div>
                    </div>
                  `;
                } else {
                  // Process regular paragraphs
                  return `<div class="text-gray-800 dark:text-gray-200">${processContent(paragraph)}</div>`;
                }
              }).join('')}
            </div>
          </div>
          
          <!-- Points of Contact Section -->
          ${sections.pointsOfContact.length > 0 ? `
          <div class="mb-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-green-800 dark:text-green-300 border-b border-green-200 dark:border-green-700 pb-2 mb-4">Points of Contact</h3>
            <ul class="list-disc pl-5 space-y-2 navadmin-list">
              ${sections.pointsOfContact.map(poc => `<li class="text-gray-800 dark:text-gray-200">${poc}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
        
        <!-- Footer -->
        <div class="bg-blue-900 text-white p-4 text-center text-sm rounded-b-lg">
          <p>${sections.footer || sections.header.classification || 'UNCLASSIFIED//ROUTINE'}</p>
          <p>NAVADMIN ${sections.header.navadminNumber || 'N/A'}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * NAVADMIN sections interface
 */
interface NavadminSections {
  header: {
    navadminNumber: string;
    date: string;
    classification: string;
    from: string;
    to: string;
    info: string;
  };
  subject: string;
  references: string[];
  remarks: string[]; // Added remarks section for RMK/1
  mainContent: string[];
  pointsOfContact: string[];
  footer: string;
}