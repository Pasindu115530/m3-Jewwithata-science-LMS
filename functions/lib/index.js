"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStudentOtp = exports.sendStudentOtp = void 0;
const https_1 = require("firebase-functions/v2/https");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const firestore_1 = require("firebase-admin/firestore");
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
const auth = (0, auth_1.getAuth)();
const db = (0, firestore_1.getFirestore)();
// Helper: Normalize Sri Lankan local phone number format (07XXXXXXXX)
function normalizePhoneLocal(phone) {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("94")) {
        cleaned = "0" + cleaned.substring(2);
    }
    if (!cleaned.startsWith("0")) {
        cleaned = "0" + cleaned;
    }
    return cleaned;
}
// Helper: send SMS via text.lk HTTP API
async function sendSmsTextLk(recipientPhone, message) {
    const token = process.env.TEXTLK_API_TOKEN || "6391|wxBuhnjBsvpT6fBayumubRBxm9andmxWSAYPsL9W503ffb90";
    const senderId = process.env.TEXTLK_SENDER_ID || "TextLKDemo";
    const url = new URL("https://app.text.lk/api/http/sms/send");
    url.searchParams.append("recipient", recipientPhone);
    url.searchParams.append("sender_id", senderId);
    url.searchParams.append("message", message);
    url.searchParams.append("api_token", token);
    try {
        const res = await fetch(url.toString());
        const data = (await res.json());
        console.log("text.lk HTTP API Response:", data);
        return res.ok && (data.status === "success" || data.code === 200 || data.status === 200 || !!data.data);
    }
    catch (err) {
        console.error("Failed to send SMS via text.lk:", err);
        return false;
    }
}
// ─── sendStudentOtp ────────────────────────────────────────────────────────────
exports.sendStudentOtp = (0, https_1.onCall)(async (request) => {
    try {
        const { phone } = request.data;
        if (!phone) {
            throw new https_1.HttpsError("invalid-argument", "Phone number is required.");
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
            throw new https_1.HttpsError("not-found", "No student account found registered with this mobile number.");
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
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        });
        // Send SMS via text.lk
        const message = `Your Science LMS Verification Code is: ${otp}. Valid for 5 minutes.`;
        await sendSmsTextLk(normalizedPhone, message);
        return { success: true, message: "OTP sent successfully to " + normalizedPhone };
    }
    catch (err) {
        console.error("Error in sendStudentOtp:", err);
        if (err instanceof https_1.HttpsError)
            throw err;
        throw new https_1.HttpsError("internal", err.message || "Failed to send OTP.");
    }
});
// ─── verifyStudentOtp ──────────────────────────────────────────────────────────
exports.verifyStudentOtp = (0, https_1.onCall)(async (request) => {
    try {
        const { phone, otp } = request.data;
        if (!phone || !otp) {
            throw new https_1.HttpsError("invalid-argument", "Phone number and OTP code are required.");
        }
        const normalizedPhone = normalizePhoneLocal(phone);
        const otpRef = db.collection("otpCodes").doc(normalizedPhone);
        const otpDoc = await otpRef.get();
        if (!otpDoc.exists) {
            throw new https_1.HttpsError("not-found", "No OTP code request found for this phone number. Please request a new code.");
        }
        const otpData = otpDoc.data();
        if (Date.now() > otpData.expiresAt) {
            await otpRef.delete();
            throw new https_1.HttpsError("deadline-exceeded", "The OTP code has expired. Please request a new one.");
        }
        if (otpData.otp !== otp.trim()) {
            throw new https_1.HttpsError("invalid-argument", "Invalid OTP code. Please check and try again.");
        }
        // OTP verified! Delete it so it cannot be reused
        await otpRef.delete();
        // Mint a custom auth token for Firebase Auth login
        const customToken = await auth.createCustomToken(otpData.uid, { role: "student" });
        return { success: true, customToken };
    }
    catch (err) {
        console.error("Error in verifyStudentOtp:", err);
        if (err instanceof https_1.HttpsError)
            throw err;
        throw new https_1.HttpsError("internal", err.message || "Failed to verify OTP.");
    }
});
//# sourceMappingURL=index.js.map