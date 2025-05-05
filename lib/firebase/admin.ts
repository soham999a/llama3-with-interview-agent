import * as firebaseAdmin from "firebase-admin";
import { getApps } from "firebase-admin/app";

// Initialize Firebase Admin SDK
if (!getApps().length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace newlines in the private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const admin = firebaseAdmin;
