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
    <div className="flex flex-col gap-6 relative">
      {/* Welcome Section */}
      <section className="bg-[#1e1e1e] rounded-lg p-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-4 max-w-lg">
          <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-gray-300">
            Practice real interview questions & get instant AI feedback to improve your skills.
          </p>

          <Link href="/interview">
            <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-md font-medium transition-colors max-sm:w-full mt-2">
              Start an Interview
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={200}
              height={200}
              className="rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Interview Types Grid */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Interview Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interviewTypes.map((type) => (
            <Link
              href={`/interview?type=${type.id}`}
              key={type.id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-[#1e1e1e] p-6 transition-all duration-300 hover:bg-[#252525] h-full">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
                    <Image src={type.icon || '/icons/default.svg'} alt={type.title} width={20} height={20} className="text-[#7c3aed]" />
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">{type.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{type.description}</p>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#7c3aed] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span>Start interview</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Interviews */}
      <section className="flex flex-col gap-4 mt-6">
        <h2 className="text-xl font-bold text-white">Your Recent Interviews</h2>

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
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-[#1e1e1e] p-8 text-center col-span-2">
              <div className="w-12 h-12 rounded-full bg-[#7c3aed]/20 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c3aed]">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white">No interviews yet</h3>
              <p className="text-gray-400 max-w-md">Complete your first interview to see your history and performance analytics here</p>
              <Link href="/interview">
                <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-md font-medium transition-colors mt-2">
                  Start an Interview
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Features */}
      <section className="mt-6 rounded-lg bg-gradient-to-r from-[#7c3aed]/10 to-[#4f46e5]/10 p-6 relative overflow-hidden">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <h3 className="text-lg font-semibold text-white">Coming Soon: Interview Scheduling</h3>
            <p className="mt-1 text-gray-300">Schedule mock interviews with AI interviewers at your convenience</p>
          </div>

          <button className="bg-[#1e1e1e] hover:bg-[#252525] text-[#7c3aed] px-5 py-2.5 rounded-md font-medium transition-colors">
            Join Waitlist
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
