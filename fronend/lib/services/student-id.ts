import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Atomic Student ID Generator (e.g., STD000001, STD000002)
 * Uses a Firestore transaction on a counter document to avoid race conditions.
 */
export async function generateSequentialStudentId(): Promise<string> {
  const counterRef = doc(db, "counters", "studentIdCounter");

  return await runTransaction(db, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);

    let nextCount = 1;
    if (counterDoc.exists()) {
      nextCount = (counterDoc.data().currentCount || 0) + 1;
    }

    transaction.set(counterRef, { currentCount: nextCount }, { merge: true });

    // Format count with leading zeros (6 digits) -> STD000001
    const paddedNumber = String(nextCount).padStart(6, "0");
    return `STD${paddedNumber}`;
  });
}

/**
 * Formats a student login email from Student ID
 */
export function generateStudentEmail(studentId: string): string {
  return `${studentId.toLowerCase()}@student.sciencelms.lk`;
}
