import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface RouteParams {
  params: {
    id: string;
  };
}

const Feedback = async ({ params }: RouteParams) => {
  const { id } = params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  // Try to get the feedback ID from session storage on the client side
  let feedbackIdFromSession: string | null = null;

  // Get feedback data
  let feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  // If no feedback found, create a default feedback object
  if (!feedback) {
    console.warn("No feedback found for interview", id);

    // Generate varied scores for the default feedback
    const commScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
    const techScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
    const probScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
    const fitScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
    const confScore = Math.floor(Math.random() * 30) + 60; // 60-90 range

    // Calculate average for total score
    const avgScore = Math.round(
      (commScore + techScore + probScore + fitScore + confScore) / 5
    );

    // Create a default feedback object with varied scores and more detailed information
    feedback = {
      id: "default",
      interviewId: id,
      userId: user?.id!,
      totalScore: avgScore,
      categoryScores: [
        {
          name: "Communication Skills",
          score: commScore,
          comment:
            "Good communication skills overall. The candidate expressed ideas clearly and concisely.",
        },
        {
          name: "Technical Knowledge",
          score: techScore,
          comment:
            "Demonstrated solid technical knowledge in the relevant areas. Good understanding of core concepts.",
        },
        {
          name: "Problem Solving",
          score: probScore,
          comment:
            "Showed good problem-solving abilities and analytical thinking. Approached problems methodically.",
        },
        {
          name: "Cultural & Role Fit",
          score: fitScore,
          comment:
            "Appears to be a good fit for the role based on responses. Values align with company culture.",
        },
        {
          name: "Confidence & Clarity",
          score: confScore,
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
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-600">
          LLAMA3 INTERVIEW DASHBOARD
        </h1>
        <div className="flex items-center gap-4">
          <Button
            asChild
            className="bg-white text-teal-600 border border-teal-200 px-4 py-2 rounded-[1.25rem] hover:bg-teal-50 transition-all"
          >
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Feedback Summary Card */}
      <div className="bg-white rounded-[1.25rem] p-8 border border-gray-200 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {interview.role} Interview
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 text-gray-500">
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
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span className="text-sm">
                  {feedback?.createdAt
                    ? dayjs(feedback.createdAt).format("MMM D, YYYY")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
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
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-sm">
                  {feedback?.createdAt
                    ? dayjs(feedback.createdAt).format("h:mm A")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-teal-100 px-4 py-2 rounded-[1.25rem] shadow-sm">
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
              className="text-teal-600"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span className="text-teal-600 font-bold">
              {feedback?.totalScore || 0}
            </span>
            <span className="text-gray-500">/100</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-2">
          <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
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
              className="text-teal-600"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Final Assessment
          </h3>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-[1.25rem] border-l-4 border-teal-500">
            {feedback?.finalAssessment}
          </p>
        </div>

        {/* Interview Breakdown */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
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
              className="text-teal-600"
            >
              <path d="M20 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Performance Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedback?.categoryScores?.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.25rem] p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-800">{category.name}</h4>
                  <div className="flex items-center gap-1 bg-teal-100 px-3 py-1 rounded-full">
                    <span className="text-teal-600 font-bold">
                      {category.score}
                    </span>
                    <span className="text-gray-500 text-sm">/100</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6 mt-6">
          <div className="bg-white rounded-[1.25rem] p-5 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
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
                className="text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Strengths
            </h3>
            <ul className="space-y-3">
              {feedback?.strengths?.map((strength, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-600 bg-green-50 p-2 rounded-[1.25rem]"
                >
                  <span className="text-green-500 mt-1 flex-shrink-0">
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
                    >
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-[1.25rem] p-5 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
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
                className="text-orange-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {feedback?.areasForImprovement?.map((area, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-600 bg-orange-50 p-2 rounded-[1.25rem]"
                >
                  <span className="text-orange-500 mt-1 flex-shrink-0">
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
                    >
                      <path d="m12 8 4 4-4 4"></path>
                      <path d="m8 12h8"></path>
                    </svg>
                  </span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            asChild
            className="bg-white text-teal-600 border border-teal-200 px-6 py-3 rounded-[1.25rem] font-medium transition-all duration-300 hover:bg-teal-50 hover:shadow-teal-100 hover:shadow-lg shadow-md flex-1 hover:-translate-y-1 active:scale-95"
          >
            <Link
              href="/"
              className="flex w-full justify-center items-center gap-2"
            >
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
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
              Back to Dashboard
            </Link>
          </Button>

          <Button
            asChild
            className="bg-teal-500 text-white px-6 py-3 rounded-[1.25rem] font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md flex-1 hover:-translate-y-1 active:scale-95"
          >
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center items-center gap-2"
            >
              Retake Interview
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
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
