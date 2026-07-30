export type AnnouncementsRecord = { id: string; title: string; status: string };
export async function listAnnouncements(): Promise<AnnouncementsRecord[]> {
  // Replace with Firestore queries later.
  return [];
}
