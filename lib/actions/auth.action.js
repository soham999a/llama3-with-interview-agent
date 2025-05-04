// This file integrates Firebase Authentication with MongoDB
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { cookies } from 'next/headers';
import { getDatabase } from '@/lib/db';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helper function to set session cookie
const setSessionCookie = async (user) => {
  const idToken = await user.getIdToken();
  cookies().set('session', idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
};

// Helper function to clear session cookie
const clearSessionCookie = () => {
  cookies().delete('session');
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setSessionCookie(user);
    
    // Get or create user profile in MongoDB
    await syncUserWithMongoDB(user);
    
    return { success: true, user };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error.message };
  }
};

// Sign up with email and password
export const signUp = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with name
    await updateProfile(user, { displayName: name });
    
    await setSessionCookie(user);
    
    // Create user profile in MongoDB
    await syncUserWithMongoDB({
      ...user,
      name: name
    });
    
    return { success: true, user };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const sessionCookie = cookies().get('session');
    return !!sessionCookie?.value;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Sync Firebase user with MongoDB
export const syncUserWithMongoDB = async (user) => {
  if (!user || !user.uid) return null;
  
  try {
    const db = await getDatabase();
    
    // Check if user profile exists
    const existingProfile = await db.collection('userProfiles').findOne({ userId: user.uid });
    
    if (existingProfile) {
      // Update last login time
      await db.collection('userProfiles').updateOne(
        { userId: user.uid },
        { $set: { updatedAt: new Date() } }
      );
      
      return existingProfile;
    }
    
    // Create new user profile
    const newProfile = {
      userId: user.uid,
      name: user.displayName || user.name || 'User',
      email: user.email || '',
      photoURL: user.photoURL || '',
      jobTitle: '',
      skills: [],
      experience: 0,
      targetRole: '',
      preferredInterviewTypes: [],
      completedInterviews: 0,
      averageScore: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('userProfiles').insertOne(newProfile);
    return { ...newProfile, _id: result.insertedId };
  } catch (error) {
    console.error('Error syncing user with MongoDB:', error);
    return null;
  }
};
