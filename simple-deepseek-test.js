// Simple test for DeepSeek integration
const axios = require('axios');

async function testDeepSeek() {
  try {
    console.log('Testing DeepSeek integration...');
    
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'deepseek-coder:6.7b',
      prompt: 'Hello, how are you?',
      stream: false
    });
    
    if (response.data && response.data.response) {
      console.log('✅ DeepSeek is working!');
      console.log('Response:', response.data.response);
      return true;
    } else {
      console.log('❌ Unexpected response format from DeepSeek');
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing DeepSeek:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the test
testDeepSeek()
  .then(success => {
    if (success) {
      console.log('\nDeepSeek integration is working correctly!');
    } else {
      console.log('\nDeepSeek integration is not working correctly.');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  });
