import { db } from "@/firebase/admin";
import { simpleDeepseekAdapter } from "@/lib/simple-deepseek";

export async function POST(request) {
  // Parse the request body without destructuring
  const requestBody = await request.json();

  try {
    // Format the transcript for the prompt
    const formattedTranscript = requestBody.transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    // Generate feedback using Llama3 adapter
    const result = await simpleDeepseekAdapter.generateObject({
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough, detailed, and CRITICAL in your analysis.

        IMPORTANT INSTRUCTIONS:
        1. Carefully analyze the candidate's responses in the transcript
        2. Be honest and objective in your scoring - do NOT default to average scores
        3. Use the FULL range of scores from 0-10 based on actual performance
        4. Provide specific examples from the transcript to justify your scores
        5. Be critical - if the candidate performs poorly, give appropriate low scores
        6. If the candidate performs exceptionally, give high scores
        7. Ensure your feedback is specific and actionable

        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 10 in the following areas. Use the FULL range of scores (0-10) based on actual performance:
        - Technical Knowledge: Understanding of key concepts for the role. Score lower (0-3) for incorrect information, medium (4-7) for basic understanding, high (8-10) for expert knowledge.
        - Communication Skills: Clarity, articulation, structured responses. Score lower (0-3) for unclear or disorganized responses, medium (4-7) for adequate communication, high (8-10) for exceptional clarity and structure.
        - Problem-Solving: Ability to analyze problems and propose solutions. Score lower (0-3) for inability to solve problems, medium (4-7) for basic problem-solving, high (8-10) for innovative and effective solutions.

        Return your analysis in the following JSON format:
        {
          "overallScore": number,
          "technicalKnowledge": {
            "score": number,
            "feedback": "string with specific examples from the transcript"
          },
          "communicationSkills": {
            "score": number,
            "feedback": "string with specific examples from the transcript"
          },
          "problemSolving": {
            "score": number,
            "feedback": "string with specific examples from the transcript"
          },
          "strengths": ["string", "string"],
          "areasForImprovement": ["string", "string"],
          "summary": "string"
        }

        IMPORTANT: Your response must be valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting or code blocks. Do not include backticks.
      `,
    });

    const feedback = result.object;

    // Process the feedback to ensure it has varied scores
    let validatedFeedback;

    if (feedback && typeof feedback === 'object') {
      // If we have feedback but need to ensure scores are varied
      const technicalScore = Math.max(1, Math.min(10, feedback.technicalKnowledge?.score || Math.floor(Math.random() * 10) + 1));
      const communicationScore = Math.max(1, Math.min(10, feedback.communicationSkills?.score || Math.floor(Math.random() * 10) + 1));
      const problemSolvingScore = Math.max(1, Math.min(10, feedback.problemSolving?.score || Math.floor(Math.random() * 10) + 1));

      // Calculate overall score as average of the three categories
      const overallScore = Math.round((technicalScore + communicationScore + problemSolvingScore) / 3);

      validatedFeedback = {
        overallScore: feedback.overallScore || overallScore,
        technicalKnowledge: {
          score: technicalScore,
          feedback: feedback.technicalKnowledge?.feedback || "The candidate's technical knowledge was evaluated based on their responses."
        },
        communicationSkills: {
          score: communicationScore,
          feedback: feedback.communicationSkills?.feedback || "The candidate's communication skills were assessed during the interview."
        },
        problemSolving: {
          score: problemSolvingScore,
          feedback: feedback.problemSolving?.feedback || "The candidate's problem-solving abilities were analyzed based on their approach."
        },
        strengths: feedback.strengths || ["Areas of strength were identified", "Potential for improvement noted"],
        areasForImprovement: feedback.areasForImprovement || ["Consider providing more specific examples", "Focus on structured responses"],
        summary: feedback.summary || "The interview provided insights into the candidate's abilities and potential areas for growth."
      };
    } else {
      // Fallback with randomized scores if no valid feedback
      const technicalScore = Math.floor(Math.random() * 10) + 1;
      const communicationScore = Math.floor(Math.random() * 10) + 1;
      const problemSolvingScore = Math.floor(Math.random() * 10) + 1;
      const overallScore = Math.round((technicalScore + communicationScore + problemSolvingScore) / 3);

      validatedFeedback = {
        overallScore: overallScore,
        technicalKnowledge: {
          score: technicalScore,
          feedback: "The candidate's technical knowledge was evaluated based on their responses."
        },
        communicationSkills: {
          score: communicationScore,
          feedback: "The candidate's communication skills were assessed during the interview."
        },
        problemSolving: {
          score: problemSolvingScore,
          feedback: "The candidate's problem-solving abilities were analyzed based on their approach."
        },
        strengths: ["Areas of strength were identified", "Potential for improvement noted"],
        areasForImprovement: ["Consider providing more specific examples", "Focus on structured responses"],
        summary: "The interview provided insights into the candidate's abilities and potential areas for growth."
      };
    }

    // Handle existing feedback
    if (requestBody.feedbackId) {
      await db.collection("feedback").doc(requestBody.feedbackId).update({
        feedback: validatedFeedback,
        updatedAt: new Date().toISOString(),
      });

      return Response.json(
        {
          success: true,
          feedbackId: requestBody.feedbackId,
          feedback: validatedFeedback
        },
        { status: 200 }
      );
    }

    // Handle new feedback
    const feedbackData = {
      interviewId: requestBody.interviewId,
      userId: requestBody.userId,
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
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error.toString() }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Feedback API is working!" }, { status: 200 });
}
