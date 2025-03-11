import { db } from '@/lib/db';
import { execSync } from 'child_process';
import path from 'path';

// Function to setup test database environment
export async function setupTestDb() {
  // Ensure we're in test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('setupTestDb should only be run in test environment');
  }

  try {
    // Reset the database using Supabase CLI
    execSync('npx supabase db reset', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../../..')
    });

    // Clean up any existing test data
    await db.from('flashcard_study_settings').delete();
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
}

// Function to cleanup test database
export async function cleanupTestDb() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('cleanupTestDb should only be run in test environment');
  }

  // Remove test data
  await db.from('flashcard_study_settings').delete();
}
