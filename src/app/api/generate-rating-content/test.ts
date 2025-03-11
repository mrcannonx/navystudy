/**
 * Test file for the generate-rating-content API
 *
 * This file provides a simple way to test the API by running it directly.
 * It's not meant to be used in production, just for development testing.
 *
 * Usage:
 * 1. Make sure you have the ANTHROPIC_API_KEY set in your .env file
 * 2. Run this file with ts-node or similar: npx ts-node src/app/api/generate-rating-content/test.ts
 */

import { POST } from './route';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGenerateRatingContent() {
  console.log('Testing generate-rating-content API...');
  
  // Sample input for testing
  const testInput = {
    ratingAbbreviation: "IT",
    serviceRating: "Information Systems Technician",
    inputText: `Information Systems Technician (IT) is a rating in the United States Navy. 
    Information Systems Technicians operate and maintain the Navy's global satellite telecommunications systems, 
    mainframe computers, local and wide area networks, and micro-computer systems used in the fleet. 
    ITs also write programs, handle system security issues, and provide end-user training and assistance. 
    They serve as systems and network administrators, database managers, and website developers. 
    They also troubleshoot and repair advanced electronic equipment and systems.`
  };
  
  // Create a mock request
  const mockRequest = {
    json: async () => testInput
  } as Request;
  
  try {
    // Call the API
    const response = await POST(mockRequest);
    
    // Parse the response
    const data = await response.json();
    
    // Display the results
    console.log('\n=== GENERATED CONTENT ===\n');
    console.log('DESCRIPTION:');
    console.log(data.description);
    console.log('\nKEYWORDS:');
    console.log(data.keywords);
    console.log('\nACHIEVEMENTS:');
    console.log(data.achievements);
    console.log('\n=== END OF CONTENT ===\n');
    
    // Check if we got AI-generated content or fallback content
    if (data.description.length > 300 && data.keywords.split(',').length > 15) {
      console.log('✅ Test passed! Content was successfully generated.');
    } else {
      console.log('⚠️ Test completed, but content may be using fallback generation.');
      console.log('Check if your AI service is properly configured.');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testGenerateRatingContent();