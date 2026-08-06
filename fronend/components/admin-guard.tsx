"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/teacher-login");
        setLoading(false);
        return;
      }

      // Check custom claim role
      const tokenResult = await user.getIdTokenResult(true);
      const role = tokenResult.claims.role as string | undefined;

      if (role === "admin") {
        setAuthorized(true);
      } else {
        router.replace("/teacher-login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-lavender-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-600 border-t-transparent" />
          <p className="text-sm font-bold text-ink/60">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
