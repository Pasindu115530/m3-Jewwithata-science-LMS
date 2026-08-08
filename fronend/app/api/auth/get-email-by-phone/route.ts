import { NextRequest, NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK lazily
if (!getApps().length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");
  if (serviceAccount.project_id) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Fallback if environment variable is not formatted or provided
    try {
      const saPath = require("path").join(process.cwd(), "serviceAccountKey.json");
      const sa = require(saPath);
      initializeApp({
        credential: cert(sa),
      });
    } catch (e) {
      console.error("Firebase Admin initialization error:", e);
    }
  }
}

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

    const db = getFirestore();
    const usersRef = db.collection("users");

    let snap = await usersRef.where("mobileNumber", "==", cleanedPhone).get();
    if (snap.empty) {
      snap = await usersRef.where("whatsappNumber", "==", cleanedPhone).get();
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
