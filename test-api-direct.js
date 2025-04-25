// Direct test of API endpoints
const axios = require('axios');

// Test the question generation endpoint
async function testQuestionGenerationEndpoint() {
  try {
    console.log('Testing question generation endpoint...');
    
    const response = await axios.post('http://localhost:3000/api/vapi/generate', {
      type: 'technical',
      role: 'Frontend Developer',
      level: 'Mid-level',
      techstack: 'React, TypeScript, CSS',
      amount: 3,
      userid: 'test-user-123'
    }, {
      timeout: 60000 // 60 seconds timeout
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error testing question generation endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Main function to run the test
async function runTest() {
  console.log('=== Testing API Endpoint with Llama Integration ===\n');
  
  console.log('NOTE: Make sure the Next.js server is running on http://localhost:3000\n');
  
  const questionGenSuccess = await testQuestionGenerationEndpoint();
  
  console.log('\n=== Test Summary ===');
  console.log(`Question Generation Endpoint: ${questionGenSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  if (questionGenSuccess) {
    console.log('\n✅ Test passed! Llama integration is working correctly in the full application.');
  } else {
    console.log('\n❌ Test failed. Please check the logs above for details.');
  }
}

// Run the test
runTest();
