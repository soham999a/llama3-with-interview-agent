// Firebase configuration with hardcoded values to ensure it works
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_mYAk8rJwNXpJoMb_ZRHNpuWBwNgd9Iw",
  authDomain: "interview-agent-50c3b.firebaseapp.com",
  projectId: "interview-agent-50c3b",
  storageBucket: "interview-agent-50c3b.firebasestorage.app",
  messagingSenderId: "908064429361",
  appId: "1:908064429361:web:5cc5d8faa4cdfc9a3b0c10",
  measurementId: "G-S1YEFW1H2K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
