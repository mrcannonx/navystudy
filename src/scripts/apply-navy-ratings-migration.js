#!/usr/bin/env node

/**
 * Script to apply the navy_ratings migration to the database
 * This creates the necessary table and populates it with initial data
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  try {
    console.log('Starting navy_ratings migration...');
    
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../db/migrations/20250307_create_navy_ratings.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1} of ${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        // Continue with other statements even if one fails
      }
    }
    
    // Verify the table was created by querying it
    const { data, error } = await supabase
      .from('navy_ratings')
      .select('abbreviation, name')
      .limit(5);
    
    if (error) {
      console.error('Error verifying navy_ratings table:', error);
    } else {
      console.log('Successfully created and populated navy_ratings table.');
      console.log('Sample ratings:', data);
    }
    
    console.log('Migration completed.');
  } catch (error) {
    console.error('Unexpected error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
applyMigration();