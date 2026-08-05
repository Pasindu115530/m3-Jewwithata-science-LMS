import { auth } from "@/lib/firebase";
import { StudentInput, studentSchema } from "@/lib/validations/student";
import { generateSequentialStudentId, generateStudentEmail } from "./student-id";
import { checkDuplicateContactNumbers, saveStudentDocument } from "./student-firestore";
import { createStudentAuthUser } from "./student-auth";

export interface CreateStudentResult {
  success: boolean;
  uid?: string;
  studentId?: string;
  email?: string;
  error?: string;
}

/**
 * Main Orchestrator for Creating a Student in Firebase Auth and Firestore.
 */
export async function createStudentService(input: StudentInput): Promise<CreateStudentResult> {
  try {
    // 1. Verify Admin Authentication
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      return {
        success: false,
        error: "Unauthorized: Only authenticated admins/teachers can create students.",
      };
    }

    // 2. Validate input with Zod
    const validationResult = studentSchema.safeParse(input);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid input data.";
      return {
        success: false,
        error: firstError,
      };
    }

    const validData = validationResult.data;

    // 3. Check for Duplicate Mobile / WhatsApp Numbers
    await checkDuplicateContactNumbers(validData.mobileNumber, validData.whatsappNumber);

    // 4. Generate Sequential Student ID & Email
    const studentId = await generateSequentialStudentId();
    const studentEmail = generateStudentEmail(studentId);

    // 5. Create Firebase Authentication User
    const studentUid = await createStudentAuthUser(studentEmail, validData.password);

    // 6. Save Student Document into Firestore
    await saveStudentDocument(studentUid, studentId, studentEmail, validData, currentAdmin.uid);

    return {
      success: true,
      uid: studentUid,
      studentId,
      email: studentEmail,
    };
  } catch (err: any) {
    console.error("createStudentService Error:", err);
    return {
      success: false,
      error: err.message || "An unexpected error occurred while creating the student.",
    };
  }
}
