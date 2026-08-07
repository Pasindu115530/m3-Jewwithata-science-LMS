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
  User, 
  Users, 
  GraduationCap, 
  School, 
  MapPin, 
  Lock, 
  CreditCard, 
  Sparkles, 
  Check, 
  X,
  FileText
} from "lucide-react";
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
  const [district, setDistrict] = useState("Colombo");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // STEP 3: Class Type State
  const [studentType, setStudentType] = useState<"online_only" | "physical_online">("online_only");

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
      setGlobalError("Please enter student name / කරුණාකර ශිෂ්‍යයාගේ නම ඇතුළත් කරන්න");
      return;
    }
    if (!/^07[0-9]{8}$/.test(mobileNumber)) {
      setGlobalError("Enter a valid 10-digit Sri Lankan phone number (e.g. 0771234567)");
      return;
    }

    setLoading(true);
    const res = await sendRegistrationOtpService(mobileNumber);
    setLoading(false);

    if (!res.success) {
      setGlobalError(res.error || "Failed to send OTP.");
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
      setGlobalError(res.error || "Invalid OTP code.");
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
      setGlobalError("Please fill in all required fields / කරුණාකර සියලුම අනිවාර්ය ක්ෂේත්‍ර පුරවන්න");
      return;
    }

    if (password.length < 6) {
      setGlobalError("Password must be at least 6 characters / මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය");
      return;
    }

    if (password !== confirmPassword) {
      setGlobalError("Passwords do not match / මුරපද ගැලපෙන්නේ නැත");
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
      setGlobalError(res.error || "Smart Card mismatch.");
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
      setGlobalError(res.error || "Registration failed. Please try again.");
    } else {
      setRegisteredData({
        studentId: res.studentId || "STU-NEW",
        email: res.email || "",
      });
      setStep(7); // Registration Complete!
    }
  };

  return (
    <PublicShell>
      <div className="min-h-screen py-10 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          
          {/* Header Branding */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Student Registration / ශිෂ්‍ය ලියාපදිංචිය
            </h1>
            <p className="text-slate-600 text-sm">
              Science LMS — Step-by-Step Account Creation
            </p>
          </div>

          {/* Stepper Navigation Indicator (Steps 1 to 6) */}
          {step <= 6 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>Step {step} of 6</span>
                <span>
                  {step === 1 && "Mobile Verification / දුරකථන තහවුරු කිරීම"}
                  {step === 2 && "Personal Details / පෞද්ගලික තොරතුරු"}
                  {step === 3 && "Class Type / පන්ති වර්ගය"}
                  {step === 4 && "Physical Verification / භෞතික පන්ති තහවුරු කිරීම"}
                  {step === 5 && "Online Paper Class / ඔන්ලයින් පේපර් පන්තිය"}
                  {step === 6 && "Review & Complete / සමාලෝචනය"}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Global Error Banner */}
          {globalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{globalError}</div>
            </div>
          )}

          {/* MAIN CARD CONTAINER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100">
            
            {/* ─── STEP 1: PHONE + OTP ─────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Step 1: Mobile Verification / දුරකථන අංකය තහවුරු කිරීම
                  </h2>
                  <p className="text-sm text-slate-500">
                    We will send an SMS verification code to your mobile number.
                  </p>
                </div>

                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Student Full Name / ශිෂ්‍යයාගේ සම්පූර්ණ නම *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        disabled={otpSent}
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Kasun Perera"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Mobile Number / දුරකථන අංකය *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          disabled={otpSent}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="0771234567"
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        WhatsApp Number / WhatsApp අංකය *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          disabled={sameAsPhone || otpSent}
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="0771234567"
                          maxLength={10}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
                        />
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sameAsPhone"
                          checked={sameAsPhone}
                          onChange={(e) => setSameAsPhone(e.target.checked)}
                          disabled={otpSent}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="sameAsPhone" className="text-xs text-slate-600">
                          Same as Mobile Number / දුරකථන අංකයම වේ
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* OTP INPUT CODE SECTION */}
                  {otpSent && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Verification code sent to <strong>{mobileNumber}</strong></span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                          Enter 6-Digit OTP Code / OTP කේතය ඇතුළත් කරන්න *
                        </label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          maxLength={6}
                          placeholder="123456"
                          className="w-full text-center tracking-widest font-mono text-xl py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          disabled={otpTimer > 0 || loading}
                          onClick={handleSendOtp}
                          className="text-indigo-600 font-semibold hover:underline disabled:opacity-50"
                        >
                          {otpTimer > 0 ? `Resend Code in ${otpTimer}s` : "Resend OTP Code"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtpCode("");
                          }}
                          className="text-slate-500 hover:underline"
                        >
                          Change Number
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : otpSent ? (
                      <>Verify Code & Continue / තහවුරු කර ඉදිරියට යන්න <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Get Verification Code / OTP ලබාගන්න <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ─── STEP 2: PERSONAL & ACADEMIC DETAILS ───────────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Step 2: Student Details / ශිෂ්‍ය තොරතුරු
                  </h2>
                  <p className="text-sm text-slate-500">
                    Fill in your personal, guardian, address, and login password details.
                  </p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. S. Perera"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Gender / ස්ත්‍රී-පුරුෂ භාවය *
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Male">Male / පුරුෂ</option>
                        <option value="Female">Female / ස්ත්‍රී</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Birthday / උපන් දිනය *
                      </label>
                      <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Grade / ශ්‍රේණිය *
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="A/L Science">A/L Science</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      School Name / පාසලේ නම *
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Royal College Colombo"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* ADDRESS FIELDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Address Line 1 / ලිපිනය (පේළිය 1) *
                      </label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="House No., Street"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        City / නගරය *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Nugegoda"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      District / දිස්ත්‍රික්කය *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", "Kegalle"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* PASSWORD CREATION */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Password / මුරපදය *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Confirm Password / මුරපදය තහවුරු කරන්න *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
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
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Step 3: Choose Class Type / පන්ති මාදිලිය තෝරන්න
                  </h2>
                  <p className="text-sm text-slate-500">
                    Select whether you are attending purely Online or both Physical + Online.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Online Only Option */}
                  <div
                    onClick={() => setStudentType("online_only")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      studentType === "online_only"
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      {studentType === "online_only" && (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      Online Student Only
                    </h3>
                    <p className="text-xs text-slate-600">
                      ඔන්ලයින් පන්තිය පමණි — Live Zoom classes, recordings, online tutes & quizzes.
                    </p>
                  </div>

                  {/* Physical + Online Option */}
                  <div
                    onClick={() => setStudentType("physical_online")}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      studentType === "physical_online"
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                        <School className="w-6 h-6" />
                      </div>
                      {studentType === "physical_online" && (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">
                      Physical + Online Student
                    </h3>
                    <p className="text-xs text-slate-600">
                      භෞතික + ඔන්ලයින් — Physical hall student with Smart Card credentials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (studentType === "physical_online") {
                        setStep(4); // Go to physical verification
                      } else {
                        setStep(5); // Skip physical verification -> go to paper class option
                      }
                    }}
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 4: PHYSICAL STUDENT VERIFICATION ────────────────────── */}
            {step === 4 && studentType === "physical_online" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Step 4: Physical Student Verification / භෞතික ශිෂ්‍ය තහවුරු කිරීම
                  </h2>
                  <p className="text-sm text-slate-500">
                    Verify your Smart Card and Activation Code issued at physical class hall.
                  </p>
                </div>

                {/* Part A: Smart Card Last 4 Digits */}
                <form onSubmit={handleVerifySmartCard} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 uppercase">
                    Smart Card Last 4 Digits / Smart Card අංකයේ අවසාන ඉලක්කම් 4 *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={cardVerified}
                      value={smartCardLast4}
                      onChange={(e) => setSmartCardLast4(e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      placeholder="9876"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-lg tracking-widest focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                      required
                    />
                    <button
                      type="submit"
                      disabled={cardVerified || loading}
                      className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow shrink-0 disabled:bg-emerald-600"
                    >
                      {cardVerified ? "✓ Card Verified" : "Verify Card"}
                    </button>
                  </div>
                  {cardVerified && (
                    <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Smart Card matched with registered physical student record!
                    </div>
                  )}
                </form>

                {/* Part B: Physical Activation Code (only unlocked after Card Verified) */}
                {cardVerified && (
                  <form onSubmit={handleVerifyActivationCode} className="pt-4 border-t border-slate-100 space-y-3">
                    <label className="block text-xs font-semibold text-slate-700 uppercase">
                      Physical Activation Code / භෞතික සක්‍රිය කිරීමේ කේතය (6-digits) *
                    </label>
                    <input
                      type="text"
                      disabled={activationVerified}
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ""))}
                      maxLength={6}
                      placeholder="654321"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-xl tracking-widest focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
                      required
                    />
                    
                    <button
                      type="submit"
                      disabled={activationVerified || loading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow text-xs flex items-center justify-center gap-2 disabled:bg-emerald-600"
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

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!activationVerified}
                    onClick={() => setStep(5)}
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 5: ONLINE PAPER CLASS SUBSCRIPTION ──────────────────── */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Step 5: Online Paper Class Add-on / ඔන්ලයින් පේපර් පන්තිය
                  </h2>
                  <p className="text-sm text-slate-500">
                    Optionally subscribe to the Online Paper Class with weekly model papers and discussions.
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">
                        Optional Add-on
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">
                        Online Paper Class ({grade})
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Access weekly timed mock exams, answer scheme discussions, and individual performance reports.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-indigo-700">
                        Rs. {paperClassFee}
                      </div>
                      <div className="text-[11px] text-slate-500">per month</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-indigo-100">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-200 cursor-pointer hover:border-indigo-400">
                      <input
                        type="radio"
                        name="wantsPaperClass"
                        checked={wantsPaperClass === true}
                        onChange={() => setWantsPaperClass(true)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-900">
                        Yes, I want to subscribe to Online Paper Class (Rs. {paperClassFee})
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                      <input
                        type="radio"
                        name="wantsPaperClass"
                        checked={wantsPaperClass === false}
                        onChange={() => setWantsPaperClass(false)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        No, skip Paper Class for now (Theory only)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(studentType === "physical_online" ? 4 : 3)}
                    className="w-1/3 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
                  >
                    Review Details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 6: REVIEW & COMPLETE ────────────────────────────────── */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Step 6: Review & Finalize Registration / සමාලෝචනය
                  </h2>
                  <p className="text-sm text-slate-500">
                    Double-check all entered information before submitting your registration.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs text-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div><strong className="text-slate-900">Student Name:</strong> {studentName}</div>
                    <div><strong className="text-slate-900">Mobile:</strong> {mobileNumber}</div>
                    <div><strong className="text-slate-900">WhatsApp:</strong> {whatsappNumber}</div>
                    <div><strong className="text-slate-900">Grade:</strong> {grade}</div>
                    <div><strong className="text-slate-900">School:</strong> {schoolName}</div>
                    <div><strong className="text-slate-900">District:</strong> {district}</div>
                    <div><strong className="text-slate-900">Class Mode:</strong> {studentType === "physical_online" ? "Physical + Online" : "Online Only"}</div>
                    <div><strong className="text-slate-900">Paper Class:</strong> {wantsPaperClass ? `Yes (Rs. ${paperClassFee})` : "No"}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="w-1/3 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleFinalSubmit}
                    className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Register Now / ලියාපදිංචි වන්න <CheckCircle2 className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 7: REGISTRATION COMPLETE SUCCESS SCREEN ─────────────── */}
            {step === 7 && registeredData && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Registration Complete! / ලියාපදිංචිය සාර්ථකයි!
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Your student account has been generated successfully.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Student ID:</span>
                    <strong className="text-indigo-700 font-mono text-sm">{registeredData.studentId}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Username/Email:</span>
                    <strong className="text-slate-800">{registeredData.email}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Registered Mobile:</span>
                    <strong className="text-slate-800">{mobileNumber}</strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Class Mode:</span>
                    <strong className="text-slate-800">{studentType === "physical_online" ? "Physical + Online" : "Online Only"}</strong>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/student-login"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 text-sm transition-all"
                  >
                    Go to Student Sign In / ඇතුළු වන්න <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Bottom link to Login */}
          <div className="text-center mt-6 text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/student-login" className="text-indigo-600 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>
    </PublicShell>
  );
}
