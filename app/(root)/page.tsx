"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import ErrorBoundary from "@/components/ErrorBoundary";

// Dynamically import 3D components with error handling
const Background3D = dynamic(() =>
  import("@/components/3d/Background3D")
    .then(mod => mod.default)
    .catch(err => {
      console.error("Failed to load Background3D:", err);
      return () => null;
    }),
  { ssr: false }
);

const Card3D = dynamic(() =>
  import("@/components/3d/Card3D")
    .then(mod => mod.default)
    .catch(err => {
      console.error("Failed to load Card3D:", err);
      return () => null;
    }),
  { ssr: false }
);

const Button3D = dynamic(() =>
  import("@/components/3d/Button3D")
    .then(mod => mod.default)
    .catch(err => {
      console.error("Failed to load Button3D:", err);
      return () => null;
    }),
  { ssr: false }
);

const FloatingParticles3D = dynamic(() =>
  import("@/components/3d/FloatingParticles3D")
    .then(mod => mod.default)
    .catch(err => {
      console.error("Failed to load FloatingParticles3D:", err);
      return () => null;
    }),
  { ssr: false }
);

const InteractiveCode3D = dynamic(() =>
  import("@/components/3d/InteractiveCode3D")
    .then(mod => mod.default)
    .catch(err => {
      console.error("Failed to load InteractiveCode3D:", err);
      return () => null;
    }),
  { ssr: false }
);

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";

function Home() {
  const [user, setUser] = useState<any>(null);
  const [userInterviews, setUserInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    try {
      // Enable 3D after a short delay to ensure smooth page load
      const timer = setTimeout(() => setShow3D(true), 500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error enabling 3D:", error);
      setShow3D(false);
    }
  }, []);

  // Load user preferences for 3D
  useEffect(() => {
    if (user?.preferences?.show3D !== undefined) {
      setShow3D(user.preferences.show3D);
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        const interviews = await getInterviewsByUserId(userData?.id!);
        setUserInterviews(interviews || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const hasPastInterviews = userInterviews?.length > 0;

  // Interview types for the dashboard
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Practice coding problems and system design questions',
      color: 'bg-blue-500',
      icon: '/icons/code.svg',
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Prepare for questions about your past experiences',
      color: 'bg-purple-500',
      icon: '/icons/chat.svg',
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Demonstrate your analytical and critical thinking skills',
      color: 'bg-green-500',
      icon: '/icons/brain.svg',
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Practice designing scalable systems and architectures',
      color: 'bg-orange-500',
      icon: '/icons/design.svg',
    },
    {
      id: 'leadership',
      title: 'Leadership',
      description: 'Prepare for questions about your leadership experience',
      color: 'bg-red-500',
      icon: '/icons/leadership.svg',
    },
    {
      id: 'product-management',
      title: 'Product Management',
      description: 'Practice product management interview questions',
      color: 'bg-yellow-500',
      icon: '/icons/product.svg',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="btn-primary opacity-50 cursor-not-allowed px-4 py-2 rounded-full">
              Loading...
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Welcome Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900/20 rounded-2xl p-8 mb-8 border border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex flex-col gap-6 max-w-lg w-full">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 rounded-full px-4 py-1.5 w-fit">
              <span className="animate-pulse size-2 bg-purple-500 rounded-full"></span>
              <span className="text-purple-300 text-sm font-medium">AI-Powered Interview Practice</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gradient">Welcome, {user?.name || 'User'}!</h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Practice real interview questions with our LLAMA3-powered AI interviewer and receive personalized feedback to enhance your skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <button className="purple-gradient text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/20 hover:shadow-lg shadow-md w-full sm:w-fit flex items-center justify-center gap-2 group">
                <Link href="/interview" className="flex items-center gap-2">
                  Start an Interview
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </button>

              <button className="glass-effect text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 hover:bg-white/10 w-full sm:w-fit flex items-center justify-center gap-2">
                <Link href="/history" className="flex items-center gap-2">
                  View History
                </Link>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-2">
                <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">ML</div>
                <div className="size-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">NLP</div>
              </div>
              <span className="text-gray-400 text-sm">Powered by advanced AI technologies</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-full border border-white/10 shadow-xl">
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={320}
                height={320}
                className="animate-float rounded-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-purple-600 rounded-full p-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Types Grid */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Interview Types</h2>
            <p className="text-gray-400 text-sm sm:text-base">Select the type of interview you want to practice</p>
          </div>

          <button className="glass-effect text-purple-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {interviewTypes.map((type) => (
            <Link
              href={`/interview?type=${type.id}`}
              key={type.id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex items-start justify-between relative z-10">
                  <div className={`w-14 h-14 rounded-xl ${type.color}/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Image src={type.icon || '/icons/default.svg'} alt={type.title} width={28} height={28} className="text-white" />
                  </div>

                  <div className="size-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{type.title}</h3>
                <p className="mt-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{type.description}</p>

                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 flex-grow rounded-full bg-gray-800 overflow-hidden">
                    <div className="h-full bg-purple-600 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-400 group-hover:text-purple-300 transition-colors duration-300">Start</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Your Recent Interviews</h2>
            <p className="text-gray-400 text-sm sm:text-base">Review your past interview sessions and feedback</p>
          </div>

          {hasPastInterviews && (
            <button className="glass-effect text-purple-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/10 flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start">
              <Link href="/history" className="flex items-center gap-2">
                View All History
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-center col-span-2 border border-white/5 shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

              <div className="flex flex-col items-center justify-center gap-4 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-purple-600/20 flex items-center justify-center mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>

                <div className="inline-flex items-center gap-2 bg-purple-600/20 rounded-full px-4 py-1.5 w-fit mb-2">
                  <span className="animate-pulse size-2 bg-purple-500 rounded-full"></span>
                  <span className="text-purple-300 text-sm font-medium">No Interview History</span>
                </div>

                <h3 className="text-2xl font-semibold text-white">Start Your First Interview</h3>
                <p className="text-gray-400 max-w-md mt-2">Complete your first interview to see your history and performance analytics here. Get personalized feedback to improve your skills.</p>

                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  <div className="bg-purple-600/10 text-purple-400 px-3 py-1.5 rounded-full text-sm font-medium">Personalized Feedback</div>
                  <div className="bg-blue-600/10 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium">Performance Analytics</div>
                  <div className="bg-green-600/10 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">Skill Assessment</div>
                </div>

                <button className="purple-gradient text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/20 hover:shadow-lg shadow-md mt-6 group">
                  <Link href="/interview" className="flex items-center gap-2">
                    Start Your First Interview
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="rounded-2xl bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 p-4 sm:p-8 relative overflow-hidden border border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-full max-h-[500px] bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 size-16 sm:size-24 bg-purple-600/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 size-20 sm:size-32 bg-blue-600/10 rounded-full blur-xl"></div>

        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 w-fit mb-3 sm:mb-4">
              <span className="animate-pulse size-2 bg-purple-500 rounded-full"></span>
              <span className="text-purple-300 text-xs sm:text-sm font-medium">Coming Soon</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gradient mb-2 sm:mb-3">Advanced Interview Features</h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              We're working on exciting new features to enhance your interview preparation experience. Stay tuned for these upcoming additions:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-purple-600/20 rounded-lg p-1.5 sm:p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400 sm:w-[18px] sm:h-[18px]">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm sm:text-base">Interview Scheduling</h4>
                  <p className="text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1">Schedule mock interviews at your convenience</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600/20 rounded-lg p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Advanced Feedback</h4>
                  <p className="text-gray-400 text-sm mt-1">Detailed performance analysis and improvement tips</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-600/20 rounded-lg p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Custom Questions</h4>
                  <p className="text-gray-400 text-sm mt-1">Create your own interview questions</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-orange-600/20 rounded-lg p-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Mock Panel Interviews</h4>
                  <p className="text-gray-400 text-sm mt-1">Practice with multiple AI interviewers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-auto">
            <button className="purple-gradient text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/20 hover:shadow-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap group w-full md:w-auto">
              <span>Join Waitlist</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>

            <button className="glass-effect text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-200 hover:bg-white/10 flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto">
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
