export type AttendanceRecord = { id: string; title: string; status: string };
export async function listAttendance(): Promise<AttendanceRecord[]> {
  // Replace with Firestore queries later.
  return [];
}
