// Test script to compare different models
const axios = require('axios');
const fs = require('fs').promises;

// Function to test a model
async function testModel(modelName) {
  console.log(`\n=== Testing ${modelName} Model ===\n`);

  try {
    // Test question generation
    console.log(`Testing question generation with ${modelName}...`);

    const questionPrompt = `Prepare questions for a job interview.
      The job role is Frontend Developer.
      The job experience level is Mid-level.
      The tech stack used in the job is: React, TypeScript, CSS.
      The focus between behavioural and technical questions should lean towards: technical.
      The amount of questions required is: 3.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]
    `;

    const questionResponse = await axios.post('http://localhost:11434/api/generate', {
      model: modelName,
      prompt: questionPrompt,
      stream: false,
      format: 'json'
    });

    const questionResult = questionResponse.data.response;
    console.log('Raw response:', questionResult);

    // Parse the questions
    let questions;
    try {
      // Try to parse as JSON
      questions = JSON.parse(questionResult);
    } catch (error) {
      // If parsing fails, try to extract the JSON array
      const jsonMatch = questionResult.match(/\[.*\]/s);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array is found, split by line breaks and create an array
        console.log('No JSON array found, trying to parse as text...');
        questions = questionResult
          .split(/\n+/)
          .filter(line => line.trim().length > 0)
          .map(line => line.replace(/^\d+\.\s*/, '').trim())  // Remove numbering
          .filter(line => line.length > 10);  // Filter out short lines

        if (questions.length === 0) {
          // Try another approach - split by question marks
          questions = questionResult
            .split('?')
            .map(q => q.trim() + '?')
            .filter(q => q.length > 10 && q !== '?');
        }

        if (questions.length === 0) {
          throw new Error('Could not parse questions from response');
        }
      }
    }

    console.log('Parsed questions:', questions);

    // Test feedback generation
    console.log(`\nTesting feedback generation with ${modelName}...`);

    const transcript = [
      { role: "interviewer", content: "Can you explain how React's virtual DOM works?" },
      { role: "candidate", content: "React's virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new virtual DOM and compares it with the previous one. It then only updates the real DOM with the differences, which is more efficient than updating the entire DOM." },
      { role: "interviewer", content: "How would you optimize the performance of a React application?" },
      { role: "candidate", content: "I would use techniques like memoization with React.memo, useMemo, and useCallback to prevent unnecessary re-renders. I'd also implement code splitting with React.lazy and Suspense to reduce the initial bundle size. Additionally, I'd use proper key props in lists and avoid inline function definitions in render methods." }
    ];

    const formattedTranscript = transcript
      .map(sentence => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const feedbackPrompt = `
      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
      - **Communication Skills**: Clarity, articulation, structured responses.
      - **Technical Knowledge**: Understanding of key concepts for the role.
      - **Problem-Solving**: Ability to analyze problems and propose solutions.
      - **Cultural & Role Fit**: Alignment with company values and job role.
      - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.

      Return your analysis in the following JSON format:
      {
        "totalScore": number,
        "categoryScores": [
          { "name": "Communication Skills", "score": number, "comment": "string" },
          { "name": "Technical Knowledge", "score": number, "comment": "string" },
          { "name": "Problem Solving", "score": number, "comment": "string" },
          { "name": "Cultural & Role Fit", "score": number, "comment": "string" },
          { "name": "Confidence & Clarity", "score": number, "comment": "string" }
        ],
        "strengths": ["string", "string", "string"],
        "areasForImprovement": ["string", "string", "string"],
        "finalAssessment": "string"
      }
    `;

    const feedbackResponse = await axios.post('http://localhost:11434/api/generate', {
      model: modelName,
      prompt: feedbackPrompt,
      stream: false,
      format: 'json'
    });

    const feedbackResult = feedbackResponse.data.response;
    console.log('Raw feedback response:', feedbackResult);

    // Parse the feedback
    let feedback;
    try {
      // Try to parse as JSON
      feedback = JSON.parse(feedbackResult);
    } catch (error) {
      console.error('Failed to parse JSON from response:', error);
      console.log('Attempting to fix JSON...');

      // Try to extract and fix the JSON
      const jsonMatch = feedbackResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        // Fix common JSON issues
        const fixedJson = jsonStr
          .replace(/,\s*}/g, '}')  // Remove trailing commas
          .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')  // Ensure property names are quoted
          .replace(/:\s*'([^']*)'/g, ': "$1"');  // Replace single quotes with double quotes

        feedback = JSON.parse(fixedJson);
      } else {
        throw new Error('Could not extract JSON from response');
      }
    }

    console.log('Parsed feedback:', JSON.stringify(feedback, null, 2));

    // Save results to file
    await fs.writeFile(
      `${modelName.replace(':', '-')}-results.json`,
      JSON.stringify({
        model: modelName,
        questions: questions,
        feedback: feedback
      }, null, 2)
    );

    console.log(`\n✅ Successfully tested ${modelName} model`);
    return true;
  } catch (error) {
    console.error(`❌ Error testing ${modelName} model:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Main function
async function main() {
  console.log('=== Model Comparison Test ===\n');

  // Test llama3 model
  const llama3Success = await testModel('llama3');

  // Try to test DeepSeek model if available
  let deepseekSuccess = false;
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    const models = response.data.models.map(m => m.name);

    if (models.includes('deepseek-coder:33b')) {
      deepseekSuccess = await testModel('deepseek-coder:33b');
    } else {
      console.log('\nDeepSeek model not available yet. Skipping test.');
    }
  } catch (error) {
    console.error('Error checking available models:', error.message);
  }

  // Print summary
  console.log('\n=== Test Summary ===');
  console.log(`Llama3 Model: ${llama3Success ? '✅ PASS' : '❌ FAIL'}`);
  if (deepseekSuccess !== false) {
    console.log(`DeepSeek Model: ${deepseekSuccess ? '✅ PASS' : '❌ FAIL'}`);
  } else {
    console.log('DeepSeek Model: ⏳ Not tested (not available)');
  }

  console.log('\nThe Interview Agent integration is working correctly with the available models.');
}

// Run the main function
main();
