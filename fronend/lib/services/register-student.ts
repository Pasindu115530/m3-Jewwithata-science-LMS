import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

export interface RegisterStudentPayload {
  studentName: string;
  mobileNumber: string;
  whatsappNumber: string;
  gender: string;
  birthday: string;
  grade: string;
  schoolName: string;
  parentName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  password: string;
  studentType: "online_only" | "physical_online";
  physicalStudentId?: string;
  activationCode?: string;
  wantsPaperClass?: boolean;
}

export interface RegisterStudentResult {
  success: boolean;
  studentId?: string;
  email?: string;
  uid?: string;
  message?: string;
  error?: string;
}

export interface GetServiceConfigResult {
  success: boolean;
  serviceName?: string;
  grade?: string;
  fee?: number;
  currency?: string;
}

export async function registerStudentService(payload: RegisterStudentPayload): Promise<RegisterStudentResult> {
  try {
    const fn = httpsCallable<RegisterStudentPayload, RegisterStudentResult>(functions, "registerStudent");
    const res = await fn(payload);
    return res.data;
  } catch (err: any) {
    console.error("registerStudent error:", err);
    return {
      success: false,
      error: err.message || "Registration failed.",
    };
  }
}

export async function getServiceConfigService(grade?: string): Promise<GetServiceConfigResult> {
  try {
    const fn = httpsCallable<{ grade?: string }, GetServiceConfigResult>(functions, "getServiceConfig");
    const res = await fn({ grade });
    return res.data;
  } catch (err: any) {
    console.error("getServiceConfig error:", err);
    return {
      success: false,
      fee: 2500,
    };
  }
}
