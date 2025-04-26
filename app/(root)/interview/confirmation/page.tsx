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
          <h1 className="text-gradient text-3xl font-bold">Interview Confirmation</h1>
          <div className="flex items-center gap-4">
            <Button asChild className="glass-effect text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
              <Link href="/interview">Back</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping"></div>
            <div className="relative size-full rounded-full border-2 border-t-purple-500 border-r-purple-400 border-b-purple-300 border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Preparing your interview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-gradient text-3xl font-bold">Interview Confirmation</h1>
        <div className="flex items-center gap-4">
          <Button asChild className="glass-effect text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all">
            <Link href="/interview">Back</Link>
          </Button>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-white/5 shadow-lg mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-50 rounded-xl"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full size-10 flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="font-medium text-white">Type</span>
          </div>

          <div className="relative">
            <div className="h-1 w-24 flex-shrink-0 rounded-full bg-purple-600"></div>
            <div className="absolute top-0 left-0 h-1 w-24 rounded-full bg-purple-400 opacity-50 animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full size-10 flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="font-medium text-white">Role</span>
          </div>

          <div className="relative">
            <div className="h-1 w-24 flex-shrink-0 rounded-full bg-purple-600"></div>
            <div className="absolute top-0 left-0 h-1 w-24 rounded-full bg-purple-400 opacity-50 animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full size-10 flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="font-medium text-white">Tech Stack</span>
          </div>

          <div className="relative">
            <div className="h-1 w-24 flex-shrink-0 rounded-full bg-purple-600"></div>
            <div className="absolute top-0 left-0 h-1 w-24 rounded-full bg-purple-400 opacity-50 animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full size-10 flex items-center justify-center shadow-lg bg-gradient-to-br from-green-600 to-green-800 text-white animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <span className="font-medium text-white">Ready</span>
          </div>
        </div>
      </div>

      {/* Confirmation Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-white/5 shadow-lg flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600/20 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Interview Details</h2>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/5 shadow-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Interview Type</span>
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-2 ${
                      interviewData.type === 'technical' ? 'bg-purple-600/20' :
                      interviewData.type === 'behavioral' ? 'bg-blue-600/20' :
                      'bg-green-600/20'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={
                        interviewData.type === 'technical' ? 'text-purple-400' :
                        interviewData.type === 'behavioral' ? 'text-blue-400' :
                        'text-green-400'
                      }>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <span className="text-white font-medium capitalize">{interviewData.type}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Role</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600/20 rounded-lg p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="text-white font-medium">{interviewData.role}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Duration</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-600/20 rounded-lg p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span className="text-white font-medium">15-20 minutes</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-gray-400 text-sm">Tech Stack</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interviewData.techstack.map((tech) => (
                    <span key={tech} className="bg-green-600/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/5 shadow-lg mb-6">
              <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                What to Expect
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">You'll be interviewed by an AI assistant with voice interaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">The interview will last approximately 15-20 minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">You'll receive detailed feedback and scoring after the interview</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300">Make sure your microphone is working properly before starting</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleStartInterview}
              className="purple-gradient text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/20 hover:shadow-lg shadow-md w-full flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" x2="12" y1="19" y2="22"></line>
              </svg>
              Start Interview
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-white/5 shadow-lg flex flex-col items-center justify-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-md"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-full border border-white/10 shadow-xl">
                <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                  <Image
                    src="/ai-avatar.png"
                    alt="AI Interviewer"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full p-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-white mb-3">AI Interviewer</h3>
            <div className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-6 inline-flex items-center gap-2">
              <span className="animate-pulse size-2 bg-green-500 rounded-full"></span>
              Ready for Interview
            </div>

            <p className="text-gray-300 text-lg mb-8">
              Your AI interviewer is ready to conduct a professional {interviewData.type} interview for the {interviewData.role} role.
            </p>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/5 shadow-lg">
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Interview Tips
              </h4>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Use the STAR method for behavioral questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-purple-600/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">Provide specific examples from your experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewConfirmationPage;
