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
      <div className="w-[240px] bg-gray-900 min-h-screen p-6 flex flex-col border-r border-white/5 shadow-xl">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="purple-gradient rounded-full p-2 shadow-lg">
            <Image src="/logo.svg" alt="Interview Agent Logo" width={24} height={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-gradient text-xl font-bold">LLAMA3</h2>
            <span className="text-white text-sm font-medium">INTERVIEW AGENT</span>
          </div>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-black/30 rounded-lg border border-white/5">
          <div className="bg-purple-600/20 rounded-full p-2">
            <User size={18} className="text-purple-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{userName}</span>
            <span className="text-gray-400 text-xs">AI Interview User</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-1.5">
          <Link href="/" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all flex items-center gap-3 hover:bg-purple-600/10 group">
            <div className="bg-gray-800 group-hover:bg-purple-600/20 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-purple-400 transition-colors">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/interview" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all flex items-center gap-3 hover:bg-purple-600/10 group">
            <div className="bg-gray-800 group-hover:bg-purple-600/20 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-purple-400 transition-colors">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="font-medium">New Interview</span>
          </Link>
          <Link href="/history" className="text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all flex items-center gap-3 hover:bg-purple-600/10 group">
            <div className="bg-gray-800 group-hover:bg-purple-600/20 p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-purple-400 transition-colors">
                <path d="M12 8v4l3 3"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <span className="font-medium">History</span>
          </Link>

        </div>

        {/* Spacer to push logout to the bottom */}
        <div className="mt-auto"></div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg transition-all hover:bg-red-500/10 group"
        >
          <div className="bg-gray-800 group-hover:bg-red-500/20 p-2 rounded-lg transition-colors">
            <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-b from-gray-900 to-black relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-white/5 px-6 py-4 flex justify-between items-center">
          <h1 className="text-gradient text-2xl font-bold">LLAMA3 INTERVIEW DASHBOARD</h1>

          <div className="flex items-center gap-3">
            {/* Chat Button */}
            <button className="glass-effect p-2.5 rounded-lg hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            {/* Help Button */}
            <button className="glass-effect p-2.5 rounded-lg hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
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
