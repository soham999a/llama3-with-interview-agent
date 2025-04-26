// Hugging Face Integration for Interview Agent
// This file provides integration with Hugging Face Inference API for Llama3 models

import axios from 'axios';

/**
 * Hugging Face adapter for Llama3 models
 */
export const huggingfaceAdapter = {
  /**
   * Generate text using Hugging Face Inference API
   * @param {Object} options - Options for text generation
   * @param {string} options.prompt - The prompt to generate text from
   * @returns {Promise<Object>} - The generated text
   */
  async generateText({ prompt }) {
    try {
      console.log(`Generating text with Hugging Face using prompt: ${prompt.substring(0, 100)}...`);

      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3-8b-chat-hf'}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the generated text
      const generatedText = response.data[0]?.generated_text || response.data?.generated_text;

      // If the response includes the prompt, remove it to get only the generated part
      const cleanedText = generatedText.replace(prompt, '').trim();

      return { text: cleanedText || generatedText };
    } catch (error) {
      console.error('Error generating text with Hugging Face:', error);

      // If the model is loading, wait and retry
      if (error.response && error.response.status === 503 && error.response.data.error.includes('Loading')) {
        console.log('Model is loading, waiting and retrying...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.generateText({ prompt });
      }

      throw new Error(`Failed to generate text with Hugging Face: ${error.message}`);
    }
  },

  /**
   * Generate a structured object using Hugging Face Inference API
   * @param {Object} options - Options for object generation
   * @param {string} options.prompt - The prompt to generate the object from
   * @returns {Promise<Object>} - The generated object
   */
  async generateObject({ prompt }) {
    try {
      // Add instructions to ensure proper JSON formatting
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting or code blocks. Do not include backticks.`;

      const { text } = await this.generateText({ prompt: jsonPrompt });

      // Clean up the response to ensure it's valid JSON
      let cleanedResponse = text.trim();

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```") && cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json|javascript)?\s*/, '').replace(/\s*```$/, '');
      }

      // Find JSON object in the text
      const objectStartIndex = cleanedResponse.indexOf('{');
      const objectEndIndex = cleanedResponse.lastIndexOf('}') + 1;

      if (objectStartIndex >= 0 && objectEndIndex > objectStartIndex) {
        cleanedResponse = cleanedResponse.substring(objectStartIndex, objectEndIndex);
      }

      console.log(`Cleaned JSON response: ${cleanedResponse.substring(0, 100)}...`);

      // Parse the cleaned JSON
      try {
        const parsedObject = JSON.parse(cleanedResponse);
        return { object: parsedObject };
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);

        // Try to fix common JSON formatting issues
        try {
          // Add missing closing braces if needed
          let fixedJson = cleanedResponse;
          const openBraces = (cleanedResponse.match(/\{/g) || []).length;
          const closeBraces = (cleanedResponse.match(/\}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedJson = fixedJson + '}'.repeat(openBraces - closeBraces);
          }

          // Try to parse the fixed JSON
          const parsedObject = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed JSON');
          return { object: parsedObject };
        } catch (fixError) {
          throw new Error(`Failed to parse JSON response: ${parseError.message}`);
        }
      }
    } catch (error) {
      console.error('Error generating object with Hugging Face:', error);
      throw new Error(`Failed to generate object with Hugging Face: ${error.message}`);
    }
  }
};
