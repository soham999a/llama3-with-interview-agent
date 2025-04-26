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
      <div className="bg-dark-200 rounded-lg p-6 w-full border border-white/5 card-shadow">
        <div className="flex flex-col h-full items-center justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-200 mb-4"></div>
          <p className="text-light-400">Loading interview data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-200 rounded-lg p-6 w-full border border-white/5 card-shadow card-hover">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-200/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium text-lg capitalize">{role} Interview</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-primary-200/10 text-primary-200 px-2 py-0.5 rounded-full text-xs">
                  {normalizedType}
                </span>
              </div>
            </div>
          </div>

          {feedback && (
            <div className="flex items-center gap-1 bg-primary-200/10 px-3 py-1.5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-200">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="text-primary-200 font-bold">{feedback?.totalScore || "--"}</span>
              <span className="text-light-400">/100</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-light-400 text-sm mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formattedDate}</span>
        </div>

        {/* Tech Stack */}
        <div className="mb-5">
          <p className="text-xs text-light-400 mb-2">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {typeof techstack === 'string' ?
              techstack.split(',').map((tech, index) => (
                <span key={index} className="bg-primary-200/10 text-primary-200 px-2.5 py-1 rounded-full text-xs">
                  {tech.trim()}
                </span>
              )) :
              techstack?.map((tech, index) => (
                <span key={index} className="bg-primary-200/10 text-primary-200 px-2.5 py-1 rounded-full text-xs">
                  {tech.trim()}
                </span>
              ))
            }
          </div>
        </div>

        {/* Feedback or Placeholder Text */}
        <div className="flex-grow mb-5">
          <p className="text-light-300 line-clamp-2">
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
            <button className="purple-gradient text-white px-4 py-2.5 rounded-md font-medium transition-all duration-200 hover:opacity-90 shadow-md w-full flex items-center justify-center gap-2">
              {feedback ? "View Feedback" : "Continue Interview"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
