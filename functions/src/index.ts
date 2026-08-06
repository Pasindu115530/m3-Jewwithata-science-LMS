import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
initializeApp();

const auth = getAuth();
const db = getFirestore();

// ─── Helper: verify caller role ───────────────────────────────────────────────
function requireRole(
  authContext: { token: Record<string, any> } | undefined,
  ...roles: string[]
) {
  if (!authContext) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  const role = authContext.token.role as string | undefined;
  if (!role || !roles.includes(role)) {
    throw new HttpsError(
      "permission-denied",
      `Access denied. Required role: ${roles.join(" or ")}.`
    );
  }
}

// ─── Helper: generate sequential student ID ───────────────────────────────────
async function generateSequentialStudentId(): Promise<string> {
  const counterRef = db.collection("counters").doc("students");
  const newId = await db.runTransaction(async (t) => {
    const doc = await t.get(counterRef);
    const current = doc.exists ? (doc.data()!.count as number) : 0;
    const next = current + 1;
    t.set(counterRef, { count: next }, { merge: true });
    return next;
  });
  return `STU${String(newId).padStart(4, "0")}`;
}

// ─── createStudent ─────────────────────────────────────────────────────────────
export const createStudent = onCall(async (request) => {
  requireRole(request.auth, "admin", "teacher");

  const data = request.data as {
    studentName: string;
    parentName: string;
    mobileNumber: string;
    whatsappNumber: string;
    gender: string;
    birthday: string;
    grade: string;
    schoolName: string;
    classType: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    password: string;
    status: string;
    admissionDate: string;
    notes?: string;
  };

  // Validate required fields
  if (!data.studentName || !data.mobileNumber || !data.password) {
    throw new HttpsError("invalid-argument", "Missing required student fields.");
  }

  // Check for duplicate mobile/WhatsApp
  const usersRef = db.collection("users");
  const mobileSnap = await usersRef.where("mobileNumber", "==", data.mobileNumber).get();
  if (!mobileSnap.empty) {
    throw new HttpsError("already-exists", "A student with this mobile number already exists.");
  }
  if (data.whatsappNumber) {
    const waSnap = await usersRef.where("whatsappNumber", "==", data.whatsappNumber).get();
    if (!waSnap.empty) {
      throw new HttpsError("already-exists", "A student with this WhatsApp number already exists.");
    }
  }

  // Generate student ID and email
  const studentId = await generateSequentialStudentId();
  const studentEmail = `${studentId.toLowerCase()}@student.kalaharascience.lk`;

  // Create Firebase Auth user
  let uid: string;
  try {
    const userRecord = await auth.createUser({
      email: studentEmail,
      password: data.password,
      displayName: data.studentName,
    });
    uid = userRecord.uid;
  } catch (err: any) {
    throw new HttpsError("internal", `Failed to create auth user: ${err.message}`);
  }

  // Set custom claim role = "student"
  await auth.setCustomUserClaims(uid, { role: "student" });

  // Save student document to Firestore
  await db.collection("users").doc(uid).set({
    role: "student",
    studentId,
    studentName: data.studentName,
    parentName: data.parentName,
    mobileNumber: data.mobileNumber,
    whatsappNumber: data.whatsappNumber || "",
    gender: data.gender,
    birthday: data.birthday,
    grade: data.grade,
    schoolName: data.schoolName,
    classType: data.classType,
    addressLine1: data.addressLine1,
    addressLine2: data.addressLine2 || "",
    city: data.city,
    district: data.district,
    email: studentEmail,
    status: data.status || "active",
    admissionDate: data.admissionDate,
    notes: data.notes || "",
    createdBy: request.auth!.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true, uid, studentId, email: studentEmail };
});

// ─── deleteStudent ─────────────────────────────────────────────────────────────
export const deleteStudent = onCall(async (request) => {
  requireRole(request.auth, "admin");

  const { uid } = request.data as { uid: string };
  if (!uid) {
    throw new HttpsError("invalid-argument", "UID is required.");
  }

  // Delete Auth user
  await auth.deleteUser(uid);

  // Delete Firestore document
  await db.collection("users").doc(uid).delete();

  return { success: true };
});

// ─── setUserRole ───────────────────────────────────────────────────────────────
export const setUserRole = onCall(async (request) => {
  requireRole(request.auth, "admin");

  const { uid, role } = request.data as { uid: string; role: string };
  if (!uid || !role) {
    throw new HttpsError("invalid-argument", "UID and role are required.");
  }

  const allowedRoles = ["admin", "teacher", "student"];
  if (!allowedRoles.includes(role)) {
    throw new HttpsError("invalid-argument", `Role must be one of: ${allowedRoles.join(", ")}`);
  }

  await auth.setCustomUserClaims(uid, { role });

  return { success: true, uid, role };
});

// ─── getStudentList ────────────────────────────────────────────────────────────
export const getStudentList = onCall(async (request) => {
  requireRole(request.auth, "admin", "teacher");

  const snap = await db
    .collection("users")
    .where("role", "==", "student")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();

  const students = snap.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() ?? null,
  }));

  return { success: true, students };
});
