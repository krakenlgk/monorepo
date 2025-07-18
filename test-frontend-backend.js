#!/usr/bin/env node

/**
 * Frontend-Backend Integration Test
 * Tests the frontend components and their interaction with the backend
 */

const http = require('http');

// Test configuration
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:3001';

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

async function testFrontendContent() {
  log('\n🔍 Testing Frontend Content...', colors.bold);
  
  try {
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.statusCode === 200) {
      const html = response.body;
      
      // Check for key elements
      const checks = [
        { name: 'Page Title', test: html.includes('Fullstack Monorepo Demo') },
        { name: 'User Management Section', test: html.includes('User Management') },
        { name: 'GraphQL Connection Status', test: html.includes('API Connection Status') },
        { name: 'Next.js Framework', test: html.includes('__NEXT_DATA__') },
        { name: 'React Components', test: html.includes('react') || html.includes('React') }
      ];
      
      let passed = 0;
      checks.forEach(check => {
        if (check.test) {
          logSuccess(`${check.name} found in frontend`);
          passed++;
        } else {
          logError(`${check.name} not found in frontend`);
        }
      });
      
      if (passed === checks.length) {
        logSuccess('Frontend content is properly rendered');
        return true;
      } else {
        logError(`Frontend content issues: ${checks.length - passed} checks failed`);
        return false;
      }
    } else {
      logError(`Frontend returned status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    logError(`Frontend content test error: ${error.message}`);
    return false;
  }
}

async function testAPIEndpoints() {
  log('\n🔍 Testing API Endpoints...', colors.bold);
  
  const endpoints = [
    { name: 'Backend Root', url: `${BACKEND_URL}/` },
    { name: 'GraphQL Endpoint', url: `${BACKEND_URL}/graphql`, method: 'POST', body: '{"query":"{ hello }"}', headers: { 'Content-Type': 'application/json' } }
  ];
  
  let passed = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(endpoint.url, {
        method: endpoint.method || 'GET',
        headers: endpoint.headers || {},
        body: endpoint.body
      });
      
      if (response.statusCode === 200) {
        logSuccess(`${endpoint.name} is accessible`);
        passed++;
      } else {
        logError(`${endpoint.name} returned status ${response.statusCode}`);
      }
    } catch (error) {
      logError(`${endpoint.name} error: ${error.message}`);
    }
  }
  
  return passed === endpoints.length;
}

async function testEnvironmentConfiguration() {
  log('\n🔍 Testing Environment Configuration...', colors.bold);
  
  try {
    // Test if environment variables are properly set by checking the frontend's behavior
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.statusCode === 200) {
      logSuccess('Frontend environment is properly configured');
      
      // Test GraphQL endpoint configuration by making a request
      const graphqlResponse = await makeRequest(`${BACKEND_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ hello }' })
      });
      
      if (graphqlResponse.statusCode === 200) {
        const data = JSON.parse(graphqlResponse.body);
        if (data.data && data.data.hello) {
          logSuccess('Backend environment is properly configured');
          return true;
        }
      }
    }
    
    logError('Environment configuration issues detected');
    return false;
  } catch (error) {
    logError(`Environment test error: ${error.message}`);
    return false;
  }
}

async function runFrontendBackendTests() {
  log(`${colors.bold}🌐 Frontend-Backend Integration Test${colors.reset}`);
  log('='.repeat(50));
  
  const results = {
    frontendContent: false,
    apiEndpoints: false,
    environmentConfig: false
  };
  
  // Run tests
  results.frontendContent = await testFrontendContent();
  results.apiEndpoints = await testAPIEndpoints();
  results.environmentConfig = await testEnvironmentConfiguration();
  
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
    logSuccess(`🎉 All frontend-backend tests passed! (${passed}/${total})`);
    
    log('\n🌐 Frontend is accessible at:', colors.bold);
    log(`   ${FRONTEND_URL}`);
    
    log('\n🔗 Backend API is accessible at:', colors.bold);
    log(`   ${BACKEND_URL}`);
    log(`   ${BACKEND_URL}/graphql (GraphQL Playground)`);
    
    log('\n✨ Ready for development!', colors.bold);
    
    return true;
  } else {
    logError(`❌ ${total - passed} tests failed! (${passed}/${total})`);
    return false;
  }
}

// Run the tests
if (require.main === module) {
  runFrontendBackendTests().catch(error => {
    logError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  runFrontendBackendTests,
  testFrontendContent,
  testAPIEndpoints,
  testEnvironmentConfiguration
};