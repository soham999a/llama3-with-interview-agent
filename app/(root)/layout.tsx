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
      <div className="w-[240px] bg-dark-200 min-h-screen p-6 flex flex-col gap-8 shadow-xl">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Interview Agent Logo" width={38} height={32} />
          <h2 className="text-primary-100 text-xl">Interview Agent</h2>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-2 mt-4 bg-dark-300 p-3 rounded-lg">
          <div className="bg-primary-200/20 rounded-full p-2">
            <User size={18} className="text-primary-200" />
          </div>
          <span className="text-light-100 text-sm font-medium">{userName}</span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-4 mt-6">
          <Link href="/" className="text-light-100 hover:text-primary-200 transition-colors flex items-center gap-3 p-2 rounded-lg hover:bg-dark-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Dashboard
          </Link>
          <Link href="/interview" className="text-light-100 hover:text-primary-200 transition-colors flex items-center gap-3 p-2 rounded-lg hover:bg-dark-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            New Interview
          </Link>
          <Link href="/history" className="text-light-100 hover:text-primary-200 transition-colors flex items-center gap-3 p-2 rounded-lg hover:bg-dark-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"></path>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
            History
          </Link>
          <Link href="/settings" className="text-light-100 hover:text-primary-200 transition-colors flex items-center gap-3 p-2 rounded-lg hover:bg-dark-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </Link>
        </div>

        {/* Spacer to push logout to the bottom */}
        <div className="mt-auto"></div>

        {/* Logout Button in Sidebar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-light-100 hover:text-primary-200 transition-colors p-2 rounded-lg hover:bg-dark-300 mt-4"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-dark-100 relative">
        {/* Top Buttons */}
        <div className="fixed top-8 right-8 z-50 flex items-center gap-4">
          {/* Chat Button */}
          <div className="relative">
            <ChatBot />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default Layout;
