"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentList = exports.setUserRole = exports.deleteStudent = exports.createStudent = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
const auth = (0, auth_1.getAuth)();
const db = (0, firestore_1.getFirestore)();
// ─── Helper: verify caller role ───────────────────────────────────────────────
function requireRole(authContext, ...roles) {
    if (!authContext) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in.");
    }
    const role = authContext.token.role;
    if (!role || !roles.includes(role)) {
        throw new https_1.HttpsError("permission-denied", `Access denied. Required role: ${roles.join(" or ")}.`);
    }
}
// ─── Helper: generate sequential student ID ───────────────────────────────────
async function generateSequentialStudentId() {
    const counterRef = db.collection("counters").doc("students");
    const newId = await db.runTransaction(async (t) => {
        const doc = await t.get(counterRef);
        const current = doc.exists ? doc.data().count : 0;
        const next = current + 1;
        t.set(counterRef, { count: next }, { merge: true });
        return next;
    });
    return `STU${String(newId).padStart(4, "0")}`;
}
// ─── createStudent ─────────────────────────────────────────────────────────────
exports.createStudent = (0, https_1.onCall)(async (request) => {
    requireRole(request.auth, "admin", "teacher");
    const data = request.data;
    // Validate required fields
    if (!data.studentName || !data.mobileNumber || !data.password) {
        throw new https_1.HttpsError("invalid-argument", "Missing required student fields.");
    }
    // Check for duplicate mobile/WhatsApp
    const usersRef = db.collection("users");
    const mobileSnap = await usersRef.where("mobileNumber", "==", data.mobileNumber).get();
    if (!mobileSnap.empty) {
        throw new https_1.HttpsError("already-exists", "A student with this mobile number already exists.");
    }
    if (data.whatsappNumber) {
        const waSnap = await usersRef.where("whatsappNumber", "==", data.whatsappNumber).get();
        if (!waSnap.empty) {
            throw new https_1.HttpsError("already-exists", "A student with this WhatsApp number already exists.");
        }
    }
    // Generate student ID and email
    const studentId = await generateSequentialStudentId();
    const studentEmail = `${studentId.toLowerCase()}@student.kalaharascience.lk`;
    // Create Firebase Auth user
    let uid;
    try {
        const userRecord = await auth.createUser({
            email: studentEmail,
            password: data.password,
            displayName: data.studentName,
        });
        uid = userRecord.uid;
    }
    catch (err) {
        throw new https_1.HttpsError("internal", `Failed to create auth user: ${err.message}`);
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
        createdBy: request.auth.uid,
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    });
    return { success: true, uid, studentId, email: studentEmail };
});
// ─── deleteStudent ─────────────────────────────────────────────────────────────
exports.deleteStudent = (0, https_1.onCall)(async (request) => {
    requireRole(request.auth, "admin");
    const { uid } = request.data;
    if (!uid) {
        throw new https_1.HttpsError("invalid-argument", "UID is required.");
    }
    // Delete Auth user
    await auth.deleteUser(uid);
    // Delete Firestore document
    await db.collection("users").doc(uid).delete();
    return { success: true };
});
// ─── setUserRole ───────────────────────────────────────────────────────────────
exports.setUserRole = (0, https_1.onCall)(async (request) => {
    requireRole(request.auth, "admin");
    const { uid, role } = request.data;
    if (!uid || !role) {
        throw new https_1.HttpsError("invalid-argument", "UID and role are required.");
    }
    const allowedRoles = ["admin", "teacher", "student"];
    if (!allowedRoles.includes(role)) {
        throw new https_1.HttpsError("invalid-argument", `Role must be one of: ${allowedRoles.join(", ")}`);
    }
    await auth.setCustomUserClaims(uid, { role });
    return { success: true, uid, role };
});
// ─── getStudentList ────────────────────────────────────────────────────────────
exports.getStudentList = (0, https_1.onCall)(async (request) => {
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
//# sourceMappingURL=index.js.map