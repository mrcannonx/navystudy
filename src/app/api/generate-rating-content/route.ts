import { NextResponse } from 'next/server';
import { makeAIRequest } from '@/lib/ai-client';
import { chunkContent, preprocessContent, extractContext } from '@/lib/utils/content-chunker';
import { extractAndParseJson } from '@/lib/utils/json-sanitizer';

/**
 * Ensures achievements are properly formatted with one per line
 */
function formatAchievements(achievements: string): string {
  if (!achievements) return '';
  
  // Split by common delimiters that might be used
  let lines = achievements
    .split(/\n|\\n|•|\*|(?:\d+\.\s)/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // If we didn't get multiple lines, try to split by periods followed by spaces
  if (lines.length <= 1) {
    lines = achievements
      .split(/\.\s+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
  
  // Process each line to ensure proper formatting
  const formattedLines = lines.map(line => {
    // Capitalize first letter if it's not already
    let formatted = line;
    if (formatted.length > 0 && formatted[0].toLowerCase() === formatted[0]) {
      formatted = formatted[0].toUpperCase() + formatted.substring(1);
    }
    
    // Remove trailing punctuation
    formatted = formatted.replace(/[.,;:!?]+$/, '');
    
    // Ensure it has proper placeholders for numbers
    if (!formatted.includes('##')) {
      formatted = formatted.replace(/\b\d+\b/g, '##');
    }
    
    // Add a period at the end if it doesn't have one
    if (!formatted.endsWith('.')) {
      formatted += '.';
    }
    
    return formatted;
  });
  
  return formattedLines.join('\n');
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { ratingAbbreviation, serviceRating, inputText } = body;

    // Validate input
    if (!inputText || !inputText.trim()) {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    console.warn('Processing detailed rating information');
    
    // Preprocess the input text to normalize formatting
    const processedText = preprocessContent(inputText);
    
    // First try to use AI to generate the content
    try {
      // Check if the input is large and needs chunking
      const MAX_CHUNK_SIZE = 4000; // Characters per chunk
      const needsChunking = processedText.length > MAX_CHUNK_SIZE;
      
      if (needsChunking) {
        console.log(`Input text is large (${processedText.length} characters), chunking into smaller pieces`);
        
        // Create chunks with appropriate overlap
        const chunks = chunkContent(processedText, MAX_CHUNK_SIZE, 20);
        console.log(`Created ${chunks.length} chunks for processing`);
        
        // Process each chunk and combine results
        const chunkResults = [];
        
        for (let i = 0; i < chunks.length; i++) {
          console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
          
          // Create a prompt for this chunk
          const chunkPrompt = `
You are a Navy career expert tasked with creating structured content for a Navy rating database.

I need you to analyze the following information about the Navy rating ${ratingAbbreviation || '[Rating]'}
in the ${serviceRating || '[Service Area]'} service area.

${i === 0 ? `This is CHUNK ${i + 1} of ${chunks.length}. Focus on extracting key information from this chunk.` :
  i === chunks.length - 1 ? `This is the FINAL CHUNK (${i + 1} of ${chunks.length}). Combine this with previous information.` :
  `This is CHUNK ${i + 1} of ${chunks.length}. Add to information from previous chunks.`}

${chunks[i]}

${i === chunks.length - 1 ? `
Now that you've analyzed all chunks, generate three components:

1. DESCRIPTION: A comprehensive description (500-1000 characters) that explains what this rating does,
   their responsibilities, and key aspects of their role.

2. KEYWORDS: A comma-separated list of 20-30 relevant technical terms, equipment names, systems,
   and responsibilities associated with this rating.

3. ACHIEVEMENTS: A list of 10-15 achievement bullet points that could be used in evaluations or resumes.
   Format these as templates with '##' placeholders for numbers (e.g., "Maintained ## systems at ##% readiness").
   Each achievement should be on a new line.

Respond with a JSON object containing these three components as strings:
{
  "description": "...",
  "keywords": "...",
  "achievements": "..."
}` :
`Extract key information from this chunk that will help build:
1. A description of what this rating does
2. Technical terms and responsibilities
3. Achievement examples

Respond with a JSON object:
{
  "chunkInfo": "Brief summary of key information in this chunk"
}`}
`;

          try {
            // Add delay between chunks to respect rate limits
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Call the AI service for this chunk
            const chunkResponse = await makeAIRequest(chunkPrompt, 'metrics');
            
            if (chunkResponse.success && chunkResponse.data) {
              // For the final chunk, we expect the full structured response
              if (i === chunks.length - 1) {
                // Parse the AI response
                let parsedData;
                try {
                  // The AI response might be a string that needs parsing
                  if (typeof chunkResponse.data === 'string') {
                    // Try to extract JSON from the response if it's wrapped in text
                    parsedData = extractAndParseJson(chunkResponse.data as string);
                    if (!parsedData) {
                      // Try to extract content directly from the text if JSON parsing fails
                      console.log('JSON parsing failed, attempting to extract content directly from text');
                      const responseText = chunkResponse.data as string;
                      
                      // Look for sections in the text that might contain our data
                      const descriptionSection = responseText.match(/DESCRIPTION:?\s*([\s\S]*?)(?=KEYWORDS:|ACHIEVEMENTS:|$)/i);
                      const keywordsSection = responseText.match(/KEYWORDS:?\s*([\s\S]*?)(?=DESCRIPTION:|ACHIEVEMENTS:|$)/i);
                      const achievementsSection = responseText.match(/ACHIEVEMENTS:?\s*([\s\S]*?)(?=DESCRIPTION:|KEYWORDS:|$)/i);
                      
                      if (descriptionSection || keywordsSection || achievementsSection) {
                        parsedData = {
                          description: descriptionSection ? descriptionSection[1].trim() : '',
                          keywords: keywordsSection ? keywordsSection[1].trim() : '',
                          achievements: achievementsSection ? achievementsSection[1].trim() : ''
                        };
                      } else {
                        throw new Error('Could not extract content from AI response');
                      }
                    }
                  } else if (chunkResponse.data.summary) {
                    // If the response has a summary field, try to parse that
                    parsedData = extractAndParseJson(chunkResponse.data.summary as string);
                    if (!parsedData) {
                      // Try to extract content directly from the text if JSON parsing fails
                      console.log('JSON parsing failed, attempting to extract content directly from text');
                      const summaryText = chunkResponse.data.summary as string;
                      
                      // Look for sections in the text that might contain our data
                      const descriptionSection = summaryText.match(/DESCRIPTION:?\s*([\s\S]*?)(?=KEYWORDS:|ACHIEVEMENTS:|$)/i);
                      const keywordsSection = summaryText.match(/KEYWORDS:?\s*([\s\S]*?)(?=DESCRIPTION:|ACHIEVEMENTS:|$)/i);
                      const achievementsSection = summaryText.match(/ACHIEVEMENTS:?\s*([\s\S]*?)(?=DESCRIPTION:|KEYWORDS:|$)/i);
                      
                      if (descriptionSection || keywordsSection || achievementsSection) {
                        parsedData = {
                          description: descriptionSection ? descriptionSection[1].trim() : '',
                          keywords: keywordsSection ? keywordsSection[1].trim() : '',
                          achievements: achievementsSection ? achievementsSection[1].trim() : ''
                        };
                      } else {
                        throw new Error('Could not extract content from AI response');
                      }
                    }
                  } else {
                    // If it's already an object with the right structure
                    parsedData = chunkResponse.data;
                  }
                  
                  // Validate the parsed data has the expected fields
                  if (parsedData.description && parsedData.keywords && parsedData.achievements) {
                    // Ensure achievements are properly formatted with one per line
                    const formattedAchievements = formatAchievements(parsedData.achievements);
                    
                    return NextResponse.json({
                      description: parsedData.description,
                      keywords: parsedData.keywords,
                      achievements: formattedAchievements
                    });
                  } else {
                    throw new Error('AI response missing required fields');
                  }
                } catch (parseError) {
                  console.error('Error parsing final chunk response:', parseError);
                  throw parseError; // Re-throw to trigger fallback
                }
              } else {
                // For intermediate chunks, just store the chunk info
                chunkResults.push(chunkResponse.data);
              }
            } else {
              throw new Error(`Failed to process chunk ${i + 1}`);
            }
          } catch (chunkError) {
            console.error(`Error processing chunk ${i + 1}:`, chunkError);
            // If any chunk fails, abort chunking and try the single-prompt approach
            throw new Error('Chunk processing failed, trying alternative approach');
          }
        }
      } else {
        // For smaller inputs, use a single prompt
        const prompt = `
You are a Navy career expert tasked with creating structured content for a Navy rating database.

I need you to analyze the following information about the Navy rating ${ratingAbbreviation || '[Rating]'}
in the ${serviceRating || '[Service Area]'} service area and generate three components:

1. DESCRIPTION: A comprehensive description (500-1000 characters) that explains what this rating does,
   their responsibilities, and key aspects of their role.

2. KEYWORDS: A comma-separated list of 20-30 relevant technical terms, equipment names, systems,
   and responsibilities associated with this rating.

3. ACHIEVEMENTS: A list of 10-15 achievement bullet points that could be used in evaluations or resumes.
   Format these as templates with '##' placeholders for numbers (e.g., "Maintained ## systems at ##% readiness").
   Each achievement should be on a new line.

Here is the information about the rating:

${processedText}

Respond with a JSON object containing these three components as strings:
{
  "description": "...",
  "keywords": "...",
  "achievements": "..."
}
`;

        // Call the AI service
        const aiResponse = await makeAIRequest(prompt, 'metrics');
        
        if (aiResponse.success && aiResponse.data) {
          // Parse the AI response
          let parsedData;
          try {
            // The AI response might be a string that needs parsing
            if (typeof aiResponse.data === 'string') {
              // Try to extract JSON from the response if it's wrapped in text
              parsedData = extractAndParseJson(aiResponse.data as string);
              if (!parsedData) {
                // Try to extract content directly from the text if JSON parsing fails
                console.log('JSON parsing failed, attempting to extract content directly from text');
                const responseText = aiResponse.data as string;
                
                // Look for sections in the text that might contain our data
                const descriptionSection = responseText.match(/DESCRIPTION:?\s*([\s\S]*?)(?=KEYWORDS:|ACHIEVEMENTS:|$)/i);
                const keywordsSection = responseText.match(/KEYWORDS:?\s*([\s\S]*?)(?=DESCRIPTION:|ACHIEVEMENTS:|$)/i);
                const achievementsSection = responseText.match(/ACHIEVEMENTS:?\s*([\s\S]*?)(?=DESCRIPTION:|KEYWORDS:|$)/i);
                
                if (descriptionSection || keywordsSection || achievementsSection) {
                  parsedData = {
                    description: descriptionSection ? descriptionSection[1].trim() : '',
                    keywords: keywordsSection ? keywordsSection[1].trim() : '',
                    achievements: achievementsSection ? achievementsSection[1].trim() : ''
                  };
                } else {
                  throw new Error('Could not extract content from AI response');
                }
              }
            } else if (aiResponse.data.summary) {
              // If the response has a summary field, try to parse that
              parsedData = extractAndParseJson(aiResponse.data.summary as string);
              if (!parsedData) {
                // Try to extract content directly from the text if JSON parsing fails
                console.log('JSON parsing failed, attempting to extract content directly from text');
                const summaryText = aiResponse.data.summary as string;
                
                // Look for sections in the text that might contain our data
                const descriptionSection = summaryText.match(/DESCRIPTION:?\s*([\s\S]*?)(?=KEYWORDS:|ACHIEVEMENTS:|$)/i);
                const keywordsSection = summaryText.match(/KEYWORDS:?\s*([\s\S]*?)(?=DESCRIPTION:|ACHIEVEMENTS:|$)/i);
                const achievementsSection = summaryText.match(/ACHIEVEMENTS:?\s*([\s\S]*?)(?=DESCRIPTION:|KEYWORDS:|$)/i);
                
                if (descriptionSection || keywordsSection || achievementsSection) {
                  parsedData = {
                    description: descriptionSection ? descriptionSection[1].trim() : '',
                    keywords: keywordsSection ? keywordsSection[1].trim() : '',
                    achievements: achievementsSection ? achievementsSection[1].trim() : ''
                  };
                } else {
                  throw new Error('Could not extract content from AI response');
                }
              }
            } else {
              // If it's already an object with the right structure
              parsedData = aiResponse.data;
            }
            
            // Validate the parsed data has the expected fields
            if (parsedData.description && parsedData.keywords && parsedData.achievements) {
              // Ensure achievements are properly formatted with one per line
              const formattedAchievements = formatAchievements(parsedData.achievements);
              
              return NextResponse.json({
                description: parsedData.description,
                keywords: parsedData.keywords,
                achievements: formattedAchievements
              });
            } else {
              throw new Error('AI response missing required fields');
            }
          } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            // Fall back to rule-based generation
          }
        }
      }
      
      // If we get here, the AI request failed or returned invalid data
      console.warn('AI generation failed, falling back to rule-based approach');
    } catch (aiError) {
      console.error('AI service error:', aiError);
      // Continue with fallback approach
    }
    
    // Fallback: Use the rule-based approach if AI fails
    // This is a simplified fallback mechanism that extracts basic information
    // from the input text. The AI-generated content is preferred and more comprehensive,
    // but this ensures we always return something useful even if AI generation fails.
    
    // Extract a comprehensive description from the input text
    let description = '';
    const paragraphs = inputText.split('\n\n');
    
    if (paragraphs.length > 0) {
      // For short inputs, use more paragraphs to create a comprehensive description
      if (paragraphs[0].length < 200 && paragraphs.length > 1) {
        // Combine first two paragraphs for a more complete description
        description = [paragraphs[0], paragraphs[1]].join(' ').trim();
        
        // If we have a section titled "Employment and sub specialties" or similar, include that too
        const specialtiesIndex = paragraphs.findIndex((p: string) =>
          p.toLowerCase().includes('employment') ||
          p.toLowerCase().includes('specialties') ||
          p.toLowerCase().includes('duties')
        );
        
        if (specialtiesIndex > 0 && specialtiesIndex < 4) {
          description += ' ' + paragraphs[specialtiesIndex].trim();
        }
      } else {
        // For longer first paragraphs, just use that
        description = paragraphs[0].trim();
      }
      
      // Look for information about the selected rating in the text
      if (ratingAbbreviation) {
        // Try to find sentences that specifically mention the selected rating
        const ratingRegex = new RegExp(`\\b${ratingAbbreviation}\\b[^.]*\\.[^.]*`, 'i');
        const ratingMatches = inputText.match(ratingRegex);
        
        if (ratingMatches && ratingMatches.length > 0) {
          // Add the specific rating information to the description
          description += ' ' + ratingMatches[0].trim();
        }
      }
      
      // Look for information about sub-specialties or variations
      const specialtyRegex = /\b(?:subspecialt(?:y|ies)|variation|type|class)\b[^.]*\.[^.]*/gi;
      const specialtyMatches = inputText.match(specialtyRegex);
      
      if (specialtyMatches && specialtyMatches.length > 0) {
        // Add the first specialty information to the description
        description += ' ' + specialtyMatches[0].trim();
      }
      
      // If it's too long, trim it to a reasonable length while keeping complete sentences
      // Allow for longer descriptions (1000 characters) to provide more comprehensive information
      if (description.length > 1000) {
        const sentences = description.match(/[^.!?]+[.!?]+/g) || [];
        let shortDescription = '';
        for (const sentence of sentences) {
          if ((shortDescription + sentence).length <= 1000) {
            shortDescription += sentence;
          } else {
            break;
          }
        }
        description = shortDescription.trim();
      }
    }
    
    // Extract keywords more intelligently
    // Look for technical terms, equipment names, and responsibilities
    const keywordCandidates = new Set<string>();
    
    // Common Navy terms to look for - general terms that apply to all ratings
    const technicalTerms = [
      // General Navy terms
      'ship', 'vessel', 'fleet', 'command', 'mission', 'deployment', 'operation',
      'maintenance', 'repair', 'inspection', 'qualification', 'certification',
      'training', 'instruction', 'supervision', 'management', 'leadership',
      'personnel', 'sailor', 'crew', 'team', 'division', 'department', 'command',
      'equipment', 'systems', 'procedures', 'protocols', 'standards', 'regulations',
      'safety', 'security', 'readiness', 'operational', 'technical', 'tactical',
      'logistics', 'supply', 'inventory', 'documentation', 'records', 'reports',
      'communication', 'coordination', 'planning', 'execution', 'evaluation',
      
      // Aviation-related terms
      'aircraft', 'catapults', 'arresting gear', 'barricades', 'flight deck',
      'hangar', 'fuel', 'lubricating', 'firefighting', 'rescue',
      'hydraulic', 'launch', 'recovery', 'salvage', 'crash', 'tractor', 'elevator',
      'spotting', 'securing', 'handling', 'fueling', 'defueling', 'surveillance',
      'aviation', 'boatswain', 'deck',
      
      // Engineering terms
      'mechanical', 'electrical', 'electronic', 'propulsion', 'power', 'generator',
      'engine', 'turbine', 'pump', 'valve', 'circuit', 'wiring', 'diagnostic',
      'troubleshooting', 'installation', 'overhaul',
      
      // Medical terms
      'medical', 'health', 'patient', 'treatment', 'care', 'emergency', 'triage',
      'pharmacy', 'laboratory', 'diagnosis', 'therapy', 'surgical',
      
      // Administrative terms
      'administrative', 'clerical', 'record', 'file', 'document', 'correspondence',
      'policy', 'directive', 'instruction', 'guideline', 'requirement', 'compliance'
    ];
    
    // Add technical terms found in the text
    technicalTerms.forEach((term: string) => {
      if (inputText.toLowerCase().includes(term.toLowerCase())) {
        keywordCandidates.add(term);
      }
    });
    
    // Add any capitalized terms that might be equipment or systems
    const capitalizedTerms = inputText.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || [];
    capitalizedTerms.forEach((term: string) => {
      if (term.length > 3 && !['The', 'This', 'That', 'They', 'Navy'].includes(term)) {
        keywordCandidates.add(term.toLowerCase());
      }
    });
    
    // Add abbreviations that might be equipment or systems
    const abbreviations = inputText.match(/\b[A-Z]{2,}\b/g) || [];
    abbreviations.forEach((abbr: string) => {
      if (abbr.length >= 2 && abbr !== ratingAbbreviation) {
        keywordCandidates.add(abbr);
      }
    });
    
    // Add rating-specific keywords if available
    if (ratingAbbreviation) {
      keywordCandidates.add(ratingAbbreviation);
    }
    
    // Add service rating as a keyword if available
    if (serviceRating) {
      keywordCandidates.add(serviceRating.toLowerCase());
    }
    
    // Extract specific responsibilities
    const responsibilities: string[] = [];
    const responsibilityPatterns = [
      /\boperate\s+[^.;]+/gi,
      /\bmaintain\s+[^.;]+/gi,
      /\bperform\s+[^.;]+/gi,
      /\bsupervise\s+[^.;]+/gi,
      /\bresponsible for\s+[^.;]+/gi
    ];
    
    responsibilityPatterns.forEach(pattern => {
      const matches = inputText.match(pattern) || [];
      matches.forEach((match: string) => {
        const words = match.split(' ').slice(1, 5).join(' '); // Get a few words after the verb
        if (words.length > 3) {
          keywordCandidates.add(words.toLowerCase());
        }
      });
    });
    
    // Convert the Set to an array and join with commas
    // Increased from 15 to 25 to provide more comprehensive keyword coverage
    const keywords = Array.from(keywordCandidates as Set<string>).slice(0, 25).join(', ');
    
    // Extract achievements from the text
    const extractedAchievements: string[] = [];
    
    // Look for achievement examples in the text
    const achievementPatterns = [
      /\b(?:led|managed|supervised|operated|maintained|performed|conducted|trained|directed)\s+[^.;]+/gi,
      /\bsaving\s+[^.;]+/gi,
      /\boverhaul\s+[^.;]+/gi,
      /\brefurbishing\s+[^.;]+/gi,
      /\brepairing\s+[^.;]+/gi,
      /\bassisted\s+[^.;]+/gi,
      /\bcoordinated\s+[^.;]+/gi,
      /\bensured\s+[^.;]+/gi,
      /\bimplemented\s+[^.;]+/gi,
      /\bestablished\s+[^.;]+/gi,
      /\bexecuted\s+[^.;]+/gi,
      /\bfacilitated\s+[^.;]+/gi,
      /\boversaw\s+[^.;]+/gi
    ];
    
    achievementPatterns.forEach(pattern => {
      const matches = inputText.match(pattern) || [];
      matches.forEach((match: string) => {
        if (match.length > 20) {
          // Convert to achievement format with ## placeholders
          // Ensure it starts with a capital letter and ends with proper punctuation
          let achievement = match
            .replace(/\b\d+\b/g, '##')
            .replace(/\$\d+[KMB]/g, '$##K')
            .trim();
          
          // Capitalize first letter if it's not already
          if (achievement.length > 0 && achievement[0].toLowerCase() === achievement[0]) {
            achievement = achievement[0].toUpperCase() + achievement.substring(1);
          }
          
          // Remove trailing punctuation and ensure it ends with a period if needed
          achievement = achievement.replace(/[.,;:!?]+$/, '');
          if (achievement.length > 0 && !achievement.endsWith('.')) {
            achievement += '.';
          }
          
          extractedAchievements.push(achievement);
        }
      });
    });
    
    // Add basic standard achievements if we didn't find enough
    // Format with one achievement per line for Navy Ratings Management
    const standardAchievements = [
      `Safely directed the movement and spotting of ## aircraft during ## flight operations`,
      `Maintained ## aircraft fueling systems at ##% readiness to support flight operations`,
      `Conducted ## flight deck firefighting and rescue drills, ensuring team met all performance standards`,
      `Operated catapults and arresting gear to execute ## successful aircraft launches and recoveries`,
      `Supervised a team of ## personnel to efficiently manage operations`,
      `Maintained quality control and properly handled ## items with zero incidents`,
      `Quickly responded to ## emergencies, minimizing damage and ensuring personnel safety`,
      `Trained ## junior sailors on proper procedures, improving team performance by ##%`,
      `Oversaw the maintenance and repair of ## pieces of equipment, sustaining ##% availability`,
      `Qualified as a subject matter expert, serving as a technical resource for the department`,
      `Led a team of ## sailors to complete ## critical tasks during high-tempo operations`,
      `Managed the upkeep of equipment and facilities, passing ## inspections with excellent marks`,
      `Developed an improved training program that increased qualification rates by ##%`,
      `Spearheaded the overhaul of ## aging systems, extending service life and reliability`,
      `Supervised ${ratingAbbreviation || 'rating'} operations involving ## personnel`
    ];
    
    // Combine extracted and standard achievements, ensuring no duplicates
    const uniqueAchievements = new Set([...extractedAchievements, ...standardAchievements]);
    // Increased from 10 to 15 to provide more comprehensive achievement examples
    // Ensure each achievement is on its own line for Navy Ratings Management
    const achievements = Array.from(uniqueAchievements)
      .slice(0, 15)
      .map(achievement => achievement.trim())
      .join('\n');

    // Return the structured content from the rule-based approach
    return NextResponse.json({
      description,
      keywords,
      achievements
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}