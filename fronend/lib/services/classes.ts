import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ClassesRecord = {
  id: string;
  title: string;
  grade: string;
  type: string;
  mode: string;
  location?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  fee: number;
  status?: string;
};

export async function listClasses(): Promise<ClassesRecord[]> {
  const q = query(collection(db, "classes"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClassesRecord));
}
