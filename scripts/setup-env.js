#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Environment setup script for the monorepo
 * Copies .env.example files to .env files if they don't exist
 */

const envFiles = [
  {
    example: '.env.example',
    target: '.env',
    name: 'Root'
  },
  {
    example: 'packages/backend/.env.example',
    target: 'packages/backend/.env',
    name: 'Backend'
  },
  {
    example: 'packages/frontend/.env.local.example',
    target: 'packages/frontend/.env.local',
    name: 'Frontend'
  }
];

function copyEnvFile(example, target, name) {
  const examplePath = path.resolve(example);
  const targetPath = path.resolve(target);

  if (!fs.existsSync(examplePath)) {
    console.log(`⚠️  ${name} example file not found: ${example}`);
    return false;
  }

  if (fs.existsSync(targetPath)) {
    console.log(`✅ ${name} environment file already exists: ${target}`);
    return true;
  }

  try {
    fs.copyFileSync(examplePath, targetPath);
    console.log(`📋 Created ${name} environment file: ${target}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create ${name} environment file:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Setting up environment files...\n');

  let allSuccess = true;

  for (const { example, target, name } of envFiles) {
    const success = copyEnvFile(example, target, name);
    allSuccess = allSuccess && success;
  }

  console.log('\n' + '='.repeat(50));
  
  if (allSuccess) {
    console.log('✅ Environment setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review and update environment variables in:');
    console.log('      - .env (root configuration)');
    console.log('      - packages/backend/.env');
    console.log('      - packages/frontend/.env.local');
    console.log('   2. Make sure PostgreSQL is running');
    console.log('   3. Run: npm run dev');
  } else {
    console.log('❌ Environment setup completed with errors.');
    console.log('   Please check the error messages above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { copyEnvFile };