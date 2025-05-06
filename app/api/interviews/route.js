import { NextResponse } from "next/server";

// Simplified version for Vercel deployment
export async function GET(request) {
  // Return mock interviews
  return NextResponse.json([
    {
      id: "mock-interview-1",
      userId: "mock-user-id",
      title: "Mock Technical Interview",
      type: "technical",
      techStack: ["React", "JavaScript", "CSS"],
      status: "completed",
      score: 85,
      feedback: "Great performance!",
      questions: [
        {
          id: "q1",
          question: "What is React?",
          answer: "A JavaScript library for building user interfaces.",
        },
        {
          id: "q2",
          question: "Explain CSS flexbox.",
          answer:
            "A layout model that allows elements to align and distribute space.",
        },
        {
          id: "q3",
          question: "What is a closure in JavaScript?",
          answer: "A function that has access to its outer function's scope.",
        },
      ],
      duration: 30,
      scheduledFor: new Date().toISOString(),
      completedAt: new Date().toISOString(),
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
      feedback: "Excellent communication skills!",
      questions: [
        {
          id: "q1",
          question: "Tell me about yourself.",
          answer: "I am a software developer with 5 years of experience...",
        },
        {
          id: "q2",
          question: "Describe a challenging project.",
          answer: "I worked on a project that required...",
        },
        {
          id: "q3",
          question: "How do you handle conflicts?",
          answer: "I believe in open communication and...",
        },
      ],
      duration: 45,
      scheduledFor: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
}

// POST /api/interviews - Create a new interview
export async function POST(request) {
  // Return a mock created interview
  return NextResponse.json(
    {
      id: "mock-interview-new",
      userId: "mock-user-id",
      title: "New Mock Interview",
      type: "technical",
      techStack: ["React", "JavaScript", "CSS"],
      status: "scheduled",
      score: null,
      feedback: "",
      questions: [],
      duration: 30,
      scheduledFor: new Date().toISOString(),
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
