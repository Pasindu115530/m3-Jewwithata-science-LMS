"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { EmptyState } from "@/components/empty-state";
import { Card, Badge } from "@/components/ui";
import { WalletCards, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";

interface PaymentRecord {
  id: string;
  month: string;
  amount: number | string;
  status: "Approved" | "Pending" | "Rejected";
  paidAt?: string;
}

export default function StudentPaymentHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "payments"), where("studentUid", "==", user.uid));
          const snap = await getDocs(q);
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PaymentRecord);
          setPayments(items);
        } catch (err) {
          console.error("Error fetching payment history:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <StudentGuard>
      <DashboardShell role="student" active="Payment History">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Payment History</h1>
          <p className="mt-2 text-ink/55">
            View complete history of your monthly fee payments and receipts.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading payment history...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              emoji="📜"
              title="No Payment History"
              description="You do not have any historical payment transactions on record yet."
            />
          </div>
        ) : (
          <Card className="mt-8 overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-lavender-50/80 text-xs uppercase text-ink/60">
                  <tr>
                    <th className="px-6 py-4 font-black">Month</th>
                    <th className="px-6 py-4 font-black">Amount</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lavender-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-lavender-50/30">
                      <td className="px-6 py-4 font-bold text-ink">{p.month}</td>
                      <td className="px-6 py-4 font-extrabold text-lavender-700">LKR {p.amount}</td>
                      <td className="px-6 py-4 text-xs text-ink/60">{p.paidAt || "N/A"}</td>
                      <td className="px-6 py-4">
                        {p.status === "Approved" && (
                          <Badge tone="green" className="inline-flex items-center gap-1">
                            <CheckCircle2 size={13} /> Approved
                          </Badge>
                        )}
                        {p.status === "Pending" && (
                          <Badge tone="yellow" className="inline-flex items-center gap-1">
                            <Clock size={13} /> Pending
                          </Badge>
                        )}
                        {p.status === "Rejected" && (
                          <Badge tone="pink" className="inline-flex items-center gap-1">
                            <XCircle size={13} /> Rejected
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </DashboardShell>
    </StudentGuard>
  );
}
