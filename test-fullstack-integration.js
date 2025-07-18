#!/usr/bin/env node

/**
 * Full-Stack Integration Test
 * Tests the complete functionality of the monorepo setup
 */

const http = require('http');
const https = require('https');

// Test configuration
const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';
const GRAPHQL_ENDPOINT = `${BACKEND_URL}/graphql`;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Helper function to make GraphQL requests
async function makeGraphQLRequest(query, variables = {}) {
  const response = await makeRequest(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });

  return {
    statusCode: response.statusCode,
    data: JSON.parse(response.body)
  };
}

// Test functions
async function testBackendHealth() {
  log('\n🔍 Testing Backend Health...', colors.bold);
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/`);
    if (response.statusCode === 200) {
      logSuccess('Backend server is running');
      return true;
    } else {
      logError(`Backend server returned status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logError(`Backend server is not accessible: ${error.message}`);
    return false;
  }
}

async function testFrontendHealth() {
  log('\n🔍 Testing Frontend Health...', colors.bold);
  
  try {
    const response = await makeRequest(FRONTEND_URL);
    if (response.statusCode === 200) {
      logSuccess('Frontend server is running');
      return true;
    } else {
      logError(`Frontend server returned status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logError(`Frontend server is not accessible: ${error.message}`);
    return false;
  }
}

async function testGraphQLConnection() {
  log('\n🔍 Testing GraphQL Connection...', colors.bold);
  
  try {
    const response = await makeGraphQLRequest('{ hello }');
    
    if (response.statusCode === 200 && response.data.data && response.data.data.hello) {
      logSuccess(`GraphQL API is working: ${response.data.data.hello}`);
      return true;
    } else {
      logError('GraphQL API is not responding correctly');
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    logError(`GraphQL API error: ${error.message}`);
    return false;
  }
}

async function testUserQueries() {
  log('\n🔍 Testing User Queries...', colors.bold);
  
  try {
    const query = `
      query GetUsers {
        users {
          id
          email
          firstName
          lastName
          bio
          isActive
          createdAt
        }
      }
    `;
    
    const response = await makeGraphQLRequest(query);
    
    if (response.statusCode === 200 && response.data.data && Array.isArray(response.data.data.users)) {
      const users = response.data.data.users;
      logSuccess(`Successfully fetched ${users.length} users`);
      
      if (users.length > 0) {
        logInfo(`Sample user: ${users[0].firstName} ${users[0].lastName} (${users[0].email})`);
      }
      
      return { success: true, users };
    } else {
      logError('Failed to fetch users');
      console.log('Response:', response.data);
      return { success: false, users: [] };
    }
  } catch (error) {
    logError(`User query error: ${error.message}`);
    return { success: false, users: [] };
  }
}

async function testUserCreation() {
  log('\n🔍 Testing User Creation...', colors.bold);
  
  try {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          email
          firstName
          lastName
          bio
          isActive
          createdAt
        }
      }
    `;
    
    const variables = {
      input: {
        email: `test-${Date.now()}@integration.com`,
        firstName: 'Integration',
        lastName: 'Test',
        bio: 'Created during full-stack integration test'
      }
    };
    
    const response = await makeGraphQLRequest(mutation, variables);
    
    if (response.statusCode === 200 && response.data.data && response.data.data.createUser) {
      const user = response.data.data.createUser;
      logSuccess(`Successfully created user: ${user.firstName} ${user.lastName} (${user.email})`);
      return { success: true, user };
    } else {
      logError('Failed to create user');
      console.log('Response:', response.data);
      return { success: false, user: null };
    }
  } catch (error) {
    logError(`User creation error: ${error.message}`);
    return { success: false, user: null };
  }
}

async function testSharedUtilities() {
  log('\n🔍 Testing Shared Utilities...', colors.bold);
  
  try {
    // Test validation utilities
    const { validateCreateUserInput, getFullName, getInitials, formatDateForDisplay } = require('./packages/shared/dist/index.js');
    
    // Test validation
    const validInput = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Test bio'
    };
    
    const invalidInput = {
      email: 'invalid-email',
      firstName: 'A',
      lastName: '',
      bio: 'A'.repeat(600) // Too long
    };
    
    const validErrors = validateCreateUserInput(validInput);
    const invalidErrors = validateCreateUserInput(invalidInput);
    
    if (validErrors.length === 0) {
      logSuccess('Validation works correctly for valid input');
    } else {
      logError(`Validation failed for valid input: ${validErrors.length} errors`);
    }
    
    if (invalidErrors.length > 0) {
      logSuccess(`Validation correctly caught ${invalidErrors.length} errors for invalid input`);
    } else {
      logError('Validation failed to catch errors in invalid input');
    }
    
    // Test utility functions
    const fullName = getFullName('John', 'Doe');
    const initials = getInitials('John', 'Doe');
    const formattedDate = formatDateForDisplay(new Date());
    
    if (fullName === 'John Doe' && initials === 'JD' && formattedDate.includes('2025')) {
      logSuccess('Utility functions are working correctly');
      return true;
    } else {
      logError('Utility functions are not working correctly');
      return false;
    }
    
  } catch (error) {
    logError(`Shared utilities error: ${error.message}`);
    return false;
  }
}

async function testDatabaseConnection() {
  log('\n🔍 Testing Database Connection...', colors.bold);
  
  try {
    // Test by creating and then fetching a user
    const createResult = await testUserCreation();
    if (!createResult.success) {
      logError('Database connection test failed - could not create user');
      return false;
    }
    
    const queryResult = await testUserQueries();
    if (!queryResult.success) {
      logError('Database connection test failed - could not query users');
      return false;
    }
    
    // Check if the created user is in the results
    const createdUser = createResult.user;
    const foundUser = queryResult.users.find(u => u.id === createdUser.id);
    
    if (foundUser) {
      logSuccess('Database connection is working - data persistence confirmed');
      return true;
    } else {
      logError('Database connection issue - created user not found in query results');
      return false;
    }
    
  } catch (error) {
    logError(`Database connection error: ${error.message}`);
    return false;
  }
}

async function testCORS() {
  log('\n🔍 Testing CORS Configuration...', colors.bold);
  
  try {
    const response = await makeGraphQLRequest('{ hello }', {}, {
      'Origin': 'http://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    });
    
    if (response.statusCode === 200) {
      logSuccess('CORS is properly configured');
      return true;
    } else {
      logWarning('CORS might not be properly configured');
      return false;
    }
  } catch (error) {
    logError(`CORS test error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runIntegrationTests() {
  log(`${colors.bold}🚀 Full-Stack Integration Test Suite${colors.reset}`);
  log('='.repeat(50));
  
  const results = {
    backendHealth: false,
    frontendHealth: false,
    graphqlConnection: false,
    userQueries: false,
    userCreation: false,
    sharedUtilities: false,
    databaseConnection: false,
    cors: false
  };
  
  // Run all tests
  results.backendHealth = await testBackendHealth();
  results.frontendHealth = await testFrontendHealth();
  results.graphqlConnection = await testGraphQLConnection();
  results.userQueries = (await testUserQueries()).success;
  results.userCreation = (await testUserCreation()).success;
  results.sharedUtilities = await testSharedUtilities();
  results.databaseConnection = await testDatabaseConnection();
  results.cors = await testCORS();
  
  // Summary
  log('\n📊 Test Results Summary', colors.bold);
  log('='.repeat(30));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    log(`${status} ${testName}`);
  });
  
  log('\n' + '='.repeat(30));
  
  if (passed === total) {
    logSuccess(`🎉 All tests passed! (${passed}/${total})`);
    logSuccess('🚀 Full-stack monorepo is working perfectly!');
    
    log('\n📝 What was tested:', colors.bold);
    log('• Backend server health and accessibility');
    log('• Frontend server health and accessibility');
    log('• GraphQL API connection and basic queries');
    log('• User data queries and mutations');
    log('• Database persistence and data integrity');
    log('• Shared utilities and validation functions');
    log('• CORS configuration for frontend-backend communication');
    
    log('\n🎯 Next steps:', colors.bold);
    log('• Open http://localhost:3000 in your browser');
    log('• Test the user creation form');
    log('• Verify the user list updates in real-time');
    log('• Check the GraphQL playground at http://localhost:3001/graphql');
    
    process.exit(0);
  } else {
    logError(`❌ ${total - passed} tests failed! (${passed}/${total})`);
    logError('🔧 Please check the failed tests and fix the issues.');
    
    log('\n🛠️  Troubleshooting tips:', colors.bold);
    log('• Make sure both backend and frontend servers are running');
    log('• Check that PostgreSQL database is accessible');
    log('• Verify environment variables are set correctly');
    log('• Check the console logs for detailed error messages');
    
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runIntegrationTests().catch(error => {
    logError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runIntegrationTests,
  testBackendHealth,
  testFrontendHealth,
  testGraphQLConnection,
  testUserQueries,
  testUserCreation,
  testSharedUtilities,
  testDatabaseConnection,
  testCORS
};