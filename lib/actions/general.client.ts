"use client";

// Simplified version for Vercel deployment
// These functions will return mock data instead of making actual Firebase calls

// Get interviews by user ID (client-side version)
export const getInterviewsByUserId = async (userId: string) => {
  if (!userId) return [];

  try {
    // Return empty array for Vercel deployment
    return [];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
};

// Get interview by ID (client-side version)
export const getInterviewById = async (id: string) => {
  if (!id) return null;

  try {
    // Return null for Vercel deployment
    return null;
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
    // Return null for Vercel deployment
    return null;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
};
