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
      <div className="w-[175px] bg-[#1a1a1a] min-h-screen p-4 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <Image src="/logo.svg" alt="Interview Agent Logo" width={32} height={28} />
          <h2 className="text-white text-lg font-semibold">Interview<br/>Agent</h2>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <span className="text-gray-300 text-sm">{userName}</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-1">
          <Link href="/" className="text-gray-300 hover:bg-[#252525] px-2 py-2 rounded transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Dashboard
          </Link>
          <Link href="/interview" className="text-gray-300 hover:bg-[#252525] px-2 py-2 rounded transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            New Interview
          </Link>
          <Link href="/history" className="text-gray-300 hover:bg-[#252525] px-2 py-2 rounded transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            History
          </Link>
          <Link href="/settings" className="text-gray-300 hover:bg-[#252525] px-2 py-2 rounded transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#121212] relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h1 className="text-white text-xl font-bold">Dashboard</h1>

          <div className="flex items-center gap-4">
            {/* Chat Button */}
            <button className="bg-[#2a2a2a] text-white p-2 rounded-full hover:bg-[#333333] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-4 py-2 rounded-md font-medium transition-colors"
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
