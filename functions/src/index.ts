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

// ─── sendRegistrationOtp ──────────────────────────────────────────────────────
export const sendRegistrationOtp = onCall(async (request) => {
  try {
    const { phone } = request.data as { phone: string };
    if (!phone) {
      throw new HttpsError("invalid-argument", "Phone number is required.");
    }

    const normalizedPhone = normalizePhoneLocal(phone);

    const usersRef = db.collection("users");
    let snap = await usersRef.where("mobileNumber", "==", normalizedPhone).get();
    if (snap.empty) {
      snap = await usersRef.where("whatsappNumber", "==", normalizedPhone).get();
    }

    if (!snap.empty) {
      throw new HttpsError("already-exists", "This mobile number is already registered. Please sign in instead.");
    }

    const sessionRef = db.collection("registrationSessions").doc(normalizedPhone);
    const sessionDoc = await sessionRef.get();
    if (sessionDoc.exists) {
      const data = sessionDoc.data()!;
      if (data.sentCount && data.sentCount >= 5 && Date.now() - (data.lastSentAt || 0) < 60 * 60 * 1000) {
        throw new HttpsError("resource-exhausted", "Too many OTP requests for this phone number. Please wait 1 hour.");
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const existingSentCount = sessionDoc.exists ? (sessionDoc.data()?.sentCount || 0) : 0;

    await sessionRef.set({
      otp,
      phone: normalizedPhone,
      expiresAt,
      verified: false,
      sentCount: existingSentCount + 1,
      lastSentAt: Date.now(),
      createdAt: FieldValue.serverTimestamp(),
    });

    const message = `Your Science LMS Registration OTP is: ${otp}. Valid for 5 minutes.`;
    await sendSmsTextLk(normalizedPhone, message);

    return { success: true, message: "OTP sent to " + normalizedPhone };
  } catch (err: any) {
    console.error("Error in sendRegistrationOtp:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to send registration OTP.");
  }
});

// ─── verifyRegistrationOtp ────────────────────────────────────────────────────
export const verifyRegistrationOtp = onCall(async (request) => {
  try {
    const { phone, otp } = request.data as { phone: string; otp: string };
    if (!phone || !otp) {
      throw new HttpsError("invalid-argument", "Phone number and OTP code are required.");
    }

    const normalizedPhone = normalizePhoneLocal(phone);
    const sessionRef = db.collection("registrationSessions").doc(normalizedPhone);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new HttpsError("not-found", "No OTP request found for this phone number. Please request a code.");
    }

    const sessionData = sessionDoc.data()!;

    if (Date.now() > sessionData.expiresAt) {
      throw new HttpsError("deadline-exceeded", "The OTP code has expired. Please request a new one.");
    }

    if (sessionData.otp !== otp.trim()) {
      throw new HttpsError("invalid-argument", "Invalid OTP code. Please check and try again.");
    }

    await sessionRef.update({
      verified: true,
      verifiedAt: new Date().toISOString(),
    });

    return { success: true, sessionPhone: normalizedPhone, message: "Phone number verified successfully!" };
  } catch (err: any) {
    console.error("Error in verifyRegistrationOtp:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to verify registration OTP.");
  }
});

// ─── verifyPhysicalStudent ────────────────────────────────────────────────────
export const verifyPhysicalStudent = onCall(async (request) => {
  try {
    const { phone, smartCardLast4 } = request.data as { phone: string; smartCardLast4: string };
    if (!phone || !smartCardLast4) {
      throw new HttpsError("invalid-argument", "Phone number and smart card last 4 digits are required.");
    }

    const normalizedPhone = normalizePhoneLocal(phone);
    const cleanLast4 = smartCardLast4.trim();

    const physRef = db.collection("physicalStudents");
    const snap = await physRef
      .where("mobileNumber", "==", normalizedPhone)
      .where("smartCardLast4", "==", cleanLast4)
      .get();

    if (snap.empty) {
      throw new HttpsError("not-found", "No physical student record matches this phone number and Smart Card last 4 digits.");
    }

    const physDoc = snap.docs[0];
    const physData = physDoc.data();

    if (physData.physicalAccountLinked) {
      throw new HttpsError("already-exists", "This physical student Smart Card is already linked to a registered account.");
    }

    return {
      success: true,
      physicalStudentId: physDoc.id,
      studentName: physData.studentName,
      grade: physData.grade,
      batch: physData.batch || "",
      message: "Smart Card verified! Please enter your Activation Code.",
    };
  } catch (err: any) {
    console.error("Error in verifyPhysicalStudent:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to verify physical student record.");
  }
});

// ─── verifyActivationCode ─────────────────────────────────────────────────────
export const verifyActivationCode = onCall(async (request) => {
  try {
    const { physicalStudentId, activationCode } = request.data as { physicalStudentId: string; activationCode: string };
    if (!physicalStudentId || !activationCode) {
      throw new HttpsError("invalid-argument", "Physical Student ID and Activation Code are required.");
    }

    const physRef = db.collection("physicalStudents").doc(physicalStudentId);
    const physDoc = await physRef.get();

    if (!physDoc.exists) {
      throw new HttpsError("not-found", "Physical student record not found.");
    }

    const physData = physDoc.data()!;

    if (physData.physicalAccountLinked) {
      throw new HttpsError("already-exists", "This physical student card has already been activated.");
    }

    if (physData.activationCode.trim() !== activationCode.trim()) {
      throw new HttpsError("invalid-argument", "Invalid Activation Code. Please check your physical card sleeve.");
    }

    return { success: true, message: "Physical Student Verification Complete! ✓" };
  } catch (err: any) {
    console.error("Error in verifyActivationCode:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to verify activation code.");
  }
});

// ─── registerStudent ──────────────────────────────────────────────────────────
export const registerStudent = onCall(async (request) => {
  try {
    const data = request.data as {
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
    };

    if (!data.studentName || !data.mobileNumber || !data.password || !data.grade) {
      throw new HttpsError("invalid-argument", "Missing required registration fields.");
    }

    const normalizedPhone = normalizePhoneLocal(data.mobileNumber);
    const sessionRef = db.collection("registrationSessions").doc(normalizedPhone);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists || !sessionDoc.data()?.verified) {
      throw new HttpsError("failed-precondition", "Mobile number has not been OTP verified. Please verify phone number first.");
    }

    let physicalStudentData: any = null;
    if (data.studentType === "physical_online") {
      if (!data.physicalStudentId || !data.activationCode) {
        throw new HttpsError("invalid-argument", "Physical student verification parameters missing.");
      }
      const physRef = db.collection("physicalStudents").doc(data.physicalStudentId);
      const physDoc = await physRef.get();
      if (!physDoc.exists) {
        throw new HttpsError("not-found", "Physical student record not found.");
      }
      physicalStudentData = physDoc.data();
      if (physicalStudentData.physicalAccountLinked) {
        throw new HttpsError("already-exists", "This physical student card is already linked to another account.");
      }
      if (physicalStudentData.activationCode.trim() !== data.activationCode.trim()) {
        throw new HttpsError("invalid-argument", "Activation code mismatch.");
      }
    }

    const counterRef = db.collection("counters").doc("studentId");
    const nextSeq = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      let seq = 1001;
      if (counterDoc.exists) {
        seq = (counterDoc.data()?.lastNumber || 1000) + 1;
      }
      transaction.set(counterRef, { lastNumber: seq }, { merge: true });
      return seq;
    });

    const studentId = `STU${nextSeq}`;
    const generatedEmail = `${studentId.toLowerCase()}@student.kalaharascience.lk`;

    const userRecord = await auth.createUser({
      email: generatedEmail,
      password: data.password,
      displayName: data.studentName,
    });

    await auth.setCustomUserClaims(userRecord.uid, { role: "student" });

    const nowIso = new Date().toISOString();

    const userDocData = {
      role: "student",
      studentId,
      studentName: data.studentName,
      fullName: data.studentName,
      parentName: data.parentName || "",
      mobileNumber: normalizedPhone,
      whatsappNumber: normalizePhoneLocal(data.whatsappNumber || data.mobileNumber),
      gender: data.gender || "Male",
      birthday: data.birthday || "",
      grade: data.grade,
      schoolName: data.schoolName || "",
      classType: data.studentType === "physical_online" ? "Physical + Online" : "Online",
      studentType: data.studentType,
      isPhysicalStudent: data.studentType === "physical_online",
      physicalStudentId: data.physicalStudentId || null,
      hasOnlinePaperClassAccess: false,
      addressLine1: data.addressLine1 || "",
      addressLine2: data.addressLine2 || "",
      city: data.city || "",
      district: data.district || "",
      email: generatedEmail,
      status: "Active",
      admissionDate: nowIso.split("T")[0],
      selfRegistered: true,
      enrolledClasses: [],
      enrollments: {},
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(userRecord.uid).set(userDocData);

    if (data.studentType === "physical_online" && data.physicalStudentId) {
      await db.collection("physicalStudents").doc(data.physicalStudentId).update({
        physicalAccountLinked: true,
        linkedUserId: userRecord.uid,
        linkedAt: nowIso,
        activationStatus: "used",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    await db.collection("studentServices").add({
      studentId: userRecord.uid,
      serviceType: data.studentType === "physical_online" ? "PHYSICAL_CLASS" : "ONLINE_CLASS",
      grade: data.grade,
      status: "active",
      fee: 0,
      paymentStatus: "paid",
      createdAt: FieldValue.serverTimestamp(),
    });

    if (data.wantsPaperClass) {
      const serviceCfgSnap = await db.collection("serviceConfig").doc(data.grade).get();
      const paperFee = serviceCfgSnap.exists ? (serviceCfgSnap.data()?.paperClassFee || 2500) : 2500;

      await db.collection("studentServices").add({
        studentId: userRecord.uid,
        serviceType: "ONLINE_PAPER_CLASS",
        grade: data.grade,
        status: "pending",
        fee: paperFee,
        paymentStatus: "pending",
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    await db.collection("auditLog").add({
      action: "STUDENT_SELF_REGISTERED",
      uid: userRecord.uid,
      studentId,
      studentType: data.studentType,
      phone: normalizedPhone,
      timestamp: FieldValue.serverTimestamp(),
    });

    await sessionRef.delete();

    return {
      success: true,
      studentId,
      email: generatedEmail,
      uid: userRecord.uid,
      message: "Registration successful! You can now log in.",
    };
  } catch (err: any) {
    console.error("Error in registerStudent:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Registration failed.");
  }
});

// ─── getServiceConfig ─────────────────────────────────────────────────────────
export const getServiceConfig = onCall(async (request) => {
  try {
    const { grade } = request.data as { grade?: string };
    
    const defaultFees: Record<string, number> = {
      "Grade 6": 1500,
      "Grade 7": 1500,
      "Grade 8": 1800,
      "Grade 9": 2000,
      "Grade 10": 2200,
      "Grade 11": 2500,
      "A/L Science": 3000,
    };

    let fee = 2500;
    if (grade && defaultFees[grade]) {
      fee = defaultFees[grade];
    }

    if (grade) {
      const cfgDoc = await db.collection("serviceConfig").doc(grade).get();
      if (cfgDoc.exists && cfgDoc.data()?.paperClassFee) {
        fee = cfgDoc.data()!.paperClassFee;
      }
    }

    return {
      success: true,
      serviceName: "Online Paper Class Subscription",
      grade: grade || "all",
      fee,
      currency: "LKR",
    };
  } catch (err: any) {
    console.error("Error in getServiceConfig:", err);
    throw new HttpsError("internal", "Failed to retrieve service configuration.");
  }
});

// ─── createPhysicalStudent (Admin) ───────────────────────────────────────────
export const createPhysicalStudent = onCall(async (request) => {
  try {
    if (!request.auth) throw new HttpsError("unauthenticated", "Authentication required.");
    const role = request.auth.token.role;
    if (role !== "teacher" && role !== "admin") {
      throw new HttpsError("permission-denied", "Admin or teacher permission required.");
    }

    const { studentName, mobileNumber, smartCardNumber, grade, batch } = request.data as {
      studentName: string;
      mobileNumber: string;
      smartCardNumber: string;
      grade: string;
      batch?: string;
    };

    if (!studentName || !mobileNumber || !smartCardNumber || !grade) {
      throw new HttpsError("invalid-argument", "Missing required physical student fields.");
    }

    const normalizedPhone = normalizePhoneLocal(mobileNumber);
    const cleanCard = smartCardNumber.trim();
    const last4 = cleanCard.slice(-4);

    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingSnap = await db.collection("physicalStudents")
      .where("mobileNumber", "==", normalizedPhone)
      .where("smartCardLast4", "==", last4)
      .get();

    if (!existingSnap.empty) {
      throw new HttpsError("already-exists", "A physical student record with this phone number and card ending already exists.");
    }

    const ref = await db.collection("physicalStudents").add({
      studentName,
      mobileNumber: normalizedPhone,
      smartCardNumber: cleanCard,
      smartCardLast4: last4,
      activationCode,
      grade,
      batch: batch || "",
      status: "active",
      activationStatus: "unused",
      physicalAccountLinked: false,
      linkedUserId: null,
      linkedAt: null,
      createdBy: request.auth.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      id: ref.id,
      smartCardLast4: last4,
      activationCode,
      message: "Physical student created successfully!",
    };
  } catch (err: any) {
    console.error("Error in createPhysicalStudent:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to create physical student.");
  }
});

// ─── batchCreatePhysicalStudents (Admin CSV Import) ─────────────────────────
export const batchCreatePhysicalStudents = onCall(async (request) => {
  try {
    if (!request.auth) throw new HttpsError("unauthenticated", "Authentication required.");
    const role = request.auth.token.role;
    if (role !== "teacher" && role !== "admin") {
      throw new HttpsError("permission-denied", "Admin or teacher permission required.");
    }

    const { records } = request.data as {
      records: Array<{
        studentName: string;
        mobileNumber: string;
        smartCardNumber: string;
        grade: string;
        batch?: string;
        activationCode?: string;
      }>;
    };

    if (!records || !Array.isArray(records) || records.length === 0) {
      throw new HttpsError("invalid-argument", "Records array is required.");
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const rec of records) {
      if (!rec.studentName || !rec.mobileNumber || !rec.smartCardNumber || !rec.grade) {
        skippedCount++;
        continue;
      }

      const normalizedPhone = normalizePhoneLocal(rec.mobileNumber);
      const cleanCard = rec.smartCardNumber.trim();
      const last4 = cleanCard.slice(-4);
      const code = rec.activationCode?.trim() || Math.floor(100000 + Math.random() * 900000).toString();

      const existingSnap = await db.collection("physicalStudents")
        .where("mobileNumber", "==", normalizedPhone)
        .where("smartCardLast4", "==", last4)
        .get();

      if (!existingSnap.empty) {
        skippedCount++;
        continue;
      }

      await db.collection("physicalStudents").add({
        studentName: rec.studentName,
        mobileNumber: normalizedPhone,
        smartCardNumber: cleanCard,
        smartCardLast4: last4,
        activationCode: code,
        grade: rec.grade,
        batch: rec.batch || "",
        status: "active",
        activationStatus: "unused",
        physicalAccountLinked: false,
        linkedUserId: null,
        linkedAt: null,
        createdBy: request.auth.uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      createdCount++;
    }

    return {
      success: true,
      createdCount,
      skippedCount,
      message: `Batch import complete. Created ${createdCount} physical records. (${skippedCount} skipped/duplicates)`,
    };
  } catch (err: any) {
    console.error("Error in batchCreatePhysicalStudents:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to process batch physical import.");
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

import { onSchedule } from "firebase-functions/v2/scheduler";
import { 
  createZoomMeeting as zoomCreate, 
  deleteZoomMeeting as zoomDelete, 
  getPastMeetingParticipants 
} from "./zoom/zoomService";

// ─── createZoomMeeting Cloud Function ──────────────────────────────────────────
export const createZoomMeeting = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required to create a Zoom meeting.");
    }

    const role = request.auth.token.role;
    if (role !== "teacher" && role !== "admin") {
      throw new HttpsError("permission-denied", "Only teachers or admins can create Zoom meetings.");
    }

    const { 
      topic, 
      courseId, 
      courseTitle, 
      grade, 
      startTime, 
      durationMinutes, 
      description 
    } = request.data as {
      topic: string;
      courseId: string;
      courseTitle: string;
      grade: string;
      startTime: string;
      durationMinutes: number;
      description?: string;
    };

    if (!topic || !courseId || !startTime || !durationMinutes) {
      throw new HttpsError("invalid-argument", "Missing required fields.");
    }

    let zoomRes: any = null;
    try {
      zoomRes = await zoomCreate({
        topic: `${grade} - ${topic}`,
        startTime,
        durationMinutes,
        agenda: description || `Science Class - ${courseTitle}`,
      });
    } catch (zErr: any) {
      console.error("Zoom API error:", zErr);
      throw new HttpsError("internal", "Zoom API Error: " + (zErr.message || "Failed to create Zoom meeting."));
    }

    const classRef = await db.collection("liveClasses").add({
      topic,
      courseId,
      courseTitle,
      grade,
      startTime,
      durationMinutes: Number(durationMinutes),
      description: description || "",
      zoomMeetingId: String(zoomRes.id),
      joinUrl: zoomRes.join_url,
      startUrl: zoomRes.start_url || "",
      password: zoomRes.password || "",
      attendanceProcessed: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      classId: classRef.id,
      zoomMeetingId: String(zoomRes.id),
      joinUrl: zoomRes.join_url,
      password: zoomRes.password,
    };
  } catch (err: any) {
    console.error("Error in createZoomMeeting callable:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to create Zoom meeting.");
  }
});

// ─── deleteZoomMeeting Cloud Function ──────────────────────────────────────────
export const deleteZoomMeeting = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const role = request.auth.token.role;
    if (role !== "teacher" && role !== "admin") {
      throw new HttpsError("permission-denied", "Only teachers or admins can delete Zoom meetings.");
    }

    const { classId } = request.data as { classId: string };
    if (!classId) {
      throw new HttpsError("invalid-argument", "classId is required.");
    }

    const docRef = db.collection("liveClasses").doc(classId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new HttpsError("not-found", "Live class doc not found.");
    }

    const data = docSnap.data()!;
    if (data.zoomMeetingId) {
      try {
        await zoomDelete(data.zoomMeetingId);
      } catch (zErr) {
        console.warn("Zoom meeting delete failed or meeting already deleted:", zErr);
      }
    }

    await docRef.delete();
    return { success: true, message: "Class deleted successfully." };
  } catch (err: any) {
    console.error("Error in deleteZoomMeeting callable:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to delete Zoom meeting.");
  }
});

// Helper function to process attendance for a class
async function runAttendanceProcessingForClass(classDocSnap: any) {
  const classId = classDocSnap.id;
  const data = classDocSnap.data();
  const zoomMeetingId = data.zoomMeetingId;
  const grade = data.grade;

  if (!zoomMeetingId) {
    console.log(`Class ${classId} has no zoomMeetingId, marking processed.`);
    await classDocSnap.ref.update({ attendanceProcessed: true, attendanceProcessedAt: FieldValue.serverTimestamp() });
    return;
  }

  let participants: any[] = [];
  try {
    participants = await getPastMeetingParticipants(zoomMeetingId);
  } catch (err) {
    console.error(`Failed to fetch participants for Zoom meeting ${zoomMeetingId}:`, err);
  }

  const durationMap = new Map<string, number>();
  const joinTimeMap = new Map<string, string>();
  const leaveTimeMap = new Map<string, string>();

  for (const p of participants) {
    const rawName = p.name || p.user_name || "";
    const dur = p.duration || 0;
    const key = rawName.trim().toLowerCase();

    if (!key) continue;

    durationMap.set(key, (durationMap.get(key) || 0) + dur);
    if (!joinTimeMap.has(key) && p.join_time) joinTimeMap.set(key, p.join_time);
    leaveTimeMap.set(key, p.leave_time || new Date().toISOString());
  }

  let studentsQuery = db.collection("users").where("role", "==", "student");
  if (grade) {
    studentsQuery = studentsQuery.where("grade", "==", grade);
  }
  const studentsSnap = await studentsQuery.get();

  const totalMeetingDuration = data.durationMinutes || 60;
  const nowIso = new Date().toISOString();

  const batch = db.batch();

  for (const studentDoc of studentsSnap.docs) {
    const sData = studentDoc.data();
    const sId = sData.studentId || "";
    const sName = (sData.studentName || sData.fullName || "").trim().toLowerCase();

    let matchedDuration = 0;
    let joinedAt = "";
    let leftAt = "";

    for (const [key, dur] of durationMap.entries()) {
      if (
        (sId && key.includes(sId.toLowerCase())) ||
        (sName && key.includes(sName))
      ) {
        matchedDuration += dur;
        if (!joinedAt) joinedAt = joinTimeMap.get(key) || "";
        leftAt = leaveTimeMap.get(key) || "";
      }
    }

    const durationMinutes = Math.round(matchedDuration / 60);

    let status = "absent";
    if (durationMinutes >= Math.round(totalMeetingDuration * 0.5)) {
      status = "present";
    } else if (durationMinutes > 0) {
      status = "late";
    }

    const attRef = db.collection("attendance").doc(classId).collection("students").doc(studentDoc.id);

    batch.set(attRef, {
      studentUid: studentDoc.id,
      studentId: sData.studentId || "",
      studentName: sData.studentName || sData.fullName || "Unknown",
      status,
      durationMinutes,
      joinedAt: joinedAt || null,
      leftAt: leftAt || null,
      processedAt: nowIso,
    }, { merge: true });
  }

  await batch.commit();
  await classDocSnap.ref.update({
    attendanceProcessed: true,
    attendanceProcessedAt: FieldValue.serverTimestamp(),
  });
  console.log(`Processed attendance for class ${classId}: ${studentsSnap.docs.length} students records written.`);
}

// ─── Manual Attendance Processing Callable Cloud Function ────────────────────
export const processAttendance = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
    }

    const role = request.auth.token.role;
    if (role !== "teacher" && role !== "admin") {
      throw new HttpsError("permission-denied", "Only teachers or admins can trigger attendance processing.");
    }

    const { classId } = request.data as { classId: string };
    if (!classId) {
      throw new HttpsError("invalid-argument", "classId is required.");
    }

    const classDoc = await db.collection("liveClasses").doc(classId).get();
    if (!classDoc.exists) {
      throw new HttpsError("not-found", "Live class doc not found.");
    }

    await runAttendanceProcessingForClass(classDoc);
    return { success: true, message: "Attendance processed successfully." };
  } catch (err: any) {
    console.error("Error in processAttendance callable:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to process attendance.");
  }
});

// ─── Scheduled Attendance Automation Cloud Function ──────────────────────────
export const scheduledAttendanceProcessor = onSchedule("every 5 minutes", async () => {
  console.log("Running scheduled attendance processor...");

  const snap = await db.collection("liveClasses")
    .where("attendanceProcessed", "==", false)
    .get();

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const startTimeMs = new Date(data.startTime).getTime();
    const durationMs = (data.durationMinutes || 60) * 60 * 1000;
    const endTimeMs = startTimeMs + durationMs;

    if (Date.now() > endTimeMs) {
      try {
        await runAttendanceProcessingForClass(docSnap);
      } catch (err) {
        console.error(`Failed scheduled attendance processing for ${docSnap.id}:`, err);
      }
    }
  }
});
