// Test script for Llama integration
// This script tests both question generation and feedback generation with Llama 3

const { llamaAdapter } = require('./lib/llama-adapter');
const fs = require('fs').promises;

// Test question generation
async function testQuestionGeneration() {
  try {
    console.log('=== Testing Question Generation with Llama 3 ===\n');
    
    const params = {
      type: 'technical',
      role: 'Frontend Developer',
      level: 'Mid-level',
      techstack: 'React, TypeScript, CSS',
      amount: 5
    };
    
    const prompt = `Prepare questions for a job interview.
      The job role is ${params.role}.
      The job experience level is ${params.level}.
      The tech stack used in the job is: ${params.techstack}.
      The focus between behavioural and technical questions should lean towards: ${params.type}.
      The amount of questions required is: ${params.amount}.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]
    `;
    
    console.log('Sending prompt to Llama 3...');
    const { text: questions } = await llamaAdapter.generateText({
      prompt: prompt
    });
    
    console.log('Raw response:', questions);
    
    // Parse the questions
    const parsedQuestions = JSON.parse(questions);
    
    console.log('\n✅ Successfully generated interview questions:');
    parsedQuestions.forEach((q, i) => {
      console.log(`${i + 1}. ${q}`);
    });
    
    return parsedQuestions;
  } catch (error) {
    console.error('❌ Error testing question generation:', error);
    return null;
  }
}

// Test feedback generation
async function testFeedbackGeneration() {
  try {
    console.log('\n=== Testing Feedback Generation with Llama 3 ===\n');
    
    // Sample transcript
    const transcript = [
      { role: "interviewer", content: "Can you explain how React's virtual DOM works?" },
      { role: "candidate", content: "React's virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new virtual DOM and compares it with the previous one. It then only updates the real DOM with the differences, which is more efficient than updating the entire DOM." },
      { role: "interviewer", content: "How would you optimize the performance of a React application?" },
      { role: "candidate", content: "I would use techniques like memoization with React.memo, useMemo, and useCallback to prevent unnecessary re-renders. I'd also implement code splitting with React.lazy and Suspense to reduce the initial bundle size. Additionally, I'd use proper key props in lists and avoid inline function definitions in render methods." },
      { role: "interviewer", content: "What's the difference between controlled and uncontrolled components in React?" },
      { role: "candidate", content: "Controlled components are those where React controls the state of the form elements. The form data is handled by React component state. Uncontrolled components are those where the form data is handled by the DOM itself. You use refs to get form values from the DOM instead of using event handlers." }
    ];
    
    // Format the transcript for the prompt
    const formattedTranscript = transcript
      .map(sentence => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");
    
    // Create the prompt for feedback generation
    const prompt = `
      You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 10 in the following areas. Do not add categories other than the ones provided:
      - Technical Knowledge: Understanding of key concepts for the role.
      - Communication Skills: Clarity, articulation, structured responses.
      - Problem-Solving: Ability to analyze problems and propose solutions.

      Return your analysis in the following JSON format:
      {
        "overallScore": number,
        "technicalKnowledge": {
          "score": number,
          "feedback": "string"
        },
        "communicationSkills": {
          "score": number,
          "feedback": "string"
        },
        "problemSolving": {
          "score": number,
          "feedback": "string"
        },
        "strengths": ["string", "string"],
        "areasForImprovement": ["string", "string"],
        "summary": "string"
      }
    `;
    
    console.log('Sending transcript to Llama 3...');
    const { object: feedback } = await llamaAdapter.generateObject({
      prompt: prompt
    });
    
    console.log('\n✅ Successfully generated interview feedback:');
    console.log(`Overall Score: ${feedback.overallScore}/10`);
    console.log(`Technical Knowledge: ${feedback.technicalKnowledge.score}/10`);
    console.log(`Communication Skills: ${feedback.communicationSkills.score}/10`);
    console.log(`Problem-Solving: ${feedback.problemSolving.score}/10`);
    
    console.log('\nStrengths:');
    feedback.strengths.forEach(s => console.log(`- ${s}`));
    
    console.log('\nAreas for Improvement:');
    feedback.areasForImprovement.forEach(a => console.log(`- ${a}`));
    
    console.log('\nSummary:', feedback.summary);
    
    // Save the feedback to a file
    await fs.writeFile(
      'llama3-results.json',
      JSON.stringify(feedback, null, 2)
    );
    
    return feedback;
  } catch (error) {
    console.error('❌ Error testing feedback generation:', error);
    return null;
  }
}

// Run the tests
async function runTests() {
  console.log('=== Llama 3 Integration Test ===\n');
  
  const questions = await testQuestionGeneration();
  const feedback = await testFeedbackGeneration();
  
  if (questions && feedback) {
    console.log('\n✅ All tests passed! Llama 3 integration is working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }
}

runTests();
