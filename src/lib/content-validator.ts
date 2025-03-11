import { QuizQuestion, Flashcard, ContentType } from './types';
import * as YAML from 'yaml';

const MIN_QUESTION_LENGTH = 10;
const MIN_EXPLANATION_LENGTH = 20;
const MIN_OPTION_LENGTH = 1;
const MIN_OPTION_DIFFERENCE = 0.3; // Minimum difference between options

// Helper functions
const normalizeString = (str: string) => 
  str.trim().toLowerCase().replace(/\s+/g, ' ');

const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  
  const pairs1 = new Set<string>();
  const pairs2 = new Set<string>();
  
  for (let i = 0; i < s1.length - 1; i++) {
    pairs1.add(s1.slice(i, i + 2));
  }
  for (let i = 0; i < s2.length - 1; i++) {
    pairs2.add(s2.slice(i, i + 2));
  }
  
  const pairs1Array = Array.from(pairs1);
  const pairs2Array = Array.from(pairs2);
  
  const intersection = pairs1Array.filter(x => pairs2.has(x));
  const union = Array.from(new Set(pairs1Array.concat(pairs2Array)));
  
  return intersection.length / union.length;
};

interface FlashcardLike {
  front: string;
  back: string;
  topic?: string;
  hints?: string[];
}

export function validateGeneratedContent(
  content: unknown,
  type: ContentType
): boolean {
  console.log('Validating content:', {
    type,
    isArray: Array.isArray(content),
    length: Array.isArray(content) ? content.length : 0,
    firstItem: Array.isArray(content) && content.length > 0 ? content[0] : null
  });

  // Handle summary type
  if (type === 'summary') {
    // For summary, we expect a string or an array of strings
    if (typeof content === 'string') {
      return content.trim().length > 0;
    }
    if (Array.isArray(content)) {
      return content.every(item => typeof item === 'string' && item.trim().length > 0);
    }
    console.error('Summary content must be a string or array of strings');
    return false;
  }

  // Handle deck object for flashcards
  if (type === 'flashcards' && content && typeof content === 'object' && 'cards' in content) {
    console.log('Validating flashcard deck:', content);
    return validateFlashcardContent((content as { cards: unknown[] }).cards);
  }

  if (!Array.isArray(content)) {
    console.error('Content is not an array');
    return false;
  }

  if (type === "quiz") {
    return validateQuizContent(content);
  }

  return validateFlashcardContent(content);
}

function isFlashcardLike(item: unknown): item is FlashcardLike {
  return (
    item !== null &&
    typeof item === 'object' &&
    'front' in item &&
    'back' in item &&
    typeof (item as FlashcardLike).front === 'string' &&
    typeof (item as FlashcardLike).back === 'string'
  );
}

function transformFlashcardToQuiz(card: FlashcardLike): QuizQuestion | null {
  try {
    if (!card.front || !card.back) return null;
    
    // Generate a unique ID
    const id = `q_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use the front as the question
    const question = card.front;
    
    // Generate plausible but incorrect options
    const correctAnswer = card.back;
    const options = [
      correctAnswer,
      `Incorrect: ${card.topic || 'Option'} A`,
      `Incorrect: ${card.topic || 'Option'} B`,
      `Incorrect: ${card.topic || 'Option'} C`,
    ].sort(() => Math.random() - 0.5); // Shuffle options
    
    // Use hints or generate a basic explanation
    const explanation = card.hints?.[0] || `The correct answer is: ${correctAnswer}`;
    
    return {
      id,
      question,
      options,
      correctAnswer,
      explanation
    };
  } catch (error) {
    console.error('Error transforming flashcard to quiz:', error);
    return null;
  }
}

function validateQuizContent(content: unknown[]): boolean {
  // If we received flashcard-style content, try to transform it
  if (content.length === 1 && isFlashcardLike(content[0])) {
    const transformed = transformFlashcardToQuiz(content[0]);
    return transformed !== null;
  }
  
  // If array is empty, return false
  if (content.length === 0) return false;
  
  return content.every(item => {
    // If item looks like a flashcard, transform it
    if (isFlashcardLike(item)) {
      const transformed = transformFlashcardToQuiz(item);
      if (transformed) {
        Object.assign(item, transformed);
        return true;
      }
    }
    
    // Regular quiz validation
    const quizItem = item as QuizQuestion;
    return (
      quizItem &&
      typeof quizItem === 'object' &&
      typeof quizItem.id === 'string' &&
      typeof quizItem.question === 'string' &&
      Array.isArray(quizItem.options) &&
      quizItem.options.length >= 2 &&
      typeof quizItem.correctAnswer === 'string' &&
      typeof quizItem.explanation === 'string' &&
      quizItem.options.includes(quizItem.correctAnswer) &&
      quizItem.question.length >= MIN_QUESTION_LENGTH &&
      quizItem.explanation.length >= MIN_EXPLANATION_LENGTH &&
      quizItem.options.every((opt: string) => opt.length >= MIN_OPTION_LENGTH)
    );
  });
}

function validateFlashcardContent(cards: unknown[]): boolean {
  if (!Array.isArray(cards)) {
    console.error('Flashcards must be an array');
    return false;
  }

  return cards.every((item: unknown, index) => {
    try {
      // Basic structure validation
      if (!isFlashcardLike(item)) {
        console.error(`Flashcard ${index} structure validation failed:`, item);
        return false;
      }

      const card = item as Flashcard;
      const structureValid = 
        ['basic', 'cloze'].includes(card.type) &&
        (!card.difficulty || ['easy', 'medium', 'hard'].includes(card.difficulty)) &&
        (!card.hints || Array.isArray(card.hints)) &&
        (!card.tags || Array.isArray(card.tags));

      if (!structureValid) {
        console.error(`Flashcard ${index} structure validation failed:`, item);
        return false;
      }

      // Type-specific validation
      if (card.type === 'cloze') {
        const clozeValid = validateClozeFormat(card.front);
        if (!clozeValid) {
          console.error(`Flashcard ${index} cloze format validation failed:`, item);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error(`Error validating flashcard ${index}:`, error);
      return false;
    }
  });
}

function validateClozeFormat(text: string): boolean {
  // For basic cloze format, we'll accept either {{...}} format or plain text
  // This allows both traditional cloze deletions and regular flashcard text
  if (!text || typeof text !== 'string') {
    return false;
  }

  // If there are no cloze markers, treat it as valid plain text
  if (!text.includes('{{') && !text.includes('}}')) {
    return true;
  }

  // Check for proper cloze deletion format: {{...}}
  const clozePattern = /\{\{[^{}]+\}\}/;
  if (!clozePattern.test(text)) {
    return false;
  }

  // Ensure there aren't too many cloze deletions
  const clozeCount = (text.match(/\{\{[^{}]+\}\}/g) || []).length;
  if (clozeCount > 3) {
    return false;
  }

  // Ensure cloze deletions aren't nested
  const nestedPattern = /\{\{[^{}]*\{\{[^{}]*\}\}[^{}]*\}\}/;
  if (nestedPattern.test(text)) {
    return false;
  }

  // Ensure all cloze deletions are properly closed
  const openCount = (text.match(/\{\{/g) || []).length;
  const closeCount = (text.match(/\}\}/g) || []).length;
  if (openCount !== closeCount) {
    return false;
  }

  return true;
}

export function validateAPIResponse(rawResponse: string): { isValid: boolean; error?: string } {
  // Size validation with detailed feedback
  if (!rawResponse.trim()) {
    return { isValid: false, error: 'Empty response received from API' };
  }

  if (rawResponse.length < 50) {
    return { 
      isValid: false, 
      error: `Response too small (${rawResponse.length} chars) - likely incomplete or truncated` 
    };
  }

  // Split into lines and validate structure
  const lines = rawResponse
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  // Check for required field markers
  const hasType = lines.some(line => line.toLowerCase().startsWith('type:'));
  const hasFront = lines.some(line => line.toLowerCase().startsWith('front:'));
  const hasBack = lines.some(line => line.toLowerCase().startsWith('back:'));

  if (!hasType || !hasFront || !hasBack) {
    return {
      isValid: false,
      error: `Missing required fields: ${[
        !hasType && 'type',
        !hasFront && 'front',
        !hasBack && 'back'
      ].filter(Boolean).join(', ')}`
    };
  }

  // Validate field values
  let currentCard: { type?: string; front?: string; back?: string } = {};
  let cards = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();

    if (!value) continue;

    switch (key) {
      case 'type':
        if (!['basic', 'cloze'].includes(value.toLowerCase())) {
          return {
            isValid: false,
            error: `Invalid card type: ${value}. Must be basic or cloze.`
          };
        }
        currentCard.type = value.toLowerCase();
        break;
      case 'front':
        currentCard.front = value;
        break;
      case 'back':
        currentCard.back = value;
        break;
    }

    // If we have all required fields, add the card
    if (currentCard.type && currentCard.front && currentCard.back) {
      cards.push({ ...currentCard });
      currentCard = {};
    }
  }

  if (cards.length === 0) {
    return {
      isValid: false,
      error: 'No valid cards found in response'
    };
  }

  return { isValid: true };
}

export function cleanAPIResponse(content: string): string {
  let cleanedContent = content;
  
  // Remove any markdown or code block markers
  cleanedContent = cleanedContent
    .replace(/^[\s\n]*```[a-z]*\n/gm, '')  // Remove opening code blocks
    .replace(/```[\s\n]*$/gm, '')          // Remove closing code blocks
    .trim();

  // Normalize line endings and spacing
  cleanedContent = cleanedContent
    .replace(/\r\n/g, '\n')       // Normalize line endings
    .replace(/\n{3,}/g, '\n\n')   // Reduce multiple blank lines to two
    .split('\n')
    .map(line => line.trimEnd())  // Remove trailing spaces
    .join('\n')
    .trim();

  return cleanedContent;
}
