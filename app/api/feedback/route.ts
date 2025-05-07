import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const interviewId = searchParams.get("interviewId");
  const userId = searchParams.get("userId");

  // Validate parameters
  if (!interviewId || !userId) {
    return NextResponse.json(
      { success: false, error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // For testing purposes, we'll create mock feedback
    const mockFeedback = {
      id: `mock-${interviewId}`,
      interviewId,
      userId,
      totalScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
      categoryScores: [
        {
          name: "Communication Skills",
          score: Math.floor(Math.random() * 30) + 60,
          comment:
            "Good communication skills overall. The candidate expressed ideas clearly and concisely.",
        },
        {
          name: "Technical Knowledge",
          score: Math.floor(Math.random() * 30) + 60,
          comment:
            "Demonstrated solid technical knowledge in the relevant areas. Good understanding of core concepts.",
        },
        {
          name: "Problem Solving",
          score: Math.floor(Math.random() * 30) + 60,
          comment:
            "Showed good problem-solving abilities and analytical thinking. Approached problems methodically.",
        },
        {
          name: "Cultural & Role Fit",
          score: Math.floor(Math.random() * 30) + 60,
          comment:
            "Appears to be a good fit for the role based on responses. Values align with company culture.",
        },
        {
          name: "Confidence & Clarity",
          score: Math.floor(Math.random() * 30) + 60,
          comment:
            "Presented ideas with confidence and clarity throughout the interview. Maintained good composure.",
        },
      ],
      strengths: [
        "Clear communication style",
        "Solid technical knowledge base",
        "Methodical problem-solving approach",
        "Good cultural fit potential",
        "Confident presentation of ideas",
      ],
      areasForImprovement: [
        "Could provide more specific examples from past experience",
        "Further depth in technical explanations would be beneficial",
        "Consider structuring responses using the STAR method",
        "More emphasis on quantifiable achievements would strengthen responses",
      ],
      finalAssessment:
        "The candidate performed well in the interview overall. They demonstrated good communication skills and technical knowledge. Their problem-solving approach was methodical and they presented ideas with confidence. Some areas for improvement include providing more specific examples from past experience and deepening technical explanations. Overall, the candidate shows good potential for the role.",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, feedback: mockFeedback });
  } catch (error) {
    console.error("Error generating mock feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
