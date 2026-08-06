"use client";

import { useState } from "react";
import Link from "next/link";
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
      await signInWithEmailAndPassword(auth, email, password);
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
        <div className="soft-panel grid w-full max-w-5xl overflow-hidden lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-lavender-300 to-lavender-600 p-10 text-white lg:block">
            <Brand />
            <div className="mt-24 text-8xl">👨‍🏫</div>
            <h1 className="mt-6 text-4xl font-black">Welcome back.</h1>
            <p className="mt-3 max-w-sm leading-7 text-white/75">
              Access your personalised students, classes, attendance and payment approvals.
            </p>
          </div>
          <div className="p-7 md:p-12">
            <div className="lg:hidden">
              <Brand />
            </div>
            <p className="mt-10 text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">Teacher Login</p>
            <h2 className="mt-3 text-3xl font-black">Sign in to your portal</h2>
            <p className="mt-2 text-sm text-ink/50">Enter your credentials to access the teacher dashboard.</p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
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
              <Link href="/" className="block text-center text-sm font-bold text-lavender-700">
                Return to public website
              </Link>
            </form>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
