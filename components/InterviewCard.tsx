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
      <div className="bg-[#1e1e1e] rounded-lg p-6 w-full">
        <div className="flex flex-col h-full items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7c3aed] mb-4"></div>
          <p className="text-gray-400">Loading interview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] rounded-lg p-6 w-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c3aed]">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium capitalize">{role} Interview</h3>
              <p className="text-xs text-gray-400">{normalizedType}</p>
            </div>
          </div>

          {feedback && (
            <div className="flex items-center gap-1 bg-[#7c3aed]/10 px-3 py-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7c3aed]">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="text-[#7c3aed] font-bold">{feedback?.totalScore || "--"}</span>
              <span className="text-gray-400">/100</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formattedDate}</span>
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {typeof techstack === 'string' ?
              techstack.split(',').map((tech, index) => (
                <span key={index} className="bg-[#7c3aed]/10 text-[#7c3aed] px-2 py-1 rounded-full text-xs">
                  {tech.trim()}
                </span>
              )) :
              techstack?.map((tech, index) => (
                <span key={index} className="bg-[#7c3aed]/10 text-[#7c3aed] px-2 py-1 rounded-full text-xs">
                  {tech.trim()}
                </span>
              ))
            }
          </div>
        </div>

        {/* Feedback or Placeholder Text */}
        <div className="flex-grow mb-4">
          <p className="text-gray-300 line-clamp-2">
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
            <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-md font-medium transition-colors w-full">
              {feedback ? "View Feedback" : "Continue Interview"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
