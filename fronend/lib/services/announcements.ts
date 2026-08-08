import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AnnouncementCategory = 
  | "General" 
  | "Exam Notice" 
  | "Class Schedule" 
  | "Assignment" 
  | "Urgent" 
  | "Zoom Update";

export type AnnouncementPriority = "Normal" | "Important" | "Urgent";

export interface AnnouncementItem {
  id?: string;
  title: string;
  message: string;
  targetClass: string; // e.g. "All Classes", "Grade 10 Theory", "Grade 11 Revision", etc.
  targetGrade: string; // e.g. "All Classes", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  pinned?: boolean;
  authorName: string;
  authorUid?: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Creates a new class announcement in Firestore
 */
export async function createAnnouncement(
  data: Omit<AnnouncementItem, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const colRef = collection(db, "announcements");
  const docRef = await addDoc(colRef, {
    ...data,
    pinned: data.pinned ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Updates an existing announcement
 */
export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementItem>
): Promise<void> {
  const docRef = doc(db, "announcements", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Deletes an announcement
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  const docRef = doc(db, "announcements", id);
  await deleteDoc(docRef);
}

/**
 * Fetches all announcements for Teacher management
 */
export async function fetchTeacherAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementItem));
  } catch (err) {
    console.warn("Falling back without index:", err);
    const snap = await getDocs(collection(db, "announcements"));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementItem));
    return items.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
  }
}

/**
 * Fetches announcements targeted for a specific student based on Grade and Enrolled Classes
 */
export async function fetchStudentAnnouncements(
  studentGrade: string,
  enrolledClasses: string[] = []
): Promise<AnnouncementItem[]> {
  try {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementItem));
    
    return all.filter((a) => {
      // 1. Broad broadcast to all
      if (a.targetGrade === "All Classes" || a.targetClass === "All Classes") return true;
      
      // 2. Target by Grade match (e.g. "Grade 10")
      if (studentGrade && (a.targetGrade === studentGrade || a.targetClass?.toLowerCase().includes(studentGrade.toLowerCase()))) {
        return true;
      }

      // 3. Target by specific enrolled class title/ID match
      if (enrolledClasses && enrolledClasses.length > 0) {
        return enrolledClasses.some(
          (c) => c === a.targetClass || c.toLowerCase().includes(a.targetClass.toLowerCase()) || a.targetClass.toLowerCase().includes(c.toLowerCase())
        );
      }

      return false;
    });
  } catch (err) {
    console.warn("Fallback student announcements query:", err);
    const snap = await getDocs(collection(db, "announcements"));
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AnnouncementItem));
    
    const filtered = all.filter((a) => {
      if (a.targetGrade === "All Classes" || a.targetClass === "All Classes") return true;
      if (studentGrade && (a.targetGrade === studentGrade || a.targetClass?.toLowerCase().includes(studentGrade.toLowerCase()))) {
        return true;
      }
      if (enrolledClasses && enrolledClasses.length > 0) {
        return enrolledClasses.some(
          (c) => c === a.targetClass || c.toLowerCase().includes(a.targetClass.toLowerCase()) || a.targetClass.toLowerCase().includes(c.toLowerCase())
        );
      }
      return false;
    });

    return filtered.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
  }
}
