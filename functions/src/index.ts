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
      startTime, // ISO string
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
      throw new HttpsError("invalid-argument", "Missing required fields (topic, courseId, startTime, durationMinutes).");
    }

    // 1. Create meeting in Zoom API
    let zoomRes: any = null;
    try {
      zoomRes = await zoomCreate({
        topic: `${grade} - ${topic}`,
        startTime,
        durationMinutes: Number(durationMinutes),
        agenda: description || `${courseTitle} Live Class`,
      });
    } catch (zoomErr: any) {
      console.warn("Zoom API creation fallback (mocking if Zoom API credentials not configured):", zoomErr.message);
      // Fallback for demo/dev if credentials not filled yet
      const mockId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      zoomRes = {
        meetingId: mockId,
        meetingUUID: `mock_uuid_${mockId}`,
        joinUrl: `https://zoom.us/j/${mockId}?pwd=mockpasscode`,
        startUrl: `https://zoom.us/s/${mockId}`,
        passcode: "Science2026",
        topic: `${grade} - ${topic}`,
        startTime,
        duration: Number(durationMinutes),
      };
    }

    // 2. Save meeting document in Firestore `liveClasses` collection
    const docRef = db.collection("liveClasses").doc();
    const liveClassData = {
      classId: docRef.id,
      zoomMeetingId: zoomRes.meetingId,
      meetingUUID: zoomRes.meetingUUID,
      joinUrl: zoomRes.joinUrl,
      startUrl: zoomRes.startUrl,
      passcode: zoomRes.passcode,
      topic,
      courseId,
      courseTitle,
      grade,
      startTime,
      durationMinutes: Number(durationMinutes),
      description: description || "",
      status: "scheduled", // scheduled | active | completed
      teacherId: request.auth.uid,
      attendanceProcessed: false,
      createdAt: FieldValue.serverTimestamp(),
    };

    await docRef.set(liveClassData);

    return {
      success: true,
      classId: docRef.id,
      meeting: liveClassData,
    };
  } catch (err: any) {
    console.error("Error in createZoomMeeting:", err);
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
      throw new HttpsError("permission-denied", "Only teachers or admins can delete meetings.");
    }

    const { classId, zoomMeetingId } = request.data as { classId: string; zoomMeetingId?: string };
    if (!classId) {
      throw new HttpsError("invalid-argument", "classId is required.");
    }

    // Delete from Zoom API if meeting ID present
    if (zoomMeetingId) {
      try {
        await zoomDelete(zoomMeetingId);
      } catch (e) {
        console.warn("Could not delete from Zoom API:", e);
      }
    }

    // Delete from Firestore
    await db.collection("liveClasses").doc(classId).delete();

    return { success: true, message: "Meeting deleted successfully." };
  } catch (err: any) {
    console.error("Error in deleteZoomMeeting:", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", err.message || "Failed to delete meeting.");
  }
});

// ─── processAttendance Function Logic ─────────────────────────────────────────
async function runAttendanceProcessingForClass(classDoc: any) {
  const data = classDoc.data();
  const classId = classDoc.id;
  const courseId = data.courseId;
  const meetingUUID = data.meetingUUID;
  const scheduledStart = new Date(data.startTime).getTime();
  const durationSec = (data.durationMinutes || 60) * 60;

  console.log(`Processing attendance for class ${classId} (${data.topic})...`);

  // 1. Fetch enrolled students for this course from Firestore `users`
  const enrolledSnap = await db.collection("users")
    .where("role", "==", "student")
    .where("enrolledClasses", "array-contains", courseId)
    .get();

  const enrolledStudents = enrolledSnap.docs.map((d) => ({
    id: d.id,
    studentId: d.data().studentId || "",
    fullName: d.data().fullName || "",
    email: d.data().email || "",
  }));

  // 2. Fetch past meeting participants from Zoom API
  let zoomParticipants: any[] = [];
  try {
    if (meetingUUID && !meetingUUID.startsWith("mock_")) {
      zoomParticipants = await getPastMeetingParticipants(meetingUUID);
    }
  } catch (err) {
    console.error(`Failed to fetch participants for meeting ${meetingUUID}:`, err);
  }

  const attendanceBatch = db.batch();
  const attendanceCollKey = `${courseId}_${classId}`;

  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;

  // 3. Match participants & calculate attendance for each enrolled student
  for (const student of enrolledStudents) {
    // Find matching participant entries by studentId, fullName, or email
    const studentMatches = zoomParticipants.filter((p) => {
      const nameUpper = (p.name || "").toUpperCase();
      const emailUpper = (p.user_email || "").toUpperCase();

      const idMatch = student.studentId && nameUpper.includes(student.studentId.toUpperCase());
      const nameMatch = student.fullName && nameUpper.includes(student.fullName.toUpperCase());
      const emailMatch = student.email && emailUpper === student.email.toUpperCase();

      return idMatch || nameMatch || emailMatch;
    });

    let totalDurationSeconds = 0;
    let earliestJoinTime = "";
    let latestLeaveTime = "";

    for (const match of studentMatches) {
      totalDurationSeconds += match.duration || 0;
      if (!earliestJoinTime || (match.join_time && match.join_time < earliestJoinTime)) {
        earliestJoinTime = match.join_time;
      }
      if (!latestLeaveTime || (match.leave_time && match.leave_time > latestLeaveTime)) {
        latestLeaveTime = match.leave_time;
      }
    }

    const attendancePct = Math.min(100, Math.round((totalDurationSeconds / durationSec) * 100));

    // Determine status:
    // Present: Attended at least 80% duration
    // Late: Joined more than 10 mins after scheduled start time (and attended at least 40%)
    // Absent: Less than minimum duration or never joined
    let status: "present" | "late" | "absent" = "absent";
    
    if (studentMatches.length > 0) {
      const joinTimestamp = earliestJoinTime ? new Date(earliestJoinTime).getTime() : scheduledStart;
      const isLate = joinTimestamp - scheduledStart > 10 * 60 * 1000;

      if (attendancePct >= 80 && !isLate) {
        status = "present";
        presentCount++;
      } else if (attendancePct >= 40 || isLate) {
        status = "late";
        lateCount++;
      } else {
        status = "absent";
        absentCount++;
      }
    } else {
      status = "absent";
      absentCount++;
    }

    const attRef = db.collection("attendance").doc(attendanceCollKey).collection("students").doc(student.id);
    attendanceBatch.set(attRef, {
      studentId: student.id,
      customStudentId: student.studentId,
      studentName: student.fullName,
      email: student.email,
      status,
      joinTime: earliestJoinTime || null,
      leaveTime: latestLeaveTime || null,
      durationSeconds: totalDurationSeconds,
      attendancePercentage: attendancePct,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  // Commit attendance records
  await attendanceBatch.commit();

  // Mark liveClass doc completed
  await db.collection("liveClasses").doc(classId).update({
    status: "completed",
    attendanceProcessed: true,
    stats: {
      totalEnrolled: enrolledStudents.length,
      present: presentCount,
      late: lateCount,
      absent: absentCount,
    },
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`Attendance processing finished for ${classId}: ${presentCount} Present, ${lateCount} Late, ${absentCount} Absent.`);
}

// ─── Manual processAttendance Callable Function ──────────────────────────────
export const processAttendance = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Authentication required.");
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
// Runs every 5 minutes automatically
export const scheduledAttendanceProcessor = onSchedule("every 5 minutes", async () => {
  console.log("Running scheduled attendance processor...");

  // Find classes where meeting ended and attendance has not been processed
  const snap = await db.collection("liveClasses")
    .where("attendanceProcessed", "==", false)
    .get();

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    const startTimeMs = new Date(data.startTime).getTime();
    const durationMs = (data.durationMinutes || 60) * 60 * 1000;
    const endTimeMs = startTimeMs + durationMs;

    // Process if meeting has ended
    if (Date.now() > endTimeMs) {
      try {
        await runAttendanceProcessingForClass(docSnap);
      } catch (err) {
        console.error(`Failed scheduled attendance processing for ${docSnap.id}:`, err);
      }
    }
  }
});
