"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { 
  Users, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2
} from "lucide-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

interface PhysicalStudentInput {
  studentName: string;
  mobileNumber: string;
  smartCardNumber: string;
  grade: string;
  batch?: string;
}

export default function PhysicalStudentsAdminPage() {
  const [activeTab, setActiveTab] = useState<"single" | "csv">("single");

  // Single Student State
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [smartCardNumber, setSmartCardNumber] = useState("");
  const [grade, setGrade] = useState("Grade 10");
  const [batch, setBatch] = useState("2026 Batch");
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleSuccess, setSingleSuccess] = useState<any | null>(null);

  // CSV Import State
  const [csvText, setCsvText] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvResult, setCsvResult] = useState<any | null>(null);

  // Global Messages
  const [error, setError] = useState<string | null>(null);

  // Handle Single Creation
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSingleSuccess(null);

    if (!studentName.trim() || !mobileNumber.trim() || !smartCardNumber.trim()) {
      setError("Please fill all required physical student fields.");
      return;
    }

    setSingleLoading(true);
    try {
      const fn = httpsCallable(functions, "createPhysicalStudent");
      const res: any = await fn({
        studentName,
        mobileNumber,
        smartCardNumber,
        grade,
        batch,
      });

      if (res.data?.success) {
        setSingleSuccess(res.data);
        setStudentName("");
        setMobileNumber("");
        setSmartCardNumber("");
      }
    } catch (err: any) {
      console.error("createPhysicalStudent error:", err);
      setError(err.message || "Failed to create physical student record.");
    } finally {
      setSingleLoading(false);
    }
  };

  // Parse CSV and batch create
  const handleCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCsvResult(null);

    if (!csvText.trim()) {
      setError("Please paste valid CSV data.");
      return;
    }

    const lines = csvText.trim().split("\n");
    const records: PhysicalStudentInput[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || (i === 0 && line.toLowerCase().includes("name"))) continue; // skip header

      const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (cols.length >= 4) {
        records.push({
          studentName: cols[0],
          mobileNumber: cols[1],
          smartCardNumber: cols[2],
          grade: cols[3],
          batch: cols[4] || "Default Batch",
        });
      }
    }

    if (records.length === 0) {
      setError("No valid CSV rows parsed. Format: Student Name, Mobile Number, Smart Card Number, Grade, Batch");
      return;
    }

    setCsvLoading(true);
    try {
      const fn = httpsCallable(functions, "batchCreatePhysicalStudents");
      const res: any = await fn({ records });

      if (res.data?.success) {
        setCsvResult(res.data);
        setCsvText("");
      }
    } catch (err: any) {
      console.error("batchCreatePhysicalStudents error:", err);
      setError(err.message || "Failed to process CSV batch import.");
    } finally {
      setCsvLoading(false);
    }
  };

  return (
    <DashboardShell role="teacher" active="Physical Cards">
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Physical Students Management & CSV Import
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Pre-register physical hall students, issue Smart Cards, and generate activation codes for account linking.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "single"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            + Single Entry
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "csv"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 inline mr-1" />
            CSV Batch Import
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* TAB 1: SINGLE PHYSICAL STUDENT CREATION */}
      {activeTab === "single" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900">
            Create Physical Student Card Record
          </h2>

          {singleSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm space-y-1">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Physical Student Created Successfully!
              </div>
              <div>Smart Card Last 4: <strong className="font-mono text-indigo-700">{singleSuccess.smartCardLast4}</strong></div>
              <div>Activation Code: <strong className="font-mono text-purple-700 text-base">{singleSuccess.activationCode}</strong></div>
              <p className="text-xs text-emerald-700 mt-1">
                Give this 6-digit Activation Code and Smart Card to the physical student to complete online self-registration.
              </p>
            </div>
          )}

          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ruwan Silva"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Registered Mobile Number *
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="0771234567"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Smart Card Full Number *
                </label>
                <input
                  type="text"
                  value={smartCardNumber}
                  onChange={(e) => setSmartCardNumber(e.target.value)}
                  placeholder="SC-2026-9876"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Grade *
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Batch / Hall Class
                </label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="2026 Nugegoda Batch"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={singleLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 text-sm transition-all"
            >
              {singleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Physical Student & Generate Activation Code"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: CSV BATCH IMPORT */}
      {activeTab === "csv" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              CSV Batch Import Physical Students
            </h2>
            <span className="text-xs text-slate-500">
              Format: <code>Student Name, Mobile Number, Smart Card Number, Grade, Batch</code>
            </span>
          </div>

          {csvResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
              <div className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {csvResult.message}
              </div>
            </div>
          )}

          <form onSubmit={handleCsvSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Paste CSV Content Below
              </label>
              <textarea
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`Student Name, Mobile Number, Smart Card Number, Grade, Batch
Kasun Perera, 0771234567, SC-1001, Grade 10, Nugegoda
Nimal Siri, 0719876543, SC-1002, Grade 11, Maharagama`}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={csvLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 text-sm transition-all"
            >
              {csvLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Process CSV Batch Import"}
            </button>
          </form>
        </div>
      )}

    </div>
    </DashboardShell>
  );
}
