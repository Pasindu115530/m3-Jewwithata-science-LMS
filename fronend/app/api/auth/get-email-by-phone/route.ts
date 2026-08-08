import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Normalize Sri Lankan mobile numbers (0771234567, +94771234567, 94771234567, 771234567 -> 0771234567)
    let cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.startsWith("94")) {
      cleanedPhone = "0" + cleanedPhone.substring(2);
    }
    if (!cleanedPhone.startsWith("0")) {
      cleanedPhone = "0" + cleanedPhone;
    }

    // Sri Lankan mobile number validation (must be 10 digits starting with 07)
    if (!/^07\d{8}$/.test(cleanedPhone)) {
      return NextResponse.json({ error: "Invalid mobile number or password." }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const usersRef = adminDb.collection("users");

    let snap = await usersRef.where("mobileNumber", "==", cleanedPhone).limit(1).get();
    if (snap.empty) {
      snap = await usersRef.where("whatsappNumber", "==", cleanedPhone).limit(1).get();
    }

    if (snap.empty) {
      // Generic error response to prevent user account enumeration
      return NextResponse.json({ error: "Invalid mobile number or password." }, { status: 404 });
    }

    const userData = snap.docs[0].data();
    const email = userData.email;

    if (!email) {
      return NextResponse.json({ error: "Invalid mobile number or password." }, { status: 400 });
    }

    return NextResponse.json({ email });
  } catch (error: any) {
    console.error("=== FULL SERVER API ERROR ===");
    console.error("Message:", error?.message);
    console.error("Code:", error?.code);
    console.error("Stack:", error?.stack);
    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
        code: error?.code || null,
      },
      { status: 500 }
    );
  }
}
