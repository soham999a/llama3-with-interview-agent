// This file provides client-side versions of auth functions
import { getAuth } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// Import the auth instance from our firebase-config.js file
import { auth } from "../firebase/firebase-config";

// Get current user (client-side version)
export const getCurrentUser = async () => {
  try {
    // First check if we have a cached user
    const cachedUser = localStorage.getItem("currentUser");
    if (cachedUser) {
      const { user, timestamp } = JSON.parse(cachedUser);
      // If the cache is less than 5 minutes old, use it
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return user;
      }
    }

    // Otherwise check with Firebase
    const user = await new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });

    // Cache the result
    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          user,
          timestamp: Date.now(),
        })
      );
    }

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Sign in with email and password (client-side version)
export const signIn = async (email, password) => {
  try {
    console.log("Attempting to sign in with:", email);

    // Add a small delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Sign in successful for:", email);

    // Update cache
    localStorage.setItem(
      "authState",
      JSON.stringify({
        isAuth: true,
        timestamp: Date.now(),
      })
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        user,
        timestamp: Date.now(),
      })
    );

    localStorage.setItem("user", JSON.stringify(user));

    // Redirect to dashboard
    window.location.href = "/";

    return { success: true, user };
  } catch (error) {
    console.error("Error signing in:", error);

    // Handle specific Firebase errors
    let errorMessage = "Failed to sign in. Please check your credentials.";

    if (error.code === "auth/invalid-credential") {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed login attempts. Please try again later.";
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email. Please sign up first.";
    }

    return { success: false, error: errorMessage, code: error.code };
  }
};

// Sign up with email and password (client-side version)
export const signUp = async (name, email, password) => {
  try {
    console.log("Signing up with:", { name, email });

    // Add a small delay to prevent rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("Firebase user created successfully:", user.uid);

    // Update user profile with name
    await updateProfile(user, { displayName: name });
    console.log("User profile updated with name:", name);

    // Store additional user data in MongoDB
    try {
      console.log("Storing user in MongoDB:", { uid: user.uid, name, email });

      // Skip MongoDB storage if we're in development mode without MongoDB running
      if (process.env.NODE_ENV === "development" && !process.env.MONGODB_URI) {
        console.log("Skipping MongoDB storage in development mode");
      } else {
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

        try {
          const result = await response.json();
          console.log("MongoDB user creation result:", result);

          if (!response.ok && response.status !== 200) {
            console.warn(
              "Failed to create user profile in MongoDB, but Firebase auth succeeded"
            );
          }
        } catch (jsonError) {
          console.warn("Error parsing MongoDB response:", jsonError);
        }
      }
    } catch (dbError) {
      console.warn("Error storing user in database:", dbError);
      // Continue anyway since Firebase auth succeeded
    }

    // Update cache
    localStorage.setItem(
      "authState",
      JSON.stringify({
        isAuth: true,
        timestamp: Date.now(),
      })
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        user,
        timestamp: Date.now(),
      })
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        name,
      })
    );

    // Redirect to dashboard
    window.location.href = "/";

    return { success: true, user };
  } catch (error) {
    console.error("Error signing up:", error);

    // Handle specific Firebase errors
    let errorMessage = "Failed to sign up. Please try again.";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "This email is already in use. Please sign in instead.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please use a stronger password.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address. Please check and try again.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many requests. Please try again later.";
    }

    return { success: false, error: errorMessage, code: error.code };
  }
};

// Sign out (client-side version)
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);

    // Clear cache
    localStorage.removeItem("authState");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");

    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
};

// Check if user is authenticated (client-side version)
export const isAuthenticated = async () => {
  try {
    // First check if we have a cached authentication state
    const cachedAuth = localStorage.getItem("authState");
    if (cachedAuth) {
      const { isAuth, timestamp } = JSON.parse(cachedAuth);
      // If the cache is less than 5 minutes old, use it
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return isAuth;
      }
    }

    // Otherwise check with Firebase
    const user = await getCurrentUser();
    const isAuth = !!user;

    // Cache the result
    localStorage.setItem(
      "authState",
      JSON.stringify({
        isAuth,
        timestamp: Date.now(),
      })
    );

    return isAuth;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};
