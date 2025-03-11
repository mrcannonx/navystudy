/**
 * System prompts for AI content generation
 */

// Quiz generation system prompt
export const QUIZ_SYSTEM_PROMPT = `You are an expert at creating educational quiz questions for Navy advancement exams. Create challenging but fair multiple choice questions that test critical knowledge and understanding.
     
CRITICAL REQUIREMENTS:
1. Return ONLY a JSON array - no other text or explanations
2. Response MUST start with '[' and end with ']'
3. Each question MUST have:
   - Exactly 4 options (no more, no less)
   - The correct answer as the first option 
   - The correctAnswer field matching the first option exactly
   - A clear explanation that:
      - Explains WHY the answer is correct using evidence from the material
      - Provides helpful context that enhances understanding
      - Is concise but informative (1-2 sentences is sufficient)
4. Questions should test understanding, not just memorization
5. Focus on operational knowledge, procedures, safety requirements, and technical details`;

// Flashcard generation system prompt
export const FLASHCARD_SYSTEM_PROMPT = `You are an expert at creating educational flashcards for Navy advancement exam preparation. Create clear, concise, and effective flashcards that help with knowledge retention.
     
CRITICAL REQUIREMENTS:
1. Return ONLY a JSON array - no other text or explanations
2. Response MUST start with '[' and end with ']'
3. Each flashcard MUST have:
   - A clear, concise question or concept on the front
   - A complete but concise answer on the back
   - A relevant topic field matching the main subject area
   - An appropriate difficulty level (easy/medium/hard)
   - Relevant tags for categorization
4. Focus on definitions, procedures, equations, key concepts, and technical terminology
5. Cards should be diverse in both content and difficulty`;

/**
 * Generate a user prompt for content generation
 */
export function generateUserPrompt(
  type: 'quiz' | 'flashcards',
  title: string,
  description?: string,
  material: string = '',
  isChunk: boolean = false,
  chunkIndex: number = 0,
  topics: string = ''
): string {
  if (isChunk) {
    return `Create ${type === "quiz" ? "5-8 quiz questions" : "5-8 flashcards"} from this section of Navy advancement exam study material:
       
Title: ${title}
${description ? `Description: ${description}\n` : ""}
${topics ? `Primary Topics: ${topics}\n` : ""}
Content: ${material}

${chunkIndex > 0 ? "This is continuation of previous content - create different questions than before." : ""}

IMPORTANT INSTRUCTIONS:
1. Focus on ${topics || "technical details and procedures"} in this section
2. Create questions that test in-depth understanding, not just recall
3. For technical content, include exact specifications, measurements, and procedures
4. Make questions increasingly difficult to aid in spaced repetition learning
5. Mark each question with a difficulty level (Basic, Intermediate, Advanced)`;
  } else {
    return `Create ${type === 'quiz' ? '10 quiz questions' : '10 flashcards'} from this Navy advancement exam study material:\n\nTitle: ${title}\n${description ? `Description: ${description}\n` : ''}Content: ${material}`;
  }
}

/**
 * Get system prompt based on content type
 */
export function getSystemPrompt(type: 'quiz' | 'flashcards'): string {
  return type === 'quiz' ? QUIZ_SYSTEM_PROMPT : FLASHCARD_SYSTEM_PROMPT;
}