"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface InterviewerAvatarProps {
  size?: number;
  speaking?: boolean;
  className?: string;
}

const InterviewerAvatar = ({
  size = 120,
  speaking = false,
  className = "",
}: InterviewerAvatarProps) => {
  const [imageSrc, setImageSrc] = useState("/sanya-backup.png");

  // Handle image error by falling back to sanya.jpg
  const handleImageError = () => {
    setImageSrc("/sanya.jpg");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-teal-200/30 to-teal-300/30 rounded-full blur-md"></div>
      <div className="relative bg-white p-1 rounded-full border border-teal-100 shadow-lg">
        <div
          className="rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center overflow-hidden"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <Image
            src={imageSrc}
            alt="AI Interviewer"
            width={size}
            height={size}
            className="rounded-full object-cover"
            onError={handleImageError}
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      </div>
      {speaking && (
        <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-2 shadow-lg animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22"></line>
          </svg>
        </div>
      )}
    </div>
  );
};

export default InterviewerAvatar;
