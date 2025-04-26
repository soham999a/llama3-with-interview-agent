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
   * @param {Object} [options.parameters] - Optional parameters for text generation
   * @returns {Promise<Object>} - The generated text
   */
  async generateText({ prompt, parameters = {} }) {
    try {
      console.log(`Generating text with Hugging Face using prompt: ${prompt.substring(0, 100)}...`);

      // Default parameters
      const defaultParams = {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true
      };

      // Merge default parameters with any provided parameters
      const mergedParams = { ...defaultParams, ...parameters };

      console.log(`Using parameters: temperature=${mergedParams.temperature}, max_tokens=${mergedParams.max_new_tokens}`);

      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3-8b-chat-hf'}`,
        {
          inputs: prompt,
          parameters: mergedParams
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

      if (!generatedText) {
        console.error('No generated text in response:', response.data);
        throw new Error('No generated text in response from Hugging Face');
      }

      // If the response includes the prompt, remove it to get only the generated part
      const cleanedText = generatedText.replace(prompt, '').trim();

      console.log(`Generated text length: ${(cleanedText || generatedText).length} characters`);

      return { text: cleanedText || generatedText };
    } catch (error) {
      console.error('Error generating text with Hugging Face:', error);

      // If the model is loading, wait and retry
      if (error.response && error.response.status === 503 && error.response.data?.error?.includes('Loading')) {
        console.log('Model is loading, waiting and retrying...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.generateText({ prompt, parameters });
      }

      // If we hit rate limits, wait longer and retry
      if (error.response && error.response.status === 429) {
        console.log('Rate limited, waiting 10 seconds and retrying...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        return this.generateText({ prompt, parameters });
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
      // Add instructions to ensure proper JSON formatting with stronger emphasis
      const jsonPrompt = `${prompt}\n\nCRITICAL INSTRUCTION: Your response MUST be valid JSON only. Do not include any text before or after the JSON object. Do not use markdown formatting or code blocks. Do not include backticks. The response should start with '{' and end with '}' and be properly formatted JSON.`;

      // Use a lower temperature for more precise JSON generation
      const { text } = await this.generateText({
        prompt: jsonPrompt,
        parameters: {
          temperature: 0.2,  // Lower temperature for more deterministic output
          max_new_tokens: 2048  // Allow more tokens for complete JSON
        }
      });

      // Clean up the response to ensure it's valid JSON
      let cleanedResponse = text.trim();
      console.log(`Original response length: ${cleanedResponse.length}`);

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```") && cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```(?:json|javascript)?\s*/, '').replace(/\s*```$/, '');
      }

      // Find JSON object in the text - more robust extraction
      const objectStartIndex = cleanedResponse.indexOf('{');
      if (objectStartIndex === -1) {
        console.error('No JSON object found in response');
        throw new Error('No JSON object found in response');
      }

      // Find the matching closing brace
      let openBraces = 0;
      let objectEndIndex = -1;

      for (let i = objectStartIndex; i < cleanedResponse.length; i++) {
        if (cleanedResponse[i] === '{') openBraces++;
        if (cleanedResponse[i] === '}') openBraces--;

        if (openBraces === 0) {
          objectEndIndex = i + 1;
          break;
        }
      }

      if (objectEndIndex === -1) {
        // If we couldn't find matching braces, use the last brace as fallback
        objectEndIndex = cleanedResponse.lastIndexOf('}') + 1;
      }

      if (objectStartIndex >= 0 && objectEndIndex > objectStartIndex) {
        cleanedResponse = cleanedResponse.substring(objectStartIndex, objectEndIndex);
      }

      console.log(`Extracted JSON (first 100 chars): ${cleanedResponse.substring(0, 100)}...`);

      // Parse the cleaned JSON
      try {
        const parsedObject = JSON.parse(cleanedResponse);

        // Validate the object structure to ensure it has the expected fields
        if (parsedObject) {
          // Ensure scores are numbers between 0-10
          if (parsedObject.overallScore !== undefined) {
            parsedObject.overallScore = Math.max(0, Math.min(10, Number(parsedObject.overallScore) || 5));
          }

          if (parsedObject.technicalKnowledge?.score !== undefined) {
            parsedObject.technicalKnowledge.score = Math.max(0, Math.min(10, Number(parsedObject.technicalKnowledge.score) || 5));
          }

          if (parsedObject.communicationSkills?.score !== undefined) {
            parsedObject.communicationSkills.score = Math.max(0, Math.min(10, Number(parsedObject.communicationSkills.score) || 5));
          }

          if (parsedObject.problemSolving?.score !== undefined) {
            parsedObject.problemSolving.score = Math.max(0, Math.min(10, Number(parsedObject.problemSolving.score) || 5));
          }
        }

        return { object: parsedObject };
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);

        // Try to fix common JSON formatting issues
        try {
          // Replace common issues
          let fixedJson = cleanedResponse
            .replace(/(\w+):/g, '"$1":')  // Add quotes to keys without quotes
            .replace(/:\s*'([^']*)'/g, ': "$1"')  // Replace single quotes with double quotes
            .replace(/,\s*}/g, '}')  // Remove trailing commas
            .replace(/,\s*,/g, ',');  // Remove duplicate commas

          // Add missing closing braces if needed
          const openBraces = (fixedJson.match(/\{/g) || []).length;
          const closeBraces = (fixedJson.match(/\}/g) || []).length;
          if (openBraces > closeBraces) {
            fixedJson = fixedJson + '}'.repeat(openBraces - closeBraces);
          }

          console.log(`Attempting to fix JSON: ${fixedJson.substring(0, 100)}...`);

          // Try to parse the fixed JSON
          const parsedObject = JSON.parse(fixedJson);
          console.log('Successfully fixed and parsed JSON');

          // Validate and normalize scores
          if (parsedObject) {
            if (parsedObject.overallScore !== undefined) {
              parsedObject.overallScore = Math.max(0, Math.min(10, Number(parsedObject.overallScore) || 5));
            }

            if (parsedObject.technicalKnowledge?.score !== undefined) {
              parsedObject.technicalKnowledge.score = Math.max(0, Math.min(10, Number(parsedObject.technicalKnowledge.score) || 5));
            }

            if (parsedObject.communicationSkills?.score !== undefined) {
              parsedObject.communicationSkills.score = Math.max(0, Math.min(10, Number(parsedObject.communicationSkills.score) || 5));
            }

            if (parsedObject.problemSolving?.score !== undefined) {
              parsedObject.problemSolving.score = Math.max(0, Math.min(10, Number(parsedObject.problemSolving.score) || 5));
            }
          }

          return { object: parsedObject };
        } catch (fixError) {
          console.error('Failed to fix JSON:', fixError);
          throw new Error(`Failed to parse JSON response: ${parseError.message}`);
        }
      }
    } catch (error) {
      console.error('Error generating object with Hugging Face:', error);
      throw new Error(`Failed to generate object with Hugging Face: ${error.message}`);
    }
  }
};
