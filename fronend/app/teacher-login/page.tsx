"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Brand } from "@/components/brand";
import { PublicShell } from "@/components/public-shell";

export default function TeacherLoginPage() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verify Role
      const tokenResult = await user.getIdTokenResult();
      const tokenRole = tokenResult.claims.role;

      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const docRole = userDoc.exists() ? userDoc.data()?.role : null;

      const isTeacherOrAdmin =
        tokenRole === "teacher" ||
        tokenRole === "admin" ||
        docRole === "teacher" ||
        docRole === "admin";

      if (!isTeacherOrAdmin) {
        await auth.signOut();
        setError("Access Denied: Student accounts cannot log in to the Teacher Portal.");
        return;
      }

      router.push("/teacher/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicShell>
      <div className="grid min-h-[85vh] place-items-center p-4 py-8">
        <div className="soft-panel grid w-full max-w-5xl overflow-hidden border-2 border-lavender-200/90 shadow-2xl lg:grid-cols-2">
          {/* Left Branding Side - Fitted loginbg.png image filling the blue container */}
          <div className="relative hidden min-h-[500px] flex-col justify-between overflow-hidden bg-[#072b82] p-8 text-white lg:flex">
            {/* Full cover background image fitting the blue square */}
            <Image
              src="/images/bg/loginbg.avif"
              alt="Science LMS Teacher Login Background"
              fill
              className="object-cover object-center"
              priority
            />

            {/* Soft gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#051c59]/100 via-[#072b82]/20 to-[#072b82]/05 pointer-events-none" />

            <div className="relative z-10">
              
            </div>

            <div className="relative z-10 mt-auto pt-28">
              <span className="inline-block rounded-full bg-[#FFB800] px-3 py-1 text-[11px] font-black text-[#002583] shadow-md">
                Teacher Portal
              </span>
              <h1 className="mt-3 text-3xl font-black text-white drop-shadow-md">
                Teacher Login
              </h1>
              <p className="mt-2 max-w-sm text-xs font-bold leading-relaxed text-white/95 drop-shadow-sm">
                Access your students, classes, attendance and payment approvals.
              </p>
            </div>
          </div>

          <div className="p-7 md:p-12">
            <div className="lg:hidden">
              <Brand />
            </div>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-[.18em] text-[#002583]">Teacher Login</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Sign in to your portal</h2>
            <p className="mt-2 text-sm text-ink/60">Enter your credentials to access the teacher dashboard.</p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {error}
                </div>
              )}
              <label className="block text-sm font-bold">
                Email
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pastel-input pl-11"
                    placeholder="name@example.com"
                  />
                </div>
              </label>
              <label className="block text-sm font-bold">
                Password
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pastel-input pl-11 pr-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/75"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="gradient-button flex w-full items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
              <Link href="/" className="block text-center text-sm font-bold text-[#002583] hover:underline">
                Return to public website
              </Link>
            </form>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
