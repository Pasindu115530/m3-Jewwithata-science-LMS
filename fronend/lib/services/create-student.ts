import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/lib/firebase";
import { StudentInput, studentSchema } from "@/lib/validations/student";

export interface CreateStudentResult {
  success: boolean;
  uid?: string;
  studentId?: string;
  email?: string;
  error?: string;
}

/**
 * Creates a student by calling the secure Cloud Function.
 * The Cloud Function verifies the caller's role and handles
 * Auth + Firestore creation server-side.
 */
export async function createStudentService(
  input: StudentInput
): Promise<CreateStudentResult> {
  try {
    // Validate input with Zod before sending to the server
    const validationResult = studentSchema.safeParse(input);
    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message || "Invalid input data.";
      return { success: false, error: firstError };
    }

    const functions = getFunctions(app);
    const createStudent = httpsCallable<StudentInput, CreateStudentResult>(
      functions,
      "createStudent"
    );

    const result = await createStudent(validationResult.data);
    return result.data;
  } catch (err: any) {
    console.error("createStudentService Error:", err);
    // Firebase callable functions return error in err.message
    return {
      success: false,
      error: err.message || "An unexpected error occurred while creating the student.",
    };
  }
}
