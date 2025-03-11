/**
 * Diversity selector service for content processing
 * Ensures diverse selection of items based on difficulty and topics
 */

import { topicExtractor } from './topic-extractor';

/**
 * DiversitySelector class for selecting diverse items from AI-generated content
 */
export class DiversitySelector {
  /**
   * Select diverse items from results array to avoid repetition
   * and organize by difficulty for spaced repetition
   * @param items Array of items (quiz questions or flashcards)
   * @param maxItems Maximum number of items to select
   * @returns Array of selected diverse items
   */
  public selectDiverseItems(items: any[], maxItems: number): any[] {
    if (items.length <= maxItems) return items;
    
    // Group items by difficulty if the property exists
    const hasDifficulty = items.some(item => 
      item.difficulty || 
      (item.question && item.question.includes("Basic")) ||
      (item.question && item.question.includes("Intermediate")) ||
      (item.question && item.question.includes("Advanced")) ||
      (item.front && item.front.includes("Basic")) ||
      (item.front && item.front.includes("Intermediate")) ||
      (item.front && item.front.includes("Advanced"))
    );
    
    if (hasDifficulty) {
      return this.selectByDifficulty(items, maxItems);
    }
    
    // For items without difficulty ratings, use topic-based diversity
    return this.ensureTopicDiversity(items, maxItems);
  }
  
  /**
   * Select items based on difficulty levels
   * @param items Array of items
   * @param maxItems Maximum number of items to select
   * @returns Array of selected items with balanced difficulty
   */
  private selectByDifficulty(items: any[], maxItems: number): any[] {
    // Categorize items by difficulty level
    const basicItems: any[] = [];
    const intermediateItems: any[] = [];
    const advancedItems: any[] = [];
    
    // Sort items into difficulty buckets
    items.forEach(item => {
      const content = item.question || item.front || "";
      if (
        (item.difficulty === "easy" || item.difficulty === "Basic" || content.includes("Basic"))
      ) {
        basicItems.push(item);
      } else if (
        (item.difficulty === "medium" || item.difficulty === "Intermediate" || content.includes("Intermediate"))
      ) {
        intermediateItems.push(item);
      } else if (
        (item.difficulty === "hard" || item.difficulty === "Advanced" || content.includes("Advanced"))
      ) {
        advancedItems.push(item);
      } else {
        // Default to intermediate if no clear difficulty
        intermediateItems.push(item);
      }
    });
    
    // Select a balanced mix of difficulties (40% basic, 40% intermediate, 20% advanced)
    const result: any[] = [];
    const basicCount = Math.floor(maxItems * 0.4);
    const intermediateCount = Math.floor(maxItems * 0.4);
    const advancedCount = maxItems - basicCount - intermediateCount;
    
    // Select items from each category, prioritizing diversity
    result.push(...this.getRandomItems(basicItems, basicCount));
    result.push(...this.getRandomItems(intermediateItems, intermediateCount));
    result.push(...this.getRandomItems(advancedItems, advancedCount));
    
    // If we still have space, fill with remaining items
    if (result.length < maxItems) {
      const remaining = items.filter(item => !result.includes(item));
      result.push(...this.getRandomItems(remaining, maxItems - result.length));
    }
    
    return result;
  }

  /**
   * Ensure topic diversity in the selected items
   * @param items Array of items
   * @param maxItems Maximum number of items to select
   * @returns Array of selected items with diverse topics
   */
  private ensureTopicDiversity(items: any[], maxItems: number): any[] {
    // Extract topics from items
    const itemsByTopic: Map<string, any[]> = new Map();
    
    // Group items by topic
    items.forEach(item => {
      const topic = topicExtractor.extractItemTopic(item);
      if (!itemsByTopic.has(topic)) {
        itemsByTopic.set(topic, []);
      }
      itemsByTopic.get(topic)!.push(item);
    });
    
    // Select items ensuring topic diversity
    const result: any[] = [];
    const topicKeys = Array.from(itemsByTopic.keys());
    
    // Calculate how many items to take from each topic
    const itemsPerTopic = Math.max(1, Math.floor(maxItems / topicKeys.length));
    
    // Take items from each topic
    topicKeys.forEach(topic => {
      const topicItems = itemsByTopic.get(topic)!;
      result.push(...this.getRandomItems(topicItems, itemsPerTopic));
    });
    
    // If we still have slots available, fill them with remaining items
    if (result.length < maxItems) {
      const allUsedItems = new Set(result);
      const remainingItems = items.filter(item => !allUsedItems.has(item));
      result.push(...this.getRandomItems(remainingItems, maxItems - result.length));
    }
    
    return result.slice(0, maxItems);
  }

  /**
   * Get random items from an array up to a specified count
   * @param items Array of items to select from
   * @param count Maximum number of items to select
   * @returns Array of randomly selected items
   */
  private getRandomItems(items: any[], count: number): any[] {
    if (items.length <= count) return [...items];
    
    const result: any[] = [];
    const indices = new Set<number>();
    
    while (result.length < count && indices.size < items.length) {
      const randomIndex = Math.floor(Math.random() * items.length);
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex);
        result.push(items[randomIndex]);
      }
    }
    
    return result;
  }
}

// Create and export default instance
export const diversitySelector = new DiversitySelector();