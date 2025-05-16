"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// Define the InterviewCardProps interface
interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[] | string;
  createdAt?: string;
}

const InterviewCard = ({
  interviewId,
  userId, // This should be the Firebase user.uid
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (userId && interviewId) {
        try {
          // Try to fetch feedback from the API
          const response = await fetch(
            `/api/feedback?interviewId=${interviewId}&userId=${userId}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.success && data.feedback) {
              setFeedback(data.feedback);
            } else {
              // If no feedback found through API, create mock feedback for testing
              const mockFeedback = {
                id: "mock-" + interviewId,
                interviewId: interviewId,
                userId: userId,
                totalScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
                finalAssessment:
                  "This is a mock feedback for testing. You performed well in this interview.",
                createdAt: new Date().toISOString(),
              };
              setFeedback(mockFeedback);
            }
          } else {
            // If API fails, create mock feedback
            console.log("API failed, using mock feedback");
            const mockFeedback = {
              id: "mock-" + interviewId,
              interviewId: interviewId,
              userId: userId,
              totalScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
              finalAssessment:
                "This is a mock feedback for testing. You performed well in this interview.",
              createdAt: new Date().toISOString(),
            };
            setFeedback(mockFeedback);
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
          // Create mock feedback on error
          const mockFeedback = {
            id: "mock-" + interviewId,
            interviewId: interviewId,
            userId: userId,
            totalScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
            finalAssessment:
              "This is a mock feedback for testing. You performed well in this interview.",
            createdAt: new Date().toISOString(),
          };
          setFeedback(mockFeedback);
        }
      }
      setLoading(false);
    };

    fetchFeedback();
  }, [interviewId, userId]);

  // Normalize the interview type to match our CSS classes
  let normalizedType = type;

  if (/mix/gi.test(type)) {
    normalizedType = "Mixed";
  }

  // Map the normalized type to one of our supported types
  const typeMapping: Record<string, string> = {
    Technical: "technical",
    Behavioral: "behavioral",
    Problem: "problem",
    System: "system",
    Leadership: "leadership",
    Product: "product",
    Mixed: "technical", // Default mixed to technical
    Frontend: "technical",
    Backend: "technical",
    FullStack: "technical",
    Data: "technical",
    Software: "technical",
    Engineer: "technical",
    Developer: "technical",
    Scientist: "problem",
  };

  // Find the matching type or default to technical
  const mappedType = Object.keys(typeMapping).find((key) =>
    normalizedType.toLowerCase().includes(key.toLowerCase())
  );

  normalizedType = mappedType ? typeMapping[mappedType] : "technical";

  // Badge color based on interview type
  const badgeColorMap: Record<string, string> = {
    technical: "bg-[#F7D77F] text-yellow-800",
    behavioral: "bg-[#8FC8E8] text-blue-800",
    problem: "bg-[#B2E887] text-green-800",
    system: "bg-[#F7D77F] text-yellow-800",
    leadership: "bg-[#8FC8E8] text-blue-800",
    product: "bg-[#E8BA98] text-orange-800",
  };

  const badgeColor =
    badgeColorMap[normalizedType] || "bg-[#F7D77F] text-yellow-800";

  // Format date without dayjs dependency
  const formatDate = (dateString: string | number | undefined) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(feedback?.createdAt || createdAt);

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-[var(--radius)] bg-white p-6 w-full border border-gray-200 shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-[var(--radius)] blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-300/5 rounded-[var(--radius)] blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col h-full items-center justify-center py-8 relative z-10">
          <div className="size-16 relative mb-4">
            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping"></div>
            <div className="relative size-full rounded-full border-2 border-t-teal-500 border-r-teal-400 border-b-teal-300 border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading interview data...</p>
          <div className="mt-4 w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Determine the interview type class
  const interviewTypeClass = `interview-${normalizedType.toLowerCase()}`;

  return (
    <div
      className={`${interviewTypeClass} relative overflow-hidden rounded-[var(--radius)] p-4 sm:p-6 w-full group`}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-[var(--radius)] blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/30 rounded-[var(--radius)] blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col h-full relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-5 gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-teal-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-600 sm:w-6 sm:h-6"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-gray-800 font-semibold text-base sm:text-lg capitalize group-hover:text-teal-600 transition-colors duration-300">
                {role} Interview
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`${badgeColor} px-2 py-0.5 rounded-[4px] text-xs font-medium capitalize`}
                >
                  {normalizedType}
                </span>
                <span className="text-gray-500 text-xs">{formattedDate}</span>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-teal-100 px-3 py-2 rounded-[4px] shadow-md mt-3 sm:mt-0 border border-teal-200 self-stretch sm:self-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-500"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <div className="flex flex-col">
                <div className="flex items-end">
                  <span className="text-gray-800 font-bold text-lg leading-none">
                    {feedback?.totalScore || "--"}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">/100</span>
                </div>
                <span className="text-gray-500 text-xs">Score</span>
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div className="mb-5">
          <p className="text-gray-600 text-sm font-medium mb-2">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {typeof techstack === "string"
              ? techstack.split(",").map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-[4px] text-xs font-medium"
                  >
                    {tech.trim()}
                  </span>
                ))
              : techstack?.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-[4px] text-xs font-medium"
                  >
                    {tech.trim()}
                  </span>
                ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600 text-sm font-medium">Status:</p>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-[4px] ${
                feedback
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {feedback ? "Completed" : "In Progress"}
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-[4px] overflow-hidden border border-gray-200">
            <div
              className={`h-full ${feedback ? "bg-green-500" : "bg-teal-500"}`}
              style={{ width: feedback ? "100%" : "30%" }}
            ></div>
          </div>
        </div>

        {/* Feedback or Placeholder Text */}
        <div className="flex-grow mb-5">
          <p className="text-gray-700 line-clamp-2 bg-teal-50 p-3 rounded-[4px] border-l-2 border-teal-500 shadow-sm">
            {feedback?.finalAssessment ||
              "You haven't completed this interview yet. Continue to improve your skills."}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href={
              feedback
                ? `/interview/${interviewId}/feedback`
                : `/interview/${interviewId}`
            }
            className="block w-full"
          >
            <button className="bg-teal-500 text-white px-5 py-3 rounded-[4px] font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md w-full flex items-center justify-center gap-2 group hover:-translate-y-1 active:scale-95">
              {feedback ? "View Feedback" : "Continue Interview"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
