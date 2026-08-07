"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { db, functions } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { useCreateStudentForm } from "@/lib/hooks/use-create-student-form";
import { httpsCallable } from "firebase/functions";
import Link from "next/link";
import { 
  UserPlus, 
  CreditCard, 
  Search, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Phone, 
  GraduationCap, 
  Key, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Gift, 
  FileText,
  DollarSign
} from "lucide-react";

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Action Modals State
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"card" | "tempAccess" | null>(null);
  
  // Free Card State
  const [cardInput, setCardInput] = useState("");
  const [cardSubmitting, setCardSubmitting] = useState(false);

  // Temp Access State
  const [tempNotes, setTempNotes] = useState("");
  const [tempSubmitting, setTempSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { form, submitting, apiError, successData, handleSubmit } = useCreateStudentForm();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "student"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setStudents(items);
    } catch (err) {
      console.error("Error fetching students:", err);
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const items = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((u: any) => u.role === "student");
        setStudents(items);
      } catch (innerErr) {
        console.error("Fallback error:", innerErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.studentName?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.grade?.toLowerCase().includes(q) ||
      s.mobileNumber?.includes(q) ||
      s.whatsappNumber?.includes(q) ||
      s.smartCardNumber?.toLowerCase().includes(q)
    );
  });

  const handleAssignFreeCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !cardInput.trim()) return;
    setCardSubmitting(true);
    setErrorMessage(null);
    try {
      const fn = httpsCallable(functions, "assignFreePhysicalCard");
      const res: any = await fn({
        studentUid: selectedStudent.id,
        smartCardNumber: cardInput.trim(),
      });

      if (res.data?.success) {
        setToastMessage(`Free Smart Card (${cardInput.trim()}) assigned to ${selectedStudent.studentName}!`);
        setActionType(null);
        setSelectedStudent(null);
        setCardInput("");
        fetchStudents();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to assign free card.");
    } finally {
      setCardSubmitting(false);
    }
  };

  const handleToggleTempAccess = async (grant: boolean) => {
    if (!selectedStudent) return;
    setTempSubmitting(true);
    setErrorMessage(null);
    try {
      const fn = httpsCallable(functions, "toggleTemporaryCourseAccess");
      const res: any = await fn({
        studentUid: selectedStudent.id,
        grant,
        notes: tempNotes || (grant ? "Granted temporary access due to pending payment" : "Revoked access"),
      });

      if (res.data?.success) {
        setToastMessage(res.data.message);
        setActionType(null);
        setSelectedStudent(null);
        setTempNotes("");
        fetchStudents();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update temporary access.");
    } finally {
      setTempSubmitting(false);
    }
  };

  return (
    <DashboardShell role="teacher" active="Students">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-2xl animate-bounce">
          <CheckCircle2 size={20} />
          <span className="text-sm font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Teacher Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Student Management</h1>
          <p className="mt-2 text-ink/55">
            Search students by mobile number or ID, assign free smart cards, & grant temporary access for pending payments.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/teacher/physical-students"
            className="pill text-[#002583] flex items-center gap-2 font-black border-2 border-[#002583]/20 hover:bg-[#002583]/10"
          >
            <CreditCard size={18} /> Add Physical Smart Card
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="gradient-button flex items-center gap-2"
          >
            <UserPlus size={18} /> Register New Student
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mt-6 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by phone number (e.g. 0771234567), student name, ID or smart card..."
            className="pastel-input pl-11 font-medium"
          />
        </div>
      </Card>

      {/* Student List Table */}
      {loading ? (
        <div className="mt-10 flex flex-col items-center justify-center p-12 text-ink/50">
          <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
          <p className="mt-3 text-sm font-bold">Loading student records...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card className="mt-6 p-12 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lavender-100 text-3xl">
            👨‍🎓
          </div>
          <h3 className="mt-4 text-xl font-black">No Students Found</h3>
          <p className="mt-2 text-sm text-ink/55">
            {searchQuery ? "No matching records found for your mobile number or search query." : "Click 'Register New Student' above to register your first student."}
          </p>
        </Card>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white/80 shadow-soft backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-black uppercase text-ink/60">
              <tr>
                <th className="px-6 py-4">Student ID & Name</th>
                <th className="px-6 py-4">Contact Phone</th>
                <th className="px-6 py-4">Grade & Class Mode</th>
                <th className="px-6 py-4">Smart Card</th>
                <th className="px-6 py-4">Access Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition">
                  {/* Student ID & Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#002583]/10 font-bold text-[#002583]">
                        👨‍🎓
                      </div>
                      <div>
                        <div className="font-black text-ink">{s.studentName || s.fullName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge tone="purple">{s.studentId}</Badge>
                          {s.selfRegistered && <Badge tone="lavender">Self-Reg</Badge>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Phone */}
                  <td className="px-6 py-4 font-mono font-bold text-ink/80">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-lavender-600" />
                      <span>{s.mobileNumber}</span>
                    </div>
                    {s.whatsappNumber && s.whatsappNumber !== s.mobileNumber && (
                      <div className="text-xs font-normal text-emerald-600 mt-0.5">
                        WA: {s.whatsappNumber}
                      </div>
                    )}
                  </td>

                  {/* Grade & Mode */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-ink">{s.grade}</div>
                    <div className="text-xs text-ink/55">{s.classType || "Theory"}</div>
                  </td>

                  {/* Smart Card */}
                  <td className="px-6 py-4">
                    {s.smartCardNumber || s.smartCardLast4 ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl">
                        <CreditCard size={13} />
                        {s.smartCardNumber || `****${s.smartCardLast4}`}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                        No Card
                      </span>
                    )}
                  </td>

                  {/* Access Status */}
                  <td className="px-6 py-4">
                    {s.temporaryAccessGranted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl">
                        <Unlock size={13} /> Temp Access Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                        <Lock size={13} /> Standard Access
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Assign Free Card */}
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setCardInput(s.smartCardNumber || "");
                          setActionType("card");
                        }}
                        className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                        title="Assign Free Physical Smart Card"
                      >
                        <Gift size={14} /> Free Card
                      </button>

                      {/* Grant / Revoke Temp Access */}
                      <button
                        onClick={() => {
                          setSelectedStudent(s);
                          setTempNotes(s.temporaryAccessNotes || "");
                          setActionType("tempAccess");
                        }}
                        className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                          s.temporaryAccessGranted
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                        title="Manage Temporary Course & Record Access"
                      >
                        {s.temporaryAccessGranted ? (
                          <>
                            <Lock size={14} /> Remove Access
                          </>
                        ) : (
                          <>
                            <Unlock size={14} /> Temp Access
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: Assign Free Physical Card */}
      {actionType === "card" && selectedStudent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-lg">
                <Gift size={20} /> Assign Free Physical Card
              </div>
              <button onClick={() => setActionType(null)} className="rounded-full p-1.5 text-ink/40 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <p className="mt-3 text-xs text-ink/60">
              Assign a physical smart card to <strong>{selectedStudent.studentName}</strong> ({selectedStudent.studentId}) for free hall access.
            </p>

            {errorMessage && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAssignFreeCard} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">Smart Card Number *</label>
                <input
                  type="text"
                  value={cardInput}
                  onChange={(e) => setCardInput(e.target.value)}
                  placeholder="e.g. SC-2026-8899"
                  className="pastel-input mt-1.5 font-mono"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="pill flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={cardSubmitting}
                  className="gradient-button flex-1 justify-center"
                >
                  {cardSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Assign Free Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Temporary Access Manager (Due Payments) */}
      {actionType === "tempAccess" && selectedStudent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-lg p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-lg">
                <DollarSign size={20} /> Temporary Access Manager
              </div>
              <button onClick={() => setActionType(null)} className="rounded-full p-1.5 text-ink/40 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold text-sm">Grant Temporary Access for Pending Payments</p>
              <p>
                Student <strong>{selectedStudent.studentName}</strong> ({selectedStudent.mobileNumber}) has requested temporary access to class recordings, tute notes, and materials while their payment is pending.
              </p>
            </div>

            {errorMessage && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-ink/60">Reason / Notes (Optional)</label>
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="e.g. Bank slip verification pending, granted 3 days temporary access..."
                  className="pastel-input mt-1.5 h-20"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleTempAccess(false)}
                  disabled={tempSubmitting}
                  className="rounded-2xl border border-red-200 bg-red-50 py-3 text-xs font-bold text-red-700 hover:bg-red-100 flex-1 justify-center flex items-center gap-1.5"
                >
                  {tempSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock size={15} />}
                  Remove Temporary Access
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleTempAccess(true)}
                  disabled={tempSubmitting}
                  className="gradient-button py-3 text-xs font-bold flex-1 justify-center flex items-center gap-1.5"
                >
                  {tempSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unlock size={15} />}
                  Grant Temporary Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="soft-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-2xl font-black">Register New Student</h2>
                <p className="text-xs text-ink/55">Create student profile and auto-generate login credentials</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-2 text-ink/40 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {successData ? (
              <div className="my-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 text-3xl">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="mt-4 text-2xl font-black">Student Registered Successfully!</h3>
                <div className="mx-auto mt-4 max-w-md rounded-2xl bg-emerald-50 p-4 text-left text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 space-y-1.5">
                  <p><strong>Student ID:</strong> {successData.studentId}</p>
                  <p><strong>Generated Email:</strong> {successData.email}</p>
                  <p><strong>User UID:</strong> {successData.uid}</p>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    fetchStudents();
                  }}
                  className="gradient-button mt-6"
                >
                  Done & Refresh List
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {apiError && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    {apiError}
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Student Name</label>
                    <input {...form.register("studentName")} className="pastel-input mt-1.5" placeholder="Kasun Perera" />
                    {form.formState.errors.studentName && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.studentName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Gender</label>
                    <select {...form.register("gender")} className="pastel-input mt-1.5">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Date of Birth</label>
                    <input type="date" {...form.register("birthday")} className="pastel-input mt-1.5" />
                    {form.formState.errors.birthday && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.birthday.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Grade</label>
                    <select {...form.register("grade")} className="pastel-input mt-1.5">
                      <option value="Grade 6">Grade 6</option>
                      <option value="Grade 7">Grade 7</option>
                      <option value="Grade 8">Grade 8</option>
                      <option value="Grade 9">Grade 9</option>
                      <option value="Grade 10">Grade 10</option>
                      <option value="Grade 11">Grade 11</option>
                      <option value="A/L Science">A/L Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Class Type</label>
                    <select {...form.register("classType")} className="pastel-input mt-1.5">
                      <option value="Physical + Online">Physical + Online</option>
                      <option value="Online Only">Online Only</option>
                      <option value="Theory">Theory</option>
                      <option value="Paper">Paper</option>
                      <option value="Revision">Revision</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">School Name</label>
                    <input {...form.register("schoolName")} className="pastel-input mt-1.5" placeholder="Royal College" />
                    {form.formState.errors.schoolName && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.schoolName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Parent Name</label>
                    <input {...form.register("parentName")} className="pastel-input mt-1.5" placeholder="Sunil Perera" />
                    {form.formState.errors.parentName && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.parentName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Mobile Number</label>
                    <input {...form.register("mobileNumber")} className="pastel-input mt-1.5" placeholder="0771234567" />
                    {form.formState.errors.mobileNumber && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.mobileNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">WhatsApp Number</label>
                    <input {...form.register("whatsappNumber")} className="pastel-input mt-1.5" placeholder="0771234567" />
                    {form.formState.errors.whatsappNumber && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.whatsappNumber.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Address Line 1</label>
                    <input {...form.register("addressLine1")} className="pastel-input mt-1.5" placeholder="No 12, Main Street" />
                    {form.formState.errors.addressLine1 && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.addressLine1.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Address Line 2 (Optional)</label>
                    <input {...form.register("addressLine2")} className="pastel-input mt-1.5" placeholder="Near Temple" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">City</label>
                    <input {...form.register("city")} className="pastel-input mt-1.5" placeholder="Nugegoda" />
                    {form.formState.errors.city && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">District</label>
                    <input {...form.register("district")} className="pastel-input mt-1.5" placeholder="Colombo" />
                    {form.formState.errors.district && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.district.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Password</label>
                    <input type="password" {...form.register("password")} className="pastel-input mt-1.5" placeholder="••••••••" />
                    {form.formState.errors.password && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Confirm Password</label>
                    <input type="password" {...form.register("confirmPassword")} className="pastel-input mt-1.5" placeholder="••••••••" />
                    {form.formState.errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Status</label>
                    <select {...form.register("status")} className="pastel-input mt-1.5">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-ink/60">Admission Date</label>
                    <input type="date" {...form.register("admissionDate")} className="pastel-input mt-1.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-ink/60">Notes (Optional)</label>
                  <textarea {...form.register("notes")} className="pastel-input mt-1.5 h-20" placeholder="Additional student notes..." />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="pill flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="gradient-button flex-1 justify-center"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Student Account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
