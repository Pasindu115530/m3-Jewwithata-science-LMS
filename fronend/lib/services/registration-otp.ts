import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface SendRegistrationOtpResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyRegistrationOtpResult {
  success: boolean;
  sessionPhone?: string;
  message?: string;
  error?: string;
}

export async function sendRegistrationOtpService(phone: string): Promise<SendRegistrationOtpResult> {
  try {
    const fn = httpsCallable<{ phone: string }, SendRegistrationOtpResult>(functions, "sendRegistrationOtp");
    const res = await fn({ phone });
    return res.data;
  } catch (err: any) {
    console.error("sendRegistrationOtp error:", err);
    return {
      success: false,
      error: err.message || "Failed to send OTP code.",
    };
  }
}

export async function verifyRegistrationOtpService(phone: string, otp: string): Promise<VerifyRegistrationOtpResult> {
  try {
    const fn = httpsCallable<{ phone: string; otp: string }, VerifyRegistrationOtpResult>(functions, "verifyRegistrationOtp");
    const res = await fn({ phone, otp });
    return res.data;
  } catch (err: any) {
    console.error("verifyRegistrationOtp error:", err);
    return {
      success: false,
      error: err.message || "Failed to verify OTP code.",
    };
  }
}
