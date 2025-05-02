"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import ColorCard from "@/components/ColorCard";
import { FreshersJobsIcon, RemoteJobsIcon, EasyApplyIcon, MaangIcon } from "@/components/icons/CardIcons";

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
  const [currentPage, setCurrentPage] = useState(1);
  const interviewsPerPage = 4;

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

  // Pagination logic
  const indexOfLastInterview = currentPage * interviewsPerPage;
  const indexOfFirstInterview = indexOfLastInterview - interviewsPerPage;
  const currentInterviews = userInterviews?.slice(indexOfFirstInterview, indexOfLastInterview);
  const totalPages = Math.ceil((userInterviews?.length || 0) / interviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Interview types for the dashboard
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Practice coding problems and system design questions',
      color: 'bg-[#FFF8E1] border-yellow-100',
      icon: '/icons/code.svg',
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Prepare for questions about your past experiences',
      color: 'bg-[#E1F5FE] border-blue-100',
      icon: '/icons/chat.svg',
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Demonstrate your analytical and critical thinking skills',
      color: 'bg-[#E8F5E9] border-green-100',
      icon: '/icons/brain.svg',
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Practice designing scalable systems and architectures',
      color: 'bg-[#FFF8E1] border-yellow-100',
      icon: '/icons/design.svg',
    },
    {
      id: 'leadership',
      title: 'Leadership',
      description: 'Prepare for questions about your leadership experience',
      color: 'bg-[#E1F5FE] border-blue-100',
      icon: '/icons/leadership.svg',
    },
    {
      id: 'product-management',
      title: 'Product Management',
      description: 'Practice product management interview questions',
      color: 'bg-[#FFEBEE] border-red-100',
      icon: '/icons/product.svg',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 text-gray-500 opacity-50 cursor-not-allowed px-4 py-2 rounded-full">
              Loading...
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Welcome Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100/20 rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-blue-100 shadow-md">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#0070f3]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#1e40af]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-6 max-w-lg w-full">
            <div className="inline-flex items-center gap-2 bg-[#0070f3]/10 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 w-fit">
              <span className="animate-pulse size-2 bg-[#0070f3] rounded-full"></span>
              <span className="text-[#0070f3] text-xs sm:text-sm font-medium">AI-Powered Interview Practice</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Welcome, {user?.name || 'User'}!</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
              Practice real interview questions with our LLAMA3-powered AI interviewer and receive personalized feedback to enhance your skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <button className="bg-[#0070f3] text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 hover:opacity-90 hover:shadow-[#0070f3]/20 hover:shadow-lg shadow-md w-full sm:w-fit flex items-center justify-center gap-2 group hover:-translate-y-1">
                <Link href="/interview" className="flex items-center gap-2">
                  Start an Interview
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </button>

              <button className="bg-white text-[#0070f3] border border-[#0070f3]/20 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 hover:bg-[#0070f3]/5 w-full sm:w-fit flex items-center justify-center gap-2 hover:-translate-y-1">
                <Link href="/history" className="flex items-center gap-2">
                  View History
                </Link>
              </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mt-2">
              <div className="flex -space-x-2">
                <div className="size-7 sm:size-8 rounded-full bg-[#0070f3] flex items-center justify-center text-white text-xs font-bold">AI</div>
                <div className="size-7 sm:size-8 rounded-full bg-[#1e40af] flex items-center justify-center text-white text-xs font-bold">ML</div>
                <div className="size-7 sm:size-8 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xs font-bold">NLP</div>
              </div>
              <span className="text-gray-500 text-xs sm:text-sm">Powered by advanced AI technologies</span>
            </div>
          </div>

          <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0070f3]/20 to-[#1e40af]/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white to-blue-50 p-1 rounded-full border border-blue-100 shadow-lg">
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={320}
                height={320}
                className="animate-float rounded-full"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Interview Types Grid */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Interview Types</h2>
            <p className="text-gray-600 text-sm sm:text-base">Select the type of interview you want to practice</p>
          </div>

          <button className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-[1.25rem] font-medium transition-all duration-200 hover:bg-gray-50 flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 sm:gap-6">
          {interviewTypes.map((type) => (
            <Link
              href={`/interview?type=${type.id}`}
              key={type.id}
              className="group"
            >
              <div className={`relative overflow-hidden rounded-[2rem] ${type.color} p-4 sm:p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-start justify-between relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Image src={type.icon || '/icons/default.svg'} alt={type.title} width={28} height={28} className="text-gray-800" />
                  </div>

                  <div className="size-8 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white/70 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">{type.title}</h3>
                <p className="mt-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{type.description}</p>

                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 flex-grow rounded-full bg-white/50 overflow-hidden">
                    <div className="h-full bg-white/80 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">Start</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="mb-8 bg-white p-4 sm:p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Recent Interviews</h2>
            <p className="text-gray-600 text-sm sm:text-base">Review your past interview sessions and feedback</p>
          </div>

          {hasPastInterviews && (
            <button className="bg-white text-teal-600 border border-teal-200 px-4 py-2 rounded-[1.25rem] font-medium transition-all duration-200 hover:bg-teal-50 flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {hasPastInterviews ? (
            <>
              {currentInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`w-8 h-8 rounded-full ${currentPage === i + 1
                          ? 'bg-teal-500 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="relative overflow-hidden rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 text-center col-span-2 border border-gray-200 shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

              <div className="flex flex-col items-center justify-center gap-4 relative z-10">
                <div className="w-20 h-20 rounded-[1.25rem] bg-teal-100 flex items-center justify-center mb-4 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>

                <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-1.5 w-fit mb-2">
                  <span className="animate-pulse size-2 bg-teal-500 rounded-full"></span>
                  <span className="text-teal-600 text-sm font-medium">No Interview History</span>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800">Start Your First Interview</h3>
                <p className="text-gray-600 max-w-md mt-2">Complete your first interview to see your history and performance analytics here. Get personalized feedback to improve your skills.</p>

                <div className="flex flex-wrap gap-3 mt-4 justify-center">
                  <div className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:shadow-teal-100 transition-all duration-300 hover:-translate-y-0.5">Personalized Feedback</div>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-0.5">Performance Analytics</div>
                  <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:shadow-green-100 transition-all duration-300 hover:-translate-y-0.5">Skill Assessment</div>
                </div>

                <button className="bg-teal-500 text-white px-6 py-3.5 rounded-[1.25rem] font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md mt-6 group hover:-translate-y-1">
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

      {/* Job Opportunities */}
      <section className="rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 relative overflow-hidden border border-gray-200 shadow-md">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-teal-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-full max-h-[500px] bg-gradient-to-r from-teal-50 to-teal-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 size-16 sm:size-24 bg-teal-100/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 size-20 sm:size-32 bg-teal-200/20 rounded-full blur-xl"></div>

        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-start md:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 w-fit mb-3 sm:mb-4">
              <span className="animate-pulse size-2 bg-teal-500 rounded-full"></span>
              <span className="text-teal-600 text-xs sm:text-sm font-medium">Now Available</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">Find Your Dream Job</h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Explore different job opportunities and prepare for your interviews:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <ColorCard
                title="Fresher's Jobs"
                color="yellow"
                href="/interview"
                icon={<FreshersJobsIcon />}
              />
              <ColorCard
                title="Remote Jobs"
                color="blue"
                href="/interview"
                icon={<RemoteJobsIcon />}
              />
              <ColorCard
                title="Easy Apply"
                color="green"
                href="/interview"
                icon={<EasyApplyIcon />}
              />
              <ColorCard
                title="MAANG"
                color="peach"
                href="/interview"
                icon={<MaangIcon />}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 w-full md:w-auto">
            <Link href="/interview" className="w-full md:w-auto">
              <button className="bg-teal-500 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-[1.25rem] font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap group w-full hover:-translate-y-1">
                <span>Start Interview</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </Link>

            <Link href="/about" className="w-full md:w-auto">
              <button className="bg-white text-teal-600 border border-teal-200 px-4 sm:px-6 py-3 sm:py-3.5 rounded-[1.25rem] font-medium transition-all duration-300 hover:bg-teal-50 hover:shadow-teal-100 hover:shadow-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap w-full hover:-translate-y-1">
                <span>Learn More</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
