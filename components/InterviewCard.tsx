"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (userId && interviewId) {
        try {
          const feedbackData = await getFeedbackByInterviewId({
            interviewId,
            userId,
          });
          setFeedback(feedbackData);
        } catch (error) {
          console.error('Error fetching feedback:', error);
        }
      }
      setLoading(false);
    };

    fetchFeedback();
  }, [interviewId, userId]);

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 w-full border border-white/5 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col h-full items-center justify-center py-8 relative z-10">
          <div className="size-16 relative mb-4">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ping"></div>
            <div className="relative size-full rounded-full border-2 border-t-purple-500 border-r-purple-400 border-b-purple-300 border-l-transparent animate-spin"></div>
          </div>
          <p className="text-gray-300 font-medium">Loading interview data...</p>
          <div className="mt-4 w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 w-full border border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-600/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg capitalize group-hover:text-purple-300 transition-colors duration-300">{role} Interview</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                  {normalizedType}
                </span>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-3 py-2 rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <div className="flex flex-col">
                <div className="flex items-end">
                  <span className="text-white font-bold text-lg leading-none">{feedback?.totalScore || "--"}</span>
                  <span className="text-gray-400 text-xs ml-1">/100</span>
                </div>
                <span className="text-gray-400 text-xs">Score</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-5 bg-gray-800/50 px-3 py-1.5 rounded-lg w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formattedDate}</span>
        </div>

        {/* Tech Stack */}
        <div className="mb-5">
          <p className="text-gray-400 text-sm font-medium mb-2">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {typeof techstack === 'string' ?
              techstack.split(',').map((tech, index) => (
                <span key={index} className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                  {tech.trim()}
                </span>
              )) :
              techstack?.map((tech, index) => (
                <span key={index} className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                  {tech.trim()}
                </span>
              ))
            }
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-sm font-medium">Status:</p>
            <span className="text-xs font-medium text-white bg-gray-800 px-2 py-0.5 rounded-full">
              {feedback ? "Completed" : "In Progress"}
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${feedback ? "bg-green-500" : "bg-purple-600"}`}
              style={{ width: feedback ? "100%" : "30%" }}
            ></div>
          </div>
        </div>

        {/* Feedback or Placeholder Text */}
        <div className="flex-grow mb-5">
          <p className="text-gray-300 line-clamp-2 bg-gray-800/50 p-3 rounded-lg border-l-2 border-purple-500">
            {feedback?.finalAssessment ||
              "You haven't completed this interview yet. Continue to improve your skills."}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href={
              feedback
                ? `/interview/${interviewId}/feedback`
                : `/interview/${interviewId}`
            }
            className="block w-full"
          >
            <button className="purple-gradient text-white px-5 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-purple-500/20 hover:shadow-lg shadow-md w-full flex items-center justify-center gap-2 group">
              {feedback ? "View Feedback" : "Continue Interview"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
