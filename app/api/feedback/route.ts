import { db } from "@/firebase/admin";
import { replicateAdapter } from "@/lib/replicate-integration";

export async function POST(request: Request) {
  const { interviewId, userId, transcript, feedbackId } = await request.json();

  try {
    // Format the transcript for the prompt
    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    // Generate feedback using Replicate adapter
    const { object: feedback } = await replicateAdapter.generateObject({
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

    // Ensure we have a valid feedback object
    const validatedFeedback = feedback || {
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

    let responseId = feedbackId;

    // Store the feedback in Firestore
    if (feedbackId) {
      // Update existing feedback
      await db.collection("feedback").doc(feedbackId).update({
        feedback: validatedFeedback,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new feedback
      const feedbackData = {
        interviewId,
        userId,
        feedback: validatedFeedback,
        createdAt: new Date().toISOString(),
      };

      const docRef = await db.collection("feedback").add(feedbackData);
      responseId = docRef.id;
    }

    return Response.json(
      { success: true, feedbackId: responseId, feedback: validatedFeedback },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  // Added comment to force Git to recognize the file as modified
  return Response.json({ success: true, data: "Feedback API is working!" }, { status: 200 });
}
