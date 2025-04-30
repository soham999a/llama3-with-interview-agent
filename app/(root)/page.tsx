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
      color: 'yellow',
      icon: '/icons/code.svg',
      rating: 5,
      popular: true,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta']
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      description: 'Prepare for questions about your past experiences',
      color: 'teal',
      icon: '/icons/chat.svg',
      rating: 4.5,
      popular: true,
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-800',
      companies: ['Goldman Sachs', 'Walmart', 'Amazon', 'Microsoft']
    },
    {
      id: 'problem-solving',
      title: 'Last 2 Years\' Startup & Mid-Company Tech Interview',
      description: 'Demonstrate your analytical and critical thinking skills',
      color: 'green',
      icon: '/icons/brain.svg',
      rating: 4.5,
      popular: false,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      companies: ['Startups', 'Mid-size companies']
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Practice designing scalable systems and architectures',
      color: 'blue',
      icon: '/icons/design.svg',
      rating: 5,
      popular: true,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      companies: ['Frontend', 'Backend', 'Full Stack']
    },
    {
      id: 'leadership',
      title: 'Leadership',
      description: 'Prepare for questions about your leadership experience',
      color: 'purple',
      icon: '/icons/leadership.svg',
      rating: 4.5,
      popular: false,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      companies: ['Management', 'Team Lead']
    },
    {
      id: 'product-management',
      title: 'Product Management',
      description: 'Practice product management interview questions',
      color: 'red',
      icon: '/icons/product.svg',
      rating: 4.5,
      popular: true,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      companies: ['Product', 'UX', 'Strategy']
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
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-teal-50 to-teal-100/20 rounded-2xl p-8 mb-8 border border-teal-100 shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
          <div className="flex flex-col gap-6 max-w-lg w-full">
            <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-4 py-1.5 w-fit">
              <span className="animate-pulse size-2 bg-teal-500 rounded-full"></span>
              <span className="text-teal-600 text-sm font-medium">AI-Powered Interview Practice</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome, {user?.name || 'User'}!</h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Practice real interview questions with our LLAMA3-powered AI interviewer and receive personalized feedback to enhance your skills.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
              <button className="bg-teal-500 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md w-full sm:w-fit flex items-center justify-center gap-2 group hover:-translate-y-1">
                <Link href="/interview" className="flex items-center gap-2">
                  Start an Interview
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </button>

              <button className="bg-white text-teal-600 border border-teal-200 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 hover:bg-teal-50 w-full sm:w-fit flex items-center justify-center gap-2 hover:-translate-y-1">
                <Link href="/history" className="flex items-center gap-2">
                  View History
                </Link>
              </button>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-2">
                <div className="size-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                <div className="size-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">ML</div>
                <div className="size-8 rounded-full bg-teal-400 flex items-center justify-center text-white text-xs font-bold">NLP</div>
              </div>
              <span className="text-gray-500 text-sm">Powered by advanced AI technologies</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-300/20 to-teal-400/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-white to-teal-50 p-1 rounded-full border border-teal-100 shadow-lg">
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={320}
                height={320}
                className="animate-float rounded-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-teal-500 rounded-full p-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Types Grid */}
      <section className="mb-8 bg-teal-50/50 p-8 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Digital Products</h2>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-teal-500 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 text-sm">
              All
            </button>
            <button className="bg-white text-gray-600 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:bg-gray-100 text-sm">
              Resume
            </button>
            <button className="bg-white text-gray-600 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:bg-gray-100 text-sm">
              Resource
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviewTypes.map((type) => (
            <Link
              href={`/interview?type=${type.id}`}
              key={type.id}
              className="group"
            >
              <div className={`relative overflow-hidden rounded-xl ${type.bgColor} p-0 shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-200`}>
                {/* Card Header */}
                <div className="p-3 relative">
                  <div className="absolute top-3 left-3 bg-gray-800/80 text-white text-xs px-2 py-1 rounded">
                    Digital Product
                  </div>

                  {/* Card Image/Banner */}
                  <div className="h-48 rounded-lg overflow-hidden relative">
                    <div className={`absolute inset-0 ${type.bgColor} flex items-center justify-center`}>
                      <h3 className={`text-2xl font-bold ${type.textColor} text-center px-4`}>{type.title}</h3>
                    </div>

                    {type.companies && type.companies.length > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 text-xs text-gray-700">
                        {type.companies.join(' • ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="text-yellow-500 mr-1 text-lg font-bold">{type.rating}</div>
                      <div className="flex">
                        {[...Array(Math.floor(type.rating))].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        ))}
                        {type.rating % 1 !== 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {type.popular && (
                      <div className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        Popular
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{type.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Amount</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 line-through">₹99</span>
                        <span className="text-gray-800 font-bold ml-1">₹49</span>
                      </div>
                    </div>

                    <button className="bg-white text-teal-600 border border-teal-500 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-teal-50 transition-colors">
                      Purchase Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="mb-8 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 sm:gap-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Recent Interviews</h2>
            <p className="text-gray-600 text-sm sm:text-base">Review your past interview sessions and feedback</p>
          </div>

          {hasPastInterviews && (
            <button className="bg-white text-teal-600 border border-teal-200 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:bg-teal-50 flex items-center gap-2 text-sm w-full sm:w-auto justify-center sm:justify-start">
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
            <div className="relative overflow-hidden rounded-xl bg-white p-8 text-center col-span-2 border border-gray-200 shadow-md">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

              <div className="flex flex-col items-center justify-center gap-4 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center mb-4 shadow-md">
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

                <button className="bg-teal-500 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md mt-6 group hover:-translate-y-1">
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
      <section className="rounded-2xl bg-white p-4 sm:p-8 relative overflow-hidden border border-gray-200 shadow-md">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-teal-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-teal-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-full max-h-[500px] bg-gradient-to-r from-teal-50 to-teal-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 size-16 sm:size-24 bg-teal-100/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 size-20 sm:size-32 bg-teal-200/20 rounded-full blur-xl"></div>

        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-center md:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-teal-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 w-fit mb-3 sm:mb-4">
              <span className="animate-pulse size-2 bg-teal-500 rounded-full"></span>
              <span className="text-teal-600 text-xs sm:text-sm font-medium">Now Available</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-800">Find Your Dream Job</h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              Explore different job opportunities and prepare for your interviews:
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
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
              <button className="bg-teal-500 text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 hover:opacity-90 hover:shadow-teal-200 hover:shadow-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap group w-full hover:-translate-y-1">
                <span>Start Interview</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </Link>

            <Link href="/about" className="w-full md:w-auto">
              <button className="bg-white text-teal-600 border border-teal-200 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-medium transition-all duration-300 hover:bg-teal-50 hover:shadow-teal-100 hover:shadow-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap w-full hover:-translate-y-1">
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
