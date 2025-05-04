"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";

export default function History() {
  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);

        const userInterviews = await getInterviewsByUserId(userData?.id!);
        setInterviews(userInterviews || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Interview History</h1>
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
        <h1 className="text-3xl font-bold text-white">Interview History</h1>
      </div>

      <div className="bg-dark-200 rounded-[2rem] p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Your Past Interviews</h2>

        {interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews.map((interview) => (
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-primary-200/20 p-4 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white">No interviews yet</h3>
            <p className="text-light-400 max-w-md">Complete your first interview to see your history and performance analytics here</p>
            <Button asChild className="btn-primary mt-4">
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="bg-dark-200 rounded-[2rem] p-8">
        <h2 className="text-xl font-semibold text-white mb-6">Interview Statistics</h2>

        {interviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-300 rounded-[1.5rem] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-primary-200/20 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Total Interviews</h3>
              </div>
              <p className="text-3xl font-bold text-primary-200">{interviews.length}</p>
            </div>

            <div className="bg-dark-300 rounded-[1.5rem] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-primary-200/20 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Average Score</h3>
              </div>
              <p className="text-3xl font-bold text-primary-200">75</p>
            </div>

            <div className="bg-dark-300 rounded-[1.5rem] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-full bg-primary-200/20 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Practice Time</h3>
              </div>
              <p className="text-3xl font-bold text-primary-200">{interviews.length * 15} min</p>
            </div>
          </div>
        ) : (
          <div className="text-light-400 text-center py-6">
            Complete interviews to see your statistics
          </div>
        )}
      </div>
    </div>
  );
}
