import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();

const auth = getAuth();
const db = getFirestore();

// Helper: Normalize Sri Lankan local phone number format (07XXXXXXXX)
function normalizePhoneLocal(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("94")) {
    cleaned = "0" + cleaned.substring(2);
  }
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned;
  }
  return cleaned;
}

// Helper: Format phone to Sri Lankan international format without plus (e.g. 94771234567)
function formatPhoneForTextLk(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "94" + cleaned.substring(1);
  } else if (!cleaned.startsWith("94")) {
    cleaned = "94" + cleaned;
  }
  return cleaned;
}

// Helper: send SMS via text.lk HTTP API
async function sendSmsTextLk(recipientPhone: string, message: string): Promise<boolean> {
  const token: string = process.env.TEXTLK_API_TOKEN || "6391|wxBuhnjBsvpT6fBayumubRBxm9andmxWSAYPsL9W503ffb90";
  const senderId: string = "TextLKDemo";
  
  const recipientFormatted = formatPhoneForTextLk(recipientPhone);

  const url = new URL("https://app.text.lk/api/http/sms/send");
  url.searchParams.append("recipient", recipientFormatted);
  url.searchParams.append("sender_id", senderId);
  url.searchParams.append("message", message);
  url.searchParams.append("api_token", token);  

  try {
    const res = await fetch(url.toString());
    const data = (await res.json()) as any;
    console.log("text.lk HTTP API Response:", data);
    return res.ok && (data.status === "success" || data.code === 200 || data.status === 200 || !!data.data);
  } catch (err) {
    console.error("Failed to send SMS via text.lk:", err);
    return false;
  }
}

// ─── sendStudentOtp ────────────────────────────────────────────────────────────
export const sendStudentOtp = onCall(async (request) => {
  try {
    const { phone } = request.data as { phone: string };
    if (!phone) {
      throw new HttpsError("invalid-argument", "Phone number is required.");
    }

    const normalizedPhone = normalizePhoneLocal(phone);

    // Look up student in Firestore users collection
    const usersRef = db.collection("users");
    let snap = await usersRef.where("mobileNumber", "==", normalizedPhone).where("role", "==", "student").get();
    
    // Fallback check for whatsappNumber if not found in mobileNumber
    if (snap.empty) {
      snap = await usersRef.where("whatsappNumber", "==", normalizedPhone).where("role", "==", "student").get();
    }

    if (snap.empty) {
      throw new HttpsError("not-found", "No student account found registered with this mobile number.");
    }

    const studentDoc = snap.docs[0];
    const uid = studentDoc.id;

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    // Save OTP in otpCodes collection
    await db.collection("otpCodes").doc(normalizedPhone).set({
      otp,
      uid,
      phone: normalizedPhone,
      expiresAt,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send SMS via text.lk
    const message = `Your Science LMS Verification Code is: ${otp}. Valid for 5 minutes.`;
    await sendSmsTextLk(normalizedPhone, message);

    return { success: true, message: "OTP sent successfully to " + normalizedPhone };
  } catch (err: any) {
    console.error("Error in sendStudentOtp:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to send OTP.");
  }
});

// ─── verifyStudentOtp ──────────────────────────────────────────────────────────
export const verifyStudentOtp = onCall(async (request) => {
  try {
    const { phone, otp } = request.data as { phone: string; otp: string };
    if (!phone || !otp) {
      throw new HttpsError("invalid-argument", "Phone number and OTP code are required.");
    }

    const normalizedPhone = normalizePhoneLocal(phone);
    const otpRef = db.collection("otpCodes").doc(normalizedPhone);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      throw new HttpsError("not-found", "No OTP code request found for this phone number. Please request a new code.");
    }

    const otpData = otpDoc.data()!;

    if (Date.now() > otpData.expiresAt) {
      await otpRef.delete();
      throw new HttpsError("deadline-exceeded", "The OTP code has expired. Please request a new one.");
    }

    if (otpData.otp !== otp.trim()) {
      throw new HttpsError("invalid-argument", "Invalid OTP code. Please check and try again.");
    }

    // OTP verified! Delete it so it cannot be reused
    await otpRef.delete();

    // Mint a custom auth token for Firebase Auth login
    const customToken = await auth.createCustomToken(otpData.uid, { role: "student" });

    return { success: true, customToken };
  } catch (err: any) {
    console.error("Error in verifyStudentOtp:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to verify OTP.");
  }
});

// ─── enrollStudentInCourse ───────────────────────────────────────────────────
export const enrollStudentInCourse = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated to enroll.");
    }

    const { courseId } = request.data as { courseId: string };
    if (!courseId) {
      throw new HttpsError("invalid-argument", "Course ID is required.");
    }

    const uid = request.auth.uid;

    // Payment check removed: Any student can enroll in a course!
    // Content inside the course remains locked until monthly payment is completed.
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    const enrolledClasses: string[] = userDoc.exists ? userDoc.data()?.enrolledClasses || [] : [];
    const enrollments = userDoc.exists ? userDoc.data()?.enrollments || {} : {};

    if (!enrolledClasses.includes(courseId)) {
      enrolledClasses.push(courseId);
    }

    const enrolledAtIso = new Date().toISOString();
    enrollments[courseId] = {
      enrolledAt: enrolledAtIso,
      status: "active",
    };

    await userRef.set(
      {
        enrolledClasses,
        enrollments,
        updatedAt: enrolledAtIso,
      },
      { merge: true }
    );

    return {
      success: true,
      message: "Successfully enrolled in course.",
      enrolledAt: enrolledAtIso,
    };
  } catch (err: any) {
    console.error("Error in enrollStudentInCourse:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to enroll in course.");
  }
});

