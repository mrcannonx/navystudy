import { QuizQuestion } from '../types';

export class JSONParser {
  static cleanJSONString(input: string): string {
    let cleaned = input.trim();
    
    // Log the initial input for debugging
    console.log('Raw AI response:', cleaned);
    
    // Remove any text before the first [
    const startBracket = cleaned.indexOf('[');
    if (startBracket !== -1) {
      cleaned = cleaned.slice(startBracket);
    } else {
      console.log('No opening bracket found, attempting to fix structure');
      cleaned = `[${cleaned}]`;
    }
    
    // Remove any text after the last ]
    const endBracket = cleaned.lastIndexOf(']');
    if (endBracket !== -1) {
      cleaned = cleaned.slice(0, endBracket + 1);
    }

    // Advanced JSON cleaning
    cleaned = cleaned
      // Fix newlines and whitespace
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      
      // Fix quote issues
      .replace(/([^\\])"/g, '$1\\"') // Escape unescaped quotes
      .replace(/\\{3,}"/g, '\\"') // Fix over-escaped quotes
      .replace(/"{2,}/g, '"') // Fix multiple quotes
      
      // Fix common JSON structural issues
      .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
      .replace(/([{\[]),\s*([}\]])/g, '$1$2') // Remove empty entries
      .replace(/}\s*{/g, '},{') // Fix object separation
      .replace(/]\s*\[/g, '],[') // Fix array separation
      .replace(/([^,{[}])\s*{/g, '$1,{') // Fix missing commas between objects
      .replace(/([^,{[}])\s*\[/g, '$1,[') // Fix missing commas between arrays
      
      // Normalize boolean and null values
      .replace(/:\s*true\s*([,}])/gi, ':true$1')
      .replace(/:\s*false\s*([,}])/gi, ':false$1')
      .replace(/:\s*null\s*([,}])/gi, ':null$1')
      
      .trim();

    // Log the cleaned output for debugging
    console.log('Cleaned JSON string:', cleaned);
    
    return cleaned;
  }

  static tryParseJSON(input: string): any {
    try {
      return JSON.parse(input);
    } catch (error) {
      // Log the error and problematic section
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const match = errorMessage.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const context = input.slice(Math.max(0, position - 50), Math.min(input.length, position + 50));
        console.error(`JSON parse error near position ${position}:`, context);
      }
      throw error;
    }
  }

  static parseQuizQuestions(input: string): { 
    questions: QuizQuestion[], 
    metadata: { 
      originalCount: number, 
      validCount: number,
      chunkIndex?: number,
      totalChunks?: number
    } 
  } {
    let questions: any[] = [];
    let cleaned = this.cleanJSONString(input);

    try {
      // First attempt with cleaned input
      const parsed = this.tryParseJSON(cleaned);
      if (Array.isArray(parsed)) {
        questions = parsed;
      } else {
        throw new Error('Parsed result is not an array');
      }
    } catch (firstError) {
      console.log('First parse attempt failed, trying fallback cleaning...');
      
      try {
        // Fallback: Try to extract valid JSON array structure
        const matches = cleaned.match(/\[([^\[\]]*)\]/g);
        if (matches && matches.length > 0) {
          // Try each matched array structure
          for (const match of matches) {
            try {
              questions = this.tryParseJSON(match);
              console.log('Successfully parsed JSON from extracted array');
              break;
            } catch (extractError) {
              console.log('Failed to parse extracted array:', match);
            }
          }
        }
        
        if (!questions) {
          // If still no valid JSON, try one more aggressive cleaning
          cleaned = cleaned
            .replace(/[^\[\]{},:"'\w\s.-]/g, '') // Remove invalid characters
            .replace(/'/g, '"') // Replace single quotes with double quotes
            .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas again
          
          questions = this.tryParseJSON(cleaned);
        }
      } catch (fallbackError) {
        throw new Error(`Failed to parse JSON after multiple attempts: ${firstError instanceof Error ? firstError.message : 'Unknown error'}`);
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error('Parsed JSON is not an array');
    }

    const originalCount = questions.length;
    console.log(`Found ${originalCount} raw questions`);
    
    // Validate and format each question
    const validQuestions = questions
      .map((q, index) => {
        try {
          console.log(`Processing question ${index + 1}:`, q);
          
          const formattedQuestion = {
            id: q.id || `q_${index + 1}`,
            question: String(q.question || '').trim(),
            options: Array.isArray(q.options) ? q.options.map(String).map((opt: string) => opt.trim()) : [],
            correctAnswer: String(q.correctAnswer || '').trim(),
            explanation: String(q.explanation || '').trim()
          };

          // Log validation checks
          const validationChecks = {
            hasQuestion: !!formattedQuestion.question,
            hasOptions: Array.isArray(formattedQuestion.options),
            hasCorrectOptionCount: formattedQuestion.options.length === 4,
            hasCorrectAnswer: !!formattedQuestion.correctAnswer,
            correctAnswerInOptions: formattedQuestion.options.includes(formattedQuestion.correctAnswer),
            hasExplanation: !!formattedQuestion.explanation
          };

          console.log(`Validation checks for question ${index + 1}:`, validationChecks);

          return formattedQuestion;
        } catch (error) {
          console.error(`Failed to process question ${index}:`, error);
          return null;
        }
      })
      .filter((q): q is QuizQuestion => {
        if (!q) {
          console.log('Question is null or undefined');
          return false;
        }

        // Detailed validation checks
        const validationResults = {
          hasQuestion: !!q.question?.trim(),
          hasValidOptions: Array.isArray(q.options) && q.options.every(opt => typeof opt === 'string' && opt.trim().length > 0),
          hasExactlyFourOptions: Array.isArray(q.options) && q.options.length === 4,
          hasCorrectAnswer: !!q.correctAnswer?.trim(),
          correctAnswerMatchesFirstOption: q.correctAnswer === q.options?.[0],
          hasExplanation: !!q.explanation?.trim()
        };

        const isValid = Object.values(validationResults).every(result => result === true);

        if (!isValid) {
          console.log('Question validation details:', {
            id: q.id,
            validationResults,
            questionLength: q.question?.length || 0,
            optionsCount: q.options?.length || 0,
            correctAnswer: q.correctAnswer,
            firstOption: q.options?.[0],
            explanationLength: q.explanation?.length || 0
          });

          // Log specific validation failures
          if (!validationResults.hasQuestion) {
            console.log('Failed: Missing or empty question text');
          }
          if (!validationResults.hasValidOptions) {
            console.log('Failed: Invalid options array or empty options');
          }
          if (!validationResults.hasExactlyFourOptions) {
            console.log('Failed: Does not have exactly 4 options');
          }
          if (!validationResults.hasCorrectAnswer) {
            console.log('Failed: Missing or empty correct answer');
          }
          if (!validationResults.correctAnswerMatchesFirstOption) {
            console.log('Failed: Correct answer does not match first option exactly');
          }
          if (!validationResults.hasExplanation) {
            console.log('Failed: Missing or empty explanation');
          }
        }

        return isValid;
      });

    console.log(`Validated ${validQuestions.length} questions out of ${originalCount}`);
    if (validQuestions.length === 0) {
      console.log('No valid questions found. Raw questions:', questions);
    }

    return {
      questions: validQuestions,
      metadata: {
        originalCount,
        validCount: validQuestions.length,
        chunkIndex: undefined,  // Will be populated by the route handler
        totalChunks: undefined  // Will be populated by the route handler
      }
    };
  }
}
