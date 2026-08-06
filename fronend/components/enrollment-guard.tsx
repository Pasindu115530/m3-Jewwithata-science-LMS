"use client";

import { useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Card } from "@/components/ui";
import { Loader2, AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";

interface EnrollmentGuardProps {
  children: ReactNode;
}

export function EnrollmentGuard({ children }: EnrollmentGuardProps) {
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [studentGrade, setStudentGrade] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const enrolledClasses: string[] = data.enrolledClasses || [];
            setIsEnrolled(enrolledClasses.length > 0);
            setStudentGrade(data.grade || "");
          } else {
            setIsEnrolled(false);
          }
        } catch (err) {
          console.error("Error checking enrollment:", err);
          setIsEnrolled(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-ink/50">
        <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
        <p className="mt-3 text-sm font-bold">Checking course enrollment...</p>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <Card className="mt-6 p-8 text-center md:p-12">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-100 text-4xl shadow-sm">
          🔒
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600">
          <AlertCircle size={15} /> Enrollment Required
        </div>
        <h2 className="mt-2 text-2xl font-black text-ink">You are not enrolled in any courses yet</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink/60">
          Access to live Zoom classes, tutes, and video recordings is locked until your enrollment is complete. Complete your monthly payment to unlock your {studentGrade || "grade"} courses.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/student/payments"
            className="flex items-center gap-2 rounded-2xl bg-lavender-600 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:bg-lavender-700"
          >
            <CreditCard size={18} /> Make Payment & Enroll
          </Link>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
