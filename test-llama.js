// Test script for Llama integration
const { llamaAdapter } = require('./lib/llama-adapter');

async function testQuestionGeneration() {
  try {
    console.log('Testing question generation with Llama...');
    
    const { text: questions } = await llamaAdapter.generateText({
      prompt: `Prepare questions for a job interview.
        The job role is Frontend Developer.
        The job experience level is Mid-level.
        The tech stack used in the job is: React, TypeScript, CSS.
        The focus between behavioural and technical questions should lean towards: technical.
        The amount of questions required is: 3.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
      `,
    });
    
    console.log('Raw Llama response:', questions);
    
    try {
      const parsedQuestions = JSON.parse(questions);
      console.log('Parsed questions:', parsedQuestions);
    } catch (error) {
      console.error('Failed to parse questions as JSON:', error);
      console.log('This is expected if the response is not in proper JSON format');
    }
    
    console.log('\nQuestion generation test completed successfully!');
  } catch (error) {
    console.error('Error in question generation test:', error);
  }
}

async function testFeedbackGeneration() {
  try {
    console.log('\nTesting feedback generation with Llama...');
    
    const transcript = [
      { role: "interviewer", content: "Can you explain how React's virtual DOM works?" },
      { role: "candidate", content: "React's virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new virtual DOM and compares it with the previous one. It then only updates the real DOM with the differences, which is more efficient than updating the entire DOM." },
      { role: "interviewer", content: "How would you optimize the performance of a React application?" },
      { role: "candidate", content: "I would use techniques like memoization with React.memo, useMemo, and useCallback to prevent unnecessary re-renders. I'd also implement code splitting with React.lazy and Suspense to reduce the initial bundle size. Additionally, I'd use proper key props in lists and avoid inline function definitions in render methods." }
    ];
    
    const formattedTranscript = transcript
      .map(sentence => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");
    
    const { object: feedback } = await llamaAdapter.generateObject({
      prompt: `
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
      `
    });
    
    console.log('Feedback generated:', JSON.stringify(feedback, null, 2));
    console.log('\nFeedback generation test completed successfully!');
  } catch (error) {
    console.error('Error in feedback generation test:', error);
  }
}

async function runTests() {
  console.log('=== Testing Llama Integration ===\n');
  
  await testQuestionGeneration();
  await testFeedbackGeneration();
  
  console.log('\n=== All tests completed ===');
}

runTests();
