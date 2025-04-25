"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, HelpCircle, BookOpen, Code, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actions?: ChatAction[];
  isTyping?: boolean;
};

type ChatAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  url?: string;
  action?: () => void;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hi there! 👋 I\'m your interview assistant. I can help you prepare for technical interviews, solve coding problems, or navigate this platform.',
    sender: 'bot',
    timestamp: new Date(),
    actions: [
      {
        id: 'start-interview',
        label: 'Start an interview',
        icon: <Briefcase size={16} />,
        url: '/interview'
      },
      {
        id: 'common-issues',
        label: 'Common issues',
        icon: <HelpCircle size={16} />
      },
      {
        id: 'interview-tips',
        label: 'Interview tips',
        icon: <BookOpen size={16} />
      }
    ]
  },
  {
    id: '2',
    text: 'What would you like help with today?',
    sender: 'bot',
    timestamp: new Date(Date.now() + 100),
  },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // Add typing indicator
    const typingIndicatorId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, {
      id: typingIndicatorId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    }]);

    // Process the message and generate a response
    setTimeout(() => {
      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== typingIndicatorId));

      const userMessageLower = newMessage.toLowerCase();
      let botResponse: Message;

      // Check for common issues or questions
      if (userMessageLower.includes('error') || userMessageLower.includes('problem') || userMessageLower.includes('not working')) {
        botResponse = {
          id: Date.now().toString(),
          text: "I'm sorry to hear you're experiencing issues. Here are some common solutions that might help:",
          sender: 'bot',
          timestamp: new Date(),
          actions: [
            {
              id: 'refresh-page',
              label: 'Refresh the page',
              icon: <Code size={16} />
            },
            {
              id: 'clear-cache',
              label: 'Clear browser cache',
              icon: <HelpCircle size={16} />
            },
            {
              id: 'contact-support',
              label: 'Contact support',
              icon: <MessageSquare size={16} />
            }
          ]
        };
      }
      // Interview preparation questions
      else if (userMessageLower.includes('prepare') || userMessageLower.includes('interview') || userMessageLower.includes('question') || userMessageLower.includes('practice')) {
        botResponse = {
          id: Date.now().toString(),
          text: "Great! I can help you prepare for your interview. Here are some options:",
          sender: 'bot',
          timestamp: new Date(),
          actions: [
            {
              id: 'start-mock',
              label: 'Start mock interview',
              icon: <Briefcase size={16} />,
              url: '/interview'
            },
            {
              id: 'coding-questions',
              label: 'Practice coding questions',
              icon: <Code size={16} />
            },
            {
              id: 'interview-tips',
              label: 'Interview tips',
              icon: <BookOpen size={16} />
            }
          ]
        };
      }
      // Help with the platform
      else if (userMessageLower.includes('help') || userMessageLower.includes('how to') || userMessageLower.includes('guide')) {
        botResponse = {
          id: Date.now().toString(),
          text: "I'd be happy to help you navigate our platform. Here's what you can do:",
          sender: 'bot',
          timestamp: new Date(),
          actions: [
            {
              id: 'platform-tour',
              label: 'Platform tour',
              icon: <HelpCircle size={16} />
            },
            {
              id: 'features-guide',
              label: 'Features guide',
              icon: <BookOpen size={16} />
            },
            {
              id: 'settings-help',
              label: 'Settings help',
              icon: <Code size={16} />,
              url: '/settings'
            }
          ]
        };
      }
      // Default response for other queries
      else {
        const suggestions = [
          "Would you like to practice for a specific type of interview?",
          "Do you need help with technical or behavioral questions?",
          "Are you preparing for a particular role or company?",
          "Would you like to see your interview history and performance?"
        ];

        botResponse = {
          id: Date.now().toString(),
          text: `I'm here to help with your interview preparation. ${suggestions[Math.floor(Math.random() * suggestions.length)]}`,
          sender: 'bot',
          timestamp: new Date(),
          actions: [
            {
              id: 'technical',
              label: 'Technical interview',
              icon: <Code size={16} />
            },
            {
              id: 'behavioral',
              label: 'Behavioral interview',
              icon: <MessageSquare size={16} />
            },
            {
              id: 'history',
              label: 'View history',
              icon: <BookOpen size={16} />,
              url: '/history'
            }
          ]
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="relative z-50">
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className="flex items-center justify-center bg-gradient-to-r from-primary-200 to-blue-500 text-white rounded-full p-3 hover:opacity-90 transition-opacity shadow-lg relative z-50"
        aria-label="Open chat"
      >
        <MessageSquare size={20} />
        {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-8 w-80 sm:w-96 bg-dark-200 rounded-lg shadow-xl overflow-hidden animate-popup z-50">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-primary-200 to-blue-500 p-3 flex justify-between items-center">
            <h3 className="text-white font-medium">Interview Assistant</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-dark-100 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat messages */}
          <div className="h-96 overflow-y-auto p-4 bg-dark-300 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.isTyping ? (
                  <div className="flex items-center space-x-2 bg-dark-200 rounded-lg p-3 shadow-md">
                    <Loader2 size={16} className="animate-spin text-primary-200" />
                    <span className="text-light-100">Typing...</span>
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] rounded-lg p-3 shadow-md ${message.sender === 'user' ? 'bg-primary-200 text-dark-100' : 'bg-dark-200 text-white'}`}
                  >
                    <p className="font-medium">{message.text}</p>

                    {/* Action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map(action => (
                          <div key={action.id}>
                            {action.url ? (
                              <Link href={action.url}>
                                <Button
                                  size="sm"
                                  className="bg-dark-300 hover:bg-dark-400 text-white flex items-center gap-1.5 text-xs py-1 h-auto border border-primary-200/30 hover:border-primary-200"
                                >
                                  {action.icon}
                                  {action.label}
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-dark-300 hover:bg-dark-400 text-white flex items-center gap-1.5 text-xs py-1 h-auto border border-primary-200/30 hover:border-primary-200"
                                onClick={() => {
                                  // Handle action button click
                                  if (action.action) {
                                    action.action();
                                  } else {
                                    // Add a response based on the action clicked
                                    const response = {
                                      id: Date.now().toString(),
                                      text: `You selected: ${action.label}. Let me help you with that.`,
                                      sender: 'bot',
                                      timestamp: new Date()
                                    };
                                    setMessages(prev => [...prev, response]);
                                  }
                                }}
                              >
                                {action.icon}
                                {action.label}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-xs opacity-70 block mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-3 bg-dark-200 border-t border-dark-300">
            <div className="flex items-center gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about interviews..."
                className="flex-1 bg-dark-300 text-white rounded-md p-3 min-h-10 max-h-32 outline-none resize-none focus:ring-2 focus:ring-primary-200 transition-all border border-dark-400 focus:border-primary-200"
                rows={1}
                autoFocus={isOpen}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-primary-200 to-blue-500 text-white rounded-full p-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </div>
            <div className="mt-2 text-xs text-light-400 text-center">
              Try asking about interview tips, coding problems, or technical questions
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
