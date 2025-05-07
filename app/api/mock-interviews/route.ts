import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const count = searchParams.get("count") ? parseInt(searchParams.get("count")!) : 5;

  // Validate parameters
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // Generate mock interviews
    const mockInterviews = generateMockInterviews(userId, count);
    
    return NextResponse.json({ 
      success: true, 
      interviews: mockInterviews,
      message: `Generated ${mockInterviews.length} mock interviews for testing`
    });
  } catch (error) {
    console.error("Error generating mock interviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate mock interviews" },
      { status: 500 }
    );
  }
}

function generateMockInterviews(userId: string, count: number) {
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Engineer",
    "DevOps Engineer",
    "Data Scientist",
    "UI/UX Designer",
    "Product Manager",
    "Software Engineer",
  ];

  const types = ["technical", "behavioral", "problem-solving"];

  const techStacks = [
    ["React", "JavaScript", "TypeScript", "CSS"],
    ["Node.js", "Express", "MongoDB", "REST API"],
    ["Python", "Django", "PostgreSQL", "Docker"],
    ["Java", "Spring Boot", "MySQL", "Kubernetes"],
    ["Angular", "RxJS", "Firebase", "SCSS"],
    ["Vue.js", "Vuex", "GraphQL", "Tailwind CSS"],
    ["React Native", "Redux", "Jest", "TypeScript"],
    ["PHP", "Laravel", "MySQL", "Redis"],
  ];

  const mockInterviews = [];

  // Generate interviews with dates spread over the last 30 days
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const roleIndex = Math.floor(Math.random() * roles.length);
    const typeIndex = Math.floor(Math.random() * types.length);
    const techStackIndex = Math.floor(Math.random() * techStacks.length);

    mockInterviews.push({
      id: uuidv4(),
      userId: userId,
      role: roles[roleIndex],
      type: types[typeIndex],
      techstack: techStacks[techStackIndex],
      createdAt: date.toISOString(),
      finalized: true,
    });
  }

  // Sort by date (newest first)
  return mockInterviews.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
