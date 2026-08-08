import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Normalize phone number
    let cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.startsWith("94")) {
      cleanedPhone = "0" + cleanedPhone.substring(2);
    }
    if (!cleanedPhone.startsWith("0")) {
      cleanedPhone = "0" + cleanedPhone;
    }

    const usersRef = collection(db, "users");

    let q = query(usersRef, where("mobileNumber", "==", cleanedPhone));
    let snap = await getDocs(q);

    if (snap.empty) {
      q = query(usersRef, where("whatsappNumber", "==", cleanedPhone));
      snap = await getDocs(q);
    }

    if (snap.empty) {
      return NextResponse.json({ error: "No student account found registered with this mobile number." }, { status: 404 });
    }

    const userData = snap.docs[0].data();
    const email = userData.email;

    if (!email) {
      return NextResponse.json({ error: "Account record missing email key. Please sign in via SMS OTP." }, { status: 400 });
    }

    return NextResponse.json({ email });
  } catch (error: any) {
    console.error("API get-email-by-phone error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
