"use client";

import Link from "next/link";
import { ArrowLeft, HelpCircle, MessageSquare, Briefcase, BookOpen, Code } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#0070f3] hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers to common questions about using the LLAMA3 Interview Agent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <MessageSquare className="text-[#0070f3] w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Using the Chat Assistant</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Click the chat icon in the bottom right corner to open the chat assistant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Ask questions about interviews, coding problems, or get help navigating the platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Use the "Search the web" option to find interview resources online</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Click on action buttons to quickly navigate to relevant sections</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Briefcase className="text-[#0070f3] w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Interview Practice</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Start a new interview from the dashboard or interview page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Choose from different interview types: technical, behavioral, etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Receive personalized feedback on your answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Review your interview history to track your progress</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Code className="text-[#0070f3] w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Technical Features</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Powered by LLAMA3 AI for natural conversation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Practice coding problems with syntax highlighting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Get feedback on your technical answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Explore different technology stacks for interview preparation</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen className="text-[#0070f3] w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Resources</h2>
          </div>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Access interview tips and best practices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Browse job opportunities in the dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Use the chat assistant to search for specific resources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0070f3] font-bold">•</span>
              <span>Review your past interviews to learn from your experiences</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="text-[#0070f3] w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">Need More Help?</h2>
        </div>
        <p className="text-gray-600 mb-4">
          If you have any other questions or need assistance, you can use the chat assistant or contact our support team.
        </p>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => window.history.back()}
            className="bg-white text-[#0070f3] border border-[#0070f3] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Return to Previous Page
          </button>
          <Link 
            href="/"
            className="bg-[#0070f3] text-white px-4 py-2 rounded-lg hover:bg-[#0070f3]/90 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
