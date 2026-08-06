import { getFunctions, httpsCallable } from "firebase/functions";
import { signInWithCustomToken } from "firebase/auth";
import { app, auth } from "@/lib/firebase";

export interface SendOtpResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  error?: string;
}

/**
 * Request an SMS OTP code to be sent to the student's registered mobile number
 */
export async function sendStudentOtpService(phone: string): Promise<SendOtpResult> {
  try {
    const functions = getFunctions(app);
    const sendOtpFn = httpsCallable<{ phone: string }, { success: boolean; message: string }>(
      functions,
      "sendStudentOtp"
    );

    const res = await sendOtpFn({ phone });
    return { success: true, message: res.data.message };
  } catch (err: any) {
    console.error("sendStudentOtpService Error:", err);
    return {
      success: false,
      error: err.message || "Failed to send SMS OTP code.",
    };
  }
}

/**
 * Verify OTP code and log the student into Firebase Auth via Custom Token
 */
export async function verifyStudentOtpService(phone: string, otp: string): Promise<VerifyOtpResult> {
  try {
    const functions = getFunctions(app);
    const verifyOtpFn = httpsCallable<{ phone: string; otp: string }, { success: boolean; customToken: string }>(
      functions,
      "verifyStudentOtp"
    );

    const res = await verifyOtpFn({ phone, otp });
    
    if (res.data.customToken) {
      await signInWithCustomToken(auth, res.data.customToken);
      return { success: true };
    } else {
      return { success: false, error: "Authentication failed. Token missing." };
    }
  } catch (err: any) {
    console.error("verifyStudentOtpService Error:", err);
    return {
      success: false,
      error: err.message || "Invalid or expired OTP code.",
    };
  }
}
