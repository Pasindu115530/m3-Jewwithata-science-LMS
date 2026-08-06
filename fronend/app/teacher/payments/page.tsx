"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc,
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  WalletCards, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink,
  UserCheck,
  AlertCircle,
  X,
  Sparkles,
  FileText
} from "lucide-react";

interface PaymentRecord {
  id: string;
  studentUid: string;
  studentName?: string;
  studentId?: string;
  grade?: string;
  courseId: string;
  courseTitle: string;
  month: string;
  amount: number | string;
  paymentMethod: string;
  referenceNumber: string;
  receiptUrl: string;
  receiptFileName?: string;
  note?: string;
  status: "Approved" | "Pending" | "Rejected";
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export default function TeacherPaymentApprovalsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [teacherName, setTeacherName] = useState("Teacher");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");

  // Selected Payment Modal State
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "payments"));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PaymentRecord);
      // Sort newest first
      items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setPayments(items);
    } catch (err) {
      console.error("Error fetching payment approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setTeacherName(user.displayName || "Teacher");
        fetchPayments();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filtered Payments List
  const filteredPayments = payments.filter((p) => {
    // Search query (Student Name, Student ID, Course Title, Ref Number)
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (p.studentName && p.studentName.toLowerCase().includes(q)) ||
      (p.studentId && p.studentId.toLowerCase().includes(q)) ||
      (p.courseTitle && p.courseTitle.toLowerCase().includes(q)) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q));

    // Status Filter
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;

    // Grade Filter
    const matchesGrade = gradeFilter === "All" || p.grade === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  // Calculate Summary Stats
  const pendingCount = payments.filter((p) => p.status === "Pending").length;
  const approvedCount = payments.filter((p) => p.status === "Approved").length;
  const rejectedCount = payments.filter((p) => p.status === "Rejected").length;
  const totalPaymentsCount = payments.length;

  // APPROVE PAYMENT HANDLER
  const handleApprove = async (payment: PaymentRecord) => {
    setProcessing(true);
    setActionSuccess(null);

    try {
      const nowIso = new Date().toISOString();

      // 1. Update Payment Status to Approved in `payments` collection
      await updateDoc(doc(db, "payments", payment.id), {
        status: "Approved",
        approvedAt: nowIso,
        approvedBy: teacherName,
      });

      // 2. Automatically unlock student's course enrollment in `users/{uid}`
      const userRef = doc(db, "users", payment.studentUid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const uData = userDoc.data();
        const enrolledClasses: string[] = uData.enrolledClasses || [];
        const enrollments = uData.enrollments || {};

        if (!enrolledClasses.includes(payment.courseId)) {
          enrolledClasses.push(payment.courseId);
        }

        enrollments[payment.courseId] = {
          enrolledAt: enrollments[payment.courseId]?.enrolledAt || nowIso,
          status: "active",
        };

        await updateDoc(userRef, {
          enrolledClasses,
          enrollments,
          updatedAt: nowIso,
        });
      }

      // 3. Send Notification to Student
      await addDoc(collection(db, "notifications"), {
        title: "Payment Approved 🎉",
        message: `Your payment of LKR ${payment.amount} for ${payment.courseTitle} (${payment.month}) has been approved! Course access unlocked.`,
        targetUid: payment.studentUid,
        createdAt: nowIso,
      });

      setActionSuccess(`Payment approved for ${payment.studentName || "Student"}! Course unlocked.`);
      setSelectedPayment(null);
      await fetchPayments();
    } catch (err: any) {
      console.error("Error approving payment:", err);
      alert("Failed to approve payment: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  // REJECT PAYMENT HANDLER
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    setProcessing(true);
    setActionSuccess(null);

    try {
      const nowIso = new Date().toISOString();

      // 1. Update Payment Status to Rejected
      await updateDoc(doc(db, "payments", selectedPayment.id), {
        status: "Rejected",
        rejectionReason: rejectionReason.trim(),
        rejectedAt: nowIso,
        rejectedBy: teacherName,
      });

      // 2. Send Notification to Student with Rejection Reason
      await addDoc(collection(db, "notifications"), {
        title: "Payment Verification Rejected 🔴",
        message: `Your payment for ${selectedPayment.courseTitle} (${selectedPayment.month}) was rejected. Reason: ${rejectionReason}`,
        targetUid: selectedPayment.studentUid,
        createdAt: nowIso,
      });

      setActionSuccess(`Payment rejected for ${selectedPayment.studentName || "Student"}.`);
      setIsRejectModalOpen(false);
      setSelectedPayment(null);
      setRejectionReason("");
      await fetchPayments();
    } catch (err: any) {
      console.error("Error rejecting payment:", err);
      alert("Failed to reject payment: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardShell role="teacher" active="Payment Approvals">
      {/* Header */}
      <div>
        <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
          Teacher Portal
        </p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">Payment Approvals</h1>
        <p className="mt-2 text-ink/55">
          Verify student bank receipts, approve monthly course access, and manage payment audits.
        </p>
      </div>

      {actionSuccess && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Pending */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <Clock size={22} />
            </div>
            <Badge tone="yellow">Pending</Badge>
          </div>
          <h3 className="mt-4 text-2xl font-black text-ink">{pendingCount}</h3>
          <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-ink/55">
            Pending Approvals
          </p>
        </Card>

        {/* Card 2: Approved */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 size={22} />
            </div>
            <Badge tone="green">Approved</Badge>
          </div>
          <h3 className="mt-4 text-2xl font-black text-ink">{approvedCount}</h3>
          <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-ink/55">
            Total Approved
          </p>
        </Card>

        {/* Card 3: Rejected */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-700">
              <XCircle size={22} />
            </div>
            <Badge tone="pink">Rejected</Badge>
          </div>
          <h3 className="mt-4 text-2xl font-black text-ink">{rejectedCount}</h3>
          <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-ink/55">
            Rejected Receipts
          </p>
        </Card>

        {/* Card 4: Total Submissions */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lavender-100 text-lavender-700">
              <WalletCards size={22} />
            </div>
            <Badge tone="purple">All Time</Badge>
          </div>
          <h3 className="mt-4 text-2xl font-black text-ink">{totalPaymentsCount}</h3>
          <p className="mt-1 text-xs font-extrabold uppercase tracking-wider text-ink/55">
            Total Submissions
          </p>
        </Card>
      </div>

      {/* Search & Filter Controls */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            type="text"
            placeholder="Search student, course, reference no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pastel-input pl-11"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-lavender-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pastel-input py-2 text-xs font-bold"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">🟡 Pending</option>
              <option value="Approved">🟢 Approved</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>

          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="pastel-input py-2 text-xs font-bold"
          >
            <option value="All">All Grades</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="mt-10 flex flex-col items-center justify-center p-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
          <p className="mt-3 text-sm font-bold">Loading payment approval list...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            emoji="📋"
            title="No Payment Submissions Found"
            description="No student payment submissions match your search and filter criteria."
          />
        </div>
      ) : (
        <Card className="mt-6 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-lavender-100/70 text-ink/65 uppercase tracking-wider font-extrabold border-b">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Course & Month</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Ref Number</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lavender-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-lavender-50/50 transition">
                    {/* Student Info */}
                    <td className="p-4">
                      <div className="font-black text-sm text-ink">{p.studentName || "Student"}</div>
                      <div className="text-[11px] text-ink/50">{p.grade || "Grade 10"} • {p.studentId || "STU-ID"}</div>
                    </td>

                    {/* Course & Month */}
                    <td className="p-4">
                      <div className="font-bold text-ink">{p.courseTitle}</div>
                      <div className="text-[11px] text-lavender-700 font-extrabold">{p.month}</div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-black text-ink">
                      LKR {p.amount}
                    </td>

                    {/* Reference Number */}
                    <td className="p-4 font-mono text-ink/70">
                      {p.referenceNumber}
                    </td>

                    {/* Submitted Date */}
                    <td className="p-4 text-ink/60">
                      {new Date(p.submittedAt).toLocaleDateString("en-GB")}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {p.status === "Approved" && (
                        <Badge tone="green" className="flex items-center gap-1">
                          <CheckCircle2 size={12} /> Approved
                        </Badge>
                      )}
                      {p.status === "Pending" && (
                        <Badge tone="yellow" className="flex items-center gap-1">
                          <Clock size={12} /> Pending
                        </Badge>
                      )}
                      {p.status === "Rejected" && (
                        <Badge tone="pink" className="flex items-center gap-1">
                          <XCircle size={12} /> Rejected
                        </Badge>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="rounded-xl bg-lavender-600 px-3 py-1.5 text-[11px] font-black text-white hover:bg-lavender-700 shadow-sm"
                      >
                        Review Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* REVIEW PAYMENT MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-2xl p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-xl font-black">Review Payment Submission</h2>
                <p className="text-xs font-bold text-lavender-600">
                  {selectedPayment.studentName} ({selectedPayment.grade})
                </p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-full p-2 text-ink/40 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Payment Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-slate-50 p-4 text-xs">
                <div>
                  <span className="block font-bold text-ink/40 uppercase">Course</span>
                  <span className="font-black text-ink text-sm">{selectedPayment.courseTitle}</span>
                </div>
                <div>
                  <span className="block font-bold text-ink/40 uppercase">Payment Month</span>
                  <span className="font-black text-lavender-700 text-sm">{selectedPayment.month}</span>
                </div>
                <div>
                  <span className="block font-bold text-ink/40 uppercase">Amount Paid</span>
                  <span className="font-black text-ink text-sm">LKR {selectedPayment.amount}</span>
                </div>
                <div>
                  <span className="block font-bold text-ink/40 uppercase">Payment Method</span>
                  <span className="font-black text-ink">{selectedPayment.paymentMethod}</span>
                </div>
                <div>
                  <span className="block font-bold text-ink/40 uppercase">Transaction Reference</span>
                  <span className="font-mono font-bold text-ink">{selectedPayment.referenceNumber}</span>
                </div>
                <div>
                  <span className="block font-bold text-ink/40 uppercase">Submitted Date</span>
                  <span className="font-semibold text-ink/80">{new Date(selectedPayment.submittedAt).toLocaleString("en-GB")}</span>
                </div>
              </div>

              {selectedPayment.note && (
                <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
                  <span className="font-bold">Student Note:</span> {selectedPayment.note}
                </div>
              )}

              {/* Uploaded Receipt Preview */}
              <div>
                <span className="block text-xs font-extrabold uppercase text-ink/60 mb-2">
                  Uploaded Receipt Proof
                </span>
                {selectedPayment.receiptUrl ? (
                  <div className="rounded-2xl border bg-slate-100 p-4 text-center">
                    {selectedPayment.receiptUrl.toLowerCase().endsWith(".pdf") ? (
                      <div className="space-y-3">
                        <FileText size={48} className="mx-auto text-lavender-600" />
                        <p className="text-xs font-bold text-ink">PDF Receipt Document</p>
                        <a
                          href={selectedPayment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gradient-button inline-flex items-center gap-1.5 py-2 px-4 text-xs"
                        >
                          <ExternalLink size={14} /> Open PDF Receipt
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <img
                          src={selectedPayment.receiptUrl}
                          alt="Payment Receipt"
                          className="mx-auto max-h-72 rounded-xl object-contain shadow-md"
                        />
                        <a
                          href={selectedPayment.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gradient-button inline-flex items-center gap-1.5 py-2 px-4 text-xs"
                        >
                          <ExternalLink size={14} /> View Full Image
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-ink/50">No receipt file uploaded.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(true)}
                  disabled={processing}
                  className="rounded-2xl bg-rose-100 px-6 py-3 text-xs font-black text-rose-700 hover:bg-rose-200 flex-1 justify-center flex items-center gap-1.5"
                >
                  <XCircle size={16} /> Reject Receipt
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(selectedPayment)}
                  disabled={processing}
                  className="gradient-button flex-1 justify-center py-3 text-xs shadow-md"
                >
                  {processing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Approve & Unlock Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {isRejectModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <h3 className="text-lg font-black text-rose-600">Reject Payment Submission</h3>
            <p className="mt-1 text-xs text-ink/60">
              Please specify a reason so {selectedPayment.studentName} can re-upload a valid receipt.
            </p>

            <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">
                  Rejection Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Reference number mismatch or receipt image unreadable."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="pastel-input mt-1.5 w-full"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="pill flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-black text-white hover:bg-rose-700 flex-1 justify-center"
                >
                  {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
