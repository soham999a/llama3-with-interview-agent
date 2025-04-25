// Simple test for Llama 3 integration
const axios = require('axios');

async function testLlama3() {
  try {
    console.log('Testing Llama 3 integration...');
    
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt: 'Hello, how are you?',
      stream: false
    });
    
    if (response.data && response.data.response) {
      console.log('✅ Llama 3 is working!');
      console.log('Response:', response.data.response);
      return true;
    } else {
      console.log('❌ Unexpected response format from Llama 3');
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Llama 3:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Run the test
testLlama3()
  .then(success => {
    if (success) {
      console.log('\nLlama 3 integration is working correctly!');
    } else {
      console.log('\nLlama 3 integration is not working correctly.');
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
  });
