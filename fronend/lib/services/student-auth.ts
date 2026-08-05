import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Secondary Firebase app instance to create student auth users without logging out current Admin
const secondaryApp = getApps().find((app) => app.name === "SecondaryAuthApp")
  || initializeApp(firebaseConfig, "SecondaryAuthApp");

const secondaryAuth = getAuth(secondaryApp);

export async function createStudentAuthUser(email: string, pass: string): Promise<string> {
  try {
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
    return credential.user.uid;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Generated student email is already in use.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("The password provided is too weak.");
    } else {
      throw new Error(error.message || "Failed to create user authentication account.");
    }
  }
}
