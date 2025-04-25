// DeepSeek Adapter for Interview Agent
// This adapter replaces the Google AI SDK with DeepSeek via Ollama

const axios = require('axios');

// Configuration
const OLLAMA_ENDPOINT = process.env.OLLAMA_ENDPOINT || 'http://localhost:11434/api/generate';
const QUESTION_MODEL = process.env.DEEPSEEK_QUESTION_MODEL || 'llama3';
const FEEDBACK_MODEL = process.env.DEEPSEEK_FEEDBACK_MODEL || 'llama3';

/**
 * Generate text using DeepSeek model
 * @param {object} params - Parameters for text generation
 * @param {string} params.prompt - The prompt to send to DeepSeek
 * @param {string} [params.model] - The model to use (defaults to question model)
 * @returns {Promise<{text: string}>} - The generated text
 */
async function generateText(params) {
  const { prompt, model = QUESTION_MODEL } = params;

  try {
    console.log('Sending prompt to DeepSeek model...');
    const response = await axios.post(OLLAMA_ENDPOINT, {
      model: model,
      prompt: prompt,
      stream: false
    });

    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from DeepSeek model');
    }

    return { text: response.data.response };
  } catch (error) {
    console.error('Error generating text with DeepSeek:', error);
    throw error;
  }
}

/**
 * Generate structured object using DeepSeek model
 * @param {object} params - Parameters for object generation
 * @param {string} params.prompt - The prompt to send to DeepSeek
 * @param {string} [params.model] - The model to use (defaults to feedback model)
 * @param {boolean} [params.structuredOutputs] - Whether to use structured outputs
 * @returns {Promise<{object: any}>} - The generated object
 */
async function generateObject(params) {
  const { prompt, model = FEEDBACK_MODEL, structuredOutputs = false } = params;

  try {
    // Enhanced instructions to ensure proper JSON formatting
    const jsonPrompt = `${prompt}

IMPORTANT INSTRUCTIONS FOR JSON FORMATTING:
1. Your response must be ONLY valid JSON with no other text
2. Do not include any text before or after the JSON object
3. Do not use markdown formatting or code blocks
4. All property names must be enclosed in double quotes
5. All string values must be enclosed in double quotes
6. Do not include trailing commas
7. Make sure all opening braces have matching closing braces
8. Do not include any special tokens or markers like <|begin_of_sentence|>
9. The response should be a single, complete, valid JSON object

Example of valid JSON format:
{
  "property1": "value1",
  "property2": 123,
  "property3": {
    "nestedProperty": "nestedValue"
  },
  "property4": ["item1", "item2"]
}`;

    console.log('Sending prompt to DeepSeek model for structured output...');
    const response = await axios.post(OLLAMA_ENDPOINT, {
      model: model,
      prompt: jsonPrompt,
      stream: false
    });

    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from DeepSeek model');
    }

    // Extract JSON from response
    let jsonString = response.data.response.trim();

    // Remove any markdown code block markers
    jsonString = jsonString.replace(/```json|```/g, '').trim();

    // Remove any special tokens that DeepSeek might include
    jsonString = jsonString.replace(/<｜begin▁of▁sentence｜>/g, '');

    // Try to parse the JSON
    try {
      const parsedObject = JSON.parse(jsonString);
      return { object: parsedObject };
    } catch (parseError) {
      console.error('Failed to parse JSON from DeepSeek response:', parseError);
      console.log('Raw response:', jsonString);

      // Advanced JSON fixing
      try {
        // Fix 1: Add missing closing braces
        let fixedJson = jsonString;
        const openBraces = (jsonString.match(/\{/g) || []).length;
        const closeBraces = (jsonString.match(/\}/g) || []).length;
        if (openBraces > closeBraces) {
          fixedJson = fixedJson + '}'.repeat(openBraces - closeBraces);
        }

        // Fix 2: Fix property names missing quotes
        fixedJson = fixedJson.replace(/(\s*)(\w+)(\s*):/g, '$1"$2"$3:');

        // Fix 3: Fix trailing commas before closing braces
        fixedJson = fixedJson.replace(/,(\s*})/g, '$1');

        // Fix 4: Fix missing quotes around string values
        // This is a simplified approach and might not catch all cases
        fixedJson = fixedJson.replace(/:(\s*)([^{\[\d"\s][^,}\]]*)/g, ':$1"$2"');

        // Try to parse the fixed JSON
        try {
          const parsedObject = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed JSON');
          return { object: parsedObject };
        } catch (innerFixError) {
          console.log('First round of fixes failed, trying more aggressive approach');

          // More aggressive approach: Try to extract a valid JSON object
          const jsonRegex = /\{[\s\S]*\}/g;
          const matches = fixedJson.match(jsonRegex);

          if (matches && matches.length > 0) {
            // Try each match, starting with the largest (most complete)
            const sortedMatches = matches.sort((a, b) => b.length - a.length);

            for (const match of sortedMatches) {
              try {
                // Try to fix this match
                let potentialJson = match;

                // Replace any malformed JSON with valid structure
                potentialJson = potentialJson.replace(/,(\s*)([\]}])/g, '$1$2'); // Remove trailing commas

                // Try to parse
                const partialObject = JSON.parse(potentialJson);
                console.log('Extracted and fixed partial JSON object');
                return { object: partialObject };
              } catch (e) {
                // Continue to next match
              }
            }
          }

          // If all else fails, create a minimal valid object with the data we can extract
          console.log('Creating fallback object from extracted data');

          // Extract what looks like key-value pairs
          const keyValueRegex = /"([^"]+)"\s*:\s*(?:"([^"]+)"|(\d+))/g;
          const extractedData = {};
          let match;

          while ((match = keyValueRegex.exec(fixedJson)) !== null) {
            const key = match[1];
            const value = match[2] || match[3]; // String or number
            extractedData[key] = isNaN(value) ? value : Number(value);
          }

          if (Object.keys(extractedData).length > 0) {
            console.log('Created fallback object with extracted data');
            return { object: extractedData };
          }

          throw new Error('Could not extract valid JSON data');
        }
      } catch (fixError) {
        console.error('All JSON fixing attempts failed:', fixError);
        throw new Error('DeepSeek did not return valid JSON');
      }
    }
  } catch (error) {
    console.error('Error generating object with DeepSeek:', error);
    throw error;
  }
}

// Export as a module
module.exports = {
  generateText,
  generateObject,
  deepseekAdapter: {
    generateText,
    generateObject
  }
};
