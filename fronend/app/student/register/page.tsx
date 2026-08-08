"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  User, 
  Users, 
  GraduationCap, 
  School, 
  MapPin, 
  Lock, 
  Sparkles, 
  Check, 
  FileText,
  CreditCard,
  Building2,
  Calendar,
  Eye,
  EyeOff,
  Atom,
  HelpCircle,
  Clock
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { PublicShell } from "@/components/public-shell";
import { sendRegistrationOtpService, verifyRegistrationOtpService } from "@/lib/services/registration-otp";
import { verifyPhysicalStudentService, verifyActivationCodeService } from "@/lib/services/physical-verification";
import { registerStudentService, getServiceConfigService } from "@/lib/services/register-student";

export default function StudentRegisterPage() {
  const router = useRouter();

  // Current multi-step state (1 to 7)
  const [step, setStep] = useState<number>(1);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // STEP 1: Phone & OTP State
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // STEP 2: Details State
  const [parentName, setParentName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female">("Male");
  const [birthday, setBirthday] = useState("");
  const [grade, setGrade] = useState("Grade 10");
  const [schoolName, setSchoolName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("Kalutara");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // STEP 3: Class Type State
  const [studentType, setStudentType] = useState<"online_only" | "physical_online">("physical_online");

  // STEP 4: Physical Verification State (if physical_online)
  const [smartCardLast4, setSmartCardLast4] = useState("");
  const [cardVerified, setCardVerified] = useState(false);
  const [physicalStudentId, setPhysicalStudentId] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState("");
  const [activationVerified, setActivationVerified] = useState(false);

  // STEP 5: Online Paper Class State
  const [wantsPaperClass, setWantsPaperClass] = useState(false);
  const [paperClassFee, setPaperClassFee] = useState<number>(2500);

  // STEP 7: Completion Data
  const [registeredData, setRegisteredData] = useState<{ studentId: string; email: string } | null>(null);

  // Sync WhatsApp number with Mobile number if sameAsPhone is checked
  useEffect(() => {
    if (sameAsPhone) {
      setWhatsappNumber(mobileNumber);
    }
  }, [sameAsPhone, mobileNumber]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: any = null;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Fetch grade-specific paper class fee on grade change
  useEffect(() => {
    getServiceConfigService(grade).then((res) => {
      if (res.fee) setPaperClassFee(res.fee);
    });
  }, [grade]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!studentName.trim()) {
      setGlobalError("Please enter student full name / කරුණාකර ශිෂ්‍යයාගේ නම ඇතුළත් කරන්න");
      return;
    }
    if (!/^07[0-9]{8}$/.test(mobileNumber)) {
      setGlobalError("Enter a valid 10-digit Sri Lankan mobile number (e.g. 0771234567)");
      return;
    }

    setLoading(true);
    const res = await sendRegistrationOtpService(mobileNumber);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.error || "Failed to send verification SMS. Please verify your number.");
    } else {
      setOtpSent(true);
      setOtpTimer(60);
      setGlobalError(null);
    }
  };

  // Step 1: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!otpCode.trim() || otpCode.length !== 6) {
      setGlobalError("Enter the 6-digit OTP code / 6-ඉලක්කම් OTP කේතය ඇතුළත් කරන්න");
      return;
    }

    setLoading(true);
    const res = await verifyRegistrationOtpService(mobileNumber, otpCode);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.error || "Invalid or expired OTP code.");
    } else {
      setOtpVerified(true);
      setGlobalError(null);
      setStep(2); // Auto-advance to Step 2
    }
  };

  // Step 2: Validate Personal Details & Advance
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!parentName.trim() || !birthday || !schoolName.trim() || !addressLine1.trim() || !city.trim()) {
      setGlobalError("Please fill in all required fields / කරුණාකර සියලුම අනිවාර්ය තොරතුරු පුරවන්න");
      return;
    }

    if (password.length < 6) {
      setGlobalError("Password must be at least 6 characters / මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය");
      return;
    }

    if (password !== confirmPassword) {
      setGlobalError("Passwords do not match / මුරපද දෙක සමාන විය යුතුය");
      return;
    }

    setStep(3); // Advance to Class Type Selection
  };

  // Step 4: Verify Smart Card Last 4 Digits
  const handleVerifySmartCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (smartCardLast4.length !== 4) {
      setGlobalError("Enter exact 4 digits of your Smart Card / Smart Card අවසාන ඉලක්කම් 4 ඇතුළත් කරන්න");
      return;
    }

    setLoading(true);
    const res = await verifyPhysicalStudentService(mobileNumber, smartCardLast4);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.error || "Smart Card records could not be verified with this phone number.");
      setCardVerified(false);
    } else {
      setCardVerified(true);
      setPhysicalStudentId(res.physicalStudentId || null);
      setGlobalError(null);
    }
  };

  // Step 4: Verify Activation Code
  const handleVerifyActivationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!physicalStudentId) {
      setGlobalError("Smart Card not verified yet.");
      return;
    }

    if (activationCode.length !== 6) {
      setGlobalError("Enter 6-digit activation code / 6-ඉලක්කම් සක්‍රිය කිරීමේ කේතය ඇතුළත් කරන්න");
      return;
    }

    setLoading(true);
    const res = await verifyActivationCodeService(physicalStudentId, activationCode);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.error || "Invalid activation code.");
      setActivationVerified(false);
    } else {
      setActivationVerified(true);
      setGlobalError(null);
      setStep(5); // Advance to Paper Class option
    }
  };

  // Step 6: Final Registration Submission
  const handleFinalSubmit = async () => {
    setGlobalError(null);
    setLoading(true);

    const payload = {
      studentName,
      mobileNumber,
      whatsappNumber,
      parentName,
      gender,
      birthday,
      grade,
      schoolName,
      addressLine1,
      addressLine2,
      city,
      district,
      password,
      studentType,
      physicalStudentId: physicalStudentId || undefined,
      activationCode: activationCode || undefined,
      wantsPaperClass,
    };

    const res = await registerStudentService(payload);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.error || "Registration failed. Please review your details and try again.");
    } else {
      setRegisteredData({
        studentId: res.studentId || "STU-2026-NEW",
        email: res.email || `${mobileNumber}@scienceacademy.lk`,
      });
      setStep(7); // Registration Complete!
    }
  };

  const stepsList = [
    { num: 1, title: "Phone & OTP", sinhala: "දුරකථන අංකය" },
    { num: 2, title: "Student Info", sinhala: "ශිෂ්‍ය තොරතුරු" },
    { num: 3, title: "Class Mode", sinhala: "පන්ති මාදිලිය" },
    { num: 4, title: "Smart Card", sinhala: "කාඩ්පත් සත්‍යාපනය" },
    { num: 5, title: "Paper Class", sinhala: "පේපර් පන්තිය" },
    { num: 6, title: "Review", sinhala: "සමාලෝචනය" },
  ];

  return (
    <PublicShell>
      <div className="relative min-h-screen overflow-hidden py-10 px-4 sm:px-6 lg:px-8 text-ink">
        {/* Ambient Blobs matching Home Page */}
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-lavender-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-peach-200/35 blur-3xl" />
        <div className="pointer-events-none absolute left-1/3 bottom-10 h-80 w-80 rounded-full bg-[#FFB800]/10 blur-3xl" />


        <div className="relative z-10 mx-auto max-w-4xl">
          
          {/* Top Header & Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#002583]/15 bg-white/85 px-4 py-1.5 text-xs font-black text-[#002583] shadow-sm backdrop-blur-md">
              <Sparkles size={14} className="text-[#FFB800]" /> NEW STUDENT ADMISSIONS 2026
            </div>
            <h1 className="mt-3 font-sinhala text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#002583] drop-shadow-sm">
              Student Registration / <span className="text-[#FFB800]">ශිෂ්‍ය ලියාපදිංචිය</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-ink/75 max-w-2xl mx-auto font-medium">
              Grade 6 – 11 Science Theory, Revision &amp; Paper Classes by <strong>Kalhara Nakandala</strong>.
            </p>
            
            {/* Quick highlight tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
              <span className="rounded-full bg-white/85 border border-zinc-200/80 px-3 py-1 text-zinc-700 shadow-sm">
                📍 Sadarn - Bombuwela &amp; Zoom
              </span>
              <span className="rounded-full bg-white/85 border border-zinc-200/80 px-3 py-1 text-zinc-700 shadow-sm">
                ⚡ Instant LMS Access
              </span>
              <span className="rounded-full bg-white/85 border border-zinc-200/80 px-3 py-1 text-zinc-700 shadow-sm">
                📚 Sinhala &amp; English Medium
              </span>
            </div>
          </div>

          {/* Stepper Navigation Indicator (Steps 1 to 6) */}
          {step <= 6 && (
            <div className="mb-8 rounded-3xl border border-white/80 bg-white/75 p-5 backdrop-blur-xl shadow-card">
              {/* Stepper Circles */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                {stepsList.map((s) => {
                  const isCompleted = step > s.num;
                  const isCurrent = step === s.num;
                  return (
                    <div key={s.num} className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black transition-all shadow-sm ${
                          isCurrent
                            ? "bg-[#FFB800] text-[#002583] ring-4 ring-[#FFB800]/30 scale-105 shadow-md"
                            : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-zinc-100 text-zinc-400 border border-zinc-200/80"
                        }`}
                      >
                        {isCompleted ? <Check size={18} className="stroke-[3]" /> : s.num}
                      </div>
                      <span className={`mt-2 text-[11px] font-bold leading-tight ${isCurrent ? "text-[#002583]" : isCompleted ? "text-emerald-700" : "text-zinc-400"}`}>
                        {s.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 hidden sm:block">
                        {s.sinhala}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Line */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100 border border-zinc-200/50">
                <div 
                  className="h-full bg-gradient-to-r from-[#002583] via-[#003bb0] to-[#FFB800] transition-all duration-500 rounded-full"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Global Error Banner */}
          {globalError && (
            <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-800 flex items-start gap-3 shadow-sm backdrop-blur-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>{globalError}</div>
            </div>
          )}

          {/* MAIN CARD CONTAINER */}
          <div className="rounded-3xl border border-white/90 bg-white/80 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,37,131,0.07)] text-ink">
            
            {/* ─── STEP 1: PHONE + OTP ─────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200/80 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002583]/10 border border-[#002583]/20 px-3 py-1 text-xs font-black text-[#002583]">
                    STEP 01 OF 06
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[#002583]">
                    Mobile Number Verification / දුරකථන අංකය තහවුරු කිරීම
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-ink/70">
                    Enter the student name and primary mobile number. We will send an SMS OTP verification code.
                  </p>
                </div>

                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                      Student Full Name / ශිෂ්‍යයාගේ සම්පූර්ණ නම <span className="text-[#FFB800]">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                      <input
                        type="text"
                        disabled={otpSent}
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Kasun Chamara Perera"
                        className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3.5 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 disabled:bg-zinc-100 disabled:opacity-70 transition shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Mobile Number / දුරකථන අංකය <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type="tel"
                          disabled={otpSent}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                          placeholder="0771234567"
                          maxLength={10}
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3.5 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 disabled:bg-zinc-100 disabled:opacity-70 transition shadow-sm"
                          required
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-500 font-medium">10-digit mobile number (07X XXX XXXX)</p>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        WhatsApp Number / WhatsApp අංකය <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input
                          type="tel"
                          disabled={sameAsPhone || otpSent}
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                          placeholder="0771234567"
                          maxLength={10}
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3.5 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 disabled:bg-zinc-100 disabled:opacity-70 transition shadow-sm"
                        />
                      </div>
                      <label className="mt-2 flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          id="sameAsPhone"
                          checked={sameAsPhone}
                          onChange={(e) => setSameAsPhone(e.target.checked)}
                          disabled={otpSent}
                          className="h-4 w-4 rounded border-zinc-300 text-[#002583] focus:ring-[#002583]"
                        />
                        <span className="text-xs text-zinc-600 font-semibold">
                          Same as Mobile Number / දුරකථන අංකයම වේ
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* OTP INPUT CODE SECTION */}
                  {otpSent && (
                    <div className="pt-4 border-t border-zinc-200 space-y-4 animate-in fade-in duration-300">
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-3 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          SMS verification code successfully sent to <strong>{mobileNumber}</strong>. Please check your SMS inbox.
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                          Enter 6-Digit OTP Code / 6-ඉලක්කම් OTP කේතය ඇතුළත් කරන්න <span className="text-[#FFB800]">*</span>
                        </label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          maxLength={6}
                          placeholder="123456"
                          className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black py-4 bg-amber-50/50 border-2 border-[#FFB800] rounded-2xl text-[#002583] placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-[#FFB800]/25 shadow-inner"
                          required
                          autoFocus
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold pt-1">
                        <button
                          type="button"
                          disabled={otpTimer > 0 || loading}
                          onClick={handleSendOtp}
                          className="text-[#002583] hover:underline disabled:opacity-50 disabled:no-underline transition"
                        >
                          {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "🔄 Resend SMS Code"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                          }}
                          className="text-zinc-500 hover:text-zinc-800 hover:underline transition"
                        >
                          Change Mobile Number
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FFB800] text-[#002583] font-black rounded-2xl shadow-[0_8px_20px_rgba(255,184,0,0.35)] hover:shadow-[0_10px_25px_rgba(255,184,0,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : otpSent ? (
                      <>Verify OTP &amp; Continue / තහවුරු කර ඉදිරියට යන්න <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Get SMS Verification Code / OTP ලබාගන්න <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ─── STEP 2: PERSONAL & ACADEMIC DETAILS ───────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200/80 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002583]/10 border border-[#002583]/20 px-3 py-1 text-xs font-black text-[#002583]">
                    STEP 02 OF 06
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[#002583]">
                    Student &amp; Academic Details / පෞද්ගලික හා අධ්‍යාපනික තොරතුරු
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-ink/70">
                    Enter parent guardian details, current grade, school, address, and create your account password.
                  </p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Parent / Guardian Name / මව්පිය/භාරකරුගේ නම <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type="text"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          placeholder="e.g. Sunil Perera"
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Gender / ස්ත්‍රී-පුරුෂ භාවය <span className="text-[#FFB800]">*</span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                      >
                        <option value="Male">Male / පුරුෂ</option>
                        <option value="Female">Female / ස්ත්‍රී</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Birthday / උපන් දිනය <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type="date"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Grade / ශ්‍රේණිය <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                        >
                          <option value="Grade 6">Grade 6 Science (6 ශ්‍රේණිය)</option>
                          <option value="Grade 7">Grade 7 Science (7 ශ්‍රේණිය)</option>
                          <option value="Grade 8">Grade 8 Science (8 ශ්‍රේණිය)</option>
                          <option value="Grade 9">Grade 9 Science (9 ශ්‍රේණිය)</option>
                          <option value="Grade 10">Grade 10 Science (10 ශ්‍රේණිය)</option>
                          <option value="Grade 11">Grade 11 Science (11 ශ්‍රේණිය)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                      School Name / පාසලේ නම <span className="text-[#FFB800]">*</span>
                    </label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="e.g. Kalutara Vidyalaya"
                        className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* ADDRESS FIELDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Address Line 1 / ලිපිනය (පේළිය 1) <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type="text"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          placeholder="House No., Street"
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        City / නගරය <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Bombuwala / Kalutara"
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                      District / දිස්ත්‍රික්කය <span className="text-[#FFB800]">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                    >
                      {[
                        "Kalutara", "Colombo", "Gampaha", "Galle", "Matara", "Hambantota",
                        "Kandy", "Matale", "Nuwara Eliya", "Kurunegala", "Puttalam",
                        "Ratnapura", "Kegalle", "Anuradhapura", "Polonnaruwa", "Badulla",
                        "Moneragala", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya",
                        "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee"
                      ].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* PASSWORD CREATION */}
                  <div className="pt-4 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Create LMS Password / මුරපදය <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-11 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1.5">
                        Confirm Password / මුරපදය තහවුරු කරන්න <span className="text-[#FFB800]">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 transition shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-2xl transition border border-zinc-200 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3.5 bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FFB800] text-[#002583] font-black rounded-2xl shadow-[0_8px_20px_rgba(255,184,0,0.35)] hover:shadow-[0_10px_25px_rgba(255,184,0,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                    >
                      Continue to Class Selection <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ─── STEP 3: CLASS TYPE SELECTION ─────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200/80 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002583]/10 border border-[#002583]/20 px-3 py-1 text-xs font-black text-[#002583]">
                    STEP 03 OF 06
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[#002583]">
                    Choose Class Mode / පන්ති මාදිලිය තෝරන්න
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-ink/70">
                    Select whether you are attending Physical classes at Sadarn Center or purely Online via Zoom.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Physical + Online Option */}
                  <div
                    onClick={() => setStudentType("physical_online")}
                    className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      studentType === "physical_online"
                        ? "border-[#002583] bg-gradient-to-br from-blue-50/90 via-white to-amber-50/50 shadow-xl shadow-[#002583]/10 ring-4 ring-[#002583]/10 scale-[1.02]"
                        : "border-zinc-200/80 bg-white/70 hover:bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#002583] text-[#FFB800] rounded-2xl shadow-md font-black">
                        <School className="w-6 h-6" />
                      </div>
                      {studentType === "physical_online" && (
                        <span className="inline-flex items-center gap-1 bg-[#002583] text-white text-[11px] font-black px-3 py-1 rounded-full shadow">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB800]" /> Selected
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase">
                      Physical Hall + Online
                    </span>
                    <h3 className="font-black text-[#002583] text-lg mt-2 mb-1">
                      Physical + Online Student
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      Attend physical lectures at <strong>Sadarn Education Center (Bombuwela)</strong> with student Smart Card + Full LMS online portal access.
                    </p>
                  </div>

                  {/* Online Only Option */}
                  <div
                    onClick={() => setStudentType("online_only")}
                    className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      studentType === "online_only"
                        ? "border-[#002583] bg-gradient-to-br from-blue-50/90 via-white to-amber-50/50 shadow-xl shadow-[#002583]/10 ring-4 ring-[#002583]/10 scale-[1.02]"
                        : "border-zinc-200/80 bg-white/70 hover:bg-white hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-blue-100 text-[#002583] border border-blue-200 rounded-2xl shadow-md">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      {studentType === "online_only" && (
                        <span className="inline-flex items-center gap-1 bg-[#002583] text-white text-[11px] font-black px-3 py-1 rounded-full shadow">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB800]" /> Selected
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-black text-blue-800 uppercase">
                      Islandwide Online
                    </span>
                    <h3 className="font-black text-[#002583] text-lg mt-2 mb-1">
                      Online Student Only
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      Join from anywhere in Sri Lanka. Live Zoom classes, HD lesson video recordings, downloadable PDF tutes, and online quizzes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-2xl transition border border-zinc-200 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (studentType === "physical_online") {
                        setStep(4); // Physical verification
                      } else {
                        setStep(5); // Paper class option
                      }
                    }}
                    className="w-2/3 py-3.5 bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FFB800] text-[#002583] font-black rounded-2xl shadow-[0_8px_20px_rgba(255,184,0,0.35)] hover:shadow-[0_10px_25px_rgba(255,184,0,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 4: PHYSICAL STUDENT VERIFICATION ────────────────────── */}
            {step === 4 && studentType === "physical_online" && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200/80 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002583]/10 border border-[#002583]/20 px-3 py-1 text-xs font-black text-[#002583]">
                    STEP 04 OF 06
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[#002583]">
                    Physical Student Verification / භෞතික ශිෂ්‍ය තහවුරු කිරීම
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-ink/70">
                    Verify your Smart Card ID issued at the <strong>Sadarn Center (Bombuwela)</strong>.
                  </p>
                </div>

                {/* Part A: Smart Card Last 4 Digits */}
                <form onSubmit={handleVerifySmartCard} className="space-y-4">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1">
                    Smart Card Last 4 Digits / Smart Card අංකයේ අවසාන ඉලක්කම් 4 <span className="text-[#FFB800]">*</span>
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002583]" />
                      <input
                        type="text"
                        disabled={cardVerified}
                        value={smartCardLast4}
                        onChange={(e) => setSmartCardLast4(e.target.value.replace(/\D/g, ""))}
                        maxLength={4}
                        placeholder="9876"
                        className="w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-4 py-3.5 text-center font-mono text-xl font-bold tracking-widest text-zinc-900 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 disabled:bg-zinc-100 disabled:opacity-70 transition shadow-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={cardVerified || loading}
                      className="px-6 bg-[#FFB800] hover:bg-[#FFA000] text-[#002583] font-black text-xs rounded-2xl shadow-md shrink-0 disabled:bg-emerald-600 disabled:text-white transition"
                    >
                      {cardVerified ? "✓ Card Verified" : "Verify Card"}
                    </button>
                  </div>
                  {cardVerified && (
                    <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Smart Card matched with registered student hall records!
                    </div>
                  )}
                </form>

                {/* Part B: Physical Activation Code (only unlocked after Card Verified) */}
                {cardVerified && (
                  <form onSubmit={handleVerifyActivationCode} className="pt-4 border-t border-zinc-200 space-y-4 animate-in fade-in duration-200">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#002583] mb-1">
                      Physical Activation Code / භෞතික සක්‍රිය කිරීමේ කේතය (6-digits) <span className="text-[#FFB800]">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={activationVerified}
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      placeholder="654321"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 text-center font-mono text-xl font-bold tracking-widest text-zinc-900 focus:border-[#002583] focus:outline-none focus:ring-2 focus:ring-[#002583]/20 disabled:bg-zinc-100 disabled:opacity-70 transition shadow-sm"
                      required
                    />
                    
                    <button
                      type="submit"
                      disabled={activationVerified || loading}
                      className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg text-xs flex items-center justify-center gap-2 disabled:bg-emerald-600 disabled:from-emerald-600 disabled:to-emerald-600 transition"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : activationVerified ? (
                        "✓ Physical Student Verification Complete"
                      ) : (
                        "Verify Activation Code & Continue"
                      )}
                    </button>
                  </form>
                )}

                <div className="flex gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-2xl transition border border-zinc-200 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    disabled={!activationVerified}
                    onClick={() => setStep(5)}
                    className="w-2/3 py-3.5 bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FFB800] text-[#002583] font-black rounded-2xl shadow-[0_8px_20px_rgba(255,184,0,0.35)] hover:shadow-[0_10px_25px_rgba(255,184,0,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm transition-all disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 5: ONLINE PAPER CLASS SUBSCRIPTION ──────────────────── */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200/80 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002583]/10 border border-[#002583]/20 px-3 py-1 text-xs font-black text-[#002583]">
                    STEP 05 OF 06
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[#002583]">
                    Online Paper Class Add-on / ඔන්ලයින් පේපර් පන්තිය
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-ink/70">
                    Boost your exam rankings with weekly model papers, mark schemes, and video discussions.
                  </p>
                </div>

                <div className="rounded-3xl border border-[#FFB800]/40 bg-gradient-to-br from-[#002583] via-[#001d6e] to-[#001447] p-6 shadow-xl text-white space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFB800] px-3 py-0.5 text-[10px] font-black text-[#002583] uppercase tracking-wider">
                        <Sparkles size={11} /> OPTIONAL ADD-ON
                      </span>
                      <h3 className="text-xl font-black text-white mt-2">
                        Online Paper Class ({grade})
                      </h3>
                      <p className="text-xs text-blue-200/80 mt-1 max-w-md font-medium">
                        Access weekly timed mock exam papers, personalized mark reports, model answers, and step-by-step video discussions.
                      </p>
                    </div>
                    <div className="text-left sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <div className="text-2xl sm:text-3xl font-black text-[#FFB800]">
                        Rs. {paperClassFee.toLocaleString()}
                      </div>
                      <div className="text-xs text-blue-200/70 font-semibold">per month / මාසිකව</div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-white/10">
                    <label 
                      onClick={() => setWantsPaperClass(true)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                        wantsPaperClass === true
                          ? "border-[#FFB800] bg-white/20 shadow-lg"
                          : "border-white/15 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="wantsPaperClass"
                        checked={wantsPaperClass === true}
                        onChange={() => setWantsPaperClass(true)}
                        className="w-4 h-4 text-[#FFB800] focus:ring-[#FFB800]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">
                          Yes, subscribe to Online Paper Class (Rs. {paperClassFee.toLocaleString()}/mo)
                        </span>
                        <span className="text-[11px] text-blue-200/75">
                          Includes weekly model papers &amp; discussion access.
                        </span>
                      </div>
                    </label>

                    <label 
                      onClick={() => setWantsPaperClass(false)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                        wantsPaperClass === false
                          ? "border-[#FFB800] bg-white/20 shadow-lg"
                          : "border-white/15 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="wantsPaperClass"
                        checked={wantsPaperClass === false}
                        onChange={() => setWantsPaperClass(false)}
                        className="w-4 h-4 text-[#FFB800] focus:ring-[#FFB800]"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white/90 block">
                          No, skip Paper Class for now (Theory &amp; Revision only)
                        </span>
                        <span className="text-[11px] text-blue-200/75">
                          You can always add paper class later from your LMS student portal.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setStep(studentType === "physical_online" ? 4 : 3)}
                    className="w-1/3 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-2xl transition border border-zinc-200 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="w-2/3 py-3.5 bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FFB800] text-[#002583] font-black rounded-2xl shadow-[0_8px_20px_rgba(255,184,0,0.35)] hover:shadow-[0_10px_25px_rgba(255,184,0,0.45)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  >
                    Review Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 6: REVIEW & COMPLETE ────────────────────────────────── */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="border-b border-zinc-200/80 pb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#002583]/10 border border-[#002583]/20 px-3 py-1 text-xs font-black text-[#002583]">
                    STEP 06 OF 06
                  </span>
                  <h2 className="mt-2 text-2xl font-black text-[#002583]">
                    Review &amp; Finalize Registration / සමාලෝචනය
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-ink/70">
                    Double-check all entered information before submitting your registration.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-6 space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">Student Full Name</span>
                      <strong className="text-zinc-900 text-sm">{studentName}</strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">Mobile / Phone</span>
                      <strong className="text-zinc-900 text-sm">{mobileNumber}</strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">WhatsApp Number</span>
                      <strong className="text-zinc-900 text-sm">{whatsappNumber}</strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">Grade</span>
                      <strong className="text-[#002583] text-sm font-black">{grade}</strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">School</span>
                      <strong className="text-zinc-900 text-sm">{schoolName}</strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">District / City</span>
                      <strong className="text-zinc-900 text-sm">{city}, {district}</strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">Class Mode</span>
                      <strong className="text-zinc-900 text-sm">
                        {studentType === "physical_online" ? "Physical (Sadarn - Bombuwela) + Online" : "Online Only (Zoom)"}
                      </strong>
                    </div>
                    <div className="rounded-xl bg-white p-3.5 border border-zinc-200/80 shadow-sm">
                      <span className="text-zinc-500 block text-[11px] font-bold uppercase">Paper Class Add-on</span>
                      <strong className="text-zinc-900 text-sm">
                        {wantsPaperClass ? `Subscribed (Rs. ${paperClassFee.toLocaleString()}/mo)` : "Theory Only"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="w-1/3 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-2xl transition border border-zinc-200 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleFinalSubmit}
                    className="w-2/3 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Register Now / ලියාපදිංචි වන්න <CheckCircle2 className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 7: REGISTRATION COMPLETE SUCCESS SCREEN ─────────────── */}
            {step === 7 && registeredData && (
              <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 ring-8 ring-emerald-500/20">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800">
                    ADMISSION SUCCESSFUL
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#002583]">
                    Registration Complete! / ලියාපදිංචිය සාර්ථකයි!
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-600 max-w-md mx-auto font-medium">
                    Your student account has been created. Use your registered mobile number and password to log in.
                  </p>
                </div>

                {/* Digital Student Admission Pass Card */}
                <div className="mx-auto max-w-md rounded-3xl border border-[#FFB800]/40 bg-gradient-to-br from-[#002583] via-[#001d6e] to-[#001447] p-6 shadow-2xl text-left space-y-3 text-white">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFB800] text-[#002583] font-black">
                        <Atom size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white leading-none">Science Academy</p>
                        <p className="text-[10px] font-bold text-[#FFB800]">Kalhara Nakandala</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[#FFB800] px-2.5 py-0.5 text-[10px] font-black text-[#002583]">
                      STUDENT PASS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-blue-200/70 font-semibold">Student ID:</span>
                      <strong className="text-[#FFB800] font-mono text-sm font-black">{registeredData.studentId}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/70 font-semibold">Student Name:</span>
                      <strong className="text-white font-bold">{studentName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/70 font-semibold">Enrolled Grade:</span>
                      <strong className="text-white font-bold">{grade}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/70 font-semibold">Login Mobile:</span>
                      <strong className="text-white font-mono font-bold">{mobileNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200/70 font-semibold">Class Center:</span>
                      <strong className="text-white font-bold">
                        {studentType === "physical_online" ? "Sadarn - Bombuwela & Zoom" : "Zoom Online Only"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/student-login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFB800] via-[#FFA000] to-[#FFB800] text-[#002583] font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-xs sm:text-sm"
                  >
                    Go to Student LMS Login / ඇතුළු වන්න <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/94767589005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all text-xs sm:text-sm"
                  >
                    <FaWhatsapp className="h-4 w-4" /> WhatsApp Support
                  </a>
                </div>
              </div>
            )}

          </div>

          {/* Bottom link to Login */}
          <div className="text-center mt-8 text-xs text-zinc-600 font-medium">
            Already registered as a student?{" "}
            <Link href="/student-login" className="text-[#002583] font-black hover:underline ml-1">
              Sign In to LMS Portal
            </Link>
          </div>

        </div>
      </div>
    </PublicShell>
  );
}
