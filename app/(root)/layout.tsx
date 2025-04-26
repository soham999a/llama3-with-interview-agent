"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { isAuthenticated, signOut, getCurrentUser } from "@/lib/actions/auth.action";
import ChatBot from "@/components/ChatBot";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isUserAuthenticated = await isAuthenticated();
        if (!isUserAuthenticated) {
          router.push('/sign-in');
          return;
        }

        const user = await getCurrentUser();
        if (user) {
          setUserName(user.name || 'User');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-200"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[220px] bg-dark-100 min-h-screen p-4 flex flex-col border-r border-white/5">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="bg-red-500 rounded-full p-1.5">
            <Image src="/logo.svg" alt="Interview Agent Logo" width={24} height={24} />
          </div>
          <h2 className="text-white text-lg font-semibold">LLAMA3<br/>INTERVIEW</h2>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <span className="text-light-400 text-sm">{userName}</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-1">
          <Link href="/" className="text-light-300 hover:bg-dark-200 px-3 py-2.5 rounded-md transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-500">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Dashboard
          </Link>
          <Link href="/interview" className="text-light-300 hover:bg-dark-200 px-3 py-2.5 rounded-md transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-500">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            New Interview
          </Link>
          <Link href="/history" className="text-light-300 hover:bg-dark-200 px-3 py-2.5 rounded-md transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-500">
              <path d="M12 8v4l3 3"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            History
          </Link>
          <Link href="/settings" className="text-light-300 hover:bg-dark-200 px-3 py-2.5 rounded-md transition-colors flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-500">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-gradient text-3xl font-bold">LLAMA3 INTERVIEW DASHBOARD</h1>

          <div className="flex items-center gap-3">
            {/* Chat Button */}
            <button className="glass-effect p-2.5 rounded-md hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-purple-700 shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
