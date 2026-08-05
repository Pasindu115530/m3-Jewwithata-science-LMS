import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { StudentInput } from "@/lib/validations/student";

export interface StudentFirestoreDoc {
  role: "student";
  studentId: string;
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
  email: string;
  status: string;
  admissionDate: string;
  notes?: string;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}

/**
 * Checks for duplicate mobile or whatsapp numbers
 */
export async function checkDuplicateContactNumbers(mobileNumber: string, whatsappNumber: string): Promise<void> {
  const usersRef = collection(db, "users");

  const mobileQuery = query(usersRef, where("mobileNumber", "==", mobileNumber));
  const mobileSnapshot = await getDocs(mobileQuery);
  if (!mobileSnapshot.empty) {
    throw new Error("A student with this Mobile Number already exists.");
  }

  const whatsappQuery = query(usersRef, where("whatsappNumber", "==", whatsappNumber));
  const whatsappSnapshot = await getDocs(whatsappQuery);
  if (!whatsappSnapshot.empty) {
    throw new Error("A student with this WhatsApp Number already exists.");
  }
}

/**
 * Saves student document into `users` collection using auth UID
 */
export async function saveStudentDocument(
  uid: string,
  studentId: string,
  email: string,
  input: StudentInput,
  createdByUid: string
): Promise<void> {
  const userDocRef = doc(db, "users", uid);

  const studentData: StudentFirestoreDoc = {
    role: "student",
    studentId,
    studentName: input.studentName,
    parentName: input.parentName,
    mobileNumber: input.mobileNumber,
    whatsappNumber: input.whatsappNumber,
    gender: input.gender,
    birthday: input.birthday,
    grade: input.grade,
    schoolName: input.schoolName,
    classType: input.classType,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2 || "",
    city: input.city,
    district: input.district,
    email,
    status: input.status,
    admissionDate: input.admissionDate,
    notes: input.notes || "",
    createdBy: createdByUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userDocRef, studentData);
}
