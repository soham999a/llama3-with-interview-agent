"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.client";
import { getInterviewById } from "@/lib/actions/general.client";

const InterviewSessionPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data
        const userData = await getCurrentUser();
        setUser(userData);

        // Get interview ID from session storage
        const interviewId = sessionStorage.getItem("currentInterviewId");

        if (!interviewId) {
          console.error("No interview ID found");
          router.push("/interview");
          return;
        }

        // Get interview data
        const interviewData = await getInterviewById(interviewId);

        if (!interviewData) {
          console.error("Interview not found");
          router.push("/interview");
          return;
        }

        // Add the ID to the interview data
        setInterview({
          ...interviewData,
          id: interviewId,
        });
        setTotalQuestions(interviewData.questions?.length || 5);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Update current question (this would be called from the Agent component)
  const updateQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-teal-600">
            LLAMA3 INTERVIEW DASHBOARD
          </h1>
        </div>
        <div className="bg-white rounded-[1.25rem] p-8 border border-gray-200 shadow-md flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-full bg-teal-200 animate-ping opacity-75"></div>
            <div className="relative size-full rounded-full border-4 border-t-teal-500 border-r-teal-400 border-b-teal-300 border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">
            Preparing your interview session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-600">
          LLAMA3 INTERVIEW DASHBOARD
        </h1>
      </div>

      <div className="bg-white rounded-[1.25rem] p-8 border border-gray-200 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[1.25rem] bg-teal-100 flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-gray-800 font-medium text-lg">
                {interview?.type} Interview
              </h3>
              <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-3 py-1 w-fit mt-1">
                <span className="animate-pulse size-2 bg-teal-500 rounded-full"></span>
                <span className="text-teal-600 text-xs font-medium">
                  Professional Interviewer
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm text-gray-600 font-medium">
              Question {currentQuestion}/{totalQuestions}
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full"
                style={{
                  width: `${(currentQuestion / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <Agent
          userName={user?.name!}
          userId={user?.id}
          interviewId={interview?.id}
          type="interview"
          questions={interview?.questions || []}
          onQuestionChange={updateQuestion}
        />
      </div>
    </div>
  );
};

export default InterviewSessionPage;
