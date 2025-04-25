// Test script for API endpoints with Llama integration
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

// Test the feedback generation endpoint
async function testFeedbackGenerationEndpoint() {
  try {
    console.log('\nTesting feedback generation endpoint...');
    
    const transcript = [
      { role: "interviewer", content: "Can you explain how React's virtual DOM works?" },
      { role: "candidate", content: "React's virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new virtual DOM and compares it with the previous one. It then only updates the real DOM with the differences, which is more efficient than updating the entire DOM." },
      { role: "interviewer", content: "How would you optimize the performance of a React application?" },
      { role: "candidate", content: "I would use techniques like memoization with React.memo, useMemo, and useCallback to prevent unnecessary re-renders. I'd also implement code splitting with React.lazy and Suspense to reduce the initial bundle size. Additionally, I'd use proper key props in lists and avoid inline function definitions in render methods." }
    ];
    
    const response = await axios.post('http://localhost:3000/api/feedback', {
      interviewId: 'test-interview-123',
      userId: 'test-user-123',
      transcript: transcript,
      feedbackId: 'test-feedback-123'
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error testing feedback generation endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Main function to run the tests
async function runTests() {
  console.log('=== Testing API Endpoints with Llama Integration ===\n');
  
  console.log('NOTE: Make sure the Next.js server is running on http://localhost:3000\n');
  
  const questionGenSuccess = await testQuestionGenerationEndpoint();
  const feedbackGenSuccess = await testFeedbackGenerationEndpoint();
  
  console.log('\n=== Test Summary ===');
  console.log(`Question Generation Endpoint: ${questionGenSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Feedback Generation Endpoint: ${feedbackGenSuccess ? '✅ PASS' : '❌ FAIL'}`);
  
  if (questionGenSuccess && feedbackGenSuccess) {
    console.log('\n✅ All tests passed! Llama integration is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the logs above for details.');
  }
}

// Run the tests
runTests();
