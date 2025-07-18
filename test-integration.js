#!/usr/bin/env node

/**
 * Complete Integration Test Suite
 * Runs all integration tests to verify the full-stack monorepo setup
 */

const { runIntegrationTests } = require('./test-fullstack-integration.js');
const { runFrontendBackendTests } = require('./test-frontend-backend.js');
const { runUserManagementTests } = require('./test-user-management.js');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`${message}`, colors.bold + colors.cyan);
  log(`${'='.repeat(60)}`, colors.cyan);
}

async function runCompleteIntegrationSuite() {
  logHeader('🚀 COMPLETE FULL-STACK MONOREPO INTEGRATION TEST SUITE');
  
  log('\n📋 Test Suite Overview:', colors.bold);
  log('• Full-Stack Integration Tests (8 tests)');
  log('• Frontend-Backend Integration Tests (3 tests)');
  log('• User Management End-to-End Tests (7 tests)');
  log('• Total: 18 comprehensive tests');
  
  const results = {
    fullStackIntegration: false,
    frontendBackend: false,
    userManagement: false
  };
  
  let totalPassed = 0;
  let totalTests = 0;
  
  try {
    // Run Full-Stack Integration Tests
    logHeader('🔧 FULL-STACK INTEGRATION TESTS');
    results.fullStackIntegration = await runIntegrationTests();
    if (results.fullStackIntegration) {
      totalPassed += 8;
      logSuccess('Full-Stack Integration: 8/8 tests passed');
    } else {
      logError('Full-Stack Integration: Some tests failed');
    }
    totalTests += 8;
    
    // Run Frontend-Backend Tests
    logHeader('🌐 FRONTEND-BACKEND INTEGRATION TESTS');
    results.frontendBackend = await runFrontendBackendTests();
    if (results.frontendBackend) {
      totalPassed += 3;
      logSuccess('Frontend-Backend Integration: 3/3 tests passed');
    } else {
      logError('Frontend-Backend Integration: Some tests failed');
    }
    totalTests += 3;
    
    // Run User Management Tests
    logHeader('👥 USER MANAGEMENT END-TO-END TESTS');
    results.userManagement = await runUserManagementTests();
    if (results.userManagement) {
      totalPassed += 7;
      logSuccess('User Management: 7/7 tests passed');
    } else {
      logError('User Management: Some tests failed');
    }
    totalTests += 7;
    
  } catch (error) {
    logError(`Test suite error: ${error.message}`);
  }
  
  // Final Summary
  logHeader('📊 FINAL TEST RESULTS SUMMARY');
  
  log('\n🎯 Test Suite Results:', colors.bold);
  Object.entries(results).forEach(([suite, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const suiteName = suite.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    log(`${status} ${suiteName}`);
  });
  
  log(`\n📈 Overall Results: ${totalPassed}/${totalTests} tests passed`, colors.bold);
  
  const allPassed = Object.values(results).every(Boolean);
  
  if (allPassed) {
    log('\n🎉 CONGRATULATIONS! 🎉', colors.bold + colors.green);
    logSuccess('All integration tests passed successfully!');
    
    log('\n✨ Your Full-Stack Monorepo is fully functional:', colors.bold);
    log('• ✅ Backend NestJS server with GraphQL API');
    log('• ✅ Frontend Next.js application with Apollo Client');
    log('• ✅ PostgreSQL database with TypeORM');
    log('• ✅ Shared TypeScript utilities and types');
    log('• ✅ Complete user management system');
    log('• ✅ Input validation and error handling');
    log('• ✅ Database persistence and data integrity');
    log('• ✅ CORS configuration for cross-origin requests');
    
    log('\n🌐 Access Your Applications:', colors.bold);
    log('• Frontend: http://localhost:3000');
    log('• Backend API: http://localhost:3001');
    log('• GraphQL Playground: http://localhost:3001/graphql');
    
    log('\n🛠️  Development Commands:', colors.bold);
    log('• Start all services: npm run dev');
    log('• Start frontend only: npm run dev:frontend');
    log('• Start backend only: npm run dev:backend');
    log('• Build all packages: npm run build');
    log('• Run tests: npm run test');
    log('• Database migrations: npm run db:migrate');
    
    log('\n🚀 Ready for Development!', colors.bold + colors.green);
    
    return true;
  } else {
    log('\n❌ INTEGRATION TESTS FAILED', colors.bold + colors.red);
    logError('Some tests did not pass. Please review the failed tests above.');
    
    log('\n🛠️  Troubleshooting Steps:', colors.bold);
    log('1. Ensure PostgreSQL is running (docker-compose up -d postgres)');
    log('2. Check that backend server is running (npm run dev:backend)');
    log('3. Check that frontend server is running (npm run dev:frontend)');
    log('4. Verify environment variables are set correctly');
    log('5. Check console logs for detailed error messages');
    log('6. Run individual test suites to isolate issues');
    
    return false;
  }
}

// Run the complete test suite
if (require.main === module) {
  runCompleteIntegrationSuite()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      logError(`Fatal error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = {
  runCompleteIntegrationSuite
};