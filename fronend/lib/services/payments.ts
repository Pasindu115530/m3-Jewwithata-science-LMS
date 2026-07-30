export type PaymentsRecord = { id: string; title: string; status: string };
export async function listPayments(): Promise<PaymentsRecord[]> {
  // Replace with Firestore queries later.
  return [];
}
