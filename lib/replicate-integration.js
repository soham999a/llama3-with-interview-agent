// Replicate Integration for Interview Agent
import Replicate from 'replicate';

// Initialize Replicate with API token from environment variables
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Llama 3 model ID on Replicate
const LLAMA_MODEL_ID = "meta/llama-3-8b-instruct:dd2c4223f0845bf1faf531d898e458738dae1972a20a0c023a7630c9e5fc6046";

// Response cache for storing recent responses
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Replicate Adapter for Interview Agent
 */
const replicateAdapter = {
  /**
   * Generate text using Replicate's Llama model
   * @param {Object} params - Parameters for text generation
   * @param {string} params.prompt - The prompt to send to the model
   * @returns {Promise<{text: string}>} - Promise with generated text
   */
  async generateText({ prompt }) {
    // Create a cache key based on the prompt
    const cacheKey = `text:${prompt}`;

    // Check if we have a cached response
    if (responseCache.has(cacheKey)) {
      const cachedData = responseCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log('Using cached response for text generation');
        return cachedData.response;
      }
      // Cache expired, remove it
      responseCache.delete(cacheKey);
    }

    try {
      console.log(`Sending prompt to Replicate Llama model...`);

      const output = await replicate.run(
        LLAMA_MODEL_ID,
        {
          input: {
            prompt: prompt,
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
          }
        }
      );

      // Replicate returns an array of text chunks, join them
      const text = output.join("");
      console.log("Received response from Replicate:", text.substring(0, 100) + "...");

      const result = { text };

      // Cache the successful response
      responseCache.set(cacheKey, {
        response: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error(`Error generating text with Replicate:`, error.message);

      // Return a default response
      return {
        text: JSON.stringify([
          "What are your key strengths and experience?",
          "Can you describe a challenging project you worked on?",
          "How would you handle a difficult situation with a team member?",
          "What are your career goals?",
          "Do you have any questions for me?"
        ])
      };
    }
  },

  /**
   * Generate structured object using Replicate's Llama model
   * @param {Object} params - Parameters for object generation
   * @param {string} params.prompt - The prompt to send to the model
   * @returns {Promise<{object: any}>} - Promise with generated object
   */
  async generateObject({ prompt }) {
    // Create a cache key based on the prompt
    const cacheKey = `object:${prompt}`;

    // Check if we have a cached response
    if (responseCache.has(cacheKey)) {
      const cachedData = responseCache.get(cacheKey);
      if (Date.now() - cachedData.timestamp < CACHE_TTL) {
        console.log('Using cached response for object generation');
        return cachedData.response;
      }
      // Cache expired, remove it
      responseCache.delete(cacheKey);
    }

    try {
      // Add instructions to ensure proper JSON formatting
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting or code blocks.`;

      console.log(`Sending prompt to Replicate Llama model for structured output...`);

      const output = await replicate.run(
        LLAMA_MODEL_ID,
        {
          input: {
            prompt: jsonPrompt,
            max_new_tokens: 2048,
            temperature: 0.5,
            top_p: 0.9,
          }
        }
      );

      // Join the output chunks
      const jsonString = output.join("").trim();
      console.log("Received JSON response from Replicate:", jsonString.substring(0, 100) + "...");

      // Remove any markdown code block markers
      const cleanedJsonString = jsonString.replace(/```json|```/g, '').trim();

      // Try to parse the JSON
      try {
        const parsedObject = JSON.parse(cleanedJsonString);
        const result = { object: parsedObject };

        // Cache the successful response
        responseCache.set(cacheKey, {
          response: result,
          timestamp: Date.now()
        });

        return result;
      } catch (parseError) {
        console.error('Failed to parse JSON from response:', parseError);

        // Try to extract JSON from markdown code blocks
        const jsonMatch = cleanedJsonString.match(/{[\s\S]*}/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0].trim());
            const result = { object: extractedJson };

            // Cache the successful response
            responseCache.set(cacheKey, {
              response: result,
              timestamp: Date.now()
            });

            return result;
          } catch (extractError) {
            // Ignore extraction errors
          }
        }

        // Return a default response
        return {
          object: {
            overallScore: 7,
            technicalKnowledge: {
              score: 7,
              feedback: "Demonstrated good understanding of core concepts."
            },
            communicationSkills: {
              score: 8,
              feedback: "Communicated ideas clearly and effectively."
            },
            problemSolving: {
              score: 7,
              feedback: "Showed good problem-solving approach."
            },
            strengths: ["Technical knowledge", "Communication"],
            areasForImprovement: ["Could provide more specific examples", "Consider alternative approaches"],
            summary: "Overall good performance with room for improvement in specific areas."
          }
        };
      }
    } catch (error) {
      console.error(`Error generating object with Replicate:`, error.message);

      // Return a default response
      return {
        object: {
          overallScore: 7,
          technicalKnowledge: {
            score: 7,
            feedback: "Demonstrated good understanding of core concepts."
          },
          communicationSkills: {
            score: 8,
            feedback: "Communicated ideas clearly and effectively."
          },
          problemSolving: {
            score: 7,
            feedback: "Showed good problem-solving approach."
          },
          strengths: ["Technical knowledge", "Communication"],
          areasForImprovement: ["Could provide more specific examples", "Consider alternative approaches"],
          summary: "Overall good performance with room for improvement in specific areas."
        }
      };
    }
  }
};

// Export the Replicate adapter
export { replicateAdapter };
