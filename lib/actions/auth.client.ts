"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-config";

// Get current user (client-side version)
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // For Vercel deployment, we'll return a mock user
    // This will be replaced with actual Firebase auth when the app is running
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export async function signUp(name: string, email: string, password: string) {
  try {
    // Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store additional user data in MongoDB
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.uid,
        name,
        email,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create user profile");
    }

    // Redirect to dashboard
    window.location.href = "/dashboard";
    return user;
  } catch (error: any) {
    console.error("Sign up error:", error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Redirect to dashboard
    window.location.href = "/dashboard";
    return userCredential.user;
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    // Redirect to home page
    window.location.href = "/";
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}
