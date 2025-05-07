"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// Get current user (client-side version)
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if we have a cached user
    if (typeof window !== "undefined") {
      const cachedUser = localStorage.getItem("currentUser");
      if (cachedUser) {
        try {
          const { user, timestamp } = JSON.parse(cachedUser);
          // If the cache is less than 5 minutes old, use it
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            console.log("Using cached user:", user);
            return user as User;
          }
        } catch (e) {
          console.error("Error parsing cached user:", e);
        }
      }
    }

    // Otherwise check with Firebase
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          unsubscribe();

          // Cache the result
          if (user && typeof window !== "undefined") {
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                user,
                timestamp: Date.now(),
              })
            );
          }

          console.log("Current user from Firebase:", user);
          resolve(user);
        },
        (error) => {
          console.error("Auth state change error:", error);
          reject(error);
        }
      );
    });
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
