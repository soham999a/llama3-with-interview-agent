"use client";

// Simplified version for Vercel deployment
// These functions will return mock data instead of making actual Firebase calls

// Get interviews by user ID (client-side version)
export const getInterviewsByUserId = async (userId: string) => {
  if (!userId) return [];

  try {
    // Return mock data for Vercel deployment
    return [
      {
        id: "interview-1",
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js"],
        createdAt: new Date().toISOString(),
        userId: userId,
        questions: [
          "Explain the difference between React state and props.",
          "How does Next.js handle server-side rendering?",
          "What are TypeScript generics and when would you use them?",
        ],
        completed: true,
      },
      {
        id: "interview-2",
        role: "Full Stack Developer",
        type: "Mixed",
        techstack: ["Node.js", "MongoDB", "Express", "React"],
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        userId: userId,
        questions: [
          "Describe the MERN stack architecture.",
          "How would you handle authentication in a full stack application?",
          "What are your strategies for debugging issues across the stack?",
        ],
        completed: true,
      },
      {
        id: "interview-3",
        role: "Data Scientist",
        type: "Technical",
        techstack: ["Python", "TensorFlow", "Pandas"],
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        userId: userId,
        questions: [
          "Explain the difference between supervised and unsupervised learning.",
          "How would you handle missing data in a dataset?",
          "Describe a project where you applied machine learning techniques.",
        ],
        completed: true,
      },
    ];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
};

// Get interview by ID (client-side version)
export const getInterviewById = async (id: string) => {
  if (!id) return null;

  try {
    // Return mock data based on the interview ID
    const mockInterviews = {
      "interview-1": {
        id: "interview-1",
        role: "Frontend Developer",
        type: "Technical",
        techstack: ["React", "TypeScript", "Next.js"],
        createdAt: new Date().toISOString(),
        userId: "mock-user-id",
        questions: [
          "Explain the difference between React state and props.",
          "How does Next.js handle server-side rendering?",
          "What are TypeScript generics and when would you use them?",
        ],
        completed: true,
      },
      "interview-2": {
        id: "interview-2",
        role: "Full Stack Developer",
        type: "Mixed",
        techstack: ["Node.js", "MongoDB", "Express", "React"],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        userId: "mock-user-id",
        questions: [
          "Describe the MERN stack architecture.",
          "How would you handle authentication in a full stack application?",
          "What are your strategies for debugging issues across the stack?",
        ],
        completed: true,
      },
      "interview-3": {
        id: "interview-3",
        role: "Data Scientist",
        type: "Technical",
        techstack: ["Python", "TensorFlow", "Pandas"],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        userId: "mock-user-id",
        questions: [
          "Explain the difference between supervised and unsupervised learning.",
          "How would you handle missing data in a dataset?",
          "Describe a project where you applied machine learning techniques.",
        ],
        completed: true,
      },
    };

    // Return the interview if it exists in our mock data, otherwise return a default one
    return mockInterviews[id] || mockInterviews["interview-1"];
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
};

// Get feedback by interview ID (client-side version)
export const getFeedbackByInterviewId = async ({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}) => {
  if (!interviewId || !userId) return null;

  try {
    // Return mock feedback data based on the interview ID
    const mockFeedback = {
      "interview-1": {
        id: "feedback-1",
        interviewId: "interview-1",
        userId: userId,
        createdAt: new Date().toISOString(),
        finalScore: 85,
        finalAssessment:
          "You demonstrated strong knowledge of React concepts and Next.js. Your explanations were clear and concise. Consider diving deeper into TypeScript generics for more advanced use cases.",
        strengths: [
          "Clear communication of complex concepts",
          "Strong understanding of React fundamentals",
          "Good knowledge of Next.js architecture",
        ],
        areasForImprovement: [
          "Deepen knowledge of TypeScript advanced features",
          "Provide more real-world examples in explanations",
        ],
        questionFeedback: [
          {
            question: "Explain the difference between React state and props.",
            answer:
              "State is internal and controlled by the component itself, while props are external and controlled by whatever renders the component.",
            feedback:
              "Excellent explanation with clear distinction between the two concepts.",
          },
        ],
      },
      "interview-2": {
        id: "feedback-2",
        interviewId: "interview-2",
        userId: userId,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        finalScore: 78,
        finalAssessment:
          "You showed good understanding of full stack development with the MERN stack. Your authentication knowledge is solid. Work on articulating debugging strategies more clearly.",
        strengths: [
          "Comprehensive knowledge of MERN stack",
          "Strong understanding of authentication principles",
          "Good problem-solving approach",
        ],
        areasForImprovement: [
          "More structured approach to debugging",
          "Deeper knowledge of MongoDB optimization",
        ],
        questionFeedback: [
          {
            question: "Describe the MERN stack architecture.",
            answer:
              "MERN stands for MongoDB, Express, React, and Node.js. It's a full-stack JavaScript solution that helps you build fast, robust, and maintainable web applications.",
            feedback:
              "Good overview of the stack components, but could elaborate more on how they interact.",
          },
        ],
      },
      "interview-3": null, // No feedback for this interview yet
    };

    // Return the feedback if it exists in our mock data
    return mockFeedback[interviewId] || null;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
};
