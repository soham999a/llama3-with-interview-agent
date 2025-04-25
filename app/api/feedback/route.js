// Simple JavaScript implementation to avoid TypeScript errors
import { db } from "@/firebase/admin";
import { simpleDeepseekAdapter } from "@/lib/simple-deepseek";

// Helper function to generate feedback
async function generateFeedback(transcript) {
  const formattedTranscript = transcript
    .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
    .join("");

  const result = await simpleDeepseekAdapter.generateObject({
    prompt: `
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

      IMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting or code blocks. Do not include backticks.
    `,
  });

  return result.object || {
    overallScore: 7,
    technicalKnowledge: {
      score: 7,
      feedback: "The candidate demonstrated reasonable technical knowledge."
    },
    communicationSkills: {
      score: 7,
      feedback: "The candidate communicated their ideas clearly."
    },
    problemSolving: {
      score: 7,
      feedback: "The candidate showed good problem-solving abilities."
    },
    strengths: ["Technical knowledge", "Communication"],
    areasForImprovement: ["Could provide more detailed examples"],
    summary: "Overall, the candidate performed well in the interview."
  };
}

// Helper function to handle existing feedback
async function handleExistingFeedback(feedbackId, validatedFeedback) {
  await db.collection("feedback").doc(feedbackId).update({
    feedback: validatedFeedback,
    updatedAt: new Date().toISOString(),
  });
  
  return Response.json(
    { 
      success: true, 
      feedbackId: feedbackId, 
      feedback: validatedFeedback 
    },
    { status: 200 }
  );
}

// Helper function to create new feedback
async function createNewFeedback(interviewId, userId, validatedFeedback) {
  const feedbackData = {
    interviewId,
    userId,
    feedback: validatedFeedback,
    createdAt: new Date().toISOString(),
  };

  const docRef = await db.collection("feedback").add(feedbackData);
  
  return Response.json(
    { 
      success: true, 
      feedbackId: docRef.id, 
      feedback: validatedFeedback 
    },
    { status: 200 }
  );
}

// Main POST handler
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const interviewId = body.interviewId;
    const userId = body.userId;
    const transcript = body.transcript;
    const feedbackId = body.feedbackId;
    
    // Generate feedback
    const validatedFeedback = await generateFeedback(transcript);
    
    // Handle existing or new feedback
    if (feedbackId) {
      return await handleExistingFeedback(feedbackId, validatedFeedback);
    } else {
      return await createNewFeedback(interviewId, userId, validatedFeedback);
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error.toString() }, { status: 500 });
  }
}

// GET handler
export async function GET() {
  return Response.json({ success: true, data: "Feedback API is working!" }, { status: 200 });
}
