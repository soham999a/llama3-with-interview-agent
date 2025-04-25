"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";

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
        const interviewId = sessionStorage.getItem('currentInterviewId');

        if (!interviewId) {
          console.error('No interview ID found');
          router.push('/interview');
          return;
        }

        // Get interview data
        const interviewData = await getInterviewById(interviewId);

        if (!interviewData) {
          console.error('Interview not found');
          router.push('/interview');
          return;
        }

        // Add the ID to the interview data
        setInterview({
          ...interviewData,
          id: interviewId
        });
        setTotalQuestions(interviewData.questions?.length || 5);
      } catch (error) {
        console.error('Error fetching data:', error);
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
          <h1 className="text-3xl font-bold text-white">Interview Session</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Interview Session</h1>
      </div>

      <div className="bg-dark-200 rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-200/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">AI Interviewer</h3>
              <p className="text-xs text-light-400">{interview?.type} Interview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-light-400">Question {currentQuestion}/{totalQuestions}</span>
            <div className="w-24 h-1.5 bg-dark-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-200 rounded-full"
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
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
