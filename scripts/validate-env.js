#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Environment validation script for the monorepo
 * Validates that required environment variables are set
 */

const envConfigs = [
  {
    file: 'packages/backend/.env',
    name: 'Backend',
    required: [
      'PORT',
      'NODE_ENV',
      'DATABASE_URL',
      'DATABASE_HOST',
      'DATABASE_PORT',
      'DATABASE_USERNAME',
      'DATABASE_PASSWORD',
      'DATABASE_NAME'
    ],
    optional: [
      'FRONTEND_URL',
      'JWT_SECRET',
      'JWT_EXPIRES_IN'
    ]
  },
  {
    file: 'packages/frontend/.env.local',
    name: 'Frontend',
    required: [
      'NEXT_PUBLIC_GRAPHQL_URL'
    ],
    optional: [
      'NODE_ENV'
    ]
  }
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};

  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  return env;
}

function validateEnvConfig(config) {
  const { file, name, required, optional } = config;
  const filePath = path.resolve(file);
  
  console.log(`\n🔍 Validating ${name} environment (${file}):`);

  const env = parseEnvFile(filePath);
  
  if (!env) {
    console.log(`   ❌ Environment file not found: ${file}`);
    return false;
  }

  let isValid = true;
  const missing = [];
  const present = [];

  // Check required variables
  required.forEach(key => {
    if (env[key] && env[key].trim() !== '') {
      present.push(key);
    } else {
      missing.push(key);
      isValid = false;
    }
  });

  // Check optional variables
  const optionalPresent = [];
  optional.forEach(key => {
    if (env[key] && env[key].trim() !== '') {
      optionalPresent.push(key);
    }
  });

  // Report results
  if (present.length > 0) {
    console.log(`   ✅ Required variables set: ${present.join(', ')}`);
  }

  if (optionalPresent.length > 0) {
    console.log(`   ℹ️  Optional variables set: ${optionalPresent.join(', ')}`);
  }

  if (missing.length > 0) {
    console.log(`   ❌ Missing required variables: ${missing.join(', ')}`);
  }

  return isValid;
}

function main() {
  console.log('🔧 Validating environment configuration...');

  let allValid = true;

  for (const config of envConfigs) {
    const isValid = validateEnvConfig(config);
    allValid = allValid && isValid;
  }

  console.log('\n' + '='.repeat(50));
  
  if (allValid) {
    console.log('✅ All environment configurations are valid!');
    console.log('\n📝 Environment validation completed successfully.');
  } else {
    console.log('❌ Environment validation failed!');
    console.log('\n📝 Please fix the missing environment variables above.');
    console.log('   You can copy from the .env.example files and update the values.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateEnvConfig, parseEnvFile };