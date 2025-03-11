#!/usr/bin/env node

/**
 * Deployment script for the AI Metrics feature
 * This script verifies all components are properly set up
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Log with color
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Main deployment function
async function deploy() {
  log('Starting AI Metrics feature deployment...', colors.cyan);
  log('Checking required components...', colors.cyan);
  
  // Check environment variables
  log('\nVerifying environment variables:', colors.blue);
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY'
  ];
  
  let envVarsOk = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      log(`  ❌ Missing ${envVar}`, colors.red);
      envVarsOk = false;
    } else {
      log(`  ✅ ${envVar} is set`, colors.green);
    }
  }
  
  if (!envVarsOk) {
    log('\nPlease set all required environment variables in your .env file.', colors.red);
    log('You can use .env.example as a template.', colors.yellow);
    process.exit(1);
  }
  
  // Check required files
  log('\nVerifying required files:', colors.blue);
  const requiredFiles = [
    'src/lib/ai-metrics-generator.ts',
    'src/app/api/ai/generate-metrics/route.ts',
    'src/lib/ai-client.ts',
    'src/db/migrations/20250307_create_navy_ratings.sql'
  ];
  
  let filesOk = true;
  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fileExists(filePath)) {
      log(`  ✅ ${file} exists`, colors.green);
    } else {
      log(`  ❌ ${file} is missing`, colors.red);
      filesOk = false;
    }
  }
  
  if (!filesOk) {
    log('\nSome required files are missing. Please check the file paths.', colors.red);
    process.exit(1);
  }
  
  // Apply database migration
  log('\nApplying database migration for navy_ratings table...', colors.blue);
  try {
    log('  Running apply-navy-ratings-migration.js...', colors.yellow);
    execSync('node src/scripts/apply-navy-ratings-migration.js', { stdio: 'inherit' });
    log('  ✅ Database migration completed successfully', colors.green);
  } catch (error) {
    log(`  ❌ Database migration failed: ${error.message}`, colors.red);
    log('Please check your database connection and credentials.', colors.yellow);
    process.exit(1);
  }
  
  // Build the application
  log('\nBuilding the application...', colors.blue);
  try {
    log('  Running next build...', colors.yellow);
    execSync('npm run build', { stdio: 'inherit' });
    log('  ✅ Build completed successfully', colors.green);
  } catch (error) {
    log(`  ❌ Build failed: ${error.message}`, colors.red);
    log('Please fix any build errors and try again.', colors.yellow);
    process.exit(1);
  }
  
  // Deployment complete
  log('\n✅ AI Metrics feature deployment completed successfully!', colors.green);
  log('\nYou can now use the Custom Metrics Library with AI-generated metrics.', colors.cyan);
  log('The metrics will be tailored to the specific rating, role, and section.', colors.cyan);
}

// Run the deployment
deploy().catch(error => {
  log(`\nDeployment failed: ${error.message}`, colors.red);
  process.exit(1);
});