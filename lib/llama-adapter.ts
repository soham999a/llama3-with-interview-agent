// Llama Adapter for Interview Agent
// This adapter replaces the Google AI SDK with Llama via Ollama

import axios from 'axios';

// Configuration
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
const QUESTION_MODEL = process.env.LLAMA_QUESTION_MODEL || 'llama3';
const FEEDBACK_MODEL = process.env.LLAMA_FEEDBACK_MODEL || 'llama3';

interface GenerateTextParams {
  prompt: string;
  model?: string;
}

interface GenerateObjectParams {
  prompt: string;
  model?: string;
  structuredOutputs?: boolean;
}

interface GenerateTextResponse {
  text: string;
}

interface GenerateObjectResponse {
  object: any;
}

/**
 * Generate text using Llama model
 * @param params - Parameters for text generation
 * @returns Promise with generated text
 */
export async function generateText(
  params: GenerateTextParams
): Promise<GenerateTextResponse> {
  const { prompt, model = QUESTION_MODEL } = params;
  
  try {
    console.log('Sending prompt to Llama model...');
    const response = await axios.post(OLLAMA_ENDPOINT, {
      model: model,
      prompt: prompt,
      stream: false
    });
    
    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from Llama model');
    }
    
    return { text: response.data.response };
  } catch (error) {
    console.error('Error generating text with Llama:', error);
    throw error;
  }
}

/**
 * Generate structured object using Llama model
 * @param params - Parameters for object generation
 * @returns Promise with generated object
 */
export async function generateObject(
  params: GenerateObjectParams
): Promise<GenerateObjectResponse> {
  const { prompt, model = FEEDBACK_MODEL, structuredOutputs = false } = params;
  
  try {
    // Add instructions to ensure proper JSON formatting
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting. Make sure all opening braces have matching closing braces. Make sure all property names and string values are enclosed in double quotes. Do not include trailing commas. The response should be a single, complete, valid JSON object.`;
    
    console.log('Sending prompt to Llama model for structured output...');
    const response = await axios.post(OLLAMA_ENDPOINT, {
      model: model,
      prompt: jsonPrompt,
      stream: false
    });
    
    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from Llama model');
    }
    
    // Extract JSON from response
    const jsonString = response.data.response.trim();
    
    // Try to parse the JSON
    try {
      const parsedObject = JSON.parse(jsonString);
      return { object: parsedObject };
    } catch (parseError) {
      console.error('Failed to parse JSON from Llama response:', parseError);
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
        
        throw new Error('Llama did not return valid JSON');
      }
    }
  } catch (error) {
    console.error('Error generating object with Llama:', error);
    throw error;
  }
}

// Export as a module
export const llamaAdapter = {
  generateText,
  generateObject
};
