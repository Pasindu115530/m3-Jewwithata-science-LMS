export type AssignmentsRecord = { id: string; title: string; status: string };
export async function listAssignments(): Promise<AssignmentsRecord[]> {
  // Replace with Firestore queries later.
  return [];
}
