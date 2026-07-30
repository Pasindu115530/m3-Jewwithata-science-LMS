export type StudentsRecord = { id: string; title: string; status: string };
export async function listStudents(): Promise<StudentsRecord[]> {
  // Replace with Firestore queries later.
  return [];
}
