"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Menu, X } from "lucide-react";

import { isAuthenticated, signOut, getCurrentUser } from "@/lib/actions/auth.action";

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`w-[280px] md:w-[240px] bg-[#1EBBA3] min-h-screen p-6 flex flex-col border-r border-white/10 shadow-xl fixed md:sticky top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
           onClick={(e) => e.target === e.currentTarget && setIsMobileMenuOpen(false)}>
        {/* Mobile Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white md:hidden hover:bg-white/30 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <Image src="/logo.svg" alt="Interview Agent Logo" width={24} height={24} className="text-[#0070f3]" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-white text-xl font-bold">LLAMA3</h2>
            <span className="text-white/80 text-sm font-medium">INTERVIEW AGENT</span>
          </div>
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-white/20 rounded-3xl border border-white/10">
          <div className="bg-white/30 rounded-full p-2">
            <User size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{userName}</span>
            <span className="text-white/70 text-xs">AI Interview User</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-1.5">
          <Link href="/" className="text-white hover:text-white px-4 py-3 rounded-3xl transition-all flex items-center gap-3 hover:bg-[#18A08B] group">
            <div className="bg-white/20 group-hover:bg-white/30 p-2 rounded-2xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-white transition-colors">
                <rect x="3" y="3" width="7" height="9"></rect>
                <rect x="14" y="3" width="7" height="5"></rect>
                <rect x="14" y="12" width="7" height="9"></rect>
                <rect x="3" y="16" width="7" height="5"></rect>
              </svg>
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/interview" className="text-white hover:text-white px-4 py-3 rounded-3xl transition-all flex items-center gap-3 hover:bg-[#18A08B] group">
            <div className="bg-white/20 group-hover:bg-white/30 p-2 rounded-2xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-white transition-colors">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span className="font-medium">New Interview</span>
          </Link>
          <Link href="/history" className="text-white hover:text-white px-4 py-3 rounded-3xl transition-all flex items-center gap-3 hover:bg-[#18A08B] group">
            <div className="bg-white/20 group-hover:bg-white/30 p-2 rounded-2xl transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white group-hover:text-white transition-colors">
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
          className="mt-6 flex items-center gap-3 text-white hover:text-white px-4 py-3 rounded-3xl transition-all hover:bg-[#f97316] group"
        >
          <div className="bg-white/20 group-hover:bg-white/30 p-2 rounded-2xl transition-colors">
            <LogOut size={16} className="text-white group-hover:text-white transition-colors" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 relative w-full md:ml-[240px]">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Mobile Header */}
        <div className="sticky top-0 z-20 w-full flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-200 md:hidden shadow-sm">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-[#1EBBA3] hover:bg-[#1EBBA3] hover:text-white transition-colors shadow-sm active:scale-95"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-[#1EBBA3] rounded-full p-1.5 shadow-lg">
              <Image src="/logo.svg" alt="Interview Agent Logo" width={18} height={18} className="text-white" />
            </div>
            <h2 className="text-[#1EBBA3] text-lg font-bold">LLAMA3</h2>
          </div>

          <Link href="/interview" aria-label="Start Interview">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1EBBA3] text-white hover:bg-[#18A08B] transition-colors shadow-sm active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex sticky top-0 z-10 backdrop-blur-md bg-white/90 border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 justify-between items-center">
          <h1 className="text-[#1EBBA3] text-xl lg:text-2xl font-bold">LLAMA3 INTERVIEW DASHBOARD</h1>

          <div className="flex items-center gap-3">
            {/* Help Button */}
            <button
              onClick={() => window.open('/help', '_blank')}
              className="bg-white p-2.5 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1EBBA3]">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-6 pt-16 md:pt-20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
