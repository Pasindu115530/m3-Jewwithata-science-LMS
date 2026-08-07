"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";

export function StudentGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Exclude public registration route from Auth guard check
    if (pathname === "/student/register") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/student-login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (pathname === "/student/register") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-lavender-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-lavender-600 border-t-transparent"></div>
          <p className="text-sm font-bold text-ink/60">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
