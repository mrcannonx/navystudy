import * as YAML from 'yaml';
import { Flashcard, isValidCard } from '../types';

export class YAMLParser {
  static extractYAMLContent(input: string): string {
    const yamlMatch = input.match(/```(?:yaml)?\s*([\s\S]+?)\s*```/);
    return yamlMatch ? yamlMatch[1] : input;
  }

  static parseFlashcards(input: string): Flashcard[] {
    console.log('Attempting YAML parse...');
    const yamlContent = this.extractYAMLContent(input);
    
    try {
      const parsed = YAML.parse(yamlContent);
      console.log('YAML parse result:', parsed);
      
      if (Array.isArray(parsed)) {
        console.log('YAML parsed into array of length:', parsed.length);
        return parsed.filter(isValidCard);
      }
      
      console.error('YAML parse did not produce an array:', typeof parsed);
      return this.fallbackLineParsing(yamlContent);
    } catch (yamlError) {
      console.log('YAML parsing failed:', yamlError instanceof Error ? yamlError.message : 'Unknown error');
      console.log('Falling back to line-by-line parsing...');
      return this.fallbackLineParsing(yamlContent);
    }
  }

  private static fallbackLineParsing(content: string): Flashcard[] {
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    console.log('Line-by-line parsing, total lines:', lines.length);
    
    const flashcards: Flashcard[] = [];
    let currentCard: Partial<Flashcard> = {};
    
    for (const line of lines) {
      // Check for new card marker
      if (line.startsWith('-')) {
        if (isValidCard(currentCard)) {
          flashcards.push(currentCard as Flashcard);
        }
        currentCard = {};
        continue;
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const key = line.substring(0, colonIndex).trim().toLowerCase();
      let value = line.substring(colonIndex + 1).trim();
      value = value.replace(/^["']|["']$/g, ''); // Remove quotes if present

      switch (key) {
        case 'type':
          currentCard.type = value.toLowerCase() as 'basic' | 'cloze';
          break;
        case 'front':
        case 'question':
          currentCard.front = value;
          break;
        case 'back':
        case 'answer':
          currentCard.back = value;
          break;
        case 'topic':
        case 'subject':
          currentCard.topic = value;
          break;
        case 'difficulty':
          currentCard.difficulty = value.toLowerCase() as 'easy' | 'medium' | 'hard';
          break;
        case 'tags':
          currentCard.tags = value.split(',').map(tag => tag.trim());
          break;
      }
    }

    // Don't forget to add the last card if it's valid
    if (isValidCard(currentCard)) {
      flashcards.push(currentCard as Flashcard);
    }

    return flashcards;
  }
} 