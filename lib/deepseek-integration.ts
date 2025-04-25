// DeepSeek Integration for Interview Agent
// This file provides direct integration with DeepSeek for the Interview Agent application
// It maintains the same design and workflow as the original application

import axios from 'axios';

// Configuration
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_QUESTION_MODEL || 'deepseek-coder:6.7b'; // Primary model
const LLAMA_MODEL = process.env.LLAMA_QUESTION_MODEL || 'llama3'; // Fallback model

/**
 * DeepSeek Adapter for Interview Agent
 * This adapter replaces the Google Gemini API with DeepSeek via Ollama
 * It maintains the same interface as the original API for seamless integration
 */
const deepseekAdapter = {
  /**
   * Generate text using DeepSeek model
   * @param {Object} params - Parameters for text generation
   * @param {string} params.prompt - The prompt to send to the model
   * @param {string} [params.model] - The model to use (defaults to DEEPSEEK_MODEL)
   * @returns {Promise<{text: string}>} - Promise with generated text
   */
  async generateText({ prompt, model = DEEPSEEK_MODEL }: { prompt: string; model?: string }) {
    try {
      console.log(`Sending prompt to ${model}...`);
      const response = await axios.post(OLLAMA_ENDPOINT, {
        model: model,
        prompt: prompt,
        stream: false
      });
      
      if (!response.data || !response.data.response) {
        throw new Error(`Invalid response from ${model}`);
      }
      
      return { text: response.data.response };
    } catch (error: any) {
      console.error(`Error generating text with ${model}:`, error.message);
      
      // If using DeepSeek and it fails, try Llama as fallback
      if (model === DEEPSEEK_MODEL) {
        console.log('Falling back to Llama 3...');
        return this.generateText({ prompt, model: LLAMA_MODEL });
      }
      
      throw error;
    }
  },
  
  /**
   * Generate structured object using DeepSeek model
   * @param {Object} params - Parameters for object generation
   * @param {string} params.prompt - The prompt to send to the model
   * @param {string} [params.model] - The model to use (defaults to DEEPSEEK_MODEL)
   * @returns {Promise<{object: any}>} - Promise with generated object
   */
  async generateObject({ prompt, model = DEEPSEEK_MODEL }: { prompt: string; model?: string }) {
    try {
      // Add instructions to ensure proper JSON formatting
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting. Make sure all opening braces have matching closing braces. Make sure all property names and string values are enclosed in double quotes. Do not include trailing commas. The response should be a single, complete, valid JSON object.`;
      
      console.log(`Sending prompt to ${model} for structured output...`);
      const response = await axios.post(OLLAMA_ENDPOINT, {
        model: model,
        prompt: jsonPrompt,
        stream: false
      });
      
      if (!response.data || !response.data.response) {
        throw new Error(`Invalid response from ${model}`);
      }
      
      // Extract JSON from response
      const jsonString = response.data.response.trim();
      
      // Try to parse the JSON
      try {
        const parsedObject = JSON.parse(jsonString);
        return { object: parsedObject };
      } catch (parseError) {
        console.error(`Failed to parse JSON from ${model} response:`, parseError);
        console.log('Raw response:', jsonString);
        
        // Try to fix common JSON formatting issues
        try {
          // Add missing closing braces if needed
          let fixedJson = jsonString;
          const openBraces = (jsonString.match(/\{/g) || []).length;
          const closeBraces = (jsonString.match(/\}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedJson = fixedJson + '}'.repeat(openBraces - closeBraces);
          }
          
          // Try to parse the fixed JSON
          const parsedObject = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed JSON');
          return { object: parsedObject };
        } catch (fixError) {
          // If we still can't parse it, try to extract a partial object
          try {
            // Extract what looks like valid JSON
            const jsonRegex = /\{[\s\S]*?\}/g;
            const matches = jsonString.match(jsonRegex);
            if (matches && matches.length > 0) {
              // Try the largest match first (likely the most complete)
              const sortedMatches = matches.sort((a, b) => b.length - a.length);
              for (const match of sortedMatches) {
                try {
                  const partialObject = JSON.parse(match);
                  console.log('Extracted partial JSON object');
                  return { object: partialObject };
                } catch (e) {
                  // Continue to next match
                }
              }
            }
          } catch (extractError) {
            // Ignore extraction errors
          }
          
          // If using DeepSeek and it fails, try Llama as fallback
          if (model === DEEPSEEK_MODEL) {
            console.log('Falling back to Llama 3...');
            return this.generateObject({ prompt, model: LLAMA_MODEL });
          }
          
          throw new Error(`${model} did not return valid JSON`);
        }
      }
    } catch (error: any) {
      console.error(`Error generating object with ${model}:`, error.message);
      
      // If using DeepSeek and it fails, try Llama as fallback
      if (model === DEEPSEEK_MODEL && !error.message.includes('did not return valid JSON')) {
        console.log('Falling back to Llama 3...');
        return this.generateObject({ prompt, model: LLAMA_MODEL });
      }
      
      throw error;
    }
  }
};

// Export the adapter for use in the Interview Agent application
export { deepseekAdapter };
