"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Loader2, Phone, KeyRound, ArrowRight, RefreshCw } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Brand } from "@/components/brand";
import { PublicShell } from "@/components/public-shell";
import { sendStudentOtpService, verifyStudentOtpService } from "@/lib/services/otp";

export default function StudentLoginPage() {
  const [activeTab, setActiveTab] = useState<"credentials" | "otp">("credentials");
  const router = useRouter();

  // Password Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credError, setCredError] = useState<string | null>(null);
  const [credLoading, setCredLoading] = useState(false);

  // OTP Login state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Username/Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);
    setCredLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/student/dashboard");
    } catch (err: any) {
      console.error("Student login error:", err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setCredError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setCredError("Too many failed attempts. Please try again later.");
      } else {
        setCredError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setCredLoading(false);
    }
  };

  // Handle Send OTP SMS
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOtpError(null);
    setOtpMessage(null);
    setOtpLoading(true);

    const res = await sendStudentOtpService(phone);
    setOtpLoading(false);

    if (res.success) {
      setOtpSent(true);
      setOtpMessage(res.message || "OTP code sent via SMS!");
      setTimer(60); // 60s resend timer
    } else {
      setOtpError(res.error || "Failed to send OTP code.");
    }
  };

  // Handle Verify OTP & Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpLoading(true);

    const res = await verifyStudentOtpService(phone, otpCode);
    setOtpLoading(false);

    if (res.success) {
      router.push("/student/dashboard");
    } else {
      setOtpError(res.error || "Verification failed. Please check the code.");
    }
  };

  return (
    <PublicShell>
      <div className="grid min-h-[85vh] place-items-center p-4 py-8">
      <div className="soft-panel grid w-full max-w-5xl overflow-hidden lg:grid-cols-2">
        {/* Left Branding Side */}
        <div className="hidden bg-gradient-to-br from-lavender-300 to-lavender-600 p-10 text-white lg:block">
          <Brand />
          <div className="mt-24 text-8xl">👩‍🎓</div>
          <h1 className="mt-6 text-4xl font-black">Welcome back.</h1>
          <p className="mt-3 max-w-sm leading-7 text-white/75">
            Access your personalised lessons, classes, assignments and progress.
          </p>
        </div>

        {/* Right Form Side */}
        <div className="p-7 md:p-12">
          <div className="lg:hidden">
            <Brand />
          </div>
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">Student Portal</p>
          <h2 className="mt-2 text-3xl font-black">Sign in to your account</h2>

          {/* Login Method Tabs */}
          <div className="mt-6 flex rounded-2xl bg-lavender-100/60 p-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab("credentials");
                setCredError(null);
              }}
              className={`flex-1 rounded-xl py-2.5 text-xs font-black transition ${
                activeTab === "credentials"
                  ? "bg-white text-lavender-700 shadow-sm"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("otp");
                setOtpError(null);
              }}
              className={`flex-1 rounded-xl py-2.5 text-xs font-black transition ${
                activeTab === "otp"
                  ? "bg-white text-lavender-700 shadow-sm"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              SMS OTP Login 📲
            </button>
          </div>

          {/* TAB 1: EMAIL & PASSWORD LOGIN */}
          {activeTab === "credentials" && (
            <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
              {credError && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  {credError}
                </div>
              )}
              <label className="block text-sm font-bold">
                Student Email
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pastel-input pl-11"
                    placeholder="stu0001@student.kalaharascience.lk"
                  />
                </div>
              </label>
              <label className="block text-sm font-bold">
                Password
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pastel-input pl-11"
                    placeholder="••••••••"
                  />
                </div>
              </label>
              <button
                type="submit"
                disabled={credLoading}
                className="gradient-button flex w-full items-center justify-center gap-2"
              >
                {credLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In with Password"
                )}
              </button>
              <Link href="/" className="block text-center text-sm font-bold text-lavender-700">
                Return to public website
              </Link>
            </form>
          )}

          {/* TAB 2: SMS OTP LOGIN */}
          {activeTab === "otp" && (
            <div className="mt-6 space-y-4">
              {otpError && (
                <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
                  {otpError}
                </div>
              )}
              {otpMessage && (
                <div className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                  {otpMessage}
                </div>
              )}

              {!otpSent ? (
                /* STEP 1: ENTER PHONE NUMBER */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <label className="block text-sm font-bold">
                    Registered Mobile Number
                    <div className="relative mt-2">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pastel-input pl-11"
                        placeholder="0771234567"
                      />
                    </div>
                    <span className="mt-1 block text-xs font-normal text-ink/50">
                      Enter the mobile number registered with your LMS account.
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={otpLoading}
                    className="gradient-button flex w-full items-center justify-center gap-2"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send Verification SMS <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: ENTER OTP CODE */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <label className="block text-sm font-bold">
                    6-Digit SMS Code
                    <div className="relative mt-2">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={18} />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="pastel-input pl-11 tracking-widest font-black text-lg"
                        placeholder="123456"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={otpLoading || otpCode.length !== 6}
                    className="gradient-button flex w-full items-center justify-center gap-2"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Sign In"
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs font-bold pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-ink/50 hover:text-ink"
                    >
                      Change Number
                    </button>
                    {timer > 0 ? (
                      <span className="text-ink/40">Resend SMS in {timer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="flex items-center gap-1 text-lavender-700 hover:underline"
                      >
                        <RefreshCw size={12} /> Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}

              <Link href="/" className="block text-center text-sm font-bold text-lavender-700 pt-2">
                Return to public website
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </PublicShell>
  );
}
