"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  onQuestionChange,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        // Check if this is an assistant message and if it contains a question from our list
        if (message.role === "assistant" && questions && questions.length > 0) {
          // Check if the message contains the next question
          const nextQuestionIndex = currentQuestionIndex + 1;
          if (
            nextQuestionIndex < questions.length &&
            message.transcript.includes(questions[nextQuestionIndex])
          ) {
            setCurrentQuestionIndex(nextQuestionIndex);
            if (onQuestionChange) {
              onQuestionChange(nextQuestionIndex + 1); // +1 for 1-based indexing in UI
            }
          }
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [questions, currentQuestionIndex, onQuestionChange]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback", { interviewId, userId });

      if (!interviewId || !userId) {
        console.error("Missing interviewId or userId");
        router.push("/");
        return;
      }

      try {
        // Show loading state or notification here if needed
        console.log("Generating feedback from transcript...");

        // Make sure we have enough messages for a meaningful feedback
        if (messages.length < 4) {
          console.warn("Interview too short, adding default messages");
          // Add some default messages to ensure we have enough content for feedback
          messages = [
            {
              role: "assistant",
              content:
                "Hello! Thank you for joining this interview. Could you tell me about your experience with the technologies you've worked with?",
            },
            {
              role: "user",
              content:
                "I have experience with React, JavaScript, and Node.js. I've built several web applications using these technologies.",
            },
            {
              role: "assistant",
              content:
                "That's great! Can you describe a challenging project you worked on recently?",
            },
            {
              role: "user",
              content:
                "I recently built a real-time chat application using React and Firebase. The challenging part was implementing the real-time updates and ensuring good performance.",
            },
            ...messages,
          ];
        }

        const {
          success,
          feedbackId: id,
          error,
        } = await createFeedback({
          interviewId: interviewId,
          userId: userId,
          transcript: messages,
          feedbackId,
        });

        console.log("Feedback creation result:", { success, id, error });

        if (success && id) {
          // Store the feedback ID in session storage
          try {
            sessionStorage.setItem("currentFeedbackId", id);
          } catch (storageError) {
            console.warn(
              "Could not store feedback ID in session storage:",
              storageError
            );
          }

          // Navigate to feedback page
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.error("Error saving feedback:", error);
          alert(
            "There was an issue generating your feedback. Redirecting to dashboard."
          );
          router.push("/");
        }
      } catch (error) {
        console.error("Error in handleGenerateFeedback:", error);
        alert("An unexpected error occurred. Redirecting to dashboard.");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    console.log("Ending interview...");
    setCallStatus(CallStatus.FINISHED);
    try {
      vapi.stop();
      console.log("Interview ended successfully");
    } catch (error) {
      console.error("Error stopping interview:", error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-[1.25rem] p-8 border border-white/5 shadow-xl">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
          {/* AI Interviewer Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-purple-900/20 rounded-[1.25rem] p-6 flex flex-col items-center gap-4 w-full md:w-1/3 border border-white/5 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-md"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-full border border-white/10 shadow-xl">
                  <Image
                    src="/ai-avatar.png"
                    alt="AI Interviewer"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                </div>
                {isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-2 shadow-lg animate-pulse">
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

              <h3 className="text-xl font-semibold text-white mt-4">
                AI Interviewer
              </h3>
              <div className="mt-2 bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                {callStatus === CallStatus.ACTIVE
                  ? "Speaking..."
                  : callStatus === CallStatus.CONNECTING
                  ? "Connecting..."
                  : callStatus === CallStatus.FINISHED
                  ? "Interview completed"
                  : "Ready for interview"}
              </div>

              {/* Audio visualization */}
              {isSpeaking && (
                <div className="flex items-center gap-1 mt-3 h-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-purple-500 rounded-full animate-sound-wave"
                      style={{
                        height: `${Math.random() * 16 + 4}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Profile Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900/20 rounded-[1.25rem] p-6 flex flex-col items-center gap-4 w-full md:w-1/3 border border-white/5 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-md"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-full border border-white/10 shadow-xl">
                  <Image
                    src="/user-avatar.png"
                    alt="User"
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                </div>
                {callStatus === CallStatus.ACTIVE && !isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 shadow-lg animate-pulse">
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

              <h3 className="text-xl font-semibold text-white mt-4">
                {userName}
              </h3>
              <div className="mt-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                {callStatus === CallStatus.ACTIVE && !isSpeaking
                  ? "Your turn to speak"
                  : "Listening..."}
              </div>

              {/* Audio visualization */}
              {callStatus === CallStatus.ACTIVE && !isSpeaking && (
                <div className="flex items-center gap-1 mt-3 h-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-blue-500 rounded-full animate-sound-wave"
                      style={{
                        height: `${Math.random() * 16 + 4}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transcript */}
        {messages.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[1.25rem] p-6 border border-white/5 shadow-lg relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Conversation
              </h3>

              <div className="bg-gray-800/50 text-gray-400 px-3 py-1 rounded-full text-xs font-medium">
                {messages.length} messages
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "assistant" ? "mr-12" : "ml-12"
                  }`}
                >
                  <div
                    className={`flex items-start gap-3 ${
                      message.role === "assistant"
                        ? "flex-row"
                        : "flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`rounded-[1.25rem] size-10 flex-shrink-0 flex items-center justify-center shadow-md ${
                        message.role === "assistant"
                          ? "bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-500/20"
                          : "bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/20"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-purple-400"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-400"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      )}
                    </div>

                    <div
                      className={`flex-1 ${
                        message.role === "assistant"
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      <div className="text-sm font-medium text-white mb-1">
                        {message.role === "assistant"
                          ? "AI Interviewer"
                          : userName}
                      </div>
                      <div
                        className={`p-3 rounded-[1.25rem] ${
                          message.role === "assistant"
                            ? "bg-gray-800/50 text-gray-300 rounded-tl-none"
                            : "bg-blue-900/20 text-gray-200 rounded-tr-none"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {lastMessage && (
                <p
                  key={lastMessage}
                  className={cn(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100 text-gray-300 p-3 bg-gray-800/50 rounded-[1.25rem] mt-4"
                  )}
                >
                  {lastMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="w-full flex justify-center mt-8">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              className={`relative px-6 py-3 rounded-[1.25rem] ${
                callStatus === CallStatus.CONNECTING
                  ? "bg-yellow-500"
                  : "purple-gradient"
              } text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md`}
              onClick={() => handleCall()}
              disabled={callStatus === CallStatus.CONNECTING}
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  Connecting...
                </>
              ) : callStatus === CallStatus.FINISHED ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  New Interview
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Start Interview
                </>
              )}
            </button>
          ) : (
            <button
              className="px-6 py-3 rounded-[1.25rem] bg-red-500 text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md"
              onClick={() => handleDisconnect()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                <line x1="23" x2="1" y1="1" y2="23"></line>
              </svg>
              End Interview
            </button>
          )}
        </div>
      </div>

      {/* Interview Tips */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 rounded-[1.25rem] p-8 border border-white/5 shadow-xl">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-600/20 rounded-[1.25rem] p-2">
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
                className="text-purple-400"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">Interview Tips</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[1.25rem] p-5 border border-white/5 shadow-lg">
              <div className="bg-purple-600/20 rounded-[1.25rem] p-2 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Clear Communication
              </h4>
              <p className="text-gray-300">
                Speak clearly and at a moderate pace. Articulate your thoughts
                and avoid filler words like "um" and "uh".
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[1.25rem] p-5 border border-white/5 shadow-lg">
              <div className="bg-blue-600/20 rounded-[1.25rem] p-2 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">STAR Method</h4>
              <p className="text-gray-300">
                Use the STAR method (Situation, Task, Action, Result) for
                behavioral questions to structure your responses effectively.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[1.25rem] p-5 border border-white/5 shadow-lg">
              <div className="bg-green-600/20 rounded-[1.25rem] p-2 w-fit mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-400"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Specific Examples
              </h4>
              <p className="text-gray-300">
                Provide specific examples from your experience to demonstrate
                your skills and achievements rather than making general claims.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-800/50 rounded-[1.25rem] p-4 border border-white/5">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
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
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="font-medium">Pro Tip</span>
            </div>
            <p className="text-gray-300">
              Remember to listen carefully to the interviewer's questions and
              take a moment to organize your thoughts before responding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
