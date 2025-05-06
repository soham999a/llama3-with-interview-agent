import { NextResponse } from 'next/server';

// This is a unified mock data API that handles all redirected routes
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  switch (type) {
    case 'feedback':
      return NextResponse.json({
        id: "mock-feedback-id",
        interviewId: id,
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

    case 'interview':
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
          { id: "q1", question: "What is React?", answer: "A JavaScript library for building user interfaces." },
          { id: "q2", question: "Explain CSS flexbox.", answer: "A layout model that allows elements to align and distribute space." },
          { id: "q3", question: "What is a closure in JavaScript?", answer: "A function that has access to its outer function's scope." }
        ],
        duration: 30,
        scheduledFor: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    case 'interviews':
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
            { id: "q1", question: "What is React?", answer: "A JavaScript library for building user interfaces." },
            { id: "q2", question: "Explain CSS flexbox.", answer: "A layout model that allows elements to align and distribute space." },
            { id: "q3", question: "What is a closure in JavaScript?", answer: "A function that has access to its outer function's scope." }
          ],
          duration: 30,
          scheduledFor: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
            { id: "q1", question: "Tell me about yourself.", answer: "I am a software developer with 5 years of experience..." },
            { id: "q2", question: "Describe a challenging project.", answer: "I worked on a project that required..." },
            { id: "q3", question: "How do you handle conflicts?", answer: "I believe in open communication and..." }
          ],
          duration: 45,
          scheduledFor: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);

    case 'user-stats':
      return NextResponse.json({
        totalInterviews: 10,
        byStatus: {
          completed: 7,
          scheduled: 2,
          'in-progress': 1
        },
        byType: {
          technical: 5,
          behavioral: 3,
          'problem-solving': 2
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
            updatedAt: new Date().toISOString()
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
            updatedAt: new Date().toISOString()
          }
        ]
      });

    default:
      return NextResponse.json({ message: "Mock data API is working!" });
  }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  switch (type) {
    case 'feedback':
      return NextResponse.json(
        {
          id: "mock-feedback-id",
          interviewId: id,
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
        },
        { status: 201 }
      );

    case 'interview':
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
          { id: "q1", question: "What is React?", answer: "A JavaScript library for building user interfaces." },
          { id: "q2", question: "Explain CSS flexbox.", answer: "A layout model that allows elements to align and distribute space." },
          { id: "q3", question: "What is a closure in JavaScript?", answer: "A function that has access to its outer function's scope." }
        ],
        duration: 30,
        scheduledFor: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    case 'interviews':
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
          updatedAt: new Date().toISOString()
        },
        { status: 201 }
      );

    default:
      return NextResponse.json({ message: "Mock data API POST endpoint is working!" });
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  switch (type) {
    case 'feedback':
      return NextResponse.json({
        id: "mock-feedback-id",
        interviewId: id,
        userId: "mock-user-id",
        overallScore: 90, // Updated score
        technicalScore: 85,
        communicationScore: 95,
        problemSolvingScore: 90,
        summary: "This is an updated mock feedback summary for Vercel deployment.",
        strengths: ["Excellent communication", "Strong technical skills"],
        areasForImprovement: ["Minor improvements in problem-solving approach"],
        detailedFeedback: "This is an updated detailed mock feedback for Vercel deployment.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    case 'interview':
      return NextResponse.json({
        id: id,
        userId: "mock-user-id",
        title: "Updated Mock Interview",
        type: "technical",
        techStack: ["React", "JavaScript", "CSS"],
        status: "completed",
        score: 95, // Updated score
        feedback: "Outstanding performance!",
        questions: [
          { id: "q1", question: "What is React?", answer: "A JavaScript library for building user interfaces." },
          { id: "q2", question: "Explain CSS flexbox.", answer: "A layout model that allows elements to align and distribute space." },
          { id: "q3", question: "What is a closure in JavaScript?", answer: "A function that has access to its outer function's scope." }
        ],
        duration: 30,
        scheduledFor: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

    default:
      return NextResponse.json({ message: "Mock data API PUT endpoint is working!" });
  }
}

export async function DELETE(request) {
  return NextResponse.json({ success: true });
}
