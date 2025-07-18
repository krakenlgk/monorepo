#!/usr/bin/env node

/**
 * User Management End-to-End Test
 * Tests the complete user management workflow
 */

const http = require('http');

// Test configuration
const GRAPHQL_ENDPOINT = 'http://localhost:3001/graphql';

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

// Helper function to make GraphQL requests
async function makeGraphQLRequest(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query, variables });
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            data: response
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function testCreateUser() {
  log('\n🔍 Testing User Creation...', colors.bold);
  
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
        updatedAt
      }
    }
  `;
  
  const testUser = {
    email: `e2e-test-${Date.now()}@example.com`,
    firstName: 'End-to-End',
    lastName: 'Test',
    bio: 'Created during end-to-end testing'
  };
  
  try {
    const response = await makeGraphQLRequest(mutation, { input: testUser });
    
    if (response.statusCode === 200 && response.data.data && response.data.data.createUser) {
      const user = response.data.data.createUser;
      logSuccess(`User created successfully: ${user.firstName} ${user.lastName}`);
      logInfo(`User ID: ${user.id}`);
      logInfo(`Email: ${user.email}`);
      logInfo(`Active: ${user.isActive}`);
      logInfo(`Created: ${new Date(user.createdAt).toLocaleString()}`);
      
      return { success: true, user };
    } else {
      logError('Failed to create user');
      if (response.data.errors) {
        response.data.errors.forEach(error => {
          logError(`GraphQL Error: ${error.message}`);
        });
      }
      return { success: false, user: null };
    }
  } catch (error) {
    logError(`User creation error: ${error.message}`);
    return { success: false, user: null };
  }
}

async function testGetAllUsers() {
  log('\n🔍 Testing Get All Users...', colors.bold);
  
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
        updatedAt
      }
    }
  `;
  
  try {
    const response = await makeGraphQLRequest(query);
    
    if (response.statusCode === 200 && response.data.data && Array.isArray(response.data.data.users)) {
      const users = response.data.data.users;
      logSuccess(`Retrieved ${users.length} users`);
      
      if (users.length > 0) {
        logInfo('Sample users:');
        users.slice(0, 3).forEach((user, index) => {
          logInfo(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.isActive ? 'Active' : 'Inactive'}`);
        });
      }
      
      return { success: true, users };
    } else {
      logError('Failed to retrieve users');
      if (response.data.errors) {
        response.data.errors.forEach(error => {
          logError(`GraphQL Error: ${error.message}`);
        });
      }
      return { success: false, users: [] };
    }
  } catch (error) {
    logError(`Get users error: ${error.message}`);
    return { success: false, users: [] };
  }
}

async function testGetUserById(userId) {
  log('\n🔍 Testing Get User by ID...', colors.bold);
  
  const query = `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        email
        firstName
        lastName
        bio
        isActive
        createdAt
        updatedAt
      }
    }
  `;
  
  try {
    const response = await makeGraphQLRequest(query, { id: userId });
    
    if (response.statusCode === 200 && response.data.data && response.data.data.user) {
      const user = response.data.data.user;
      logSuccess(`Retrieved user by ID: ${user.firstName} ${user.lastName}`);
      logInfo(`Email: ${user.email}`);
      logInfo(`Bio: ${user.bio || 'No bio'}`);
      
      return { success: true, user };
    } else {
      logError(`Failed to retrieve user with ID: ${userId}`);
      if (response.data.errors) {
        response.data.errors.forEach(error => {
          logError(`GraphQL Error: ${error.message}`);
        });
      }
      return { success: false, user: null };
    }
  } catch (error) {
    logError(`Get user by ID error: ${error.message}`);
    return { success: false, user: null };
  }
}

async function testGetUserByEmail(email) {
  log('\n🔍 Testing Get User by Email...', colors.bold);
  
  const query = `
    query GetUserByEmail($email: String!) {
      userByEmail(email: $email) {
        id
        email
        firstName
        lastName
        bio
        isActive
        createdAt
        updatedAt
      }
    }
  `;
  
  try {
    const response = await makeGraphQLRequest(query, { email });
    
    if (response.statusCode === 200 && response.data.data && response.data.data.userByEmail) {
      const user = response.data.data.userByEmail;
      logSuccess(`Retrieved user by email: ${user.firstName} ${user.lastName}`);
      logInfo(`ID: ${user.id}`);
      logInfo(`Bio: ${user.bio || 'No bio'}`);
      
      return { success: true, user };
    } else {
      logError(`Failed to retrieve user with email: ${email}`);
      if (response.data.errors) {
        response.data.errors.forEach(error => {
          logError(`GraphQL Error: ${error.message}`);
        });
      }
      return { success: false, user: null };
    }
  } catch (error) {
    logError(`Get user by email error: ${error.message}`);
    return { success: false, user: null };
  }
}

async function testUpdateUser(userId) {
  log('\n🔍 Testing User Update...', colors.bold);
  
  const mutation = `
    mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
      updateUser(id: $id, input: $input) {
        id
        email
        firstName
        lastName
        bio
        isActive
        createdAt
        updatedAt
      }
    }
  `;
  
  const updateData = {
    bio: `Updated bio at ${new Date().toISOString()}`,
    isActive: false
  };
  
  try {
    const response = await makeGraphQLRequest(mutation, { id: userId, input: updateData });
    
    if (response.statusCode === 200 && response.data.data && response.data.data.updateUser) {
      const user = response.data.data.updateUser;
      logSuccess(`User updated successfully: ${user.firstName} ${user.lastName}`);
      logInfo(`New bio: ${user.bio}`);
      logInfo(`Active status: ${user.isActive}`);
      logInfo(`Updated: ${new Date(user.updatedAt).toLocaleString()}`);
      
      return { success: true, user };
    } else {
      logError(`Failed to update user with ID: ${userId}`);
      if (response.data.errors) {
        response.data.errors.forEach(error => {
          logError(`GraphQL Error: ${error.message}`);
        });
      }
      return { success: false, user: null };
    }
  } catch (error) {
    logError(`User update error: ${error.message}`);
    return { success: false, user: null };
  }
}

async function testDeleteUser(userId) {
  log('\n🔍 Testing User Deletion...', colors.bold);
  
  const mutation = `
    mutation DeleteUser($id: ID!) {
      deleteUser(id: $id)
    }
  `;
  
  try {
    const response = await makeGraphQLRequest(mutation, { id: userId });
    
    if (response.statusCode === 200 && response.data.data && response.data.data.deleteUser === true) {
      logSuccess(`User deleted successfully (ID: ${userId})`);
      return { success: true };
    } else {
      logError(`Failed to delete user with ID: ${userId}`);
      if (response.data.errors) {
        response.data.errors.forEach(error => {
          logError(`GraphQL Error: ${error.message}`);
        });
      }
      return { success: false };
    }
  } catch (error) {
    logError(`User deletion error: ${error.message}`);
    return { success: false };
  }
}

async function testValidationErrors() {
  log('\n🔍 Testing Validation Errors...', colors.bold);
  
  const mutation = `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        email
        firstName
        lastName
      }
    }
  `;
  
  // Test with invalid data
  const invalidUser = {
    email: 'invalid-email',
    firstName: '',
    lastName: 'A'.repeat(100), // Too long
    bio: 'A'.repeat(1000) // Too long
  };
  
  try {
    const response = await makeGraphQLRequest(mutation, { input: invalidUser });
    
    if (response.data.errors && response.data.errors.length > 0) {
      logSuccess('Validation errors are properly handled');
      logInfo(`Caught ${response.data.errors.length} validation errors:`);
      response.data.errors.forEach((error, index) => {
        logInfo(`  ${index + 1}. ${error.message}`);
      });
      return { success: true };
    } else {
      logError('Validation errors were not properly caught');
      return { success: false };
    }
  } catch (error) {
    logError(`Validation test error: ${error.message}`);
    return { success: false };
  }
}

async function runUserManagementTests() {
  log(`${colors.bold}👥 User Management End-to-End Test Suite${colors.reset}`);
  log('='.repeat(60));
  
  const results = {
    createUser: false,
    getAllUsers: false,
    getUserById: false,
    getUserByEmail: false,
    updateUser: false,
    deleteUser: false,
    validationErrors: false
  };
  
  let testUser = null;
  
  // Test user creation
  const createResult = await testCreateUser();
  results.createUser = createResult.success;
  if (createResult.success) {
    testUser = createResult.user;
  }
  
  // Test get all users
  const getAllResult = await testGetAllUsers();
  results.getAllUsers = getAllResult.success;
  
  // Test get user by ID (if we have a test user)
  if (testUser) {
    const getByIdResult = await testGetUserById(testUser.id);
    results.getUserById = getByIdResult.success;
    
    // Test get user by email
    const getByEmailResult = await testGetUserByEmail(testUser.email);
    results.getUserByEmail = getByEmailResult.success;
    
    // Test user update
    const updateResult = await testUpdateUser(testUser.id);
    results.updateUser = updateResult.success;
    
    // Test user deletion
    const deleteResult = await testDeleteUser(testUser.id);
    results.deleteUser = deleteResult.success;
  }
  
  // Test validation errors
  const validationResult = await testValidationErrors();
  results.validationErrors = validationResult.success;
  
  // Summary
  log('\n📊 Test Results Summary', colors.bold);
  log('='.repeat(40));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    log(`${status} ${testName}`);
  });
  
  log('\n' + '='.repeat(40));
  
  if (passed === total) {
    logSuccess(`🎉 All user management tests passed! (${passed}/${total})`);
    
    log('\n✨ User Management Features Verified:', colors.bold);
    log('• ✅ Create new users with validation');
    log('• ✅ Retrieve all users');
    log('• ✅ Get user by ID');
    log('• ✅ Get user by email');
    log('• ✅ Update user information');
    log('• ✅ Delete users');
    log('• ✅ Input validation and error handling');
    
    log('\n🚀 Ready for production use!', colors.bold);
    
    return true;
  } else {
    logError(`❌ ${total - passed} tests failed! (${passed}/${total})`);
    
    log('\n🛠️  Failed tests need attention:', colors.bold);
    Object.entries(results).forEach(([test, passed]) => {
      if (!passed) {
        const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        log(`• ❌ ${testName}`);
      }
    });
    
    return false;
  }
}

// Run the tests
if (require.main === module) {
  runUserManagementTests().catch(error => {
    logError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runUserManagementTests,
  testCreateUser,
  testGetAllUsers,
  testGetUserById,
  testGetUserByEmail,
  testUpdateUser,
  testDeleteUser,
  testValidationErrors
};