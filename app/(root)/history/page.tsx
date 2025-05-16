"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.client";
import { getInterviewsByUserId } from "@/lib/actions/general.client";

export default function History() {
  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getCurrentUser();
        console.log("User data:", userData);
        setUser(userData);

        if (userData) {
          // Firebase user object uses uid property
          const userId = userData.uid || userData.id;
          console.log("Fetching interviews for user:", userId);

          // Try to get interviews from Firebase
          let userInterviews = await getInterviewsByUserId(userId);
          console.log("Fetched interviews from Firebase:", userInterviews);

          // If no interviews found, try to get mock interviews
          if (!userInterviews || userInterviews.length === 0) {
            console.log(
              "No interviews found in Firebase, fetching mock interviews"
            );
            try {
              const response = await fetch(
                `/api/mock-interviews?userId=${userId}&count=8`
              );
              if (response.ok) {
                const data = await response.json();
                if (data.success && data.interviews) {
                  userInterviews = data.interviews;
                  console.log("Using mock interviews:", userInterviews);
                }
              }
            } catch (mockError) {
              console.error("Error fetching mock interviews:", mockError);
            }
          }

          setInterviews(userInterviews || []);
        } else {
          console.log("No user data available");
          setInterviews([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Try to use mock data if there's an error
        try {
          const mockUserId = "mock-user-123";
          const response = await fetch(
            `/api/mock-interviews?userId=${mockUserId}&count=8`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.interviews) {
              setInterviews(data.interviews);
              console.log(
                "Using mock interviews due to error:",
                data.interviews
              );
            }
          }
        } catch (mockError) {
          console.error("Error fetching mock interviews:", mockError);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Add a console log to help debug
  console.log("Rendering history page with interviews:", interviews);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="bg-yellow-300 text-gray-900 px-2 py-0.5 rounded-[4px] mr-2">
              Intervie
            </span>
            <span className="text-[#1EBBA3]">HUB</span>
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative size-20">
            <div className="absolute inset-0 rounded-[4px] bg-[#1EBBA3]/20 animate-ping opacity-75"></div>
            <div className="relative size-full rounded-[4px] border-4 border-t-[#1EBBA3] border-r-[#1EBBA3]/70 border-b-[#1EBBA3]/50 border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">
            Loading your interview history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="bg-yellow-300 text-gray-900 px-2 py-0.5 rounded-[4px] mr-2">
            Intervie
          </span>
          <span className="text-[#1EBBA3]">HUB</span>
        </h1>
        <div className="flex gap-3">
          <Button
            asChild
            className="bg-white text-[#1EBBA3] border border-[#1EBBA3]/20 px-4 py-2 rounded-[4px] hover:bg-[#1EBBA3]/5 transition-all shadow-sm"
          >
            <Link href="/">Back to Dashboard</Link>
          </Button>

          {interviews.length === 0 && (
            <Button
              className="bg-[#1EBBA3] text-white px-4 py-2 rounded-[4px] hover:bg-[#1EBBA3]/90 transition-all shadow-sm"
              onClick={async () => {
                setLoading(true);
                try {
                  const userId = user?.uid || user?.id || "mock-user-123";
                  const response = await fetch(
                    `/api/generate-mock-data?userId=${userId}`
                  );
                  if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.interviews) {
                      setInterviews(data.interviews);
                      alert("Generated mock interview data for testing!");
                    }
                  }
                } catch (error) {
                  console.error("Error generating mock data:", error);
                  alert(
                    "Failed to generate mock data. See console for details."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              Generate Test Data
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[4px] p-8 border border-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Your Past Interviews
        </h2>

        {interviews && interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.uid}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-[4px] bg-[#1EBBA3]/20 p-4 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#1EBBA3]"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              No interviews yet
            </h3>
            <p className="text-gray-600 max-w-md">
              Complete your first interview to see your history and performance
              analytics here
            </p>
            <Button
              asChild
              className="bg-[#1EBBA3] text-white px-6 py-3 rounded-[4px] font-medium transition-all duration-200 hover:bg-[#18A08B] hover:shadow-[#1EBBA3]/20 hover:shadow-lg shadow-md mt-4"
            >
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[4px] p-8 border border-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Interview Statistics
        </h2>

        {interviews && interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[4px] p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-[4px] bg-[#1EBBA3]/20 p-3">
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
                    className="text-[#1EBBA3]"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  Total Interviews
                </h3>
              </div>
              <p className="text-3xl font-bold text-[#1EBBA3]">
                {interviews.length}
              </p>
            </div>

            <div className="bg-white rounded-[4px] p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-[4px] bg-[#1EBBA3]/20 p-3">
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
                    className="text-[#1EBBA3]"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  Average Score
                </h3>
              </div>
              <p className="text-3xl font-bold text-[#1EBBA3]">75</p>
            </div>

            <div className="bg-white rounded-[4px] p-6 border border-gray-200 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-[4px] bg-[#1EBBA3]/20 p-3">
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
                    className="text-[#1EBBA3]"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">
                  Practice Time
                </h3>
              </div>
              <p className="text-3xl font-bold text-[#1EBBA3]">
                {interviews.length * 15} min
              </p>
            </div>
          </div>
        ) : (
          <div className="text-gray-600 text-center py-6 bg-[#1EBBA3]/5 rounded-[4px] border border-[#1EBBA3]/20">
            Complete interviews to see your statistics
          </div>
        )}
      </div>
    </div>
  );
}
