"use client";

import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db, app } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { TeacherGuard } from "@/components/teacher-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  Users, 
  Loader2, 
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search
} from "lucide-react";

export interface LiveClassItem {
  id: string;
  topic: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  startTime: string;
  durationMinutes: number;
  status: "scheduled" | "active" | "completed";
  attendanceProcessed: boolean;
  stats?: {
    totalEnrolled: number;
    present: number;
    late: number;
    absent: number;
  };
}

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  customStudentId?: string;
  studentName: string;
  email?: string;
  status: "present" | "late" | "absent";
  joinTime?: string | null;
  leaveTime?: string | null;
  durationSeconds: number;
  attendancePercentage: number;
}

export default function TeacherAttendancePage() {
  const [completedClasses, setCompletedClasses] = useState<LiveClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendanceRecord[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const functions = getFunctions(app);

  // Fetch completed live classes
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const snap = await getDocs(collection(db, "liveClasses"));
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as LiveClassItem[];

      items.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setCompletedClasses(items);

      if (items.length > 0 && !selectedClassId) {
        setSelectedClassId(items[0].id);
      }
    } catch (err) {
      console.error("Error fetching live classes for attendance:", err);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Fetch attendance records for selected meeting
  const fetchAttendanceRecords = async (classItem: LiveClassItem) => {
    setLoadingAttendance(true);
    try {
      const collKey = `${classItem.courseId}_${classItem.id}`;
      const snap = await getDocs(collection(db, "attendance", collKey, "students"));
      const records = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as StudentAttendanceRecord[];

      setAttendanceRecords(records);
    } catch (err) {
      console.error("Error loading attendance records:", err);
      setAttendanceRecords([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const selected = completedClasses.find((c) => c.id === selectedClassId);
      if (selected) {
        fetchAttendanceRecords(selected);
      }
    }
  }, [selectedClassId]);

  const handleSyncAttendance = async () => {
    if (!selectedClassId) return;
    setProcessing(true);
    try {
      const processAttFn = httpsCallable(functions, "processAttendance");
      await processAttFn({ classId: selectedClassId });
      alert("Attendance recalculated successfully!");
      const selected = completedClasses.find((c) => c.id === selectedClassId);
      if (selected) {
        await fetchAttendanceRecords(selected);
      }
      await fetchClasses();
    } catch (err: any) {
      console.error("Error syncing attendance:", err);
      alert(err.message || "Failed to sync attendance.");
    } finally {
      setProcessing(false);
    }
  };

  // CSV Export logic
  const handleExportCSV = () => {
    const selected = completedClasses.find((c) => c.id === selectedClassId);
    if (!selected || attendanceRecords.length === 0) return;

    const headers = ["Student ID", "Student Name", "Email", "Status", "Join Time", "Leave Time", "Duration (Mins)", "Attendance %"];
    const rows = attendanceRecords.map((r) => [
      r.customStudentId || r.studentId || "-",
      `"${r.studentName || 'Student'}"`,
      r.email || "-",
      r.status.toUpperCase(),
      r.joinTime ? new Date(r.joinTime).toLocaleTimeString() : "-",
      r.leaveTime ? new Date(r.leaveTime).toLocaleTimeString() : "-",
      Math.round(r.durationSeconds / 60),
      `${r.attendancePercentage}%`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_${selected.grade}_${selected.topic.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedClass = completedClasses.find((c) => c.id === selectedClassId);

  // Stats calculation
  const totalEnrolled = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
  const avgAttendancePct = totalEnrolled > 0
    ? Math.round(attendanceRecords.reduce((acc, r) => acc + r.attendancePercentage, 0) / totalEnrolled)
    : 0;

  const filteredRecords = attendanceRecords.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      (r.studentName && r.studentName.toLowerCase().includes(q)) ||
      (r.customStudentId && r.customStudentId.toLowerCase().includes(q)) ||
      (r.status && r.status.toLowerCase().includes(q))
    );
  });

  return (
    <TeacherGuard>
      <DashboardShell role="teacher" active="Attendance">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
              Teacher Portal
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">Automated Attendance</h1>
            <p className="mt-2 text-ink/55">
              View automatic Zoom meeting attendance reports and export student participation records.
            </p>
          </div>

          {selectedClass && attendanceRecords.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncAttendance}
                disabled={processing}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-2.5 text-xs font-black text-ink/80 hover:bg-ink/5 transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                {processing ? <Loader2 className="h-4 w-4 animate-spin text-lavender-600" /> : <RefreshCw size={15} />}
                Recalculate
              </button>
              <button
                onClick={handleExportCSV}
                className="gradient-button px-5 py-2.5 text-xs shadow-md shrink-0 cursor-pointer flex items-center gap-2"
              >
                <Download size={15} /> Export CSV
              </button>
            </div>
          )}
        </div>

        {loadingClasses ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading live classes...</p>
          </div>
        ) : completedClasses.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              emoji="📊"
              title="No Attendance Data Available"
              description="Attendance records will appear here automatically once a scheduled Zoom live class ends."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* Meeting Selector */}
            <Card className="p-6 bg-white/90">
              <label className="block text-xs font-black uppercase tracking-wider text-ink/60 mb-2">
                Select Live Class Session
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="pastel-input w-full font-bold text-sm"
              >
                {completedClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.grade}] {c.topic} — {new Date(c.startTime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </Card>

            {/* Summary Stats Grid */}
            {selectedClass && (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                <Card className="p-5 bg-white">
                  <p className="text-xs font-extrabold uppercase text-ink/50">Total Enrolled</p>
                  <p className="mt-2 text-3xl font-black text-ink">{totalEnrolled}</p>
                </Card>
                <Card className="p-5 bg-emerald-50/60 border-emerald-100">
                  <p className="text-xs font-extrabold uppercase text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Present (≥80%)
                  </p>
                  <p className="mt-2 text-3xl font-black text-emerald-800">{presentCount}</p>
                </Card>
                <Card className="p-5 bg-amber-50/60 border-amber-100">
                  <p className="text-xs font-extrabold uppercase text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Late Joined
                  </p>
                  <p className="mt-2 text-3xl font-black text-amber-800">{lateCount}</p>
                </Card>
                <Card className="p-5 bg-rose-50/60 border-rose-100">
                  <p className="text-xs font-extrabold uppercase text-rose-700 flex items-center gap-1.5">
                    <XCircle size={14} /> Absent
                  </p>
                  <p className="mt-2 text-3xl font-black text-rose-800">{absentCount}</p>
                </Card>
                <Card className="p-5 bg-purple-50/60 border-purple-100 col-span-2 lg:col-span-1">
                  <p className="text-xs font-extrabold uppercase text-purple-700">Average Attn %</p>
                  <p className="mt-2 text-3xl font-black text-purple-800">{avgAttendancePct}%</p>
                </Card>
              </div>
            )}

            {/* Attendance Table */}
            <Card className="p-6 bg-white/90">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-black text-ink">Student Attendance List</h3>

                <div className="relative w-full sm:w-64">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="text"
                    placeholder="Search student or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pastel-input w-full pl-9 py-2 text-xs"
                  />
                </div>
              </div>

              {loadingAttendance ? (
                <div className="flex flex-col items-center justify-center p-12 text-ink/50">
                  <Loader2 className="h-7 w-7 animate-spin text-lavender-600" />
                  <p className="mt-3 text-xs font-bold">Loading student records...</p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-ink/50">
                  No attendance records found for this class. Click "Recalculate" to fetch from Zoom API.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bold text-ink/80">
                    <thead>
                      <tr className="border-b border-ink/10 text-ink/50 uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pl-2">Student ID</th>
                        <th className="pb-3">Student Name</th>
                        <th className="pb-3">Join Time</th>
                        <th className="pb-3">Leave Time</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Attendance %</th>
                        <th className="pb-3 pr-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredRecords.map((r) => {
                        const durationMins = Math.round(r.durationSeconds / 60);

                        return (
                          <tr key={r.id} className="hover:bg-lavender-50/40 transition">
                            <td className="py-3.5 pl-2 font-mono text-lavender-700">
                              {r.customStudentId || r.studentId.substring(0, 8)}
                            </td>
                            <td className="py-3.5 font-extrabold text-ink">{r.studentName}</td>
                            <td className="py-3.5 text-ink/60">
                              {r.joinTime ? new Date(r.joinTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                            </td>
                            <td className="py-3.5 text-ink/60">
                              {r.leaveTime ? new Date(r.leaveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                            </td>
                            <td className="py-3.5">{durationMins} mins</td>
                            <td className="py-3.5 font-extrabold">{r.attendancePercentage}%</td>
                            <td className="py-3.5 pr-2">
                              {r.status === "present" && <Badge tone="green">Present</Badge>}
                              {r.status === "late" && <Badge tone="lavender">Late</Badge>}
                              {r.status === "absent" && <Badge tone="pink">Absent</Badge>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </DashboardShell>
    </TeacherGuard>
  );
}
