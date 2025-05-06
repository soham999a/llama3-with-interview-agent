import { NextResponse } from "next/server";

// Simplified version for Vercel deployment
export async function GET(request, { params }) {
  const { id } = params;

  return NextResponse.json({
    id: id,
    userId: "mock-user-id",
    title: "Mock Interview",
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
  });
}

export async function PUT(request, { params }) {
  const { id } = params;

  return NextResponse.json({
    id: id,
    userId: "mock-user-id",
    title: "Updated Mock Interview",
    type: "technical",
    techStack: ["React", "JavaScript", "CSS"],
    status: "completed",
    score: 90,
    feedback: "Excellent performance!",
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
  });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ success: true });
}
