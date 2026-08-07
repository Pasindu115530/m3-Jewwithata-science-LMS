import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Extracts 2-digit grade code from grade string (e.g. "Grade 6" -> "06", "Grade 11" -> "11", "A/L Science" -> "AL")
 */
export function formatGradeCode(grade: string): string {
  const digits = grade.replace(/\D/g, "");
  if (digits) {
    return digits.padStart(2, "0");
  }
  if (grade.toLowerCase().includes("a/l") || grade.toLowerCase().includes("al")) {
    return "AL";
  }
  return "00";
}

/**
 * Atomic Student ID Generator (e.g., KL-09-0001, KL-11-0002)
 * Uses a Firestore transaction on a counter document to avoid race conditions.
 */
export async function generateSequentialStudentId(grade: string = "Grade 10"): Promise<string> {
  const gradeCode = formatGradeCode(grade);
  const counterRef = doc(db, "counters", `studentIdCounter_${gradeCode}`);

  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let nextCount = 1;
    if (counterDoc.exists()) {
      nextCount = (counterDoc.data().currentCount || 0) + 1;
    }

    transaction.set(counterRef, { currentCount: nextCount }, { merge: true });

    const paddedNumber = String(nextCount).padStart(4, "0");
    return `KL-${gradeCode}-${paddedNumber}`;
  });
}

/**
 * Formats a student login email from Student ID
 */
export function generateStudentEmail(studentId: string): string {
  return `${studentId.toLowerCase()}@student.kalaharascience.lk`;
}
