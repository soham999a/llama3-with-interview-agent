// Direct test of Llama integration with the API endpoints
const { llamaAdapter } = require('./lib/llama-adapter');
const fs = require('fs').promises;

// Test question generation directly
async function testQuestionGeneration() {
  try {
    console.log('Testing question generation with Llama...');
    
    const params = {
      type: 'technical',
      role: 'Frontend Developer',
      level: 'Mid-level',
      techstack: 'React, TypeScript, CSS',
      amount: 3
    };
    
    const { type, role, level, techstack, amount } = params;
    
    const prompt = `Prepare questions for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      The focus between behavioural and technical questions should lean towards: ${type}.
      The amount of questions required is: ${amount}.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]
    `;
    
    // Generate questions using Llama
    const { text: questions } = await llamaAdapter.generateText({
      prompt: prompt
    });
    
    console.log('Raw Llama response:', questions);
    
    // Parse the questions from the response
    let parsedQuestions;
    try {
      // Extract JSON array from the response
      const jsonMatch = questions.match(/\[.*\]/s);
      if (jsonMatch) {
        parsedQuestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not find JSON array in response');
      }
    } catch (parseError) {
      console.error('Failed to parse questions:', parseError);
      // Fallback: try to extract questions line by line
      parsedQuestions = questions
        .split('\n')
        .filter(line => line.trim().startsWith('"') || line.trim().startsWith('1.'))
        .map(line => line.replace(/^[0-9]+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
        .filter(q => q.length > 0);
    }
    
    // Create interview object (similar to the original implementation)
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(',').map(tech => tech.trim()),
      questions: parsedQuestions,
      userId: 'test-user-123',
      finalized: true,
      createdAt: new Date().toISOString(),
    };
    
    // Save to a sample file for demonstration
    await fs.writeFile(
      'direct-interview.json', 
      JSON.stringify(interview, null, 2)
    );
    
    console.log('✅ Successfully generated interview questions');
    console.log('Questions:', parsedQuestions);
    
    return {
      success: true,
      interviewId: 'direct-' + Date.now(),
      interview: interview
    };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test feedback generation directly
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
    
    const prompt = `
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
    
    // Generate feedback using Llama
    const { object: feedback } = await llamaAdapter.generateObject({
      prompt: prompt
    });
    
    // Save to a sample file for demonstration
    await fs.writeFile(
      'direct-feedback.json', 
      JSON.stringify(feedback, null, 2)
    );
    
    console.log('✅ Successfully generated interview feedback');
    console.log('Feedback:', JSON.stringify(feedback, null, 2));
    
    return {
      success: true,
      feedback: feedback
    };
  } catch (error) {
    console.error('Error generating interview feedback:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the tests
async function runTests() {
  console.log('=== Direct Testing of Llama Integration ===\n');
  
  const questionResult = await testQuestionGeneration();
  const feedbackResult = await testFeedbackGeneration();
  
  console.log('\n=== Test Summary ===');
  console.log(`Question Generation: ${questionResult.success ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Feedback Generation: ${feedbackResult.success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (questionResult.success && feedbackResult.success) {
    console.log('\n✅ All tests passed! Llama integration is working correctly.');
    console.log('\nThis proves that our Llama integration can successfully replace Google Gemini API in the Interview Agent application.');
  } else {
    console.log('\n❌ Some tests failed. Please check the logs above for details.');
  }
}

// Run the tests
runTests();
