"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, HelpCircle, BookOpen, Code, Briefcase, Search, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'google';
  timestamp: Date;
  actions?: ChatAction[];
  isTyping?: boolean;
  searchResults?: GoogleSearchResult[];
};

type ChatAction = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  url?: string;
  action?: () => void;
};

type GoogleSearchResult = {
  title: string;
  link: string;
  snippet: string;
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
        id: 'google-search',
        label: 'Search the web',
        icon: <Search size={16} />
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
    text: 'What would you like help with today? You can also search the web for interview resources.',
    sender: 'bot',
    timestamp: new Date(Date.now() + 100),
  },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const performGoogleSearch = async (query: string) => {
    setIsSearching(true);

    // Add user message showing the search
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `Searching for: ${query}`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add typing indicator
    const typingIndicatorId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, {
      id: typingIndicatorId,
      text: '',
      sender: 'google',
      timestamp: new Date(),
      isTyping: true
    }]);

    // Mock Google search results (in a real app, you would call an actual API)
    setTimeout(() => {
      // Remove typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== typingIndicatorId));

      // Mock search results based on query
      const mockResults: GoogleSearchResult[] = [
        {
          title: `Top Interview Questions for ${query}`,
          link: `https://example.com/interview-questions-${query.replace(/\s+/g, '-')}`,
          snippet: `Comprehensive guide to the most common ${query} interview questions and how to answer them effectively.`
        },
        {
          title: `${query} Interview Preparation Guide`,
          link: `https://example.com/${query.replace(/\s+/g, '-')}-prep`,
          snippet: `Learn how to prepare for ${query} interviews with our expert tips and practice questions.`
        },
        {
          title: `How to Ace Your ${query} Interview`,
          link: `https://example.com/ace-${query.replace(/\s+/g, '-')}-interview`,
          snippet: `Expert advice on how to stand out in your ${query} interview and impress potential employers.`
        }
      ];

      // Add Google search results message
      const googleResponse: Message = {
        id: Date.now().toString(),
        text: `Here are some search results for "${query}":`,
        sender: 'google',
        timestamp: new Date(),
        searchResults: mockResults
      };

      setMessages((prev) => [...prev, googleResponse]);
      setIsSearching(false);
      setSearchQuery('');
    }, 1500);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Check if this is a search query
    if (isSearching) {
      performGoogleSearch(newMessage);
      setNewMessage('');
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    // Check if message looks like a search query
    if (newMessage.toLowerCase().startsWith('search') ||
        newMessage.toLowerCase().includes('find information') ||
        newMessage.toLowerCase().includes('look up')) {

      // Extract the search query
      let searchTerm = newMessage;
      if (newMessage.toLowerCase().startsWith('search')) {
        searchTerm = newMessage.substring(6).trim();
      } else if (newMessage.toLowerCase().includes('find information')) {
        searchTerm = newMessage.substring(newMessage.toLowerCase().indexOf('find information') + 16).trim();
      } else if (newMessage.toLowerCase().includes('look up')) {
        searchTerm = newMessage.substring(newMessage.toLowerCase().indexOf('look up') + 7).trim();
      }

      if (searchTerm) {
        performGoogleSearch(searchTerm);
        return;
      }
    }

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
      {/* Modern floating chat toggle button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 group flex items-center justify-center bg-[#0070f3] text-white rounded-full p-3 sm:p-4 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl z-50 overflow-hidden hover:-translate-y-1"
        aria-label="Open chat"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af]/20 to-[#0070f3]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
        <div className="relative z-10 flex items-center justify-center">
          <MessageSquare size={20} className="group-hover:scale-110 transition-transform duration-300" />
        </div>
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f97316] rounded-full animate-pulse"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f97316] rounded-full animate-ping opacity-75"></span>
          </>
        )}
      </button>

      {/* Modern Chat window */}
      {isOpen && (
        <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-80 md:w-96 max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-popup z-50 border border-[#0070f3]/20 backdrop-blur-sm">
          {/* Modern Chat header */}
          <div className="bg-[#0070f3] p-3 sm:p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                {isSearching ? (
                  <Search size={14} className="text-white sm:w-4 sm:h-4" />
                ) : (
                  <MessageSquare size={14} className="text-white sm:w-4 sm:h-4" />
                )}
              </div>
              <h3 className="text-white font-medium text-base sm:text-lg">
                {isSearching ? "Google Search" : "Interview Assistant"}
              </h3>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 p-1.5 rounded-full hover:scale-110"
              aria-label="Close chat"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>

          {/* Modern Chat messages */}
          <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-4 bg-gray-50 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`mb-3 sm:mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.isTyping ? (
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-2.5 sm:p-3.5 shadow-md border border-blue-200">
                    <Loader2 size={14} className="animate-spin text-[#0070f3] sm:w-4 sm:h-4" />
                    <span className="text-gray-800 text-sm sm:text-base">Typing<span className="animate-pulse">...</span></span>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3.5 shadow-md ${
                      message.sender === 'user'
                        ? 'bg-[#0070f3] text-white'
                        : message.sender === 'google'
                        ? 'bg-white text-gray-800 border border-blue-200'
                        : 'bg-white text-gray-800 border border-blue-100'
                    }`}
                  >
                    {message.sender === 'google' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center justify-center w-5 h-5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                          </svg>
                        </div>
                        <span className="font-medium text-blue-600">Google Search</span>
                      </div>
                    )}

                    <p className="font-medium text-sm sm:text-base">{message.text}</p>

                    {/* Google Search Results */}
                    {message.searchResults && message.searchResults.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {message.searchResults.map((result, idx) => (
                          <div key={idx} className="bg-blue-50 rounded-lg p-3 border border-blue-100 hover:shadow-md transition-shadow">
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <h4 className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1">
                                {result.title}
                                <ExternalLink size={12} className="inline-block" />
                              </h4>
                              <span className="text-green-700 text-xs block mt-0.5 truncate">{result.link}</span>
                              <p className="text-gray-700 text-xs mt-1">{result.snippet}</p>
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                        {message.actions.map(action => (
                          <div key={action.id}>
                            {action.url ? (
                              <Link href={action.url}>
                                <Button
                                  size="sm"
                                  className="bg-white hover:bg-blue-50 text-gray-800 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs py-1 sm:py-1.5 h-auto border border-blue-200 hover:border-blue-400 rounded-full px-2 sm:px-3 transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,112,243,0.2)] hover:-translate-y-0.5"
                                >
                                  <span className="text-[#0070f3]">{action.icon}</span>
                                  {action.label}
                                </Button>
                              </Link>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-white hover:bg-blue-50 text-gray-800 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs py-1 sm:py-1.5 h-auto border border-blue-200 hover:border-blue-400 rounded-full px-2 sm:px-3 transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,112,243,0.2)] hover:-translate-y-0.5"
                                onClick={() => {
                                  // Handle action button click
                                  if (action.action) {
                                    action.action();
                                  } else if (action.id === 'google-search') {
                                    // Start Google search mode
                                    setIsSearching(true);
                                    const response = {
                                      id: Date.now().toString(),
                                      text: `What would you like to search for? Type your query below.`,
                                      sender: 'google',
                                      timestamp: new Date()
                                    };
                                    setMessages(prev => [...prev, response]);
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
                                <span className="text-[#0070f3]">{action.icon}</span>
                                {action.label}
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] sm:text-xs opacity-70 block mt-0.5 sm:mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Modern Chat input */}
          <div className="p-3 sm:p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isSearching ? "Enter your search query..." : "Ask me anything about interviews..."}
                className={`flex-1 text-sm sm:text-base rounded-lg p-2 sm:p-3 min-h-9 sm:min-h-10 max-h-32 outline-none resize-none focus:ring-2 transition-all duration-300 border placeholder-[var(--color-text)]/50 shadow-sm hover:shadow-md ${
                  isSearching
                    ? "bg-blue-50 text-blue-800 focus:ring-blue-500 border-blue-200 focus:border-blue-500 hover:shadow-blue-100"
                    : "bg-[var(--color-background)] text-[var(--color-text)] focus:ring-[var(--color-primary)] border-[var(--color-primary-20)] focus:border-[var(--color-primary)] hover:shadow-[var(--color-primary-10)]"
                }`}
                rows={1}
                autoFocus={isOpen}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`${isSearching ? 'bg-blue-600' : 'primary-gradient'} text-white rounded-full p-2 sm:p-2.5 hover:opacity-90 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed group hover:-translate-y-1`}
                aria-label={isSearching ? "Search" : "Send message"}
              >
                {isSearching ? (
                  <Search size={16} className="group-hover:scale-110 transition-transform duration-300 sm:w-[18px] sm:h-[18px]" />
                ) : (
                  <Send size={16} className="group-hover:scale-110 transition-transform duration-300 sm:w-[18px] sm:h-[18px]" />
                )}
              </Button>
            </div>
            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500 text-center font-light">
              {isSearching
                ? "Search for interview resources, tips, or questions"
                : "Try asking about interview tips, coding problems, or technical questions"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
