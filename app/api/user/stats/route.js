import { NextResponse } from "next/server";

// Simplified version for Vercel deployment
export async function GET(request) {
  // Return mock user statistics
  return NextResponse.json({
    totalInterviews: 10,
    byStatus: {
      completed: 7,
      scheduled: 2,
      "in-progress": 1,
    },
    byType: {
      technical: 5,
      behavioral: 3,
      "problem-solving": 2,
    },
    averageScore: 87.5,
    recentInterviews: [
      {
        id: "mock-interview-1",
        userId: "mock-user-id",
        title: "Mock Technical Interview",
        type: "technical",
        techStack: ["React", "JavaScript", "CSS"],
        status: "completed",
        score: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "mock-interview-2",
        userId: "mock-user-id",
        title: "Mock Behavioral Interview",
        type: "behavioral",
        techStack: [],
        status: "completed",
        score: 90,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  });
}
