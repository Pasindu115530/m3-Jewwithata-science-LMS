"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc,
  query,
  where
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, storage } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  CreditCard, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Building2, 
  QrCode, 
  FileText, 
  AlertCircle,
  Eye,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

interface CourseItem {
  id: string;
  title: string;
  grade: string;
  fee?: number | string;
}

interface PaymentRecord {
  id: string;
  studentUid: string;
  studentName?: string;
  studentId?: string;
  courseId: string;
  courseTitle: string;
  grade?: string;
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

const MONTHS = [
  "January 2026", "February 2026", "March 2026", "April 2026",
  "May 2026", "June 2026", "July 2026", "August 2026",
  "September 2026", "October 2026", "November 2026", "December 2026"
];

export default function StudentPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentGrade, setStudentGrade] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<CourseItem[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("August 2026");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchStudentData = async (uid: string) => {
    try {
      // Fetch student profile
      const userDoc = await getDoc(doc(db, "users", uid));
      let enrolledIds: string[] = [];
      let sGrade = "Grade 10";

      if (userDoc.exists()) {
        const d = userDoc.data();
        enrolledIds = d.enrolledClasses || [];
        sGrade = d.grade || "Grade 10";
        setStudentName(d.studentName || d.fullName || "Student");
        setStudentId(d.studentId || "STU-1001");
        setStudentGrade(sGrade);
      }

      // Fetch enrolled courses
      if (enrolledIds.length > 0) {
        const classesSnap = await getDocs(collection(db, "classes"));
        const all = classesSnap.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as CourseItem)
          .filter((c) => enrolledIds.includes(c.id));
        setEnrolledCourses(all);
        if (all.length > 0) setSelectedCourseId(all[0].id);
      }

      // Fetch student payments
      const q = query(collection(db, "payments"), where("studentUid", "==", uid));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PaymentRecord);
      // Sort desc by submittedAt
      items.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setPayments(items);
    } catch (err) {
      console.error("Error fetching payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
        fetchStudentData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check if student has pending payment for selected course & month
  const isDuplicatePending = (courseId: string, month: string) => {
    return payments.some(
      (p) => p.courseId === courseId && p.month === month && (p.status === "Pending" || p.status === "Approved")
    );
  };

  const getDuplicateStatus = (courseId: string, month: string) => {
    const record = payments.find((p) => p.courseId === courseId && p.month === month);
    if (!record) return null;
    return record.status;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      
      if (!validTypes.includes(selectedFile.type)) {
        setFormError("Invalid file type. Please upload a JPG, PNG, or PDF file.");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        setFormError("File size exceeds 10 MB limit.");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!selectedCourseId) {
      setFormError("Please select an enrolled course.");
      return;
    }

    if (!file) {
      setFormError("Please upload a payment proof receipt (Image or PDF).");
      return;
    }

    // Check duplicate pending / approved status
    const status = getDuplicateStatus(selectedCourseId, paymentMonth);
    if (status === "Approved") {
      setFormError(`Payment for ${paymentMonth} has already been approved for this course!`);
      return;
    }
    if (status === "Pending") {
      setFormError(`A payment for ${paymentMonth} is currently pending approval. You cannot submit another.`);
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const targetCourse = enrolledCourses.find((c) => c.id === selectedCourseId);
      const courseTitle = targetCourse?.title || "Science Course";

      // Upload file to Firebase Storage (or mock URL if offline)
      let downloadUrl = "";
      try {
        const storagePath = `payment_proofs/${userUid}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            },
            (error) => reject(error),
            async () => {
              downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            }
          );
        });
      } catch (storageErr) {
        console.warn("Storage upload fallback:", storageErr);
        // Fallback to data URL or dummy preview
        downloadUrl = URL.createObjectURL(file);
      }

      // Add Payment record to Firestore
      const newPayment: Omit<PaymentRecord, "id"> = {
        studentUid: userUid,
        studentName,
        studentId,
        grade: studentGrade,
        courseId: selectedCourseId,
        courseTitle,
        month: paymentMonth,
        amount: amount || targetCourse?.fee?.toString() || "3200",
        paymentMethod,
        referenceNumber,
        receiptUrl: downloadUrl,
        receiptFileName: file.name,
        note,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "payments"), newPayment);

      // Create Notification for Teacher/Admin
      await addDoc(collection(db, "notifications"), {
        title: "New Payment Submitted",
        message: `${studentName} submitted LKR ${newPayment.amount} for ${courseTitle} (${paymentMonth}).`,
        targetRole: "teacher",
        studentUid: userUid,
        createdAt: new Date().toISOString(),
      });

      setFormSuccess("Payment submitted successfully! Your receipt is now pending teacher verification.");
      setFile(null);
      setReferenceNumber("");
      setNote("");
      setUploadProgress(null);

      // Refresh payments list
      fetchStudentData(userUid);
    } catch (err: any) {
      console.error("Submission error:", err);
      setFormError(err.message || "Failed to submit payment receipt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentGuard>
      <DashboardShell role="student" active="Payments">
        {/* Header */}
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Class Fee Payments</h1>
          <p className="mt-2 text-ink/55">
            Submit monthly course payments and view your payment verification history.
          </p>
        </div>

        {/* Top Institute Account Details Card */}
        <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-lavender-600 via-lavender-700 to-indigo-800 p-6 md:p-8 text-white shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <Building2 size={14} /> Official Institute Payment Details
              </div>
              <h2 className="text-2xl font-black md:text-3xl">Kalhara Science Institute</h2>
              <div className="grid gap-3 sm:grid-cols-2 text-xs font-semibold text-white/90">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-white/60">Bank Name</span>
                  <span className="text-sm font-black">Commercial Bank</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-white/60">Branch</span>
                  <span className="text-sm font-black">Colombo Main Branch</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-white/60">Account Number</span>
                  <span className="text-sm font-black font-mono tracking-wider">800-4592-1100-88</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-white/60">Account Type</span>
                  <span className="text-sm font-black">Savings Account</span>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20">
              <div className="text-center">
                <QrCode size={64} className="mx-auto text-white" />
                <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                  Scan & Pay Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Submission Form (Left) & Payment History (Right) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          {/* LEFT: PAYMENT SUBMISSION FORM */}
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-2 border-b pb-4">
              <CreditCard className="text-lavender-600" size={22} />
              <div>
                <h2 className="text-xl font-black text-ink">Submit Monthly Payment</h2>
                <p className="text-xs text-ink/55">Upload your transfer receipt for verification</p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-700 border border-rose-200">
                <AlertCircle size={18} className="shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 border border-emerald-200">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPayment} className="mt-6 space-y-4">
              {/* Select Enrolled Course */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">
                  Select Enrolled Course *
                </label>
                {enrolledCourses.length === 0 ? (
                  <div className="mt-1.5 rounded-2xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
                    ⚠️ You are not enrolled in any courses yet. <Link href="/student/courses" className="font-bold underline">Enroll in a course</Link> to submit payment.
                  </div>
                ) : (
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                    className="pastel-input mt-1.5"
                  >
                    {enrolledCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.grade}) {c.fee ? `- LKR ${c.fee}` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Payment Month & Amount */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">
                    Payment Month *
                  </label>
                  <select
                    value={paymentMonth}
                    onChange={(e) => setPaymentMonth(e.target.value)}
                    required
                    className="pastel-input mt-1.5"
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">
                    Payment Amount (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pastel-input mt-1.5"
                  />
                </div>
              </div>

              {/* Payment Method & Reference Number */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="pastel-input mt-1.5"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Online Transfer">Online Transfer</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">
                    Transaction / Ref No *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TXN-9988112"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="pastel-input mt-1.5"
                  />
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">
                  Optional Student Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid via Online App"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="pastel-input mt-1.5"
                />
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">
                  Upload Payment Proof (JPG, PNG, PDF max 10MB) *
                </label>
                <div className="mt-1.5 rounded-2xl border-2 border-dashed border-lavender-300 bg-lavender-50/50 p-6 text-center transition hover:bg-lavender-50">
                  <input
                    type="file"
                    id="receiptUpload"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="receiptUpload" className="cursor-pointer">
                    <UploadCloud size={32} className="mx-auto text-lavender-600" />
                    <p className="mt-2 text-xs font-bold text-ink">
                      {file ? file.name : "Click to select or drag & drop payment receipt"}
                    </p>
                    <p className="mt-1 text-[10px] text-ink/50">
                      JPG, PNG, JPEG or PDF (Max size 10MB)
                    </p>
                  </label>
                </div>

                {/* Upload Progress Indicator */}
                {uploadProgress !== null && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-ink/60">
                      <span>Uploading receipt...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-lavender-600 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Check Duplicate Warning */}
              {selectedCourseId && isDuplicatePending(selectedCourseId, paymentMonth) && (
                <div className="rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900 border border-amber-200 flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>
                    A payment for {paymentMonth} is already submitted ({getDuplicateStatus(selectedCourseId, paymentMonth)}).
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || enrolledCourses.length === 0}
                className="gradient-button mt-4 w-full justify-center py-3 text-xs shadow-md"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting Receipt...
                  </span>
                ) : (
                  "Submit Payment Receipt"
                )}
              </button>
            </form>
          </Card>

          {/* RIGHT: PAYMENT HISTORY & STATUS TABLE */}
          <div className="space-y-6">
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-ink">Payment History</h2>
                  <p className="text-xs text-ink/55">Track status of your submitted receipts</p>
                </div>
                <Badge tone="purple">{payments.length} Records</Badge>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-ink/50">
                  <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
                  <p className="mt-3 text-sm font-bold">Loading payment status...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    emoji="💳"
                    title="No Receipts Submitted"
                    description="Your submitted payment receipts will appear here with live approval status."
                  />
                </div>
              ) : (
                <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-lavender-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge tone="purple">{p.courseTitle}</Badge>

                        {/* Status Badge */}
                        {p.status === "Approved" && (
                          <Badge tone="green" className="flex items-center gap-1">
                            <CheckCircle2 size={13} /> 🟢 Approved
                          </Badge>
                        )}
                        {p.status === "Pending" && (
                          <Badge tone="yellow" className="flex items-center gap-1">
                            <Clock size={13} /> 🟡 Pending Approval
                          </Badge>
                        )}
                        {p.status === "Rejected" && (
                          <Badge tone="pink" className="flex items-center gap-1">
                            <XCircle size={13} /> 🔴 Rejected
                          </Badge>
                        )}
                      </div>

                      <div className="mt-3 flex justify-between items-baseline">
                        <div>
                          <h3 className="text-base font-black text-ink">{p.month}</h3>
                          <p className="mt-0.5 text-xs text-ink/55">
                            Method: <span className="font-bold">{p.paymentMethod}</span> • Ref: <code className="font-mono text-ink/80">{p.referenceNumber}</code>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-lavender-700">LKR {p.amount}</p>
                        </div>
                      </div>

                      {/* Rejection Comments Alert */}
                      {p.status === "Rejected" && p.rejectionReason && (
                        <div className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-200">
                          <span className="font-bold">Teacher Feedback:</span> {p.rejectionReason}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-ink/40">
                        <span>Submitted: {new Date(p.submittedAt).toLocaleDateString("en-GB")}</span>
                        {p.receiptUrl && (
                          <a
                            href={p.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-bold text-lavender-600 hover:underline"
                          >
                            <Eye size={13} /> View Receipt
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </DashboardShell>
    </StudentGuard>
  );
}
