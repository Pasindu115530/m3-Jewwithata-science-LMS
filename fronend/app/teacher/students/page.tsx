"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, Badge } from "@/components/ui";
import { useCreateStudentForm } from "@/lib/hooks/use-create-student-form";
import { 
  UserPlus, 
  Search, 
  Loader2, 
  X, 
  CheckCircle2, 
  Users, 
  Phone, 
  GraduationCap, 
  MapPin, 
  Calendar 
} from "lucide-react";

export default function StudentsManagementPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    const q = searchQuery.toLowerCase();
    return (
      s.studentName?.toLowerCase().includes(q) ||
      s.studentId?.toLowerCase().includes(q) ||
      s.grade?.toLowerCase().includes(q) ||
      s.mobileNumber?.includes(q)
    );
  });

  return (
    <DashboardShell role="teacher" active="Students">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Teacher Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Student Management</h1>
          <p className="mt-2 text-ink/55">
            Register new students, auto-generate Student IDs, and manage student accounts.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="gradient-button flex items-center gap-2"
        >
          <UserPlus size={18} /> Register New Student
        </button>
      </div>

      {/* Search Bar */}
      <Card className="mt-6 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students by name, Student ID, grade or mobile number..."
            className="pastel-input pl-11"
          />
        </div>
      </Card>

      {/* Student List */}
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
            {searchQuery ? "No matching records found for your search query." : "Click 'Register New Student' above to register your first student."}
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((s) => (
            <Card key={s.id} className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge tone="purple">{s.studentId}</Badge>
                  <Badge tone={s.status === "Active" ? "green" : "yellow"}>{s.status}</Badge>
                </div>

                <h2 className="mt-3 text-xl font-black">{s.studentName}</h2>
                <p className="text-xs font-bold text-lavender-700">{s.grade} • {s.classType}</p>

                <div className="mt-4 space-y-2 text-sm font-medium text-ink/75">
                  <div className="flex items-center gap-2">
                    <Phone className="text-lavender-600" size={15} />
                    <span>Mobile: {s.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-lavender-600" size={15} />
                    <span>School: {s.schoolName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-lavender-600" size={15} />
                    <span>City: {s.city}, {s.district}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-ink/60 dark:bg-slate-800/40">
                  Login Email: <code className="font-bold text-ink">{s.email}</code>
                </div>
              </div>
            </Card>
          ))}
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
                      <option value="Theory">Theory</option>
                      <option value="Paper">Paper</option>
                      <option value="Revision">Revision</option>
                      <option value="Online">Online</option>
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
