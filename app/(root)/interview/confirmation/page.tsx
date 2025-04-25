"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewConfirmationPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interviewData, setInterviewData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Get interview data from session storage
    const storedData = sessionStorage.getItem('interviewData');
    if (storedData) {
      setInterviewData(JSON.parse(storedData));
    } else {
      // If no data, redirect back to interview setup
      router.push('/interview');
    }
  }, [router]);

  const handleStartInterview = async () => {
    try {
      // Create a new interview in the database
      const response = await fetch('/api/vapi/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: interviewData.type,
          role: interviewData.role,
          level: 'Intermediate', // Default level
          techstack: interviewData.techstack.join(','),
          amount: 5, // Number of questions
          userid: user?.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store interview ID for the session
        sessionStorage.setItem('currentInterviewId', data.interviewId);
        router.push('/interview/session');
      } else {
        console.error('Failed to create interview:', data.error);
        alert('Failed to create interview. Please try again.');
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading || !interviewData) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Interview Confirmation</h1>
          <div className="flex items-center gap-4">
            <Button asChild className="btn-secondary">
              <Link href="/interview">Back</Link>
            </Button>
          </div>
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
        <h1 className="text-3xl font-bold text-white">Interview Confirmation</h1>
        <div className="flex items-center gap-4">
          <Button asChild className="btn-secondary">
            <Link href="/interview">Back</Link>
          </Button>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="rounded-full size-8 flex items-center justify-center bg-primary-200 text-dark-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-white">Type</span>
        </div>
        <div className="h-0.5 w-16 bg-primary-200 flex-shrink-0"></div>
        <div className="flex items-center gap-2">
          <div className="rounded-full size-8 flex items-center justify-center bg-primary-200 text-dark-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-white">Role</span>
        </div>
        <div className="h-0.5 w-16 bg-primary-200 flex-shrink-0"></div>
        <div className="flex items-center gap-2">
          <div className="rounded-full size-8 flex items-center justify-center bg-primary-200 text-dark-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-white">Tech Stack</span>
        </div>
      </div>

      {/* Confirmation Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-dark-200 rounded-xl p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-white">Interview Details</h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-light-400">Type:</span>
              <span className="text-white font-medium">{interviewData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-400">Role:</span>
              <span className="text-white font-medium">{interviewData.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-light-400">Tech Stack:</span>
              <div className="flex flex-wrap gap-2">
                {interviewData.techstack.map((tech) => (
                  <span key={tech} className="bg-primary-200/20 text-primary-200 px-2 py-1 rounded-full text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-medium text-white mb-2">What to Expect</h3>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-light-100">You'll be interviewed by an AI assistant</li>
              <li className="text-light-100">The interview will last approximately 15-20 minutes</li>
              <li className="text-light-100">You'll receive detailed feedback after the interview</li>
              <li className="text-light-100">Make sure your microphone is working properly</li>
            </ul>
          </div>

          <Button onClick={handleStartInterview} className="btn-primary mt-4">
            Start Interview
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 bg-dark-200 rounded-xl p-8 text-center">
          <div className="relative">
            <div className="w-[120px] h-[120px] rounded-full bg-primary-200/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary-200 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-100">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-medium text-white">AI Interviewer</h3>
          <p className="text-light-100">
            Your AI interviewer is ready to conduct a professional {interviewData.type} interview for the {interviewData.role} role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewConfirmationPage;
