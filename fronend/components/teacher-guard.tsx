"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

export function TeacherGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setAuthorized(false);
        setUser(null);
        setLoading(false);
        router.replace("/teacher-login");
        return;
      }

      try {
        // 1. Check Auth Token Claims
        const tokenResult = await currentUser.getIdTokenResult();
        const tokenRole = tokenResult.claims.role;

        // 2. Check Firestore User Doc Role
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const docRole = userDoc.exists() ? userDoc.data()?.role : null;

        const isTeacherOrAdmin =
          tokenRole === "teacher" ||
          tokenRole === "admin" ||
          docRole === "teacher" ||
          docRole === "admin";

        if (isTeacherOrAdmin) {
          setUser(currentUser);
          setAuthorized(true);
        } else {
          // Access Denied: User is a student attempting to access teacher dashboard!
          console.warn("Access Denied: Student account attempted to access Teacher Portal.", currentUser.uid);
          setAuthorized(false);
          setUser(null);
          router.replace("/student/courses");
        }
      } catch (err) {
        console.error("Error verifying teacher role:", err);
        setAuthorized(false);
        router.replace("/teacher-login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-lavender-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-600 border-t-transparent" />
          <p className="text-sm font-bold text-ink/60">Verifying teacher privileges...</p>
        </div>
      </div>
    );
  }

  if (!user || !authorized) return null;

  return <>{children}</>;
}
