"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.client";
import Link from "next/link";

export default function Settings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="bg-dark-200 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          User Preferences
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-dark-300">
            <div>
              <h3 className="text-white font-medium">3D Elements</h3>
              <p className="text-light-400 text-sm">
                Enable 3D elements for a more immersive experience
              </p>
            </div>
            <div className="flex items-center">
              <Button className="bg-primary-200 text-dark-100 rounded-full px-4 py-2">
                Enabled
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-dark-300">
            <div>
              <h3 className="text-white font-medium">Notifications</h3>
              <p className="text-light-400 text-sm">
                Receive notifications about new features and updates
              </p>
            </div>
            <div className="flex items-center">
              <Button className="bg-primary-200 text-dark-100 rounded-full px-4 py-2">
                Enabled
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-dark-300">
            <div>
              <h3 className="text-white font-medium">Dark Mode</h3>
              <p className="text-light-400 text-sm">
                Use dark mode for the application interface
              </p>
            </div>
            <div className="flex items-center">
              <Button className="bg-primary-200 text-dark-100 rounded-full px-4 py-2">
                Enabled
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="text-white font-medium">Sound Effects</h3>
              <p className="text-light-400 text-sm">
                Enable sound effects during interviews
              </p>
            </div>
            <div className="flex items-center">
              <Button className="bg-primary-200 text-dark-100 rounded-full px-4 py-2">
                Enabled
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button className="btn-primary">Save Settings</Button>
        </div>
      </div>

      <div className="bg-dark-200 rounded-xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">
          Account Information
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-light-400 text-sm">Name</p>
            <p className="text-white">{user?.name || "User"}</p>
          </div>

          <div>
            <p className="text-light-400 text-sm">Email</p>
            <p className="text-white">{user?.email || "user@example.com"}</p>
          </div>

          <div>
            <p className="text-light-400 text-sm">Account Created</p>
            <p className="text-white">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            Delete Account
          </Button>

          <Button className="bg-dark-300 text-white hover:bg-dark-400">
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
