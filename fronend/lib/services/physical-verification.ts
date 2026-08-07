import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface VerifyPhysicalStudentResult {
  success: boolean;
  physicalStudentId?: string;
  studentName?: string;
  grade?: string;
  batch?: string;
  message?: string;
  error?: string;
}

export interface VerifyActivationCodeResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function verifyPhysicalStudentService(phone: string, smartCardLast4: string): Promise<VerifyPhysicalStudentResult> {
  try {
    const fn = httpsCallable<{ phone: string; smartCardLast4: string }, VerifyPhysicalStudentResult>(functions, "verifyPhysicalStudent");
    const res = await fn({ phone, smartCardLast4 });
    return res.data;
  } catch (err: any) {
    console.error("verifyPhysicalStudent error:", err);
    return {
      success: false,
      error: err.message || "Failed to verify Smart Card.",
    };
  }
}

export async function verifyActivationCodeService(physicalStudentId: string, activationCode: string): Promise<VerifyActivationCodeResult> {
  try {
    const fn = httpsCallable<{ physicalStudentId: string; activationCode: string }, VerifyActivationCodeResult>(functions, "verifyActivationCode");
    const res = await fn({ physicalStudentId, activationCode });
    return res.data;
  } catch (err: any) {
    console.error("verifyActivationCode error:", err);
    return {
      success: false,
      error: err.message || "Failed to verify Activation Code.",
    };
  }
}
