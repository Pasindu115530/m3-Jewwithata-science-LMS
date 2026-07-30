export type NotificationsRecord = { id: string; title: string; status: string };
export async function listNotifications(): Promise<NotificationsRecord[]> {
  // Replace with Firestore queries later.
  return [];
}
