// Test script for API routes
const axios = require('axios');

async function testApiRoutes() {
  try {
    console.log('Testing API routes...');
    
    // Test the test API
    console.log('\nTesting /api/test endpoint...');
    const testResponse = await axios.post('http://localhost:3000/api/test', {
      prompt: 'Generate 3 interview questions for a Frontend Developer role.',
      type: 'question'
    });
    
    if (testResponse.data && testResponse.data.success) {
      console.log('✅ Test API is working!');
      console.log('Generated questions:', testResponse.data.text);
    } else {
      console.log('❌ Test API returned an unexpected response');
      console.log('Response:', testResponse.data);
    }
    
    // Test the feedback API
    console.log('\nTesting /api/feedback endpoint...');
    const feedbackResponse = await axios.post('http://localhost:3000/api/feedback', {
      interviewId: 'test-interview-id',
      userId: 'test-user-id',
      transcript: [
        { role: 'interviewer', content: 'Tell me about yourself.' },
        { role: 'candidate', content: 'I am a frontend developer with 5 years of experience.' }
      ]
    });
    
    if (feedbackResponse.data && feedbackResponse.data.success) {
      console.log('✅ Feedback API is working!');
      console.log('Generated feedback:', feedbackResponse.data.feedback);
    } else {
      console.log('❌ Feedback API returned an unexpected response');
      console.log('Response:', feedbackResponse.data);
    }
    
    // Test the VAPI generate API
    console.log('\nTesting /api/vapi/generate endpoint...');
    const vapiResponse = await axios.post('http://localhost:3000/api/vapi/generate', {
      type: 'technical',
      role: 'Frontend Developer',
      level: 'Mid-level',
      techstack: 'React,TypeScript,CSS',
      amount: 5,
      userid: 'test-user-id'
    });
    
    if (vapiResponse.data && vapiResponse.data.success) {
      console.log('✅ VAPI Generate API is working!');
      console.log('Interview ID:', vapiResponse.data.interviewId);
    } else {
      console.log('❌ VAPI Generate API returned an unexpected response');
      console.log('Response:', vapiResponse.data);
    }
    
    console.log('\nAll API tests completed!');
  } catch (error) {
    console.error('Error testing API routes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
testApiRoutes();
