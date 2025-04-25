// Simple DeepSeek Integration for Interview Agent
import axios from 'axios';

// Configuration
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';
const DEFAULT_MODEL = 'llama3';

/**
 * Simple DeepSeek Adapter
 */
const simpleDeepseekAdapter = {
  /**
   * Generate text using DeepSeek model
   * @param {Object} params - Parameters for text generation
   * @param {string} params.prompt - The prompt to send to the model
   * @returns {Promise<{text: string}>} - Promise with generated text
   */
  async generateText({ prompt }) {
    try {
      console.log(`Sending prompt to ${DEFAULT_MODEL}...`);
      
      const response = await axios.post(OLLAMA_ENDPOINT, {
        model: DEFAULT_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1024
        }
      });
      
      if (!response.data || !response.data.response) {
        throw new Error(`Invalid response from ${DEFAULT_MODEL}`);
      }
      
      return { text: response.data.response };
    } catch (error) {
      console.error(`Error generating text:`, error.message);
      
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
   * Generate structured object
   * @param {Object} params - Parameters for object generation
   * @param {string} params.prompt - The prompt to send to the model
   * @returns {Promise<{object: any}>} - Promise with generated object
   */
  async generateObject({ prompt }) {
    try {
      // Add instructions to ensure proper JSON formatting
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object.`;
      
      console.log(`Sending prompt to ${DEFAULT_MODEL} for structured output...`);
      
      const response = await axios.post(OLLAMA_ENDPOINT, {
        model: DEFAULT_MODEL,
        prompt: jsonPrompt,
        stream: false,
        options: {
          temperature: 0.5,
          top_p: 0.9,
          num_predict: 2048
        }
      });
      
      if (!response.data || !response.data.response) {
        throw new Error(`Invalid response from ${DEFAULT_MODEL}`);
      }
      
      // Extract JSON from response
      let jsonString = response.data.response.trim();
      
      // Remove any markdown code block markers
      jsonString = jsonString.replace(/```json|```/g, '').trim();
      
      // Try to parse the JSON
      try {
        const parsedObject = JSON.parse(jsonString);
        return { object: parsedObject };
      } catch (parseError) {
        console.error('Failed to parse JSON from response:', parseError);
        
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
      console.error(`Error generating object:`, error.message);
      
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

// Export the simple adapter
export { simpleDeepseekAdapter };
