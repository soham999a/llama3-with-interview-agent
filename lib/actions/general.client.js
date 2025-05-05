// Client-side version of general actions
import { db } from "@/lib/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

// Get interviews by user ID (client-side version)
export const getInterviewsByUserId = async (userId) => {
  if (!userId) return [];

  try {
    const interviewsRef = collection(db, "interviews");
    const q = query(
      interviewsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }
};

// Get interview by ID (client-side version)
export const getInterviewById = async (id) => {
  if (!id) return null;

  try {
    // First try to get the interview from session storage
    const sessionInterview = sessionStorage.getItem("currentInterview");
    if (sessionInterview) {
      try {
        const parsedInterview = JSON.parse(sessionInterview);
        if (parsedInterview && parsedInterview.id === id) {
          console.log("Using interview from session storage:", parsedInterview);
          return parsedInterview;
        }
      } catch (e) {
        console.error("Error parsing interview from session storage:", e);
      }
    }

    // If not in session storage, try to get from Firestore
    console.log("Fetching interview from Firestore:", id);
    const interviewsRef = collection(db, "interviews");
    const q = query(interviewsRef, where("__name__", "==", id));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.error("Interview not found in Firestore:", id);
      return null;
    }

    const doc = querySnapshot.docs[0];
    const interview = {
      id: doc.id,
      ...doc.data(),
    };

    // Save to session storage for future use
    sessionStorage.setItem("currentInterview", JSON.stringify(interview));

    return interview;
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
};

// Get feedback by interview ID (client-side version)
export const getFeedbackByInterviewId = async ({ interviewId, userId }) => {
  if (!interviewId || !userId) return null;

  try {
    const feedbackRef = collection(db, "feedback");
    const q = query(
      feedbackRef,
      where("interviewId", "==", interviewId),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
};
