"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { signOut } from "@/lib/actions/auth.client";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        // User is signed out
        router.push("/sign-in.html");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e6f7fa]">
        <p className="text-[#1EBBA3] font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6f7fa] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Interview Agent Logo" className="w-10 h-8" />
            <h1 className="text-2xl font-bold text-[#1EBBA3]">Interview Agent</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-[#1EBBA3] text-white rounded-md hover:bg-[#189e8a]"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p className="text-gray-600 mb-4">
            You're now signed in to Interview Agent. Start practicing your interview skills!
          </p>
          <button
            onClick={() => router.push("/interview")}
            className="px-6 py-3 bg-[#1EBBA3] text-white rounded-md hover:bg-[#189e8a]"
          >
            Start Interview
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Recent Interviews</h2>
          <p className="text-gray-600">
            You haven't completed any interviews yet. Start your first interview to see your results here.
          </p>
        </div>
      </div>
    </div>
  );
}
