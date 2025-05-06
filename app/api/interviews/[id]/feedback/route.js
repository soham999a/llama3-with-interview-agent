import { NextResponse } from "next/server";

// Simplified version for Vercel deployment
export async function GET(request, { params }) {
  return NextResponse.json({
    id: "mock-feedback-id",
    interviewId: params.id,
    userId: "mock-user-id",
    overallScore: 85,
    technicalScore: 80,
    communicationScore: 90,
    problemSolvingScore: 85,
    summary: "This is a mock feedback summary for Vercel deployment.",
    strengths: ["Good communication", "Strong technical skills"],
    areasForImprovement: ["Could improve problem-solving approach"],
    detailedFeedback: "This is a detailed mock feedback for Vercel deployment.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function POST(request, { params }) {
  return NextResponse.json(
    {
      id: "mock-feedback-id",
      interviewId: params.id,
      userId: "mock-user-id",
      overallScore: 85,
      technicalScore: 80,
      communicationScore: 90,
      problemSolvingScore: 85,
      summary: "This is a mock feedback summary for Vercel deployment.",
      strengths: ["Good communication", "Strong technical skills"],
      areasForImprovement: ["Could improve problem-solving approach"],
      detailedFeedback:
        "This is a detailed mock feedback for Vercel deployment.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}

export async function PUT(request, { params }) {
  return NextResponse.json({
    id: "mock-feedback-id",
    interviewId: params.id,
    userId: "mock-user-id",
    overallScore: 90, // Updated score
    technicalScore: 85,
    communicationScore: 95,
    problemSolvingScore: 90,
    summary: "This is an updated mock feedback summary for Vercel deployment.",
    strengths: ["Excellent communication", "Strong technical skills"],
    areasForImprovement: ["Minor improvements in problem-solving approach"],
    detailedFeedback:
      "This is an updated detailed mock feedback for Vercel deployment.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
