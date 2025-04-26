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
      {/* 3D Background */}
      {show3D && (
        <ErrorBoundary fallback={null}>
          <Background3D />
        </ErrorBoundary>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Llama3 Integration Notice */}
      <section className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-green-400 font-medium">Llama3 Model Activated</h3>
            <p className="text-light-100 text-sm">This application now uses Llama3 AI for generating questions and providing feedback.</p>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-dark-200 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-light-100">
            Practice real interview questions & get instant AI feedback to improve your skills.
          </p>

          {show3D ? (
            <ErrorBoundary fallback={
              <Button asChild className="btn-primary max-sm:w-full">
                <Link href="/interview">Start an Interview</Link>
              </Button>
            }>
              <Button3D className="btn-primary max-sm:w-full">
                <Link href="/interview" className="px-4 py-2 block">
                  Start an Interview
                </Link>
              </Button3D>
            </ErrorBoundary>
          ) : (
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            {show3D ? (
              <ErrorBoundary fallback={
                <Image
                  src="/robot.png"
                  alt="AI Interview Assistant"
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              }>
                <div className="w-[250px] h-[250px] max-sm:w-[180px] max-sm:h-[180px] animate-float">
                  <InteractiveCode3D />
                </div>
              </ErrorBoundary>
            ) : (
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={200}
                height={200}
                className="rounded-full"
              />
            )}
          </div>
        </div>
      </section>

      {/* Interview Types Grid */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Interview Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviewTypes.map((type) => (
            <Link
              href={`/interview?type=${type.id}`}
              key={type.id}
              className="group"
            >
              {show3D ? (
                <ErrorBoundary fallback={
                  <div className="relative overflow-hidden rounded-xl bg-dark-200 p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(202,197,254,0.15)] group-hover:translate-y-[-5px]">
                    <div className="flex items-start justify-between">
                      <div className="rounded-full bg-primary-200/20 p-3 text-primary-200">
                        <Image src={type.icon || '/icons/default.svg'} alt={type.title} width={24} height={24} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold text-white">{type.title}</h3>
                    <p className="mt-2 text-sm text-light-400">{type.description}</p>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span>Start interview</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                }>
                  <Card3D className="rounded-xl bg-dark-200 p-6 h-full" intensity={5}>
                    <div className="relative overflow-hidden">
                      <div className="flex items-start justify-between">
                        <div className="rounded-full bg-primary-200/20 p-3 text-primary-200">
                          <Image src={type.icon || '/icons/default.svg'} alt={type.title} width={24} height={24} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-white">{type.title}</h3>
                      <p className="mt-2 text-sm text-light-400">{type.description}</p>

                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span>Start interview</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </Card3D>
                </ErrorBoundary>
              ) : (
                <div className="relative overflow-hidden rounded-xl bg-dark-200 p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(202,197,254,0.15)] group-hover:translate-y-[-5px]">
                  <div className="flex items-start justify-between">
                    <div className="rounded-full bg-primary-200/20 p-3 text-primary-200">
                      <Image src={type.icon || '/icons/default.svg'} alt={type.title} width={24} height={24} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-white">{type.title}</h3>
                  <p className="mt-2 text-sm text-light-400">{type.description}</p>

                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span>Start interview</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-2xl font-bold text-white">Your Recent Interviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-dark-200 p-8 text-center col-span-2">
              {show3D ? (
                <ErrorBoundary fallback={
                  <div className="rounded-full bg-primary-200/20 p-4 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                }>
                  <div className="h-24 w-24 mb-2">
                    <FloatingParticles3D />
                  </div>
                </ErrorBoundary>
              ) : (
                <div className="rounded-full bg-primary-200/20 p-4 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              )}
              <h3 className="text-xl font-medium text-white">No interviews yet</h3>
              <p className="text-light-400 max-w-md">Complete your first interview to see your history and performance analytics here</p>
              {show3D ? (
                <ErrorBoundary fallback={
                  <Button asChild className="btn-primary mt-2">
                    <Link href="/interview">Start an Interview</Link>
                  </Button>
                }>
                  <Button3D className="btn-primary mt-2">
                    <Link href="/interview" className="px-4 py-2 block">
                      Start an Interview
                    </Link>
                  </Button3D>
                </ErrorBoundary>
              ) : (
                <Button asChild className="btn-primary mt-2">
                  <Link href="/interview">Start an Interview</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="mt-8 rounded-xl bg-gradient-to-r from-primary-200/20 to-blue-500/20 p-6 relative overflow-hidden">
        {show3D && (
          <ErrorBoundary fallback={null}>
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-1/4 -translate-y-1/4">
                <FloatingParticles3D />
              </div>
            </div>
          </ErrorBoundary>
        )}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <h3 className="text-xl font-semibold text-white">Coming Soon: Interview Scheduling</h3>
            <p className="mt-1 text-light-100">Schedule mock interviews with AI interviewers at your convenience</p>
          </div>

          {show3D ? (
            <ErrorBoundary fallback={
              <Button className="btn-secondary w-fit">
                Join Waitlist
              </Button>
            }>
              <Button3D className="btn-secondary w-fit">
                <span className="px-4 py-2 block">Join Waitlist</span>
              </Button3D>
            </ErrorBoundary>
          ) : (
            <Button className="btn-secondary w-fit">
              Join Waitlist
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
