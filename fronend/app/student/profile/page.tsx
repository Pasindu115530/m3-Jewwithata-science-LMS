"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { Card, Badge } from "@/components/ui";
import { UserRound, Phone, Mail, GraduationCap, Calendar, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface StudentProfile {
  studentName?: string;
  grade?: string;
  studentId?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  email?: string;
  admissionDate?: string;
  status?: string;
}

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as StudentProfile);
          } else {
            setProfile({
              studentName: user.displayName || user.email?.split("@")[0] || "Student",
              email: user.email || "",
              grade: "Grade 10",
              status: "Active",
            });
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/student-login");
  };

  return (
    <StudentGuard>
      <DashboardShell role="student" active="Profile">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">My Account Profile</h1>
          <p className="mt-2 text-ink/55">
            Your registered student details and class enrollment status.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading your profile...</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Left Card: Avatar & Summary */}
            <Card className="p-6 text-center md:col-span-1">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-lavender-100 text-5xl shadow-card">
                👩‍🎓
              </div>
              <h2 className="mt-4 text-xl font-black text-ink">{profile?.studentName || "Student"}</h2>
              <p className="mt-1 text-xs font-bold text-lavender-600">{profile?.studentId || "STU-REGISTERED"}</p>
              
              <div className="mt-4 flex justify-center">
                <Badge tone={profile?.status === "Active" ? "green" : "purple"}>
                  {profile?.status || "Active Student"}
                </Badge>
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 py-3 text-xs font-black text-rose-600 transition hover:bg-rose-100"
              >
                <LogOut size={16} /> Sign Out of Account
              </button>
            </Card>

            {/* Right Card: Details List */}
            <Card className="p-6 md:col-span-2 space-y-6">
              <h3 className="text-lg font-black text-ink border-b pb-3">Student Information</h3>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lavender-100 text-lavender-700">
                    <UserRound size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase text-ink/40">Full Name</p>
                    <p className="mt-0.5 text-sm font-black text-ink">{profile?.studentName || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-700">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase text-ink/40">Enrolled Grade</p>
                    <p className="mt-0.5 text-sm font-black text-ink">{profile?.grade || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase text-ink/40">Mobile Number</p>
                    <p className="mt-0.5 text-sm font-black text-ink">{profile?.mobileNumber || profile?.whatsappNumber || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase text-ink/40">Admission Date</p>
                    <p className="mt-0.5 text-sm font-black text-ink">{profile?.admissionDate || "2026"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase text-ink/40">Account Status</p>
                    <p className="mt-0.5 text-sm font-black text-emerald-600">{profile?.status || "Active"}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </DashboardShell>
    </StudentGuard>
  );
}
