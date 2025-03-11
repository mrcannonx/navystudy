/**
 * Queue service for managing AI generation requests
 * Provides a queue system for processing requests in an orderly manner
 */

import { LRUCache } from 'lru-cache';
import { contentProcessor } from '../services/content-processor';
import { diversitySelector } from '../services/diversity-selector';

// Set up caching
const cache = new LRUCache<string, any>({
  max: 500, // Store up to 500 results
  ttl: 1000 * 60 * 60 * 24, // Cache for 24 hours
  allowStale: false,
});

/**
 * Interface for queued requests
 */
interface QueuedRequest {
  title: string;
  description?: string;
  material: string;
  type: 'quiz' | 'flashcards';
  resolve: (result: any) => void;
  reject: (error: Error) => void;
}

/**
 * QueueService class for managing request queues
 */
export class QueueService {
  private requestQueue: QueuedRequest[] = [];
  private isProcessing: boolean = false;
  
  /**
   * Enqueue a request for processing
   * @param contentData The content data for the request
   * @param type The type of content to generate
   * @returns Promise resolving to the processing result
   */
  public enqueueRequest(
    contentData: { 
      title: string; 
      description?: string; 
      material: string; 
    },
    type: 'quiz' | 'flashcards'
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // Generate cache key
      const cacheKey = this.generateCacheKey(contentData, type);
      
      // Check cache first
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        console.log('Using cached result');
        resolve({
          success: true,
          content: JSON.stringify(cachedResult),
          type,
        });
        return;
      }
      
      // Add to queue
      this.requestQueue.push({
        title: contentData.title || 'Untitled Content',
        description: contentData.description,
        material: contentData.material,
        type,
        resolve: (result) => {
          resolve(result);
        },
        reject: (error) => {
          reject(error);
        }
      });
      
      // Start processing if not already in progress
      if (!this.isProcessing) {
        this.processNextInQueue();
      }
    });
  }
  
  /**
   * Process the next request in the queue
   */
  private async processNextInQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    const request = this.requestQueue.shift()!;
    
    try {
      // Process the content
      const rawResult = await contentProcessor.processContentWithChunking(
        request.title,
        request.description,
        request.material,
        request.type
      );
      
      // Select diverse items
      const finalResult = diversitySelector.selectDiverseItems(rawResult, 10);
      
      // Cache the result
      const cacheKey = this.generateCacheKey(request, request.type);
      cache.set(cacheKey, finalResult);
      
      // Resolve the promise
      request.resolve({
        success: true,
        content: JSON.stringify(finalResult),
        type: request.type,
      });
    } catch (error) {
      console.error('Error processing queued request:', error);
      request.reject(error as Error);
    } finally {
      this.isProcessing = false;
      // Process next in queue
      setTimeout(() => this.processNextInQueue(), 100);
    }
  }
  
  /**
   * Generate a cache key for a request
   * @param data The request data
   * @param type The content type
   * @returns A unique cache key
   */
  private generateCacheKey(
    data: { title: string; description?: string; material: string },
    type: 'quiz' | 'flashcards'
  ): string {
    return `${type}_${Buffer.from(data.title + (data.description || '') + data.material.substring(0, 100)).toString('base64')}`;
  }
}

// Create and export default instance
export const queueService = new QueueService();