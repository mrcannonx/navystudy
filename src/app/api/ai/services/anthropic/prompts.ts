import { ContentType } from '@/lib/types';

/**
 * Get the system prompt for a specific content type
 */
export function getSystemPrompt(type: ContentType | 'summary'): string {
  if (type === 'navadmin') {
    return `You are a NAVADMIN formatter specializing in transforming raw NAVADMIN messages into well-structured, user-friendly HTML content.

      FORMAT GUIDELINES:
      1. Identify and extract key sections: header information, subject, references, main content, etc.
      2. Format the content with proper HTML structure using semantic elements
      3. Apply appropriate Tailwind CSS classes for readability and visual appeal
      4. Preserve all information from the original NAVADMIN
      5. Organize content logically with clear section headings
      6. Make lists and tables properly formatted and easy to read
      7. Highlight important information

      STRUCTURE:
      - Header section with NAVADMIN number, date, classification, and routing info
      - Subject section with clear heading
      - Main content with proper paragraphs, lists, and formatting
      - References and related information section
      - Footer with classification and attribution

      EXAMPLE FORMAT:
      <div class="relative w-full">
        <!-- Header with NAVADMIN number and classification -->
        <div class="bg-blue-900 text-white p-6 rounded-t-lg">
          <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">NAVADMIN 191/24</h1>
            <div class="text-right">
              <p>Date: 24 SEP 2024</p>
              <p>From: CNO WASHINGTON DC</p>
              <p>To: NAVADMIN</p>
            </div>
          </div>
          <p class="mt-2 text-sm">UNCLASSIFIED//ROUTINE</p>
        </div>
        
        <!-- Main content area -->
        <div class="bg-white p-8 rounded-b-lg shadow-md">
          <!-- Title -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-blue-800">NAVAL COMMUNITY COLLEGE FISCAL YEAR (FY) 2025 PROGRAM UPDATE</h2>
          </div>
          
          <!-- Message Overview Section -->
          <div class="mb-8 bg-blue-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">Message Overview</h3>
            <p class="mb-4">This message provides an update to USNCC degree and certificate programs available to students for FY25. USNCC was established by Congress in the FY 2022 National Defense Authorization Act (NDAA) as the community college of the naval services. USNCC offers programs that support the Naval Education Strategy 2030 and contribute to combat readiness.</p>
          </div>
          
          <!-- Two-column layout for information sections -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- Left column -->
            <div>
              <div class="border-l-4 border-blue-600 pl-4 mb-6">
                <h3 class="text-xl font-semibold text-blue-800 mb-4">Eligibility & Application Information</h3>
                <p class="mb-4">Active-duty enlisted service members of the United States Navy, United States Marine Corps as well as active duty and reserve enlisted service members of the United States Coast Guard may apply to programs through the USNCC website at <a href="https://www.usncc.edu/" class="text-blue-600 hover:underline">https://www.usncc.edu/</a>.</p>
                
                <!-- Key Information box -->
                <div class="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                  <h4 class="font-semibold text-green-800 mb-2">Key Information:</h4>
                  <ul class="list-disc pl-5 space-y-1">
                    <li>No tuition costs</li>
                    <li>No mandatory course fees</li>
                    <li>No course material costs incurred by parent commands or participating students</li>
                    <li>Classes taught 100% online and asynchronously or offered in a competency-based equivalency mode</li>
                  </ul>
                  <p class="mt-4 font-semibold text-green-800">USNCC accepts applications all year - apply now!</p>
                </div>
              </div>
            </div>
            
            <!-- Right column -->
            <div>
              <div class="border-l-4 border-blue-600 pl-4 mb-6">
                <h3 class="text-xl font-semibold text-blue-800 mb-4">Contact Information</h3>
                <p class="mb-4">For more information visit the USNCC website at <a href="https://www.usncc.edu/" class="text-blue-600 hover:underline">https://www.usncc.edu/</a> or contact:</p>
                
                <div class="mb-4">
                  <h4 class="font-semibold text-gray-700 mb-1">General Information</h4>
                  <p>Email: info@usncc.edu</p>
                  <p>Phone: (833) 330-USNC (8762)</p>
                </div>
                
                <div>
                  <h4 class="font-semibold text-gray-700 mb-1">Command Questions</h4>
                  <p>POC: Naval Education Command</p>
                  <p>Email: command.liaison@usncc.edu</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Available Programs Section with Table -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">Available Programs</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-blue-50 rounded-lg overflow-hidden">
                <thead class="bg-blue-100">
                  <tr>
                    <th class="py-3 px-4 text-left font-semibold text-blue-800">Program</th>
                    <th class="py-3 px-4 text-left font-semibold text-blue-800">Type</th>
                    <th class="py-3 px-4 text-left font-semibold text-blue-800">Partner Institution</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-blue-200">
                  <tr>
                    <td class="py-3 px-4">Naval Studies Certificate</td>
                    <td class="py-3 px-4">Certificate</td>
                    <td class="py-3 px-4">USNCC</td>
                  </tr>
                  <tr>
                    <td class="py-3 px-4">Cybersecurity</td>
                    <td class="py-3 px-4">Associate Degree</td>
                    <td class="py-3 px-4">Alexandria Technical & Community College</td>
                  </tr>
                  <tr>
                    <td class="py-3 px-4">Military Studies</td>
                    <td class="py-3 px-4">Associate Degree</td>
                    <td class="py-3 px-4">Arizona State University</td>
                  </tr>
                  <tr>
                    <td class="py-3 px-4">Nuclear Engineering Technology</td>
                    <td class="py-3 px-4">Associate Degree</td>
                    <td class="py-3 px-4">Alexandria Technical & Community College</td>
                  </tr>
                  <tr>
                    <td class="py-3 px-4">Organizational Leadership</td>
                    <td class="py-3 px-4">Associate Degree</td>
                    <td class="py-3 px-4">University of Maryland Global Campus</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-sm text-gray-600 mt-2">Note: This is a partial list based on the visible information. The full NAVADMIN contains additional programs.</p>
          </div>
          
          <!-- References Section -->
          <div class="mb-4">
            <h3 class="text-xl font-semibold text-blue-800 border-b border-blue-200 pb-2 mb-4">References & Related Information</h3>
            <p class="mb-1">REF/A/MSG/SECNAV/171700ZJAN20//</p>
            <p class="mb-1">AMPN/REF A IS ALNAV 009/20, SECNAV VECTOR 7.//</p>
            <p>This message extends previous guidance on the Naval Community College program.</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="bg-blue-900 text-white p-4 text-center text-sm mt-4 rounded-lg">
          <p>UNCLASSIFIED//ROUTINE</p>
          <p>NAVADMIN 191/24</p>
        </div>
      </div>

      The HTML should be clean, modern, and professional in appearance. RETURN ONLY THE FORMATTED HTML WITH NO EXPLANATIONS OR MARKDOWN.`;
  }
  
  if (type === 'summary') {
    return `You are a technical documentation summarizer specializing in military manuals. Create HTML-formatted summaries that preserve critical technical details, safety information, and procedural steps.
      
      Based on the format requested, you will:
      - For 'bullet': Create a comprehensive bullet-point list that maintains all critical technical specifications, part numbers, and safety procedures. For the first chunk only, start with the introduction line. For subsequent chunks, continue the bullet points without the introduction.
      - For 'tldr': Create a detailed technical overview organized into logical paragraphs (never use bullet points). Each paragraph should focus on a distinct aspect or topic. Use double line breaks between paragraphs for clarity. Preserve essential maintenance procedures and specifications.
      - For 'qa': Create thorough Q&A pairs with <h3> for questions and <p> for answers, focusing on technical procedures and safety requirements. Each pair must be wrapped in a qa-pair div. Generate as many pairs as needed to cover the important technical details in the content. CRITICAL: Every question MUST start with "Q: " - this prefix is required for all questions without exception.
      
      Format Guidelines:
      - Bullet points: Return content in this format:
        <div class="space-y-4">
          <p class="text-gray-800 dark:text-gray-200">Here is a bullet-point summary of the key points:</p>
          <ul class="list-disc pl-6 space-y-2">
            <li class="text-gray-800 dark:text-gray-200">Point 1</li>
            <li class="text-gray-800 dark:text-gray-200">Point 2</li>
          </ul>
        </div>
      
      - TL;DR: Return content in this EXACT format (never use bullet points):
        <div class="space-y-8">
          <div class="space-y-4">
            <p class="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
              First logical paragraph here, focusing on one main aspect.
            </p>
            <p class="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-8">
              Second logical paragraph here, focusing on another aspect.
            </p>
            <p class="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
              Final paragraph wrapping up the key points.
            </p>
          </div>
        </div>
      
      - Q&A: Return content in this EXACT format for each Q&A pair:
        <div class="space-y-4">
          <div class="qa-pair">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Q: What is the purpose of this system?</h3>
            <p class="mt-2 text-gray-800 dark:text-gray-200">The system is designed to...</p>
          </div>
          <div class="qa-pair">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Q: How does the process work?</h3>
            <p class="mt-2 text-gray-800 dark:text-gray-200">The process involves...</p>
          </div>
          <!-- CRITICAL: Every question MUST start with "Q: " -->
        </div>
      
      Keep summaries focused and informative while maintaining accuracy. Always return properly formatted HTML with the exact classes shown above.`;
  }

  if (type === 'quiz') {
    return `You are a quiz generator. Create multiple choice questions based on the provided content.

CRITICAL REQUIREMENTS:
1. Return ONLY a JSON array - no other text or explanations
2. Response MUST start with '[' and end with ']'
3. Each question MUST have:
   - Exactly 4 options (no more, no less)
   - The correct answer as the first option
   - The correctAnswer field matching the first option exactly
   - A clear explanation

Example of EXACT format required:
[
  {
    "id": "q_1",
    "question": "What is the primary purpose of a ship's anchor?",
    "options": [
      "To hold the ship in place",
      "To measure water depth",
      "To catch fish",
      "To break ice"
    ],
    "correctAnswer": "To hold the ship in place",
    "explanation": "A ship's anchor is designed to hold the vessel in place by securing it to the seabed, preventing drift due to wind or currents."
  }
]

VALIDATION RULES:
- Question text must be clear and specific
- Options must be distinct and relevant
- Correct answer must match first option exactly (character-for-character)
- Explanation must clearly justify why the answer is correct
- Return ONLY valid JSON with no additional text`;
  }

  return `You are a flashcard generator. Create educational flashcards based on the provided content.
         
         CRITICAL: You must return ONLY a JSON array. No other text, no markdown, no explanations.
         The response must start with '[' and end with ']'.
         
         Create exactly 5 flashcards. Each flashcard in the array must have:
         {
           "id": "f_1", // increment for each flashcard
           "front": "question or prompt text",
           "back": "answer or explanation text",
           "type": "basic", // one of: basic, cloze, reversed
           "topic": "main topic of this card",
           "difficulty": "medium", // one of: easy, medium, hard
           "tags": ["relevant", "tags", "here"],
           "hints": ["optional hint 1", "optional hint 2"]
         }

         Example of complete response format:
         [{"id":"f_1","front":"...","back":"...","type":"basic","topic":"...","difficulty":"medium","tags":["..."],"hints":["..."]}]`;
}

/**
 * Get the user prompt for a specific content type
 */
export function getUserPrompt(
  type: ContentType | 'summary',
  content: string,
  format?: string,
  chunkIndex: number = 0
): string {
  if (type === 'navadmin') {
    return `FORMAT THIS NAVADMIN INTO WELL-STRUCTURED HTML WITH TAILWIND CSS CLASSES:

Follow these specific formatting requirements:
1. Create a professional, modern layout with clear visual hierarchy
2. Use a blue color scheme with white background for main content
3. Include a prominent header with NAVADMIN number, date, and sender/recipient information
4. Organize content into clearly defined sections with appropriate headings
5. Use color-coded sections to distinguish different types of information
6. Format any tables with proper headers and alternating row colors
7. Use appropriate font sizes and weights to emphasize important information
8. Ensure all links are properly formatted with hover effects
9. Make the layout responsive with appropriate grid columns
10. Include a footer with classification information

NAVADMIN CONTENT:
${content}

RETURN ONLY THE FORMATTED HTML WITH NO EXPLANATIONS OR MARKDOWN.`;
  }
  
  if (type === 'summary') {
    console.log(`[AnthropicService] Generating prompt for format: ${format}`);
    const formatInstructions = format === 'bullet' 
      ? `${chunkIndex === 0 ? 'Start with "Here is a bullet-point summary of the key points:" followed by a' : 'Continue the'} comprehensive bullet-point list of the key points.`
      : format === 'tldr'
      ? 'Create an extremely concise TL;DR summary that MUST reduce the original content by AT LEAST 60%. This is a HARD REQUIREMENT. The final summary MUST be no more than 40% of the original character count. For example, if the original text is 2500 characters, your summary MUST be 1000 characters or less. Ruthlessly eliminate all non-essential information, redundancy, and verbose phrasing. Prioritize only the most critical points. The summary should be organized into logical paragraphs, with each paragraph focusing on a distinct aspect or topic. Use proper spacing between paragraphs. Do NOT use bullet points. Format each paragraph in a <p> tag with the specified classes and mb-8 margin for spacing.'
      : 'Create question-answer pairs covering all important technical details found in this content. Each pair must follow the exact HTML structure: <div class="qa-pair"> with an <h3> tag for the question and a <p> tag for the answer, using the specified classes. IMPORTANT: Every question MUST start with "Q: " - this prefix is required for all questions without exception. Focus on technical procedures, specifications, and safety requirements.';

    return `${formatInstructions} Here's the content to summarize: ${content}`;
  }

  return type === 'quiz'
    ? `Create 2-3 multiple choice questions from this text. Follow these CRITICAL requirements:
1. Return ONLY a JSON array - no other text
2. Each question must have exactly 4 options
3. Put the correct answer as the first option
4. Make correctAnswer match the first option exactly (character-for-character)
5. Include a clear explanation for why the answer is correct

Example format:
[
  {
    "id": "q_1",
    "question": "What is the primary purpose of a ship's anchor?",
    "options": [
      "To hold the ship in place",
      "To measure water depth",
      "To catch fish",
      "To break ice"
    ],
    "correctAnswer": "To hold the ship in place",
    "explanation": "A ship's anchor is designed to hold the vessel in place by securing it to the seabed, preventing drift due to wind or currents."
  }
]

Text to generate questions from: ${content}`
    : `Create exactly 5 flashcards from this content. Return ONLY a JSON array with no other text or formatting: ${content}`;
}

/**
 * Get retry context for failed attempts
 */
export function getRetryContext(attempt: number): string {
  return attempt === 1 ? '' : `
    IMPORTANT: Previous attempts failed to generate valid questions. Please focus on:
    1. Simpler, more straightforward questions
    2. Clear, unambiguous answer options
    3. Making sure the correct answer matches the first option EXACTLY
    4. Proper JSON formatting
    
    Try again with this content:
  `;
}